'use client';

import { LogoutOutlined } from "@ant-design/icons";
import { Avatar, ConfigProvider, Dropdown } from "antd";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { ReactNode } from "react";
import { Logo } from "@/components/Graphics/Logo";

const theme = {
  token: {
    colorPrimary: "#AC8976",
    colorTextSecondary: "#8B4513",
    colorIcon: "#8B4513",
  },
  components: {
    Table: {
      headerBg: "#AC8976",
      headerColor: "#FFFFFF",
      borderColor: "#F3E7DA",
      rowHoverBg: "#F7F6F3",
    },
  },
};

function ManagementBar() {
  return (
    <div className="h-[80px] px-8 bg-bottega-brown flex items-center w-full shadow-md">
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center">
          <Link href="/olimp/dashboard" className="flex gap-1 items-center">
            <Logo color="white" />
            <span className="text-xs text-white font-playfair font-light">Admin</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Dropdown
            menu={{ items: [{ key: "logout", icon: <LogoutOutlined />, label: "Wyloguj", onClick: () => signOut({ callbackUrl: "/olimp" }) }] }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <Avatar className="bg-bottega-dark-brown/70 cursor-pointer">A</Avatar>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

/** Admin panel frame: top bar and the panel's brown antd theme. */
export function ManagementShell({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={theme}>
      <div className="bg-bottega-brown/5">
        <ManagementBar />
        <main className="min-h-[calc(100vh-50px)] pb-4 max-w-7xl mx-auto">{children}</main>
      </div>
    </ConfigProvider>
  );
}
