import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { PatternFormat } from 'react-number-format';

import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormDescription,
  FormField,
  FormImagesUploader,
  FormLabel,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { UserAvatar } from '@/components/user-avatar';
import { MUTATE, saveLabel } from '@/constant/const';
import { useAuth } from '@/hooks/use-auth';
import { useFormHandler } from '@/hooks/use-form-handler';
import { toDateType, toLocaleDate } from '@/lib/date';
import { createMutationSuccessFn } from '@/lib/i18nUtils';
import { createPutMutateFn, createQueryByIdFn } from '@/services';
import { User, defaultUserValues, userSchema } from '@/types';
import { Button, TextBox } from 'devextreme-react';

const onUserMutationSuccess = createMutationSuccessFn('user');

export const UserProfile = () => {
  const { setUser, user } = useAuth();

  const { t } = useTranslation('user');

  const { data, handleSubmit, methods } = useFormHandler<User>({
    queryKey: [MUTATE.USER, user?.userId],
    mutateKey: [MUTATE.USER],
    queryId: user?.userId,
    readFn: createQueryByIdFn<User>('user'),
    updateFn: createPutMutateFn<User>('user'),
    formatResponseFn: data => {
      return {
        ...data,
        birthday: toDateType(data.birthday),
        // userBranchIds: data?.userBranches?.map(item => item.branchId!),
      };
    },
    formatPayloadFn: data => {
      if (user) {
        setUser({
          ...user,
          uri: data.uri!,
          images: data.images!,
          areaId: data.areaId!,
          name: data.name!,
          userName: data.userName!,
        });
      }
      return {
        ...data,
        birthday: toLocaleDate(data.birthday),
      };
    },
    onUpdateSuccess: onUserMutationSuccess,
    formOptions: {
      resolver: zodResolver(userSchema),
      defaultValues: defaultUserValues,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <CardHeader className="px-0 pt-0">
          <div className="flex items-center gap-x-4">
            <UserAvatar src={data?.images ?? ''} name={data?.name ?? ''} className="h-20 w-20" />
            <div>
              <CardTitle className="text-xl font-bold tracking-tight text-primary-800">
                {data?.name}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                <span>{data?.email}</span>
                {/* <span className="ml-2 font-semibold text-primary-400">{data?.position}</span> */}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <div className="space-x-3">
          <Button
            text={saveLabel}
            className="uppercase"
            icon="save"
            stylingMode="contained"
            type="success"
            onClick={() => handleSubmit()}
          />
        </div>
      </div>
      <Separator />
      <CardContent className="max-h-[70vh] overflow-y-auto px-1 pt-6">
        <Form {...methods}>
          <form className="max-w-lg space-y-4">
            <FormField name="userName" description={t('description.userName')}>
              <TextBox readOnly />
            </FormField>
            <FormField name="name" description={t('description.name')}>
              <TextBox />
            </FormField>
            <div className="flex items-center justify-between gap-x-2">
              <FormField name="images">
                <FormImagesUploader folder="user" mode="single" />
              </FormField>
            </div>
            <FormField label={t('fields.birthday')} name={'birthday'} type="date" />
            <div>
              <FormLabel>{t('fields.phone')}</FormLabel>
              <PatternFormat
                className="mt-0.5"
                mask="x"
                allowEmptyFormatting
                format="#### ### ###"
                customInput={TextBox}
                value={data?.phone}
                onValueChange={event => methods.setValue('phone', event.value)}
              />
              <FormDescription className="text-[0.8rem] font-medium text-destructive">
                {methods.formState.errors?.phone?.message}
              </FormDescription>
            </div>
            <FormField name={'address'}>
              <TextBox readOnly />
            </FormField>
          </form>
        </Form>
      </CardContent>
    </div>
  );
};
