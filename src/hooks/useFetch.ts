'use client';

import { App } from "antd";
import { useEffect, useState } from "react";
import { useServer } from "./useServer";
import { useTrace } from "./useTrace";

/**
 * GETs `url` (under /api) whenever it or `params` change; `reload()` fetches again.
 * `loading` is true until the data for the current url/params has arrived.
 */
export const useFetch = <T,>(url: string | null, initial: T, params?: Record<string, unknown>) => {
    /* ───────────── hooks & services ───────────── */
    const server = useServer();
    const { log } = useTrace();
    const { message } = App.useApp();

    /* ───────────── local state ───────────── */
    const [version, setVersion] = useState(0);
    const paramsJson = JSON.stringify(params ?? {});
    const request = `${url}|${paramsJson}|${version}`;
    const [loaded, setLoaded] = useState<{ request: string; data: T }>({ request: '', data: initial });

    /* ───────────── API calls ───────────── */
    useEffect(() => {
        if (!url) return;
        let cancelled = false;

        server.get<T>(url, { params: JSON.parse(paramsJson) })
            .then(({ data }) => !cancelled && setLoaded({ request, data }))
            .catch((error) => {
                log("[ErrorProvider]", error, `GET ${url} has failed.`);
                message.error('Nie udało się pobrać danych');
                if (!cancelled) setLoaded((current) => ({ ...current, request }));
            });

        return () => {
            cancelled = true;
        };
    }, [server, log, message, url, paramsJson, request]);

    /* ───────────── return variables ───────────── */
    return {
        data: loaded.data,
        loading: !!url && loaded.request !== request,
        reload: () => setVersion((v) => v + 1),
    };
};
