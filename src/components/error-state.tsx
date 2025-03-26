type ErrorStateProps = {
  text?: string;
};

export const ErrorState = ({
  text = 'An internal error occurred on the server',
}: ErrorStateProps) => {
  return <div>{text}</div>;
};
