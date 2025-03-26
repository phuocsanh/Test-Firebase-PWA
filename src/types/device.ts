import z from 'zod';

const deviceSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  deviceToken: z.string(),
  userId: z.string().nullable(),
  platform: z.number().nullable(),
  note: z.string(),
  isActive: z.boolean(),
});

export type Device = z.infer<typeof deviceSchema>;
export const defaultValuesDevice = {
  storeId: null,
  id: 0,
  deviceToken: '',
  userId: '',
  platform: 0,
  note: '',
  isActive: true,
};
