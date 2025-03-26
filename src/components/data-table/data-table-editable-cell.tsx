/* eslint-disable @typescript-eslint/no-unused-vars */
import { DEFAULT_DECIMAL_SCALE, MUTATE } from '@/constant/const';
import { useMutate } from '@/hooks';
import { normalizeNumeric, realNumberDecimalFormat } from '@/lib/number';
import { getCommasNumbers } from '@/lib/text';
import { cn } from '@/lib/utils';
import { uploadMulti } from '@/services';
import { ListComponentResponse, RecordAttachmentFile } from '@/types';
import { CellContext } from '@tanstack/react-table';
import { DateBox, TextArea } from 'devextreme-react';
import { dxDateBoxOptions } from 'devextreme/ui/date_box';
import { Download, Paperclip } from 'lucide-react';
import {
  ChangeEventHandler,
  ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button } from '../ui/button';
import { FormCombobox, FormComboboxProps } from '../ui/form';
import { Input } from '../ui/input';

/**
 * Editable date-picker cell
 */
const EditableDatePickerCell = <TData,>({
  getValue,
  row: { index },
  column: { id },
  table,

  // unused props
  cell,
  renderValue,
  // defaultValue,
  ...props
}: CellContext<TData, unknown> & dxDateBoxOptions & { className?: string }) => {
  // const { t } = useTranslation();

  return (
    // <FormDatePicker
    //   {...props}
    //   value={getValue()}
    //   className={cn('rounded-none border-none', props.className)}
    //   // placeholder={`${selectLabel} ${t('content.data')}`}
    //   onChange={value => {
    //     table.options.meta?.updateData(index, id, value);
    //   }}
    // />
    <DateBox
      className="before:!border-b-0 after:!border-b-0"
      inputAttr={{
        ...props,
        class: cn(props.className),
      }}
      value={getValue<Date>()}
      onValueChanged={e => {
        table.options.meta?.updateData(index, id, e.value);
      }}
      {...props}
    />
  );
};

interface EditableInputCellProps extends ComponentProps<typeof Input> {
  decimal?: number;
  onValueChange?: (value: number | string) => void;
}
/**
 * Editable input cell
 */
const EditableInputCell = <TData,>({
  getValue,
  row: { index },
  column: { id },
  table,
  type,

  decimal = DEFAULT_DECIMAL_SCALE,

  onValueChange,
  // unused props
  cell,
  renderValue,
  ...props
}: CellContext<TData, unknown> & EditableInputCellProps) => {
  // const { t } = useTranslation();

  const initialValue = getValue<string>() ?? '';
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState<string>(initialValue);
  const [number, setNumber] = useState<string>();

  /**
   * Ref to properly handle the case when user changes the index of selection cursor
   */
  const selectionStartRef = useRef<number | null>(null);
  const commasNumbers = useRef<number | null>(null);

  const isNumber = type === 'number';

  const setState = useCallback(
    (value: string) => {
      let text = value;
      let number = value;

      if (isNumber) {
        number = normalizeNumeric(value);
        setNumber(number);
        text = realNumberDecimalFormat(number, decimal);
        // number with type text -> 10000 -> 10,000
      }

      setValue(text);

      return [text, number];
    },
    [decimal, isNumber]
  );

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    if (initialValue !== undefined || initialValue !== null) {
      setState(String(initialValue));
    }
  }, [initialValue, setState]);

  // When the input is blurred, we'll call our table meta's updateData function
  const onBlur = () => {
    table.options.meta?.updateData(index, id, isNumber ? Number(number) : value);
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = event => {
    const { value, selectionStart } = event.target;
    const [text, number] = setState(value);

    const valueChange = isNumber ? number : text;
    onValueChange?.(valueChange);

    let currentSelectionStart = selectionStart || 0;

    const prevCommasNumbers = commasNumbers.current;
    const currentCommasNumbers = getCommasNumbers(text);

    if (prevCommasNumbers! < currentCommasNumbers) {
      currentSelectionStart += 1;
    }

    selectionStartRef.current = currentSelectionStart;
    commasNumbers.current = currentCommasNumbers;

    setTimeout(() => {
      event.target.setSelectionRange(currentSelectionStart, currentSelectionStart);
    }, 0);
  };

  return (
    <Input
      value={value}
      onBlur={onBlur}
      onChange={onChange}
      // placeholder={`${enterLabel.toLocaleLowerCase()} ${t('content.data').toLocaleLowerCase()}`}
      className={cn('rounded-none border-none', props.className, isNumber ? 'text-right' : '')}
      {...props}
    />
  );
};

/**
 *
 */

export const EditableTextArea = <TData,>(
  props: CellContext<TData, unknown> & EditableInputCellProps
) => {
  return (
    <TextArea
      value={props.getValue<string>()}
      onValueChange={e => {
        props.table.options.meta?.updateData(props.row.index, props.column.id, e);
      }}
      className="text-area-editable-cell !h-[32px]"
      autoResizeEnabled
    />
  );
};

/**
 * Editable dropdown cell
 */
const EditableDropdownCell = <TData, TRecord extends ListComponentResponse>({
  getValue,
  row: { index },
  column: { id },
  table,

  // unused props
  cell,
  renderValue,
  ...props
}: CellContext<TData, unknown> & FormComboboxProps<TRecord>) => {
  // const { t } = useTranslation();
  return (
    <FormCombobox<TRecord>
      {...props}
      onTableCell
      value={getValue<number>()}
      placeholder=""
      // placeholder={`${selectLabel.toLocaleLowerCase()} ${t('content.data').toLocaleLowerCase()}`}
      className={cn('rounded-none border-none', props.className)}
      onChange={value => {
        table.options.meta?.updateData(index, id, value);
        if (props.onChange) {
          props.onChange(value);
        }
      }}
    />
  );
};

const EditableFileCell = <TData extends RecordAttachmentFile>(
  props: CellContext<TData, unknown> & { folder?: string }
) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = () => {
    const link = document.createElement('a');
    const { original } = props.row;
    link.target = '_blank';
    link.href = `${original.host}${original.folder}`;
    link.click();
  };

  const handleReplaceClick = () => {
    fileInputRef.current?.click();
  };

  const { mutateAsync } = useMutate({
    mutationKey: [MUTATE.UPLOAD_FILE],
    mutationFn: uploadMulti,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files?.[0];
    if (newFile) {
      const formData = new FormData();
      formData.append('File', newFile);
      // formData.append('Type', 'xlsx');
      if (props.folder) {
        formData.append('Folder', props.folder);
      }

      mutateAsync(formData)
        .then(([response]) => {
          props.table.options.meta?.updateRowValues(
            {
              ...props.row.original,
              name: response.name,
              folder: response.src,
              fileName: response.fileName,
              host: response.host,
              size: response.size,
            },
            props.row.index
          );
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-x-1">
        <Button variant="ghost" size="icon" onClick={handleReplaceClick}>
          <Paperclip className="h-4 w-4" />
        </Button>
        <span className="truncate text-t12">{props.getValue<string>()}</span>
      </div>
      {props.folder && (
        <Button variant="ghost" size="icon" onClick={handleDownload}>
          <Download className="h-4 w-4" />
        </Button>
      )}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

/**
 * Editable download cell
 */
const EditableDownFileCell = <TData extends RecordAttachmentFile>(
  props: CellContext<TData, unknown> & { folder?: string }
) => {
  // const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = () => {
    const link = document.createElement('a');
    const { original } = props.row;
    link.target = '_blank';
    link.href = `${original.host}${original.folder}`;
    link.click();
  };

  // const handleReplaceClick = () => {
  //   fileInputRef.current?.click();
  // };

  const { mutateAsync } = useMutate({
    mutationKey: [MUTATE.UPLOAD_FILE],
    mutationFn: uploadMulti,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files?.[0];
    if (newFile) {
      const formData = new FormData();
      formData.append('File', newFile);
      // formData.append('Type', 'xlsx');
      if (props.folder) {
        formData.append('Folder', props.folder);
      }

      mutateAsync(formData)
        .then(([response]) => {
          props.table.options.meta?.updateRowValues(
            {
              ...props.row.original,
              name: response.name,
              folder: response.src,
              fileName: response.fileName,
              host: response.host,
              size: response.size,
            },
            props.row.index
          );
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-x-1">
        <span className="ml-4 truncate text-t12">{props.getValue<string>()}</span>
      </div>
      {props.folder && (
        <Button variant="ghost" size="icon" onClick={handleDownload}>
          <Download className="h-4 w-4" />
        </Button>
      )}
      <input
        type="text"
        // ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export {
  EditableDatePickerCell,
  EditableDownFileCell,
  EditableDropdownCell,
  EditableFileCell,
  EditableInputCell,
};
