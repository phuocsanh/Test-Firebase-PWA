/**
 * International common case
 */
import i18next from '@/i18n';
import notification from './notifications';
import { capitalizeFirstLetter } from './text';

export type Action =
  | 'save'
  | 'create'
  | 'edit'
  | 'update'
  | 'delete'
  | 'copy'
  | 'back'
  | 'close'
  | 'enter'
  | 'cancel'
  | 'continue'
  | 'select'
  | 'search'
  | 'import'
  | 'export'
  | 'ok'
  | 'scan'
  | 'apply'
  | 'saveTemp'
  | 'send'
  | 'backToHome'
  | 'view'
  | 'add'
  | 'attach'
  | 'downloadTemplate'
  | 'clone'
  | 'getData'
  | 'reject';

export type Status = 'success' | 'fail';

/**
 *
 */
export const generateRequiredValidationMessage = ({
  action = 'enter',
  fieldName,
}: {
  action?: Extract<Action, 'enter' | 'select'>;
  fieldName: string;
}): string => {
  const requiredText = i18next
    .t('validation.required', {
      ns: 'common',
      action: getActionLabel(action),
      fieldName,
    })
    .toLocaleLowerCase();

  return capitalizeFirstLetter(requiredText);
};

/**
 * Create a translation function for a specific namespace.
 *
 * @param namespace - The namespace for translation.
 * @returns A translation function.
 */
export const translationWithNamespace = (namespace: string) => (key: string) =>
  i18next.t(key, { ns: namespace });

/**
 *
 * @param namespace
 * @returns
 */
export const requiredTextWithNamespace = (namespace: string) => {
  return (fieldName: string, action?: 'enter' | 'select') => {
    return generateRequiredValidationMessage({
      action: action || 'enter',
      fieldName: i18next.t(`fields.${fieldName}`, { ns: namespace }),
    });
  };
};

/**
 *
 * @returns
 */
export const generateNotificationMessage = ({
  action = 'create',
  objectName,
  status = 'success',
}: {
  action?: Extract<Action, 'create' | 'update' | 'delete' | 'apply'>;
  objectName: string;
  status?: Status;
}): string => {
  const statusNotify = i18next.t(`notification.${status}`, {
    ns: 'common',
  });
  const label = `${
    getActionLabel(action) as string
  } ${objectName} ${statusNotify}`.toLocaleLowerCase();

  return capitalizeFirstLetter(label);
};

/**
 *
 */
export const getActionLabel = (keys: Action | Action[]): string | string[] => {
  if (Array.isArray(keys)) {
    return keys.map(key => {
      return i18next.t(`action.${key}`, { ns: 'common' });
    });
  }

  return i18next.t(`action.${keys}`, { ns: 'common' });
};

/**
 *
 */
export const createMutationSuccessFn = (ns: string) => (data: number) => {
  if (!data) {
    return;
  }

  const message = generateNotificationMessage({
    action: data === 1 ? 'update' : 'create',
    objectName: i18next.t('model', { ns }),
  });

  notification.success(message);

  return message;
};
