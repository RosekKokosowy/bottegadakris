'use client';

import { App, ConfigProvider } from "antd";
import plPL from "antd/locale/pl_PL";
import dayjs from "dayjs";
import "dayjs/locale/pl";
import { ReactNode } from "react";

dayjs.locale("pl");

export function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#9E9E9E" } }} locale={plPL}>
      <App>{children}</App>
    </ConfigProvider>
  );
}
