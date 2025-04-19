import { showError } from "./toast";

export function handleError(error: unknown) {
  const message = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
  showError(message);
  console.error("[Handled Error]:", error);
}
