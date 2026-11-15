'use client';

import { App } from "antd";
import { useEffect, useState } from "react";
import { IWorkshop } from "@/types/IWorkshop";
import { useServer } from "./useServer";
import { useTrace } from "./useTrace";

/** Active workshops with prices (booking and voucher dialogs, admin forms). */
export const useWorkshops = () => {
    /* ───────────── hooks & services ───────────── */
    const server = useServer();
    const { log } = useTrace();
    const { message } = App.useApp();

    /* ───────────── local state ───────────── */
    const [workshops, setWorkshops] = useState<IWorkshop[]>([]);
    const [workshopsLoading, setWorkshopsLoading] = useState<boolean>(true);
    const [version, setVersion] = useState(0);

    /* ───────────── API calls ───────────── */
    useEffect(() => {
        let cancelled = false;

        server.get<IWorkshop[]>('/trainings')
            .then(({ data }) => !cancelled && setWorkshops(data))
            .catch((error) => {
                log("[ErrorProvider]", error, "loading workshops has failed.");
                message.error('Błąd podczas ładowania warsztatów');
            })
            .finally(() => !cancelled && setWorkshopsLoading(false));

        return () => {
            cancelled = true;
        };
    }, [server, log, message, version]);

    /* ───────────── helpers ───────────── */
    /** Reload after a change (e.g. a price update in the admin panel). */
    const refreshWorkshops = () => {
        setWorkshopsLoading(true);
        setVersion((v) => v + 1);
    };

    const getWorkshopById = (id?: number) => workshops.find((workshop) => workshop.id === id);

    /* ───────────── return variables ───────────── */
    return { workshops, workshopsLoading, refreshWorkshops, getWorkshopById };
};
