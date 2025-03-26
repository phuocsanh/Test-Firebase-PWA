import { attachLabel, MUTATE } from '@/constant';
import { useMutate } from '@/hooks';
import { uploadMulti } from '@/services';
import { UploadResponseMulti } from '@/types';
import { Button } from 'devextreme-react';
import { useRef } from 'react';

export const RecordFilesAttachButton = ({
  onResponse,
  folder,
}: {
  onResponse: (response: UploadResponseMulti[]) => void;
  folder?: string;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const { mutateAsync } = useMutate({
    mutationKey: [MUTATE.UPLOAD_FILE],
    mutationFn: uploadMulti,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('File', file);
      });

      // formData.append('Type', '');
      if (folder) {
        formData.append('Folder', folder);
      }

      mutateAsync(formData)
        .then(response => {
          onResponse(response);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  };

  return (
    <>
      <Button
        onClick={handleButtonClick}
        type="default"
        icon="attach"
        stylingMode="text"
        text={attachLabel}
        className="h-full"
      />
      {/* Input file ẩn */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </>
  );
};
