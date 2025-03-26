import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageFile } from '@/components/upload-images';
import { ImageViewer } from '@/components/upload-images/image-viewer';
import { useBoolean } from '@/hooks/use-boolean';
import { getFirstAndLastInitials } from '@/lib/text';
import { cn } from '@/lib/utils';

type UserAvatarProps = {
  src: string;
  name: string;
  className?: string;
};

export const UserAvatar = ({ src, name, className }: UserAvatarProps) => {
  const { state: open, toggle } = useBoolean();

  const file = {
    name: src,
    type: 'image/jpeg',
    preview: src,
  } as ImageFile;

  return (
    <>
      <Avatar className={cn('h-14 w-14', className)}>
        <AvatarImage src={src} alt={name} onClick={toggle} className=" hover:cursor-pointer" />
        <AvatarFallback className="font-semibold">
          {getFirstAndLastInitials(name || '')}
        </AvatarFallback>
      </Avatar>
      <ImageViewer file={file} open={open} toggle={toggle} />
    </>
  );
};
