import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { defaultValuesRecordAttachment, recordAttachmentWithOrderModuleSchema } from '@/types';
import { z } from 'zod';
import { ArrayElement } from './common';

export const requireSalesText = requiredTextWithNamespace('salesOrder');
export const salesOrderSchema = z.object({
  storeId: z.number().nullable(),
  id: z.number(),
  code: z
    .string({
      required_error: requireSalesText('code'),
      invalid_type_error: requireSalesText('code'),
    })
    .min(1, requireSalesText('code')),
  saleTime: z.date({
    required_error: requireSalesText('saleTime', 'select'),
  }),
  userCreateId: z
    .number({
      required_error: requireSalesText('userCreateId', 'select'),
      invalid_type_error: requireSalesText('userCreateId', 'select'),
    })
    .nullable(),
  totalAmountProduct: z.number(),
  note: z.string().nullable(),
  ids: z.number(),
  sort: z.string().nullable(),
  numberOfCode: z.string().optional().nullable(),
  customerId: z
    .number({
      required_error: requireSalesText('customerId', 'select'),
      invalid_type_error: requireSalesText('customerId', 'select'),
    })
    .nullable(),
  branchId: z
    .number({
      required_error: requireSalesText('branchId', 'select'),
      invalid_type_error: requireSalesText('branchId', 'select'),
    })
    .nullable(),
  paymentTypeId: z.number().nullable(),
  shippingFee: z.number().nullable(),
  percentDiscount: z.number(),
  cashDiscount: z.number(),
  percentVat: z.number(),
  cashVat: z.number(),
  totalAmount: z.number(),
  payment: z.number(),
  reductionAmount: z.number(),
  accountFundId: z
    .number({
      required_error: requireSalesText('accountFundId', 'select'),
      invalid_type_error: requireSalesText('accountFundId', 'select'),
    })
    .nullable(),
  receiptsAndExpensesContentId: z.number().nullable(),
  orderCustomerId: z.number().nullable(),
  isSaveTemp: z.boolean().default(false),
  customerNameRetail: z.string().optional().nullable(),
  customerPhoneRetail: z.string().optional().nullable(),
  customerAddressRetail: z.string().optional().nullable(),
  contactDelivery: z.string().nullable(),
  addressDelivery: z.string().nullable(),
  paymentSales: z.number().optional().nullable(),
  receiptsType: z.number().optional().nullable(),
  isSales: z.boolean().default(false),
  roomTableId: z.number().optional().nullable(),
  staffServiceId: z.number().optional().nullable(),
  notePayment: z.string().nullable(),
  receiptsAndExpensesContentPartyId: z.number().optional().nullable(),
  contentPartyDetail: z.string().nullable(),
  partyDate: z.date().optional().nullable(),
  partyPlace: z.string().nullable(),
  timesOfTheDayId: z.number().optional().nullable(),
  linkAttachFile: z.string().optional(),
  noteTabStaff: z.string().nullable(),
  noteDeliverDrinkName: z.string().nullable(),
  orderOrParty: z.number().optional().nullable(),
  moneyGuest: z.number().optional().nullable(),
  moneyTips: z.number().optional().nullable(),
  guarantorId: z.number().optional().nullable(),
  customerName: z.string().optional().nullable(),
  linkAttachFileArray: z.array(z.string()).optional().nullable(),
  saleDetails: z.array(
    z.object({
      id: z.number(),
      saleId: z.number().nullable(),
      productId: z.number(),
      unitId: z.number().nullable(),
      unitChange: z.number(),
      priceSale: z.number(),
      quantity: z.number(),
      specifications: z.number(),
      percentDiscount: z.number(),
      cashDiscount: z.number(),
      percentVat: z.number(),
      cashVat: z.number(),
      totalAmount: z.number(),
      note: z.string(),
      warehouseId: z.number().nullable(),
      quantityPromotion: z.number(),
      quantityRate: z.number(),
      productName: z.string().nullable(),
      isMenu: z.boolean().nullable(),
      orderCustomerDetailId: z.number().nullable().optional(),
      //
      unitName: z.string().optional().nullable(),
    })
  ),
  saleStaffs: z.array(
    z.object({
      id: z.number(),
      saleId: z.number().optional(),
      staffId: z.number().optional().nullable(),
      timeIn: z.string().optional(),
      timeOut: z.string().optional(),
      totalAmount: z.number().optional().nullable(),
      note: z.string().optional().nullable(),
    })
  ),
  saleDeliverDrinks: z.array(
    z.object({
      id: z.number().optional(),
      saleId: z.number().optional(),
      productId: z.number().optional(),
      unitId: z.number().optional(),
      unitChange: z.number().optional(),
      quantity: z.number().optional(),
    })
  ),
  saleStockInDeliverDrinkPartys: z.array(
    z.object({
      id: z.number(),
      saleId: z.number(),
      productId: z.number(),
      unitId: z.number(),
      unitChange: z.number(),
      price: z.number(),
      quantity: z.number(),
      specifications: z.number(),
      percentDiscount: z.number(),
      cashDiscount: z.number(),
      percentVat: z.number(),
      cashVat: z.number(),
      totalAmount: z.number(),
      note: z.string(),
      warehouseId: z.number(),
      quantityPromotion: z.number(),
      quantityRate: z.number(),
      orderCustomerTrackingStockInDeliverDrinkPartyId: z.number(),
    })
  ),
  ...recordAttachmentWithOrderModuleSchema.shape,
});

export type SalesOrder = z.infer<typeof salesOrderSchema>;

export type SaleOrderPrint = SalesOrder & {
  shellCustomerDebts: {
    customerId: number;
    productId: number;
    unitId: number;
    unitName: string;
    productName: string;
    typeProduct: number;
    quantityShellOld: number;
    quantityShellNew: number;
    quantityShellTotal: number;
  }[];
};

export type SalesOrderDetail = ArrayElement<SalesOrder['saleDetails']>;

export const defaultValuesSalesOrder = {
  storeId: 0,
  id: 0,
  code: '',
  saleTime: new Date(),
  userCreateId: 0,
  totalAmountProduct: 0,
  note: '',
  ids: 0,
  sort: '',
  numberOfCode: '',
  customerId: 0,
  branchId: 0,
  paymentTypeId: 0,
  shippingFee: 0,
  percentDiscount: 0,
  cashDiscount: 0,
  percentVat: 0,
  cashVat: 0,
  totalAmount: 0,
  payment: 0,
  deposit: 0,
  reductionAmount: 0,
  accountFundId: 0,
  receiptsAndExpensesContentId: 0,
  orderCustomerId: 0,
  isSaveTemp: true,
  customerNameRetail: '',
  customerPhoneRetail: '',
  customerAddressRetail: '',
  contactDelivery: '',
  addressDelivery: '',
  paymentReceipts: 0,
  receiptsType: 0,
  isReceipts: true,
  roomTableId: 0,
  staffServiceId: 0,
  notePayment: '',
  receiptsAndExpensesContentPartyId: 0,
  contentPartyDetail: '',
  partyDate: new Date(),
  partyPlace: '',
  timesOfTheDayId: 0,
  linkAttachFile: '',
  noteTabStaff: '',
  noteDeliverDrinkName: '',
  orderOrParty: 0,
  moneyGuest: 0,
  moneyTips: 0,
  guarantorId: 0,
  orderCustomerTrackingId: 0,
  supplierId: 0,
  accountNumberBank: '',
  accountNameBank: '',
  accountName: '',
  noteStockInDeliverDrinkParty: '',
  itemsRecordManagement: [defaultValuesRecordAttachment],
  saleDetails: [
    {
      id: 0,
      saleId: 0,
      productId: 0,
      unitId: 0,
      unitChange: 0,
      priceSale: 0,
      quantity: 0,
      specifications: 0,
      percentDiscount: 0,
      cashDiscount: 0,
      percentVat: 0,
      cashVat: 0,
      totalAmount: 0,
      note: '',
      warehouseId: 0,
      quantityPromotion: 0,
      quantityRate: 0,
      productName: '',
      isMenu: true,
      orderCustomerDetailId: 0,
      orderCustomerTrackingDetailId: 0,
    },
  ],
  saleStaffs: [
    // {
    //   id: 0,
    //   saleId: 0,
    //   staffId: 0,
    //   timeIn: '',
    //   timeOut: '',
    //   totalAmount: 0,
    //   note: '',
    //   orderCustomerTrackingStaffId: 0,
    //   staffNameOther: '',
    // },
  ],
  saleDeliverDrinks: [
    // {
    //   id: 0,
    //   saleId: 0,
    //   productId: 0,
    //   unitId: 0,
    //   unitChange: 0,
    //   quantity: 0,
    //   orderCustomerTrackingDeliverDrinkId: 0,
    // },
  ],
  saleStockInDeliverDrinkPartys: [
    // {
    //   id: 0,
    //   saleId: 0,
    //   productId: 0,
    //   unitId: 0,
    //   unitChange: 0,
    //   price: 0,
    //   quantity: 0,
    //   specifications: 0,
    //   percentDiscount: 0,
    //   cashDiscount: 0,
    //   percentVat: 0,
    //   cashVat: 0,
    //   totalAmount: 0,
    //   note: '',
    //   warehouseId: 0,
    //   quantityPromotion: 0,
    //   quantityRate: 0,
    //   orderCustomerTrackingStockInDeliverDrinkPartyId: 0,
    // },
  ],
};
