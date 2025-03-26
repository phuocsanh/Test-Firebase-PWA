import { Form, FormField, FormLabel } from '@/components/ui/form';
import { viewLabel } from '@/constant';
import { useBoolean } from '@/hooks';
import { translationWithNamespace } from '@/lib/i18nUtils';
import { callbackWithTimeout } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, DateBox } from 'devextreme-react';
import { PropsWithChildren } from 'react';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';

const requireCommon = translationWithNamespace('common');

const periodFilterSchema = z.object({
  range: z
    .array(z.date().nullable())
    .refine(item => !!item[0], {
      message: requireCommon('validation.fromDate'),
    })
    .refine(item => !!item[1], {
      message: requireCommon('validation.toDate'),
    })
    .refine(
      item => {
        const [from, to] = item;
        if (from === null || to == null) return false;
        return from <= to;
      },
      { message: requireCommon('validation.searchDate') }
    ),
});

export type PeriodFilter = z.infer<typeof periodFilterSchema> & Record<string, unknown>;

type PeriodFilterFormProps = {
  onSearch: (values: PeriodFilter) => void;
  defaultSearchValues?: PeriodFilter;
  childrenWithProps?: (props: {
    form: UseFormReturn<PeriodFilter, any, undefined>;
  }) => JSX.Element | null;
};

type CustomDateRangeBoxProps = {
  value?: [Date | undefined, Date | undefined];
  onChange?: (value: [Date | undefined, Date | undefined]) => void;
};

const CustomDateRangeBox = ({ value, onChange }: CustomDateRangeBoxProps) => {
  const { t } = useTranslation('common');
  const { state: isToDateOpened, setTrue: openToDateBox, toggle } = useBoolean(false);

  return (
    <div className="flex w-full items-center gap-x-4">
      <div className="flex flex-1 items-center">
        <FormLabel className="text-nowrap">{t('content.fromDate')}</FormLabel>
        <DateBox
          className="w-full"
          value={value?.[0]}
          onValueChanged={e => {
            if (!value) value = [e.value, undefined];
            value[0] = e.value;
            onChange?.(value);
            openToDateBox();
          }}
        />
      </div>
      <div className="flex flex-1 items-center">
        <FormLabel className="text-nowrap">{t('content.toDate')}</FormLabel>
        <DateBox
          opened={isToDateOpened}
          className="w-full"
          value={value?.[1]}
          openOnFieldClick
          onOpenedChange={toggle}
          onValueChanged={e => {
            if (!value) value = [undefined, e.value];
            value[1] = e.value;
            onChange?.(value);
            toggle();
          }}
        />
      </div>
    </div>
  );
};

export const PeriodFilterForm = ({
  onSearch,
  defaultSearchValues,
  children,
  childrenWithProps,
}: PropsWithChildren<PeriodFilterFormProps>) => {
  const methods = useForm<PeriodFilter>({
    defaultValues: defaultSearchValues as FieldValues,
    resolver: zodResolver(periodFilterSchema),
  });

  return (
    <Form {...methods}>
      <form
        // onSubmit={e => {
        //   e.preventDefault();
        //   const submit = async () => {
        //     const canSubmit = await methods.trigger();
        //     if (canSubmit) {
        //       onSearch(methods.getValues());
        //     }
        //   };
        //   callbackWithTimeout(submit);
        // }}
        className="grid w-full grid-cols-[repeat(auto-fill,minmax(27rem,1fr))] gap-x-4"
      >
        <FormField name="range" className="w-full">
          <CustomDateRangeBox />
        </FormField>

        {children}
        {childrenWithProps?.({ form: methods })}
        {/* <Button
          variant={'ghost'}
          type="submit"
          size="icon"
          className="mt-0.5 w-fit justify-start whitespace-nowrap px-3"
        >
          <Search className="mr-1" size={16} strokeWidth={1.25} />
          {viewLabel}
        </Button> */}
        <Button
          text={viewLabel}
          className="w-fit"
          stylingMode="contained"
          type="default"
          icon="search"
          onClick={() => {
            const submit = async () => {
              const canSubmit = await methods.trigger();
              if (canSubmit) {
                onSearch(methods.getValues());
              }
            };
            callbackWithTimeout(submit);
          }}
          //
        />
      </form>
    </Form>
  );
};
