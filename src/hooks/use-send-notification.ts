import { createPostMutateFn } from '@/services';
import { defaultValueSendNotifyPayload, SendNotifyPayload } from '@/types';
import { MUTATE } from '@/constant';
import { useMutation } from '@tanstack/react-query';
import { toLocaleDate } from '@/lib/date';
import { getUserIds } from '@/lib/utils';

export function useSendNotification() {
  const { mutate, isSuccess, isError } = useMutation({
    mutationKey: [MUTATE.SEND_NOTIFICATION],
    mutationFn: createPostMutateFn<SendNotifyPayload>('notification'),
    retry: 3,
  });

  const sendNotify = (payload: Partial<SendNotifyPayload>) => {
    const ids = getUserIds(payload.userIds || []);
    if (!ids.length) return;
    const mergedPayload: SendNotifyPayload = {
      ...defaultValueSendNotifyPayload,
      ...payload,
      userIds: ids,
      dateSend: toLocaleDate(new Date())!,
    };
    mutate(mergedPayload);
  };

  return { isSuccess, isError, sendNotify };
}
