import { Button } from '@/components/ui/button';
import { useNav } from '@/hooks/use-nav';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { HeaderAvatarDropdown } from './header-avatar-dropdown';
import Notifications from './notification';
// import { ThemeSwitcher } from '@/components/theme-switcher';

export const Header = () => {
  const { isExpanded, toggle, toggleSheet, isSmall } = useNav();

  const handleClick = () => {
    if (isSmall) {
      // expand the menu before open the sheet
      if (!isExpanded) toggle();

      toggleSheet();
    } else {
      toggle();
    }
  };

  return (
    <div
      id="header-bar"
      className="flex h-min items-center justify-between border border-[#1A4A9BFF] bg-[#1A4A9BFF] px-3 pb-1 pt-2"
    >
      <div className="flex items-center space-x-4">
        <Button variant={'link'} className={cn('size-6 p-0 text-white')} onClick={handleClick}>
          <Menu size={24} />
        </Button>
      </div>
      <div className="flex flex-row items-center gap-5">
        {/* <ThemeSwitcher /> */}
        <Notifications />
        <HeaderAvatarDropdown />
      </div>
    </div>
  );
};
