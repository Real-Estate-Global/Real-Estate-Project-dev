import { Toast } from "primereact/toast";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { notificationSliceActions, notificationSliceSelectors } from "../../store/slices/notificationSliceSelectors";

export const NotificationsContainer = () => {
    const toasts = useAppSelector(notificationSliceSelectors.toasts);
    const dispatch = useAppDispatch();
    const toastRef = useRef<Toast>(null);
console.log('toasts', toasts);
    useEffect(() => {
        if (toasts.length > 0) {
            toasts.forEach((toast) => {
                toastRef.current?.show?.({
                    severity: toast.type,
                    summary: toast.heading,
                    detail: toast.message,
                    life: toast.timeout
                });
                dispatch(notificationSliceActions.removeToast(toast.id));
            });
        }
    }, [toasts, dispatch]);

    return (
        <Toast ref={toastRef} />
    );
}
