import '@tanstack/react-table';

import { Model, Payload } from '@/services';
import { QueryKey } from '@tanstack/react-query';
import { RowData } from '@tanstack/react-table';
import { PaginationResponse, QueryListComponentType } from '.';

type DataType = 'text' | 'number' | 'date' | 'multiple' | 'active' | 'boolean';
export type ColumnMetaOption = {
  type: DataType;
  searchKey?: string;
  queryKey?: QueryKey;
  model?: Model;
  options?: unknown[];
  createQueryFn?: <TData extends Payload>(
    model: Model
  ) => (params: QueryListComponentType) => Promise<PaginationResponse<TData>>;
  showFields?: string[];
};

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    updateRowValues: (values: Partial<TData>, rowIndex?: number) => void;
    addNewRow: (values: TData) => void;
    removeRowByIndex: (index: number) => void;
  }
  interface ColumnMeta {
    filter?: ColumnMetaOption;
    editable?: ColumnMetaOption;
    rowSpanByColumn?: string[];
  }
}
