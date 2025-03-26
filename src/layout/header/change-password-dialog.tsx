/* eslint-disable @typescript-eslint/no-misused-promises */
import notification from '@/lib/notifications';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { MUTATE, applyLabel, closeLabel } from '@/constant/const';
import { useMutate } from '@/hooks/use-mutate';
import { generateNotificationMessage } from '@/lib/i18nUtils';
import { ChangePassword, changePassword, changePasswordSchema } from '@/services';
import { ResponseFailure } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type ChangePasswordDialogProp = {
  open: boolean;
  toggle: () => void;
};

const defaultChangePasswordValues = {
  passwordOld: '',
  passwordNews: '',
  passwordConfirm: '',
};

export const ChangePasswordDialog = ({ open, toggle }: ChangePasswordDialogProp) => {
  const { t } = useTranslation('user');

  const methods = useForm<ChangePassword>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: defaultChangePasswordValues,
  });

  const { mutate: submit } = useMutate<number, ChangePassword>({
    mutationKey: [MUTATE.CHANGE_PASSWORD],
    mutationFn: changePassword,
  });

  const { reset, setError, handleSubmit } = methods;

  const onSubmit: SubmitHandler<ChangePassword> = values => {
    submit(values, {
      onSuccess: data => {
        if (data === 1) {
          const message = generateNotificationMessage({
            action: 'update',
            objectName: t('page.changePassDialog.model'),
          });
          notification.success(message);
        }
        toggle();
        reset();
      },
      onError: errors => {
        const { fieldName, message } = errors as ResponseFailure;
        if (fieldName === 'passwordOld') {
          setError('passwordOld', { type: 'manual', message });
        } else if (fieldName === 'passwordNews') {
          setError('passwordConfirm', { type: 'manual', message });
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('page.changePassDialog.header')}</DialogTitle>
          <DialogDescription>{t('page.changePassDialog.description')}</DialogDescription>
        </DialogHeader>
        <Separator />
        <Form {...methods}>
          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <FormField name="passwordOld" label={t('page.changePassDialog.fields.oldPassword')}>
              <Input type="password" placeholder="" />
            </FormField>
            <FormField name="passwordNews" label={t('page.changePassDialog.fields.newPassword')}>
              <Input type="password" placeholder="" />
            </FormField>
            <FormField
              name="passwordConfirm"
              label={t('page.changePassDialog.fields.confirmPassword')}
            >
              <Input type="password" placeholder="" />
            </FormField>
            <DialogFooter>
              <DialogTrigger>
                <Button variant={'outline'}>{closeLabel}</Button>
              </DialogTrigger>
              <Button type="submit">{applyLabel}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
