import { BasicDialogChildrenProps } from '@/components/basic-dialog';
import { ListComponentResponse } from './network';
import { IUserPermission } from './user';

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type UploadPayloadType = {
  file: Blob;
  type: string;
  folder: string;
};

export type UploadResponse = {
  fileName: string;
  size: number;
  type: string;
  path: string;
};

export type UploadResponseMulti = {
  host: string;
  // folder: string;
  src: string;
  name: string;
} & UploadResponse;

export type FormInsideModalProps<T extends { id: number }> = {
  role?: IUserPermission;
  editId: T['id'];
} & BasicDialogChildrenProps;

export interface PayerRecipient extends ListComponentResponse {
  randomId: number;
  payerRecipientId: number;
  payerRecipientCode: string;
  payerRecipientName: string;
  payerRecipientAddress: string;
  payerRecipientPhone: string;
  payerRecipientType: number;
}

export type PayerAdditionInfo = {
  address?: string | null;
  phone?: string | null;
};

export type ProfessionType = {
  id: number;
  namme: string;
};
