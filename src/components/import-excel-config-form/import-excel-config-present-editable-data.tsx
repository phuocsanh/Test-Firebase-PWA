import {
  DataTable,
  DataTableRowActions,
  EditableDropdownCell,
  NumberCell,
  TextCell,
} from '@/components/data-table';
import { ProfessionColumn } from '@/components/import-excel-config-form';
import { applyLabel, closeLabel, QUERIES, TABLES } from '@/constant';
import { useAuth } from '@/hooks';
import { Model, Payload } from '@/services';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from 'devextreme-react';
import { kebabCase } from 'lodash';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type Props<T> = {
  onClose: () => void;
  onImportExcel: () => void;
  isImporting: boolean;
  professionType: number;
  professionColumns: ProfessionColumn[];
  data: T[];
  onApply: () => void;
  // setData;
};

function transformKebabCaseField(fieldName: string): string {
  // Rule 1: 'sub-xxxx-id' → 'xxxx' (bỏ 'sub-' và '-id')
  const subRuleMatch = fieldName.match(/^sub-(.+)-id$/);
  if (subRuleMatch) return subRuleMatch[1];

  // Rule 2: Bỏ '-id' ở cuối nếu có
  if (fieldName.endsWith('-id')) {
    return fieldName.replace(/-id$/, '');
  }

  // Mặc định: giữ nguyên
  return fieldName;
}

export const ImportExcelConfigPresentEditableData = <T extends Payload>({
  onClose,
  onImportExcel,
  isImporting,
  professionType,
  professionColumns,
  data,
  onApply,
  // setData,
}: Props<T>) => {
  const { t } = useTranslation('import');
  const { user } = useAuth();

  const presentationColumns = useMemo(() => {
    const columns = professionColumns.map(item => {
      const column: ColumnDef<T> = {
        header: item.header,
        id: item.field,
        accessorKey: item.field as keyof T,
        cell: props => {
          const value = props.getValue();

          if (item.field?.endsWith('Id')) {
            const model = transformKebabCaseField(kebabCase(item.field));
            const queryKey = model.toUpperCase();
            return (
              <EditableDropdownCell
                {...props}
                model={model as Model}
                queryKey={[QUERIES[queryKey as keyof typeof QUERIES]]}
                className="disabled:opacity-100"
                disabled
              />
            );
          }

          if (typeof value === 'string') {
            return <TextCell {...props} />;
          }
          if (typeof value === 'number') {
            return <NumberCell {...props} />;
          }

          return value;
        },
      };
      return column;
    });

    columns.push({
      id: 'removeRow',
      header: '',
      size: 10,
      accessorKey: '',
      cell: props => {
        return (
          <DataTableRowActions
            onDelete={() => {
              props.table.options.meta?.removeRowByIndex(props.row.index);
            }}
            canDelete={true}
            // canDelete={role?.isCreate || role?.isUpdate}
          />
        );
      },
    });

    return columns;
  }, [professionColumns]);

  return (
    <div className="w-full overflow-scroll">
      <div className="grid grid-cols-24">
        <div className="col-span-24">
          <DataTable
            tableId={`${TABLES.IMPORT_CONFIGURATION_PRESENTATION}_${professionType}_${user?.userId}`}
            sortColumn="id"
            columns={presentationColumns}
            editableData={data}
            // setEditableData={setData}
            customToolbar={() => {
              return (
                <Button
                  stylingMode="contained"
                  type="default"
                  icon="download"
                  text={isImporting ? t('page.isImporting') : t('page.performImport')}
                  onClick={onImportExcel}
                />
              );
            }}
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-x-2 bg-white py-1">
        <Button
          text={applyLabel}
          className="uppercase"
          icon="check"
          stylingMode="contained"
          type="success"
          //onClick={handleApply}
          onClick={onApply}
        />
        <Button
          text={closeLabel}
          className="uppercase"
          stylingMode="outlined"
          type="default"
          icon="close"
          onClick={onClose}
        />
      </div>
    </div>
  );
};
