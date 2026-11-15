'use client';

import { App } from "antd";
import { ChangeEvent, useState } from "react";
import { IVoucherCodeInfo } from "@/types/IVoucher";
import { useServer } from "./useServer";
import { useTrace } from "./useTrace";

/**
 * Checks a gift voucher code as it is typed. A workshop voucher reports its workshop via `onWorkshopVoucher`;
 * an amount voucher shows its remaining value as `voucherHint`.
 */
export const useVoucherCode = ({ onWorkshopVoucher }: { onWorkshopVoucher: (info: IVoucherCodeInfo) => boolean | void }) => {
    /* ───────────── hooks & services ───────────── */
    const server = useServer();
    const { log } = useTrace();
    const { message } = App.useApp();

    /* ───────────── local state ───────────── */
    const [showVoucherCode, setShowVoucherCode] = useState(false);
    const [isVoucherCodeValid, setIsVoucherCodeValid] = useState(false);
    const [voucherHint, setVoucherHint] = useState('');

    /* ───────────── helpers ───────────── */
    const handleVoucherCodeChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const code = event.target.value;
        setIsVoucherCodeValid(false);
        setVoucherHint('');
        if (code.length !== 8) return;

        try {
            const { data } = await server.get<IVoucherCodeInfo>('/voucher/code-to-training', { params: { code } });

            if (data.rodzaj === 'KWOTA') {
                setIsVoucherCodeValid(true);
                setVoucherHint(`Voucher na kwotę ${data.kwota} PLN`);
                return;
            }
            // The form may reject a workshop voucher (e.g. admin booking for another workshop).
            setIsVoucherCodeValid(onWorkshopVoucher(data) !== false);
        } catch (error) {
            log("[ErrorProvider]", error, "handleVoucherCodeChange() has failed to execute successfully.");
            message.warning('Błędny kod VOUCHERA');
        }
    };

    /* ───────────── return variables ───────────── */
    return {
        showVoucherCode, setShowVoucherCode,
        isVoucherCodeValid, voucherHint,
        handleVoucherCodeChange,
    };
};
