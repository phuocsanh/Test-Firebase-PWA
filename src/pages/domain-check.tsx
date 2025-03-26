import expiredImage from '@/assets/images/expired.jpg';
import notFoundImage from '@/assets/images/not-found.jpg';

import { useAuth } from '@/hooks';
import { Footer } from '@/layout/footer';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export const DomainCheck = () => {
  const { t } = useTranslation('common');
  const { type } = useParams();
  const { clearAuth } = useAuth();

  useEffect(() => clearAuth(), [clearAuth]);

  const renderImageContent = () => {
    switch (Number(type)) {
      case 2:
        return (
          <>
            <img src={expiredImage} className="m-auto h-[50vh]" />
            <p className="text-center">{t('expired')}</p>
          </>
        );
      case 3:
        return (
          <>
            <img src={notFoundImage} className="m-auto h-[50vh]" />
            <p className="text-center">{t('notExist')}</p>
          </>
        );
      default:
        break;
    }
  };

  return (
    <>
      <div className="h-screen w-full">
        {renderImageContent()}
        <p className="text-center">
          {t('helpText')}&nbsp;
          <a className="text-primary-600" href="tel: 094 444 3558">
            094 444 3558
          </a>
        </p>
        <div className="absolute bottom-0 w-full">
          <Footer />
        </div>
      </div>
    </>
  );
};
