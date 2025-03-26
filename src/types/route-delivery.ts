import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';

const requireRouterDeliveryText = requiredTextWithNamespace('routerDelivery');

export const routeDeliverySchema = z.object({ 
  isInactive: z.boolean(),
  id: z.number(),
  code: z
    .string({
      required_error: requireRouterDeliveryText('code'),
      invalid_type_error: requireRouterDeliveryText('code'),
    })
    .min(1, { message: requireRouterDeliveryText('code') }),
  name: z
    .string({
      required_error: requireRouterDeliveryText('name'),
      invalid_type_error: requireRouterDeliveryText('name'),
    })
    .min(1, { message: requireRouterDeliveryText('name') }),
  
  note: z.string().nullable().optional(),
  storeId: z.number(),
});

export type RouteDeliveryDefault = { id: number; key: string; label: string };

export type RouteDelivery = z.infer<typeof routeDeliverySchema>;
