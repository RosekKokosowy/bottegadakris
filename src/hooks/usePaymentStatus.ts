'use client';

import { useEffect, useState } from "react";
import { IPaymentDetails } from "@/types/IPayment";
import { useServer } from "./useServer";
import { useTrace } from "./useTrace";

const POLL_INTERVAL = 10000;
const MAX_POLLS = 18;

/** Loads the purchase behind /payment-status and polls until Przelewy24 confirms it (3 minutes at most). */
export const usePaymentStatus = ({ uid, rodzaj, id }: { uid: string; rodzaj: string; id: string }) => {
    /* ───────────── hooks & services ───────────── */
    const server = useServer();
    const { log } = useTrace();

    /* ───────────── local state ───────────── */
    const [details, setDetails] = useState<IPaymentDetails | null>(null);
    const [error, setError] = useState(false);

    /* ───────────── API calls ───────────── */
    useEffect(() => {
        let polls = 0;
        let timer: ReturnType<typeof setTimeout>;
        let cancelled = false;

        const fetchDetails = async () => {
            try {
                const { data } = await server.post<IPaymentDetails>('/payment/details', { uid, rodzaj, id });
                if (cancelled) return;
                setDetails(data);

                const isPaid = rodzaj === 'V' ? Number(data.platnosc) === 1 : Number(data.platnosc) > 0;
                if (!isPaid && ++polls < MAX_POLLS) timer = setTimeout(fetchDetails, POLL_INTERVAL);
            } catch (e) {
                log("[ErrorProvider]", e, "fetchDetails() has failed to execute successfully.");
                if (!cancelled) setError(true);
            }
        };

        fetchDetails();
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [server, log, uid, rodzaj, id]);

    /* ───────────── return variables ───────────── */
    return { details, error };
};
