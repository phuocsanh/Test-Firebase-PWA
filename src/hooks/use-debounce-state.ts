import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export const useDebounceState = <T>(
  initialValue?: T,
  timeout = 500
): [T | undefined, Dispatch<SetStateAction<T | undefined>>] => {
  const [bindingValue, setBindingValue] = useState<T | undefined>(initialValue);
  const [debounceValue, setDebounceValue] = useState<T | undefined>(initialValue);

  useEffect(() => {
    const onOrderCodeChange = setTimeout(() => {
      setDebounceValue(bindingValue);
    }, timeout);

    return () => clearTimeout(onOrderCodeChange);
  }, [bindingValue, timeout]);

  return [debounceValue, setBindingValue];
};
