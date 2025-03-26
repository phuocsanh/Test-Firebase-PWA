import eMiniLogo from '@/assets/images/e-logo-mini.ico';
import { useNav } from '@/hooks';

export const SidebarHeader = () => {
  const { isExpanded } = useNav();

  return (
    <div className="h-[50px] w-full border border-[#1A4A9BFF] bg-[#1A4A9BFF]">
      {isExpanded ? (
        <div className="flex h-full items-center justify-start">
          <div className="flex h-10 items-center justify-center gap-x-2">
            <img className={'size-10'} src={eMiniLogo} alt="logo" />
            <p className="text-t14 font-bold leading-none text-white">MEKONG SOFT</p>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <img className={'size-10'} src={eMiniLogo} alt="logo" />
        </div>
      )}
    </div>
  );
};
