import i18next from '@/i18n';

import { DEFAULT_DECIMAL_SCALE, FORMAT_DATE } from '@/constant/const';
import { formatDate, toLocaleDate } from '@/lib/date';
import { realNumberDecimalFormat } from '@/lib/number';
import { cn } from '@/lib/utils';
import { CellContext } from '@tanstack/react-table';
import { PatternFormat } from 'react-number-format';
import { Badge } from '../ui/badge';
import { UserAvatar } from '../user-avatar';

/**
 *
 */
const DateCell = <TData, TValue>({ getValue }: CellContext<TData, TValue>) => {
  const date = getValue<string>();
  const localDate = toLocaleDate(date);

  if (!localDate || date === '0001-01-01T00:00:00') {
    return null;
  }

  return (
    <div className="px-3 py-1 text-center leading-6">{formatDate(localDate, FORMAT_DATE)}</div>
  );
};

/**
 *
 */
const TextCell = <TData, TValue>({
  getValue,
  className = '',
}: CellContext<TData, TValue> & { className?: string }) => (
  <div className={`px-3 py-1 text-left leading-6 ${className}`}>{getValue<string>()}</div>
);

/**
 *
 */
const NumberCell = <TData, TValue>({
  getValue,
  className = '',
  defaultDecimalScale = DEFAULT_DECIMAL_SCALE,
}: CellContext<TData, TValue> & { className?: string; defaultDecimalScale?: number }) => (
  <div className={`whitespace-nowrap px-3 py-1 text-right leading-6 ${className}`}>
    {realNumberDecimalFormat(getValue<string>(), defaultDecimalScale) || '0'}
  </div>
);

/**
 *
 */
const InActiveCell = <TData, TValue>({ getValue }: CellContext<TData, TValue>) => {
  const value = getValue<boolean>();
  const text = value ? i18next.t('content.isInActive') : i18next.t('content.isActive');
  const className = value
    ? 'bg-gray-200 hover:bg-gray-200 text-gray-500'
    : 'bg-success-100 text-success-600 hover:bg-success-100';

  return <Badge className={`w-[max-content] py-0 text-xs font-normal ${className}`}>{text}</Badge>;
};

/**
 *
 */
const BooleanCell = <TData, TValue>({
  getValue,
  rightText = i18next.t('content.isActive'),
  wrongText = i18next.t('content.isInActive'),
}: CellContext<TData, TValue> & { rightText?: string; wrongText?: string }) => {
  const value = getValue<boolean>();
  const text = value ? rightText : wrongText;
  const className = value
    ? 'bg-success-100 text-success-600 hover:bg-success-100'
    : 'bg-gray-200 hover:bg-gray-200 text-gray-500';

  return <Badge className={`w-[max-content] ${className} py-0 text-xs font-normal`}>{text}</Badge>;
};

/**
 *
 */
const NationVietNamesePhoneCell = <TData, TValue>({
  getValue,
  format = '(+##) ### ### ###',
}: CellContext<TData, TValue> & { format: string }) => {
  return (
    <PatternFormat
      mask="x"
      disabled
      allowEmptyFormatting
      format={`${format}`}
      className="mt-2 bg-transparent px-3 py-1 text-right leading-6"
      value={getValue<string>()}
    />
  );
};

/**
 *
 */
const PictureCell = <TData, TValue>({
  getValue,
  className,
}: CellContext<TData, TValue> & { className?: string }) => {
  const value = getValue<string>() || '';
  return (
    <div className="flex justify-center">
      <UserAvatar src={value} name={value} className={cn('h-20 w-28 rounded-sm ', className)} />
    </div>
  );
};

/**
 *
 */
const YesNoCell = <TData, TValue>({ getValue }: CellContext<TData, TValue>) => {
  const value = getValue<boolean>();
  const text = value ? i18next.t('content.yes') : i18next.t('content.no');
  const className = value
    ? 'bg-success-100 text-success-600 hover:bg-success-100'
    : 'bg-gray-200 hover:bg-gray-200 text-gray-500';

  return <Badge className={`w-[max-content] ${className} py-0 text-xs font-normal`}>{text}</Badge>;
};

export {
  BooleanCell,
  DateCell,
  InActiveCell,
  NationVietNamesePhoneCell,
  NumberCell,
  PictureCell,
  TextCell,
  YesNoCell,
};
