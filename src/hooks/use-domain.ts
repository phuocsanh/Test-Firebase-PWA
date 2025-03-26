import axiosInstance, { request } from '@/axios-instance';
import { LOCAL_STORE_KEYS } from '@/constant';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useDomain = (manualCheck = true) => {
  const navigate = useNavigate();
  const checkDomain = useCallback(() => {
    request<{ type: number; storeName: string }>(
      axiosInstance.post(`auth/check-by-domain?domain=${LOCAL_STORE_KEYS.HOST}`)
    )
      .then(data => {
        if (data) {
          switch (data.type) {
            case 2:
            case 3:
              navigate(`/check-domain/${data.type}`);
              break;
            default:
              break;
          }
        }
      })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (manualCheck) {
      checkDomain();
    }
  }, [checkDomain, manualCheck]);

  return checkDomain;
};
