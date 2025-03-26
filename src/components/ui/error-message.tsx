type ErrorMessageProps = {
  message?: string;
};

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return <p className="text-xs font-semibold text-destructive">{message}</p>;
};
