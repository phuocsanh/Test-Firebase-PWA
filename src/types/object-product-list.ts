import { z } from 'zod';

export const objectProductList = z.object({
  productId: z.number().nullable().optional(),
  unitExchange: z.number().nullable().optional(),
});

export type ObjectProductList = z.infer<typeof objectProductList>;
