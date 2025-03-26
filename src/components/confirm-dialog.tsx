import i18next from '@/i18n';

import { cancelLabel, continueLabel } from '@/constant/const';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

type ConfirmDialogProps = {
  open: boolean;
  toggle: () => void;
  title?: string;
  description?: string | React.ReactNode | React.ReactNode[];
  onConfirm?: (e: unknown) => void;
  isDeleting?: boolean;
};

const ConfirmDialog = ({
  open,
  toggle,
  title = i18next.t('delete.areYouSure'),
  description = i18next.t('delete.actionCannotUndone'),
  onConfirm,
  isDeleting,
}: ConfirmDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={toggle}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="!text-base !font-bold">{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:bg-red-600"
          >
            <Loader2
              className={cn('animate-spin transition-all', isDeleting ? 'block' : 'hidden')}
            />
            <span className="ml-2">{continueLabel}</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const DeleteConfirmDialog = ({
  name,
  model,
  ...props
}: { name: string; model: string } & ConfirmDialogProps) => {
  const { t } = useTranslation(model);

  return (
    <ConfirmDialog
      {...props}
      description={
        <Trans
          i18nKey={'delete.actionCannotUndone'}
          values={{
            model: t('model').toLocaleLowerCase(),
            data: name,
          }}
          components={[<span className="font-bold" />]}
        />
      }
    />
  );
};

export { ConfirmDialog, DeleteConfirmDialog };
