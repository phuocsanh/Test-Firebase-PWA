import { createQueryByIdFn, createQueryComponentFn, Model, Payload } from '@/services';
import { CustomStore } from 'devextreme/common/data';

export const createQueryComponentStore = <T extends Payload>(url: Model) => {
  const store = new CustomStore({
    key: 'id',
    load: async (loadOptions: { skip?: number; take?: number; searchValue?: number }) => {
      const { skip = 0, take = 1000000, searchValue } = loadOptions;

      const params = {
        id: 0,
        keySearch: (searchValue || '') as string,
        pageIndex: Math.floor(skip / take) + 1,
        pageSize: take,
        isGetAll: true,
      };

      return createQueryComponentFn<T>(url)(params).then(response => {
        return {
          data: response.items,
          totalCount: response.total,
          summary: response.summary,
        };
      });
    },
    byKey(key: number) {
      if (!key) {
        return Promise.reject();
      }
      // return request(`${url}/${key}`, { method: 'GET' });
      return createQueryByIdFn<T>(url)(key);
    },
  });

  return store;
};
