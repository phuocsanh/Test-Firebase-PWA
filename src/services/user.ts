import axiosInstance, { request } from '@/axios-instance';
import { User } from '@/types';

// Update user
export const updateUserData = async (data: User): Promise<User['id']> => {
  return request(axiosInstance.put(`/user/${data.id}`, data));
};
