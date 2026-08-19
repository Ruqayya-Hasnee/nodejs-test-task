import { AxiosError } from "axios";

export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (typeof data === "string") return data;
    if (data?.message) return data.message;
  }
  return fallback;
}
