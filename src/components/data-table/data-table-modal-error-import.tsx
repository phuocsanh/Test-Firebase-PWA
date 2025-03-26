import { useTranslation } from 'react-i18next';

import { DataTableErrorImport } from '@/types';
import { BasicDialog } from '../basic-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

type DataTableModalErrorImportProps = {
  open: boolean;
  toggle: () => void;
  errors: DataTableErrorImport | { message: string };
};

export const DataTableModalErrorImport = ({
  open,
  toggle,
  errors,
}: DataTableModalErrorImportProps) => {
  const { t } = useTranslation('dataTable');

  return (
    <BasicDialog
      className="max-w-3xl max-lg:max-w-none max-lg:!rounded-none"
      open={open}
      toggle={toggle}
      title={t('import.errorTitle')}
    >
      {Array.isArray(errors) ? (
        <div className="max-h-80 overflow-auto pb-[24px] md:max-h-[400px] lg:pb-4">
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead className="w-20 p-2">{t('import.errorLine')}</TableHead>
                <TableHead className="p-2">{t('import.errorNote')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {errors.map(error => (
                <TableRow key={error.line}>
                  <TableCell className="w-20 p-2 text-center">{error.line}</TableCell>
                  <TableCell className="p-2">{error.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-2xl">{errors.message}</p>
      )}
    </BasicDialog>
  );
};
