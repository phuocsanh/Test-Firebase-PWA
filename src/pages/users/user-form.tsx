import { zodResolver } from '@hookform/resolvers/zod';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RouteObject } from 'react-router-dom';

import { Combobox } from '@/components/combobox';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogFooter } from '@/components/ui/dialog';
import { Form, FormCombobox, FormDescription, FormField, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UserAvatar } from '@/components/user-avatar';
import { closeLabel, enterLabel, MUTATE, QUERIES, saveLabel } from '@/constant/const';
import { useBoolean } from '@/hooks';
import { useEntity } from '@/hooks/use-entity';
import { useFormHandler } from '@/hooks/use-form-handler';
import { toDateType, toLocaleDate } from '@/lib/date';
import { createMutationSuccessFn } from '@/lib/i18nUtils';
import routes from '@/router/routes';
import { createPostMutateFn, createPutMutateFn, createQueryByIdFn, uploadMulti } from '@/services';
import {
  defaultUserValues,
  FormInsideModalProps,
  ListComponentResponse,
  User,
  userSchema,
} from '@/types';
import { Label } from '@radix-ui/react-label';
import { Button, TextBox } from 'devextreme-react';
import { ChangeEvent, useRef } from 'react';
import { PatternFormat } from 'react-number-format';

type RouteDefault = (RouteObject & { titleKey: string })[];

const onUserMutationSuccess = createMutationSuccessFn('user');

const getFlatRoute = (routes: RouteDefault) => {
  let arrRoute: { titleKey: string; path: string }[] = [];
  routes?.map(item => {
    if (item.titleKey) {
      arrRoute.push({ titleKey: item.titleKey, path: item.path as string });
      if (item.children) {
        arrRoute = [...arrRoute, ...getFlatRoute(item.children as RouteDefault)];
      }
    }
  });
  return arrRoute;
};

export const UserForm = ({ role, editId, toggle }: FormInsideModalProps<User>) => {
  const { t } = useTranslation(['user', 'navigation']);

  const toggleForm = () => {
    if (toggle) {
      toggle();
    }
  };

  const routeOptions: (ListComponentResponse & { path: string })[] = getFlatRoute(
    routes?.routes?.[0]?.children?.[0]?.children?.[0]?.children as RouteDefault
  ).map((menuItem, index) => ({
    id: index,
    path: menuItem.path,
    name: t(menuItem.titleKey, { ns: 'navigation' }),
  }));

  const { mutateQueryItem } = useEntity<User>({ queryKey: [QUERIES.USERS], model: 'user' });

  const { handleSubmit, loading, methods } = useFormHandler<User>({
    queryKey: [MUTATE.USER, editId],
    mutateKey: [MUTATE.USER],
    invalidateKey: [QUERIES.USERS],
    queryId: editId,
    readFn: createQueryByIdFn<User>('user'),
    createFn: createPostMutateFn<User>('user'),
    updateFn: createPutMutateFn<User>('user'),
    formatResponseFn: response => {
      const data = {
        ...response,
        birthday: toDateType(response.birthday),
        dateOfIssue: response?.dateOfIssue ? toDateType(response?.dateOfIssue) : null,
        branchId: response?.branchIds?.split(',').map(Number),
      };
      return data;
    },
    formatPayloadFn: data => ({
      ...data,
      birthday: toLocaleDate(data.birthday),
      dateOfIssue: toLocaleDate(data.dateOfIssue),
    }),
    onCreateSuccess: (data, variables) => {
      mutateQueryItem({ ...variables, id: data });
      onUserMutationSuccess(data);
      toggleForm();
    },
    onUpdateSuccess: (data, variables) => {
      mutateQueryItem(variables);
      onUserMutationSuccess(data);
      toggleForm();
    },
    formOptions: {
      resolver: zodResolver(userSchema),
      defaultValues: defaultUserValues,
    },
  });

  const [phone, images, name] = useWatch({
    control: methods.control,
    name: ['phone', 'images', 'name'],
  });

  const { state: isUploading, setTrue: startUpload, setFalse: uploaded } = useBoolean();

  const onAvatarUploaded = (e: ChangeEvent<HTMLInputElement>) => {
    const [file] = e.target.files ?? [];

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('Folder', 'user');

    startUpload();
    uploadMulti(formData)
      .then(([response]) => {
        console.log('response:', response);
        if (response.src) {
          console.log(`${response.host}${response.src}`);
          methods.setValue('images', `${response.host}${response.src}`);
        }
      })
      .catch(error => {
        console.log('error:', error);
      });
    uploaded();
  };

  const uploadButtonRef = useRef<HTMLInputElement>(null);

  return (
    <Form {...methods}>
      <form className="" autoComplete="off" onSubmit={handleSubmit}>
        <div className="relative max-h-[calc(100vh-20rem)] space-y-6 overflow-auto p-1">
          <div className="grid grid-cols-1 gap-1 md:grid-cols-4">
            <div className=" top-0 flex flex-col items-center justify-start space-y-3  border-r border-gray-200">
              <UserAvatar className="h-40 w-40" src={images!} name={name!} />
              <div className="flex flex-col justify-end">
                <input
                  ref={uploadButtonRef}
                  type="file"
                  className="hidden"
                  id="upload-avatar"
                  onChange={onAvatarUploaded}
                  placeholder="upload-avatar"
                  accept="image/*"
                />
                <Button
                  id="upload-avatar"
                  stylingMode="contained"
                  text={
                    isUploading ? t('page.form.avatarIsUploading') : t('page.form.changeAvatar')
                  }
                  icon={isUploading ? 'loading' : 'file'}
                  type="success"
                  disabled={loading || (editId ? !role?.isUpdate : !role?.isCreate)}
                  onClick={() => uploadButtonRef.current?.click()}
                />
              </div>
            </div>
            <div className="col-span-3 grid grid-cols-1 gap-1 px-3 md:grid-cols-3">
              <div className="col-span-2 border-spacing-3 space-y-4 border-r border-gray-200 pr-4">
                <Label className="font-bold tracking-tighter">{t('page.form.infoFields')}</Label>
                <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                  <FormField label={t('fields.name')} name={'name'}>
                    <TextBox labelMode="hidden" placeholder={`${enterLabel} ${t('fields.name')}`} />
                  </FormField>
                  <div className="mb-2">
                    <FormLabel>{t('fields.phone')}</FormLabel>
                    <PatternFormat
                      className="mt-0.5"
                      mask="x"
                      allowEmptyFormatting
                      format="#### ### ###"
                      customInput={Input}
                      value={phone}
                      onValueChange={event => methods.setValue('phone', event.value)}
                    />

                    <FormDescription className="text-[0.8rem] font-medium text-destructive">
                      {methods.formState.errors?.phone?.message}
                    </FormDescription>
                  </div>
                </div>
                <FormField name="address" label={t('fields.address')}>
                  <TextBox labelMode="hidden" placeholder={t('fields.address')} />
                </FormField>
                <FormField name="note" label={`${t('fields.note')}`} className="col-span-3">
                  <Textarea rows={5} />
                </FormField>
              </div>
              <div className="space-y-4 pl-2">
                <Label className="font-bold tracking-tighter">{t('page.form.systemFields')}</Label>
                <div className="space-y-2">
                  <FormField label={t('fields.userName')} name={'userName'}>
                    <TextBox
                      labelMode="hidden"
                      placeholder={`${enterLabel} ${t('fields.userName')}`}
                    />
                  </FormField>
                  {!editId && (
                    <FormField label={t('fields.password')} name={'password'}>
                      <TextBox
                        labelMode="hidden"
                        mode="password"
                        placeholder={`${enterLabel} ${t('fields.password')}`}
                      />
                    </FormField>
                  )}
                  <FormField label={t('fields.email')} name={'email'}>
                    <TextBox
                      labelMode="hidden"
                      placeholder={`${enterLabel} ${t('fields.email')}`}
                    />
                  </FormField>
                  <FormField label={t('fields.position')} name={'positionId'}>
                    <FormCombobox
                      queryKey={[QUERIES.POSITION]}
                      model="position"
                      placeholder={`${enterLabel} ${t('fields.position')}`}
                    />
                  </FormField>
                  <FormField label={t('fields.departmentId')} name={'departmentId'}>
                    <FormCombobox
                      queryKey={[QUERIES.DEPARTMENT]}
                      model="department"
                      placeholder={`${enterLabel} ${t('fields.departmentId')}`}
                    />
                  </FormField>
                  <FormField label={t('fields.uri')} name={'uri'}>
                    <Combobox valueField="path" options={routeOptions} />
                  </FormField>
                  <FormField type="checkbox" name={'isActive'} label={t('fields.isActive')}>
                    <Checkbox />
                  </FormField>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-row-reverse gap-x-2 bg-white py-3">
          <Button
            stylingMode="contained"
            text={saveLabel}
            icon="save"
            type="success"
            disabled={loading || (editId ? !role?.isUpdate : !role?.isCreate)}
            useSubmitBehavior
          />
          <Button
            stylingMode="outlined"
            text={closeLabel}
            icon="close"
            disabled={loading || (editId ? !role?.isUpdate : !role?.isCreate)}
            onClick={toggleForm}
            type="default"
          />
        </DialogFooter>
      </form>
    </Form>
  );
};
