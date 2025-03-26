import axiosInstance, { request } from '@/axios-instance';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MUTATE, QUERIES } from '@/constant';
import { useNav } from '@/hooks';
import { formatTime } from '@/lib/utils';
import queryClient from '@/query-client';
import { Notification } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const NotificationItem = ({
  notification,
  setIsPopoverOpen,
}: {
  notification: Notification;
  setIsPopoverOpen: (isShow: boolean) => void;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('notification');
  const { setTotalNotifyUnread, totalNotifyUnread } = useNav();
  const { mutate: updateNotiMutate } = useMutation({
    mutationKey: [MUTATE.MARK_AS_READ_NOTIFICATION],
    mutationFn: async (data: { id: number }): Promise<number> => {
      return request<number>(
        axiosInstance.post(`/notification/update-is-view-by-id?id=${data.id}`)
      );
    },
    onSuccess: async (_, variables) => {
      setTotalNotifyUnread(totalNotifyUnread > 0 ? totalNotifyUnread - 1 : totalNotifyUnread);
      queryClient.setQueryData(
        [QUERIES.NOTIFICATION],
        (oldData: { pages: { items: Notification[] }[] } | undefined) => {
          if (!oldData) return oldData;
          const newPages = oldData.pages.map(page => {
            // Nếu trang này không chứa phần tử cần cập nhật, trả về trang gốc không thay đổi
            if (!page.items.some((item: Notification) => item.id === variables.id)) {
              return page;
            }
            // Nếu có, cập nhật isViews của phần tử đó
            return {
              ...page,
              items: page.items.map((item: Notification) => {
                if (item.id === variables.id) {
                  return { ...item, isViews: true };
                }
                return item;
              }),
            };
          });
          return { ...oldData, pages: newPages };
        }
      );
      queryClient.setQueryData(
        [QUERIES.NOTIFICATION_UNREAD],
        (oldData: { pages: { items: Notification[] }[] } | undefined) => {
          if (!oldData) return oldData;

          const newPages = oldData.pages.map(page => {
            // Nếu trang này không chứa phần tử cần xóa, trả về trang gốc không thay đổi
            if (!page.items.some((item: Notification) => item.id === variables.id)) {
              return page;
            }
            // Nếu có, tạo ra trang mới với danh sách item đã loại bỏ phần tử đó
            return {
              ...page,
              items: page.items.filter((item: Notification) => item.id !== variables.id),
            };
          });
          return { ...oldData, pages: newPages };
        }
      );
      await Promise.allSettled([
        [QUERIES.NOTIFICATION, QUERIES.NOTIFICATION_UNREAD].map(key =>
          queryClient.invalidateQueries({ queryKey: [key] })
        ),
      ]);
    },
  });
  const markAsRead = () => {
    if (!notification.isViews) {
      updateNotiMutate({ id: notification.id || 0 });
    }
  };

  function navigateToPath(type: string, id: number | null) {
    console.log('🚀 ~ navigateToPath ~ id:', id);
    console.log('🚀 ~ navigateToPath ~ type:', type);
    // // Danh sách các type hợp lệ
    // const validTypes = [
    //   PATHS.PROJECT,
    //   PATHS.DESIGN_TASK_MANAGEMENT,
    //   PATHS.CONTRACT_TASK_MANAGEMENT,
    //   PATHS.OVERTIME_REGISTRATION,
    // ];

    if (type) {
      const path = id == null || id < 0 ? type : `${type}/${id}`;
      navigate(path);
    }
  }

  const navigateNotification = (type: string | null, id: number | null) => {
    if (type) {
      markAsRead();
      setIsPopoverOpen(false);
      navigateToPath(type, id);
    }
  };

  return (
    <div
      onClick={() => navigateNotification(notification.typeNotification, notification.refId)}
      className="flex flex-col rounded-[2px] p-2 hover:cursor-pointer hover:bg-gray-100"
    >
      <div className="flex justify-between">
        <span className="mr-2 text-base">{notification.title}</span>
        {!notification.isViews && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={e => {
                    e.stopPropagation();
                    markAsRead();
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full hover:border-2 hover:border-[#194A9B]"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="50" cy="50" r="40" fill="#194A9B" />
                  </svg>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('page.common.markAsRead')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="py-1.5">
        <span className="line-clamp-2 text-sm">{notification.content}</span>
      </div>

      <time className="text-sm font-light text-gray-400">{formatTime(notification.dateSend)}</time>
    </div>
  );
};
export default NotificationItem;
