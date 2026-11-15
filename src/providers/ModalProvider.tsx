'use client';

import { createContext, ReactNode, useState } from "react";
import { IModalContext } from "@/types/IModalContext";

export const ModalContext = createContext<IModalContext | undefined>(undefined);

/** Opens the site-wide "Umów warsztaty" and "Kup voucher" dialogs from any page. */
export function ModalProvider({ children }: { children: ReactNode }) {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ isScheduleOpen, setIsScheduleOpen, isVoucherOpen, setIsVoucherOpen }}>
      {children}
    </ModalContext.Provider>
  );
}
