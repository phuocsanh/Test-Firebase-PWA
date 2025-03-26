import { cn } from '@/lib/utils';

type FormLayoutProps = {
  groupName: string;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
};

export const FormLayoutGroup = ({ groupName, className, children }: FormLayoutProps) => {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="rounded-md bg-gray-100 p-2">
        <h3 className="text-md font-medium text-primary">{groupName}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
};
