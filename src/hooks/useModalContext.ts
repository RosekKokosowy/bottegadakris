'use client';

import { useContext } from "react";
import { ModalContext } from "@/providers/ModalProvider";
import { IModalContext } from "@/types/IModalContext";

export const useModalContext = (): IModalContext => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('[ModalProvider]: useModalContext() is out of bounds');
  }

  return context;
};
