import toast, { ToastOptions } from "react-hot-toast";

const defaultOptions: ToastOptions = {
  duration: 4000,
  position: "top-right",
  style: {
    borderRadius: "10px",
    background: "#1e293b",
    color: "#f8fafc",
    fontSize: "14px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
  }
};

export const showToast = {
  success: (msg: string, opts?: ToastOptions) => toast.success(msg, { ...defaultOptions, ...opts }),
  error: (msg: string, opts?: ToastOptions) => toast.error(msg, { ...defaultOptions, ...opts }),
  info: (msg: string, opts?: ToastOptions) => toast(msg, { ...defaultOptions, ...opts }),
  loading: (msg: string, opts?: ToastOptions) => toast.loading(msg, { ...defaultOptions, ...opts })
};

export default showToast;
