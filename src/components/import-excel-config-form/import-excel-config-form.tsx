import axiosInstance, { request } from '@/axios-instance';
import {
  ImportExcelConfigPresentEditableData,
  ImportExcelConfigSettingEditableData,
} from '@/components/import-excel-config-form';
import { FormField, FormLabel } from '@/components/ui/form';
import { InputNumber } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { enterLabel, MUTATE, QUERIES, selectLabel } from '@/constant';
import { useAuth, useBoolean, useMutate } from '@/hooks';
import { createMutationSuccessFn } from '@/lib/i18nUtils';
import notification from '@/lib/notifications';
import { callbackWithTimeout } from '@/lib/utils';
import { createPostMutateFn, createPutMutateFn, Model, Payload, postRequest } from '@/services';
import { ConfigImportExcel, DataTableErrorImport, ResponseFailure } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, SelectBox, TextBox } from 'devextreme-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';
import { DataTableModalErrorImport } from '../data-table/data-table-modal-error-import';
import { getRandomNumber } from '@/lib/number';

export type SheetMap = Record<
  string,
  {
    data: any[];
    range: XLSX.Range;
  }
>;

export type ProfessionColumn = {
  field: string | undefined;
  header: string | undefined;
  // meta: ColumnMeta<TData, unknown>;
};

type Props<T> = {
  professionColumns: ProfessionColumn[];
  professionType: number;
  onClose: () => void;
  onImported: () => void;
  importModel: Model;
  onApply: (data: T[]) => void;
};

const onMutateSuccess = createMutationSuccessFn('import');
export const ImportExcelConfigForm = <T extends Payload>({
  professionColumns,
  professionType,
  onClose,
  onImported,
  importModel,
  onApply,
}: Props<T>) => {
  const { t } = useTranslation('import');

  const [file, setFile] = useState<File>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sheetNamesRef = useRef<string[]>();
  const sheetMapRef = useRef<SheetMap>({});

  // const { data: professtionTypes } = useQuery({
  //   queryKey: [QUERIES.PROFESSION_TYPES],
  //   queryFn: async () => await request(axiosInstance.get('/common/get-profession-type')),
  // });

  // State quản lý việc hiển thị modal lỗi
  const { state: openErrorImport, toggle: toggleErrorImport } = useBoolean();
  const [errorsImport, setErrorsImport] = useState<DataTableErrorImport>([]);

  const { data: config, refetch } = useQuery({
    queryKey: [QUERIES.CONFIG_IMPORT_BY_PROFESSION, professionType],
    queryFn: async () =>
      await request<ConfigImportExcel>(
        axiosInstance.get(
          `/config-import-excel/get-by-type-profession?typeProfession=${professionType}`
        )
      ),
    enabled: !!professionType,
  });
  // console.log('config:', config);

  const { user } = useAuth();

  const createMutateFn = !config ? createPostMutateFn : createPutMutateFn;
  const { mutate: mutateConfig } = useMutate({
    mutationKey: [MUTATE.CONFIG_IMPORT_EXCEL, professionType, user!.userId],
    mutationFn: createMutateFn('config-import-excel'),
  });

  const { mutate: importExcel, isPending } = useMutation<
    T[],
    ResponseFailure & { errors: DataTableErrorImport },
    FormData
  >({
    mutationKey: [importModel, MUTATE.IMPORT_EXCEL],
    mutationFn: (payload: FormData) => {
      return postRequest(`${importModel}/import-list`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  });

  const [values, setValues] = useState<ConfigImportExcel>({
    id: 0,
    professionType,
    userId: user!.userId,
    sheetName: '',
    fromRow: 0,
    toRow: 0,
    rowName: 0,
    storeId: 0,
    items: professionColumns.map(column => {
      return {
        id: 0,
        configImportExcelId: 0,
        nameProfession: column.header || '',
        nameExcel: '',
        sort: 0,
        nameField: column.field || '',
      };
    }),
  });

  useEffect(() => {
    if (values.id !== 0 || !config) return;
    setValues(config);
    if (!config.sheetName) return;
    sheetNamesRef.current = [config.sheetName];
  }, [config, values]);

  const handleChange = (name: string, value: string | number | any[] | undefined) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleResetColumns = () => {
    setValues(prev => ({
      ...prev,
      items: professionColumns.map(column => {
        return {
          id: 0,
          configImportExcelId: 0,
          nameProfession: column.header || '',
          nameExcel: '',
          sort: 0,
          nameField: column.field || '',
        };
      }),
    }));
  };

  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target?.result) return;

      const data = e.target.result as ArrayBuffer;
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetNames = workbook.SheetNames;

      const sheets: SheetMap = {};

      sheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];

        // Find the last row with data (to dynamically adjust range)
        const worksheetRange = worksheet['!ref'];
        if (!worksheetRange) return;

        const range = XLSX.utils.decode_range(worksheetRange);

        // Get the last row and last column in the sheet
        const lastRow = range.e.r; // Last row index
        const lastColumn = range.e.c; // Last column index

        // Convert the column index to the corresponding Excel column (e.g., 0 -> A, 25 -> Z, 26 -> AA, etc.)
        const lastColumnLetter = XLSX.utils.encode_col(lastColumn);

        // Construct the dynamic range to cover all data in the sheet (up to the last column and last row)
        const dynamicRange = `A1:${lastColumnLetter}${lastRow + 1}`;

        const sheetData = XLSX.utils.sheet_to_json(worksheet, {
          header: 'A',
          blankrows: true, // Include blank rows
          defval: '', // Define a placeholder value for blank cells
          range: dynamicRange, // Dynamic range based on the actual size of the sheet
        });

        sheets[sheetName] = { data: sheetData, range };
      });

      sheetMapRef.current = sheets;
      sheetNamesRef.current = sheetNames;

      setValues(prev => {
        if (!prev.sheetName) return prev;
        return { ...prev, toRow: sheets[prev.sheetName]?.range?.e?.r ?? 0 };
      });
      setFile(file);
    };

    event.target.value = '';
  };

  const handleSave = () => {
    mutateConfig(values, {
      onSuccess: data => {
        const message = onMutateSuccess(data);
        toast({ title: message, variant: 'success' });
        callbackWithTimeout(refetch);
      },
    });
  };

  const handleApply = () => {
    onApply(data);
  };

  const [data, setData] = useState<T[]>([]);
  const handleImportExcel = () => {
    if (
      !file ||
      values.fromRow === null ||
      values.fromRow === undefined ||
      values.toRow === null ||
      values.toRow === undefined ||
      !values.sheetName
    )
      return;

    const formData = new FormData();

    formData.append('File', file);
    formData.append('FromRow', values.fromRow.toString());
    formData.append('ToRow', values.toRow.toString());
    formData.append('SheetName', values.sheetName);

    importExcel(formData, {
      onSuccess: data => {
        setData(data.map(i => ({ ...i, id: -getRandomNumber() })));
        onImported();
      },
      onError: e => {
        if (Array.isArray(e?.errors) && e.errors) {
          setErrorsImport(e?.errors);
          toggleErrorImport();
        } else {
          notification.error(e.message);
        }
      },
    });
  };

  return (
    <div className="w-full">
      <div className="grid max-w-2xl grid-cols-2 gap-x-8 gap-y-4">
        <div className="col-span-2 flex w-full items-center">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Button
            stylingMode="contained"
            type="default"
            text={`${selectLabel} ${t('fields.file').toLowerCase()}`}
            onClick={() => handleSelectFileClick()}
            className="mr-4 w-[121px]"
          />
          <FormField name="fileName" className="w-full">
            <TextBox
              placeholder={`${selectLabel} ${t('fields.file').toLowerCase()}`}
              value={file?.name}
              className="!text-black"
              onValueChange={value => {
                handleChange('fileName', value);
              }}
            />
          </FormField>
        </div>
        <div className="col-span-1 flex w-full items-center">
          <FormLabel className="w-[161px]">{t('fields.sheetName')}</FormLabel>
          <SelectBox
            dataSource={sheetNamesRef.current}
            className="w-full"
            value={values.sheetName}
            placeholder={`${selectLabel} ${t('fields.sheetName')}`}
            onValueChange={(e: string) => {
              setValues(prev => ({
                ...prev,
                sheetName: e,
                toRow: sheetMapRef?.current?.[e]?.range?.e?.r ?? 0,
              }));
            }}
            showClearButton
          />
        </div>
        <div />
        <div className="flex w-full items-center">
          <FormLabel className="w-[161px]">{t('fields.fromRow')}</FormLabel>
          <InputNumber
            value={values.fromRow!}
            className="w-full"
            placeholder={`${enterLabel} ${t('fields.fromRow')}`}
            onChange={value => {
              handleChange('fromRow', value);
            }}
          />
        </div>
        <div className="flex w-full items-center">
          <FormLabel className="w-[161px]">{t('fields.toRow')}</FormLabel>
          <InputNumber
            value={values.toRow!}
            className="w-full"
            placeholder={`${enterLabel} ${t('fields.toRow')}`}
            onChange={value => {
              handleChange('toRow', value);
            }}
          />
        </div>
      </div>
      <div className="mt-8">
        <Tabs defaultValue="data">
          <div className="w-full">
            <TabsList>
              <TabsTrigger value="data">{t('page.tabs.data')}</TabsTrigger>
              <TabsTrigger value="personalConfiguration">
                {t('page.tabs.personalConfiguration')}
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="data" className="mt-2">
            <ImportExcelConfigPresentEditableData<T>
              data={data}
              onClose={onClose}
              onApply={handleApply}
              professionType={professionType}
              onImportExcel={handleImportExcel}
              isImporting={isPending}
              professionColumns={professionColumns}
            />
          </TabsContent>
          <TabsContent value="personalConfiguration" className="mt-4">
            <ImportExcelConfigSettingEditableData
              professionType={professionType}
              editableData={values.items}
              setEditableData={editedData => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                handleChange('items', editedData);
              }}
              onClose={onClose}
              onSave={handleSave}
              rowName={values.rowName}
              sheetName={values.sheetName}
              sheetMap={sheetMapRef.current}
              onResetColumn={handleResetColumns}
              onRowNameChange={(rowName: number) => handleChange('rowName', rowName)}
            />
          </TabsContent>
        </Tabs>
      </div>
      <DataTableModalErrorImport
        open={openErrorImport}
        toggle={toggleErrorImport}
        errors={errorsImport}
      />
    </div>
  );
};
