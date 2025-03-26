import axiosInstance, { request } from '@/axios-instance';
import { toLocaleDate } from '@/lib/date';
import { PaginationResponse, QueryListComponentType, QueryPaginationParams } from '@/types';

export type Model =
  | 'user'
  | 'staff'
  | 'supplier'
  | 'product'
  | 'product-group'
  | 'sale'
  | 'branch'
  | 'customer'
  | 'account-fund'
  | 'company'
  | 'signalr-notify'
  | 'project'
  | 'agency'
  | 'document-group'
  | 'receipts-and-expenses-content'
  | 'print-forms'
  | 'print-type'
  | 'supplier-group'
  | 'project-group'
  | 'project-owner'
  | 'deployment-phase'
  | 'contractor-type'
  | 'tender-type'
  | 'bidding-sector'
  | 'bidding-method'
  | 'contract-type'
  | 'cost-item-type'
  | 'file-type'
  | 'department'
  | 'position'
  | 'contractor'
  | 'config-import-excel'
  | 'work-position'
  | 'evaluation-result'
  | 'expertise'
  | 'major'
  | 'politics'
  | 'career-training'
  | 'it-course'
  | 'foreign-language'
  | 'correspondence-type'
  | 'gender-type'
  | 'inventory-item'
  | 'training-institution'
  | 'district'
  | 'inventory-item-type'
  | 'project-status'
  | 'ward'
  | 'project-management-type'
  | 'budget-fund'
  | 'budget-source-code'
  | 'cost-item'
  | 'construction-item'
  | 'construction-task'
  | 'employee-type'
  | 'contract-appendix-type'
  | 'unit'
  | 'contract-task-management'
  | 'design-task-management'
  | 'training-management'
  | 'state-management'
  | 'contractor-selection-plan'
  | 'status'
  | 'tender-package'
  | 'contract'
  | 'contract-appendix'
  | 'completion-acceptance'
  | 'leave'
  | 'employee'
  | 'board-of-directors-work-schedule'
  | 'borrow-document'
  | 'overtime-registration'
  | 'approval-process'
  | 'salary-sheet'
  | 'task'
  | 'directive-content'
  | 'target'
  | 'report-template'
  | 'report-serial-management'
  | 'work-management-directive-content'
  | 'work-management-target'
  | 'insurance-contribution-report'
  | 'work-management-task'
  | 'work-management-design-bid-estimation'
  | 'payment-beneficiary-report'
  | 'document-form-entry'
  | 'employee-payroll-report'
  | 'salary-sheet-for-labor-contract-report'
  | 'setup-annual-holiday'
  | 'work-management-other'
  | 'guarantee-letter-tracking'
  | 'overtime-attendance-tracking-report'
  | 'outstanding-equipment'
  | 'asset-type'
  | 'asset'
  | 'asset-increment'
  | 'form-document-manager'
  | 'document-decision'
  | 'capital-increase-plan'
  | 'adjusted-investment'
  | 'project-schedule-setup'
  | 'project-schedule-setup-detail'
  | 'backlog-project-management'
  | 'adjusted-cost-estimation'
  | 'permission-group'
  | 'permission'
  | 'history-action'
  | 'common/get-profession-type'
  | 'spending-commitment'
  | 'investment-form'
  | 'investment-type'
  | 'construction-type'
  | 'payment-receipt'
  | 'notification'
  | 'notification/update-is-views-by-user-id'
  | 'device'
  | 'annual-task-list-statistics-report'
  | 'yearly-summary-report'
  | 'summary-targets-tasks-first-6-months-report'
  | 'summary-targets-tasks-last-6-months-report'
  | 'contractor-selection-result'
  | 'contractor-selection-result-detail-report'
  | 'report-on-implementation-of-directives-report'
  | 'a-b-settlement'
  | 'report-annex-3a'
  | 'contractor-selection-result-by-managing-director-report'
  | 'contractor-selection-result-by-department-report'
  | 'a-b-adjustment-settlement'
  | 'project-disbursement'
  | 'project-disbursement-report'
  | 'proposed-settlement-investment-cost'
  | 'template-statistics-report'
  | 'advance-payment'
  | 'contract-settlement'
  | 'data-reconciliation-table'
  | 'project-debt-status-statistics-report'
  | 'saving-rate-contractor-selection-plan-report'
  | 'contractor-participation-tender-package-list-report'
  | 'capital-plan-disbursement-progress-report'
  | 'project-department-disbursement-progress-report'
  | 'saving-in-bidding-report'
  | 'report-public-investment-settlement';

export type Payload = {
  order?: number;
  id?: number;
  sort?: number | string | null;
};

export const createQueryByIdFn = <T extends Payload>(model: Model) => {
  return async (id: number): Promise<T> => {
    return request<T>(axiosInstance.get(`/${model}/${id}`));
  };
};

export const createQueryPaginationFn = <T extends Payload>(model: Model) => {
  return async (data: QueryPaginationParams): Promise<PaginationResponse<T>> => {
    return request<PaginationResponse<T>>(axiosInstance.post(`/${model}/get-all`, data));
  };
};

export const createQueryPaginationWithCustomPathFn = <T>(path: string) => {
  return async (data: QueryPaginationParams): Promise<PaginationResponse<T>> => {
    return request<PaginationResponse<T>>(axiosInstance.post(path, data));
  };
};

export const createQueryComponentFn = <T extends Payload>(model: Model) => {
  return async (params: QueryListComponentType): Promise<PaginationResponse<T>> => {
    return request<PaginationResponse<T>>(axiosInstance.get(`/${model}/get-component`, { params }));
  };
};

export const createQueryCustomParamsComponentFn = (params: Record<string, unknown>) => {
  return <T extends Payload>(model: Model) => {
    return async (_params: QueryListComponentType): Promise<PaginationResponse<T>> => {
      return request<PaginationResponse<T>>(
        axiosInstance.get(`/${model}/get-component`, { params: { ..._params, ...params } })
      );
    };
  };
};

export const createGenerateCodeFn = (model: Model) => {
  return async (dateTime: Date): Promise<string> => {
    return request<string>(
      axiosInstance.get(`/${model}/create-code`, { params: { dateTime: toLocaleDate(dateTime) } })
    );
  };
};

export const createPostMutateFn = <T extends Payload>(model: Model) => {
  return async (data: T): Promise<number> => {
    return request<number>(axiosInstance.post(`/${model}/`, data));
  };
};

export const createPutMutateFn = <T extends Payload>(model: Model) => {
  return async (data: T): Promise<number> => {
    return request<number>(axiosInstance.put(`/${model}/${data.id}`, data));
  };
};

export const createDeleteMutateFn = <T extends Payload>(model: Model) => {
  return async (id: T['id']): Promise<number> => {
    return request<number>(axiosInstance.delete(`/${model}/${id}`));
  };
};

export const createQueryReport = <T extends Payload>(model: Model, detail: boolean = false) => {
  // return async (
  // params: QueryPaginationParams,
  // data: FieldColumn[]
  // ): Promise<PaginationResponse<T>> => {
  // return request<PaginationResponse<T>>(
  //   axiosInstance.post(`/${model}/get-report${detail ? '-detail' : ''}`, data, {
  //     params,
  //   })
  // );
  // };

  return async (data: QueryPaginationParams): Promise<PaginationResponse<T>> => {
    return request<PaginationResponse<T>>(
      axiosInstance.post(`/${model}/get-report${detail ? '-detail' : ''}`, data)
    );
  };
};

export const createQueryReportWithSummary = <T extends Payload, S>(
  model: Model,
  detail: boolean = false
) => {
  // return async (
  // params: QueryPaginationParams,
  // data: FieldColumn[]
  // ): Promise<PaginationResponse<T>> => {
  // return request<PaginationResponse<T>>(
  //   axiosInstance.post(`/${model}/get-report${detail ? '-detail' : ''}`, data, {
  //     params,
  //   })
  // );
  // };

  return async (data: QueryPaginationParams): Promise<PaginationResponse<T, S>> => {
    return request<PaginationResponse<T, S>>(
      axiosInstance.post(`/${model}/get-report${detail ? '-detail' : ''}`, data)
    );
  };
};
