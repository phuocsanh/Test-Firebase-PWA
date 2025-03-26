import { ImageFile } from '@/components/upload-images';
import { ImageViewer } from '@/components/upload-images/image-viewer';
import { useBoolean } from '@/hooks/use-boolean';
import { getPreviewURL } from '@/lib/file';
import { cn } from '@/lib/utils';

type ImageViewProps = {
  src: string;
  alt?: string;
  className?: string;
};

export const ImageView = ({ src, alt, className }: ImageViewProps) => {
  const { state: open, toggle } = useBoolean();

  const file = {
    name: src,
    type: 'image/jpeg',
    preview: getPreviewURL(src),
  } as ImageFile;

  return (
    <>
      {/* <Avatar className={cn('h-72 w-72 rounded-none', className)}>
        <AvatarImage
          src={getPreviewURL(src)}
          alt={alt ?? getPreviewURL(src)}
          onClick={toggle}
          className="hover:cursor-pointer"
        />
      </Avatar> */}
      <div
        className={cn(
          'flex h-[200px] w-[228px] max-w-full items-center justify-center overflow-hidden rounded-xl border border-zinc-300 transition-opacity duration-75  hover:cursor-pointer hover:opacity-95',
          className
        )}
        onClick={toggle}
      >
        <img className="max-h-[200px] w-auto" src={file.preview} alt={alt} />
      </div>
      <ImageViewer file={file} open={open} toggle={toggle} />
    </>
  );
};
