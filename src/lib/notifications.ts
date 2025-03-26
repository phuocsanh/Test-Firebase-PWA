import { TypeOptions, toast } from 'react-toastify';

/**
 * showToast
 * @param message message content to show
 * @param type include success, error, warning, info
 */
const showToast = (message: string, type: TypeOptions) => {
  toast.dismiss();
  toast(`${message}`, { type, containerId: 'footer' });
};

const notification = {
  success: (message: string) => showToast(message, toast.TYPE.SUCCESS),
  error: (message: string) => showToast(message, toast.TYPE.ERROR),
  warning: (message: string) => showToast(message, toast.TYPE.WARNING),
  info: (message: string) => showToast(message, toast.TYPE.INFO),
};

export default notification;
