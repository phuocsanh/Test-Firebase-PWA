import { z } from 'zod';

export const SavingInBiddingReportSchema = z.object({
  id: z.number(), // Id
  ordinalNumber: z.number(), // Stt
  projectName: z.string(), // Tên dự án
  tenderPackageName: z.string(), // Tên gói thầu
  approvalNumber: z.string(), // Số quyết định
  approvalDate: z.coerce.date(), // Ngày quyết định (dùng coerce để chuyển từ string ISO)
  tenderPackagePrice: z.number(), // Giá gói thầu
  winningBidPrice: z.number(), // Giá trúng thầu
  saving: z.number(), // Tiết kiệm
  savingRatePercent: z.number(), // Tỷ lệ % tiết kiệm
});

export type SavingInBiddingReport = z.infer<typeof SavingInBiddingReportSchema>;
