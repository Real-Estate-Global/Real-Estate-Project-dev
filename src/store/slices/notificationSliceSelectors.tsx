import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface Toast {
    id: string;
    type: 'success' | 'info' | 'warn' | 'error';
    message: string;
    heading?: string;
    timeout: number;
}

interface NotificationState {
    toasts: Toast[];
}

const initialState: NotificationState = {
    toasts: [],
};

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        addToast: (
            state,
            action: PayloadAction<Omit<Toast, 'id'>>
        ) => {
            const { message, heading, timeout, type } = action.payload;
            console.log('Adding toast:', { message, heading, timeout, type });
            state.toasts.push({
                id: uuidv4(),
                type,
                message,
                heading,
                timeout,
            });
        },
        removeToast: (state, action: PayloadAction<string>) => {
            state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
        },
    },
    selectors: {
        toasts: (state) => state.toasts,
    },
});

export const notificationSliceActions = notificationSlice.actions;
export const notificationSliceSelectors = notificationSlice.selectors;
