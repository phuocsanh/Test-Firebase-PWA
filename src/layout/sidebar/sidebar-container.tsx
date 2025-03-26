import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useNav } from '@/hooks/use-nav';
import { twMerge } from 'tailwind-merge';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

export const SideBarContainer = ({ children }: { children: React.ReactNode }) => {
  const { isExpanded, isSheetOpen, toggleSheet, isSmall } = useNav();

  if (isSmall) {
    return (
      <Sheet open={isSheetOpen} onOpenChange={toggleSheet}>
        <VisuallyHidden.Root>
          <SheetTitle>Side bar sheet title</SheetTitle>
        </VisuallyHidden.Root>
        <SheetContent side="left" className="w-52 p-0">
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={twMerge('h-full transition-all duration-300', isExpanded ? 'w-60' : 'w-10')}
      id="side-bar"
    >
      {children}
    </div>
  );
};
