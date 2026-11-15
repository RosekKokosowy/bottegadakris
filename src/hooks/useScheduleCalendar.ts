'use client';

import { App } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { IGrafikDay, IGrafikSlot } from "@/types/ISchedule";
import { useServer } from "./useServer";
import { useTrace } from "./useTrace";

interface Params {
    /** Length of the chosen workshop in hours; 0 until one is chosen. */
    sloty: number;
    warsztatTyp?: number;
    /** Booking being rescheduled — its own hours count as free. */
    zapisId?: number;
}

/** Five-day booking calendar with a selectable start hour (public booking, admin reschedule). */
export const useScheduleCalendar = ({ sloty, warsztatTyp, zapisId }: Params) => {
    /* ───────────── hooks & services ───────────── */
    const server = useServer();
    const { log } = useTrace();
    const { message } = App.useApp();

    /* ───────────── local state ───────────── */
    const [dataOd, setDataOd] = useState(() => dayjs().format('YYYY-MM-DD'));
    const [data, setData] = useState('');
    const [godzina, setGodzina] = useState('');
    // The calendar shown is tagged with the request it answers; it is loading while that differs from the current one.
    const request = `${dataOd}|${warsztatTyp ?? ''}|${zapisId ?? ''}`;
    const [loaded, setLoaded] = useState<{ request: string; schedule: IGrafikDay[] }>({ request: '', schedule: [] });

    /* ───────────── API calls ───────────── */
    useEffect(() => {
        let cancelled = false;
        const params = { dataOd, ileDni: 5, ...(zapisId ? { zapisId } : {}), ...(warsztatTyp ? { warsztatTyp } : {}) };

        server.get<IGrafikDay[]>('/schedule/online/grafik', { params })
            .then(({ data }) => !cancelled && setLoaded({ request, schedule: data }))
            .catch((error) => {
                log("[ErrorProvider]", error, "loading the booking calendar has failed.");
                message.error('Nie udało się pobrać grafiku');
                if (!cancelled) setLoaded((current) => ({ ...current, request }));
            });

        return () => {
            cancelled = true;
        };
    }, [server, log, message, request, dataOd, warsztatTyp, zapisId]);

    /* ───────────── helpers ───────────── */
    const shiftDays = (days: number) => setDataOd((current) => dayjs(current).add(days, 'day').format('YYYY-MM-DD'));

    const resetSelection = () => {
        setData('');
        setGodzina('');
    };

    const selectSlot = (slot: IGrafikSlot, day: IGrafikDay) => {
        if (!sloty) {
            message.warning('Wybierz warsztat');
            return;
        }
        if (slot.symbol === '-') return;

        if (`${day.data} ${slot.symbol}` === `${data} ${godzina}`) {
            resetSelection();
            return;
        }

        // The workshop needs `sloty` consecutive free hours from the chosen one.
        const hours = day.godziny.map((el) => el.symbol);
        const needed = hours.slice(hours.indexOf(slot.symbol)).slice(0, sloty);
        if (needed.includes('-') || needed.length < sloty) {
            message.warning('Nie można zapisać na tą godzinę');
            return;
        }

        setData(day.data);
        setGodzina(slot.symbol);
    };

    /* ───────────── return variables ───────────── */
    return { schedule: loaded.schedule, scheduleLoading: loaded.request !== request, data, godzina, shiftDays, selectSlot, resetSelection };
};
