import { ResponseSuccess } from '@/types/network';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { TOKEN_KEY } from './constant/const';
import { getCookie } from './lib/cookie';

const axiosInstance = axios.create({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL: import.meta.env.VITE_API_URL_CONVERT,
  timeout: 30000,
  headers: {
    'Accept-Language': 'vi-VN',
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (getCookie<string>(TOKEN_KEY)) {
      config.headers.Authorization = `Bearer ${getCookie<string>(TOKEN_KEY)} `;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  // (error: { message: string; response: { status: number; data: { errors: unknown[] } } }) => {
  (error: { message: string; response: { status: number; data: ResponseSuccess<unknown> } }) => {
    const {
      message,
      response: { status, data },
    } = error;

    if (status === 401) {
      //Add Logic to
      //1. Redirect to login page or
      //2. Request refresh token
      window.location.href = '/sign-in';
    }

    // SQL errors
    if (status === 400) {
      // console.log('data:', data);
      // return Promise.reject(data.errors);
      return Promise.reject({
        errors: data.data,
        message: data.message,
        fieldName: data.fieldName,
      });
    }

    return Promise.reject({ message });
  }
);

/**
 * Handles Axios response and resolves the desired data from it.
 *
 * @template T - The type of the expected data in the response.
 * @param asyncService - The Axios response promise.
 * @returns A promise that resolves to the desired data from the response.
 * @throws Error if the response data is missing or if the API returns an error (status code 400).
 */
export const request = async <T>(
  asyncService: Promise<AxiosResponse<ResponseSuccess<T>>>
): Promise<T> => {
  return asyncService.then(response => {
    const { data } = response;

    if (!data) {
      return Promise.reject({ message: 'Request failure' });
    }

    if (data.code !== 200) {
      return Promise.reject({
        errors: data.data,
        message: data.message,
        fieldName: data.fieldName,
      });
    }

    return data.data;
  });
};

export default axiosInstance;
