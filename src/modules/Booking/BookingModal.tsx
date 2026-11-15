'use client';

import { Modal } from "antd";
import { useModalContext } from "@/hooks/useModalContext";
import { BookingForm } from "./BookingForm";

/** "UMÓW WARSZTATY" dialog, opened from any "Umów warsztaty" button. */
export function BookingModal() {
  const { isScheduleOpen, setIsScheduleOpen } = useModalContext();

  return (
    <Modal
      mask
      open={isScheduleOpen}
      onCancel={() => setIsScheduleOpen(false)}
      title={<span className="pl-2 font-poppins font-medium text-xl">UMÓW WARSZTATY</span>}
      width={1200}
      footer={null}
      destroyOnHidden
    >
      <BookingForm />
    </Modal>
  );
}
