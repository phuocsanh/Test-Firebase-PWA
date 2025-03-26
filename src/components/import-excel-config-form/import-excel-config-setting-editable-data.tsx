import { Combobox } from '@/components/combobox';
import { DataTable, TextCell } from '@/components/data-table';
import { SheetMap } from '@/components/import-excel-config-form';
import { Button as LocalButton } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import { InputNumber } from '@/components/ui/input';
import { closeLabel, enterLabel, saveLabel, TABLES } from '@/constant';
import { useAuth } from '@/hooks';
import { ConfigImportExcel } from '@/types';
import { Button } from 'devextreme-react';
import { TableProperties } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

type Props = {
  professionType: number;
  sheetName: string | null | undefined;
  sheetMap: SheetMap;
  setEditableData: (editedData: ConfigImportExcel['items']) => void;
  editableData: ConfigImportExcel['items'];
  onClose: () => void;
  onSave: () => void;
  onResetColumn: () => void;
  rowName: number | null | undefined;
  onRowNameChange: (value: number) => void;
};

export const ImportExcelConfigSettingEditableData = ({
  sheetName,
  sheetMap,
  setEditableData,
  editableData,
  professionType,
  onClose,
  onSave,
  onResetColumn,
  rowName,
  onRowNameChange,
}: Props) => {
  const { t } = useTranslation('import');

  const { user } = useAuth();
  const [headers, setHeader] = useState<{ id: number; name: string }[]>([]);

  const settingConfigColumns = useMemo(
    () => [
      {
        header: t('fields.items.nameProfession'),
        id: 'nameProfession',
        accessorKey: 'nameProfession',
        cell: TextCell,
      },
      {
        header: t('fields.items.nameExcel'),
        id: 'nameExcel',
        accessorKey: 'nameExcel',
        cell: props => (
          <Combobox
            value={props.getValue<string>()}
            options={headers}
            valueField="name"
            className="rounded-none border-none"
            onChange={e => {
              props.table.options.meta?.updateData(props.row.index, props.column.id, e);
            }}
          />
        ),
      },
    ],
    [headers, t]
  );

  const handleChangeHeaderRow = (value: number | undefined) => {
    if (value === undefined || !sheetMap || !sheetName) return;

    const headers = sheetMap[sheetName]?.data?.[value - 1] as Record<string, string>;
    const headerOptions = Object.values(headers)
      .filter(i => i !== '')
      .map((item, index) => ({ id: index, name: item }));

    setHeader(headerOptions);

    onRowNameChange(value);
  };

  return (
    <div>
      <div className="flex items-center">
        <FormLabel className="w-[100px] text-nowrap">{t('fields.rowName')}</FormLabel>
        <InputNumber
          value={rowName!}
          className="w-full md:max-w-[250px]"
          placeholder={`${enterLabel} ${t('fields.rowName')}`}
          onChange={handleChangeHeaderRow}
        />
      </div>
      <div className="max-w-2xl">
        <DataTable
          tableId={`${TABLES.IMPORT_CONFIGURATION_SETTING}_${professionType}_${user?.userId}`}
          sortColumn="nameField"
          editableData={editableData}
          setEditableData={setEditableData}
          columns={settingConfigColumns}
          showPagination={false}
          customToolbar={() => {
            return (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <LocalButton
                        size="icon"
                        type="button"
                        variant="ghost"
                        onClick={onResetColumn}
                      >
                        <TableProperties size={16} color="#000000" strokeWidth={1.25} />
                      </LocalButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('page.resetColumn')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            );
          }}
        />
      </div>
      <div className="mt-4 flex justify-end gap-x-2 bg-white py-1">
        <Button
          text={saveLabel}
          className="uppercase"
          icon="save"
          stylingMode="contained"
          type="success"
          onClick={onSave}
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
