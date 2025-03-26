import { useTranslation } from 'react-i18next';

export const DxActiveStatus = ({
  text,
  contentClass = '',
  showText = true,
}: {
  text: string;
  contentClass?: string;
  showText?: boolean;
}) => {
  const { t } = useTranslation('common');
  const isActive = text === 'Đang hoạt động'; // Treat "true" as active
  const statusText = isActive ? t('content.isActive') : t('content.isInActive');
  return (
    <div
      className={`status-contact flex items-center gap-1 ${contentClass} ${
        isActive ? 'text-green-500' : 'text-gray-500'
      }`}
    >
      {/* Circle */}
      <span
        className={`h-[10px] w-[10px] rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-500'}`}
        aria-hidden="true"
      />
      {/* Status Text */}
      {showText && <span className="">{statusText}</span>}
    </div>
  );
};
