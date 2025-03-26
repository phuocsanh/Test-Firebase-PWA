import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { toast } from './ui/use-toast';

type NotifyProps = {
  title: string;
  body: string;
  icon?: string;
  clickAction: string;
  refId: number | null;
};

export const useShowNotify = () => {
  const navigate = useNavigate();
  const showNotify = ({ title, body, clickAction, refId }: NotifyProps) => {
    function navigateToPath(type: string, id: number | null) {
      if (type) {
        const path = id == null || id < 0 ? type : `${type}/${id}`;
        navigate(path);
      }
    }

    const toastInstance = toast({
      onClick: () => {
        navigateToPath(clickAction, refId);
        toastInstance.dismiss();
      },
      title,
      description: body,
      duration: 50000,
    });
  };

  return showNotify;
};

// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// type NotifyProps = {
//   title: string;
//   body: string;
//   icon?: string;
//   clickAction: string;
// };

// export const useShowNotify = () => {
//   const navigate = useNavigate();

//   const showNotify = ({ title, body, clickAction }: NotifyProps) => {
//     toast(
//       <div
//         onClick={() => {
//           navigate(clickAction);
//         }}
//         style={{ cursor: 'pointer' }}
//       >
//         <strong>{title}</strong>
//         <div>{body}</div>
//       </div>,
//       {
//         containerId: 'useShowNotify',
//         position: toast.POSITION.TOP_RIGHT,
//         closeOnClick: true,
//       }
//     );
//   };

//   return showNotify;
// };
