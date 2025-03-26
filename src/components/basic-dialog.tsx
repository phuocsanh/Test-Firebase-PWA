import { cn } from '@/lib/utils';
import { Children, ReactNode, cloneElement, isValidElement } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Separator } from './ui/separator';

export type BasicDialogChildrenProps = {
  toggle?: BasicDialogProps['toggle'];
};

type BasicDialogProps = {
  open: boolean;
  toggle: () => void;
  title: string;
  description?: string | ReactNode;
  children: ReactNode | ReactNode[];
  className?: string;
};

export const BasicDialog = ({
  open,
  toggle,
  title,
  description,
  children,
  className,
  ...props
}: BasicDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={toggle} {...props}>
      <DialogContent
        className={cn('max-h-[90vh] max-w-[90vw] gap-1 p-0 py-3', className)}
        onInteractOutside={e => e.preventDefault()}
      >
        <DialogHeader className="px-[24px]">
          {/* <DialogTitle className="!text-t20 !font-semibold">{title}</DialogTitle> */}
          <DialogTitle className="!m-0 !text-t14 !font-semibold">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <Separator className={cn(description ? '' : 'mt-2')} />
        <div className="px-[24px] lg:pt-4">
          {Children.map(children, child => {
            if (!isValidElement<BasicDialogChildrenProps>(child)) {
              return null;
            }

            return cloneElement(child, { toggle });
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
