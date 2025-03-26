import z from 'zod';

const notificationSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  userId: z.number(),
  isViews: z.boolean(),
  dateSend: z.date(),
  type: z.number(),
  storeId: z.number(),
  typeNotification: z.string(),
  body: z.string().optional().nullable(),
  isSend: z.boolean(),
  refId: z.number(),
});

export type SignalRNotification = {
  id: number;
  title: string;
  body: string;
  userIds: number;
  type_notification: string;
  ref_id: number;
};

export type SendPayload = {
  id: number;
  title: string;
  body: string;
  userIds: number;
  typeNotification: string;
  refId: number;
};
export type SendNotifyPayload = {
  id: number;
  title: string;
  content: string;
  userIds: (number | null | undefined)[];
  typeNotification: string;
  isViews: boolean;
  isSend: boolean;
  dateSend: Date | null;
  refId: number | null;
};
export const defaultValueSendNotifyPayload: SendNotifyPayload = {
  id: 0,
  title: '',
  content: '',
  userIds: [],
  typeNotification: '',
  isViews: false,
  isSend: true,
  dateSend: null,
  refId: null,
};
export type Notification = z.infer<typeof notificationSchema>;
