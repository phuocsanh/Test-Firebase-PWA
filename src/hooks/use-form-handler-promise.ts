import { MutationKey, QueryKey, useQuery } from '@tanstack/react-query';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { DefaultValues, FieldValues, UseFormProps, useForm } from 'react-hook-form';
import { useMutate } from './use-mutate';

/**
 * Configuration options for the useFormHandler hook.
 *
 * @template FormValues - The type representing the shape of form values, extending FieldValues & { id: number }.
 */
interface UseFormHandlerOptions<FormValues extends FieldValues & { id: number }> {
  /**
   * The query key for fetching data using react-query.
   */
  queryKey: QueryKey;

  /**
   * The query key for fetching data using react-query.
   */
  mutateKey: MutationKey;

  /**
   * The query key for fetching data using react-query.
   */
  invalidateKey?: QueryKey;

  /**
   * The ID used for querying specific data. Default is 0.
   */
  queryId?: FormValues['id'];

  /**
   * The options for react-hook-form useForm hook.
   */
  formOptions?: UseFormProps<FormValues, unknown>;

  /**
   * A function to format the response data obtained from the server.
   */
  formatResponseFn?: (data: FormValues) => FormValues | DefaultValues<FormValues> | undefined;

  /**
   * A function to format the payload before sending it to the server.
   */
  formatPayloadFn?: (data: FormValues) => FormValues;

  /**
   * A function to fetch form data for a given ID from the server.
   */
  readFn?: (id: FormValues['id']) => Promise<FormValues>;

  /**
   * A function to create new data on the server.
   */
  createFn?: (data: FormValues) => Promise<number>;

  /**
   * A function to update existing data on the server.
   */
  updateFn?: (data: FormValues) => Promise<number>;

  /**
   * A callback function executed after a successful create operation.
   * @example
   * ```tsx
   * const onCreateSuccess = (data, variables) => {
   *   console.log('Successfully created:', data);
   *   console.log('Form variables:', variables);
   *   if (data === 1) {
   *     notification.success(i18next.t('order.updateSuccess'));
   *   }
   * };
   * ```
   */
  onCreateSuccess?: (data: number, variables: FormValues) => void;

  /**
   * A callback function executed after a successful update operation.
   * @example
   * ```tsx
   * const onUpdateSuccess = (data, variables) => {
   *   console.log('Successfully updated:', data);
   *   console.log('Form variables:', variables);
   *   if (data === 1) {
   *     notification.success(i18next.t('order.createSuccess'));
   *   }
   * };
   * ```
   */
  onUpdateSuccess?: (data: number, variables: FormValues) => void;
}

/**
 * useFormHandler Hook
 *
 * A custom hook to handle forms in React applications with the help of react-hook-form,
 * react-query, and other utility functions.
 *
 * @template FormValues - The type representing the shape of form values, extending FieldValues & { id: number }.
 * @param {UseFormHandlerOptions<FormValues>} props - The configuration options for the useFormHandler hook.
 * @returns {Object} - An object containing the data, methods, loading status, handleSubmit function, and error information.
 */
export const useFormHandlerPromise = <FormValues extends FieldValues & { id: number }>({
  queryKey,
  mutateKey,
  // invalidateKey,
  queryId = 0,
  formOptions,
  formatResponseFn,
  formatPayloadFn,
  readFn,
  createFn,
  updateFn,
  onCreateSuccess,
  onUpdateSuccess,
}: UseFormHandlerOptions<FormValues>) => {
  const methods = useForm<FormValues>(formOptions);
  const { reset } = methods;
  const [currentId, setCurrentId] = useState<number>(queryId);
  const formatResponseFnRef = useRef(formatResponseFn);

  const {
    data,
    refetch,
    error,
    isLoading: querying,
    isSuccess,
  } = useQuery<FormValues>({
    queryKey,
    queryFn: async () => {
      if (readFn && currentId !== 0) {
        return await readFn(currentId);
      }
      return Promise.reject();
    },
    enabled: Boolean(readFn) && Boolean(currentId) && currentId !== 0,
    staleTime: 0,

    // onSuccess: data => {
    //   const formValues = formatResponseFn ? formatResponseFn(data) : data;
    //   reset(formValues);
    //   return formValues;
    // },
  });
  const resetQueryId = () => {
    setCurrentId(0);
  };
  const { mutate: create, isPending: adding } = useMutate<number, FormValues>({
    // invalidateKey,
    mutationFn: createFn,
    mutationKey: mutateKey,
  });

  const { mutate: update, isPending: updating } = useMutate<number, FormValues>({
    // invalidateKey,
    mutationFn: updateFn,
    mutationKey: mutateKey,
  });

  useEffect(() => {
    if (isSuccess && data) {
      const formValues = formatResponseFnRef.current ? formatResponseFnRef.current(data) : data;
      reset(formValues);
    }
  }, [data, isSuccess, reset]);

  useEffect(() => {
    if (!queryId) {
      reset((formOptions?.defaultValues as DefaultValues<FormValues>) ?? {});
    }
  }, [queryId, formOptions?.defaultValues, reset]);

  const loading = adding || updating || querying;

  const onSubmitNotInValidateQuery = (values: FormValues): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
      values = { ...methods.getValues(), ...values };
      const payload = formatPayloadFn ? formatPayloadFn(values) : values;
      if (!queryId) {
        create(payload, {
          onSuccess: (data, variables) => {
            setCurrentId(data);

            if (onCreateSuccess) {
              onCreateSuccess(data, variables);
            }
            resolve(data);
          },
          onError: error => reject(error),
        });
      } else {
        update(payload, {
          onSuccess: (data, variables) => {
            if (onUpdateSuccess) {
              onUpdateSuccess(data, variables);
            }
            resolve(data);
          },
          onError: error => reject(error),
        });
      }
    });
  };
  // Sử dụng khi cần dùng .then() để xử lý tác vụ tiếp theo
  const handleSubmitPromise = (e?: SyntheticEvent<HTMLElement>): Promise<FormValues> => {
    e?.preventDefault?.();
    return new Promise<FormValues>((resolve, reject) => {
      const submitHandler = methods.handleSubmit(
        async (values: FormValues) => {
          try {
            // Đợi mutation hoàn thành
            await onSubmitNotInValidateQuery(values);

            // Sau đó, gọi refetch để lấy dữ liệu mới từ server
            const result = await refetch();
            if (result.data) {
              resolve(result.data);
            } else {
              reject(new Error('Không có dữ liệu sau khi refetch'));
            }
          } catch (error) {
            reject(error);
          }
        },
        errors => {
          console.error('Lỗi khi submit form: ', errors);
          reject(errors);
        }
      );
      submitHandler().catch(error => {
        console.error('Lỗi submitHandler: ', error);
        reject(error);
      });
    });
  };

  return { data, methods, loading, refetch, error, handleSubmitPromise, resetQueryId };
};
