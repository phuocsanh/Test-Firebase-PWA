import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { searchLabel, selectLabel } from '@/constant';
import { useBoolean } from '@/hooks';
import i18next from '@/i18n';
import { interpolateStringTemplate, removeAccents } from '@/lib/text';
import { cn, hash } from '@/lib/utils';
import { ListComponentResponse } from '@/types';
import { CheckIcon, ChevronDown, X } from 'lucide-react';
import { ChangeEvent, UIEventHandler, useEffect, useRef, useState } from 'react';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

type ComboboxProps<TRecord> = {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  multiple?: boolean;
  //
  options: TRecord[];
  showFields?: (keyof TRecord)[];
  formatLabel?: string;
  //
  value?: string | number | (string | number)[];
  valueField?: keyof TRecord;
  //
  onChange?: (selected: string | number | (string | number)[] | null) => void;
  onSelectItem?: (values: TRecord | null) => void;
  onSelectedItems?: (values: TRecord[]) => void;
  onScroll?: UIEventHandler<HTMLDivElement> | undefined;
  onSearch?: (search: string | undefined) => void;
  onClickOutSide?: (openValue: boolean) => void;
};

export const Combobox = <TRecord extends ListComponentResponse>({
  disabled,
  label = '',
  placeholder = `${selectLabel.toLocaleLowerCase()} ${label.toLocaleLowerCase()}`,
  className,
  multiple,
  //
  options = [],
  showFields = ['name'],
  formatLabel,
  //
  value,
  valueField = 'id',
  //
  onChange,
  onSelectItem,
  onSelectedItems,
  onScroll,
  onSearch,
  onClickOutSide,
  ...props
}: ComboboxProps<TRecord>) => {
  const { state: open, setFalse: close, toggle } = useBoolean();

  const mapper = hash(options, String(valueField));

  // const selected = (Array.isArray(value) ? value.map(i => Number(i)) : value) as (
  //   | number
  //   | string
  // )[];

  const [selected, setSelected] = useState<number[]>([]);
  const selectedInit = useRef<boolean>(false);

  useEffect(() => {
    if (selectedInit.current === false && multiple && selected.length === 0) {
      setSelected((value as never[]).map(Number));
      selectedInit.current = true;
    }
  }, [multiple, selected.length, value]);

  const refPrevSelectedItem = useRef<{ selectedItem: TRecord | null }>({ selectedItem: null });

  const getLabel = (item: TRecord): string => {
    if (formatLabel) {
      return interpolateStringTemplate(formatLabel, item);
    }

    return showFields
      .filter(field => item[field])
      .map(field => item[field])
      .join(', ');
  };

  const getSelectedLabel = (): string => {
    if (
      (multiple && selected?.length === 0) ||
      (!multiple && (value === null || value === undefined || value === '' || value === 0))
    ) {
      return placeholder;
    }

    const selectedItem = mapper?.[value as number | string];
    if (!selectedItem) {
      if (refPrevSelectedItem && refPrevSelectedItem.current.selectedItem)
        return getLabel(refPrevSelectedItem.current.selectedItem);
      return (value || 0).toString();
    } else {
      refPrevSelectedItem.current.selectedItem = selectedItem;
    }
    return getLabel(selectedItem);
  };

  const filter = (value: string, search: string): number => {
    if (!mapper || !mapper[value]) {
      return 0;
    }

    const label = removeAccents(getLabel(mapper[value]).toLocaleLowerCase());
    const searchTerm = removeAccents(search.toLocaleLowerCase());

    return label.includes(searchTerm) ? 1 : 0;
  };

  const handleUnselect = (item: number | string) => {
    setSelected(selected.filter(i => i !== item));
  };

  const handleSelect = (item: TRecord) => {
    if (!item) return;

    const singleValue = item[valueField] as never;
    if (multiple) {
      let selectedIds;

      if (selected?.includes(singleValue)) {
        selectedIds = selected.filter(i => i !== singleValue);
      } else {
        selectedIds = [...(selected || []), singleValue];
      }

      setSelected(selectedIds);
    } else {
      onChange?.(singleValue);
      onSelectItem?.(item);
    }

    if (!multiple) {
      close();
    }
  };

  const Trigger = multiple ? (
    <div className="flex gap-1">
      {selected?.length > 0 ? (
        <div className="flex flex-row">
          {selected?.map((item, index) => {
            const entity = mapper?.[item];
            return (
              <div key={item}>
                {index <= 2 && (
                  <div>
                    <Badge
                      variant="secondary"
                      className="mb-1 mr-1 font-normal"
                      // onClick={() => handleUnselect(item)}
                    >
                      {entity ? getLabel(entity) : item}
                      <button
                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            handleUnselect(item);
                          }
                        }}
                        onMouseDown={e => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={() => handleUnselect(item)}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  </div>
                )}
              </div>
            );
          })}
          {selected.length > 3 && (
            <Badge variant="secondary" className="mb-1 mr-1">
              ...{selected.length - 3}+
            </Badge>
          )}
        </div>
      ) : (
        <div className="flex w-full flex-row justify-between">
          <div className="w-[90%]">{getSelectedLabel()}</div>
          {/* <div className="flex items-center space-x-2">
            <X
              className="ml-2 h-4 w-4 shrink-0 opacity-50"
              onClick={() => {
                if (onChange) {
                  onChange(null);
                }
                onSelectItem?.(null);
              }}
            />
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </div> */}
        </div>
      )}
    </div>
  ) : (
    <div className="flex w-full flex-row justify-between">
      <div className="w-[90%] overflow-hidden text-ellipsis">{getSelectedLabel()}</div>
      <div className="flex items-center space-x-1">
        <X
          className="ml-2 h-4 w-4 shrink-0 opacity-50"
          onClick={() => {
            if (onChange) {
              onChange(null);
            }
            onSelectItem?.(null);
          }}
        />
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </div>
    </div>
  );

  const [search, setSearch] = useState<string>();
  const [debounce, setDebounce] = useState<string>();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebounce(search);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    onSearch?.(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounce]);

  return (
    <Popover
      open={open}
      onOpenChange={openValue => {
        toggle();
        if (multiple && open) {
          // onSelectedItems?.(selected.map(i => mapper?.[i] ));
          if (mapper) onSelectedItems?.(selected.map(i => mapper[i]));
          onChange?.(selected);
        }
        !openValue && onClickOutSide && onClickOutSide(openValue);
      }}
      modal={true}
      {...props}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'relative flex h-8 w-full items-center justify-between truncate whitespace-nowrap pl-3 text-left font-normal',
            (value === 0 ||
              value === '' ||
              value === null ||
              value === undefined ||
              (Array.isArray(value) && value.length === 0)) &&
              'text-muted-foreground',
            className
          )}
          disabled={disabled}
          {...props}
        >
          {Trigger}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command filter={filter}>
          <CommandInput
            placeholder={`${searchLabel}...`}
            className="top-0"
            onChangeCapture={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
          <CommandEmpty>{i18next.t('notFound')}</CommandEmpty>
          <ScrollArea className="max-h-[35vh] overflow-auto" onScroll={onScroll}>
            <CommandGroup>
              <CommandList>
                {options?.map((item: TRecord) => {
                  const isChecked = multiple
                    ? selected?.includes(item[valueField] as never)
                    : Number(item[valueField]) === Number(value);

                  return (
                    <CommandItem
                      value={String(item[valueField])}
                      key={item.id}
                      onSelect={() => handleSelect(item)}
                    >
                      <CheckIcon
                        className={cn('mr-2 h-4 w-4', isChecked ? 'opacity-100' : 'opacity-0')}
                      />
                      {getLabel(item)}
                    </CommandItem>
                  );
                })}
              </CommandList>
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
