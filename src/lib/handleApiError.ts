import { toast } from "sonner";


export function handleApiError(response: any, toastId?: string) {
    if (response?.error && Array.isArray(response.error)) {
        response.error.forEach((err: { message: string }) => {
            toast.error(err.message, { id: toastId });
        });
    } else {
        toast.error(response?.message || "Something went wrong!", {
            id: toastId,
        });
    }
}