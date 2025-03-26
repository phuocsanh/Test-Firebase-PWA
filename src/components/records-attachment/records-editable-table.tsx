import { BasicDialog } from '@/components/basic-dialog';
import {
  DataTable,
  DataTableRowActions,
  EditableDatePickerCell,
  EditableDropdownCell,
  EditableInputCell,
} from '@/components/data-table';
import { RecordFilesDataTable, RecordForm } from '@/components/records-attachment';
import { QUERIES, TABLES } from '@/constant';
import { useBoolean, useMediaQuery } from '@/hooks';
import { translationWithNamespace } from '@/lib/i18nUtils';
import { getRandomNumber } from '@/lib/number';
import {
  defaultValuesRecordAttachment,
  IUserPermission,
  RecordAttachment,
  RecordAttachmentWithOrderModule,
} from '@/types';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

const t = translationWithNamespace('recordsAttachment');

const recordsEditableTableColumns: ColumnDef<RecordAttachment>[] = [
  {
    id: 'groupDocId',
    accessorKey: 'groupDocId',
    header: t('fields.groupDocId'),
    cell: props => (
      <EditableDropdownCell {...props} queryKey={[QUERIES.DOCUMENT_GROUP]} model="document-group" />
    ),
    size: 190,
  },
  {
    id: 'noDoc',
    accessorKey: 'noDoc',
    header: t('fields.noDoc'),
    cell: props => <EditableInputCell {...props} />,
    size: 150,
  },
  {
    id: 'dateCreate',
    accessorKey: 'dateCreate',
    header: t('fields.dateCreate'),
    cell: props => <EditableDatePickerCell {...props} />,
    size: 200,
  },
  {
    id: 'agencyId',
    accessorKey: 'agencyId',
    header: t('fields.agencyId'),
    cell: props => <EditableDropdownCell {...props} queryKey={[QUERIES.AGENCY]} model="agency" />,
    size: 200,
  },
  {
    id: 'content',
    accessorKey: 'content',
    header: t('fields.content'),
    cell: props => <EditableInputCell {...props} />,
    size: 200,
  },
  {
    id: 'note',
    accessorKey: 'note',
    header: t('fields.note'),
    cell: props => <EditableInputCell {...props} />,
    size: 200,
  },
];

type Props = {
  role?: IUserPermission;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  folder?: string;
};

const defaultRow = defaultValuesRecordAttachment;

export const RecordEditableTable = ({ role, rowSelection, setRowSelection, folder }: Props) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [selectedRow, setSelectedRow] = useState<RecordAttachment[]>([{ id: 0, itemFile: [] }]);

  const { state: isRecordFormOpen, toggle: toggleRecordForm } = useBoolean(false);

  const previousRecords = useRef<RecordAttachment[]>([]);
  const { setValue, control } = useFormContext<RecordAttachmentWithOrderModule>();
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [editableData, projectId] = useWatch({
    control,
    name: ['itemsRecordManagement', 'projectId'],
  });

  const [{ itemFile }] = selectedRow;

  useEffect(() => {
    if (itemFile.length !== 0) return;

    const selectedIds = Object.keys(rowSelection);

    if (selectedIds.length === 0) return;

    const [selectedId] = selectedIds;
    const selectedRow = editableData.find(item => item.id === Number(selectedId));

    if (!selectedRow || selectedRow.id === 0) return;

    setSelectedRow([selectedRow]);
  }, [editableData, itemFile.length, rowSelection]);

  const columns: typeof recordsEditableTableColumns = [
    ...recordsEditableTableColumns,
    {
      id: 'removeRow',
      header: ' ',
      size: 10,
      cell: props => {
        return (
          <DataTableRowActions
            onEdit={() => {
              previousRecords.current = editableData;
              setSelectedIndex(props.row.index);
              toggleRecordForm();
            }}
            onDelete={() => {
              props.table.options.meta?.removeRowByIndex(props.row.index);
            }}
            canDelete={role?.isCreate || role?.isUpdate}
            canEdit={role?.isCreate || role?.isUpdate}
          />
        );
      },
    },
  ];

  const onAddButtonClick = () => {
    const newRow = { ...defaultRow, projectId, id: -getRandomNumber() };
    const newRecords = [...editableData, newRow];
    previousRecords.current = editableData;
    setValue('itemsRecordManagement', newRecords);
    setSelectedIndex(editableData.length);
    toggleRecordForm();
  };

  const handleClose = () => {
    setValue('itemsRecordManagement', previousRecords.current);
    toggleRecordForm();
  };

  const handleOk = (updatedItem: RecordAttachment) => {
    const selectedIds = Object.keys(rowSelection);

    if (selectedIds.length === 0 || selectedRow[0].id === updatedItem.id) {
      setRowSelection({ [updatedItem.id]: true });
      setSelectedRow([updatedItem]);
    }

    toggleRecordForm();
  };

  return (
    <div className="space-y-4">
      {isMobile ? (
        <div className="mb-4 mt-2">
          {/* <BusinessEditableDataTableMobile
            editableData={editableData}
            columns={recordsEditableTableColumns}
            setEditableData={editableData => {
              setValue('itemsRecordManagement', editableData);
            }}
            renderDescription={_ => {
              // const row = _ as SalesOrderDetail & { warehouseName: string };
              // const quantity =
              //   row.typeProduct === PRODUCT_TYPES.PRODUCT ? row.quantity : row.quantityShell;
              // return `${row.price ? 'Giá : ' + realNumberDecimalFormat(row.price.toString()) : ''}${quantity ? ' SL: ' + realNumberDecimalFormat(quantity.toString()) : ''}${row.totalAmount ? ' TT: ' + realNumberDecimalFormat(row.totalAmount.toString()) : ''}${row.warehouseName ? ' Kho: ' + row.warehouseName : ''}`;
              return '';
            }}
            getCalculatedRowValues={getCalculatedRowValues}
            defaultRow={defaultRow}
          /> */}
        </div>
      ) : (
        <DataTable
          tableId={TABLES.RECORDS_EDITABLE_DATA}
          sortColumn="id"
          role={role}
          columns={columns}
          editableData={editableData}
          onAddButtonClick={onAddButtonClick}
          syncQueryParams={false}
          setEditableData={editedData => {
            setValue('itemsRecordManagement', editedData);
          }}
          rowSelection={rowSelection}
          rowSelectionType="radio"
          setRowSelection={setRowSelection}
          onRowSelected={setSelectedRow}
        />
      )}
      <BasicDialog
        open={isRecordFormOpen}
        toggle={toggleRecordForm}
        title={t('page.form.files.title')}
      >
        <RecordForm
          role={role}
          onClose={handleClose}
          onOk={handleOk}
          index={selectedIndex}
          folder={folder}
        />
      </BasicDialog>
      {itemFile.length > 0 && <RecordFilesDataTable data={itemFile} />}
    </div>
  );
};
