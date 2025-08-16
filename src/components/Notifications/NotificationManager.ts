import { notificationSliceActions } from "../../store/slices/notificationSliceSelectors";
import { store } from "../../store/store";

export class NotificationManager {
    private static DEFAULT_TIMEOUT = 5000;

    static showSuccess(params: { message: string, heading?: string, timeout?: number }) {
        const { message, heading, timeout } = params;
        NotificationManager.showToast('success', message, heading, timeout);
    }

    static showInfo(params: { message: string, heading?: string, timeout?: number }) {
        const { message, heading, timeout } = params;
        NotificationManager.showToast('info', message, heading, timeout);
    }

    static showWarn(params: { message: string, heading?: string, timeout?: number }) {
        const { message, heading, timeout } = params;
        NotificationManager.showToast('warn', message, heading, timeout);
    }

    static showError(params: { message: string, heading?: string, timeout?: number }) {
        const { message, heading, timeout } = params;
        NotificationManager.showToast('error', message, heading, timeout);
    }
    /**
     * Private method to show a toast notification.
     * @param type - The type of the toast (success, info, warn, error).
     * @param message - The message to display in the toast.
     * @param heading - Optional heading for the toast.
     * @param timeout - Optional timeout for the toast.
     */
    private static showToast(type: 'success' | 'info' | 'warn' | 'error', message: string, heading?: string, timeout?: number) {
        const dispatch = store.dispatch;
        console.log('Dispatching toast:', { type, message, heading, timeout });
        dispatch(notificationSliceActions.addToast({ type, message, heading, timeout: timeout || NotificationManager.DEFAULT_TIMEOUT }));
    }
}
