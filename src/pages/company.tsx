import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { FormLayoutGroup } from '@/components/form-layout-group';
import { PageLayout } from '@/components/page-layout';
import { Form, FormDescription, FormField, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MUTATE, enterLabel } from '@/constant/const';
import { PERMISSIONS } from '@/constant/permissions';
import { useFormHandler } from '@/hooks/use-form-handler';
import { usePermission } from '@/hooks/use-permission';
import { createMutationSuccessFn } from '@/lib/i18nUtils';
import { createPutMutateFn, createQueryByIdFn } from '@/services';
import { CompanyType, companySchema } from '@/types';
import { PatternFormat } from 'react-number-format';
import { SyntheticEvent } from 'react';

export const DEFAULT_COMPANY_ID = 8;

const defaultCompanyValues = {
  id: DEFAULT_COMPANY_ID,
  code: '',
  isDelete: false,
  isInactive: false,
  phone: undefined,
  representative: undefined,
  accountNumber: null,
  address: null,
  bankAccount: null,
  bankAddress: null,
  description: null,
  fax: null,
  name: null,
  position: null,
  storeId: 0,
  taxCode: null,
};

const onCompanyMutationSuccess = createMutationSuccessFn('company');

export const Company = () => {
  const { t } = useTranslation('company');
  const role = usePermission(PERMISSIONS.COMPANY);

  const { data, handleSubmit, methods } = useFormHandler<CompanyType>({
    queryKey: [MUTATE.COMPANY, DEFAULT_COMPANY_ID],
    mutateKey: [MUTATE.COMPANY],
    queryId: DEFAULT_COMPANY_ID,
    readFn: createQueryByIdFn<CompanyType>('company'),
    updateFn: createPutMutateFn<CompanyType>('company'),
    onUpdateSuccess: data => {
      onCompanyMutationSuccess(data);
    },
    formOptions: {
      resolver: zodResolver(companySchema),
      defaultValues: defaultCompanyValues,
    },
  });

  return (
    <PageLayout
      header={t('page.header')}
      description={t('page.description')}
      onSaveChange={e => {
        handleSubmit(e as unknown as SyntheticEvent<HTMLElement>);
      }}
      canSaveChange={role?.isUpdate}
    >
      <Form {...methods}>
        <form className="space-y-6" autoComplete="off">
          <div className="space-y-8">
            <FormLayoutGroup groupName={t('page.businessFieldsGroup')}>
              <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
                <FormField label={t('fields.code')} name={'code'}>
                  <Input placeholder={`${enterLabel} ${t('fields.code')}`} />
                </FormField>
                <FormField label={t('fields.name')} name={'name'}>
                  <Input placeholder={`${enterLabel} ${t('fields.name')}`} />
                </FormField>
                <FormField label={t('fields.address')} name={'address'}>
                  <Input placeholder={`${enterLabel} ${t('fields.address')}`} />
                </FormField>
                <FormField label={t('fields.taxCode')} name={'taxCode'}>
                  <Input placeholder={`${enterLabel} ${t('fields.taxCode')}`} />
                </FormField>
                <div className="gap-1">
                  <FormLabel
                    className={t(
                      methods.formState.errors?.phone?.message ? 'text-destructive' : ''
                    )}
                  >
                    {t('fields.phone')}
                  </FormLabel>
                  {/* <FormField label={t('fields.phone')} name={'phone'}> */}
                  {/* <Input placeholder={`${enterLabel} ${t('fields.phone')}`} /> */}
                  <PatternFormat
                    className="mt-0.5"
                    mask="x"
                    allowEmptyFormatting
                    format="#### ### ###"
                    customInput={Input}
                    value={data?.phone}
                    onValueChange={event => methods.setValue('phone', event.value)}
                  />
                  <FormDescription className="text-destructive mt-2 text-[0.8rem] font-medium">
                    {methods.formState.errors?.phone?.message}
                  </FormDescription>
                </div>
                {/* </FormField> */}
                <FormField label={t('fields.fax')} name={'fax'}>
                  <Input placeholder={`${enterLabel} ${t('fields.fax')}`} />
                </FormField>
              </div>
            </FormLayoutGroup>
            <FormLayoutGroup groupName={t('page.representativeFieldsGroup')}>
              <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
                <FormField label={t('fields.representative')} name={'representative'}>
                  <Input placeholder={`${enterLabel} ${t('fields.representative')}`} />
                </FormField>
                <FormField label={t('fields.position')} name={'position'}>
                  <Input placeholder={`${enterLabel} ${t('fields.position')}`} />
                </FormField>
                <FormField label={t('fields.bankAccount')} name={'bankAccount'}>
                  <Input placeholder={`${enterLabel} ${t('fields.bankAccount')}`} />
                </FormField>
                <FormField label={t('fields.bankAddress')} name={'bankAddress'}>
                  <Input placeholder={`${enterLabel} ${t('fields.bankAddress')}`} />
                </FormField>
                <FormField label={t('fields.accountNumber')} name={'accountNumber'}>
                  <Input placeholder={`${enterLabel} ${t('fields.accountNumber')}`} />
                </FormField>
              </div>
              <FormField name="description" label={t('fields.description')} className="col-span-2">
                <Textarea rows={4} placeholder={`${enterLabel} ${t('fields.description')}`} />
              </FormField>
            </FormLayoutGroup>
          </div>
        </form>
      </Form>
    </PageLayout>
  );
};
