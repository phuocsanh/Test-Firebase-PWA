import { DEFAULT_DECIMAL_SCALE } from '@/constant';
import { v4 } from 'uuid';

/**
 * Parse a localized number to a float.
 * @param stringNumber - the localized number
 * @param locale - [optional] the locale that the number is represented in. Omit this parameter to use the current locale.
 */
export const parseLocaleNumber = (stringNumber: string, locale = 'vi-VN') => {
  const thousandSeparator = Intl.NumberFormat(locale)
    .format(11111)
    .replace(/\p{Number}/gu, '');

  const decimalSeparator = Intl.NumberFormat(locale)
    .format(1.1)
    .replace(/\p{Number}/gu, '');

  return parseFloat(
    stringNumber
      .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
      .replace(new RegExp('\\' + decimalSeparator), '.')
  );
};

/**
 * Format a number variable to a localized
 * @param number - the number will be format
 * @param locale - [optional] the locale that the number is represented in. Omit this parameter to use the current locale.
 * @param currency - [optional]
 */
export const formatLocaleNumber = (
  number: number,
  // style = 'decimal',
  locale = 'en-US',
  currency = 'VND'
) =>
  new Intl.NumberFormat(locale, {
    currency,
  }).format(number);

/**
 * Removes non-numeric characters from a string and returns the resulting number string.
 *
 * @param numberString - The input string from which to extract numbers.
 * @returns The number string containing only numeric characters.
 */
export const getNumbersFromString = (numberString: string) => numberString.replace(/[^0-9]/g, '');

/**
 * Generates a random integer between 0 and the specified maximum value.
 *
 * @param max - The maximum value for the random number (exclusive).
 * @returns The generated random integer.
 */
export const getRandomNumber = (): number => {
  const uuid = v4(); // Tạo UUID dạng chuỗi
  const hash = parseInt(uuid.replace(/-/g, '').slice(0, 15), 16); // Chuyển UUID thành số
  return Math.abs(hash); // Đảm bảo nó luôn là số âm
};

/**
 * Parse a number string with commas into a numeric value.
 *
 * @param string - The number string with commas.
 * @returns The parsed numeric value.
 */
export const parseNumber = (string: string) => {
  return Number(string.replace(/[^\d.-]/g, ''));
};

/**
 * Format a numeric string with commas.
 *
 * @param string - The numeric string to format.
 * @returns The formatted numeric string with commas.
 */
export const formatNumber = (string: string) => {
  const formattedNumber = parseNumber(string).toLocaleString();

  if (string.includes('.') && string.indexOf('.') === string.length - 1) {
    return formattedNumber + '.';
  }

  return formattedNumber;
};

/**
 * Format a real number represented as a string with thousands separators and optional decimal precision.
 * @param inputNumber - The number as a string to be formatted.
 * @param decimalLim - The maximum number of decimal places to display. Default is 4.
 * @returns A formatted string with the specified decimal precision.
 */
export const realNumberDecimalFormat = (
  inputNumber: string,
  decimalLim = DEFAULT_DECIMAL_SCALE
): string => {
  // Check if the input is empty or undefined, and return an empty string.
  if (!inputNumber) {
    return '';
  }

  // Convert the input number to a string for consistency.
  let numberStr = inputNumber.toString();

  // Find the index of the decimal point in the string.
  const dotIndex = numberStr.indexOf('.');

  const lastIndexOfMinus = numberStr.lastIndexOf('-');
  if (lastIndexOfMinus > 1) {
    numberStr = numberStr[0] + numberStr.substring(1, numberStr.length).replaceAll('-', '');
  }

  // Regular expression to match thousands separators.
  const commonMatch = new RegExp(/\B(?=(\d{3})+(?!\d))/g);

  // If there is no decimal point in the input number, format the integer part only.
  if (dotIndex === -1) {
    return numberStr.replace(commonMatch, ',');
  }

  // Calculate the number of decimal places in the input number.
  const numLengthAfterDecimalPoint = numberStr.length - dotIndex - 1;
  let result = inputNumber;

  // If the number of decimal places exceeds the specified limit, round and limit it.
  if (numLengthAfterDecimalPoint >= decimalLim) {
    const powLim = Math.pow(10, decimalLim);
    result = String(Math.round(Number(inputNumber) * powLim) / powLim);
  }

  // Split the result into the integer and decimal parts.
  const [numberPart, decimalPart] = result.toString().split('.');

  // If no decimal places are required, return the integer part with thousands separators.
  if (decimalLim === 0 || decimalPart === undefined) {
    return numberPart.replace(commonMatch, ',');
  }

  // Return the formatted number with thousands separators and the specified decimal precision.
  return numberPart.replace(commonMatch, ',') + '.' + decimalPart;
};

export const normalizeNumeric = (inputString: string) => {
  let number = inputString.replace(/[^\d.-]/g, '');
  // number with type text -> 10000 -> 10,000
  const lastIndexOfMinus = number.lastIndexOf('-');
  const firstIndexOfDot = number.indexOf('.');
  const dotCount = (number.match(/\./g) || []).length;

  if (lastIndexOfMinus > 0) {
    number = number[0] + number.substring(1, number.length).replaceAll('-', '');
  }

  if (dotCount > 1) {
    number =
      number.substring(0, firstIndexOfDot + 1) +
      number.substring(firstIndexOfDot).replaceAll('.', '');
  }

  return number;
};
