import * as React from 'react';

import { DEFAULT_DECIMAL_SCALE } from '@/constant';
import { normalizeNumeric, realNumberDecimalFormat } from '@/lib/number';
import { getCommasNumbers } from '@/lib/text';
import { cn } from '@/lib/utils';
import { TextBox } from 'devextreme-react';
import { InputEvent } from 'devextreme/ui/text_box';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputNumber = ({
  className,
  decimal = DEFAULT_DECIMAL_SCALE,
  ...props
}: Omit<InputProps, 'onChange'> & {
  onChange?: (value: number | undefined) => void | React.ChangeEventHandler<HTMLInputElement>;
  decimal?: number;
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState<string>();
  const [number, setNumber] = React.useState<string>();

  /**
   * Ref to properly handle the case when user changes the index of selection cursor
   */
  const selectionStartRef = React.useRef<number | null>(null);
  const commasNumbers = React.useRef<number | null>(null);

  const setState = React.useCallback(
    (value: string) => {
      const number = normalizeNumeric(value);
      const text = realNumberDecimalFormat(number, decimal);

      setValue(text);
      setNumber(number);

      return [text, number];
    },
    [decimal]
  );

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    if (props.value !== undefined || props.value !== null) {
      setState(String(props.value));
    }
  }, [props.value, setState]);

  // When the input is blurred, we'll call our table meta's updateData function
  // const onBlur: React.FocusEventHandler<HTMLInputElement> = e => {
  //   props.onChange?.(Number(number));
  //   props.onBlur?.(e);
  // };

  const onChange = (e: InputEvent) => {
    if (!e?.event) {
      return;
    }

    const currentTarget = e.event.currentTarget as HTMLInputElement;
    const { value, selectionStart } = currentTarget;
    const [text, number] = setState(value);
    props?.onChange?.(number as unknown as number);

    let currentSelectionStart = selectionStart || 0;

    const prevCommasNumbers = commasNumbers.current;
    const currentCommasNumbers = getCommasNumbers(text);

    if (prevCommasNumbers! < currentCommasNumbers) {
      currentSelectionStart += 1;
    }

    selectionStartRef.current = currentSelectionStart;
    commasNumbers.current = currentCommasNumbers;

    setTimeout(() => {
      currentTarget.setSelectionRange(currentSelectionStart, currentSelectionStart);
    }, 0);
  };

  return (
    <TextBox
      inputAttr={{ class: 'text-right', ...props }}
      value={value}
      onInput={onChange}
      onFocusOut={() => props?.onChange?.(Number(number))}
      className={cn(className, 'text-right')}
    />
  );

  // return (
  //   <Input
  //     {...props}
  //     value={value}
  //     onBlur={onBlur}
  //     onChange={onChange}
  //     className={cn(className, 'text-right')}
  //   />
  // );
};
// const InputNumber = ({
//   className,
//   decimalScale = 3,
//   ...props
// }: InputProps & {
//   decimalScale?: number;
//   type?: 'text' | 'tel' | 'password';
//   value?: number | string | null;
//   defaultValue?: number | string | null;
// }) => {
//   const [number, setNumber] = React.useState<number>();

//   const { setValue } = useFormContext();

//   return (
//     <NumericFormat
//       thousandSeparator
//       customInput={Input}
//       decimalScale={decimalScale}
//       className={cn(className, 'text-right')}
//       {...props}
//       onValueChange={value => {
//         setNumber(value.floatValue);
//       }}
//       onBlur={() => setValue(props.name!, number || props.value)}
//     />
//   );
// };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'read-only:bg-primary-foreground flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed',
          className
        )}
        ref={ref}
        value={value !== undefined || value !== null ? value : ''}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input, InputNumber };
