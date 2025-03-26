import { MutationKey, useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FieldValues, Path, PathValue, UseFormReturn, useWatch } from 'react-hook-form';

import { useAuth, useCurrentPath } from '@/hooks';
import { Model, createGenerateCodeFn } from '@/services';

/**
 * Props for the useFormOperation hook.
 */
type UseFormOperationProps<T extends FieldValues> = {
  model: Model; // Model representing the entity being managed in the form.
  fieldTime: keyof T; // Name of the field in the form representing time.
  createCodeKey: MutationKey; // Key for the mutation used to generate a code.
  formMethods: UseFormReturn<T>; // Methods and state provided by react-hook-form for managing the form.
};

/**
 * Custom hook for managing form operations including field initialization,
 * default values setting, and asynchronous mutations.
 *
 * @param props Props for configuring the useFormOperation hook.
 * @returns Function to handle time changes in the form field.
 */
export const useFormOperation = <T extends FieldValues>({
  model,
  fieldTime,
  createCodeKey,
  formMethods,
}: UseFormOperationProps<T>) => {
  const { setValue, getValues, control } = formMethods;

  const { user } = useAuth(); // Hook for retrieving authenticated user information.
  const path = useCurrentPath();

  // Hook for managing mutations, specifically for generating codes based on the model.
  const { mutateAsync } = useMutation({
    mutationKey: createCodeKey,
    mutationFn: createGenerateCodeFn(model),
  });
  const code = useWatch({ control, name: 'code' as Path<T> });

  // State to control when to re-trigger side effects
  const [triggerEffect, setTriggerEffect] = useState<boolean>(false);

  const isRendered = useRef<boolean>(false);

  /**
   * Callback function triggered when the time field in the form changes.
   * It sets the new value in the form, triggers code generation based on the new time,
   * and updates the 'code' field in the form upon successful code generation.
   *
   * @param value New value of the time field.
   */
  const onTimeChange = useCallback(
    (value: unknown) => {
      const localDate = value as Date;
      setValue(fieldTime.toString() as Path<T>, localDate as PathValue<T, Path<T>>);

      if (localDate) {
        mutateAsync(localDate)
          .then(code => {
            setValue('code' as Path<T>, code as PathValue<T, Path<T>>);
          })
          .catch(error => console.error('[CREATE CODE]:', error));
      }
    },
    [fieldTime, mutateAsync, setValue]
  );

  const reset = useCallback(() => {
    setTriggerEffect(prev => !prev);
    isRendered.current = false;
  }, []);

  /**
   * Effect hook for initializing form fields (staffCreateId, staffCreatedId, branchId)
   * with default values based on the authenticated user and default branch.
   */
  // console.log({ isFormLoading });
  useEffect(() => {
    const userCreatedId = getValues<Path<T>[]>(['userCreatedId' as Path<T>]);
    if (!userCreatedId) {
      const userId = user?.userId as PathValue<T, Path<T>>;
      setValue('userCreatedId' as Path<T>, userId);
    }
  }, [getValues, setValue, user?.userId, triggerEffect]);

  /**
   * Effect hook triggered when the component mounts or when the 'fieldTime' changes.
   * It ensures that the 'code' field in the form is initialized with a value based on the current time.
   */
  useEffect(() => {
    // Initialize 'code' field if not already populated.
    if (!code && path.includes('new') && isRendered.current === false) {
      onTimeChange(new Date());
      isRendered.current = true;
    }
  }, [code, onTimeChange, path, triggerEffect]);

  return { onTimeChange, reset };
};
