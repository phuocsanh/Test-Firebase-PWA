import {
  DataTable,
  DataTableRowActions,
  EditableDropdownCell,
  EditableFileCell,
  EditableInputCell,
} from '@/components/data-table';
import { RecordFilesAttachButton } from '@/components/records-attachment';
import { QUERIES, TABLES } from '@/constant';
import { useMediaQuery } from '@/hooks';
import { translationWithNamespace } from '@/lib/i18nUtils';
import { getRandomNumber } from '@/lib/number';
import {
  defaultValuesRecordAttachment,
  IUserPermission,
  RecordAttachmentFile,
  RecordAttachmentWithOrderModule,
} from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useFormContext, useWatch } from 'react-hook-form';

const t = translationWithNamespace('recordsAttachment');

type RecordFilesEditableTable = {
  role?: IUserPermission;
  index: number;
  folder?: string;
};

const [defaultRow] = defaultValuesRecordAttachment.itemFile;

export const RecordFilesEditableTable = ({ role, index, folder }: RecordFilesEditableTable) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const { control, setValue } = useFormContext<RecordAttachmentWithOrderModule>();
  const editableData = useWatch({
    control,
    name: `itemsRecordManagement.${index}.itemFile`,
  });
  const setEditableData = (editableData: RecordAttachmentFile[]) => {
    setValue(`itemsRecordManagement.${index}.itemFile`, editableData);
  };

  const columns: ColumnDef<RecordAttachmentFile>[] = [
    {
      id: 'typeFileId',
      accessorKey: 'typeFileId',
      header: t('fields.itemFile.typeFileId'),
      cell: props => (
        <EditableDropdownCell {...props} queryKey={[QUERIES.FILE_TYPE]} model="file-type" />
      ),
      size: 100,
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: t('fields.itemFile.name'),
      cell: props => <EditableInputCell {...props} />,
      size: 150,
    },
    {
      id: 'fileName',
      accessorKey: 'fileName',
      header: t('fields.itemFile.fileName'),
      cell: props => <EditableFileCell {...props} folder={folder} />,
      size: 100,
    },
    {
      id: 'note',
      accessorKey: 'note',
      header: t('fields.itemFile.note'),
      cell: props => <EditableInputCell {...props} />,
      size: 150,
    },
    {
      id: 'removeRow',
      header: '',
      size: 10,
      cell: props => {
        return (
          <DataTableRowActions
            onDelete={() => {
              props.table.options.meta?.removeRowByIndex(props.row.index);
            }}
            canDelete={role?.isCreate || role?.isUpdate}
          />
        );
      },
    },
  ];

  return (
    <div>
      {isMobile ? (
        <div className="mb-4 mt-2">
          {/* <BusinessEditableDataTableMobile
            editableData={editableData}
            columns={recordFilesEditableColumns}
            setEditableData={editableData => {
              setValue('itemsRecordManagement', editableData);
            }}
            renderDescription={_ => {
              // const row = _ as Detail & { warehouseName: string };
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
          tableId={TABLES.SALES_ORDER_RECORD_FILES}
          sortColumn="id"
          role={role}
          columns={columns}
          editableData={editableData}
          syncQueryParams={false}
          setEditableData={setEditableData}
          onAddButtonClick={() => {
            setEditableData([...editableData, { ...defaultRow, id: -getRandomNumber() }]);
          }}
          customToolbar={() => (
            <RecordFilesAttachButton
              folder={folder}
              onResponse={response => {
                const data: RecordAttachmentFile[] = response.map(item => {
                  return {
                    ...defaultRow,
                    id: -getRandomNumber(),
                    name: item.name,
                    folder: item.src,
                    fileName: item.fileName,
                    host: item.host,
                    size: item.size,
                    type: item.type,
                  };
                });
                const newData = [
                  ...(editableData || []).filter(item => item.fileName),
                  ...data,
                  defaultRow,
                ];
                setEditableData(newData);
              }}
            />
          )}
        />
      )}
    </div>
  );
};
