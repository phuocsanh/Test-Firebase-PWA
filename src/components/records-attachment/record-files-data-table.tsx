import {
  DataTable,
  EditableDropdownCell,
  EditableFileCell,
  TextCell,
} from '@/components/data-table';
import { QUERIES, TABLES } from '@/constant';
import { useMediaQuery } from '@/hooks';
import { translationWithNamespace } from '@/lib/i18nUtils';
import { RecordAttachmentFile } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

const t = translationWithNamespace('recordsAttachment');

const recordFilesDataTableColumns: ColumnDef<RecordAttachmentFile>[] = [
  {
    id: 'typeFileId',
    accessorKey: 'typeFileId',
    header: t('fields.itemFile.typeFileId'),
    cell: props => (
      <EditableDropdownCell
        {...props}
        queryKey={[QUERIES.FILE_TYPE]}
        model="file-type"
        disabled
        className="disabled:opacity-100"
      />
    ),
    size: 100,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: t('fields.itemFile.name'),
    cell: TextCell,
    size: 150,
  },
  {
    id: 'fileName',
    accessorKey: 'fileName',
    header: t('fields.itemFile.fileName'),
    cell: props => <EditableFileCell {...props} />,
    size: 100,
  },
  {
    id: 'note',
    accessorKey: 'note',
    header: t('fields.itemFile.note'),
    cell: TextCell,
    size: 150,
  },
];

type Props = {
  data: RecordAttachmentFile[];
};

export const RecordFilesDataTable = ({ data }: Props) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div>
      {isMobile ? (
        <div className="mb-4 mt-2">
          {/* <BusinessEditableDataTableMobile
            editableData={editableData}
            columns={recordFilesDataTableColumns}
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
          tableId={TABLES.SALES_ORDER_RECORD_FILES_READ_ONLY}
          sortColumn="id"
          columns={recordFilesDataTableColumns}
          editableData={data}
          syncQueryParams={false}
        />
      )}
    </div>
  );
};
