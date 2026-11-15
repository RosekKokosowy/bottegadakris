import { ReactNode } from "react";
import { ManagementShell } from "@/modules/Management/ManagementShell/ManagementShell";

export default function Layout({ children }: { children: ReactNode }) {
  return <ManagementShell>{children}</ManagementShell>;
}
