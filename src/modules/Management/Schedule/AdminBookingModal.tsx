'use client';

import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { App, Button, Checkbox, Col, Form, Input, Modal, Row } from "antd";
import { useEffect } from "react";
import { PersonSelect } from "@/components/PersonSelect/PersonSelect";
import { WorkshopSelect } from "@/components/WorkshopSelect/WorkshopSelect";
import { useBooking } from "@/hooks/useBooking";
import { useVoucherCode } from "@/hooks/useVoucherCode";
import { useWorkshops } from "@/hooks/useWorkshops";

interface Props {
  data: string;
  godzina: string;
  /** Workshop already running in this slot — the new booking must join it. */
  warsztatTyp?: number;
  onClose: (saved: boolean) => void;
}

/** Admin booking for a chosen hour of the schedule. */
export function AdminBookingModal({ data, godzina, warsztatTyp, onClose }: Props) {
  const { message } = App.useApp();
  const { form, isBooking, book } = useBooking();
  const { workshops, getWorkshopById } = useWorkshops();
  const selected = getWorkshopById(Form.useWatch("warsztatTyp", form));

  useEffect(() => {
    if (warsztatTyp) form.setFieldValue("warsztatTyp", warsztatTyp);
  }, [form, warsztatTyp]);

  const voucher = useVoucherCode({
    onWorkshopVoucher: (info) => {
      if (warsztatTyp && info.warsztatTyp !== warsztatTyp) {
        message.warning("Kod vouchera nie pasuje do wybranego warsztatu.");
        return false;
      }
      if (!warsztatTyp) {
        form.setFieldValue("warsztatTyp", info.warsztatTyp);
        form.setFieldValue("liczbaOsob", null);
      }
    },
  });

  const handleFinish = async () => {
    const uuid = await book({ ...form.getFieldsValue(), data, godzina, zrodloZapisu: "ADMIN" });
    if (!uuid) return;
    message.success("Umówiono warsztaty");
    onClose(true);
  };

  return (
    <Modal destroyOnHidden open onCancel={() => onClose(false)} footer={null}>
      <div className="p-12">
        <Form form={form} size="middle" onFinish={handleFinish}>
          <div className="flex flex-col">
            <Form.Item name="voucher" valuePropName="checked">
              <Checkbox onChange={(e) => voucher.setShowVoucherCode(e.target.checked)}>Zapis z voucherem podarunkowym</Checkbox>
            </Form.Item>
            {voucher.showVoucherCode ? (
              <Form.Item name="voucherKod" help={voucher.voucherHint || undefined} rules={[{ required: true, message: "Podaj kod vouchera podarunkowego" }]}>
                <Input
                  placeholder="Kod vouchera podarunkowego"
                  onChange={voucher.handleVoucherCodeChange}
                  maxLength={8}
                  suffix={
                    voucher.isVoucherCodeValid ? <CheckCircleOutlined style={{ color: "#52c41a" }} /> : <CloseCircleOutlined style={{ color: "#ff4d4f" }} title="kod VOUCHERA niepoprawny" />
                  }
                />
              </Form.Item>
            ) : null}
            <Row gutter={16}>
              <Col span={16}>
                <WorkshopSelect
                  name="warsztatTyp"
                  workshops={workshops}
                  required
                  onChange={() => form.setFieldValue("liczbaOsob", null)}
                  disabled={(voucher.isVoucherCodeValid && !voucher.voucherHint) || !!warsztatTyp}
                />
              </Col>
              <Col span={8}>
                <PersonSelect name="liczbaOsob" maxOsob={selected?.max_osob ?? 0} required />
              </Col>
            </Row>
            <Form.Item name="imieNazwisko" rules={[{ required: true, message: "Wpisz imię i nazwisko" }]}>
              <Input placeholder="Imię i nazwisko" />
            </Form.Item>
            <Form.Item name="telefon" rules={[{ required: true, message: "Wpisz numer telefonu" }]}>
              <Input placeholder="Telefon kontaktowy" />
            </Form.Item>
            <Form.Item name="email" rules={[{ required: true, message: "Wpisz adres e-mail" }]}>
              <Input placeholder="E-mail" />
            </Form.Item>
            <Form.Item name="komentarz">
              <Input.TextArea style={{ width: "100%", resize: "none" }} placeholder="Dodatkowy komentarz" rows={4} />
            </Form.Item>
            <Button htmlType="submit" className="w-full" loading={isBooking}>
              Umów warsztaty
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
