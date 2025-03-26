import i18next from '@/i18n';

import { createFilterColumn, parseParamsToFilterFormValues } from '@/components/data-table';
import { FORMAT_DATE, applyLabel, cancelLabel, enterLabel, searchLabel } from '@/constant/const';
import { useBoolean } from '@/hooks';
import { atBottom, callbackWithTimeout, cn, hash } from '@/lib/utils';
import {
  FieldColumn,
  ListComponentResponse,
  PaginationResponse,
  QueryListComponentType,
} from '@/types';
import { QueryKey } from '@tanstack/react-query';
import { Column, PaginationState, Table } from '@tanstack/react-table';
import { format } from 'date-fns';
import { CheckIcon, ListFilter } from 'lucide-react';
import {
  ChangeEvent,
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DateRange } from 'react-day-picker';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, buttonVariants } from '../ui/button';
import { Calendar } from '../ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { FormField } from '../ui/form';
import { Input, InputNumber } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Separator } from '../ui/separator';

import { useEntity } from '@/hooks/use-entity';
import { capitalizeFirstLetter, removeAccents } from '@/lib/text';
import { Model, Payload } from '@/services';
import { Badge } from '../ui/badge';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

type DataTableColumnFilterProps<TData> = {
  table: Table<TData>;
  column: Column<TData, unknown>;
  refetch: () => Promise<unknown>;
  filterColumns: FieldColumn[];
  setFilterColumns: Dispatch<SetStateAction<FieldColumn[]>>;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
};

export type SearchField = {
  name: string;
  value?: number | string | DateRange;
  expression: string;
};

type FilterProps = {
  label: string;
  name: string;
};

type ControlProps = {
  onClear: MouseEventHandler<HTMLButtonElement>;
  onApply: MouseEventHandler<HTMLButtonElement>;
};

const Control = ({ onClear, onApply }: ControlProps) => {
  return (
    <div className="flex items-center justify-between gap-x-2">
      <Button onClick={onClear} variant="outline" className="w-full whitespace-nowrap">
        {cancelLabel}
      </Button>
      <Button type="button" onClick={onApply} className="w-full whitespace-nowrap">
        {applyLabel}
      </Button>
    </div>
  );
};

/**
 * Text
 * @returns
 */
const TextFilter = ({ name, label }: FilterProps) => {
  const fieldName = `${name}.value`;
  const expression = `${name}.expression`;

  const { setValue, control } = useFormContext();
  const expressionValue = useWatch({ control, name: expression }) as string;

  useEffect(() => {
    if (!expressionValue) {
      setValue(fieldName, '');
    }
  }, [expressionValue, fieldName, setValue]);

  return (
    <div className="space-y-3">
      <FormField
        name={fieldName}
        label={label}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setValue(fieldName, e.target.value);
          setValue(expression, 'CONTAINS');
        }}
      >
        <Input placeholder={`${enterLabel} ${label.toLocaleLowerCase()}`} />
      </FormField>
    </div>
  );
};

const operators = [
  { label: i18next.t('filter.number.operators.equalTo', { ns: 'dataTable' }), value: '=' },
  { label: i18next.t('filter.number.operators.notEqualTo', { ns: 'dataTable' }), value: '!=' },
  { label: i18next.t('filter.number.operators.lessThan', { ns: 'dataTable' }), value: '<' },
  {
    label: i18next.t('filter.number.operators.lessThanOrEqualTo', { ns: 'dataTable' }),
    value: '<=',
  },
  { label: i18next.t('filter.number.operators.greaterThan', { ns: 'dataTable' }), value: '>' },
  {
    label: i18next.t('filter.number.operators.greaterThanOrEqualTo', { ns: 'dataTable' }),
    value: '>=',
  },
];

/**
 * Number
 * @returns
 */
const NumberFilter = ({ name, label }: FilterProps) => {
  const fieldName = `${name}.value`;
  const expression = `${name}.expression`;

  const { t } = useTranslation('dataTable');

  const { setValue, control } = useFormContext();
  const selectedOperator = useWatch({ control, name: expression }) as string;

  useEffect(() => {
    if (!selectedOperator) {
      setValue(expression, undefined);
      setValue(fieldName, undefined);
    }
  }, [expression, fieldName, selectedOperator, setValue]);

  return (
    <div className="space-y-3">
      <span className="text-xs">
        <span className="font-bold">{label}</span>
      </span>
      <Command>
        <CommandList>
          <CommandGroup>
            {operators.map(operator => {
              const isSelected = operator.value === selectedOperator;
              return (
                <CommandItem
                  value={operator.value}
                  key={operator.value}
                  onSelect={() => {
                    setValue(expression, operator.value);
                  }}
                >
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible'
                    )}
                  >
                    <CheckIcon className={cn('h-4 w-4')} />
                  </div>
                  {operator.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
      <FormField name={fieldName}>
        <InputNumber placeholder={t('filter.number.value')} />
      </FormField>
    </div>
  );
};

/**
 * Date time
 * @returns
 */
const DateTimeFilter = ({ name, label }: FilterProps) => {
  const fieldName = `${name}.value`;
  const expression = `${name}.expression`;

  const { t } = useTranslation('dataTable');

  const { setValue, control } = useFormContext();
  const value = useWatch({ control, name: fieldName }) as DateRange;

  const showDateRangeValue = () => {
    if (value?.from && value?.to) {
      if (!value.to) {
        return `${format(value.from, FORMAT_DATE)}`;
      }
      return `${format(value.from, FORMAT_DATE)} - ${format(value.to, FORMAT_DATE)}`;
    }
    return t('filter.date.noData');
  };

  return (
    <div className="space-y-3">
      <span className="text-xs">
        <span className="mr-2 font-bold">{label}:</span>
        {showDateRangeValue()}
      </span>
      <Calendar
        selected={value}
        mode={'range'}
        numberOfMonths={2}
        initialFocus
        showOutsideDays={false}
        onSelect={value => {
          const valueUpdate = { ...value };
          if (valueUpdate.from && !valueUpdate.to) {
            valueUpdate.to = valueUpdate.from;
          }
          if (valueUpdate.to && !valueUpdate.from) {
            valueUpdate.from = valueUpdate.to;
          }
          setValue(fieldName, valueUpdate);
          setValue(expression, 'BETWEEN');
        }}
      />
    </div>
  );
};

/**
 * Multiple selection
 */
type MultipleSelectionFilter<T> = {
  label: string;
  queryKey: QueryKey;
  model: Model;
  // queryService: (params: QueryListComponentType) => Promise<PaginationResponse<TRecord>>;
  name: string;
  options?: T[];
  createQueryFn?: <T extends Payload>(
    model: Model
  ) => (params: QueryListComponentType) => Promise<PaginationResponse<T>>;
  showFields?: (keyof T)[];
};

const MultipleSelectionFilter = <T extends ListComponentResponse>({
  name,
  label,
  queryKey,
  model,
  createQueryFn,
  options,
  showFields,
}: MultipleSelectionFilter<T>) => {
  const { t } = useTranslation('dataTable');

  const { control, setValue } = useFormContext();

  const fieldName = `${name}.value`;
  const expression = `${name}.expression`;

  const selectedValues = (useWatch({ control, name: fieldName }) as unknown[]) || [];

  const { list, fetchNextPage, fetch } = useEntity<T>({
    model,
    options,
    createQueryFn,
    queryKey: queryKey,
  });

  const mounted = useRef(false);

  const [search, setSearch] = useState<string>();
  const [debounce, setDebounce] = useState<string>();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebounce(search);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    if (!mounted.current) {
      return;
    }
    fetch({ pageIndex: 1, searchTerm: debounce });
  }, [debounce, fetch]);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const mapper = hash(list);

  const getLabel = (item: T): string =>
    !showFields
      ? item?.name || item?.code || ''
      : showFields
          .filter(field => item[field])
          .map(field => item[field])
          .join(', ');

  const filter = (value: string, search: string): number => {
    if (!mapper || !mapper[value]) {
      return 0;
    }

    const label = removeAccents(getLabel(mapper[value]).toLocaleLowerCase());
    const searchTerm = removeAccents(search.toLocaleLowerCase());

    return label.includes(searchTerm) ? 1 : 0;
  };

  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    if (!atBottom(event.currentTarget)) {
      return;
    }
    fetchNextPage();
  };

  return (
    <div className="space-y-2">
      <span className="text-xs font-bold">{label}</span>
      <Command filter={filter}>
        <CommandInput
          placeholder={`${searchLabel}...`}
          onChangeCapture={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
        <CommandList onScroll={handleScroll}>
          <CommandEmpty>{t('content.noResult')}.</CommandEmpty>
          <CommandGroup>
            {list.map(item => {
              const isSelected = selectedValues.includes(item.id);
              return (
                <CommandItem
                  key={item.id}
                  onSelect={() => {
                    if (isSelected) {
                      setValue(
                        fieldName,
                        selectedValues.filter(i => i !== item.id)
                      );
                    } else {
                      setValue(fieldName, [...selectedValues, item.id]);
                    }
                    setValue(expression, 'IN');
                  }}
                  value={String(item.id)}
                >
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible'
                    )}
                  >
                    <CheckIcon className={cn('h-4 w-4')} />
                  </div>
                  <span>{getLabel(item)}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

const Active = ({
  active,
  rightText = i18next.t('content.isActive'),
  wrongText = i18next.t('content.isInActive'),
}: {
  active?: boolean;
  rightText?: string;
  wrongText?: string;
}) => {
  const text = active ? rightText : wrongText;
  const className = active
    ? 'bg-success-100 text-success-600 hover:bg-success-100'
    : 'bg-gray-200 hover:bg-gray-200 text-gray-500';

  return <Badge className={`w-[max-content] ${className}`}>{text}</Badge>;
};

type BooleanRecord = {
  value: boolean;
  label: string;
};
const BooleanFilter = ({
  label,
  name,
  options = [],
}: FilterProps & { options?: BooleanRecord[] }) => {
  const fieldName = `${name}.value`;
  const expression = `${name}.expression`;

  const { setValue, control } = useFormContext();
  const value = useWatch({ control, name: fieldName }) as string;

  return (
    <div className="space-y-3">
      <span className="text-xs">
        <span className="mr-2 font-bold">{label}</span>
      </span>
      <RadioGroup
        onValueChange={value => {
          setValue(fieldName, value);
          setValue(expression, '=');
        }}
        // onValueChange={field.onChange}
        defaultValue={value}
        className="flex w-full flex-col space-y-1"
      >
        {options.map(option => {
          return (
            <div key={option.label} className="flex items-center space-x-3 space-y-0">
              <RadioGroupItem value={String(option.value)} />
              <Active active={option.value} rightText={option?.label} wrongText={option?.label} />
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

const controls = {
  text: TextFilter,
  number: NumberFilter,
  date: DateTimeFilter,
  active: BooleanFilter,
  boolean: BooleanFilter,
};

/**
 * DataTableColumnFilter
 * @returns
 */
export const DataTableColumnFilter = <TData extends Payload>({
  column,
  refetch,
  filterColumns,
  setFilterColumns,
  setPagination,
}: DataTableColumnFilterProps<TData>) => {
  const {
    id: name,
    columnDef: { header, meta },
  } = column;

  const { state: open, toggle } = useBoolean();

  const { getValues, setValue, reset } = useFormContext();

  useEffect(() => {
    reset(parseParamsToFilterFormValues(filterColumns));
  }, [filterColumns, reset]);

  if (!meta?.filter) return null;

  const label = header as string;
  const { type, model, queryKey, searchKey, createQueryFn, options, showFields } = meta.filter;

  let filterControl;

  if (type === 'multiple') {
    filterControl = (
      <MultipleSelectionFilter
        label={label}
        queryKey={queryKey!}
        model={model!}
        name={searchKey!}
        createQueryFn={createQueryFn}
        options={options as ListComponentResponse[]}
        showFields={showFields as (keyof ListComponentResponse)[]}
      />
    );
  } else if (['boolean', 'active'].includes(type)) {
    let booleanOptions = options;
    if (type === 'active') {
      booleanOptions = [
        { value: true, label: i18next.t('content.isActive') },
        { value: false, label: i18next.t('content.isInActive') },
      ];
    }

    filterControl = (
      <BooleanFilter label={label} name={name} options={booleanOptions as BooleanRecord[]} />
    );
  } else {
    const FilterControl = controls[type];
    filterControl = <FilterControl label={label} name={name} />;
  }

  const onApply = () => {
    const values = getValues();

    const filterColumns = Object.entries(values).reduce(
      (result: FieldColumn[], [key, field]: [string, Omit<SearchField, 'name'>]) => {
        const columnFilter = createFilterColumn({ name: key, ...field });

        // reverse the value of inactive column cause boolean filter
        if (columnFilter?.column === 'isInactive') {
          columnFilter.keySearch = columnFilter.keySearch === 'true' ? 'false' : 'true';
        }

        if (!columnFilter) {
          return result;
        }

        return [...result, columnFilter];
      },
      []
    );

    setFilterColumns(filterColumns);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));

    callbackWithTimeout(refetch);

    toggle();
  };

  const onClear = () => {
    const fieldName = type === 'multiple' ? searchKey! : name;

    setTimeout(() => {
      setValue(`${fieldName}.value`, undefined);
      setValue(`${fieldName}.expression`, undefined);
    }, 500);

    setFilterColumns(params => {
      return params.filter(i => i.column.toLocaleLowerCase() !== fieldName.toLocaleLowerCase());
    });

    callbackWithTimeout(refetch);

    toggle();
  };

  return (
    <Popover open={open} onOpenChange={toggle}>
      <PopoverTrigger
        className={cn(
          buttonVariants({
            variant: 'ghost',
            size: 'icon',
            // className: 'mr-1 h-8 w-8 border-dashed p-0',
            className: 'mr-1 h-fit',
          })
        )}
      >
        <ListFilter
          className={cn(
            filterColumns.find(
              filter =>
                filter.column ===
                capitalizeFirstLetter(column.columnDef.meta?.filter?.searchKey ?? name)
            ) && 'stroke-blue-700'
          )}
          size={16}
        />
      </PopoverTrigger>
      <PopoverContent className="w-full p-3" align="center">
        {filterControl}
        <Separator className="my-5" />
        <Control onClear={onClear} onApply={onApply} />
      </PopoverContent>
    </Popover>
  );
};
