import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';
import { getFirstDayOfYear, getLastDayOfYear } from '@/lib/utils';
const currentYear = new Date().getFullYear();
export const requireSetupAnnualHolidayText = requiredTextWithNamespace('setupAnnualHoliday');

export const setupAnnualHolidaySchema = z
  .object({
    storeId: z.number().nullable(),
    branchId: z.number().nullable(),
    isActive: z.boolean().nullable().optional(),
    id: z.number(),
    year: z.date({
      required_error: requireSetupAnnualHolidayText('year'),
      invalid_type_error: requireSetupAnnualHolidayText('year'),
    }),
    fromDate: z.date(),
    toDate: z.date(),
    isHolidaySunday: z.boolean().nullable().optional(),
    holidayType: z.number().nullable(),
    note: z.string().nullable().optional(),
    setupAnnualHolidayDetails: z.array(
      z
        .object({
          id: z.number(),
          setupAnnualHolidayId: z.number().nullable(),
          holidayName: z.string().nullable(),
          fromDate: z.union([z.date(), z.null()]).nullable(),
          toDate: z.union([z.date(), z.null()]).nullable(),
        })
        .refine(
          data => {
            if (data.holidayName && data.holidayName.trim() !== '') {
              return !!data.toDate && data.toDate instanceof Date;
            }
            return true;
          },
          {
            message: requireSetupAnnualHolidayText('toDate'),
            path: ['toDate'],
          }
        )
        .refine(
          data => {
            if (data.holidayName && data.holidayName.trim() !== '') {
              return !!data.fromDate && data.fromDate instanceof Date;
            }
            return true;
          },
          {
            message: requireSetupAnnualHolidayText('fromDate'),
            path: ['fromDate'],
          }
        )
        .refine(
          data => {
            if (
              data.holidayName &&
              data.holidayName.trim() !== '' &&
              data.fromDate &&
              data.toDate
            ) {
              return data.fromDate <= data.toDate;
            }
            return true;
          },
          {
            message: requireSetupAnnualHolidayText('errValidateFromDate'),
            path: ['fromDate'],
          }
        )
    ),
  })
  .refine(data => data.fromDate <= data.toDate, {
    message: requireSetupAnnualHolidayText('errValidateFromDate'),
    path: ['fromDate'],
  });

export type SetupAnnualHoliday = z.infer<typeof setupAnnualHolidaySchema>;
export type SetupAnnualHolidayDetail = ArrayElement<
  SetupAnnualHoliday['setupAnnualHolidayDetails']
>;

export const defaultValuesSetupAnnualHoliday: SetupAnnualHoliday = {
  storeId: null, //
  branchId: null, //
  isActive: true, // Hoạt động
  id: 0, // Khóa chính
  year: new Date(), // Năm
  fromDate: getFirstDayOfYear(currentYear), // Từ ngày
  toDate: getLastDayOfYear(currentYear), // Đến ngày
  isHolidaySunday: true, // Nghỉ chủ nhật
  holidayType: null, // 1 (Không nghĩ thứ 7) 2 (Nghĩ thứ 7 nữa buổi) 3 (Nghĩ thứ 7 cả ngày)
  note: '', // Ghi chú,
  setupAnnualHolidayDetails: [
    {
      id: 0, // Khóa chính
      setupAnnualHolidayId: 0, // Thiết lập ngày nghỉ trong năm
      fromDate: new Date(), // Từ ngày
      toDate: new Date(), // Đến ngày
      holidayName: '', // Tên ngày lễ
    },
  ],
};
