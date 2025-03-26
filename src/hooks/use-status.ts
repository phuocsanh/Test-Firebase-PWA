import axiosInstance, { request } from '@/axios-instance';
import { QUERIES } from '@/constant';
import { PaginationResponse, Status } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useStatus = (type: number) => {
  const { data } = useQuery({
    queryKey: [QUERIES.STATUS, type],
    queryFn: async () =>
      await request<PaginationResponse<Status>>(
        axiosInstance.get('/common/get-status-by-profession-type', {
          params: {
            professionType: type,
          },
        })
      ),
    enabled: !!type,
  });

  return data?.items || [];
};
