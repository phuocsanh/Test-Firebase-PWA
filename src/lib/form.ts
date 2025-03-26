import { FieldErrors, FieldValues } from 'react-hook-form';

export const getErrorMessage = <T extends FieldValues>(
  errors: FieldErrors<T>,
  validateField: keyof T
): string | undefined => {
  const fieldWithError = errors[validateField];

  if (fieldWithError?.message) {
    return String(fieldWithError.message);
  }

  if (Array.isArray(fieldWithError) && fieldWithError?.length > 0) {
    const firstError = (fieldWithError as FieldErrors[]).find(error => {
      if (!error) {
        return false;
      }

      const [firstKey] = Object.keys(error);
      const { message } = error?.[firstKey] as FieldErrors;

      return message && typeof message === 'string';
    });

    if (!firstError) {
      return;
    }

    return firstError[Object.keys(firstError)[0]]?.message as string;
  }

  return;
};
