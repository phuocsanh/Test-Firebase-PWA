/**
 * Utils functions
 */

import { Payload } from '@/services';
import { AuthenticatedUser, FieldColumn } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { match } from 'path-to-regexp';
import { twMerge } from 'tailwind-merge';
import { getLocalStorage } from './localStorage';
import { capitalizeFirstLetter } from './text';
import dayjs from 'dayjs';

// export const isIosPwa = (): boolean => {
//   const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in (window as any));
//   const isStandalone = (navigator as any).standalone;
//   return isIos && Boolean(isStandalone);
// };

export const getUserIds = (ids: (number | undefined | null)[]) => {
  const listId = ids.filter((x): x is number => typeof x === 'number' && x !== 0);
  return [...new Set(listId)];
};
export const formatTime = (time: Date): string => {
  if (!time) return '';
  const now = dayjs();
  const givenTime = dayjs(time);
  const diffMinutes = now.diff(givenTime, 'minute');

  if (diffMinutes < 60) {
    return `${diffMinutes} phút trước`;
  } else if (diffMinutes < 1440) {
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours} tiếng trước`;
  } else {
    return givenTime.format('DD/MM/YYYY HH:mm');
  }
};
export const getFirstDayOfYear = (year: number) => new Date(year, 0, 1);

export const getLastDayOfYear = (year: number) => new Date(year, 11, 31);

export const regexCode = /^[A-Za-z0-9_]+$/;

/**
 *
 * @param value
 * @returns
 */
export const parseJson = <T>(value: string) => {
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    return value;
  }
};

/**
 *
 * @param inputs
 * @returns
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 *
 * @param list
 * @param key
 * @returns
 */
export const hash = <T>(list: T[], key = 'id'): { [key: string | number]: T } | null => {
  if (!list.length) return null;

  return list.reduce((result, item) => {
    return { ...result, [item[key as keyof T] as number | string]: item };
  }, {});
};

/**
 * Constructs a local storage key with an optional prefix based on the host and user information.
 *
 * @param {string} key - The base key.
 * @param {boolean} hasUserPrefix - Indicates whether to include user information in the prefix.
 * @returns {string} The constructed local storage key.
 */
export const getLocalKeyWithPrefix = (key: string, hasUserPrefix: boolean = false): string => {
  // Hostname obtained from the window location. An empty string if not available.
  const host = window?.location.hostname || '';

  if (hasUserPrefix) {
    // Authenticated user retrieved from local storage based on the host.
    const user = getLocalStorage<AuthenticatedUser>(`${host}_user`) as AuthenticatedUser | null;
    // User-specific part of the key if a user is available, otherwise an empty string.
    const userPart = user ? `_${user.userName}` : '';
    // Construct and return the key with user prefix.
    return `${host}${userPart}_${key}`;
  }

  // Construct and return the key without user prefix.
  return `${host}_${key}`;
};

/**
 *
 * @param eventTarget
 * @returns
 */
export const atBottom = (eventTarget: HTMLElement) => {
  const { scrollHeight, scrollTop, offsetHeight } = eventTarget;
  if (offsetHeight === 0) {
    return true;
  }

  return Math.round(scrollTop) === Math.round(scrollHeight - offsetHeight);
};

/**
 *
 * @param records
 * @param field
 * @returns
 */
export const getDistinctRecords = <T, K extends keyof T>(
  records: T[],
  field: K = 'id' as K
): T[] => {
  const uniqueRecordsMap = new Map<T[K], T>();

  for (const record of records) {
    const fieldValue = record[field];
    if (!uniqueRecordsMap.has(fieldValue)) {
      uniqueRecordsMap.set(fieldValue, record);
    }
  }

  return Array.from(uniqueRecordsMap.values());
};

/**
 *
 * @param object
 * @returns
 */
export const isEmptyObject = (object: object | undefined) => {
  return object !== undefined && Object.keys(object).length === 0;
};

/**
 *
 * @param list
 * @param sortField
 * @param type
 * @returns
 */
export const sortList = <T>(list: T[], sortField: keyof T, type: 'asc' | 'desc' = 'asc') => {
  return list.sort((objectA, objectB) => {
    if (typeof objectA[sortField] === 'string' && typeof objectB[sortField] === 'string') {
      return type === 'asc'
        ? objectA[sortField] > objectB[sortField]
          ? 1
          : objectB[sortField] > objectA[sortField]
            ? -1
            : 0
        : objectA[sortField] < objectB[sortField]
          ? 1
          : objectB[sortField] < objectA[sortField]
            ? -1
            : 0;
    }
    return type === 'asc'
      ? Number(objectA[sortField]) - Number(objectB[sortField])
      : Number(objectB[sortField]) - Number(objectA[sortField]);
  });
};

/**
 *
 * @param list
 * @param key
 * @param type
 * @returns
 */
export const getMinMaxElement = <T>(list: T[], key: keyof T, type: 'min' | 'max' = 'min') => {
  return list.reduce((prev, current) => {
    if (type === 'min') {
      return prev[key] < current[key] ? prev : current;
    } else {
      return prev[key] > current[key] ? prev : current;
    }
  });
};

/**
 *
 * @param list
 * @param key
 * @returns
 */
export const groupArrayByKey = <T, K extends keyof T>(
  list: T[],
  key: K
): Record<string | number, T[]> => {
  return list.reduce(
    (groupedObj, item) => {
      const keyValue = item[key] as string | number;
      groupedObj[keyValue] = [...(groupedObj[keyValue] || []), item];
      return groupedObj;
    },
    {} as Record<string | number, T[]>
  );
};

/**
 *
 * @param array
 * @param fromIndex
 * @param toIndex
 * @returns
 */
export const moveElement = <T>(array: T[], fromIndex: number, toIndex: number) => {
  const arrayCopy = [...array];
  const element = arrayCopy.splice(fromIndex, 1)[0];
  arrayCopy.splice(toIndex, 0, element);

  return arrayCopy;
};

export const flatten = <T>(arr?: Array<T>, key?: keyof T): T[] | undefined => {
  // If no array or an empty array is provided, return undefined
  if (!arr || arr.length === 0 || !key) return undefined;

  const result: T[] = [];

  for (const item of arr) {
    // Copy the item to result array
    result.push({ ...item });

    // Check if the key exists and the value is an array
    if (Array.isArray(item[key])) {
      // Recursive flatten call with type casting
      const nestedArray = item[key] as unknown as T[];
      const flattenedNestedArray = flatten(nestedArray, key);

      // Concat the flattened nested array to the result
      if (flattenedNestedArray) {
        result.push(...flattenedNestedArray);
      }
    }
  }

  return result;
};

export const callbackWithTimeout = (callback: () => Promise<unknown>, ms = 0) => {
  const timeout = setTimeout(() => {
    callback().catch(error => console.error('error:', error));
    clearTimeout(timeout);
  }, ms);
};

export const getSumsFromArray = <T>(list: T[], fields: (keyof T)[]) => {
  const fieldLength = fields.length;
  if (fieldLength === 0) {
    return [];
  }

  const init = Array<number>(fieldLength).fill(0);

  return list.reduce((sum, item) => {
    for (let i = 0; i < fieldLength; i++) {
      const value = item[fields[i]];
      if (typeof value === 'number') {
        sum[i] += Number(value);
      }
    }
    return sum;
  }, init);
};

/**
 * Creates a FieldColumn object for a date range filter.
 *
 * @param field - The field name.
 * @param from - The start date of the range.
 * @param to - The end date of the range.
 * @returns A FieldColumn object for the date range.
 */
export const createFilterDateColumn = (field: string, from: Date, to: Date): FieldColumn => {
  return {
    column: capitalizeFirstLetter(field),
    keySearch: `${format(from, 'yyyyMMdd')}-${format(to, 'yyyyMMdd')}`,
    expression: 'BETWEEN',
  };
};

export const displayExpr =
  <T>(showFields: (keyof T)[]) =>
  (item: T) => {
    return showFields
      .map(field => item?.[field])
      .filter(i => !!i)
      .join(' - ');
  };

export const getInitialFilterRangeDate = () => {
  const date = new Date();
  return [new Date(date.getFullYear(), date.getMonth(), 1), date];
};

// export const exportToWord = function (content: string) {
//   const preHtml = `
//   <html xmlns:o="urn:schemas-microsoft-com:office:office"
//         xmlns:w="urn:schemas-microsoft-com:office:word"
//         xmlns="http://www.w3.org/TR/REC-html40">
//   <head>
//     <meta charset="utf-8">
//     <title>Document</title>
//   </head>
//   <body>
//   `;

//   const postHtml = '</body></html>';
//   // const content = "<h1>Hello, World!</h1>"; // Nội dung bạn muốn xuất ra
//   const html = preHtml + content + postHtml;

//   // const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
//   const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);

//   // const filename = filename ? filename + '.doc' : 'document.doc';
//   const filename = 'document.doc';

//   const downloadLink = document.createElement('a');
//   document.body.appendChild(downloadLink);

//   // if (navigator.msSaveOrOpenBlob) {
//   //   navigator.msSaveOrOpenBlob(blob, filename);
//   // } else {
//   downloadLink.href = url;
//   downloadLink.download = filename;
//   downloadLink.click();
//   // }

//   document.body.removeChild(downloadLink);
// };
interface NavigatorWithSave extends Navigator {
  msSaveOrOpenBlob?: (blob: Blob, fileName: string) => boolean;
}

export const exportToWord = function (content: string, fileName: string = 'document') {
  if (!content || typeof content !== 'string') {
    console.error('exportToWord error: Content must be a non-empty string');
    return;
  }

  const fullFileName = `${fileName}.doc`;

  // HTML template để đảm bảo định dạng chuẩn hơn khi mở trong Word
  const preHtml = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:w="urn:schemas-microsoft-com:office:word"
        xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="utf-8">
    <title>Document</title>  
    <style>
      /* Tăng tính tương thích khi mở trong MS Word */
      body {
        font-family: Arial, sans-serif;
        font-size: 12pt;
        line-height: 1.6;
        margin: 20px;
      }
      h1, h2, h3 {
        color: #333;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        border: 1px solid #000;
        padding: 8px;
        text-align: left;
      }
    </style>
  </head>
  <body>
  `;

  const postHtml = '</body></html>';
  const html = preHtml + content + postHtml;

  // Tạo Blob với BOM để hỗ trợ UTF-8 và tránh lỗi font
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });

  // Xử lý cho trình duyệt IE (vẫn có người dùng IE 11)
  const nav = window.navigator as NavigatorWithSave;
  if (nav.msSaveOrOpenBlob) {
    nav.msSaveOrOpenBlob(blob, fullFileName);
    return;
  }

  // Tạo URL từ Blob để tải xuống
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');

  downloadLink.href = url;
  downloadLink.download = fullFileName;

  // Kiểm tra xem trình duyệt có hỗ trợ phương thức click() không (tránh lỗi trên iOS)
  if (typeof downloadLink.click === 'function') {
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } else {
    // Xử lý trên iOS Safari (không hỗ trợ click() trên các thẻ a được tạo động)
    window.open(url, '_blank');
  }

  // Giải phóng bộ nhớ sau khi sử dụng
  URL.revokeObjectURL(url);
};

// Hàm kiểm tra sự khớp giữa currentPath và route.path
export const isMatch = (routePath: string, currentPath: string) => {
  const matcher = match(routePath, { decode: decodeURIComponent, end: false });
  return matcher(currentPath) !== false;
};

export const getValidId = (id?: number) => Math.max(0, id ?? 0);

export const getValidItems = <T extends Payload>(array: T[], condition: (item: T) => boolean) =>
  array.flatMap(item => (condition(item) ? [{ ...item, id: getValidId(item.id) }] : []));

/**
 * Converts a number to Vietnamese words.
 * For example: 1234567 => "một triệu hai trăm ba mươi tư nghìn năm trăm sáu mươi bảy"
 *
 * @param {number} num - The number to convert.
 * @returns {string} - The Vietnamese words representation.
 */
export const numberToVietnameseWords = (num: number) => {
  if (num === 0) return 'không';

  // Array of digit words
  const chu = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  // Unit names for groups (thousands, millions, billions, etc.)
  const donvi = ['', 'nghìn', 'triệu', 'tỉ', 'nghìn tỉ', 'triệu tỉ']; // Extend as needed

  // Helper function that converts a number less than 1000 into words.
  function readTriple(n: any) {
    let result = '';
    const hundred = Math.floor(n / 100);
    const remainder = n % 100;
    const ten = Math.floor(remainder / 10);
    const unit = remainder % 10;

    if (hundred > 0) {
      result += chu[hundred] + ' trăm';
      // When tens digit is 0 but there is a unit digit.
      if (ten === 0 && unit > 0) {
        result += ' linh';
      }
    }

    if (ten > 0) {
      if (ten === 1) {
        result += ' mười';
      } else {
        result += ' ' + chu[ten] + ' mươi';
      }
    }

    // Process the ones place with special cases:
    if (unit > 0) {
      if (ten === 0 && hundred === 0) {
        // For numbers less than 10.
        result += chu[unit];
      } else {
        if (unit === 1 && ten >= 2) {
          result += ' mốt';
        } else if (unit === 5 && ten >= 1) {
          result += ' lăm';
        } else {
          result += ' ' + chu[unit];
        }
      }
    }

    return result.trim();
  }

  // Split the number into groups of three digits from right to left.
  const groups = [];
  while (num > 0) {
    groups.push(num % 1000);
    num = Math.floor(num / 1000);
  }

  // Process each group with proper unit names.
  let result = '';
  for (let i = groups.length - 1; i >= 0; i--) {
    const groupNum = groups[i];
    // Avoid reading groups that are 0 unless they are between nonzero groups.
    if (groupNum !== 0) {
      const groupWords = readTriple(groupNum);
      // Append the unit (if any) for this group.
      const unitName = donvi[i] ? ' ' + donvi[i] : '';
      result += groupWords + unitName + ' ';
    } else {
      // When a group is zero but it is in the middle of the number,
      // you might need extra handling depending on your desired style.
      // This example simply skips zero groups.
    }
  }

  // Clean up extra spaces.
  return result.replace(/\s+/g, ' ').trim();
};
