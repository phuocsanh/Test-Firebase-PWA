// import logo from '@/assets/images/logo.png';
import { ToastContainer, Zoom } from 'react-toastify';

export const Footer = () => {
  // const currentPath = useCurrentPath();
  // const isLoginPage = currentPath === "/sign-in";
  // const classText = twMerge("text-[11px] text-secondary-600", isLoginPage && "text-white");

  return (
    <>
      <div
        id="footer"
        // className="exSm:absolute bottom-0 flex h-8 w-full items-center justify-center border-t bg-white md:fixed"
        className="relative z-[60] flex h-[33px] w-full items-center justify-center border-t bg-white shadow-sm"
      >
        {/* <img className="h-full py-1" src={logo} alt="logo" /> */}
        <div className="absolute right-0 h-full w-full bg-transparent">
          <ToastContainer
            newestOnTop
            theme="dark"
            draggable={false}
            autoClose={false}
            closeOnClick={false}
            transition={Zoom}
          />
        </div>
      </div>
    </>
  );
};
