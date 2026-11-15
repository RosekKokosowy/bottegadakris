'use client';

import { Modal } from "antd";
import { useModalContext } from "@/hooks/useModalContext";
import { VoucherForm } from "./VoucherForm";

/** "KUP VOUCHER" dialog, opened from the /vouchery page. */
export function VoucherModal() {
  const { isVoucherOpen, setIsVoucherOpen } = useModalContext();

  return (
    <Modal
      mask
      style={{ top: 10 }}
      open={isVoucherOpen}
      onCancel={() => setIsVoucherOpen(false)}
      title={<span className="pl-2 font-poppins font-medium text-xl">KUP VOUCHER</span>}
      width={1200}
      footer={null}
      destroyOnHidden
    >
      <VoucherForm />
    </Modal>
  );
}
