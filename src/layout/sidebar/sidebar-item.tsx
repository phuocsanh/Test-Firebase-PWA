import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAccess } from '@/hooks';
import { useCurrentPath } from '@/hooks/use-current-path';
import { useNav } from '@/hooks/use-nav';
import { cn, isMatch } from '@/lib/utils';
import { CustomRouteType } from '@/router/routes';
import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// eslint-disable-next-line react-refresh/only-export-components
export const getSubItems = (item: CustomRouteType): CustomRouteType[] =>
  (item?.children ?? []).filter((i: CustomRouteType) => !i.hide);

export const SidebarItem = ({ item }: { item: CustomRouteType }) => {
  const { t } = useTranslation('navigation');

  const pathname = useCurrentPath();

  const { isExpanded } = useNav();

  const [isOpen, setIsOpen] = useState(false);

  const access = useAccess(item?.permissions);

  if (!access()) {
    return null;
  }

  const isSelected = isMatch(item.path || '', pathname);

  const Icon = () => {
    if (item.icon) {
      const IconElement = item.icon;
      return <IconElement size={16} strokeWidth={1} />;
    }

    // if (isSelected) {
    //   return <Dot size={20} strokeWidth={3} />;
    // }

    return <span className="w-5 shrink-0" />;
  };

  const subItems = getSubItems(item);
  const hasSubItems = subItems.length > 0;

  const onMouseEnter = () => !isExpanded && setIsOpen(true);

  const onMouseOut = () => !isExpanded && setIsOpen(false);

  return (
    <nav className="pl-0.5" onMouseOver={onMouseEnter} onMouseLeave={onMouseOut}>
      {isExpanded ? (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="">
          <CollapsibleTrigger className="w-full" asChild>
            <Link
              to={hasSubItems ? '#' : item.path!}
              key={item.path}
              className={cn(
                'flex h-auto w-full max-w-[238px] items-center justify-between px-1 py-1.5 text-t12 font-normal hover:bg-gray-100 hover:text-black focus:bg-[#1A4A9BFF] active:bg-gray-300',
                isSelected
                  ? 'bg-[#1A4A9BFF] !text-white hover:bg-[#1A4A9BFF] hover:text-black active:bg-blue-700'
                  : '!text-black'
              )}
            >
              <p className="flex items-center gap-x-2 overflow-hidden text-ellipsis">
                <Icon />
                <span className="w-full truncate" title={t(item.titleKey!)}>
                  {t(item.titleKey!)}
                </span>
              </p>
              {/* <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <p className="flex items-center gap-x-2 overflow-hidden text-ellipsis">
                      <Icon />
                      <span className="truncate">{t(item.titleKey!)}</span>
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t(item.titleKey!)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
              {hasSubItems ? (
                isOpen ? (
                  <ChevronUp strokeWidth={0.75} size={20} />
                ) : (
                  <ChevronDown strokeWidth={0.75} size={20} />
                )
              ) : null}
            </Link>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {subItems.map((childItem: CustomRouteType) => (
              <SidebarItem item={childItem} key={childItem.path} />
            ))}
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild className={'flex items-center'}>
            <Link
              key={item.path}
              to={hasSubItems ? '#' : item.path!}
              className={cn(
                'flex h-auto w-full max-w-[238px] justify-between px-1 py-1.5 text-t12 font-normal hover:bg-gray-100 focus:bg-gray-200/80 active:bg-gray-300',
                isSelected ? 'bg-gray-200/80 !text-black' : '!text-black'
              )}
            >
              <p className={'flex gap-x-2'}>
                {item.icon ? <Icon /> : <span>{t(item.titleKey!)}</span>}
              </p>
              {!item.icon && hasSubItems && <ChevronRight strokeWidth={0.75} size={20} />}
              {/* <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger>
                    <p className={'flex items-center gap-x-2'}>
                      {item.icon ? <Icon /> : <span>{t(item.titleKey!)}</span>}
                    </p>
                    {!item.icon && hasSubItems && <ChevronRight strokeWidth={0.75} size={20} />}
                  </TooltipTrigger>
                  <TooltipContent className="bg-black text-white">
                    <p>{t(item.titleKey!)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
            </Link>
          </PopoverTrigger>
          {hasSubItems && (
            <PopoverContent
              className="w-auto min-w-[200px] p-1 data-[state=open]:duration-300"
              side="right"
              align="start"
            >
              {subItems.map((childItem: CustomRouteType) => (
                <SidebarItem key={childItem.path} item={childItem} />
              ))}
            </PopoverContent>
          )}
        </Popover>
      )}
    </nav>
  );
};
