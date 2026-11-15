'use client';

import { App, Form } from "antd";
import { AxiosError } from "axios";
import { useState } from "react";
import { IBookingRequest } from "@/types/IBooking";
import { useServer } from "./useServer";
import { useTrace } from "./useTrace";

/** Submits a booking (public dialog and admin panel). Resolves with the booking uuid, or undefined on failure. */
export const useBooking = () => {
    /* ───────────── hooks & services ───────────── */
    const [form] = Form.useForm<IBookingRequest>();
    const server = useServer();
    const { log } = useTrace();
    const { message } = App.useApp();

    /* ───────────── local state ───────────── */
    const [isBooking, setIsBooking] = useState(false);

    /* ───────────── API calls ───────────── */
    const book = async (payload: IBookingRequest): Promise<string | undefined> => {
        if (!payload.data || !payload.godzina) {
            message.warning('Wybierz datę i godzinę!');
            return undefined;
        }

        setIsBooking(true);
        try {
            const { data } = await server.post<{ success: boolean; id: string }>('/trainings', payload);
            return data.id;
        } catch (error) {
            const { response } = error as AxiosError<{ message?: string }>;
            if (response?.status === 400 && response.data?.message) {
                message.error(response.data.message);
            } else {
                log("[ErrorProvider]", error, "book() has failed to execute successfully.");
                message.error('Błąd podczas umawiania warsztatów');
            }
            return undefined;
        } finally {
            setIsBooking(false);
        }
    };

    /* ───────────── return variables ───────────── */
    return { form, isBooking, book };
};
