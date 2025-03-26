import DocFileSvg from '@/assets/doc-file-icon.svg';
import PdfFileSvg from '@/assets/pdf-file-icon.svg';
import PptFileSvg from '@/assets/ppt-file-icon.svg';
import TxtFileSvg from '@/assets/txt-file-icon.svg';
import XlsFileSvg from '@/assets/xls-file-icon.svg';

import { Button } from '@/components/ui/button';
import { ImageFile, getFileName } from '@/components/upload-images';
import { formatBytes } from '@/lib/file';
import { File, Image, X } from 'lucide-react';
/**
 *
 */
type UploadedItemProps = {
  file: ImageFile;
  // onClickToEdit: () => void;
  onClickToView: () => void;
  onRemoveFile: () => void;
};

export const UploadedItem = ({
  file,
  // onClickToEdit,
  onClickToView,
  onRemoveFile,
}: UploadedItemProps) => {
  const viewOnNewTab = () => {
    window.open(file.preview, '_blank');
  };

  const getIllustration = () => {
    const { type } = file;

    let icon = '';
    let onClick = viewOnNewTab;
    if (type.includes('image')) {
      icon = file.preview;
      onClick = onClickToView;
    } else if (type.includes('pdf')) {
      icon = PdfFileSvg;
    } else if (type.includes('word') || type.includes('rtf')) {
      icon = DocFileSvg;
    } else if (type.includes('text')) {
      icon = TxtFileSvg;
    } else if (type.includes('ppt')) {
      icon = PptFileSvg;
    } else if (type.includes('excel') || type.includes('sheet')) {
      icon = XlsFileSvg;
    }

    return (
      <img
        src={icon}
        className="block h-16 w-16 rounded-md object-contain hover:cursor-pointer hover:opacity-80"
        onClick={onClick}
      />
    );
  };
  return (
    <div className="hover:bg-primary-foreground/80 flex justify-between overflow-hidden rounded-md p-3 transition-all">
      <div className="flex flex-[4] items-start gap-1">
        {getIllustration()}
        <div className="flex flex-col">
          <p
            className="w-full text-ellipsis text-xs font-medium hover:cursor-pointer hover:underline"
            onClick={viewOnNewTab}
          >
            {getFileName(file?.name)}
          </p>
          <p className="text-xs font-normal">{`${formatBytes(file.size)} - ${file.type}`}</p>
        </div>
      </div>
      <div className="flex flex-1 items-start justify-end">
        <Button
          variant={'ghost'}
          className="h-[auto] p-1"
          onClick={() => {
            if (file.type.includes('image')) {
              onClickToView();
            } else {
              viewOnNewTab();
            }
          }}
        >
          {file.type.includes('image') ? (
            <Image size={15} className="text-primary/60" />
          ) : (
            <File size={15} className="text-primary/60" />
          )}
        </Button>
        <Button variant={'ghost'} className="h-[auto] p-1" onClick={onRemoveFile}>
          <X size={15} className="text-primary/60" />
        </Button>
      </div>
    </div>
  );
};
