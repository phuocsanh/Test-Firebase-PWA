import { useId } from 'react';

import { DataTableContent, DataTablePagination, DataTableToolbar } from '@/components/data-table';
import { useMediaQuery } from '@/hooks';
import { Payload } from '@/services/utils';
import { DataTableProps } from '@/types';
import { useForm } from 'react-hook-form';
import { LoadingOverlay } from '../loading-overlay';
import { Form } from '../ui/form';
import { DataTableModalErrorImport } from './data-table-modal-error-import';
import { DataTableProvider, useDataTableInstance } from './data-table-provider';

/**
 * DataTableConsumerProps
 *
 * A TypeScript type that defines the properties required by the DataTableConsumer component.
 *
 * @template TData - The type of data handled by the DataTable.
 * @template TValue - The type of the value field in the data.
 */
type DataTableConsumerProps<TData, TValue> = Pick<
  DataTableProps<TData, TValue>,
  | 'hasExport'
  | 'hasImport'
  | 'role'
  | 'contextMenuItems'
  | 'showSetting'
  | 'showPagination'
  | 'rowSelectionType'
  | 'customToolbar'
  | 'onAddButtonClick'
  | 'tableId'
>;

/**
 * DataTableConsumer
 *
 * A component that manages and renders the core functionalities of the data table,
 * including toolbar, content, pagination, loading states, and error handling.
 *
 * @template TData - The type of data handled by the DataTable.
 * @template TValue - The type of the value field in the data.
 *
 * @param {DataTableConsumerProps<TData, TValue>} props - The props required by the component.
 *
 * @returns {JSX.Element} The DataTableConsumer component.
 */
const DataTableConsumer = <TData extends Payload, TValue>({
  role,
  contextMenuItems,

  showSetting,
  showPagination,

  hasExport,
  hasImport,

  customToolbar,

  onAddButtonClick,

  rowSelectionType,
  tableId,
}: DataTableConsumerProps<TData, TValue>): JSX.Element => {
  const elementId = useId();

  // /**
  //  * Manage filters state with RHF
  //  */
  const methods = useForm();
  const { importState } = useDataTableInstance();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="space-y-2 overflow-auto" id={`data-table-${elementId}`}>
      <DataTableToolbar
        role={role}
        tableId={tableId}
        hasExport={hasExport}
        hasImport={hasImport}
        showSetting={showSetting}
        onAddButtonClick={onAddButtonClick}
        isMobile={isMobile}
      >
        {customToolbar}
      </DataTableToolbar>
      {/* <div className="md:rounded-md md:border"> */}
      <Form {...methods}>
        <DataTableContent tableId={tableId} contextMenuItems={contextMenuItems} />
      </Form>
      {/* </div> */}
      {showPagination && <DataTablePagination rowSelectionType={rowSelectionType} />}
      <LoadingOverlay loading={importState?.isImporting} />
      {importState.errorsImport && (
        <DataTableModalErrorImport
          open={importState.openErrorImport}
          toggle={importState.toggleErrorImport}
          errors={importState.errorsImport}
        />
      )}
    </div>
  );
};

/**
 * DataTable
 *
 * The main component that combines all the parts of a data table, including the provider
 * for state management and the consumer for rendering.
 *
 * @template TData - The type of data handled by the DataTable.
 * @template TValue - The type of the value field in the data.
 *
 * @param {DataTableProps<TData, TValue>} props - The props required by the component.
 *
 * @returns {JSX.Element} The DataTable component.
 */
export const DataTable = <TData extends Payload, TValue>({
  role,

  contextMenuItems,

  sortColumn = 'id',
  showSetting = true,
  showPagination = true,
  manualGrouping = true,
  hideAutoNumberedColumn = false,
  syncQueryParams = true,

  hasExport,
  hasImport,

  customToolbar,

  onAddButtonClick,

  ...props
}: DataTableProps<TData, TValue>): JSX.Element => (
  <DataTableProvider
    {...props}
    sortColumn={sortColumn?.toString()}
    manualGrouping={manualGrouping}
    syncQueryParams={syncQueryParams}
    hideAutoNumberedColumn={hideAutoNumberedColumn}
  >
    <DataTableConsumer
      role={role}
      contextMenuItems={contextMenuItems}
      showSetting={showSetting}
      showPagination={showPagination}
      hasExport={hasExport}
      hasImport={hasImport}
      customToolbar={customToolbar}
      onAddButtonClick={onAddButtonClick}
      rowSelectionType={props.rowSelectionType}
      tableId={props.tableId}
    />
  </DataTableProvider>
);
