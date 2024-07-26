import { toast } from "react-toastify";
class Toast {
  success = async (details: any) => {
    toast.success(details.message, {
      position: "bottom-right",
      autoClose: details.timer || 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  error = async (details: any) => {
    toast.error(details.message, {
      position: "bottom-right",
      autoClose: details.timer || 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  warning = async (details: any) => {
    toast.warning(details.message, {
      position: "bottom-right",
      autoClose: details.timer || 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new Toast();

export enum ToastTypes {
  success = "success",
  error = "error",
  warning = "warning",
}

export interface ToastProps {
  type: any;
  message: string;
}
