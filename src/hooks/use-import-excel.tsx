import { DataTableModalErrorImport } from '@/components/data-table/data-table-modal-error-import';
import notification from '@/lib/notifications';
import { postRequest } from '@/services';
import { DataTableErrorImport, ResponseFailure } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'devextreme-react';

import { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBoolean } from './use-boolean';

/**
 * Custom hook để xử lý import file Excel.
 *
 * @param url - API endpoint để upload file.
 * @param templatePath - Đường dẫn tải file template mẫu.
 *
 * @returns Một object chứa các thành phần cần thiết:
 *  - `trigger`: Nút bấm để mở hộp thoại chọn file.
 *  - `downTemplateButton`: Nút tải file template.
 *  - `errorsTable`: Bảng hiển thị lỗi nếu import thất bại.
 *  - `mutation`: Đối tượng mutation từ React Query để xử lý upload file.
 */
export const useImportExcel = ({ url, templatePath }: { url: string; templatePath: string }) => {
  const { t } = useTranslation('dataTable');
  const importExcelInputRef = useRef<HTMLInputElement>(null);

  // State quản lý việc hiển thị modal lỗi
  const { state: openErrorImport, toggle: toggleErrorImport } = useBoolean();
  const [errorsImport, setErrorsImport] = useState<DataTableErrorImport>([]);

  // Mutation để xử lý upload file
  const mutation = useMutation<unknown, ResponseFailure & { errors: DataTableErrorImport }, File>({
    mutationKey: [url],
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return postRequest(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
  });

  /**
   * Xử lý sự kiện khi chọn file để import.
   * - Kiểm tra nếu có file được chọn.
   * - Gửi file lên API bằng React Query mutation.
   * - Nếu thành công, hiển thị thông báo.
   * - Nếu lỗi, kiểm tra kiểu lỗi để hiển thị thông báo phù hợp.
   */
  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const [file] = e.target.files ?? [];

    if (!file) {
      return;
    }

    mutation.mutate(file, {
      onSuccess: () => {
        notification.success(t('import.success'));
      },
      onError: e => {
        if (Array.isArray(e?.errors) && e.errors) {
          setErrorsImport(e?.errors);
          toggleErrorImport();
        } else {
          notification.error(e.message);
        }
      },
    });

    // Reset input để có thể chọn cùng một file nhiều lần
    e.target.value = '';
  };

  /**
   * Nút tải template mẫu.
   */
  const downTemplateButton = (
    <Button
      icon="download"
      hint={t('toolbar.downloadImportTemplate')}
      onClick={() => {
        window.open(templatePath);
      }}
    />
  );

  /**
   * Nút kích hoạt upload file.
   */
  const trigger = (
    <>
      <input
        ref={importExcelInputRef}
        type="file"
        className="hidden"
        id="upload-attach-file"
        onChange={e => {
          void handleImport(e);
        }}
        placeholder="upload-attach-file"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
      <Button
        icon="xlsxfile"
        hint={t('toolbar.import')}
        onClick={() => importExcelInputRef.current?.click()}
      />
    </>
  );

  /**
   * Modal hiển thị lỗi khi import thất bại.
   */
  const errorsTable = (
    <DataTableModalErrorImport
      open={openErrorImport}
      toggle={toggleErrorImport}
      errors={errorsImport}
    />
  );

  return {
    trigger,
    downTemplateButton,
    errorsTable,
    mutation,
  };
};
