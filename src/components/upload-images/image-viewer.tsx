import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ImageFile, getFileName } from '@/components/upload-images';
import { formatBytes } from '@/lib/file';

/**
 *
 */
type ImageViewerProps = {
  file: ImageFile;
  open: boolean;
  toggle: () => void;
};

export const ImageViewer = ({ file, open, toggle }: ImageViewerProps) => {
  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogContent className="max-w-screen-md">
        <DialogHeader>
          {file.name && (
            <DialogTitle className="!text-base font-normal">{getFileName(file.name)}</DialogTitle>
          )}
          {file.size && file.type && (
            <DialogDescription>{`${formatBytes(file.size)} - ${file.type}`}</DialogDescription>
          )}
        </DialogHeader>
        <div className="max-h-[65vh] w-full">
          <img
            src={file.preview}
            className="h-full w-full object-contain"
            onClick={() => window.open(file.preview, '_blank')}
          />
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};
