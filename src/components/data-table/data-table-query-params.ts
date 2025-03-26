import { kebabToPascalCase, lowercaseFirstLetter, toKebabCase } from '@/lib/text';
import { FieldColumn } from '@/types';

const operators: Record<string, string> = {
  '=': 'eq',
  '!=': 'diff',
  '<': 'lte',
  '<=': 'lte',
  '>': 'gt',
  '>=': 'gte',
};

/**
 * Serializes an array of FieldColumn objects into a URL query string.
 *
 * @param internalParams - An array of FieldColumn objects to be serialized.
 * @returns A string containing the serialized URL query.
 */
export const serializeFiltersQuery = (internalParams: FieldColumn[]) => {
  return internalParams.reduce((result, filterColumn) => {
    const { expression, keySearch, column } = filterColumn;

    const name = toKebabCase(column);
    const operator = operators[expression] || expression.toLocaleLowerCase();
    const search = expression === 'IN' ? keySearch.replace(/[()]/g, '') : keySearch;

    return (result += `&${name}=${operator}:${search}`);
  }, '');
};

/**
 * Parses an expression part of a filter query.
 *
 * @param expressionPart - The expression part to parse.
 * @returns An array containing the expression and key search values.
 */
const parseExpressionPart = (expressionPart: string): [string, string] => {
  const [operator, value] = expressionPart.split(':');

  const expression =
    Object.keys(operators).find(key => operators[key] === operator) || operator.toUpperCase();

  // if (operator === 'between') {
  //   return [expression, value];
  // }

  if (operator === 'in') {
    return [expression, `(${value})`];
  }

  return [expression, value];
};

/**
 * Parses a filter query item into its components.
 *
 * @param queryItem - The filter query item to parse.
 * @returns An object containing keySearch, expression, and column values.
 */
const parseFilterQueryItem = (queryItem: string) => {
  const [kebabName, expressionPart] = queryItem.split('=');
  const [expression, keySearch] = parseExpressionPart(expressionPart);

  return {
    keySearch,
    expression,
    column: kebabToPascalCase(kebabName),
  };
};

/**
 * Parses a serialized filter query string into an array of filter query items.
 *
 * @param serializedFilterQueryString - The serialized filter query string to parse.
 * @returns An array of filter query items.
 */
export const parseFiltersQuery = (serializedFilterQueryString: string) =>
  serializedFilterQueryString.split('&').slice(1).map(parseFilterQueryItem);

/**
 * Utility function to convert a date string from 'YYYYMMDD' to 'YYYY-MM-DD' format.
 *
 * @param str - The date string in 'YYYYMMDD' format.
 * @returns A string in 'YYYY-MM-DD' format.
 */
const getValidFilterDateFormat = (str: string) =>
  `${str.substring(0, 4)}-${str.substring(4, 6)}-${str.substring(6, 8)}`;

/**
 * Gets the form value from a FieldColumn object.
 *
 * @param fieldColumn - The FieldColumn object to extract form values from.
 * @returns The form value(s) extracted from the FieldColumn.
 */
const getFormValueFromFieldColumn = (fieldColumn: FieldColumn) => {
  const { expression, keySearch } = fieldColumn;
  if (expression === 'IN' && keySearch.includes('(')) {
    return keySearch
      .replace(/[()]/g, '')
      .split(',')
      .map(i => Number(i));
  }

  if (expression === 'BETWEEN') {
    const [from, to] = keySearch.split('-');
    return {
      from: new Date(getValidFilterDateFormat(from)),
      to: new Date(getValidFilterDateFormat(to)),
    };
  }

  return keySearch;
};

/**
 * Parses an array of FieldColumn objects into a filter form values object.
 *
 * @param params - An array of FieldColumn objects to parse.
 * @returns An object containing filter form values.
 */
export const parseParamsToFilterFormValues = (params: FieldColumn[]) => {
  return params.reduce((result, column) => {
    return {
      ...result,
      [lowercaseFirstLetter(column.column)]: {
        value: getFormValueFromFieldColumn(column),
        expression: column.expression,
      },
    };
  }, {});
};
