import axiosInstance, { request } from '@/axios-instance';

import { IPermission, IUserPermission, PaginationResponse } from '@/types';

// Permission
export const getPermissionById = async (id: IPermission['id']): Promise<IPermission> => {
  return request<IPermission>(axiosInstance.get(`/permission/get-by-id`, { params: { id } }));
};

export const getPermissions = async (id?: IPermission['id']): Promise<IPermission[]> => {
  return request<IPermission[]>(axiosInstance.get(`/permission/get-list-all`, { params: { id } }));
};

export const getPermissionsByIds = async (
  data: number[]
): Promise<PaginationResponse<IPermission>> => {
  return request<PaginationResponse<IPermission>>(
    axiosInstance.post(`/permission/get-by-ids`, data)
  );
};

//  IUserPermission
export const createIUserPermission = async (
  data: IUserPermission[]
): Promise<IUserPermission['id']> => {
  return request(axiosInstance.post(`/user-permission/create`, data));
};

export const getPermissionByUser = async (
  userId: IUserPermission['id']
): Promise<IUserPermission[]> => {
  return request(axiosInstance.get(`/user/get-user-permission?id=${userId}`));
};
