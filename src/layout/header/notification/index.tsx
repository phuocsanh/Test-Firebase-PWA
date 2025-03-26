import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Bell } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NotificationTabAll from './notification-tab-all';
import NotificationTabUnread from './notification-tab-unread';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useNav, useNotificationListenerServiceWorker } from '@/hooks';
import { createQueryPaginationFn } from '@/services';
import { Notification, QueryPaginationParams } from '@/types';
import { QUERIES } from '@/constant';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotificationListenerForeground } from '@/hooks/use-notification-listener-foreground';

function Notifications() {
  const { user } = useAuth();

  const { t } = useTranslation('notification');
  useNotificationListenerServiceWorker();
  useNotificationListenerForeground();

  const { totalNotifyUnread, setTotalNotifyUnread } = useNav();
  const notificationScrollTabUnread = useRef<number>(0);
  const notificationScrollTabAll = useRef<number>(0);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { data, refetch } = useQuery({
    queryKey: [QUERIES.NOTIFICATION_UNREAD_TOTAL],
    queryFn: () => {
      const params: QueryPaginationParams = {
        filterColumn: [
          {
            column: 'UserId',
            keySearch: String(user?.userId),
            expression: '=',
          },
          {
            column: 'IsViews',
            keySearch: 'false',
            expression: '=',
          },
        ],
        pageIndex: 1,
        sortColumn: 'DateSend',
        sortOrder: 1,
        pageSize: 1,
        isPage: true,
      };
      return createQueryPaginationFn<Notification>('notification')(params);
    },
  });
  useEffect(() => {
    if (data?.total && typeof data.total === 'number') {
      setTotalNotifyUnread(data.total);
    }
  }, [data?.total]);

  // useEffect(() => {
  //   listenForNotifications(queryClient);
  // }, [queryClient]);

  useEffect(() => {
    void (async () => {
      if (isPopoverOpen) {
        await refetch();
      }
    })();
  }, [isPopoverOpen]);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger
        asChild
        className={'flex items-center'}
        onClick={() => setIsPopoverOpen(true)}
      >
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white">
          <div className="absolute -right-2 -top-2 flex h-4 w-6 items-center justify-center rounded-full bg-red-600">
            <p className="text-xs text-white">
              {totalNotifyUnread && totalNotifyUnread > 99 ? '99+' : totalNotifyUnread || '0'}
            </p>
          </div>
          <Bell color="black" size={18} />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[300px] bg-white sm:w-[400px] sm:max-w-[400px]"
        side="bottom"
        align="end"
      >
        <Tabs defaultValue="unread">
          <TabsList>
            <TabsTrigger value="all">{t('tabs.all')}</TabsTrigger>
            <TabsTrigger value="unread">{t('tabs.unread')}</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <NotificationTabAll
              setIsPopoverOpen={setIsPopoverOpen}
              notificationScroll={notificationScrollTabAll}
            />
          </TabsContent>
          <TabsContent value="unread" className="!border-none" style={{ border: 'none' }}>
            <NotificationTabUnread
              notificationScroll={notificationScrollTabUnread}
              setIsPopoverOpen={setIsPopoverOpen}
            />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}

export default Notifications;
