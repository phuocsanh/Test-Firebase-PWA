import { requiredTextWithNamespace } from '@/lib/i18nUtils';
import { z } from 'zod';
import { ArrayElement } from './common';

const requireBoardOfDirectorsWorkScheduleText = requiredTextWithNamespace(
  'boardOfDirectorsWorkSchedule'
);

export const boardOfDirectorsWorkScheduleSchema = z.object({
  storeId: z.number().nullable().optional(),
  branchId: z.number().nullable().optional(),
  id: z.number(),
  boardOfDirectorsWorkScheduleTime: z
    .date({
      required_error: requireBoardOfDirectorsWorkScheduleText(
        'boardOfDirectorsWorkScheduleTime',
        'select'
      ),
      invalid_type_error: requireBoardOfDirectorsWorkScheduleText(
        'boardOfDirectorsWorkScheduleTime',
        'select'
      ),
    })
    .nullable(),
  userCreatedId: z
    .number({
      required_error: requireBoardOfDirectorsWorkScheduleText('userCreatedId', 'select'),
      invalid_type_error: requireBoardOfDirectorsWorkScheduleText('userCreatedId', 'select'),
    })
    .min(1, requireBoardOfDirectorsWorkScheduleText('userCreatedId', 'select'))
    .nullable(),
  note: z.string().optional().nullable(),
  weekNumber: z
    .string({
      required_error: requireBoardOfDirectorsWorkScheduleText('weekNumber', 'select'),
      invalid_type_error: requireBoardOfDirectorsWorkScheduleText('weekNumber', 'select'),
    })
    .min(1, requireBoardOfDirectorsWorkScheduleText('weekNumber')),
  fromDate: z
    .date({
      required_error: requireBoardOfDirectorsWorkScheduleText('fromDate', 'select'),
      invalid_type_error: requireBoardOfDirectorsWorkScheduleText('fromDate', 'select'),
    })
    .nullable(),
  toDate: z
    .date({
      required_error: requireBoardOfDirectorsWorkScheduleText('toDate', 'select'),
      invalid_type_error: requireBoardOfDirectorsWorkScheduleText('toDate', 'select'),
    })
    .nullable(),
  boardOfDirectorsWorkScheduleDetails: z.array(
    z.object({
      id: z.number(),
      boardOfDirectorsWorkScheduleId: z.number().nullable(),
      workDate: z.date().nullable().optional(),
      session: z.number().nullable().optional(),
      workTime: z.date().nullable().optional(),
      content: z.string().nullable().optional(),
      chairpersonId: z.number().nullable().optional(),
      // departmentIds: z.array(z.number().nullable().optional()).nullable().optional(),
      // memberIds: z.array(z.number().nullable().optional()).nullable().optional(),
      departmentIds: z.string().nullable().optional(),
      memberIds: z.string().nullable().optional(),
      departmentIdArray: z.array(z.number()).nullable().optional(),
      memberIdArray: z.array(z.number()).nullable().optional(),
      contentPreparerId: z.number().nullable().optional(),
      location: z.string().nullable().optional(),
    })
  ),
});

export type BoardOfDirectorsWorkSchedule = z.infer<typeof boardOfDirectorsWorkScheduleSchema>;

export type BoardOfDirectorsWorkScheduleDetail = ArrayElement<
  BoardOfDirectorsWorkSchedule['boardOfDirectorsWorkScheduleDetails']
>;

export const defaultValuesBoardOfDirectorsWorkSchedule: BoardOfDirectorsWorkSchedule = {
  storeId: 0,
  branchId: 0,
  id: 0,
  boardOfDirectorsWorkScheduleTime: new Date(),
  userCreatedId: 0,
  note: '',
  weekNumber: '',
  fromDate: new Date(),
  toDate: new Date(),
  boardOfDirectorsWorkScheduleDetails: [
    {
      id: 0,
      boardOfDirectorsWorkScheduleId: 0,
      workDate: null,
      session: 0,
      workTime: null,
      content: '',
      chairpersonId: 0,
      departmentIds: '',
      departmentIdArray: [],
      memberIds: '',
      memberIdArray: [],
      contentPreparerId: 0,
      location: '',
    },
  ],
};
