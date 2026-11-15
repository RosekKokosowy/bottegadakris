'use client';

import { App, Form } from "antd";
import { useState } from "react";
import { IContactRequest } from "@/types/IContact";
import { useServer } from "./useServer";
import { useTrace } from "./useTrace";

export const useContact = () => {
    /* ───────────── hooks & services ───────────── */
    const [form] = Form.useForm<IContactRequest>();
    const { message } = App.useApp();
    const server = useServer();
    const { log } = useTrace();

    /* ───────────── local state ───────────── */
    const [isSending, setIsSending] = useState(false);

    /* ───────────── API calls ───────────── */
    const send = async (values: IContactRequest) => {
        setIsSending(true);

        try {
            const { data } = await server.post('/contact', values);
            if (data.success) message.success('Wiadomość wysłana poprawnie');
            form.resetFields();
        } catch (error) {
            log("[ErrorProvider]", error, "send() has failed to execute successfully.");
            message.error('Nie udało się wysłać wiadomości');
        } finally {
            setIsSending(false);
        }
    };

    /* ───────────── return variables ───────────── */
    return { form, isSending, send };
};
