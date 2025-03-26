import * as LabelPrimitive from '@radix-ui/react-label';
import * as React from 'react';

import { Label } from '@/components/ui/label';
import { FORMAT_DATE_FORM, FORMAT_DATE_TIME } from '@/constant/const';
import { useEntity } from '@/hooks/use-entity';
import { setImagesToUploadControl } from '@/lib/file';
import { capitalizeFirstLetter } from '@/lib/text';
import { atBottom, cn, displayExpr } from '@/lib/utils';
import { Model, Payload, createQueryComponentFn } from '@/services';
import { ListComponentResponse, PaginationResponse, QueryListComponentType } from '@/types';
import { Slot } from '@radix-ui/react-slot';
import { QueryKey } from '@tanstack/react-query';
import { format, isValid, parse } from 'date-fns';
import { RadioGroup, SelectBox, TagBox } from 'devextreme-react';
import { RadioGroupTypes } from 'devextreme-react/cjs/radio-group';
import ColorBox, { ColorBoxTypes } from 'devextreme-react/color-box';
import DateBox from 'devextreme-react/date-box';
import { CalendarIcon } from 'lucide-react';
import {
  CaptionLayout,
  DateRange,
  DayPickerRangeProps,
  DayPickerSingleProps,
  SelectRangeEventHandler,
  SelectSingleEventHandler,
  isDateRange,
} from 'react-day-picker';
import {
  Controller,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form';
import { Combobox } from '../combobox';
import { ImageFile, UploadImageRef, UploadImages, UploadImagesProps } from '../upload-images';
import { Button } from './button';
import { Calendar, CalendarProps } from './calendar';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const Form = FormProvider;

type FormProps = {
  label?: string;
  description?: string;
  placeholder?: string;
  type?: FormFieldType;
  // onChange?: unknown;
  isRequired?: boolean;
  // children?: React.ReactNode | React.ReactNode[];
};

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

// const FormField = <
//   TFieldValues extends FieldValues = FieldValues,
//   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
// >({
//   children,
//   ...props
// }: ControllerProps<TFieldValues, TName> & {
//   children: React.ReactElement; //
// }) => {
//   const { control } = useFormContext<TFieldValues>();

//   return (
//     <FormFieldContext.Provider value={{ name: props.name }}>
//       <Controller
//         {...props}
//         control={control}
//         name={props.name}
//         render={({ field }) => <FormItem {...field}>{children}</FormItem>}
//       />
//     </FormFieldContext.Provider>
//   );
// };

type FormFieldType = 'text' | 'number' | 'checkbox' | 'date' | 'custom' | 'select';

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  name,
  children,
  ...props
}: { name: TName; type?: FormFieldType } & FormProps &
  Partial<Omit<ControllerRenderProps<TFieldValues, TName>, 'ref'>> &
  Partial<React.HTMLAttributes<HTMLInputElement>>) => {
  const { control } = useFormContext<TFieldValues>();
  return (
    <FormFieldContext.Provider value={{ name: name }}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormItem {...field} {...props} label={label}>
            {children}
          </FormItem>
        )}
      />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

type FormItemProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = React.HTMLAttributes<HTMLDivElement> &
  FormProps &
  Omit<ControllerRenderProps<TFieldValues, TName>, 'ref'>;

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

const getPlaceholder = (children: React.ReactNode): string => {
  // Check if children is a valid react eleemnt and has 'props' with a 'placeholder'
  if (React.isValidElement(children) && 'props' in children) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return children.props.placeholder ? children.props.placeholder.toLowerCase() : '';
  }
  return '';
};

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className = '', children, label, description, type, isRequired, ...props }, ref) => {
    const id = React.useId();

    const placeholder = capitalizeFirstLetter(getPlaceholder(children));

    const getClassName = () => {
      if (type === 'checkbox') {
        return className + ' flex flex-row items-start space-x-3 space-y-0 p-1';
      }

      if (type === 'select') {
        return className + ' w-full';
      }

      return className;
    };

    const renderChild = () => {
      if (!React.isValidElement(children)) {
        children = <Input />;
      }

      if (type === 'date') {
        // children = <FormDatePicker />;
        children = (
          <DateBox applyValueMode="instantly" useMaskBehavior useMaskedValue {...children.props} />
        );
      }

      if (type === 'checkbox') {
        return (
          <>
            <FormControl>
              {/* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */}
              {React.cloneElement(children, {
                ...props,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                className: cn(children.props?.className),
                id: props.id || children.props.id || id,
                checked: props.value as boolean,
                onCheckedChange: (checked: boolean) =>
                  props.onChange({ target: { value: checked, name: props.name } }),
                onValueChange: (e: boolean | null | undefined) => {
                  props.onChange({ target: { value: e, name: props.name } });
                },
                ...children.props,
                placeholder,
              })}
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="first-letter:uppercase">{label}</FormLabel>
              <FormDescription>{description}</FormDescription>
            </div>
          </>
        );
      }
      return (
        <>
          {label && (
            <FormLabel className="first-letter:uppercase">
              {label}
              {isRequired && label && label !== '' && <span className="text-red-600">*</span>}
            </FormLabel>
          )}
          <FormControl>
            {/*eslint-disable-next-line @typescript-eslint/no-unsafe-argument*/}
            {React.cloneElement(children, {
              label,
              ...props,
              ...children.props,
              onChange: (e: { event: { currentTarget: { value: unknown } } }) => {
                if (e?.event) {
                  let value = e.event.currentTarget.value || null;
                  if (type === 'date' && value) {
                    const [day, month, year] = String(value).split('/').map(Number);
                    if (day && month && year) {
                      value = new Date(year, month - 1, day);
                    }
                  }
                  props.onChange({
                    target: { value, name: props.name },
                  });
                } else {
                  props.onChange(e);
                }
              },
              onValueChange: (e: unknown) => {
                props.onChange({ target: { value: e, name: props.name } });
              },

              // onValueChanged: (e: { value }) => {
              //   console.log(e.value);
              //   props.onChange({ target: { value: e.value, name: props.name } });
              // },
              placeholder,
              id: props.id || children.props.id || id,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
              className: cn(children.props?.className),
            })}
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </>
      );
    };

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn('space-y-0.5', getClassName())}>
          {renderChild()}
        </div>
      </FormItemContext.Provider>
    );
  }
);
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { name?: string }
>(({ className, name, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  const { control } = useFormContext();
  const hasRequired = React.useRef(false);

  React.useEffect(() => {
    if (!name) {
      return;
    }

    control._options.resolver &&
      control?._executeSchema &&
      control
        ._executeSchema([name])
        .then(data => {
          if (['invalid_type', 'too_small'].includes(data.errors[name]?.type as string)) {
            hasRequired.current = true;
          }
        })
        .catch(error => {
          console.error('error:', error);
        });
  }, [control, name]);

  return (
    <Label
      ref={ref}
      className={cn(
        error && 'text-destructive',
        'text-left',
        // 'text-right',
        'mr-4', // mr-1 = margin-right: 4px, mr-2 = margin-right: 8px, mr-3 = margin-right:12px, mr-4: margin-rigth: 16px
        className
      )}
      htmlFor={formItemId}
      {...props}
    >
      {/* {hasRequired.current ? <Required /> : ''} */}
      {props.children}
      {hasRequired.current ? <Required /> : ''}
    </Label>
  );
});
FormLabel.displayName = 'FormLabel';

const Required = () => <span className="ml-1 text-red-600">*</span>;

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-[0.8rem] text-muted-foreground', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-[0.8rem] font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

/**
 * Utilities components
 */
export type FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = FormProps &
  CalendarProps &
  Partial<Omit<ControllerRenderProps<TFieldValues, TName>, 'ref'>> & {
    showTimePicker?: boolean;
  };

const FormDatePicker = ({
  mode = 'single',
  name,
  value,
  onChange,
  className,
  disabled,
  showTimePicker,
  ...props
}: FormDatePickerProps) => {
  const [startValue, setStartValue] = React.useState<string>('');
  const [endValue, setEndValue] = React.useState<string>('');

  const [dateValue, setDateValue] = React.useState<Date | DateRange | undefined>();
  const [timeValue, setTimeValue] = React.useState<string>();

  const showPickedValue = React.useCallback(
    (value: Date | undefined) => {
      if (!value) {
        return 'Chọn ngày';
      }

      return format(value, showTimePicker ? FORMAT_DATE_TIME : FORMAT_DATE_FORM);
    },
    [showTimePicker]
  );

  const setDateState = React.useCallback(
    (value: Date | DateRange | undefined) => {
      if (!value) {
        return;
      }

      setDateValue(value);

      const isRange = isDateRange(value);

      if (showTimePicker && !isRange) {
        const hours = value.getHours();
        const minutes = value.getMinutes();
        setTimeValue(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
      }

      if (mode === 'single' && !isRange) {
        setStartValue(showPickedValue(value));
      } else if (mode === 'range' && isRange) {
        setStartValue(showPickedValue(value.from));
        setEndValue(showPickedValue(value.to));
      }
    },
    [mode, showPickedValue, showTimePicker]
  );

  React.useLayoutEffect(() => {
    if (value) {
      setDateState(value as Date | DateRange);
    }
  }, [setDateState, value]);

  const parseDate = (value: string): Date | undefined => {
    const format = showTimePicker ? FORMAT_DATE_TIME : FORMAT_DATE_FORM;
    const singleDate = parse(value, format, new Date());

    if (!isValid(singleDate)) {
      return;
    }

    return singleDate;
  };

  const handleBlur = (value: string, field: string) => {
    const parsedDate = parseDate(value);
    let dateState;

    if (parsedDate && onChange) {
      if (mode === 'single') {
        dateState = parsedDate;
      } else if (mode === 'range') {
        dateState = { ...(dateValue as DateRange), [field]: parsedDate };
      }

      onChange(dateState);
      setDateState(dateState);
    }
  };

  const handleSelect = (date: Date | DateRange | undefined) => {
    const getSelectedDate = (): Date | DateRange | undefined => {
      if (isDateRange(date)) {
        const { from, to } = date;
        from?.setHours(0, 0, 0, 0);
        to?.setHours(0, 0, 0, 0);
        if (from || to) {
          return { from, to };
        }
      }

      return date;
    };

    const value = getSelectedDate();
    setDateState(value);

    if (onChange) {
      onChange(value);
    }
  };

  const handleRangeSelect: SelectRangeEventHandler = (date: DateRange | undefined) => {
    handleSelect(date);
  };

  const handleSingleSelect: SelectSingleEventHandler = (day: Date | undefined) => {
    handleSelect(day);
  };

  const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const { value } = e.target;
    const [hours, minutes] = value.split(':');
    setTimeValue(`${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`);

    if (!dateValue) {
      return;
    }

    if (dateValue instanceof Date) {
      const dateTimeValue = new Date(
        dateValue.getFullYear(),
        dateValue.getMonth(),
        dateValue.getDate(),
        Number.parseInt(hours),
        Number.parseInt(minutes)
      );

      setDateState(dateTimeValue);

      if (onChange) {
        onChange(dateTimeValue);
      }
    }
  };

  const footer = (
    <>
      <div className="px-4 pb-4 pt-0">
        <Label>Giờ</Label>
        <Input type="time" value={timeValue} onChange={handleTimeChange} />
      </div>
      {!timeValue && <p>Chọn giờ.</p>}
    </>
  );

  const calendarProps = {
    name,
    captionLayout: 'dropdown-buttons' as CaptionLayout,
    fromYear: 1960,
    toYear: 2030,
    initialFocus: true,
    ...props,
  };

  const SingleDatePicker = (props: Omit<DayPickerSingleProps, 'selected' | 'onSelect'>) => {
    const selected = dateValue as Date | undefined;
    return (
      <Calendar
        {...props}
        selected={selected}
        defaultMonth={selected}
        onSelect={handleSingleSelect}
      />
    );
  };

  const RangeDatePicker = (props: Omit<DayPickerRangeProps, 'selected' | 'onSelect'>) => {
    const selected = dateValue as DateRange | undefined;
    return (
      <Calendar
        {...props}
        selected={selected}
        showOutsideDays={false}
        onSelect={handleRangeSelect}
      />
    );
  };

  return (
    <Popover modal={true}>
      <div
        className={cn(
          'grid h-8 grid-cols-5 rounded-lg border border-input pl-3 shadow-sm',
          className
        )}
      >
        <input
          type={showTimePicker ? 'datetime-local' : 'date'}
          value={startValue}
          onChange={event => setStartValue(event.target.value)}
          onBlur={event => handleBlur(event.target.value, 'from')}
          disabled={disabled as boolean}
          className={cn('text-xs outline-none', mode === 'range' ? 'col-span-2' : 'col-span-4')}
        />
        {mode === 'range' && (
          <input
            type="date"
            value={endValue}
            onChange={event => setEndValue(event.target.value)}
            onBlur={event => handleBlur(event.target.value, 'to')}
            disabled={disabled as boolean}
            className="col-span-2  text-xs outline-none"
          />
        )}
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className="col-span-1 h-7 justify-self-end p-2"
            disabled={disabled as boolean}
          >
            <CalendarIcon className={cn('ml-auto opacity-50')} size={16} />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-full p-0" align="center">
        {mode === 'single' ? (
          <SingleDatePicker {...calendarProps} mode="single" />
        ) : (
          <RangeDatePicker {...calendarProps} mode="range" />
        )}
        {showTimePicker && footer}
      </PopoverContent>
    </Popover>
  );
};

export type FormComboboxProps<
  TRecord,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = FormProps & {
  onTableCell?: boolean;
  queryKey?: QueryKey;
  model?: Model;
  // queryFn?: (params: QueryListComponentType) => Promise<PaginationResponse<TRecord>>;
  options?: TRecord[];
  showFields?: (keyof TRecord)[];
  formatLabel?: string;
  uniqueField?: keyof TRecord;
  externalParams?: Record<string, unknown>;

  onSelectItem?: (values: TRecord | null) => void;
  onSelectedItems?: (values: TRecord[]) => void;
  filter?: (value: TRecord, index: number, array: TRecord[]) => unknown;
  multiple?: boolean;
  valueField?: keyof TRecord;
  createQueryFn?: <T extends Payload>(
    model: Model
  ) => (params: QueryListComponentType) => Promise<PaginationResponse<T>>;
  onResponse?: (items: TRecord[]) => void;
  onSearch?: (searchTerm: string | undefined) => void;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
} & Partial<Omit<ControllerRenderProps<TFieldValues, TName>, 'ref'>> &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    | 'onChange'
    | 'onClosed'
    | 'onContentReady'
    | 'onCopy'
    | 'onCustomItemCreating'
    | 'onCut'
    | 'onDisposing'
    | 'onEnterKey'
    | 'onFocusIn'
    | 'onFocusOut'
    | 'onInitialized'
    | 'onInput'
    | 'onItemClick'
    | 'onKeyDown'
    | 'onKeyUp'
    | 'onOpened'
    | 'onPaste'
  >;

const FormCombobox = <TRecord extends ListComponentResponse>({
  model,
  queryKey,
  options = [],
  uniqueField,
  externalParams,
  showFields = ['name'],
  filter = () => true,
  createQueryFn = createQueryComponentFn,
  onResponse,
  onSearch,
  onScroll,
  onTableCell,
  ...props
}: FormComboboxProps<TRecord>) => {
  const mounted = React.useRef(false);
  const [searchTerm, setSearchTerm] = React.useState<string>();

  const { list, fetch, fetchNextPage } = useEntity<TRecord>({
    model,
    queryKey,
    options,
    createQueryFn,
    onResponse,
    uniqueField,
    externalParams,
  });

  const onSearchFn = React.useRef(onSearch);

  // React.useEffect(() => {
  //   console.log(model, 'a');
  //   if (!mounted.current) {
  //     return;
  //   }

  //   const value = Number(props?.value);

  //   console.log('value:', value, 'entities:', entities);
  //   if (value && entities?.[value] === undefined) {
  //     fetch({ pageIndex: 1, searchId: value });
  //   }
  // }, [entities, fetch, props?.value]);

  React.useEffect(() => {
    if (!mounted.current) {
      return;
    }

    fetch({ pageIndex: 1, searchTerm });
    onSearchFn?.current?.(searchTerm);
  }, [fetch, searchTerm]);

  React.useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  // Thêm useEffect để xử lý giá trị mặc định
  // React.useEffect(() => {
  //   if (props.value && entities?.[props.value]) {
  //     props.onSelectItem?.(entities?.[props.value]);
  //   }
  // }, [props.value, entities, props.onSelectItem]);

  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    if (!atBottom(event.currentTarget)) {
      return;
    }
    onScroll?.(event);
    fetchNextPage();
  };

  const filteredList = list.filter(filter);

  if (onTableCell) {
    return (
      <Combobox
        {...props}
        showFields={showFields}
        onChange={item => {
          props.onChange?.(item);
        }}
        options={filteredList}
        onScroll={handleScroll}
        onSearch={setSearchTerm}
      />
    );
  }

  if (props.multiple && Array.isArray(props.value)) {
    return (
      <TagBox
        searchEnabled
        showClearButton
        valueExpr={'id'}
        items={filteredList}
        value={props.value}
        showSelectionControls={true}
        searchMode="contains"
        displayExpr={displayExpr(showFields)}
        onValueChange={e => props.onChange?.(e)}
        onOptionChanged={e => {
          if (e.name === 'selectedItems' && Array.isArray(e.value)) {
            props.onSelectedItems?.(e.value as TRecord[]);
          }
        }}
        applyValueMode="useButtons"
      />
    );
  }

  return (
    <SelectBox
      {...props}
      items={filteredList}
      valueExpr="id"
      onValueChange={value => {
        props.onChange?.(value);
      }}
      onSelectionChanged={selection => {
        props.onSelectItem?.(selection.selectedItem as TRecord);
      }}
      onFocusIn={e => {
        const input = e.element.querySelector('input.dx-texteditor-input') as HTMLInputElement;
        if (input) input.select();
      }}
      searchExpr={showFields as string[]}
      searchEnabled
      searchMode="contains"
      displayExpr={displayExpr(showFields)}
      showClearButton
    />
  );
};

type FormImagesUploaderProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = UploadImagesProps & Partial<Omit<ControllerRenderProps<TFieldValues, TName>, 'ref'>>;

const FormImagesUploader = ({
  mode = 'multiple',
  onChange,
  value,
  ...props
}: FormImagesUploaderProps) => {
  const uploaderRef = React.useRef<UploadImageRef>(null);

  React.useEffect(() => {
    if (!value) return;

    const files = uploaderRef?.current?.getAllImageFiles();

    if (files?.length) return;

    if (mode === 'single') {
      void setImagesToUploadControl(uploaderRef.current, [{ link: String(value) }]);
    } else if (typeof value === 'string') {
      const arrValue = value.split(',');
      if (arrValue && arrValue.length) {
        const paths = arrValue.map((link: string) => ({ link }));
        void setImagesToUploadControl(uploaderRef.current, paths);
      }
    }
  }, [mode, value]);

  const handleUploadSuccess = (files: ImageFile[]) => {
    if (!files) return;

    if (!onChange) return;

    if (mode === 'single') {
      onChange(files[0].url);
    } else {
      onChange(files.map(i => i.url).join(','));
    }
  };

  const handleRemove = (file: ImageFile) => {
    if (!file) return;

    if (!onChange) return;

    if (mode === 'single') {
      onChange(undefined);
    } else if (typeof value === 'string') {
      onChange(value.split(',').filter(i => i !== file.url));
    }
  };

  return (
    <UploadImages
      mode={mode}
      ref={uploaderRef}
      onRemove={handleRemove}
      onUploadSuccess={handleUploadSuccess}
      {...props}
    />
  );
};

export type RadioGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  value?: any;
  onChange?: (value: any) => void;
} & React.ComponentPropsWithoutRef<typeof RadioGroup> &
  Partial<Omit<ControllerRenderProps<TFieldValues, TName>, 'ref'>>;

/**
 * Ví dụ sử dụng data tĩnh
 * export const districts = [
 *   { id: 13, code: 'TH', name: 'Tân Hiệp' },
 *   { id: 11, code: 'PQ', name: 'Phú Quốc' },
 *   { id: 9, code: 'hoc_mon', name: 'huyện Hóc Môn' },
 * ];
 * <FormRadioGroup items={districts} valueExpr="id" displayExpr="name" layout="horizontal"/>
 */
const FormRadioGroup = React.forwardRef<React.ElementRef<typeof RadioGroup>, RadioGroupProps>(
  ({ value, onChange, ...props }, ref) => {
    const [check, setCheck] = React.useState<unknown>(value);

    React.useEffect(() => {
      setCheck(value);
    }, [value]);

    const handleValueChange = React.useCallback(
      (event: RadioGroupTypes.ValueChangedEvent) => {
        setCheck(event.value);
        if (onChange) {
          onChange(event.value);
        }
      },
      [onChange]
    );

    return (
      <RadioGroup ref={ref} value={check} {...props} onValueChanged={handleValueChange}>
        {props.children}
      </RadioGroup>
    );
  }
);

export type ColorPickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  value?: string;
  onChange?: (value: string) => void;
} & React.ComponentPropsWithoutRef<typeof ColorBox> &
  Partial<Omit<ControllerRenderProps<TFieldValues, TName>, 'ref'>>;

/**
 * Các Props cơ bản của FormColorPicker component
 * value: Chỉ định giá trị đang được chọn
 * applyButtonText: Chỉ định label của nút "Apply" trên drop-down editor
 * cancelButtonText: Chỉ định label của nút "Cancel" trên drop-down editor
 * applyValueMode: Chỉ định cách người dùng áp dụng giá trị đã chọn
 *   - useButton: Cho phép áp dụng giá trị đã chọn/hủy bỏ bằng cách
 *                sử nút Apply/Cancel
 *   - instantly: Áp dụng các giá trị đã chọn ngay lập tức khi nhắp
 *                vào các giá trị cần thiết của drop-down menu
 * defaultValue: Giá trị mặc định
 * Tham khảo các Props khác tại link bên dưới:
 * https://js.devexpress.com/React/Documentation/ApiReference/UI_Components/dxColorBox/Configuration/
 */
const FormColorPicker = ({ value, ...props }: ColorPickerProps) => {
  const [color, setColor] = React.useState<string>('');

  React.useEffect(() => {
    if (value) setColor(value + '');
  }, [value]);

  // Handle color change event
  const handleColorChange = React.useCallback(
    ({ value }: ColorBoxTypes.ValueChangedEvent) => {
      setColor(value + '');
      if (props.onChange) props.onChange(value);
    },
    [props]
  );

  return (
    <>
      <ColorBox {...(props as any)} value={color} onValueChanged={handleColorChange} />
    </>
  );
};

export {
  Form,
  FormColorPicker,
  FormCombobox,
  FormControl,
  FormDatePicker,
  FormDescription,
  FormField,
  FormImagesUploader,
  FormItem,
  FormLabel,
  FormMessage,
  FormRadioGroup,
  Required,
};
