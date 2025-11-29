import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultOptions= {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showToast = (message, type) => {
  if (type === "success") {
    toast.success(message, defaultOptions);
  } else {
    toast.error(message, defaultOptions);
  }
};

export const ToastProvider = () => {
  return <ToastContainer />;
};
