// import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormLabel } from '@/components/ui/form';
import { COMPONENT, MUTATE, QUERIES, closeLabel, enterLabel, saveLabel } from '@/constant';
import { useFormHandler } from '@/hooks';
import { useEntity } from '@/hooks/use-entity';
import { createMutationSuccessFn } from '@/lib/i18nUtils';
import { createPostMutateFn, createPutMutateFn, createQueryByIdFn } from '@/services';
import { DocumentGroup, FormInsideModalProps, documentGroupSchema } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Button, CheckBox, TextBox } from 'devextreme-react';
import { useTranslation } from 'react-i18next';

// id
// code
// name
// note
// is_active
const defaultDocumentGroupValues = {
  id: 0,
  code: '',
  name: '',
  note: '',
  isActive: true,
  storeId: null,
  branchId: null,
};

const onDocumentGroupMutationSuccess = createMutationSuccessFn('documentGroup');

export const DocumentGroupForm = ({
  role,
  editId,
  toggle,
}: FormInsideModalProps<DocumentGroup>) => {
  const { t } = useTranslation('documentGroup');
  const toggleForm = () => {
    if (toggle) toggle();
  };

  const { mutateQueryItem } = useEntity<DocumentGroup>({
    queryKey: [QUERIES.DOCUMENT_GROUP],
    model: 'document-group',
  });

  const queryClient = useQueryClient();

  const { handleSubmit, loading, methods } = useFormHandler<DocumentGroup>({
    queryKey: [MUTATE.DOCUMENT_GROUP, editId],
    mutateKey: [MUTATE.DOCUMENT_GROUP],
    invalidateKey: [QUERIES.DOCUMENT_GROUP],
    queryId: editId,
    readFn: createQueryByIdFn<DocumentGroup>('document-group'),
    createFn: createPostMutateFn<DocumentGroup>('document-group'),
    updateFn: createPutMutateFn<DocumentGroup>('document-group'),
    formatPayloadFn: values => {
      return values;
    },
    formatResponseFn: response => {
      mutateQueryItem(response);
      return response;
    },
    onCreateSuccess: (data, variables) => {
      mutateQueryItem({ ...variables, id: data });
      onDocumentGroupMutationSuccess(data);
      void queryClient.invalidateQueries({ queryKey: [QUERIES.DOCUMENT_GROUP, COMPONENT] });
      toggleForm();
    },
    onUpdateSuccess: data => {
      onDocumentGroupMutationSuccess(data);
      void queryClient.invalidateQueries({ queryKey: [QUERIES.DOCUMENT_GROUP, COMPONENT] });
      toggleForm();
    },
    formOptions: {
      resolver: zodResolver(documentGroupSchema),
      defaultValues: defaultDocumentGroupValues,
    },
  });

  return (
    <Form {...methods}>
      <form className="p-1" autoComplete="off" onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* code */}
          <div className="flex items-center">
            <FormLabel name="code" className="w-[89px]">
              {t('fields.code')}
            </FormLabel>
            <FormField name="code" className="flex-1 md:max-w-[250px]">
              <TextBox placeholder={`${enterLabel} ${t('fields.code')}`} />
            </FormField>
          </div>

          {/* name */}
          <div className="flex items-center">
            <FormLabel name="name" className="w-[89px]">
              {t('fields.name')}
            </FormLabel>
            <FormField name="name" className="flex-1 md:w-[500px]">
              <TextBox placeholder={`${enterLabel} ${t('fields.name')}`} />
            </FormField>
          </div>

          {/* note */}
          <div className="flex items-center">
            <FormLabel name="note" className="w-[89px]">
              {t('fields.note')}
            </FormLabel>
            <FormField name="note" className="flex-1 md:w-[500px]">
              <TextBox placeholder={`${enterLabel} ${t('fields.note')}`} />
            </FormField>
          </div>

          {/* is_active */}
          <div className="flex items-center">
            <FormField name="isActive" className="ml-[90px]" type="checkbox">
              <CheckBox />
            </FormField>
            <FormLabel className="">{t('fields.isActive')}</FormLabel>
          </div>
        </div>

        <DialogFooter className="mt-8 flex flex-row-reverse gap-x-2 bg-white py-1">
          <Button
            stylingMode="contained"
            text={saveLabel}
            icon="save"
            type="success"
            disabled={loading || (editId ? !role?.isUpdate : !role?.isCreate)}
            useSubmitBehavior
          />
          <Button
            stylingMode="outlined"
            text={closeLabel}
            icon="close"
            disabled={loading || (editId ? !role?.isUpdate : !role?.isCreate)}
            onClick={toggleForm}
            type="default"
          />
        </DialogFooter>
      </form>
    </Form>
  );
};
