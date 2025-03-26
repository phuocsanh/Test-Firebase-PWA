import { applyLabel, cancelLabel } from '@/constant';
import { DataTableProps } from '@/types';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Combobox } from '../combobox';
import { Button } from '../ui/button';
import { Form, FormField } from '../ui/form';
import { getAppearanceMobile, saveAppearanceMobile } from './data-table-helper';
import { useDataTableInstance } from './data-table-provider';
import { useBoolean } from '@/hooks';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';
import { Button as DevButton } from 'devextreme-react';

export type MobileViewOptions = {
  position1?: string;
  position2?: string;
  position3?: string;
  position4?: string;
  position5?: string;
  position6?: string;
};

export const DataTableViewOptionsMobile = <TData, TValue>({
  tableId,
  className,
}: Pick<DataTableProps<TData, TValue>, 'tableId'> & { className?: string }) => {
  const { t } = useTranslation('dataTable');
  const { table, setMobileViewOptions } = useDataTableInstance();
  const { state: open, toggle } = useBoolean();

  const columnOptions = table
    .getAllColumns()
    .filter(i => i.columnDef.id !== 'select')
    .map((item, index) => ({
      id: index,
      value: item.columnDef.id,
      name: String(item.columnDef.header),
    }));

  const appearanceMobile = getAppearanceMobile(tableId);

  const form = useForm<MobileViewOptions>({ defaultValues: appearanceMobile! });

  const onSubmit = (values: MobileViewOptions) => {
    toggle();
    setTimeout(() => {
      if (values !== null) {
        setMobileViewOptions(values);
        saveAppearanceMobile(tableId, values);
      }
    }, 100);
  };

  return (
    <>
      <Button variant="ghost" size="icon" className="" onClick={toggle}>
        <MixerHorizontalIcon className="size-4 text-slate-600" />
      </Button>
      {open && (
        <div
          className={cn(
            'fixed inset-0 z-10 h-[calc(100%-var(--toastify-toast-max-height))] bg-white p-3',
            className
          )}
        >
          <Form {...form}>
            <form
              className="space-y-2"
              onSubmit={e => {
                e.preventDefault();
                // console.log('hay khoc di khoc di dung ngai ngung');
                // void form.handleSubmit(onSubmit)(e);
              }}
            >
              <p className="font-bold">{t('viewOptions.label')}</p>
              <Separator />
              <div className="space-y-3 px-3 py-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{t('viewOptions.position.1')}</p>
                  <p className="font-semibold">{t('viewOptions.position.2')}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-normal text-muted-foreground">{t('viewOptions.position.3')}</p>
                  <p className="font-normal text-muted-foreground">{t('viewOptions.position.4')}</p>
                  <p className="font-normal text-muted-foreground">{t('viewOptions.position.5')}</p>
                  <p className="font-normal text-muted-foreground">{t('viewOptions.position.6')}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-0 gap-x-1 p-3 py-1">
                <FormField name="position1" label={t('viewOptions.position.1')}>
                  <Combobox valueField="value" options={columnOptions} className="" />
                </FormField>
                <FormField name="position2" label={t('viewOptions.position.2')}>
                  <Combobox valueField="value" options={columnOptions} className="" />
                </FormField>
                <FormField name="position3" label={t('viewOptions.position.3')}>
                  <Combobox valueField="value" options={columnOptions} className="" />
                </FormField>
                <FormField name="position4" label={t('viewOptions.position.4')}>
                  <Combobox valueField="value" options={columnOptions} className="" />
                </FormField>
                <FormField name="position5" label={t('viewOptions.position.5')}>
                  <Combobox valueField="value" options={columnOptions} className="" />
                </FormField>
                <FormField name="position6" label={t('viewOptions.position.6')}>
                  <Combobox valueField="value" options={columnOptions} />
                </FormField>
              </div>
              <div className="absolute bottom-0 right-3 flex w-full flex-row flex-wrap items-center justify-end gap-x-2 bg-white py-2">
                <DevButton type="normal" onClick={toggle}>
                  <span>{cancelLabel}</span>
                </DevButton>
                <DevButton
                  type="success"
                  onClick={() => {
                    onSubmit(form.getValues());
                  }}
                >
                  <span>{applyLabel}</span>
                </DevButton>
              </div>
            </form>
          </Form>
        </div>
      )}
    </>
  );
};
