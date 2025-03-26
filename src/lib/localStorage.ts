/**
 *  Local store utils
 */

import { parseJson } from './utils';

export const getLocalStorage = <T>(key: string): T | null | string => {
  const value = localStorage.getItem(key);

  if (value === null) {
    return null;
  }

  return parseJson<T>(value);
};

export const setLocalStorage = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalStorage = (key: string) => {
  if (getLocalStorage(key)) {
    localStorage.removeItem(key);
  }
};
