import { useToast } from "vue-toastification";

const toast = useToast();

const defaultOptions = {
  timeout: 4000,
  position: "top-right",
};

export const showSuccess = (msg: string) => toast.success(msg, defaultOptions);
export const showError = (msg: string) => toast.error(msg, defaultOptions);
export const showInfo = (msg: string) => toast.info(msg, defaultOptions);
export const showWarning = (msg: string) => toast.warning(msg, defaultOptions);
