import { translationWithNamespace } from '@/lib/i18nUtils';
import { Loader2 } from 'lucide-react';

export const LoadingOverlay = ({
  loading,
  text = translationWithNamespace('common')('loading'),
}: {
  loading: boolean;
  text?: string;
}) => {
  return (
    loading && (
      <div className="fixed left-0 top-0 z-50 h-full w-full bg-background/80 bg-white opacity-75 backdrop-blur-sm ">
        <div className="mt-[calc(50vh-68px)] flex items-center justify-center">
          <div>
            <Loader2 className={'mx-auto h-8 w-8 animate-spin text-primary-600'} />
            <div className="mt-3">{text}</div>
          </div>
        </div>
      </div>
    )
  );
};
