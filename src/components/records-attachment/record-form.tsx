import { useTranslation } from 'react-i18next';

import { DialogFooter } from '@/components/ui/dialog';
import { FormCombobox, FormField, FormLabel } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  addLabel,
  applyLabel,
  closeLabel,
  enterLabel,
  PERMISSIONS,
  QUERIES,
  selectLabel,
} from '@/constant';

import { RecordFilesEditableTable } from '@/components/records-attachment';
import { useAuth, useBoolean, useEntity, usePermission } from '@/hooks';
import { displayExpr } from '@/lib/utils';
import { DocumentGroupForm } from '@/pages/document-group';
import { IUserPermission, RecordAttachment, RecordAttachmentWithOrderModule } from '@/types';
import { Button, DateBox, SelectBox, TextBox } from 'devextreme-react';
import { useFormContext } from 'react-hook-form';
import { BasicDialog } from '../basic-dialog';

type Props = {
  index: number;
  onClose: () => void;
  onOk: (updatedRow: RecordAttachment) => void;
  role?: IUserPermission;
  folder?: string;
};

export const RecordForm = ({ index, onClose, onOk, role, folder }: Props) => {
  const { t } = useTranslation('recordsAttachment');
  const methods = useFormContext<RecordAttachmentWithOrderModule>();
  const { projects } = useAuth();
  const groupDocRole = usePermission(PERMISSIONS.DOCUMENT_GROUP);

  const { state: isAddNewGroupDocFormOpen, toggle: toggleAddNewGroupDocForm } = useBoolean(false);
  const { fetch } = useEntity({
    model: 'document-group',
    queryKey: [QUERIES.DOCUMENT_GROUP],
  });

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center">
          <FormLabel name="projectId" htmlFor="projectId" className="w-[114px] text-nowrap">
            {t('fields.projectId')}
          </FormLabel>
          <FormField
            id="projectId"
            name={`itemsRecordManagement.${index}.projectId`}
            className="w-[500px]"
          >
            <SelectBox
              items={projects}
              valueExpr="id"
              onFocusIn={e => {
                const input = e.element.querySelector(
                  'input.dx-texteditor-input'
                ) as HTMLInputElement;
                if (input) input.select();
              }}
              searchEnabled
              searchMode="contains"
              displayExpr={displayExpr(['name'])}
              showClearButton
            />
          </FormField>
        </div>
        <div className="flex items-start space-x-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <FormLabel name="groupDocId" htmlFor="groupDocId" className="w-[114px] text-nowrap">
                {t('fields.groupDocId')}
              </FormLabel>
              <FormField
                id="groupDocId"
                name={`itemsRecordManagement.${index}.groupDocId`}
                className="w-64 flex-1"
              >
                <FormCombobox
                  model="document-group"
                  queryKey={[QUERIES.DOCUMENT_GROUP]}
                  placeholder={`${selectLabel} ${t('fields.groupDocId')}`}
                />
              </FormField>
            </div>
            <div className="flex items-center">
              <FormLabel name="noDoc" htmlFor="noDoc" className="w-[114px] text-nowrap">
                {t('fields.noDoc')}
              </FormLabel>
              <FormField
                id="noDoc"
                name={`itemsRecordManagement.${index}.noDoc`}
                className="w-full flex-1"
              >
                <TextBox placeholder={`${enterLabel} ${t('fields.noDoc')}`} />
              </FormField>
            </div>
            <div className="flex items-center">
              <FormLabel name="dateCreate" htmlFor="dateCreate" className="w-[114px] text-nowrap">
                {t('fields.dateCreate')}
              </FormLabel>
              <FormField
                id="dateCreate"
                name={`itemsRecordManagement.${index}.dateCreate`}
                className="w-full flex-1"
              >
                <DateBox placeholder={`${selectLabel} ${t('fields.dateCreate')}`} />
              </FormField>
            </div>
            <div className="flex items-center">
              <FormLabel name="agencyId" htmlFor="agencyId" className="w-[114px] text-nowrap">
                {t('fields.agencyId')}
              </FormLabel>
              <FormField
                id="agencyId"
                name={`itemsRecordManagement.${index}.agencyId`}
                className="w-full flex-1"
              >
                <FormCombobox
                  model="agency"
                  queryKey={[QUERIES.AGENCY]}
                  placeholder={`${selectLabel} ${t('fields.groupDocId')}`}
                />
              </FormField>
            </div>
          </div>
          <div className="space-y-4">
            <Button
              stylingMode="text"
              type="default"
              text={`${addLabel} ${t('fields.groupDocId')}`}
              className="w-[193px]"
              icon="plus"
              onClick={toggleAddNewGroupDocForm}
            />
            <div className="flex items-center">
              <FormLabel name="content" htmlFor="content" className="w-[57px] text-nowrap">
                {t('fields.content')}
              </FormLabel>
              <FormField
                id="content"
                name={`itemsRecordManagement.${index}.content`}
                className="w-[500px] flex-1"
              >
                <TextBox placeholder={`${enterLabel} ${t('fields.content')}`} />
              </FormField>
            </div>
            <div className="flex items-center">
              <FormLabel name="note" htmlFor="note" className="w-[57px] text-nowrap">
                {t('fields.note')}
              </FormLabel>
              <FormField
                id="note"
                name={`itemsRecordManagement.${index}.note`}
                className="w-full flex-1"
              >
                <TextBox placeholder={`${enterLabel} ${t('fields.note')}`} />
              </FormField>
            </div>
          </div>
        </div>
      </div>
      <BasicDialog
        title={t('page.form.addNew', { ns: 'documentGroup' })}
        className="w-auto"
        open={isAddNewGroupDocFormOpen}
        toggle={() => {
          toggleAddNewGroupDocForm();
          fetch({});
        }}
      >
        <DocumentGroupForm editId={0} role={groupDocRole} />
      </BasicDialog>
      <div className="mt-8 grid grid-cols-1">
        <Tabs defaultValue="detail" className="shadow-none">
          <div className="w-full">
            <TabsList>
              <TabsTrigger value="detail">{t('page.form.files.detail')}</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="detail" className="col-span-1 mt-4">
            <RecordFilesEditableTable role={role} index={index} folder={folder} />
          </TabsContent>
        </Tabs>
      </div>
      <DialogFooter className="mt-8 flex flex-row-reverse gap-x-2 bg-white py-1">
        <Button
          stylingMode="contained"
          text={applyLabel}
          icon="save"
          type="success"
          onClick={() => {
            const updatedItem = methods.getValues(`itemsRecordManagement.${index}`);
            onOk(updatedItem);
          }}
        />
        <Button
          stylingMode="outlined"
          text={closeLabel}
          icon="close"
          // disabled={loading || (editId ? !role?.isUpdate : !role?.isCreate)}
          onClick={onClose}
          type="default"
        />
      </DialogFooter>
    </>
  );
};
