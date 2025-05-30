import { z } from 'zod';
export const overtimeAttendanceTrackingReportSchema = z.object({
  id: z.number(),
  storeId: z.number().nullable(),
  branchId: z.number().nullable(),
  salarySheetId: z.number(),
  ordinalNumber: z.number(),
  employeeId: z.number(),
  employeeName: z.number(),
  departmentId: z.number(),
  day01: z.number(),
  day02: z.number(),
  day03: z.number(),
  day04: z.number(),
  day05: z.number(),
  day06: z.number(),
  day07: z.number(),
  day08: z.number(),
  day09: z.number(),
  day10: z.number(),
  day11: z.number(),
  day12: z.number(),
  day13: z.number(),
  day14: z.number(),
  day15: z.number(),
  day16: z.number(),
  day17: z.number(),
  day18: z.number(),
  day19: z.number(),
  day20: z.number(),
  day21: z.number(),
  day22: z.number(),
  day23: z.number(),
  day24: z.number(),
  day25: z.number(),
  day26: z.number(),
  day27: z.number(),
  day28: z.number(),
  day29: z.number(),
  day30: z.number(),
  day31: z.number(),
  overtime: z.number(),
  saturdaySundayOvertime: z.number(),
  holidayOvertime: z.number(),
  monneyOneHours: z.number(),
  monneyOvertime: z.number(),
  moneySuturdaySundayOvertime: z.number(),
  moneyHolidayOvertime: z.number(),
  totalAmount: z.number(),
});

export type OvertimeAttendanceTrackingReport = z.infer<typeof overtimeAttendanceTrackingReportSchema>;
