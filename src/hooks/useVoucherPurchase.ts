'use client';

import { App, Form } from "antd";
import { AxiosError } from "axios";
import { useState } from "react";
import { IVoucherRequest } from "@/types/IVoucher";
import { useServer } from "./useServer";
import { useTrace } from "./useTrace";

/** Creates a gift voucher and returns the Przelewy24 payment link. */
export const useVoucherPurchase = () => {
    /* ───────────── hooks & services ───────────── */
    const [form] = Form.useForm<IVoucherRequest & { voucherRodzaj: "WARSZTAT" | "KWOTA" }>();
    const server = useServer();
    const { log } = useTrace();
    const { message } = App.useApp();

    /* ───────────── local state ───────────── */
    const [isBuying, setIsBuying] = useState(false);
    const [paymentLink, setPaymentLink] = useState('');

    /* ───────────── API calls ───────────── */
    const buy = async (payload: IVoucherRequest) => {
        setIsBuying(true);
        try {
            const { data } = await server.post<{ id: number; link: string }>('/voucher', payload);
            setPaymentLink(data.link);
        } catch (error) {
            const { response } = error as AxiosError<{ message?: string }>;
            log("[ErrorProvider]", error, "buy() has failed to execute successfully.");
            message.error(response?.status === 400 && response.data?.message ? response.data.message : 'Błąd podczas zakupu vouchera');
        } finally {
            setIsBuying(false);
        }
    };

    /* ───────────── return variables ───────────── */
    return { form, isBuying, paymentLink, setPaymentLink, buy };
};
