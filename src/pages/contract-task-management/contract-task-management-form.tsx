import { DeleteConfirmDialog } from '@/components/confirm-dialog';
import { PeriodFilter } from '@/components/period-filter-form';
import { Form, FormCombobox, FormField, FormLabel, FormRadioGroup } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { enterLabel, MUTATE, PATHS, PERMISSIONS, QUERIES, selectLabel, TABLES } from '@/constant';
import {
  useAuth,
  useDataTable,
  useFormHandlerPromise,
  useFormOperation,
  usePermission,
  useSendNotification,
} from '@/hooks';
import { useFormNavigate } from '@/hooks/use-form-navigate';
import { toDateType, toLocaleDate } from '@/lib/date';
import { createMutationSuccessFn } from '@/lib/i18nUtils';
import {
  createDeleteMutateFn,
  createPostMutateFn,
  createPutMutateFn,
  createQueryByIdFn,
} from '@/services';
import {
  ContractTaskManagement,
  ContractTaskManagementDocuments,
  contractTaskManagementSchema,
  defaultValuesContractTaskManagement,
} from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckBox, DateBox, SelectBox, TextArea, TextBox } from 'devextreme-react';
import Button from 'devextreme-react/button';
import { SyntheticEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { DataTable, EditableInputCell } from '@/components/data-table';

import { BasicDialog } from '@/components/basic-dialog';
import { RecordEditableTable } from '@/components/records-attachment';
import { InputNumber } from '@/components/ui/input';
import { getRandomNumber } from '@/lib/number';
import { displayExpr, getValidId } from '@/lib/utils';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { PageLayout } from './page-layout';

const onContractTaskManagementMutationSuccess = createMutationSuccessFn('contractTaskManagement');
type ContractTaskManagementResponse = ContractTaskManagement & {
  departmentProjectHeadId: number;
  departmentFinanceHeadId: number;
  departmentPlanningHeadId: number;
  projectName: string;
};
export const ContractTaskManagementForm = () => {
  const { id: editId } = useParams();
  const { t } = useTranslation(['contractTaskManagement']);
  const role = usePermission(PERMISSIONS.CONTRACT_TASK_MANAGEMENT);
  const { sendNotify } = useSendNotification();

  const { user, projects } = useAuth();

  const { goBackToList, goToUpdate, goToNew } = useFormNavigate(PATHS.CONTRACT_TASK_MANAGEMENT);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isEligibleForSigning, setEligibleForSigning] = useState<boolean>(true);
  const [isNotEligibleForSigning, setNotEligibleForSigning] = useState<boolean>(false);

  const defaultValues = useMemo(() => {
    return { ...defaultValuesContractTaskManagement, branchId: user?.defaultBrachId, storeId: 0 };
  }, [user?.defaultBrachId]);

  const {
    isEditDialogOpen: isEditDialogOpenFinanceDepartments,
    toggleEditDialog: toggleEditDialogFinanceDepartments,
  } = useDataTable<ContractTaskManagement, PeriodFilter>({});

  const {
    isEditDialogOpen: isEditDialogOpenPlanningDepartments,
    toggleEditDialog: toggleEditDialogPlanningDepartments,
  } = useDataTable<ContractTaskManagement, PeriodFilter>({});

  const { handleSubmitPromise, loading, methods, resetQueryId } =
    useFormHandlerPromise<ContractTaskManagement>({
      queryKey: [MUTATE.CONTRACT_TASK_MANAGEMENT, editId],
      mutateKey: [MUTATE.CONTRACT_TASK_MANAGEMENT],
      queryId: Number(editId) || 0,
      invalidateKey: [QUERIES.CONTRACT_TASK_MANAGEMENT],
      readFn: createQueryByIdFn<ContractTaskManagement>('contract-task-management'),
      createFn: createPostMutateFn<ContractTaskManagement>('contract-task-management'),
      updateFn: createPutMutateFn<ContractTaskManagement>('contract-task-management'),

      formatPayloadFn: data => {
        //console.log('Original data:', data);
        const formattedData = {
          ...data,
          contractTaskManagementTime: toLocaleDate(data.contractTaskManagementTime)!,
          completionTime: toLocaleDate(data.completionTime ?? null)!,
          contractTaskManagementProjectDepartments:
            data.contractTaskManagementProjectDepartments.map(item => ({
              ...item,
              approveTime: toLocaleDate(item.approveTime ?? null),
              id: getValidId(item.id),
            })),
          contractTaskManagementFinanceDepartments:
            data.contractTaskManagementFinanceDepartments.map(item => ({
              ...item,
              approveTime: toLocaleDate(item.approveTime ?? null),
              receivedTime: toLocaleDate(item.receivedTime ?? null)!,
              completionTime: toLocaleDate(item.completionTime ?? null)!,
              id: getValidId(item.id),
            })),
          contractTaskManagementPlanningDepartments:
            data.contractTaskManagementPlanningDepartments.map(item => ({
              ...item,
              approveTime: toLocaleDate(item.approveTime ?? null),
              receivedTime: toLocaleDate(item.receivedTime ?? null)!,
              completionTime: toLocaleDate(item.completionTime ?? null)!,
              id: getValidId(item.id),
            })),
          contractTaskManagementDocuments: data.contractTaskManagementDocuments.map(item => ({
            ...item,
            id: getValidId(item.id),
          })),
          itemsRecordManagement: data.itemsRecordManagement
            .filter(item => item.noDoc)
            .map(item => ({
              ...item,
              dateCreate: toLocaleDate(item.dateCreate!),
              itemFile: item.itemFile.filter(file => file.fileName),
            })),
          isNotEligibleForSigning: isNotEligibleForSigning ?? false,
          isEligibleForSigning: isEligibleForSigning ?? false,
        };
        return formattedData;
      },

      formatResponseFn: data => {
        setEligibleForSigning(data.isEligibleForSigning ?? false);
        setNotEligibleForSigning(data.isNotEligibleForSigning ?? false);
        const response = {
          ...data,
          contractTaskManagementTime: toDateType(data.contractTaskManagementTime)!,
          completionTime: toDateType(data.completionTime ?? null)!,
          contractTaskManagementProjectDepartments:
            data.contractTaskManagementProjectDepartments.map(item => ({
              ...item,
              approveTime: toDateType(item.approveTime ?? null),
            })),
          contractTaskManagementFinanceDepartments:
            data.contractTaskManagementFinanceDepartments.map(item => ({
              ...item,
              approveTime: toDateType(item.approveTime ?? null),
              receivedTime: toDateType(item.receivedTime ?? null)!,
              completionTime: toDateType(item.completionTime ?? null)!,
            })),
          contractTaskManagementPlanningDepartments:
            data.contractTaskManagementPlanningDepartments.map(item => ({
              ...item,
              approveTime: toDateType(item.approveTime ?? null),
              receivedTime: toDateType(item.receivedTime ?? null)!,
              completionTime: toDateType(item.completionTime ?? null)!,
            })),
          contractTaskManagementDocuments: data.contractTaskManagementDocuments.map(item => ({
            ...item,
          })),
          itemsRecordManagement: data.itemsRecordManagement.map(item => ({
            ...item,
            dateCreate: toDateType(item.dateCreate!),
          })),
        };
        return response;
      },

      onCreateSuccess: data => {
        onContractTaskManagementMutationSuccess(data);
        goToUpdate(data);
      },

      onUpdateSuccess: onContractTaskManagementMutationSuccess,

      formOptions: {
        resolver: zodResolver(contractTaskManagementSchema),
        defaultValues,
      },
    });

  const { reset, onTimeChange } = useFormOperation<ContractTaskManagement>({
    model: 'contract-task-management',
    fieldTime: 'contractTaskManagementTime',
    createCodeKey: [QUERIES.CONTRACT_TASK_MANAGEMENT_CODE],
    formMethods: methods,
  });

  const {
    isDeleting,
    deleteTarget,
    selectTargetToDelete,
    toggleConfirmDeleteDialog,
    isConfirmDeleteDialogOpen,
  } = useDataTable<ContractTaskManagement, PeriodFilter>({
    deleteFn: createDeleteMutateFn('contract-task-management'),
    deleteKey: [MUTATE.CONTRACT_TASK_MANAGEMENT],
  });

  const onCreateNew = () => {
    goToNew();
    methods.reset(defaultValues);
    reset();
    resetQueryId();
  };

  const onDelete = () => {
    selectTargetToDelete(methods.getValues());
  };

  //Quản lý dự án, Tài chính tổng hợp, Kế hoạch chất lượng
  const [
    fieldsProjectDepartment,
    fieldsFinanceDepartment,
    fieldsPlanningDepartment,
    contractTaskManagementDocuments,
  ] = methods.watch([
    'contractTaskManagementProjectDepartments',
    'contractTaskManagementFinanceDepartments',
    'contractTaskManagementPlanningDepartments',
    'contractTaskManagementDocuments',
  ]);

  //phụ lục hô sơ đính kèm
  const contractTaskManagementDocumentColumns: ColumnDef<ContractTaskManagementDocuments>[] =
    useMemo(() => {
      return [
        {
          id: 'components',
          accessorKey: 'components',
          header: t('fields.contractTaskManagementDocuments.components'),
          cell: props => <EditableInputCell {...props} readOnly={true} />,
          size: 750,
        },
        {
          id: 'quantity',
          accessorKey: 'quantity',
          header: t('fields.contractTaskManagementDocuments.quantity'),
          cell: props => <EditableInputCell {...props} type="number" />,
          size: 50,
        },
        {
          id: 'isAvailable',
          accessorKey: 'isAvailable',
          header: t('fields.contractTaskManagementDocuments.isAvailable'),
          cell: props => {
            return (
              <div className="flex items-center justify-center">
                <CheckBox
                  value={props.getValue<boolean>()}
                  onValueChanged={e => {
                    props.table.options.meta?.updateData(props.row.index, props.column.id, e.value);
                  }}
                />
              </div>
            );
          },
          size: 50,
        },
        {
          id: 'isNotAvailable',
          accessorKey: 'isNotAvailable',
          header: t('fields.contractTaskManagementDocuments.isNotAvailable'),
          cell: props => {
            return (
              <div className="flex items-center justify-center">
                <CheckBox
                  value={props.getValue<boolean>()}
                  onValueChanged={e => {
                    props.table.options.meta?.updateData(props.row.index, props.column.id, e.value);
                  }}
                />
              </div>
            );
          },
          size: 50,
        },
      ];
    }, [t]);

  //Start: in phiếu
  // const { data: printData = [], refetch } = useQuery<SaleOrderPrint[]>({
  //   queryKey: ['PRINT', QUERIES.CONTRACT_TASK_MANAGEMENT, editId],
  //   queryFn: () => {
  //     return postRequest<SaleOrderPrint[]>(
  //       '/contractor-selection-plan/print-contractor-selection-plan-by-ids',
  //       [editId]
  //     );
  //   },
  //   enabled: false,
  // });

  // const getPrintDataSource = (): PrintDataSource => {
  //   const data = methods.getValues();
  //   // add order number in details
  //   const details = data.contractTaskManagementDocuments.map(
  //     (item: ContractTaskManagementDocuments, index: number) => {
  //       return { ...item, orderNumber: index + 1 };
  //     }
  //   );

  //   return {
  //     ...data,
  //     contractTaskManagementTime: formatDate(data.contractTaskManagementTime),
  //     contractTaskManagementFinanceDepartments: data.contractTaskManagementFinanceDepartments.map(
  //       item => ({
  //         ...item,
  //         receivedTime: formatDate(item.receivedTime ?? null),
  //         completionTime: formatDate(item.completionTime ?? null),
  //       })
  //     ),
  //     contractTaskManagementPlanningDepartments: data.contractTaskManagementPlanningDepartments.map(
  //       item => ({
  //         ...item,
  //         receivedTime: formatDate(item.receivedTime ?? null),
  //         completionTime: formatDate(item.completionTime ?? null),
  //       })
  //     ),
  //     completionTime: formatDate(data.completionTime),
  //     documents: [...details],
  //   };
  // };

  // Tạo option của Radio Group
  const eligibleForSignings = [
    { id: 0, name: t('fields.isNotEligibleForSigning') },
    { id: 1, name: t('fields.isEligibleForSigning') },
  ];

  // Render tùy option của Radio Group
  const renderRadioGroupItem = (item: { id: number; name: string }) => {
    return (
      <div className="my-2 flex flex-col items-center justify-center">
        <FormLabel name={item.name} htmlFor={item.name}>
          {item.name}
        </FormLabel>
      </div>
    );
  };

  // Server đang lưu giá trị boolean nên tạm thời chuyển đổi từ số sang boolean
  const onValueChanged = (value: any) => {
    if (value == 0) {
      setNotEligibleForSigning(true);
      setEligibleForSigning(false);
    } else {
      setNotEligibleForSigning(false);
      setEligibleForSigning(true);
    }
  };

  // Set check mặc định cho Radio Group
  const defaultEligibleForSigningCheck = () => {
    if (editId === 'new') {
      setNotEligibleForSigning(true);
    }
    return isNotEligibleForSigning ? eligibleForSignings[0].id : eligibleForSignings[1].id;
  };

  //End: In phiếu

  return (
    <>
      <Form {...methods}>
        <form autoComplete="off">
          <PageLayout
            onSaveChange={e => {
              void handleSubmitPromise(
                e.event?.currentTarget as unknown as SyntheticEvent<HTMLElement>
              );
            }}
            fieldsPlanningDepartment={fieldsPlanningDepartment}
            header={editId !== 'new' ? t('page.form.edit') : t('page.form.addNew')}
            canSaveChange={!isNaN(Number(editId)) ? role?.isUpdate : role?.isCreate}
            isSaving={loading}
            onCancel={goBackToList}
            onDelete={editId !== 'new' ? onDelete : undefined}
            customElementLeft={
              <>
                <Button
                  text={t('content.createNew', { ns: 'common' })}
                  className="uppercase"
                  stylingMode="outlined"
                  type="default"
                  icon="plus"
                  onClick={onCreateNew}
                />
              </>
            }
          >
            <div className="mt-2">
              <Tabs defaultValue="detail">
                <div className="w-full">
                  <TabsList>
                    {/* Tab: quản lý công việc */}
                    <TabsTrigger value="detail">{t('page.form.tabs.detail')}</TabsTrigger>
                    {/* Tab: hồ sơ đính kèm */}
                    <TabsTrigger value="attachment">{t('page.form.tabs.attachment')}</TabsTrigger>
                  </TabsList>
                </div>

                {/* Tab content: Quản lý công việc */}
                <TabsContent value="detail" className="mt-2">
                  <br></br>
                  <div className="grid max-w-full grid-cols-24 gap-x-8 gap-y-4">
                    {/* dòng 1 */}
                    <div className="col-span-24">
                      <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                        {/* dự án */}
                        <div className="col-span-10 flex items-center">
                          <FormLabel name="projectId" htmlFor="projectId" className="w-[100px]">
                            {t('fields.projectId')}
                          </FormLabel>
                          <FormField
                            id="projectId"
                            name={'projectId'}
                            className="flex-1 md:w-[500px]"
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

                        <div className="col-span-6 flex items-center">
                          {/* ngày gửi */}
                          <FormLabel htmlFor="contractTaskManagementTime" className="w-[100px]">
                            {t('fields.contractTaskManagementTime')}
                          </FormLabel>
                          <FormField
                            id="contractTaskManagementTime"
                            name={'contractTaskManagementTime'}
                            className="flex-1 md:w-[250px]"
                            type="date"
                            onChange={e => onTimeChange(e.target.value)}
                          >
                            <DateBox
                              placeholder={`${enterLabel} ${t('fields.contractTaskManagementTime')}`}
                            />
                          </FormField>
                        </div>
                        <div className="col-span-6 flex items-center"></div>
                      </div>
                    </div>

                    {/* dòng 2 */}
                    <div className="col-span-24">
                      <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                        {/* Phòng QLDA */}
                        <div className="col-span-6 flex items-center">
                          <FormLabel
                            name="projectManagementDepartmentId"
                            htmlFor="projectManagementDepartmentId"
                            className="w-[100px]"
                          >
                            {t('fields.projectManagementDepartmentId')}
                          </FormLabel>
                          <FormField
                            id="projectManagementDepartmentId"
                            name={'projectManagementDepartmentId'}
                            className="flex-1 md:w-[250px]"
                          >
                            <FormCombobox
                              model="department"
                              queryKey={[QUERIES.DEPARTMENT]}
                              placeholder={`${selectLabel} ${t('fields.projectManagementDepartmentId')}`}
                            />
                          </FormField>
                        </div>

                        <div className="col-span-4 flex items-center"></div>
                        {/* Mã phiếu*/}
                        <div className="col-span-6 flex items-center">
                          <FormLabel htmlFor="code" className="w-[100px]">
                            {t('fields.code')}
                          </FormLabel>
                          <FormField id="code" name={'code'} className="flex-1 md:w-[250px]">
                            <TextBox
                              placeholder={`${enterLabel} ${t('fields.code')}`}
                              readOnly={true}
                            />
                          </FormField>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-24">
                      <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                        {/* GĐ.QLDA */}
                        <div className="col-span-6 flex items-center">
                          <FormLabel
                            name="projectManagementDirectorId"
                            htmlFor="projectManagementDirectorId"
                            className="w-[100px]"
                          >
                            {t('fields.projectManagementDirectorId')}
                          </FormLabel>
                          <FormField
                            id="projectManagementDirectorId"
                            name={'projectManagementDirectorId'}
                            className="flex-1 md:w-[250px]"
                          >
                            <FormCombobox
                              model="user"
                              queryKey={[QUERIES.USERS]}
                              placeholder={`${selectLabel} ${t('fields.projectManagementDirectorId')}`}
                            />
                          </FormField>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-24">
                      <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                        {/* Ghi chú */}
                        <div className="col-span-10 flex items-center">
                          <FormLabel htmlFor="note" className="w-[100px]">
                            {t('fields.note')}
                          </FormLabel>
                          <FormField id="note" name={'note'} className="flex-1 md:w-[500px]">
                            <TextBox placeholder={`${enterLabel} ${t('fields.note')}`} />
                          </FormField>
                        </div>
                      </div>
                    </div>
                  </div>

                  {fieldsProjectDepartment.map((item, index) => {
                    return (
                      <>
                        <div className="grid max-w-full grid-cols-24 gap-x-8 gap-y-4" key={item.id}>
                          <div className="col-span-24">
                            <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                              {/* Nội dung thay đổi lần: */}
                              <div className="col-span-10 flex items-center">
                                <FormLabel htmlFor="revisedNumber" className="w-[150px]">
                                  {index > 0 && (
                                    <>
                                      <br />
                                      <br />
                                      {`Nội dung thay đổi lần: ${index}`}
                                    </>
                                  )}
                                </FormLabel>
                              </div>
                              <div hidden>
                                <FormField
                                  id={`contractTaskManagementProjectDepartments.${index}.revisedNumber`}
                                  name={`contractTaskManagementProjectDepartments.${index}.revisedNumber`}
                                  className="flex-1 md:w-[500px]"
                                >
                                  <InputNumber
                                    placeholder={`${enterLabel} ${t('fields.contractTaskManagementProjectDepartments.revisedNumber')}`}
                                    value={index}
                                  />
                                </FormField>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-24">
                            <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                              {/* Nội dung trình*/}
                              <div className="col-span-10 flex items-center">
                                <FormLabel htmlFor="submissionContent" className="w-[100px]">
                                  {t(
                                    'fields.contractTaskManagementProjectDepartments.submissionContent'
                                  )}
                                </FormLabel>
                                <FormField
                                  id={`contractTaskManagementProjectDepartments.${index}.submissionContent`}
                                  name={`contractTaskManagementProjectDepartments.${index}.submissionContent`}
                                  className="flex-1 md:w-[500px]"
                                >
                                  <TextArea
                                    autoResizeEnabled={true}
                                    placeholder={`${enterLabel} ${t('fields.contractTaskManagementProjectDepartments.submissionContent')}`}
                                    readOnly={!fieldsProjectDepartment[index]?.isSaveTmp}
                                  />
                                </FormField>
                              </div>

                              {/* Ý kiến TP.QLDA*/}
                              <div className="col-span-10 flex items-center">
                                <FormLabel htmlFor="departmentHeadOpinion" className="w-[100px]">
                                  {t(
                                    'fields.contractTaskManagementProjectDepartments.departmentHeadOpinion'
                                  )}
                                </FormLabel>
                                <FormField
                                  id={`contractTaskManagementProjectDepartments.${index}.departmentHeadOpinion`}
                                  name={`contractTaskManagementProjectDepartments.${index}.departmentHeadOpinion`}
                                  className="flex-1 md:w-[500px]"
                                >
                                  <TextArea
                                    autoResizeEnabled={true}
                                    placeholder={`${enterLabel} ${t('fields.contractTaskManagementProjectDepartments.departmentHeadOpinion')}`}
                                    readOnly={
                                      !(
                                        fieldsProjectDepartment[index]?.isSaveTmp === false &&
                                        fieldsProjectDepartment[index]?.isApprove === null
                                      )
                                    }
                                  />
                                </FormField>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-24">
                            <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                              {/* Ý kiến Ý kiến GĐ QLDA*/}
                              <div className="col-span-10 flex items-center">
                                <FormLabel htmlFor="directorOpinion" className="w-[100px]">
                                  {t(
                                    'fields.contractTaskManagementProjectDepartments.directorOpinion'
                                  )}
                                </FormLabel>
                                <FormField
                                  id={`contractTaskManagementProjectDepartments.${index}.directorOpinion`}
                                  name={`contractTaskManagementProjectDepartments.${index}.directorOpinion`}
                                  className="flex-1 md:w-[500px]"
                                >
                                  <TextArea
                                    autoResizeEnabled={true}
                                    placeholder={`${enterLabel} ${t('fields.contractTaskManagementProjectDepartments.directorOpinion')}`}
                                    readOnly={!fieldsProjectDepartment[index]?.isSaveTmp}
                                  />
                                </FormField>
                              </div>

                              {/* Duyệt */}

                              {fieldsProjectDepartment[index]?.isSaveTmp === false &&
                                fieldsProjectDepartment[index]?.isApprove === null && (
                                  <div className="col-span-10 flex items-center justify-end space-x-4">
                                    <Button
                                      id={`contractTaskManagementProjectDepartments.${index}.isApprove`}
                                      text="Đồng ý"
                                      className="uppercase"
                                      type="success"
                                      icon="check"
                                      onClick={e => {
                                        // Lấy dữ liệu hiện tại từ form
                                        const currentValues = methods.getValues(
                                          'contractTaskManagementProjectDepartments'
                                        );

                                        // Cập nhật giá trị `isApprove` cho phần tử có index hiện tại và thêm phần tử mới vào mảng
                                        const updatedValues = currentValues.map((item, idx) =>
                                          idx === index
                                            ? {
                                                ...item,
                                                isApprove: true,
                                                userApproveId: user?.userId,
                                                approveTime: new Date(),
                                              }
                                            : item
                                        );

                                        // Cập nhật lại giá trị vào form một lần duy nhất
                                        methods.setValue(
                                          'contractTaskManagementProjectDepartments',
                                          [...updatedValues]
                                        );

                                        // Gửi thông báo cho trường phòng tài chính và cán bộ phụ trách(nếu có)
                                        void handleSubmitPromise(
                                          e.event
                                            ?.currentTarget as unknown as SyntheticEvent<HTMLElement>
                                        ).then(data => {
                                          const newData = data as ContractTaskManagementResponse;
                                          if (newData.departmentFinanceHeadId) {
                                            sendNotify({
                                              title: t('contractTaskManagement.new', {
                                                ns: 'sendNotification',
                                              }),
                                              content: newData.projectName || '',
                                              typeNotification: PATHS.CONTRACT_TASK_MANAGEMENT,
                                              refId: Number(newData.id) || null,
                                              userIds: [newData.departmentFinanceHeadId],
                                            });
                                          }
                                          if (
                                            newData.contractTaskManagementFinanceDepartments[0]
                                              .assignedUserId
                                          ) {
                                            sendNotify({
                                              title: t('contractTaskManagement.new', {
                                                ns: 'sendNotification',
                                              }),
                                              content: newData.projectName || '',
                                              typeNotification: PATHS.CONTRACT_TASK_MANAGEMENT,
                                              refId: Number(newData.id) || null,
                                              userIds: [
                                                newData.contractTaskManagementFinanceDepartments[0]
                                                  .assignedUserId,
                                              ],
                                            });
                                          }
                                        });
                                      }}
                                    />
                                    <Button
                                      id={`contractTaskManagementProjectDepartments.${index}.isNotApprove`}
                                      text="Từ chối"
                                      className="uppercase"
                                      type="danger"
                                      icon="close"
                                      onClick={e => {
                                        // Lấy dữ liệu hiện tại từ form
                                        const currentValues = methods.getValues(
                                          'contractTaskManagementProjectDepartments'
                                        );

                                        // Cập nhật giá trị `isApprove` cho phần tử có index hiện tại và thêm phần tử mới vào mảng
                                        const updatedValues = currentValues.map((item, idx) =>
                                          idx === index
                                            ? {
                                                ...item,
                                                isApprove: false,
                                                userApproveId: user?.userId,
                                                approveTime: new Date(),
                                              }
                                            : item
                                        );

                                        // Thêm phần tử mới vào mảng sau khi cập nhật giá trị `isApprove`
                                        const newDepartment = {
                                          ...defaultValuesContractTaskManagement
                                            .contractTaskManagementProjectDepartments[0],
                                          id: -getRandomNumber(),
                                        };

                                        // Cập nhật lại giá trị vào form một lần duy nhất
                                        methods.setValue(
                                          'contractTaskManagementProjectDepartments',
                                          [...updatedValues, newDepartment]
                                        );

                                        // Gửi thông báo cho Giám đốc quản lý dự án
                                        void handleSubmitPromise(
                                          e.event
                                            ?.currentTarget as unknown as SyntheticEvent<HTMLElement>
                                        ).then(data => {
                                          const newData = data as ContractTaskManagementResponse;
                                          if (newData.projectManagementDirectorId) {
                                            sendNotify({
                                              title: t('contractTaskManagement.info', {
                                                ns: 'sendNotification',
                                              }),
                                              content:
                                                `${t('contractTaskManagement.departmentProjectHeadReject', { ns: 'sendNotification' })} ${newData.projectName}` ||
                                                '',
                                              typeNotification: PATHS.CONTRACT_TASK_MANAGEMENT,
                                              refId: Number(newData.id) || null,
                                              userIds: [newData.projectManagementDirectorId],
                                            });
                                          }
                                        });
                                      }}
                                    />
                                  </div>
                                )}
                            </div>
                          </div>

                          {fieldsProjectDepartment[index]?.isSaveTmp && (
                            <div className="col-span-24">
                              <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                                {/* Lưu và lưu tạm */}
                                <div className="col-span-10 flex items-center justify-end space-x-4">
                                  <Button
                                    id={`contractTaskManagementProjectDepartments.${index}.isApprove`}
                                    text="Lưu tạm"
                                    className="uppercase"
                                    type="default"
                                    icon="save"
                                    stylingMode="outlined"
                                    onClick={e => {
                                      void handleSubmitPromise(
                                        e.event
                                          ?.currentTarget as unknown as SyntheticEvent<HTMLElement>
                                      );
                                    }}
                                  />
                                  <Button
                                    id={`contractTaskManagementProjectDepartments.${index}.isNotApprove`}
                                    text="Lưu lại"
                                    className="uppercase"
                                    type="success"
                                    icon="save"
                                    onClick={e => {
                                      // Lấy dữ liệu hiện tại từ form
                                      const currentValues = methods.getValues(
                                        'contractTaskManagementProjectDepartments'
                                      );

                                      // Cập nhật giá trị `isSaveTmp` cho phần tử có index hiện tại
                                      const updatedValues = currentValues.map((item, idx) =>
                                        idx === index
                                          ? { ...item, isSaveTmp: false, revisedNumber: index }
                                          : item
                                      );

                                      // Cập nhật lại giá trị vào form
                                      methods.setValue(
                                        'contractTaskManagementProjectDepartments',
                                        updatedValues
                                      );
                                      // Gửi thông báo cho Trưởng phòng quản lý dự án
                                      void handleSubmitPromise(
                                        e.event
                                          ?.currentTarget as unknown as SyntheticEvent<HTMLElement>
                                      ).then(data => {
                                        const newData = data as ContractTaskManagementResponse;
                                        console.log('newData:', newData);
                                        if (newData.departmentProjectHeadId) {
                                          sendNotify({
                                            title: t(
                                              `${index === 0 ? 'contractTaskManagement.new' : 'contractTaskManagement.info'}`,
                                              {
                                                ns: 'sendNotification',
                                              }
                                            ),
                                            content:
                                              t('contractTaskManagement.content', {
                                                ns: 'sendNotification',
                                              }) + newData.projectName || '',
                                            typeNotification: PATHS.CONTRACT_TASK_MANAGEMENT,
                                            refId: Number(newData.id) || null,
                                            userIds: [newData.departmentProjectHeadId],
                                          });
                                        }
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })}

                  {/* Phòng tài chính tổng hợp */}
                  <div className="mt-8">
                    <Tabs defaultValue="financeDepartments">
                      <div className="w-full border-b border-[#e0e0e0]">
                        <TabsList>
                          <TabsTrigger value="financeDepartments">
                            {t('page.tabs.financeDepartments')}
                          </TabsTrigger>
                        </TabsList>
                      </div>
                      <TabsContent value="financeDepartments" className="mt-2">
                        {/*Phòng tài chính tổng hợp:*/}
                        {fieldsFinanceDepartment.map((item, index) => {
                          return (
                            <>
                              <div
                                className="grid max-w-full grid-cols-24 gap-x-8 gap-y-4"
                                key={item.id}
                              >
                                <div className="col-span-24">
                                  <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                                    {/* Thày đổi lần thứ: */}
                                    <div className="col-span-16 flex items-center">
                                      <FormLabel htmlFor="revisedNumber" className="w-[1150px]">
                                        {index > 0 && (
                                          <>
                                            <br />
                                            <br />
                                            {`Nội dung thay đổi lần: ${index}`}
                                          </>
                                        )}
                                      </FormLabel>
                                    </div>
                                    <div hidden>
                                      <FormField
                                        id={`contractTaskManagementFinanceDepartments.${index}.revisedNumber`}
                                        name={`contractTaskManagementFinanceDepartments.${index}.revisedNumber`}
                                        className="flex-1 md:w-[500px]"
                                      >
                                        <InputNumber
                                          placeholder={`${enterLabel} ${t('fields.contractTaskManagementFinanceDepartments.revisedNumber')}`}
                                          value={index}
                                        />
                                      </FormField>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-span-24">
                                  <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                                    {/* Ngày nhận HS*/}
                                    <div className="col-span-6 flex items-center">
                                      <FormLabel htmlFor="receivedTime" className="w-[100px]">
                                        {t(
                                          'fields.contractTaskManagementFinanceDepartments.receivedTime'
                                        )}
                                      </FormLabel>
                                      <FormField
                                        id={`contractTaskManagementFinanceDepartments.${index}.receivedTime`}
                                        name={`contractTaskManagementFinanceDepartments.${index}.receivedTime`}
                                        className="flex-1 md:w-[250px]"
                                        type="date"
                                      >
                                        <DateBox
                                          placeholder={`${enterLabel} ${t('fields.contractTaskManagementFinanceDepartments.receivedTime')}`}
                                          disabled={
                                            !(
                                              fieldsFinanceDepartment[index]?.isSaveTmp == null ||
                                              (fieldsProjectDepartment
                                                ?.slice()
                                                .reverse()
                                                .find(item => item?.isApprove === true) &&
                                                fieldsFinanceDepartment[index]?.isSaveTmp == true)
                                            )
                                          }
                                        />
                                      </FormField>
                                    </div>
                                    <div className="col-span-4 flex items-center"></div>

                                    {/* Ý kiến TP.TC-TH*/}
                                    <div className="col-span-10 flex items-center">
                                      <FormLabel
                                        htmlFor="departmentHeadOpinion"
                                        className="w-[100px]"
                                      >
                                        {t(
                                          'fields.contractTaskManagementFinanceDepartments.departmentHeadOpinion'
                                        )}
                                      </FormLabel>
                                      <FormField
                                        id={`contractTaskManagementFinanceDepartments.${index}.departmentHeadOpinion`}
                                        name={`contractTaskManagementFinanceDepartments.${index}.departmentHeadOpinion`}
                                        className="flex-1 md:w-[500px]"
                                      >
                                        <TextArea
                                          autoResizeEnabled={true}
                                          placeholder={`${enterLabel} ${t('fields.contractTaskManagementFinanceDepartments.departmentHeadOpinion')}`}
                                          readOnly={
                                            !(
                                              fieldsFinanceDepartment[index]?.isSaveTmp === false &&
                                              fieldsFinanceDepartment[index]?.isApprove === null
                                            )
                                          }
                                        />
                                      </FormField>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-span-24">
                                  <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                                    {/* Ngày hoàn thành */}
                                    <div className="col-span-6 flex items-center">
                                      <FormLabel
                                        htmlFor="contractTaskManagementFinanceDepartments.completionTime"
                                        className="w-[100px]"
                                      >
                                        {t(
                                          'fields.contractTaskManagementFinanceDepartments.completionTime'
                                        )}
                                      </FormLabel>
                                      <FormField
                                        id={`contractTaskManagementFinanceDepartments.${index}.completionTime`}
                                        name={`contractTaskManagementFinanceDepartments.${index}.completionTime`}
                                        className="flex-1 md:w-[250px]"
                                        type="date"
                                      >
                                        <DateBox
                                          placeholder={`${enterLabel} ${t('fields.contractTaskManagementFinanceDepartments.completionTime')}`}
                                          disabled={
                                            !(
                                              fieldsFinanceDepartment[index]?.isSaveTmp == null ||
                                              (fieldsProjectDepartment
                                                ?.slice()
                                                .reverse()
                                                .find(item => item?.isApprove === true) &&
                                                fieldsFinanceDepartment[index]?.isSaveTmp == true)
                                            )
                                          }
                                        />
                                      </FormField>
                                    </div>
                                    <div className="col-span-4 flex items-center"></div>
                                    {/* đồng ý và từ chối*/}
                                    {fieldsFinanceDepartment[index]?.isSaveTmp === false &&
                                      fieldsFinanceDepartment[index]?.isApprove === null && (
                                        <div className="col-span-10 flex items-center justify-end space-x-4">
                                          <Button
                                            id={`contractTaskManagementFinanceDepartments.${index}.isApprove`}
                                            text="Đồng ý"
                                            className="uppercase"
                                            type="success"
                                            icon="check"
                                            onClick={e => {
                                              // Lấy dữ liệu hiện tại từ form
                                              const currentValues = methods.getValues(
                                                'contractTaskManagementFinanceDepartments'
                                              );

                                              // Cập nhật giá trị `isApprove` cho phần tử có index hiện tại và thêm phần tử mới vào mảng
                                              const updatedValues = currentValues.map(
                                                (item, idx) =>
                                                  idx === index
                                                    ? {
                                                        ...item,
                                                        isApprove: true,
                                                        userApproveId: user?.userId,
                                                        approveTime: new Date(),
                                                      }
                                                    : item
                                              );

                                              // Cập nhật lại giá trị vào form một lần duy nhất
                                              methods.setValue(
                                                'contractTaskManagementFinanceDepartments',
                                                [...updatedValues]
                                              );

                                              // Nhấn đồng ý gửi thông báo trưởng phòng kế hoạch chất lượng và cán bộ phụ trách(nếu có)
                                              void handleSubmitPromise(
                                                e.event
                                                  ?.currentTarget as unknown as SyntheticEvent<HTMLElement>
                                              ).then(data => {
                                                const newData =
                                                  data as ContractTaskManagementResponse;
                                                //trưởng phòng
                                                if (newData.departmentPlanningHeadId) {
                                                  sendNotify({
                                                    title: t('contractTaskManagement.new', {
                                                      ns: 'sendNotification',
                                                    }),
                                                    content: newData.projectName || '',
                                                    typeNotification:
                                                      PATHS.CONTRACT_TASK_MANAGEMENT,
                                                    refId: Number(newData.id) || null,
                                                    userIds: [newData.departmentPlanningHeadId],
                                                  });
                                                }
                                                //cán bộ phụ trách(nếu có)
                                                if (
                                                  newData
                                                    .contractTaskManagementPlanningDepartments[0]
                                                    .assignedUserId
                                                ) {
                                                  sendNotify({
                                                    title: t('contractTaskManagement.new', {
                                                      ns: 'sendNotification',
                                                    }),
                                                    content: newData.projectName || '',
                                                    typeNotification:
                                                      PATHS.CONTRACT_TASK_MANAGEMENT,
                                                    refId: Number(newData.id) || null,
                                                    userIds: [
                                                      newData
                                                        .contractTaskManagementPlanningDepartments[0]
                                                        .assignedUserId,
                                                    ],
                                                  });
                                                }
                                              });
                                            }}
                                          />
                                          <Button
                                            id={`contractTaskManagementFinanceDepartments.${index}.isNotApprove`}
                                            text="Từ chối"
                                            className="uppercase"
                                            type="danger"
                                            icon="close"
                                            onClick={e => {
                                              // Lấy dữ liệu hiện tại từ form
                                              const currentValues = methods.getValues(
                                                'contractTaskManagementFinanceDepartments'
                                              );

                                              // Cập nhật giá trị `isApprove` cho phần tử có index hiện tại và thêm phần tử mới vào mảng
                                              const updatedValues = currentValues.map(
                                                (item, idx) =>
                                                  idx === index
                                                    ? {
                                                        ...item,
                                                        isApprove: false,
                                                        userApproveId: user?.userId,
                                                        approveTime: new Date(),
                                                      }
                                                    : item
                                              );

                                              // Thêm phần tử mới vào mảng sau khi cập nhật giá trị `isApprove`
                                              const newDepartment = {
                                                ...defaultValuesContractTaskManagement
                                                  .contractTaskManagementFinanceDepartments[0],
                                                assignedUserId: updatedValues[index].assignedUserId,
                                                id: -getRandomNumber(),
                                              };

                                              // Cập nhật lại giá trị vào form một lần duy nhất
                                              methods.setValue(
                                                'contractTaskManagementFinanceDepartments',
                                                [...updatedValues, newDepartment]
                                              );

                                              //Nhấn từ chối gửi thông báo cho cán bộ tài chính tổng hợp
                                              void handleSubmitPromise(
                                                e.event
                                                  ?.currentTarget as unknown as SyntheticEvent<HTMLElement>
                                              ).then(data => {
                                                const newData =
                                                  data as ContractTaskManagementResponse;

                                                if (
                                                  newData
                                                    .contractTaskManagementFinanceDepartments[0]
                                                    .assignedUserId
                                                ) {
                                                  sendNotify({
                                                    title: t('contractTaskManagement.info', {
                                                      ns: 'sendNotification',
                                                    }),
                                                    content:
                                                      `${t('contractTaskManagement.departmentFinanceHeadReject', { ns: 'sendNotification' })} ${newData.projectName}` ||
                                                      '',
                                                    typeNotification:
                                                      PATHS.CONTRACT_TASK_MANAGEMENT,
                                                    refId: Number(newData.id) || null,
                                                    userIds: [
                                                      newData
                                                        .contractTaskManagementFinanceDepartments[0]
                                                        .assignedUserId,
                                                    ],
                                                  });
                                                }
                                              });
                                            }}
                                          />
                                        </div>
                                      )}
                                  </div>
                                </div>

                                <div className="col-span-24">
                                  <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                                    {/* Giao CB.P.TC-TH */}
                                    <div className="col-span-6 flex items-center">
                                      <FormLabel
                                        name="assignedUserId"
                                        htmlFor="assignedUserId"
                                        className="w-[100px]"
                                      >
                                        {t(
                                          'fields.contractTaskManagementFinanceDepartments.assignedUserId'
                                        )}
                                      </FormLabel>
                                      <FormField
                                        id={`contractTaskManagementFinanceDepartments.${index}.assignedUserId`}
                                        name={`contractTaskManagementFinanceDepartments.${index}.assignedUserId`}
                                        className="flex-1 md:w-[250px]"
                                      >
                                        <FormCombobox
                                          model="user"
                                          queryKey={[QUERIES.USERS]}
                                          placeholder={`${selectLabel} ${t('fields.contractTaskManagementFinanceDepartments.assignedUserId')}`}
                                          // disabled={
                                          //   !(
                                          //     fieldsFinanceDepartment[index]?.isSaveTmp == null ||
                                          //     (fieldsProjectDepartment
                                          //       ?.slice()
                                          //       .reverse()
                                          //       .find(item => item?.isApprove === true) &&
                                          //       fieldsFinanceDepartment[index]?.isSaveTmp == true &&
                                          //       (fieldsFinanceDepartment[index]?.assignedUserId ??
                                          //         0) > 0)
                                          //   )
                                          // }
                                          disabled
                                        />
                                      </FormField>
                                    </div>
                                    {/* dialog xử lý chọn: Giao CB.P.TC-TH */}
                                    {(fieldsFinanceDepartment[index]?.assignedUserId ?? 0) == 0 && (
                                      <Button
                                        className="mt-1 !rounded-[5%]"
                                        stylingMode="contained"
                                        type="default"
                                        icon="edit"
                                        onClick={toggleEditDialogFinanceDepartments}
                                        text=""
                                        width={10}
                                      />
                                    )}

                                    <BasicDialog
                                      className="w-auto"
                                      open={isEditDialogOpenFinanceDepartments}
                                      toggle={toggleEditDialogFinanceDepartments}
                                      title={t('page.form.edit')}
                                    >
                                      <div className="flex items-center lg:col-span-2">
                                        {/*  Giao CB.P.TC-TH */}
                                        <FormLabel name="assignedUserId" htmlFor="assignedUserId">
                                          {t(
                                            'fields.contractTaskManagementFinanceDepartments.assignedUserId'
                                          )}
                                        </FormLabel>
                                        <FormField
                                          id={`contractTaskManagementFinanceDepartments.${index}.assignedUserId`}
                                          name={`contractTaskManagementFinanceDepartments.${index}.assignedUserId`}
                                          className=" flex-1"
                                        >
                                          <FormCombobox
                                            model="user"
                                            queryKey={[QUERIES.USERS]}
                                            placeholder={`${selectLabel} ${t('fields.contractTaskManagementFinanceDepartments.assignedUserId')}`}
                                            disabled={
                                              !(
                                                fieldsFinanceDepartment[index]?.isSaveTmp == null ||
                                                (fieldsProjectDepartment
                                                  ?.slice()
                                                  .reverse()
                                                  .find(item => item?.isApprove === true) &&
                                                  fieldsFinanceDepartment[index]?.isSaveTmp == true)
                                              )
                                            }
                                          />
                                        </FormField>
                                      </div>
                                      <div className="mt-4 flex items-end justify-end lg:col-span-2">
                                        {/* Xác nhận */}
                                        <Button
                                          id={`contractTaskManagementFinanceDepartments.${index}.isApprove`}
                                          text="Xác nhận"
                                          className="uppercase"
                                          type="default"
                                          icon="save"
                                          onClick={e => {
                                            //Gửi thông báo cho cán bộ tài chính tổng hợp được chọn
                                            void handleSubmitPromise(
                                              e.event
                                                ?.currentTarget as unknown as SyntheticEvent<HTMLElement>
                                            ).then(data => {
                                              const newData =
                                                data as ContractTaskManagementResponse;

                                              if (
                                                newData.contractTaskManagementFinanceDepartments[0]
                                                  .assignedUserId
                                              ) {
                                                sendNotify({
                                                  title: t('contractTaskManagement.new', {
                                                    ns: 'sendNotification',
                                                  }),
                                                  content:
                                                    t('contractTaskManagement.addNew', {
                                                      ns: 'sendNotification',
                                                    }) + newData.projectName || '',
                                                  typeNotification: PATHS.CONTRACT_TASK_MANAGEMENT,
                                                  refId: Number(newData.id) || null,
                                                  userIds: [
                                                    newData
                                                      .contractTaskManagementFinanceDepartments[0]
                                                      .assignedUserId,
                                                  ],
                                                });
                                              }
                                            });
                                          }}
                                        />
                                      </div>
                                    </BasicDialog>
                                    <div className="col-span-4 flex items-center"></div>
                                  </div>
                                </div>

                                <div className="col-span-24">
                                  <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                                    {/* Ý kiến*/}
                                    <div className="col-span-10 flex items-center">
                                      <FormLabel htmlFor="opinion" className="w-[100px]">
                                        {t(
                                          'fields.contractTaskManagementFinanceDepartments.opinion'
                                        )}
                                      </FormLabel>
                                      <FormField
                                        id={`contractTaskManagementFinanceDepartments.${index}.opinion`}
                                        name={`contractTaskManagementFinanceDepartments.${index}.opinion`}
                                        className="flex-1 md:w-[500px]"
                                      >
                                        <TextArea
                                          autoResizeEnabled={true}
                                          placeholder={`${enterLabel} ${t('fields.contractTaskManagementFinanceDepartments.opinion')}`}
                                          readOnly={
                                            !(
                                              fieldsFinanceDepartment[index]?.isSaveTmp == null ||
                                              (fieldsProjectDepartment
                                                ?.slice()
                                                .reverse()
                                                .find(item => item?.isApprove === true) &&
                                                fieldsFinanceDepartment[index]?.isSaveTmp == true)
                                            )
                                          }
                                        />
                                      </FormField>
                                    </div>
                                  </div>
                                </div>

                                {fieldsFinanceDepartment[index]?.isSaveTmp == null ||
                                  (fieldsProjectDepartment
                                    ?.slice()
                                    .reverse()
                                    .find(item => item?.isApprove === true) &&
                                    fieldsFinanceDepartment[index]?.isSaveTmp == true && (
                                      <div className="col-span-24">
                                        <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                                          {/* Lưu và lưu tạm */}
                                          <div className="col-span-10 flex items-center justify-end space-x-4">
                                            <Button
                                              id={`contractTaskManagementFinanceDepartments.${index}.isApprove`}
                                              text="Lưu tạm"
                                              className="uppercase"
                                              type="default"
                                              icon="save"
                                              stylingMode="outlined"
                                              onClick={e => {
                                                void handleSubmitPromise(
                                                  e.event
                                                    ?.currentTarget as unknown as SyntheticEvent<HTMLElement>
                                                );
                                              }}
                                            />
                                            <Button
                                              id={`contractTaskManagementFinanceDepartments.${index}.isNotApprove`}
                                              text="Lưu lại"
                                              className="uppercase"
                                              type="success"
                                              icon="save"
                                              onClick={e => {
                                                // Lấy dữ liệu hiện tại từ form
                                                const currentValues = methods.getValues(
                                                  'contractTaskManagementFinanceDepartments'
                                                );

                                                // Cập nhật giá trị `isSaveTmp` cho phần tử có index hiện tại
                                                const updatedValues = currentValues.map(
                                                  (item, idx) =>
                                                    idx === index
                                                      ? {
                                                          ...item,
                                                          isSaveTmp: false,
                                                          revisedNumber: index,
                                                        }
                                                      : item
                                                );

                                                // Cập nhật lại giá trị vào form
                                                methods.setValue(
                                                  'contractTaskManagementFinanceDepartments',
                                                  updatedValues
                                                );

                                                //Gửi thông báo cho trưởng phòng tài chính tổng hợp
                                                void handleSubmitPromise(
                                                  e.event
                                                    ?.currentTarget as unknown as SyntheticEvent<HTMLElement>
                                                ).then(data => {
                                                  const newData =
                                                    data as ContractTaskManagementResponse;

                                                  if (newData.departmentFinanceHeadId) {
                                                    sendNotify({
                                                      title: t(
                                                        `${index === 0 ? 'contractTaskManagement.new' : 'contractTaskManagement.info'}`,
                                                        {
                                                          ns: 'sendNotification',
                                                        }
                                                      ),
                                                      content:
                                                        t('contractTaskManagement.content', {
                                                          ns: 'sendNotification',
                                                        }) + newData.projectName || '',
                                                      typeNotification:
                                                        PATHS.CONTRACT_TASK_MANAGEMENT,
                                                      refId: Number(newData.id) || null,
                                                      userIds: [newData.departmentFinanceHeadId],
                                                    });
                                                  }
                                                });
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                              </div>
                            </>
                          );
                        })}
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Kế hoạch chất lượng */}
                  <div className="mt-8">
                    <Tabs defaultValue="planningDepartments">
                      <div className="w-full border-b border-[#e0e0e0]">
                        <TabsList>
                          <TabsTrigger value="planningDepartments">
                            {t('page.tabs.planningDepartments')}
                          </TabsTrigger>
                        </TabsList>
                      </div>
                      <TabsContent value="planningDepartments" className="mt-2">
                        {/* Kế hoạch chất lượng */}
                        {fieldsPlanningDepartment?.map((item, index) => {
                          return (
                            <>
                              <div
                                className="grid max-w-full grid-cols-24 gap-x-8 gap-y-4"
                                key={item.id}
                              >
                                <div className="col-span-24">
                                  <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                                    {/* Thày đổi lần thứ: */}
                                    <div className="col-span-16 flex items-center">
                                      <FormLabel htmlFor="revisedNumber" className="w-[1150px]">
                                        {index > 0 && (
                                          <>
                                            <br />
                                            <br />
                                            {`Nội dung thay đổi lần: ${index}`}
                                          </>
                                        )}
                                      </FormLabel>
                                    </div>
                                    <div hidden>
                                      <FormField
                                        id={`contractTaskManagementPlanningDepartments.${index}.revisedNumber`}
                                        name={`contractTaskManagementPlanningDepartments.${index}.revisedNumber`}
                                        className="flex-1 md:w-[500px]"
                                      >
                                        <InputNumber
                                          placeholder={`${enterLabel} ${t('fields.contractTaskManagementPlanningDepartments.revisedNumber')}`}
                                          value={index}
                                        />
                                      </FormField>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-span-24">
                                  <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                                    {/* Ngày nhận HS*/}
                                    <div className="col-span-6 flex items-center">
                                      <FormLabel htmlFor="receivedTime" className="w-[100px]">
                                        {t(
                                          'fields.contractTaskManagementPlanningDepartments.receivedTime'
                                        )}
                                      </FormLabel>
                                      <FormField
                                        id={`contractTaskManagementPlanningDepartments.${index}.receivedTime`}
                                        name={`contractTaskManagementPlanningDepartments.${index}.receivedTime`}
                                        className="flex-1 md:w-[250px]"
                                        type="date"
                                      >
                                        <DateBox
                                          placeholder={`${enterLabel} ${t('fields.contractTaskManagementPlanningDepartments.receivedTime')}`}
                                          disabled={
                                            !(
                                              fieldsPlanningDepartment[index]?.isSaveTmp == null ||
                                              (fieldsFinanceDepartment
                                                ?.slice()
                                                .reverse()
                                                .find(item => item?.isApprove === true) &&
                                                fieldsPlanningDepartment[index]?.isSaveTmp == true)
                                            )
                                          }
                                        />
                                      </FormField>
                                    </div>
                                    <div className="col-span-4 flex items-center"></div>

                                    {/* Ý kiến TP.TC-TH*/}
                                    <div className="col-span-10 flex items-center">
                                      <FormLabel
                                        htmlFor="departmentHeadOpinion"
                                        className="w-[100px]"
                                      >
                                        {t(
                                          'fields.contractTaskManagementPlanningDepartments.departmentHeadOpinion'
                                        )}
                                      </FormLabel>
                                      <FormField
                                        id={`contractTaskManagementPlanningDepartments.${index}.departmentHeadOpinion`}
                                        name={`contractTaskManagementPlanningDepartments.${index}.departmentHeadOpinion`}
                                        className="flex-1 md:w-[500px]"
                                      >
                                        <TextArea
                                          autoResizeEnabled={true}
                                          placeholder={`${enterLabel} ${t('fields.contractTaskManagementPlanningDepartments.departmentHeadOpinion')}`}
                                          readOnly={
                                            !(
                                              fieldsPlanningDepartment[index]?.isSaveTmp ===
                                                false &&
                                              fieldsPlanningDepartment[index]?.isApprove === null
                                            )
                                          }
                                        />
                                      </FormField>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-span-24">
                                  <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                                    {/* Ngày hoàn thành */}
                                    <div className="col-span-6 flex items-center">
                                      <FormLabel
                                        htmlFor="contractTaskManagementPlanningDepartments.completionTime"
                                        className="w-[100px]"
                                      >
                                        {t(
                                          'fields.contractTaskManagementPlanningDepartments.completionTime'
                                        )}
                                      </FormLabel>
                                      <FormField
                                        id={`contractTaskManagementPlanningDepartments.${index}.completionTime`}
                                        name={`contractTaskManagementPlanningDepartments.${index}.completionTime`}
                                        className="flex-1 md:w-[250px]"
                                        type="date"
                                      >
                                        <DateBox
                                          placeholder={`${enterLabel} ${t('fields.contractTaskManagementPlanningDepartments.completionTime')}`}
                                          disabled={
                                            !(
                                              fieldsPlanningDepartment[index]?.isSaveTmp == null ||
                                              (fieldsFinanceDepartment
                                                ?.slice()
                                                .reverse()
                                                .find(item => item?.isApprove === true) &&
                                                fieldsPlanningDepartment[index]?.isSaveTmp == true)
                                            )
                                          }
                                        />
                                      </FormField>
                                    </div>
                                    <div className="col-span-4 flex items-center"></div>

                                    {/* đồng ý và từ chối*/}
                                    {fieldsPlanningDepartment[index]?.isSaveTmp === false &&
                                      fieldsPlanningDepartment[index]?.isApprove === null && (
                                        <div className="col-span-10 flex items-center justify-end space-x-4">
                                          <Button
                                            id={`contractTaskManagementPlanningDepartments.${index}.isApprove`}
                                            text="Đồng ý"
                                            className="uppercase"
                                            type="success"
                                            icon="check"
                                            onClick={e => {
                                              // Lấy dữ liệu hiện tại từ form
                                              const currentValues = methods.getValues(
                                                'contractTaskManagementPlanningDepartments'
                                              );

                                              // Cập nhật giá trị `isApprove` cho phần tử có index hiện tại và thêm phần tử mới vào mảng
                                              const updatedValues = currentValues.map(
                                                (item, idx) =>
                                                  idx === index
                                                    ? {
                                                        ...item,
                                                        isApprove: true,
                                                        userApproveId: user?.userId,
                                                        approveTime: new Date(),
                                                      }
                                                    : item
                                              );

                                              // Cập nhật lại giá trị vào form một lần duy nhất
                                              methods.setValue(
                                                'contractTaskManagementPlanningDepartments',
                                                [...updatedValues]
                                              );

                                              // Gọi void handleSubmitPromise
                                              void handleSubmitPromise(
                                                e.event
                                                  ?.currentTarget as unknown as SyntheticEvent<HTMLElement>
                                              );
                                            }}
                                          />
                                          <Button
                                            id={`contractTaskManagementPlanningDepartments.${index}.isNotApprove`}
                                            text="Từ chối"
                                            className="uppercase"
                                            type="danger"
                                            icon="close"
                                            onClick={e => {
                                              // Lấy dữ liệu hiện tại từ form
                                              const currentValues = methods.getValues(
                                                'contractTaskManagementPlanningDepartments'
                                              );

                                              // Cập nhật giá trị `isApprove` cho phần tử có index hiện tại và thêm phần tử mới vào mảng
                                              const updatedValues = currentValues.map(
                                                (item, idx) =>
                                                  idx === index
                                                    ? {
                                                        ...item,
                                                        isApprove: false,
                                                        userApproveId: user?.userId,
                                                        approveTime: new Date(),
                                                      }
                                                    : item
                                              );

                                              // Thêm phần tử mới vào mảng sau khi cập nhật giá trị `isApprove`
                                              const newDepartment = {
                                                ...defaultValuesContractTaskManagement
                                                  .contractTaskManagementPlanningDepartments[0],
                                                assignedUserId: updatedValues[index].assignedUserId,
                                                id: -getRandomNumber(),
                                              };

                                              // Cập nhật lại giá trị vào form một lần duy nhất
                                              methods.setValue(
                                                'contractTaskManagementPlanningDepartments',
                                                [...updatedValues, newDepartment]
                                              );

                                              //Gửi thông báo cho cán bộ phòng kế hoạch chất lượng
                                              void handleSubmitPromise(
                                                e.event
                                                  ?.currentTarget as unknown as SyntheticEvent<HTMLElement>
                                              ).then(data => {
                                                const newData =
                                                  data as ContractTaskManagementResponse;

                                                if (
                                                  newData
                                                    .contractTaskManagementPlanningDepartments[0]
                                                    .assignedUserId
                                                ) {
                                                  sendNotify({
                                                    title: t('contractTaskManagement.info', {
                                                      ns: 'sendNotification',
                                                    }),
                                                    content:
                                                      `${t('contractTaskManagement.departmentPlanningHeadReject', { ns: 'sendNotification' })} ${newData.projectName}` ||
                                                      '',
                                                    typeNotification:
                                                      PATHS.CONTRACT_TASK_MANAGEMENT,
                                                    refId: Number(newData.id) || null,
                                                    userIds: [
                                                      newData
                                                        .contractTaskManagementPlanningDepartments[0]
                                                        .assignedUserId,
                                                    ],
                                                  });
                                                }
                                              });
                                            }}
                                          />
                                        </div>
                                      )}
                                  </div>
                                </div>

                                <div className="col-span-24">
                                  <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                                    {/* Giao CB.P.TC-TH */}
                                    <div className="col-span-6 flex items-center">
                                      <FormLabel
                                        name="assignedUserId"
                                        htmlFor="assignedUserId"
                                        className="w-[100px]"
                                      >
                                        {t(
                                          'fields.contractTaskManagementPlanningDepartments.assignedUserId'
                                        )}
                                      </FormLabel>
                                      <FormField
                                        id={`contractTaskManagementPlanningDepartments.${index}.assignedUserId`}
                                        name={`contractTaskManagementPlanningDepartments.${index}.assignedUserId`}
                                        className="flex-1 md:w-[250px]"
                                      >
                                        <FormCombobox
                                          model="user"
                                          queryKey={[QUERIES.USERS]}
                                          placeholder={`${selectLabel} ${t('fields.contractTaskManagementPlanningDepartments.assignedUserId')}`}
                                          // disabled={
                                          //   !(
                                          //     fieldsPlanningDepartment[index]?.isSaveTmp == null ||
                                          //     (fieldsFinanceDepartment
                                          //       ?.slice()
                                          //       .reverse()
                                          //       .find(item => item?.isApprove === true) &&
                                          //       fieldsPlanningDepartment[index]?.isSaveTmp ==
                                          //         true &&
                                          //       (fieldsPlanningDepartment[index]?.assignedUserId ??
                                          //         0) > 0)
                                          //   )
                                          // }
                                          disabled
                                        />
                                      </FormField>
                                    </div>

                                    {/* dialog xử lý chọn: Giao CB.P.TC-TH */}
                                    {(fieldsPlanningDepartment[index]?.assignedUserId ?? 0) ==
                                      0 && (
                                      <Button
                                        className="mt-1 !rounded-[5%]"
                                        stylingMode="contained"
                                        type="default"
                                        icon="edit"
                                        onClick={toggleEditDialogPlanningDepartments}
                                        text=""
                                        width={10}
                                      />
                                    )}

                                    <BasicDialog
                                      className="w-auto"
                                      open={isEditDialogOpenPlanningDepartments}
                                      toggle={toggleEditDialogPlanningDepartments}
                                      title={t('page.form.edit')}
                                    >
                                      <div className="flex items-center lg:col-span-2">
                                        {/*  Giao CB.P.TC-TH */}
                                        <FormLabel name="assignedUserId" htmlFor="assignedUserId">
                                          {t(
                                            'fields.contractTaskManagementPlanningDepartments.assignedUserId'
                                          )}
                                        </FormLabel>
                                        <FormField
                                          id={`contractTaskManagementPlanningDepartments.${index}.assignedUserId`}
                                          name={`contractTaskManagementPlanningDepartments.${index}.assignedUserId`}
                                          className=" flex-1"
                                        >
                                          <FormCombobox
                                            model="user"
                                            queryKey={[QUERIES.USERS]}
                                            placeholder={`${selectLabel} ${t('fields.contractTaskManagementPlanningDepartments.assignedUserId')}`}
                                            disabled={
                                              !(
                                                fieldsPlanningDepartment[index]?.isSaveTmp ==
                                                  null ||
                                                (fieldsFinanceDepartment
                                                  ?.slice()
                                                  .reverse()
                                                  .find(item => item?.isApprove === true) &&
                                                  fieldsPlanningDepartment[index]?.isSaveTmp ==
                                                    true)
                                              )
                                            }
                                          />
                                        </FormField>
                                      </div>
                                      <div className="mt-4 flex items-end justify-end lg:col-span-2">
                                        {/* Xác nhận */}
                                        <Button
                                          id={`contractTaskManagementPlanningDepartments.${index}.isApprove`}
                                          text="Xác nhận"
                                          className="uppercase"
                                          type="default"
                                          icon="save"
                                          onClick={e => {
                                            //Gửi thông báo cho cán bộ phòng kế hoạch chất lượng được chọn
                                            void handleSubmitPromise(
                                              e.event
                                                ?.currentTarget as unknown as SyntheticEvent<HTMLElement>
                                            ).then(data => {
                                              const newData =
                                                data as ContractTaskManagementResponse;

                                              if (
                                                newData.contractTaskManagementPlanningDepartments[0]
                                                  .assignedUserId
                                              ) {
                                                sendNotify({
                                                  title: t('contractTaskManagement.new', {
                                                    ns: 'sendNotification',
                                                  }),
                                                  content:
                                                    t('contractTaskManagement.addNew', {
                                                      ns: 'sendNotification',
                                                    }) + newData.projectName || '',
                                                  typeNotification: PATHS.CONTRACT_TASK_MANAGEMENT,
                                                  refId: Number(newData.id) || null,
                                                  userIds: [
                                                    newData
                                                      .contractTaskManagementPlanningDepartments[0]
                                                      .assignedUserId,
                                                  ],
                                                });
                                              }
                                            });
                                          }}
                                        />
                                      </div>
                                    </BasicDialog>
                                  </div>
                                </div>

                                <div className="col-span-24">
                                  <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                                    {/* Ý kiến*/}
                                    <div className="col-span-10 flex items-center">
                                      <FormLabel htmlFor="opinion" className="w-[100px]">
                                        {t(
                                          'fields.contractTaskManagementPlanningDepartments.opinion'
                                        )}
                                      </FormLabel>
                                      <FormField
                                        id={`contractTaskManagementPlanningDepartments.${index}.opinion`}
                                        name={`contractTaskManagementPlanningDepartments.${index}.opinion`}
                                        className="flex-1 md:w-[500px]"
                                      >
                                        <TextArea
                                          autoResizeEnabled={true}
                                          placeholder={`${enterLabel} ${t('fields.contractTaskManagementPlanningDepartments.opinion')}`}
                                          readOnly={
                                            !(
                                              fieldsPlanningDepartment[index]?.isSaveTmp == null ||
                                              (fieldsFinanceDepartment
                                                ?.slice()
                                                .reverse()
                                                .find(item => item?.isApprove === true) &&
                                                fieldsPlanningDepartment[index]?.isSaveTmp == true)
                                            )
                                          }
                                        />
                                      </FormField>
                                    </div>
                                  </div>
                                </div>

                                {fieldsPlanningDepartment[index]?.isSaveTmp == null ||
                                  (fieldsFinanceDepartment
                                    ?.slice()
                                    .reverse()
                                    .find(item => item?.isApprove === true) &&
                                    fieldsPlanningDepartment[index]?.isSaveTmp == true && (
                                      <div className="col-span-24">
                                        <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                                          {/* Lưu và lưu tạm */}
                                          <div className="col-span-10 flex items-center justify-end space-x-4">
                                            <Button
                                              id={`contractTaskManagementPlanningDepartments.${index}.isApprove`}
                                              text="Lưu tạm"
                                              className="uppercase"
                                              type="default"
                                              icon="save"
                                              stylingMode="outlined"
                                              onClick={e => {
                                                void handleSubmitPromise(
                                                  e.event
                                                    ?.currentTarget as unknown as SyntheticEvent<HTMLElement>
                                                );
                                              }}
                                            />
                                            <Button
                                              id={`contractTaskManagementPlanningDepartments.${index}.isNotApprove`}
                                              text="Lưu lại"
                                              className="uppercase"
                                              type="success"
                                              icon="save"
                                              onClick={e => {
                                                // Lấy dữ liệu hiện tại từ form
                                                const currentValues = methods.getValues(
                                                  'contractTaskManagementPlanningDepartments'
                                                );

                                                // Cập nhật giá trị `isSaveTmp` cho phần tử có index hiện tại
                                                const updatedValues = currentValues.map(
                                                  (item, idx) =>
                                                    idx === index
                                                      ? {
                                                          ...item,
                                                          isSaveTmp: false,
                                                          revisedNumber: index,
                                                        }
                                                      : item
                                                );

                                                // Cập nhật lại giá trị vào form
                                                methods.setValue(
                                                  'contractTaskManagementPlanningDepartments',
                                                  updatedValues
                                                );
                                                // Nhấn đồng ý gửi thông báo trưởng phòng kế hoạch chất lượng
                                                void handleSubmitPromise(
                                                  e.event
                                                    ?.currentTarget as unknown as SyntheticEvent<HTMLElement>
                                                ).then(data => {
                                                  const newData =
                                                    data as ContractTaskManagementResponse;
                                                  //trưởng phòng
                                                  if (newData.departmentPlanningHeadId) {
                                                    sendNotify({
                                                      title: t(
                                                        `${index === 0 ? 'contractTaskManagement.new' : 'contractTaskManagement.info'}`,
                                                        {
                                                          ns: 'sendNotification',
                                                        }
                                                      ),
                                                      content:
                                                        t('contractTaskManagement.content', {
                                                          ns: 'sendNotification',
                                                        }) + newData.projectName || '',
                                                      typeNotification:
                                                        PATHS.CONTRACT_TASK_MANAGEMENT,
                                                      refId: Number(newData.id) || null,
                                                      userIds: [newData.departmentPlanningHeadId],
                                                    });
                                                  }
                                                });
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                              </div>
                            </>
                          );
                        })}
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Kết quả thực hiện */}
                  <div className="mt-8">
                    <Tabs defaultValue="executionResult">
                      <div className="w-full border-b border-[#e0e0e0]">
                        <TabsList>
                          <TabsTrigger value="executionResult">
                            {t('page.tabs.executionResult')}
                          </TabsTrigger>
                        </TabsList>
                      </div>
                      <br></br>
                      <TabsContent value="executionResult" className="mt-2">
                        <div className="grid max-w-full grid-cols-24 gap-x-8 gap-y-4">
                          <div className="col-span-24">
                            <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                              {/* Ngày hoàn thành*/}
                              <div className="col-span-6 flex items-center">
                                <FormLabel htmlFor="completionTime" className="w-[100px]">
                                  {t('fields.completionTime')}
                                </FormLabel>
                                <FormField
                                  id="completionTime"
                                  name={'completionTime'}
                                  className="flex-1 md:w-[250px]"
                                  type="date"
                                >
                                  <DateBox
                                    placeholder={`${enterLabel} ${t('fields.completionTime')}`}
                                    disabled={
                                      !fieldsPlanningDepartment
                                        ?.slice()
                                        .reverse()
                                        .find(item => item?.isApprove === true)
                                    }
                                  />
                                </FormField>
                              </div>
                            </div>
                          </div>
                          {/* Dự thảo BB hoàn thiện/thương thảo HĐ */}
                          <div className="col-span-24">
                            <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                              <div className="col-span-8 flex items-center ">
                                <FormLabel className="w-[280px]">
                                  {t('fields.isDraftCompletion')}
                                </FormLabel>
                                <FormField
                                  name="isDraftCompletion"
                                  className="ml-[115px] md:ml-[115px]"
                                  type="checkbox"
                                >
                                  <CheckBox
                                    disabled={
                                      !fieldsPlanningDepartment
                                        ?.slice()
                                        .reverse()
                                        .find(item => item?.isApprove === true)
                                    }
                                  />
                                </FormField>
                              </div>
                            </div>
                          </div>
                          {/* Dự thảo hợp đồng */}
                          <div className="col-span-24">
                            <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                              <div className="col-span-8 flex items-center ">
                                <FormLabel className="w-[280px]">
                                  {t('fields.isDraftContract')}
                                </FormLabel>
                                <FormField
                                  name="isDraftContract"
                                  className="ml-[115px] md:ml-[115px]"
                                  type="checkbox"
                                >
                                  <CheckBox
                                    disabled={
                                      !fieldsPlanningDepartment
                                        ?.slice()
                                        .reverse()
                                        .find(item => item?.isApprove === true)
                                    }
                                  />
                                </FormField>
                              </div>
                            </div>
                          </div>
                          {/* Dự thảo phuj luc hợp đồng */}
                          <div className="col-span-24">
                            <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                              <div className="col-span-8 flex items-center ">
                                <FormLabel className="w-[280px]">
                                  {t('fields.isDraftSubContract')}
                                </FormLabel>
                                <FormField
                                  name="isDraftSubContract"
                                  className="ml-[115px] md:ml-[115px]"
                                  type="checkbox"
                                >
                                  <CheckBox
                                    disabled={
                                      !fieldsPlanningDepartment
                                        ?.slice()
                                        .reverse()
                                        .find(item => item?.isApprove === true)
                                    }
                                  />
                                </FormField>
                              </div>
                            </div>
                          </div>
                          {/* hồ sơ đủ điều kiện ký kết */}
                          <div className="col-span-24">
                            <div className="grid grid-cols-1 gap-x-8 md:grid-cols-24">
                              <div className="col-span-8 flex items-center ">
                                <FormRadioGroup
                                  items={eligibleForSignings}
                                  valueExpr="id"
                                  displayExpr="name"
                                  value={defaultEligibleForSigningCheck}
                                  disabled={
                                    !fieldsPlanningDepartment
                                      ?.slice()
                                      .reverse()
                                      .find(item => item?.isApprove === true)
                                  }
                                  itemRender={renderRadioGroupItem}
                                  onChange={onValueChanged}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* Phụ lục hồ sơ đính kè */}
                    <div className="mt-8">
                      <Tabs defaultValue="contractTaskManagementDocuments">
                        <div className="w-full border-b border-[#e0e0e0]">
                          <TabsList>
                            <TabsTrigger value="contractTaskManagementDocuments">
                              {t('page.tabs.contractTaskManagementDocuments')}
                            </TabsTrigger>
                          </TabsList>
                        </div>
                        <TabsContent value="contractTaskManagementDocuments" className="mt-2">
                          <DataTable
                            tableId={TABLES.CONTRACT_TASK_MANAGEMENT_DOCUMENTS}
                            sortColumn="components"
                            showPagination={false}
                            columns={contractTaskManagementDocumentColumns}
                            editableData={contractTaskManagementDocuments}
                            setEditableData={editedData => {
                              methods.setValue('contractTaskManagementDocuments', editedData);
                            }}
                          />
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab content: Hồ sơ đính kèm */}
                <TabsContent value="attachment" className="mt-2">
                  <RecordEditableTable
                    role={role}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    folder="attach"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </PageLayout>
        </form>
      </Form>
      <DeleteConfirmDialog
        model="contract-task-management"
        name={methods.getValues('code')}
        open={isConfirmDeleteDialogOpen}
        toggle={toggleConfirmDeleteDialog}
        isDeleting={isDeleting}
        onConfirm={() => {
          deleteTarget();
          setTimeout(() => onCreateNew(), 0);
        }}
      />
    </>
  );
};
