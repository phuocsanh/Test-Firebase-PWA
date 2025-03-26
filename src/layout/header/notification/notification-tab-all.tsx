import { LoadingOverlay } from '@/components/loading-overlay';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QUERIES } from '@/constant';
import { useAuth } from '@/hooks';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';
import { createQueryPaginationFn } from '@/services';
import { Notification, QueryPaginationParams } from '@/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import NotificationItem from './notification-item';

const NotificationTabAll = ({
  notificationScroll,
  setIsPopoverOpen,
}: {
  notificationScroll: React.MutableRefObject<number>;
  setIsPopoverOpen: (isShow: boolean) => void;
}) => {
  const { t } = useTranslation('notification');

  const { height } = useWindowDimensions();
  const { user } = useAuth();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.scrollTop = notificationScroll.current || 0;
    }
  }, []);
  const queryFunction = async ({ pageParam = 1 }) => {
    const queryFn = createQueryPaginationFn<Notification>('notification');

    if (queryFn) {
      const params: QueryPaginationParams = {
        filterColumn: [
          {
            column: 'UserId',
            keySearch: String(user?.userId),
            expression: '=',
          },
        ],
        pageIndex: pageParam,
        sortColumn: 'DateSend',
        sortOrder: 1,
        pageSize: 20,
        isPage: true,
      };

      return await queryFn(params);
    }

    return Promise.reject();
  };

  const { data, fetchNextPage, isFetching, isPending } = useInfiniteQuery({
    // refetchOnWindowFocus: true,
    // refetchOnReconnect: true,
    queryKey: [QUERIES.NOTIFICATION],
    queryFn: queryFunction,
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (lastPage.items.length === 0) {
        return;
      }
      return lastPage.pageIndex + 1;
    },
  });

  const list = useMemo(() => {
    return (
      data?.pages
        .map(page => page.items)
        .flat()
        .map(item => item) || []
    );
  }, [data]);
  const atBottom = (eventTarget: HTMLElement) => {
    const { scrollHeight, scrollTop, offsetHeight } = eventTarget;
    if (offsetHeight === 0) {
      return true;
    }
    return Math.abs(scrollTop - (scrollHeight - offsetHeight)) < 2;
  };
  // handle scroll data
  const handleScroll: React.UIEventHandler<HTMLDivElement> = event => {
    notificationScroll.current = event.currentTarget.scrollTop;
    if (!atBottom(event.currentTarget) || isFetching) {
      return;
    }
    void fetchNextPage();
  };
  return (
    <div style={{ height: `${height * 0.8}px` }}>
      {!isPending && list.length === 0 && (
        <div className="flex h-full items-center justify-center">
          <span className="text-base">{t('page.common.notFound')}</span>
        </div>
      )}
      {isPending ? (
        <>
          <div className="h-full" />
          <LoadingOverlay loading={isPending} />
        </>
      ) : (
        <ScrollArea
          ref={scrollRef}
          style={{ maxHeight: `${height * 0.8}px` }}
          className=" overflow-auto"
          onScroll={handleScroll}
        >
          {list.map(item => (
            <NotificationItem
              setIsPopoverOpen={setIsPopoverOpen}
              key={item.id}
              notification={item}
            />
          ))}
        </ScrollArea>
      )}
    </div>
  );
};

export default NotificationTabAll;
