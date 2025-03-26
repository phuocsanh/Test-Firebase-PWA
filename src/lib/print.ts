import { translationWithNamespace } from '@/lib/i18nUtils';
import { realNumberDecimalFormat } from './number';
import * as nunjucks from 'nunjucks';

const nunjucksEnv = nunjucks.configure('./templates', {
  throwOnUndefined: false, // Disable strict undefined checks
  autoescape: true, // Prevent XSS by default
  trimBlocks: true, // Cleaner output
});

nunjucksEnv.addFilter('sumAttribute', (arr: Array<Record<string, number>>, attribute: string) => {
  if (!arr || arr.length === 0) return 0;

  return arr.reduce(
    (total: number, item: Record<string, number>) => total + (item[attribute] || 0),
    0
  );
});

// Add global error handler
nunjucksEnv.addGlobal('handleTemplateError', (error: any) => {
  console.error('Template Error:', error.message);
  return `<div class="error">Template Error: ${error.message}</div>`;
});

export const editorConfiguration = {
  height: '52vh',
  extraPlugins: ['justify', 'colorbutton', 'font'],
  // removeButtons:
  // 	"Maximize,Strike,Subscript,Superscript,About",
  colorButton_colors: 'f5222d,ff00ff,0000ff,000000',
  toolbar: [
    { name: 'tools', items: ['Maximize'] },
    {
      name: 'clipboard',
      items: ['Cut', 'Copy', 'Paste', 'PasteText', '-', 'Undo', 'Redo'],
    },
    {
      name: 'links',
      items: ['Link', 'Unlink'],
    },
    {
      name: 'colors',
      items: ['TextColor', 'BGColor'],
    },
    {
      name: 'insert',
      items: ['Image', 'Table', 'HorizontalRule'],
    },
    {
      name: 'document',
      items: ['Source', '-', 'Styles'],
    },
    '/',
    {
      name: 'basicstyles',
      items: ['Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript'],
    },
    {
      name: 'paragraph',
      items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote'],
    },
    {
      name: 'align',
      items: ['AlignLeft', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
    },
    {
      name: 'styles',
      items: ['Format', '-', 'Font', '-', 'FontSize'],
    },
    '/',
  ],
};

const textWithNamespace = translationWithNamespace('printForm');

export const sizes = [
  {
    id: 0,
    code: 'A4',
    name: textWithNamespace('dataset.size.a4'),
  },
  {
    id: 1,
    code: 'A5',
    name: textWithNamespace('dataset.size.a5'),
  },
  {
    id: 2,
    code: 'K57',
    name: textWithNamespace('dataset.size.k57'),
  },
  {
    id: 3,
    code: 'K80',
    name: textWithNamespace('dataset.size.k80'),
  },
];

// export const templates = [
//   {
//     id: 1,
//     code: 'quotes',
//     name: textWithNamespace('dataset.type.quotes'),
//   },
//   {
//     id: 2,
//     code: 'order_supplier',
//     name: textWithNamespace('dataset.type.orderSupplier'),
//   },
//   {
//     id: 3,
//     code: 'stock_in',
//     name: textWithNamespace('dataset.type.stockIn'),
//   },
//   {
//     id: 4,
//     code: 'transfer_warehouse',
//     name: textWithNamespace('dataset.type.transferWarehouse'),
//   },
//   {
//     id: 5,
//     code: 'print_sale_list_selected',
//     name: textWithNamespace('dataset.type.printSaleListSelected'),
//   },
//   {
//     id: 6,
//     code: 'printS_sale_list_by_group',
//     name: textWithNamespace('dataset.type.printSaleListByGroup'),
//   },
//   {
//     id: 7,
//     code: 'PRINT_SALE_LIST_DELIVERY',
//     name: textWithNamespace('dataset.type.printSaleListDelivery'),
//   },
//   {
//     id: 8,
//     code: 'PRINT_SALE_BY_CAR',
//     name: textWithNamespace('dataset.type.printSaleByCar'),
//   },
//   {
//     id: 9,
//     code: 'RECEIPTS',
//     name: textWithNamespace('dataset.type.receipts'),
//   },
//   {
//     id: 10,
//     code: 'PAYMENT',
//     name: textWithNamespace('dataset.type.payment'),
//   },
//   {
//     id: 11,
//     code: 'STOCK_OUT',
//     name: textWithNamespace('dataset.type.stockOut'),
//   },
//   {
//     id: 12,
//     code: 'STOCK_ADJUSTMENT',
//     name: textWithNamespace('dataset.type.stockAdjustment'),
//   },
//   {
//     id: 13,
//     code: 'SALES_MCP',
//     name: textWithNamespace('dataset.type.salesMcp'),
//   },
//   {
//     id: 14,
//     code: 'CUSTOMER_DEBT_BY_GROUP',
//     name: textWithNamespace('dataset.type.customerDebtByGroup'),
//   },
//   {
//     id: 15,
//     code: 'CUSTOMER_DEBT',
//     name: textWithNamespace('dataset.type.customerDebt'),
//   },
//   {
//     id: 16,
//     code: 'CUSTOMER_DEBT_DETAIL',
//     name: textWithNamespace('dataset.type.customerDebtDetail'),
//   },
//   {
//     id: 17,
//     code: 'SUPPLIER_DEBT_BY_GROUP',
//     name: textWithNamespace('dataset.type.supplierDebtByGroup'),
//   },
//   {
//     id: 18,
//     code: 'SUPPLIER_DEBT',
//     name: textWithNamespace('dataset.type.supplierDebt'),
//   },
//   {
//     id: 19,
//     code: 'SUPPLIER_DEBT_DETAIL',
//     name: textWithNamespace('dataset.type.supplierDebtDetail'),
//   },
//   {
//     id: 10,
//     code: 'FILTER_SALES',
//     name: textWithNamespace('dataset.type.filterSales'),
//   },
//   {
//     id: 11,
//     code: 'STOCK_IN_FILTER',
//     name: textWithNamespace('dataset.type.stockInFilter'),
//   },
//   {
//     id: 12,
//     code: 'SUPPLIER_DEBTS_DETAIL',
//     name: textWithNamespace('dataset.type.supplierDebtsDetail'),
//   },
//   {
//     id: 13,
//     code: 'CUSTOMER_DEBTS_DETAIL',
//     name: textWithNamespace('dataset.type.customerDebtsDetail'),
//   },
// ];

// export const templateHash = hash(templates, 'code');

const defaultFormData = {
  // nameCompany: 'CÔNG TY MEKONG SOFT',
  // address: 'L2-17 Phan Thị Ràng, Rạch Giá, Kiên Giang',
  // phone: '02943.862436-860960-866769',
  // code: 'DHN211202-000080',
  // time: '03/12/2021 15:11',
  // supplierName: 'Công ty Cổ phần phần mềm MEKONG (MEKONG SOFT JSC)',
  // supplierPhone: '0365214141',
  // supplierAddress: 'Address demo',
  // customerName: 'Công ty Cổ phần phần mềm MEKONG (MEKONG SOFT JSC)',
  // customerPhone: '0365214141',
  // customerAddress: 'Address demo',

  invoiceConfigName: 'viettel',
  isActive: true,
  id: 1,

  companyCode: 'MKS2022',
  companyName: 'CÔNG TY XĂNG DẦU MEKONG',
  companyAddress: '64 Nguyễn Đình Chiểu, Phường Đa Kao, Quận 1, HCM',
  companyPhone: '0979888999',
  companyEmail: 'support@gmail.com',
  companyWebsite: '',
  companyFax: '68686868',
  companyTaxCode: '0100109106-503',
  companyBankName: 'ACB',
  companyBankAccount: '9999777888',
  companyRepresentative: 'Nguyễn Văn Trường',
  companyPosition: 'Giám đốc',
  companyDescription: '',
  storeId: 12,
  invoiceConfigId: 1,

  userSalseName: 'Nguyễn Văn A',
  stockerName: 'Nguyễn Văn A',
  branchName: 'Chi nhánh A',
  warehouseName: 'Kho hàng trung tâm',
  payerName: 'Công ty Cổ phần phần mềm MEKONG',
  payerPhone: '0365214141',
  payerAdress: 'demo',
  recipientName: 'Công ty Cổ phần phần mềm MEKONG',
  recipientPhone: '0365214141',
  recipientAdress: 'demo',
  receiptsAndExpensesContentName: 'Test thu',
  accountFundOutName: 'Quỹ chuyển demo',
  accountFundInName: 'Quỹ nhận demo',
  proceedsAmount: '100,000',
  transferAmount: '100,000',
  note: 'demo note',
  totalAmountProduct: '623,700',
  percentVat: 0,
  cashVat: 0,
  percentDiscount: 0,
  cashDiscount: 0,
  shippingFee: '15,000',
  userName: 'Admin',
  creatorName: 'Quản trị viên',
  totalAmount: '693,500',
  oldDebt: '2,645,626.770',
  totalDebt: '4,500,000',
  deposit: '100,000',
  proceeds: '100,000',
  spentAmount: '100,000',
  reductionAmount: '10,000',
  lastDebt: '5,500,000',
  lastNoDebt: '5,500,000',
  remain: '5,500,000',
  voucherNumberAttached: '8374243242',
  amountByText: 'Sáu trăm hai mươi ba nghìn bảy trăm đồng.',
  date: '28',
  month: '12',
  year: '2021',
  totalNumberKg: '2,785',
  totalNumberBlocks: '643.524',
  // totalAmount: '11,4066,928,450',
  staffName: 'Ông Trùm Của Hệ Thống',
  staffStockOutName: 'Ông Trùm Của Hệ Thống',
  typeReceiptsAndExpensesContentName: 'Nội dung nhập',
  // receiptsAndExpensesContentName: 'Nội dung xuất',
  sumMustReceiptMoney: '1,006,080',
  sumPaidMoney: '22,872,673.123',
  sumRestMoney: '566,520',
  sumTotalAmountDetail: '566,520',
  fromDate: '21/02/2022',
  toDate: '21/02/2022',
  sumFirstDebt: '19,698,320.123',
  sumSale: '30,659,780',
  sumReceipts: '657,320',
  sumLastDebt: '49,465,580.123',
  // for print selected sales
  carName: 'Xe anh 5',
  scheduleSales: 'String',
  groupCustomerName: 'Nhóm 5',
  printCount: '12',
  // totalNumberKg: 15,
  totalNumberBlock: 20,
  // totalAmount: '120,000',
  reducePercent: 0,
  totalAmountAfterReduce: '120,000',
  // for print sale by car
  route: 'ABC',
  // carName: 'Xe anh 5',
  shipper1Name: 'Nguyễn Văn A',
  shipper2Name: 'Nguyễn Văn B',
  totalMoney: '120,000',
  // totalNumberKg: 15,
  // totalNumberBlock: 20,
  // for transfer warehouse
  fromWarehouseName: 'Kho 1',
  toWarehouseName: 'Kho 2',
  details: [
    [
      {
        id: 1,
        order: 1,
        productName: 'Bia tiger',
        productCodeLot: 'TIGER-LO-1',
        unitName: 'Bao',
        unit1Name: 'Thùng',
        unitExchange: 1,
        quantity: 1,
        quantityPromotion: 1,
        specificationsLong: 1,
        specificationsWide: 1,
        specifications: 1,
        totalQuantity: 2,
        priceBuy: '600,000',
        price: '600,000',
        price1: '600,000',
        priceSale: '600,000',
        percentDiscount: 0,
        percentVat: 0,
        totalAmount: '623,700',
        description: 'description',
        note: 'note',
        mfg: '12/02/2021',
        exp: '12/02/2022',
        numberKg: 10,
        numberBlock: 0.0539,
        saleStaffName: 'Ông Trùm Của Hệ Thống',
        code: 'PTT220216-000061',
        customerName: 'Nguyễn Văn A',
        supplierName: 'Nguyễn Văn A',
        mustReceiptMoney: '2,000',
        paidMoney: '2,000',
        restMoney: '0',
        saleTime: '15-02-2022',
        receiptsTime: '15-02-2022',
        staffCommitName: 'Nguyễn Văn Max',
        saleNote: 'Sale note',
        warehouseName: 'Cải Thìa 500g',
        // for payment
        staffPaymentName: 'Ông Trùm Của Hệ Thống',
        receiverName: 'Nguyễn Văn Max',
        moneyPayment: 123,
        receiptsAndExpensesContentName: 'Nội dung chi',
        accountFundNumber: '070094097728',
        salaryAdvanceCode: 'code',
        typeCp: '',
        industryCode: '',
        paymentCode: '',
        // for mcp
        staffName: 'Ông Trùm Của Hệ Thống',
        productGroupName: 'Nguyễn Văn Nhất',
        customerAddress: 'Address',
        customerPhone: '094324234',
        customerBusinessType: 'Bán lẻ',
        customerTypeName: 'Khách lẻ',
        totalAmountAfterReduce: '13,390,500',
        staffSaleName: 'Ông Trùm Của Hệ Thống',
        productBarCode: 'Phân DAP ',
        priceAfterDiscount: '20,000',
        detailTotalAmount: '20,000',
        // for filter sales,
        paymentTime: '15-02-2022',
        saleCode: 'DH09423424',
        staffSaleCode: 'NV1',
        customerCode: 'KH1',
        customerGroupName: 'Dương đông',
        carName: 'XE 7',
        productCode: 'BIA_TG',
        saleDetailquantity: '1,000',
        saleDetailquantityPromotion: '10',
        saleDetailPrice: '15,000',
        saleDetailTotalAmount: '15,000,000',
        saleDetailPercentDiscount: 0,
        saleDetailTotalAmountAfterDiscount: '15,000,000',
        saleDetailReducePercent: 0,
        saleDetailTotalAmountAfterPercent: '15,000,000',
        saleTotalAmount: '15,000,000',
        // for filter stock in
        stockInTime: '15-02-2022',
        staffCreateCode: 'DH094234324',
        staffCreateName: 'Nhân viên 1',
        supplierCode: 'NCC1',
        // product use above
        stockInDetailQuantity: '1,000',
        stockInDetailQuantityPromotion: 10,
        stockInDetailPriceBuy: '15,000',
        stockInDetailTotalAmount: '15,000,000',
        stockInDetailPercentDiscount: 0,
        stockInDetailTotalAmountAfterDiscount: '15,000,000',
        stockInTotalAmount: '15,000,000',
        gasStationCode: 'T01',
        gasStationName: 'Trụ 1',
        warehouseCode: 'KH2',
        roundTotalOrEngineName: 'Số Total',
        finalizeWorkShiftId: 6,
        gasStationId: 1,
        totalNumberOld: 50000,
        engineNumberOld: 50000,
        totalNumberNew: 51000,
        engineNumberNew: 0,
        roundTotalOrEngine: 1,
        unitPrice: 23000,
        warehouseId: 1,
        productId: 9,
        unitId: 3,
        unitChange: 1000,
      },
      {
        id: 2,
        order: 2,
        unitName: 'Bao',
        unit1Name: 'Thùng',
        unitExchange: 1,
        quantity: 1,
        quantityPromotion: 0,
        specificationsLong: 1,
        specificationsWide: 1,
        specifications: 1,
        totalQuantity: 2,
        priceBuy: '600,000',
        price: '600,000',
        price1: '600,000',
        percentDiscount: 5,
        percentVat: 5,
        totalAmount: '623,700',
        description: 'description',
        note: 'note',
        mfg: '12/02/2021',
        exp: '12/02/2022',
        numberKg: 10,
        numberBlock: 0.0539,
        saleStaffName: 'Ông Trùm Của Hệ Thống',
        code: 'PTT220216-000061',
        customerName: 'Nguyễn Văn A',
        supplierName: 'Nguyễn Văn A',
        mustReceiptMoney: '2,000',
        paidMoney: '2,000',
        restMoney: '0',
        saleTime: '15-02-2022',
        receiptsTime: '15-02-2022',
        staffCommitName: 'Nguyễn Văn Max',
        saleNote: 'Sale note',
        warehouseName: 'Cải Thìa 500g',
        // for payment
        paymentTime: '15-02-2022',
        staffPaymentName: 'Ông Trùm Của Hệ Thống',
        receiverName: 'Nguyễn Văn Max',
        moneyPayment: 123,
        receiptsAndExpensesContentName: 'Nội dung chi',
        accountFundNumber: '070094097728',
        salaryAdvanceCode: 'code',
        typeCp: '',
        industryCode: '',
        paymentCode: '',
        // for mcp
        staffName: 'Ông Trùm Của Hệ Thống',
        productGroupName: 'Nguyễn Văn Nhất',
        customerAddress: 'Address',
        customerPhone: '094324234',
        customerBusinessType: 'Bán lẻ',
        customerTypeName: 'Khách lẻ',
        totalAmountAfterReduce: '13,390,500',
        staffSaleName: 'Ông Trùm Của Hệ Thống',
        productBarCode: 'Phân DAP ',
        priceAfterDiscount: '100,000',
        detailTotalAmount: '100,000',
        // for filter sales,
        saleCode: 'DH094234324',
        staffSaleCode: 'NV1',
        customerCode: 'KH1',
        customerGroupName: 'Dương đông',
        carName: 'XE 7',
        productCode: 'BIA_KEN',
        productName: 'Bia ken',
        productCodeLot: 'KEN-LO-1',
        saleDetailquantity: '1,000',
        saleDetailquantityPromotion: '10',
        saleDetailPrice: '20,000',
        saleDetailTotalAmount: '20,000,000',
        saleDetailPercentDiscount: 0,
        saleDetailTotalAmountAfterDiscount: '20,000,000',
        saleDetailReducePercent: 0,
        saleDetailTotalAmountAfterPercent: '20,000,000',
        saleTotalAmount: '20,000,000',
        // for filter stock in
        stockInTime: '15-02-2022',
        staffCreateCode: 'DH094234324',
        staffCreateName: 'Nhân viên 1',
        supplierCode: 'NCC1',
        // product use above
        stockInDetailQuantity: '1,000',
        stockInDetailQuantityPromotion: 10,
        stockInDetailPriceBuy: '20,000',
        stockInDetailTotalAmount: '20,000,000',
        stockInDetailPercentDiscount: 0,
        stockInDetailTotalAmountAfterDiscount: '20,000,000',
        stockInTotalAmount: '20,000,000',
      },
      // có con
      {
        ordinalNumber: 1,
        refId: 0,
        refTime: '2013-01-01T00:00:00',
        code: '',
        numberOfCode: '',
        supplierId: 0,
        supplierCode: '',
        supplierName: '',
        supplierAddress: '',
        supplierPhone: '',
        refExplain: 'Nợ đầu',
        totalAmount: 0,
        paymentAmount: 0,
        receiptsAmount: 0,
        reductionAmount: 0,
        debtAmount: -9998647631,
        rampartsAmount: 0,
        sort: '0',
        refDetailIdDetail: 0,
        productCodeDetail: null,
        unitNameDetail: null,
        unitChangeDetail: 0,
        priceBuyDetail: null,
        quantityDetail: 0,
        specificationsDetail: 0,
        percentDiscountDetail: 0,
        cashDiscountDetail: 0,
        percentVatDetail: 0,
        cashVatDetail: 0,
        totalAmountDetail: 0,
        noteDetail: '',
        warehouseNameDetail: null,
        quantityPromotionDetail: 0,
        weightDetail: 0,
        totalWeightProductDetail: 0,
        paymentTypeName: null,
        shippingFee: 0,
        percentDiscount: 0,
        cashDiscount: 0,
        percentVat: 0,
        cashVat: 0,
        totalWeight: 0,
        productNameDetail: null,
        branchName: null,
        note: '',
        details: [
          {
            ordinalNumber: 1,
            refId: 0,
            refTime: '2013-01-01T00:00:00',
            code: '',
            numberOfCode: '',
            supplierId: 0,
            supplierCode: '',
            supplierName: '',
            supplierAddress: '',
            supplierPhone: '',
            refExplain: 'Nợ đầu',
            totalAmount: 0,
            paymentAmount: 0,
            receiptsAmount: 0,
            reductionAmount: 0,
            debtAmount: -9998647631,
            rampartsAmount: 0,
            sort: '0',
            refDetailIdDetail: 0,
            productCodeDetail: null,
            unitNameDetail: null,
            unitChangeDetail: 0,
            priceBuyDetail: null,
            quantityDetail: 0,
            specificationsDetail: 0,
            percentDiscountDetail: 0,
            cashDiscountDetail: 0,
            percentVatDetail: 0,
            cashVatDetail: 0,
            totalAmountDetail: 0,
            noteDetail: '',
            warehouseNameDetail: null,
            quantityPromotionDetail: 0,
            weightDetail: 0,
            totalWeightProductDetail: 0,
            paymentTypeName: null,
            shippingFee: 0,
            percentDiscount: 0,
            cashDiscount: 0,
            percentVat: 0,
            cashVat: 0,
            totalWeight: 0,
            productNameDetail: null,
            branchName: null,
            note: '',
          },
          {
            ordinalNumber: 1,
            refId: 0,
            refTime: '2013-01-01T00:00:00',
            code: '',
            numberOfCode: '',
            supplierId: 0,
            supplierCode: '',
            supplierName: '',
            supplierAddress: '',
            supplierPhone: '',
            refExplain: 'Nợ đầu',
            totalAmount: 0,
            paymentAmount: 0,
            receiptsAmount: 0,
            reductionAmount: 0,
            debtAmount: -9998647631,
            rampartsAmount: 0,
            sort: '0',
            refDetailIdDetail: 0,
            productCodeDetail: null,
            unitNameDetail: null,
            unitChangeDetail: 0,
            priceBuyDetail: null,
            quantityDetail: 0,
            specificationsDetail: 0,
            percentDiscountDetail: 0,
            cashDiscountDetail: 0,
            percentVatDetail: 0,
            cashVatDetail: 0,
            totalAmountDetail: 0,
            noteDetail: '',
            warehouseNameDetail: null,
            quantityPromotionDetail: 0,
            weightDetail: 0,
            totalWeightProductDetail: 0,
            paymentTypeName: null,
            shippingFee: 0,
            percentDiscount: 0,
            cashDiscount: 0,
            percentVat: 0,
            cashVat: 0,
            totalWeight: 0,
            productNameDetail: null,
            branchName: null,
            note: '',
          },
          {
            ordinalNumber: 1,
            refId: 0,
            refTime: '2013-01-01T00:00:00',
            code: '',
            numberOfCode: '',
            supplierId: 0,
            supplierCode: '',
            supplierName: '',
            supplierAddress: '',
            supplierPhone: '',
            refExplain: 'Nợ đầu',
            totalAmount: 0,
            paymentAmount: 0,
            receiptsAmount: 0,
            reductionAmount: 0,
            debtAmount: -9998647631,
            rampartsAmount: 0,
            sort: '0',
            refDetailIdDetail: 0,
            productCodeDetail: null,
            unitNameDetail: null,
            unitChangeDetail: 0,
            priceBuyDetail: null,
            quantityDetail: 0,
            specificationsDetail: 0,
            percentDiscountDetail: 0,
            cashDiscountDetail: 0,
            percentVatDetail: 0,
            cashVatDetail: 0,
            totalAmountDetail: 0,
            noteDetail: '',
            warehouseNameDetail: null,
            quantityPromotionDetail: 0,
            weightDetail: 0,
            totalWeightProductDetail: 0,
            paymentTypeName: null,
            shippingFee: 0,
            percentDiscount: 0,
            cashDiscount: 0,
            percentVat: 0,
            cashVat: 0,
            totalWeight: 0,
            productNameDetail: null,
            branchName: null,
            note: '',
          },
          {
            ordinalNumber: 1,
            refId: 0,
            refTime: '2013-01-01T00:00:00',
            code: '',
            numberOfCode: '',
            supplierId: 0,
            supplierCode: '',
            supplierName: '',
            supplierAddress: '',
            supplierPhone: '',
            refExplain: 'Nợ đầu',
            totalAmount: 0,
            paymentAmount: 0,
            receiptsAmount: 0,
            reductionAmount: 0,
            debtAmount: -9998647631,
            rampartsAmount: 0,
            sort: '0',
            refDetailIdDetail: 0,
            productCodeDetail: null,
            unitNameDetail: null,
            unitChangeDetail: 0,
            priceBuyDetail: null,
            quantityDetail: 0,
            specificationsDetail: 0,
            percentDiscountDetail: 0,
            cashDiscountDetail: 0,
            percentVatDetail: 0,
            cashVatDetail: 0,
            totalAmountDetail: 0,
            noteDetail: '',
            warehouseNameDetail: null,
            quantityPromotionDetail: 0,
            weightDetail: 0,
            totalWeightProductDetail: 0,
            paymentTypeName: null,
            shippingFee: 0,
            percentDiscount: 0,
            cashDiscount: 0,
            percentVat: 0,
            cashVat: 0,
            totalWeight: 0,
            productNameDetail: null,
            branchName: null,
            note: '',
          },
        ],
      },
      {
        ordinalNumber: 15,
        refId: 0,
        refTime: '2025-01-01T00:00:00',
        code: '',
        numberOfCode: '',
        supplierId: 0,
        supplierCode: '',
        supplierName: '',
        supplierAddress: '',
        supplierPhone: '',
        refExplain: 'Nợ cuối',
        totalAmount: 0,
        paymentAmount: 0,
        receiptsAmount: 0,
        reductionAmount: 0,
        debtAmount: 0,
        rampartsAmount: 9998647630,
        sort: '9',
        refDetailIdDetail: 0,
        productCodeDetail: null,
        unitNameDetail: null,
        unitChangeDetail: 0,
        priceBuyDetail: null,
        quantityDetail: 0,
        specificationsDetail: 0,
        percentDiscountDetail: 0,
        cashDiscountDetail: 0,
        percentVatDetail: 0,
        cashVatDetail: 0,
        totalAmountDetail: 0,
        noteDetail: '',
        warehouseNameDetail: null,
        quantityPromotionDetail: 0,
        weightDetail: 0,
        totalWeightProductDetail: 0,
        paymentTypeName: null,
        shippingFee: 0,
        percentDiscount: 0,
        cashDiscount: 0,
        percentVat: 0,
        cashVat: 0,
        totalWeight: 0,
        productNameDetail: null,
        branchName: null,
        note: '',
        details: [
          {
            ordinalNumber: 15,
            refId: 0,
            refTime: '2025-01-01T00:00:00',
            code: '',
            numberOfCode: '',
            supplierId: 0,
            supplierCode: '',
            supplierName: '',
            supplierAddress: '',
            supplierPhone: '',
            refExplain: 'Nợ cuối',
            totalAmount: 0,
            paymentAmount: 0,
            receiptsAmount: 0,
            reductionAmount: 0,
            debtAmount: 0,
            rampartsAmount: 9998647630,
            sort: '9',
            refDetailIdDetail: 0,
            productCodeDetail: null,
            unitNameDetail: null,
            unitChangeDetail: 0,
            priceBuyDetail: null,
            quantityDetail: 0,
            specificationsDetail: 0,
            percentDiscountDetail: 0,
            cashDiscountDetail: 0,
            percentVatDetail: 0,
            cashVatDetail: 0,
            totalAmountDetail: 0,
            noteDetail: '',
            warehouseNameDetail: null,
            quantityPromotionDetail: 0,
            weightDetail: 0,
            totalWeightProductDetail: 0,
            paymentTypeName: null,
            shippingFee: 0,
            percentDiscount: 0,
            cashDiscount: 0,
            percentVat: 0,
            cashVat: 0,
            totalWeight: 0,
            productNameDetail: null,
            branchName: null,
            note: '',
          },
          {
            ordinalNumber: 15,
            refId: 0,
            refTime: '2025-01-01T00:00:00',
            code: '',
            numberOfCode: '',
            supplierId: 0,
            supplierCode: '',
            supplierName: '',
            supplierAddress: '',
            supplierPhone: '',
            refExplain: 'Nợ cuối',
            totalAmount: 0,
            paymentAmount: 0,
            receiptsAmount: 0,
            reductionAmount: 0,
            debtAmount: 0,
            rampartsAmount: 9998647630,
            sort: '9',
            refDetailIdDetail: 0,
            productCodeDetail: null,
            unitNameDetail: null,
            unitChangeDetail: 0,
            priceBuyDetail: null,
            quantityDetail: 0,
            specificationsDetail: 0,
            percentDiscountDetail: 0,
            cashDiscountDetail: 0,
            percentVatDetail: 0,
            cashVatDetail: 0,
            totalAmountDetail: 0,
            noteDetail: '',
            warehouseNameDetail: null,
            quantityPromotionDetail: 0,
            weightDetail: 0,
            totalWeightProductDetail: 0,
            paymentTypeName: null,
            shippingFee: 0,
            percentDiscount: 0,
            cashDiscount: 0,
            percentVat: 0,
            cashVat: 0,
            totalWeight: 0,
            productNameDetail: null,
            branchName: null,
            note: '',
          },
          {
            ordinalNumber: 15,
            refId: 0,
            refTime: '2025-01-01T00:00:00',
            code: '',
            numberOfCode: '',
            supplierId: 0,
            supplierCode: '',
            supplierName: '',
            supplierAddress: '',
            supplierPhone: '',
            refExplain: 'Nợ cuối',
            totalAmount: 0,
            paymentAmount: 0,
            receiptsAmount: 0,
            reductionAmount: 0,
            debtAmount: 0,
            rampartsAmount: 9998647630,
            sort: '9',
            refDetailIdDetail: 0,
            productCodeDetail: null,
            unitNameDetail: null,
            unitChangeDetail: 0,
            priceBuyDetail: null,
            quantityDetail: 0,
            specificationsDetail: 0,
            percentDiscountDetail: 0,
            cashDiscountDetail: 0,
            percentVatDetail: 0,
            cashVatDetail: 0,
            totalAmountDetail: 0,
            noteDetail: '',
            warehouseNameDetail: null,
            quantityPromotionDetail: 0,
            weightDetail: 0,
            totalWeightProductDetail: 0,
            paymentTypeName: null,
            shippingFee: 0,
            percentDiscount: 0,
            cashDiscount: 0,
            percentVat: 0,
            cashVat: 0,
            totalWeight: 0,
            productNameDetail: null,
            branchName: null,
            note: '',
          },
        ],
      },
      {
        ordinalNumber: 13,
        refId: 2,
        refTime: '2023-12-09T20:00:00',
        code: 'PCT231210-000001',
        numberOfCode: null,
        supplierId: 1,
        supplierCode: 'NCC1',
        supplierName: 'Nhà cung cấp 1',
        supplierAddress: 'test',
        supplierPhone: '0454545455',
        refExplain: 'Phiếu chi',
        totalAmount: 0,
        paymentAmount: 1500000,
        receiptsAmount: 0,
        reductionAmount: 0,
        debtAmount: -1500000,
        rampartsAmount: -1500000,
        sort: '202312090000000007',
        refDetailIdDetail: 0,
        productCodeDetail: null,
        unitNameDetail: null,
        unitChangeDetail: 0,
        priceBuyDetail: null,
        quantityDetail: 0,
        specificationsDetail: 0,
        percentDiscountDetail: 0,
        cashDiscountDetail: 0,
        percentVatDetail: 0,
        cashVatDetail: 0,
        totalAmountDetail: 0,
        noteDetail: '',
        warehouseNameDetail: null,
        quantityPromotionDetail: 0,
        weightDetail: 0,
        totalWeightProductDetail: 0,
        paymentTypeName: null,
        shippingFee: 0,
        percentDiscount: 0,
        cashDiscount: 0,
        percentVat: 0,
        cashVat: 0,
        totalWeight: 0,
        productNameDetail: null,
        branchName: null,
        note: '123213',
        details: [
          {
            ordinalNumber: 13,
            refId: 2,
            refTime: '2023-12-09T20:00:00',
            code: 'PCT231210-000001',
            numberOfCode: null,
            supplierId: 1,
            supplierCode: 'NCC1',
            supplierName: 'Nhà cung cấp 1',
            supplierAddress: 'test',
            supplierPhone: '0454545455',
            refExplain: 'Phiếu chi',
            totalAmount: 0,
            paymentAmount: 1500000,
            receiptsAmount: 0,
            reductionAmount: 0,
            debtAmount: -1500000,
            rampartsAmount: -1500000,
            sort: '202312090000000007',
            refDetailIdDetail: 0,
            productCodeDetail: null,
            unitNameDetail: null,
            unitChangeDetail: 0,
            priceBuyDetail: null,
            quantityDetail: 0,
            specificationsDetail: 0,
            percentDiscountDetail: 0,
            cashDiscountDetail: 0,
            percentVatDetail: 0,
            cashVatDetail: 0,
            totalAmountDetail: 0,
            noteDetail: '',
            warehouseNameDetail: null,
            quantityPromotionDetail: 0,
            weightDetail: 0,
            totalWeightProductDetail: 0,
            paymentTypeName: null,
            shippingFee: 0,
            percentDiscount: 0,
            cashDiscount: 0,
            percentVat: 0,
            cashVat: 0,
            totalWeight: 0,
            productNameDetail: null,
            branchName: null,
            note: '123213',
          },
        ],
      },
      {
        ordinalNumber: 14,
        refId: 4,
        refTime: '2023-12-12T19:59:24.817',
        code: 'PCT231212-000003',
        numberOfCode: '123',
        supplierId: 1,
        supplierCode: 'NCC1',
        supplierName: 'Nhà cung cấp 1',
        supplierAddress: 'test',
        supplierPhone: '0454545455',
        refExplain: 'Phiếu chi',
        totalAmount: 0,
        paymentAmount: 10000000000,
        receiptsAmount: 0,
        reductionAmount: 0,
        debtAmount: -10000000000,
        rampartsAmount: -10001500000,
        sort: '202312120000000013',
        refDetailIdDetail: 0,
        productCodeDetail: null,
        unitNameDetail: null,
        unitChangeDetail: 0,
        priceBuyDetail: null,
        quantityDetail: 0,
        specificationsDetail: 0,
        percentDiscountDetail: 0,
        cashDiscountDetail: 0,
        percentVatDetail: 0,
        cashVatDetail: 0,
        totalAmountDetail: 0,
        noteDetail: '',
        warehouseNameDetail: null,
        quantityPromotionDetail: 0,
        weightDetail: 0,
        totalWeightProductDetail: 0,
        paymentTypeName: null,
        shippingFee: 0,
        percentDiscount: 0,
        cashDiscount: 0,
        percentVat: 0,
        cashVat: 0,
        totalWeight: 0,
        productNameDetail: null,
        branchName: null,
        note: '123213',
        details: [
          {
            ordinalNumber: 14,
            refId: 4,
            refTime: '2023-12-12T19:59:24.817',
            code: 'PCT231212-000003',
            numberOfCode: '123',
            supplierId: 1,
            supplierCode: 'NCC1',
            supplierName: 'Nhà cung cấp 1',
            supplierAddress: 'test',
            supplierPhone: '0454545455',
            refExplain: 'Phiếu chi',
            totalAmount: 0,
            paymentAmount: 10000000000,
            receiptsAmount: 0,
            reductionAmount: 0,
            debtAmount: -10000000000,
            rampartsAmount: -10001500000,
            sort: '202312120000000013',
            refDetailIdDetail: 0,
            productCodeDetail: null,
            unitNameDetail: null,
            unitChangeDetail: 0,
            priceBuyDetail: null,
            quantityDetail: 0,
            specificationsDetail: 0,
            percentDiscountDetail: 0,
            cashDiscountDetail: 0,
            percentVatDetail: 0,
            cashVatDetail: 0,
            totalAmountDetail: 0,
            noteDetail: '',
            warehouseNameDetail: null,
            quantityPromotionDetail: 0,
            weightDetail: 0,
            totalWeightProductDetail: 0,
            paymentTypeName: null,
            shippingFee: 0,
            percentDiscount: 0,
            cashDiscount: 0,
            percentVat: 0,
            cashVat: 0,
            totalWeight: 0,
            productNameDetail: null,
            branchName: null,
            note: '123213',
          },
        ],
      },
      {
        ordinalNumber: 12,
        refId: 1,
        refTime: '2023-12-13T21:29:39.769',
        code: 'DHN231213-000002',
        numberOfCode: '',
        supplierId: 1,
        supplierCode: 'NCC1',
        supplierName: 'Nhà cung cấp 1',
        supplierAddress: 'test',
        supplierPhone: '0454545455',
        refExplain: 'Đặt hàng nhà cung cấp (58287923485.81616)',
        totalAmount: 0,
        paymentAmount: 132,
        receiptsAmount: 0,
        reductionAmount: 500000,
        debtAmount: -500132,
        rampartsAmount: -10002000132,
        sort: '202312130000000034',
        refDetailIdDetail: 21,
        productCodeDetail: 'Ron92',
        unitNameDetail: 'Phi',
        unitChangeDetail: 0.5,
        priceBuyDetail: null,
        quantityDetail: 122313,
        specificationsDetail: 0,
        percentDiscountDetail: 213213,
        cashDiscountDetail: 23453.43,
        percentVatDetail: 0,
        cashVatDetail: 0,
        totalAmountDetail: 58287840616.41,
        noteDetail: '',
        warehouseNameDetail: null,
        quantityPromotionDetail: 0,
        weightDetail: 555.5,
        totalWeightProductDetail: 67944871.5,
        paymentTypeName: 'Tiền mặt',
        shippingFee: 123,
        percentDiscount: 0.001,
        cashDiscount: 582878.4061641,
        percentVat: 0.002,
        cashVat: 1165756.8123282,
        totalWeight: 67944871.5,
        productNameDetail: 'Xăng E5 RON 92',
        branchName: 'Cửa hàng',
        note: '',
        details: [
          {
            ordinalNumber: 12,
            refId: 1,
            refTime: '2023-12-13T21:29:39.769',
            code: 'DHN231213-000002',
            numberOfCode: '',
            supplierId: 1,
            supplierCode: 'NCC1',
            supplierName: 'Nhà cung cấp 1',
            supplierAddress: 'test',
            supplierPhone: '0454545455',
            refExplain: 'Đặt hàng nhà cung cấp (58287923485.81616)',
            totalAmount: 0,
            paymentAmount: 132,
            receiptsAmount: 0,
            reductionAmount: 500000,
            debtAmount: -500132,
            rampartsAmount: -10002000132,
            sort: '202312130000000034',
            refDetailIdDetail: 21,
            productCodeDetail: 'Ron92',
            unitNameDetail: 'Phi',
            unitChangeDetail: 0.5,
            priceBuyDetail: null,
            quantityDetail: 122313,
            specificationsDetail: 0,
            percentDiscountDetail: 213213,
            cashDiscountDetail: 23453.43,
            percentVatDetail: 0,
            cashVatDetail: 0,
            totalAmountDetail: 58287840616.41,
            noteDetail: '',
            warehouseNameDetail: null,
            quantityPromotionDetail: 0,
            weightDetail: 555.5,
            totalWeightProductDetail: 67944871.5,
            paymentTypeName: 'Tiền mặt',
            shippingFee: 123,
            percentDiscount: 0.001,
            cashDiscount: 582878.4061641,
            percentVat: 0.002,
            cashVat: 1165756.8123282,
            totalWeight: 67944871.5,
            productNameDetail: 'Xăng E5 RON 92',
            branchName: 'Cửa hàng',
            note: '',
          },
        ],
      },
      {
        ordinalNumber: 2,
        refId: 3,
        refTime: '2023-12-16T20:39:56.495',
        code: 'PMH231216-000002',
        numberOfCode: '',
        supplierId: 1,
        supplierCode: 'NCC1',
        supplierName: 'Nhà cung cấp 1',
        supplierAddress: 'test',
        supplierPhone: '0454545455',
        refExplain: 'Mua hàng',
        totalAmount: 20000000000,
        paymentAmount: 0,
        receiptsAmount: 0,
        reductionAmount: 0,
        debtAmount: 20000000000,
        rampartsAmount: 9997999868,
        sort: '202312160000000069',
        refDetailIdDetail: 3,
        productCodeDetail: 'DDO',
        unitNameDetail: 'Phi',
        unitChangeDetail: 2,
        priceBuyDetail: null,
        quantityDetail: 50000,
        specificationsDetail: 0,
        percentDiscountDetail: 0,
        cashDiscountDetail: 0,
        percentVatDetail: 0,
        cashVatDetail: 0,
        totalAmountDetail: 20000000000,
        noteDetail: '',
        warehouseNameDetail: 'Sài gòn petrol',
        quantityPromotionDetail: 0,
        weightDetail: 2,
        totalWeightProductDetail: 100000,
        paymentTypeName: null,
        shippingFee: 0,
        percentDiscount: 0,
        cashDiscount: 0,
        percentVat: 0,
        cashVat: 0,
        totalWeight: 100000,
        productNameDetail: 'Dầu DO',
        branchName: 'Cửa hàng',
        note: '',
        details: [
          {
            ordinalNumber: 2,
            refId: 3,
            refTime: '2023-12-16T20:39:56.495',
            code: 'PMH231216-000002',
            numberOfCode: '',
            supplierId: 1,
            supplierCode: 'NCC1',
            supplierName: 'Nhà cung cấp 1',
            supplierAddress: 'test',
            supplierPhone: '0454545455',
            refExplain: 'Mua hàng',
            totalAmount: 20000000000,
            paymentAmount: 0,
            receiptsAmount: 0,
            reductionAmount: 0,
            debtAmount: 20000000000,
            rampartsAmount: 9997999868,
            sort: '202312160000000069',
            refDetailIdDetail: 3,
            productCodeDetail: 'DDO',
            unitNameDetail: 'Phi',
            unitChangeDetail: 2,
            priceBuyDetail: null,
            quantityDetail: 50000,
            specificationsDetail: 0,
            percentDiscountDetail: 0,
            cashDiscountDetail: 0,
            percentVatDetail: 0,
            cashVatDetail: 0,
            totalAmountDetail: 20000000000,
            noteDetail: '',
            warehouseNameDetail: 'Sài gòn petrol',
            quantityPromotionDetail: 0,
            weightDetail: 2,
            totalWeightProductDetail: 100000,
            paymentTypeName: null,
            shippingFee: 0,
            percentDiscount: 0,
            cashDiscount: 0,
            percentVat: 0,
            cashVat: 0,
            totalWeight: 100000,
            productNameDetail: 'Dầu DO',
            branchName: 'Cửa hàng',
            note: '',
          },
        ],
      },
      {
        ordinalNumber: 3,
        refId: 5,
        refTime: '2023-12-16T20:45:42.18',
        code: 'PMH231216-000003',
        numberOfCode: '',
        supplierId: 1,
        supplierCode: 'NCC1',
        supplierName: 'Nhà cung cấp 1',
        supplierAddress: 'test',
        supplierPhone: '0454545455',
        refExplain: 'Mua hàng',
        totalAmount: 3,
        paymentAmount: 0,
        receiptsAmount: 0,
        reductionAmount: 0,
        debtAmount: 3,
        rampartsAmount: 9997999871,
        sort: '202312160000000071',
        refDetailIdDetail: 12,
        productCodeDetail: 'DDO',
        unitNameDetail: 'Can',
        unitChangeDetail: 1,
        priceBuyDetail: null,
        quantityDetail: 1,
        specificationsDetail: 1,
        percentDiscountDetail: 1,
        cashDiscountDetail: 0.01,
        percentVatDetail: 1,
        cashVatDetail: 0.01,
        totalAmountDetail: 1,
        noteDetail: '',
        warehouseNameDetail: 'KHO 2',
        quantityPromotionDetail: 0,
        weightDetail: 2,
        totalWeightProductDetail: 2,
        paymentTypeName: null,
        shippingFee: 0,
        percentDiscount: 0,
        cashDiscount: 0,
        percentVat: 0,
        cashVat: 0,
        totalWeight: 1113,
        productNameDetail: 'Dầu DO',
        branchName: 'Cửa hàng',
        note: '',
        details: [
          {
            ordinalNumber: 3,
            refId: 5,
            refTime: '2023-12-16T20:45:42.18',
            code: 'PMH231216-000003',
            numberOfCode: '',
            supplierId: 1,
            supplierCode: 'NCC1',
            supplierName: 'Nhà cung cấp 1',
            supplierAddress: 'test',
            supplierPhone: '0454545455',
            refExplain: 'Mua hàng',
            totalAmount: 3,
            paymentAmount: 0,
            receiptsAmount: 0,
            reductionAmount: 0,
            debtAmount: 3,
            rampartsAmount: 9997999871,
            sort: '202312160000000071',
            refDetailIdDetail: 12,
            productCodeDetail: 'DDO',
            unitNameDetail: 'Can',
            unitChangeDetail: 1,
            priceBuyDetail: null,
            quantityDetail: 1,
            specificationsDetail: 1,
            percentDiscountDetail: 1,
            cashDiscountDetail: 0.01,
            percentVatDetail: 1,
            cashVatDetail: 0.01,
            totalAmountDetail: 1,
            noteDetail: '',
            warehouseNameDetail: 'KHO 2',
            quantityPromotionDetail: 0,
            weightDetail: 2,
            totalWeightProductDetail: 2,
            paymentTypeName: null,
            shippingFee: 0,
            percentDiscount: 0,
            cashDiscount: 0,
            percentVat: 0,
            cashVat: 0,
            totalWeight: 1113,
            productNameDetail: 'Dầu DO',
            branchName: 'Cửa hàng',
            note: '',
          },
          {
            ordinalNumber: 4,
            refId: 5,
            refTime: '2023-12-16T20:45:42.18',
            code: 'PMH231216-000003',
            numberOfCode: '',
            supplierId: 1,
            supplierCode: 'NCC1',
            supplierName: 'Nhà cung cấp 1',
            supplierAddress: 'test',
            supplierPhone: '0454545455',
            refExplain: 'Mua hàng',
            totalAmount: 3,
            paymentAmount: 0,
            receiptsAmount: 0,
            reductionAmount: 0,
            debtAmount: 3,
            rampartsAmount: 9997999871,
            sort: '202312160000000071',
            refDetailIdDetail: 13,
            productCodeDetail: 'Ron92',
            unitNameDetail: 'Can',
            unitChangeDetail: 1,
            priceBuyDetail: null,
            quantityDetail: 1,
            specificationsDetail: 1,
            percentDiscountDetail: 1,
            cashDiscountDetail: 0.02,
            percentVatDetail: 1,
            cashVatDetail: 0.02,
            totalAmountDetail: 2,
            noteDetail: '',
            warehouseNameDetail: 'Sài gòn petrol',
            quantityPromotionDetail: 0,
            weightDetail: 1111,
            totalWeightProductDetail: 1111,
            paymentTypeName: null,
            shippingFee: 0,
            percentDiscount: 0,
            cashDiscount: 0,
            percentVat: 0,
            cashVat: 0,
            totalWeight: 1113,
            productNameDetail: 'Xăng E5 RON 92',
            branchName: 'Cửa hàng',
            note: '',
          },
        ],
      },
      {
        ordinalNumber: 5,
        refId: 6,
        refTime: '2023-12-16T21:39:14.273',
        code: 'PMH231216-000004',
        numberOfCode: '',
        supplierId: 1,
        supplierCode: 'NCC1',
        supplierName: 'Nhà cung cấp 1',
        supplierAddress: 'test',
        supplierPhone: '0454545455',
        refExplain: 'Mua hàng',
        totalAmount: 48000,
        paymentAmount: 0,
        receiptsAmount: 0,
        reductionAmount: 0,
        debtAmount: 48000,
        rampartsAmount: 9998047871,
        sort: '202312160000000072',
        refDetailIdDetail: 14,
        productCodeDetail: 'DDO',
        unitNameDetail: 'Can',
        unitChangeDetail: 1,
        priceBuyDetail: null,
        quantityDetail: 10000,
        specificationsDetail: 0,
        percentDiscountDetail: 30,
        cashDiscountDetail: 1.2,
        percentVatDetail: 50,
        cashVatDetail: 2,
        totalAmountDetail: 48000,
        noteDetail: 'diễn dãi',
        warehouseNameDetail: 'Sài gòn petrol',
        quantityPromotionDetail: 0,
        weightDetail: 2,
        totalWeightProductDetail: 20000,
        paymentTypeName: null,
        shippingFee: 0,
        percentDiscount: 0,
        cashDiscount: 0,
        percentVat: 0,
        cashVat: 0,
        totalWeight: 20000,
        productNameDetail: 'Dầu DO',
        branchName: 'Cửa hàng',
        note: '',
        details: [
          {
            ordinalNumber: 5,
            refId: 6,
            refTime: '2023-12-16T21:39:14.273',
            code: 'PMH231216-000004',
            numberOfCode: '',
            supplierId: 1,
            supplierCode: 'NCC1',
            supplierName: 'Nhà cung cấp 1',
            supplierAddress: 'test',
            supplierPhone: '0454545455',
            refExplain: 'Mua hàng',
            totalAmount: 48000,
            paymentAmount: 0,
            receiptsAmount: 0,
            reductionAmount: 0,
            debtAmount: 48000,
            rampartsAmount: 9998047871,
            sort: '202312160000000072',
            refDetailIdDetail: 14,
            productCodeDetail: 'DDO',
            unitNameDetail: 'Can',
            unitChangeDetail: 1,
            priceBuyDetail: null,
            quantityDetail: 10000,
            specificationsDetail: 0,
            percentDiscountDetail: 30,
            cashDiscountDetail: 1.2,
            percentVatDetail: 50,
            cashVatDetail: 2,
            totalAmountDetail: 48000,
            noteDetail: 'diễn dãi',
            warehouseNameDetail: 'Sài gòn petrol',
            quantityPromotionDetail: 0,
            weightDetail: 2,
            totalWeightProductDetail: 20000,
            paymentTypeName: null,
            shippingFee: 0,
            percentDiscount: 0,
            cashDiscount: 0,
            percentVat: 0,
            cashVat: 0,
            totalWeight: 20000,
            productNameDetail: 'Dầu DO',
            branchName: 'Cửa hàng',
            note: '',
          },
        ],
      },
      {
        ordinalNumber: 6,
        refId: 9,
        refTime: '2023-12-17T08:26:39.033',
        code: 'PMH231217-000006',
        numberOfCode: '',
        supplierId: 1,
        supplierCode: 'NCC1',
        supplierName: 'Nhà cung cấp 1',
        supplierAddress: 'test',
        supplierPhone: '0454545455',
        refExplain: 'Mua hàng',
        totalAmount: -117.5,
        paymentAmount: 123,
        receiptsAmount: 0,
        reductionAmount: 0,
        debtAmount: -240.5,
        rampartsAmount: 9998047630,
        sort: '202312170000000077',
        refDetailIdDetail: 46,
        productCodeDetail: 'Ron92',
        unitNameDetail: 'Phi',
        unitChangeDetail: 0.5,
        priceBuyDetail: null,
        quantityDetail: 1,
        specificationsDetail: 1,
        percentDiscountDetail: 0,
        cashDiscountDetail: 0,
        percentVatDetail: 0,
        cashVatDetail: 0,
        totalAmountDetail: 5.5,
        noteDetail: 'string',
        warehouseNameDetail: 'KHO 2',
        quantityPromotionDetail: 0,
        weightDetail: 555.5,
        totalWeightProductDetail: 555.5,
        paymentTypeName: null,
        shippingFee: 0,
        percentDiscount: 0,
        cashDiscount: 0,
        percentVat: 0,
        cashVat: 0,
        totalWeight: 555.5,
        productNameDetail: 'Xăng E5 RON 92',
        branchName: 'Cửa hàng',
        note: '',
        details: [
          {
            ordinalNumber: 6,
            refId: 9,
            refTime: '2023-12-17T08:26:39.033',
            code: 'PMH231217-000006',
            numberOfCode: '',
            supplierId: 1,
            supplierCode: 'NCC1',
            supplierName: 'Nhà cung cấp 1',
            supplierAddress: 'test',
            supplierPhone: '0454545455',
            refExplain: 'Mua hàng',
            totalAmount: -117.5,
            paymentAmount: 123,
            receiptsAmount: 0,
            reductionAmount: 0,
            debtAmount: -240.5,
            rampartsAmount: 9998047630,
            sort: '202312170000000077',
            refDetailIdDetail: 46,
            productCodeDetail: 'Ron92',
            unitNameDetail: 'Phi',
            unitChangeDetail: 0.5,
            priceBuyDetail: null,
            quantityDetail: 1,
            specificationsDetail: 1,
            percentDiscountDetail: 0,
            cashDiscountDetail: 0,
            percentVatDetail: 0,
            cashVatDetail: 0,
            totalAmountDetail: 5.5,
            noteDetail: 'string',
            warehouseNameDetail: 'KHO 2',
            quantityPromotionDetail: 0,
            weightDetail: 555.5,
            totalWeightProductDetail: 555.5,
            paymentTypeName: null,
            shippingFee: 0,
            percentDiscount: 0,
            cashDiscount: 0,
            percentVat: 0,
            cashVat: 0,
            totalWeight: 555.5,
            productNameDetail: 'Xăng E5 RON 92',
            branchName: 'Cửa hàng',
            note: '',
          },
        ],
      },
      {
        ordinalNumber: 11,
        refId: 6,
        refTime: '2023-12-17T16:00:15.857',
        code: 'THN231217-000003',
        numberOfCode: '',
        supplierId: 1,
        supplierCode: 'NCC1',
        supplierName: 'Nhà cung cấp 1',
        supplierAddress: 'test',
        supplierPhone: '0454545455',
        refExplain: 'Trả hàng nhà cung cấp',
        totalAmount: -600000,
        paymentAmount: 0,
        receiptsAmount: 0,
        reductionAmount: 0,
        debtAmount: -600000,
        rampartsAmount: 9997447630,
        sort: '202312170000000103',
        refDetailIdDetail: 26,
        productCodeDetail: 'DDO',
        unitNameDetail: 'Phi',
        unitChangeDetail: 2,
        priceBuyDetail: null,
        quantityDetail: 3,
        specificationsDetail: 0,
        percentDiscountDetail: 0,
        cashDiscountDetail: 0,
        percentVatDetail: 0,
        cashVatDetail: 0,
        totalAmountDetail: 600000,
        noteDetail: 'test',
        warehouseNameDetail: 'Sài gòn petrol',
        quantityPromotionDetail: 0,
        weightDetail: 1,
        totalWeightProductDetail: 3,
        paymentTypeName: null,
        shippingFee: 0,
        percentDiscount: 0,
        cashDiscount: 0,
        percentVat: 0,
        cashVat: 0,
        totalWeight: 3,
        productNameDetail: 'Dầu DO',
        branchName: 'Cửa hàng',
        note: '',
        details: [
          {
            ordinalNumber: 11,
            refId: 6,
            refTime: '2023-12-17T16:00:15.857',
            code: 'THN231217-000003',
            numberOfCode: '',
            supplierId: 1,
            supplierCode: 'NCC1',
            supplierName: 'Nhà cung cấp 1',
            supplierAddress: 'test',
            supplierPhone: '0454545455',
            refExplain: 'Trả hàng nhà cung cấp',
            totalAmount: -600000,
            paymentAmount: 0,
            receiptsAmount: 0,
            reductionAmount: 0,
            debtAmount: -600000,
            rampartsAmount: 9997447630,
            sort: '202312170000000103',
            refDetailIdDetail: 26,
            productCodeDetail: 'DDO',
            unitNameDetail: 'Phi',
            unitChangeDetail: 2,
            priceBuyDetail: null,
            quantityDetail: 3,
            specificationsDetail: 0,
            percentDiscountDetail: 0,
            cashDiscountDetail: 0,
            percentVatDetail: 0,
            cashVatDetail: 0,
            totalAmountDetail: 600000,
            noteDetail: 'test',
            warehouseNameDetail: 'Sài gòn petrol',
            quantityPromotionDetail: 0,
            weightDetail: 1,
            totalWeightProductDetail: 3,
            paymentTypeName: null,
            shippingFee: 0,
            percentDiscount: 0,
            cashDiscount: 0,
            percentVat: 0,
            cashVat: 0,
            totalWeight: 3,
            productNameDetail: 'Dầu DO',
            branchName: 'Cửa hàng',
            note: '',
          },
        ],
      },
      {
        ordinalNumber: 7,
        refId: 10,
        refTime: '2023-12-21T08:03:59.478',
        code: 'PMH231221-000007',
        numberOfCode: '',
        supplierId: 1,
        supplierCode: 'NCC1',
        supplierName: 'Nhà cung cấp 1',
        supplierAddress: 'test',
        supplierPhone: '0454545455',
        refExplain: 'Mua hàng',
        totalAmount: 600000,
        paymentAmount: 0,
        receiptsAmount: 0,
        reductionAmount: 0,
        debtAmount: 600000,
        rampartsAmount: 9998047630,
        sort: '202312210000000147',
        refDetailIdDetail: 89,
        productCodeDetail: 'DDO',
        unitNameDetail: 'Phi',
        unitChangeDetail: 2,
        priceBuyDetail: null,
        quantityDetail: 3,
        specificationsDetail: 1,
        percentDiscountDetail: 0,
        cashDiscountDetail: 0,
        percentVatDetail: 0,
        cashVatDetail: 0,
        totalAmountDetail: 600000,
        noteDetail: 'test',
        warehouseNameDetail: 'KHO 2',
        quantityPromotionDetail: 0,
        weightDetail: 1,
        totalWeightProductDetail: 3,
        paymentTypeName: null,
        shippingFee: 0,
        percentDiscount: 0,
        cashDiscount: 0,
        percentVat: 0,
        cashVat: 0,
        totalWeight: 3,
        productNameDetail: 'Dầu DO',
        branchName: 'Cửa hàng',
        note: '',
        details: [
          {
            ordinalNumber: 7,
            refId: 10,
            refTime: '2023-12-21T08:03:59.478',
            code: 'PMH231221-000007',
            numberOfCode: '',
            supplierId: 1,
            supplierCode: 'NCC1',
            supplierName: 'Nhà cung cấp 1',
            supplierAddress: 'test',
            supplierPhone: '0454545455',
            refExplain: 'Mua hàng',
            totalAmount: 600000,
            paymentAmount: 0,
            receiptsAmount: 0,
            reductionAmount: 0,
            debtAmount: 600000,
            rampartsAmount: 9998047630,
            sort: '202312210000000147',
            refDetailIdDetail: 89,
            productCodeDetail: 'DDO',
            unitNameDetail: 'Phi',
            unitChangeDetail: 2,
            priceBuyDetail: null,
            quantityDetail: 3,
            specificationsDetail: 1,
            percentDiscountDetail: 0,
            cashDiscountDetail: 0,
            percentVatDetail: 0,
            cashVatDetail: 0,
            totalAmountDetail: 600000,
            noteDetail: 'test',
            warehouseNameDetail: 'KHO 2',
            quantityPromotionDetail: 0,
            weightDetail: 1,
            totalWeightProductDetail: 3,
            paymentTypeName: null,
            shippingFee: 0,
            percentDiscount: 0,
            cashDiscount: 0,
            percentVat: 0,
            cashVat: 0,
            totalWeight: 3,
            productNameDetail: 'Dầu DO',
            branchName: 'Cửa hàng',
            note: '',
          },
        ],
      },
      {
        ordinalNumber: 10,
        refId: 7,
        refTime: '2023-12-21T08:11:01.22',
        code: 'THN231221-000004',
        numberOfCode: '',
        supplierId: 1,
        supplierCode: 'NCC1',
        supplierName: 'Nhà cung cấp 1',
        supplierAddress: 'test',
        supplierPhone: '0454545455',
        refExplain: 'Trả hàng nhà cung cấp',
        totalAmount: -600000,
        paymentAmount: 0,
        receiptsAmount: 0,
        reductionAmount: 0,
        debtAmount: -600000,
        rampartsAmount: 9997447630,
        sort: '202312210000000149',
        refDetailIdDetail: 29,
        productCodeDetail: 'DDO',
        unitNameDetail: 'Phi',
        unitChangeDetail: 2,
        priceBuyDetail: null,
        quantityDetail: 3,
        specificationsDetail: 0,
        percentDiscountDetail: 0,
        cashDiscountDetail: 0,
        percentVatDetail: 0,
        cashVatDetail: 0,
        totalAmountDetail: 600000,
        noteDetail: 'test',
        warehouseNameDetail: 'Sài gòn petrol',
        quantityPromotionDetail: 0,
        weightDetail: 1,
        totalWeightProductDetail: 3,
        paymentTypeName: null,
        shippingFee: 0,
        percentDiscount: 0,
        cashDiscount: 0,
        percentVat: 0,
        cashVat: 0,
        totalWeight: 3,
        productNameDetail: 'Dầu DO',
        branchName: 'Chi nhánh RG',
        note: '',
        details: [
          {
            ordinalNumber: 10,
            refId: 7,
            refTime: '2023-12-21T08:11:01.22',
            code: 'THN231221-000004',
            numberOfCode: '',
            supplierId: 1,
            supplierCode: 'NCC1',
            supplierName: 'Nhà cung cấp 1',
            supplierAddress: 'test',
            supplierPhone: '0454545455',
            refExplain: 'Trả hàng nhà cung cấp',
            totalAmount: -600000,
            paymentAmount: 0,
            receiptsAmount: 0,
            reductionAmount: 0,
            debtAmount: -600000,
            rampartsAmount: 9997447630,
            sort: '202312210000000149',
            refDetailIdDetail: 29,
            productCodeDetail: 'DDO',
            unitNameDetail: 'Phi',
            unitChangeDetail: 2,
            priceBuyDetail: null,
            quantityDetail: 3,
            specificationsDetail: 0,
            percentDiscountDetail: 0,
            cashDiscountDetail: 0,
            percentVatDetail: 0,
            cashVatDetail: 0,
            totalAmountDetail: 600000,
            noteDetail: 'test',
            warehouseNameDetail: 'Sài gòn petrol',
            quantityPromotionDetail: 0,
            weightDetail: 1,
            totalWeightProductDetail: 3,
            paymentTypeName: null,
            shippingFee: 0,
            percentDiscount: 0,
            cashDiscount: 0,
            percentVat: 0,
            cashVat: 0,
            totalWeight: 3,
            productNameDetail: 'Dầu DO',
            branchName: 'Chi nhánh RG',
            note: '',
          },
        ],
      },
      {
        ordinalNumber: 8,
        refId: 13,
        refTime: '2023-12-21T11:03:11.74',
        code: 'PMH231221-000009',
        numberOfCode: '',
        supplierId: 1,
        supplierCode: 'NCC1',
        supplierName: 'Nhà cung cấp 1',
        supplierAddress: 'test',
        supplierPhone: '0454545455',
        refExplain: 'Mua hàng',
        totalAmount: 200000,
        paymentAmount: 0,
        receiptsAmount: 0,
        reductionAmount: 0,
        debtAmount: 200000,
        rampartsAmount: 9997647630,
        sort: '202312210000000150',
        refDetailIdDetail: 92,
        productCodeDetail: 'DDO',
        unitNameDetail: 'Phi',
        unitChangeDetail: 2,
        priceBuyDetail: null,
        quantityDetail: 1,
        specificationsDetail: 1,
        percentDiscountDetail: 0,
        cashDiscountDetail: 0,
        percentVatDetail: 0,
        cashVatDetail: 0,
        totalAmountDetail: 200000,
        noteDetail: 'test',
        warehouseNameDetail: 'Sài gòn petrol',
        quantityPromotionDetail: 0,
        weightDetail: 1,
        totalWeightProductDetail: 1,
        paymentTypeName: null,
        shippingFee: 0,
        percentDiscount: 0,
        cashDiscount: 0,
        percentVat: 0,
        cashVat: 0,
        totalWeight: 1,
        productNameDetail: 'Dầu DO',
        branchName: 'Cửa hàng',
        note: '',
        details: [
          {
            ordinalNumber: 8,
            refId: 13,
            refTime: '2023-12-21T11:03:11.74',
            code: 'PMH231221-000009',
            numberOfCode: '',
            supplierId: 1,
            supplierCode: 'NCC1',
            supplierName: 'Nhà cung cấp 1',
            supplierAddress: 'test',
            supplierPhone: '0454545455',
            refExplain: 'Mua hàng',
            totalAmount: 200000,
            paymentAmount: 0,
            receiptsAmount: 0,
            reductionAmount: 0,
            debtAmount: 200000,
            rampartsAmount: 9997647630,
            sort: '202312210000000150',
            refDetailIdDetail: 92,
            productCodeDetail: 'DDO',
            unitNameDetail: 'Phi',
            unitChangeDetail: 2,
            priceBuyDetail: null,
            quantityDetail: 1,
            specificationsDetail: 1,
            percentDiscountDetail: 0,
            cashDiscountDetail: 0,
            percentVatDetail: 0,
            cashVatDetail: 0,
            totalAmountDetail: 200000,
            noteDetail: 'test',
            warehouseNameDetail: 'Sài gòn petrol',
            quantityPromotionDetail: 0,
            weightDetail: 1,
            totalWeightProductDetail: 1,
            paymentTypeName: null,
            shippingFee: 0,
            percentDiscount: 0,
            cashDiscount: 0,
            percentVat: 0,
            cashVat: 0,
            totalWeight: 1,
            productNameDetail: 'Dầu DO',
            branchName: 'Cửa hàng',
            note: '',
          },
        ],
      },
      {
        ordinalNumber: 9,
        refId: 17,
        refTime: '2023-12-21T16:10:25.675',
        code: 'PMH231221-000010',
        numberOfCode: '',
        supplierId: 1,
        supplierCode: 'NCC1',
        supplierName: 'Nhà cung cấp 1',
        supplierAddress: 'test',
        supplierPhone: '0454545455',
        refExplain: 'Mua hàng',
        totalAmount: 1000000,
        paymentAmount: 0,
        receiptsAmount: 0,
        reductionAmount: 0,
        debtAmount: 1000000,
        rampartsAmount: 9998647630,
        sort: '202312210000000155',
        refDetailIdDetail: 96,
        productCodeDetail: 'DDO',
        unitNameDetail: 'Phi',
        unitChangeDetail: 2,
        priceBuyDetail: null,
        quantityDetail: 5,
        specificationsDetail: 1,
        percentDiscountDetail: 0,
        cashDiscountDetail: 0,
        percentVatDetail: 0,
        cashVatDetail: 0,
        totalAmountDetail: 1000000,
        noteDetail: 'test',
        warehouseNameDetail: 'KHO 2',
        quantityPromotionDetail: 0,
        weightDetail: 1,
        totalWeightProductDetail: 5,
        paymentTypeName: null,
        shippingFee: 0,
        percentDiscount: 0,
        cashDiscount: 0,
        percentVat: 0,
        cashVat: 0,
        totalWeight: 5,
        productNameDetail: 'Dầu DO',
        branchName: 'Cửa hàng',
        note: '',
        details: [
          {
            ordinalNumber: 9,
            refId: 17,
            refTime: '2023-12-21T16:10:25.675',
            code: 'PMH231221-000010',
            numberOfCode: '',
            supplierId: 1,
            supplierCode: 'NCC1',
            supplierName: 'Nhà cung cấp 1',
            supplierAddress: 'test',
            supplierPhone: '0454545455',
            refExplain: 'Mua hàng',
            totalAmount: 1000000,
            paymentAmount: 0,
            receiptsAmount: 0,
            reductionAmount: 0,
            debtAmount: 1000000,
            rampartsAmount: 9998647630,
            sort: '202312210000000155',
            refDetailIdDetail: 96,
            productCodeDetail: 'DDO',
            unitNameDetail: 'Phi',
            unitChangeDetail: 2,
            priceBuyDetail: null,
            quantityDetail: 5,
            specificationsDetail: 1,
            percentDiscountDetail: 0,
            cashDiscountDetail: 0,
            percentVatDetail: 0,
            cashVatDetail: 0,
            totalAmountDetail: 1000000,
            noteDetail: 'test',
            warehouseNameDetail: 'KHO 2',
            quantityPromotionDetail: 0,
            weightDetail: 1,
            totalWeightProductDetail: 5,
            paymentTypeName: null,
            shippingFee: 0,
            percentDiscount: 0,
            cashDiscount: 0,
            percentVat: 0,
            cashVat: 0,
            totalWeight: 5,
            productNameDetail: 'Dầu DO',
            branchName: 'Cửa hàng',
            note: '',
          },
        ],
      },
    ],
    [
      {
        order: 1,
        id: 4,
        finalizeWorkShiftId: 6,
        parValue: 500000,
        quantity: 46,
        totalAmount: 23000000,
      },
    ],
  ],
};

export type PrintDataSource = {
  [key: string]: unknown;
  details?: Array<Record<string, unknown>[]>;
};

const getReplaceStrings = (string: string, reg: RegExp) => {
  const result = [];
  let stringFind;
  do {
    stringFind = reg.exec(string);
    if (stringFind) {
      result.push(stringFind[0]);
    }
  } while (stringFind);
  return result;
};

// const drawTable =
//   (table: HTMLTableElement, keywords: string[], cellStyle: string[]) =>
//   (row: Record<string, string>) => {
//     // keywords [index]
//     // cellStyle để lấy cái css của td bên thiết kế

//     const newRow = table.insertRow();
//     keywords.forEach((key, index) => {
//       const newCell = newRow.insertCell();

//       // valueTd cái này để format
//       const valueTd = row?.[key] ?? '';
//       let textContent = document.createTextNode(valueTd); // document.createTextNode(row?.[key] ?? "");

//       // tạm cách này check nếu số đầu tiên = 0 thì ko format vì có thể là sdt
//       if (
//         isNaN(Number(valueTd)) ||
//         valueTd.toString().substring(0, 1) == '0' ||
//         valueTd.toString() == ''
//       ) {
//         textContent = document.createTextNode(valueTd);
//       } else {
//         textContent = document.createTextNode(realNumberDecimalFormat(valueTd));
//       }
//       // end valueTd cái này để format

//       newCell.appendChild(textContent);
//       newCell.style.cssText = cellStyle?.[index] ?? '';
//     });
//   };

const populateDataOnMultipleTable = (
  htmlTemplate: string,
  dataSource: PrintDataSource,
  rowNumber: number
) => {
  const htmlObject = document.createElement('div');
  htmlObject.innerHTML = htmlTemplate;
  //========== START AREA SET STYLE ========== //
  const listTable = htmlObject.querySelectorAll('table');
  // const reg = /\[(.*?)\]/g;

  let tableIndex = 0;
  listTable?.forEach((tableElement, index) => {
    // const contentReg = reg.exec(tableElement.innerHTML);
    const rowCount = countVariableRows(tableElement);
    if (rowCount > 0) {
      // Select all rows in the table
      const rows = tableElement.querySelectorAll('tr');

      const cells = rows[rowNumber]?.querySelectorAll('td') ?? [];

      const fieldTd = Array.from(cells)
        .map(v => v.innerText)
        .map(v => v.indexOf('[') >= 0 && v.substring(v.indexOf('[') + 1, v.indexOf(']')));

      if (!dataSource?.details) {
        return;
      }

      dataSource.details?.[tableIndex]?.forEach(rowData => {
        const newRow = tableElement.insertRow(rowNumber);

        for (let indexCell = 0; indexCell < cells.length; indexCell++) {
          const fieldName = fieldTd[indexCell] as keyof typeof rowData;
          // lấy style của mấy cái span
          let styleTd = '';
          cells[indexCell].innerHTML.split('<span ').forEach(v => {
            if (v.indexOf('style="') >= 0) {
              styleTd += v.substring(v.indexOf('style="') + 7, v.indexOf('">')) + ';';
            }
          });

          const newCell = newRow.insertCell(indexCell);

          if (rowData) {
            // Append a text node to the cell
            let value = rowData[fieldName];

            if (typeof value === 'number') value = realNumberDecimalFormat(String(value), 0) || '0';
            if (typeof fieldName === 'string' && fieldName?.slice(0, 2) === 'is') {
              // value = value ? '☑' : '☐'; 
              newCell.innerHTML = value
                ? `<span style="font-family: Wingdings; color: black; font-size: 21px;">þ</span>` // Checked
                : `<span style="font-family: Wingdings; color: black; font-size: 21px;">o</span>`; // Unchecked
              value = '';
            }
            if (!value) value = '';

            const newText = document.createTextNode(String(value));

            newCell.appendChild(newText);
            newCell.style.cssText = cells[indexCell].style.cssText + styleTd;
          }
        }
      });
      tableElement.deleteRow((dataSource?.details?.[tableIndex]?.length ?? 0) + rowNumber);
      htmlObject.querySelectorAll('table')[index].innerHTML = tableElement.innerHTML;
      tableIndex++;
    }
  });

  return htmlObject.innerHTML;
};

// const populateDataOnDebtDetail = (htmlTemplate: string, dataSource: PrintDataSource) => {
//   const htmlObject = document.createElement('div');
//   htmlObject.innerHTML = htmlTemplate;
//   //========== START AREA SET STYLE ========== //
//   const listTable = htmlObject.querySelectorAll('table');
//   const reg = /\[(.*?)\]/g;

//   listTable.forEach((tableElement, index) => {
//     const contentReg = reg.exec(tableElement.innerHTML);
//     if (contentReg) {
//       const FIRST_ROW = 1;
//       // const HEADER_ROW = 2;
//       const ITEM_ROW = 2;
//       const NUMBER_OF_SQUARE_BRACKETS_PER_CELL = 1;
//       const getRowCells = (rowIndex: number) =>
//         tableElement.querySelectorAll('tr')?.[rowIndex]?.querySelectorAll('td') ?? [];

//       const getSquareBracketsFields = (cell: HTMLTableCellElement) => {
//         if (cell.innerText.indexOf('[') === -1) return null;

//         const content = cell.innerText;

//         const numberOfSquareBrackets = content.match(/\[/g)?.length || 0;
//         // in case <td>[code] - [note]</td>
//         if (numberOfSquareBrackets > NUMBER_OF_SQUARE_BRACKETS_PER_CELL) {
//           const fields = getReplaceStrings(content, reg);
//           return fields.map(field => field.substring(1, field.length - 1));
//         }

//         return content.substring(1, content.length - 1);
//       };

//       const firstRowCells = getRowCells(FIRST_ROW);
//       // const headerRowCells = getRowCells(HEADER_ROW);
//       const itemRowCells = getRowCells(ITEM_ROW);

//       // khúc này lấy cái style của td rồi pass vào drawTable để add css cho nó
//       const firstRowCellsStyle: string[] = [];
//       for (let indexCell = 0; indexCell < firstRowCells.length; indexCell++) {
//         // lấy style của mấy cái span
//         let styleTd = '';
//         firstRowCells[indexCell].innerHTML.split('<span ').forEach(v => {
//           let strong = '';
//           if (v.indexOf('strong') > 0) {
//             strong = 'font-weight: bold;';
//           }
//           let italic = '';
//           if (v.indexOf('em') > 0) {
//             italic = 'font-style: italic;';
//           }
//           if (v.indexOf('style="') >= 0) {
//             styleTd +=
//               strong + italic + v.substring(v.indexOf('style="') + 7, v.indexOf('">')) + ';';
//           }
//         });
//         firstRowCellsStyle.push(firstRowCells[indexCell].style.cssText + styleTd);
//       }

//       const itemRowCellsStyle: string[] = [];
//       for (let indexCell = 0; indexCell < itemRowCells.length; indexCell++) {
//         // lấy style của mấy cái span
//         let styleTd = '';
//         itemRowCells[indexCell].innerHTML.split('<span ').forEach(v => {
//           let strong = '';
//           if (v.indexOf('strong') > 0) {
//             strong = 'font-weight: bold;';
//           }
//           let italic = '';
//           if (v.indexOf('em') > 0) {
//             italic = 'font-style: italic;';
//           }
//           if (v.indexOf('style="') >= 0) {
//             styleTd +=
//               strong + italic + v.substring(v.indexOf('style="') + 7, v.indexOf('">')) + ';';
//           }
//         });
//         itemRowCellsStyle.push(itemRowCells[indexCell].style.cssText + styleTd);
//       }

//       const firstRowFields = Array.from(firstRowCells).map(getSquareBracketsFields);
//       const itemRowFields = Array.from(itemRowCells).map(getSquareBracketsFields).flat();
//       const items = dataSource.details?.[0];

//       [1, 1].forEach(row => tableElement.deleteRow(row));
//       const summaryRow = tableElement.rows[1];

//       (items || []).forEach(item => {
//         if (!item) return;

//         const headerRow = tableElement.insertRow();
//         firstRowFields.forEach((headerCol, index) => {
//           const headerCell = headerRow.insertCell();
//           const div = document.createElement('div');

//           let content;
//           if (Array.isArray(headerCol) && headerCol.length > 1) {
//             content = headerCol.reduce((text, col: string) => {
//               if (!item[col]) {
//                 return text + '';
//               }
//               return text + ' ' + String(item[col]);
//             }, '');
//           } else if (typeof headerCol === 'string') {
//             content = item[headerCol];
//           }

//           if (index === 2) headerCell.setAttribute('colSpan', '2');

//           if (typeof content === 'number')
//             content = realNumberDecimalFormat(String(content), 0) || '0';
//           if (!content) content = '';

//           const contentNode = document.createTextNode(String(content));
//           div.appendChild(contentNode);
//           div.style.cssText = firstRowCellsStyle[index];

//           headerCell.appendChild(div);
//         });

//         // draw detail items
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//         ((item?.details as Record<string, string | number>[]) || []).forEach(detailItem => {
//           const detailItemRow = tableElement.insertRow();
//           itemRowFields.forEach((itemRowField, columnIndex) => {
//             const detailItemCell = detailItemRow.insertCell();

//             let value: string | number;
//             if (itemRowField !== null) {
//               value = detailItem[itemRowField];
//             } else {
//               value = '';
//             }

//             if (typeof value === 'number') value = realNumberDecimalFormat(String(value), 0) || '0';
//             if (!value) value = '';

//             const detailItemContent = document.createTextNode(String(value));

//             const div = document.createElement('div');
//             div.appendChild(detailItemContent);
//             div.style.cssText = itemRowCellsStyle[columnIndex];

//             detailItemCell.appendChild(div);
//           });
//         });
//       });

//       // summary in last row
//       tableElement.appendChild(summaryRow);
//       htmlObject.getElementsByTagName('table')[index].innerHTML = tableElement.innerHTML;
//     }
//   });

//   return htmlObject.innerHTML;
// };

export const populateBasicPrintedForm = (
  htmlTemplate: string,
  formData: PrintDataSource = defaultFormData,
  rowNumber?: number
) => {
  const placeholderRegex = /\{(.*?)\}/g;
  const placeholders = getReplaceStrings(htmlTemplate, placeholderRegex);

  placeholders.forEach(placeholder => {
    const dataField = placeholder.substring(1, placeholder.length - 1);
    let value = formData[dataField];

    if (typeof value === 'number') value = realNumberDecimalFormat(String(value), 0) || '0';
    if (!value) value = '';

    htmlTemplate = htmlTemplate.replace(placeholder, String(value));
  });

  return populateDataOnMultipleTable(htmlTemplate, formData, rowNumber || 1);
};

// const getDebtDetails = (items: Record<string, unknown>[]) => {
//   if (items.length === 0) {
//     return [];
//   }

//   const groupedItems = Object.entries(groupArrayByKey(sortList(items, 'sort'), 'sort'));
//   const sortedGroupItems = moveElement(groupedItems, 1, groupedItems.length);

//   return sortedGroupItems.map(([, items], index) => {
//     const firstItem = items?.[0];
//     if (index !== 0 && index !== sortedGroupItems.length - 1) {
//       return { ...firstItem, details: items };
//     }
//     return { ...firstItem, details: [] };
//   });
// };

export const getCompletedPrintout = (
  // type: string,
  htmlTemplate: string,
  data?: PrintDataSource,
  size?: string,
  rowNumber?: number
) => {
  const getPopulatedPrintout = (data: PrintDataSource, rowNumber: number) => {
    // if (
    //   [
    //     PRINT_TYPES.SUPPLIER_DEBT_TABLE_DETAIL_REPORT,
    //     PRINT_TYPES.CUSTOMER_DEBT_TABLE_DETAIL_REPORT,
    //   ].includes(type)
    // ) {
    //   const lastRampartsAmount = Number(data.details?.[0].at(-1)?.rampartsAmount || 0);
    //   data = {
    //     ...data,
    //     lastRampartsAmount,
    //     lastRampartsAmountByText: readNumberToText(String(lastRampartsAmount), 'đồng'),
    //     details: [getDebtDetails(data.details?.[0] as Record<string, unknown>[])],
    //   };
    // }

    const placeholderRegex = /\{(.*?)\}/g;
    const placeholders = getReplaceStrings(htmlTemplate, placeholderRegex);

    placeholders.forEach(placeholder => {
      const dataField = placeholder.substring(1, placeholder.length - 1);
      let value = data[dataField];

      if (typeof value === 'number') {
        value = realNumberDecimalFormat(String(value), 0) || '0';
      }
      if (!value) value = '';

      // dataField is checkbox
      if (dataField.slice(0, 2) === 'is') {
        value = value
          ? '<span style="font-family: Wingdings; color: black; font-size: 21px;"><span>þ</span></span>'
          : '<span style="font-family: Wingdings; color: black; font-size: 21px;"><span>o</span></span>';
      }
      htmlTemplate = htmlTemplate.replace(placeholder, String(value));
    });

    // if (
    //   [
    //     PRINT_TYPES.SUPPLIER_DEBT_TABLE_DETAIL_REPORT,
    //     PRINT_TYPES.CUSTOMER_DEBT_TABLE_DETAIL_REPORT,
    //   ].includes(type)
    // ) {
    //   return populateDataOnDebtDetail(htmlTemplate, data);
    // }

    return populateDataOnMultipleTable(htmlTemplate, data, rowNumber);
  };

  return `<style>@page { size: ${size} }</style> ${getPopulatedPrintout(data || defaultFormData, rowNumber || 1)}`;
};

const countVariableRows = (tableElement: HTMLTableElement): number => {
  const reg = /\[(.*?)\]/g; // Regex to match any text in square brackets
  let variableRowCount = 0;

  // Select all rows in the table
  const rows = tableElement.querySelectorAll('tr');

  rows.forEach(row => {
    // Check if any cell in the row contains text matching "[...]"
    const hasVariable = Array.from(row.cells).some(cell => reg.test(cell.innerHTML));
    if (hasVariable) {
      variableRowCount++;
    }
  });

  return variableRowCount;
};

const checkBoxMarco = `
{% macro checkBox(flag) %}
{% if flag %}
  <span style="font-family: Wingdings; color: black; font-size: 21px;">þ</span>
{% else %}
  <span style="font-family: Wingdings; color: black; font-size: 21px;">o</span>
{% endif %}
{% endmacro %}`;

export const preparePrint = (
  htmlTemplate: string,
  data?: PrintDataSource,
  pageSize: string = 'A4'
) => {
  // regex to find string like {{ checkBox(w+) }}
  const reg = /\{\{ checkBox\((.*?)\) \}\}/g;
  // check if checkBox marked is exist
  const isCheckBoxExist = reg.test(htmlTemplate);

  if (isCheckBoxExist) {
    // add checkBox marco in the first of htmlTemplate
    htmlTemplate = checkBoxMarco + htmlTemplate;
  }

  const regExtendTemplate = /\[\[\w+\]\]/g;
  if (regExtendTemplate.test(htmlTemplate)) {
    htmlTemplate = htmlTemplate.replace(regExtendTemplate, String(data?.extendTemplate || ''));
  }

  const htmlObject = document.createElement('div');
  htmlObject.innerHTML = htmlTemplate;

  const tables = htmlObject.querySelectorAll('table');
  // matching table has contain marker [table|item] by regex /\[(\w+)\|(\w+)\]/g;
  const markerRegex = /\[(\w+)\|(\w+)\]/g;
  tables.forEach(table => {
    const marker = markerRegex.exec(table.innerHTML);
    if (marker) {
      let tableTemplate = convertTableToNunjucks(table.outerHTML);
      tableTemplate = checkBoxMarco + tableTemplate;

      const tableReder = safeRenderString(tableTemplate, { ...data }).html;

      // reflect changes to htmlObject
      htmlObject.innerHTML = htmlObject.innerHTML.replace(table.outerHTML, tableReder);

      // update htmlTemplate with new tableTemplate
      htmlTemplate = htmlObject.innerHTML;
    }
  });

  return `<style>@page { size: ${pageSize} }</style> ${safeRenderString(htmlTemplate, { ...data }).html}`;
};

function convertTableToNunjucks(html: string) {
  // 1. Extract all object names from markers
  const objectNames = new Set<string>();
  const markerRegex = /\[(\w+)\|(\w+)\]/g;

  // 2. Replace markers and collect object names with boolean handling
  const convertedHtml = html.replace(markerRegex, (_, obj: string, prop: string) => {
    objectNames.add(obj);

    // Handle boolean properties starting with 'is'
    if (/^is(Not)?[A-Z]/.test(prop)) {
      return `{{ checkBox(item.${prop}) }}`;
    }
    return `{{ item.${prop} }}`;
  });

  // 3. Validate single object usage
  if (objectNames.size > 1) {
    console.log('Multiple object names detected in markers');
    return;
  }
  const targetObject = objectNames.values().next().value || 'defaultObject';

  // 4. Split rows into static and dynamic
  const trRegex = /<tr[\s\S]*?<\/tr>/gi;
  const allRows = convertedHtml.match(trRegex) || [];

  const { staticRows, dynamicRows } = allRows.reduce<{
    staticRows: string[];
    dynamicRows: string[];
  }>(
    (acc, row) => {
      row.includes('{{ item.') ? acc.dynamicRows.push(row) : acc.staticRows.push(row);
      return acc;
    },
    { staticRows: [], dynamicRows: [] }
  );

  // 5. Construct final template with attribute preservation
  const tableMatch = html.match(/<table\s*/);
  const attributesMatch = html.match(/<table\s+([^>]*)>/);
  return `${tableMatch?.[0] ?? '<table'}${attributesMatch ? ` ${attributesMatch[1].trim()}` : ''}>
  <tbody>
    ${staticRows.join('\n')}
    {% for item in ${targetObject} %}
    ${dynamicRows.join('\n')}
    {% endfor %}
  </tbody>
</table>`;
}

// Safe render function
function safeRenderString(template: string, context: object) {
  try {
    return {
      html: nunjucksEnv.renderString(template, context),
      error: null,
    };
  } catch (error: any) {
    console.error('Template Rendering Failed:', {
      error: error.message,
      template,
      context,
    });

    return {
      html: nunjucksEnv.renderString('{{ handleTemplateError(error) }}', { error }),
      error: error.message,
    };
  }
}
