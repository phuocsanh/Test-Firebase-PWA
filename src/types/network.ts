export type ResponseSuccess<T> = {
  code: number;
  data: T;
  message: string;
  fieldName?: string;
};

export type ResponseFailure = {
  code: number;
  fieldName: string;
  message: string;
};

export type PaginationResponse<T, TSummary = never> = {
  items: T[];
  pageIndex: number;
  pageSize: number;
  total: number;
  summary?: TSummary;
};

// export type PaginationSummaryResponse<T, TSummary> = {
//   items: T[];
//   pageIndex: number;
//   pageSize: number;
//   total: number;
//   summary: TSummary;
// };

export type ExportResponse = {
  path: string;
};

export type FieldColumn = {
  column: string;
  keySearch: string;
  expression: string;
};

export type ObjFilter = {
  key: string;
  value: string;
};

export type QueryListPayloadType = {
  filterColumn: FieldColumn[];
  searchStartDate?: Date | null;
  searchEndDate?: Date | null;
  searchMonthYear?: string | null;
  searchDeliverId?: number;
  searchVehicleId?: number;
  objParam?: Record<string, unknown>;
  idSearch?: number;
  pageIndex?: number;
  pageSize?: number;
  sortColumn: string;
  sortOrder: number;
  isPage: boolean;
};

export type QueryPaginationParams = {
  fromDate?: Date;
  toDate?: Date;
  pageIndex?: number;
  pageSize?: number;
  sortColumn: string;
  sortOrder: number;
  isPage: boolean;
  filterColumn?: FieldColumn[];
} & Record<string, unknown>;

export type QueryListPayloadExtentObjType = {
  filterColumn: FieldColumn[];
  objParam?: Record<string, unknown>;
  pageIndex?: number;
  pageSize?: number;
  sortColumn: string;
  sortOrder: number;
};

export type QueryListPayloadExtentType = {
  filterColumn: FieldColumn[];
  year: number;
  month: number;
  pageIndex?: number;
  pageSize?: number;
  sortColumn: string;
  sortOrder: number;
  isPage: boolean;
};

export type PaginationParams = {
  pageIndex?: number;
  pageSize?: number;
  sortColumn: string;
  sortOrder: number;
};

export type QueryListComponentType = {
  keySearch: string;
  id: number;
  pageIndex: number;
  pageSize: number;
  isGetAll: boolean;
};

export type ListComponentResponse = {
  name?: string | null;
  code?: string | null;
  phone?: string | null;
  address?: string | null;
  id: number;
};
