import axiosInstance, { request } from '@/axios-instance';
import {
  ObjectProductList,
  UploadResponse,
  UploadResponseMulti,
  WarehouseWithCurrentStock,
} from '@/types';
import { AxiosRequestConfig } from 'axios';

export const upload = async (payload: FormData): Promise<UploadResponse> => {
  return request<UploadResponse>(
    axiosInstance.post(`/common/upload`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  );
};

export const uploadMulti = async (payload: FormData): Promise<UploadResponseMulti[]> => {
  return request<UploadResponseMulti[]>(
    axiosInstance.post(`/common/upload-multi`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  );
};

export const getRequest = async <T>(url: string, optional?: AxiosRequestConfig<T>) => {
  return request<T>(axiosInstance.get(url, optional));
};

export const postRequest = async <T>(
  url: string,
  data: unknown,
  optional?: AxiosRequestConfig<T>
) => {
  return request<T>(axiosInstance.post(url, data, optional));
};

export const getCurrentStockByProduct = async (
  productId: number,
  unitExchange: number
): Promise<WarehouseWithCurrentStock[]> => {
  return request<WarehouseWithCurrentStock[]>(
    axiosInstance.post('/product-current-stock/get-by-product', [], {
      params: { productId, unitExchange },
    })
  );
};

type WarehouseWithNameAndCurrentStock = WarehouseWithCurrentStock & { name: string };

export const getCurrentStockByProductList = async (
  data: ObjectProductList[]
): Promise<Record<number, WarehouseWithNameAndCurrentStock[]>> => {
  try {
    const warehouses = await request<WarehouseWithCurrentStock[]>(
      axiosInstance.post('/product-current-stock/get-by-object-product-list', data)
    );

    const map: Record<number, WarehouseWithNameAndCurrentStock[]> = {};
    for (const warehouse of warehouses) {
      (map[warehouse.productId] ||= []).push({
        ...warehouse,
        id: warehouse.warehouseId,
        name: warehouse.warehouseName,
      });
    }

    return Promise.resolve(map);
  } catch (error) {
    console.error('error : ', error);
    return Promise.resolve({});
  }
};
