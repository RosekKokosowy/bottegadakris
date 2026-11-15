'use client';

import { Button, Col, Drawer, Form, Input, Row, Select } from "antd";
import { WorkshopSelect } from "@/components/WorkshopSelect/WorkshopSelect";
import { useModalContext } from "@/hooks/useModalContext";
import { useVoucherPurchase } from "@/hooks/useVoucherPurchase";
import { useWorkshops } from "@/hooks/useWorkshops";
import { CONTACT } from "@/utils/navigation";
import { PaymentLanding } from "./PaymentLanding";
import { VoucherPreview } from "./VoucherPreview";

const MIN_AMOUNT = 50;

export function VoucherForm() {
  const { setIsVoucherOpen } = useModalContext();
  const { form, isBuying, paymentLink, setPaymentLink, buy } = useVoucherPurchase();
  const { workshops, getWorkshopById } = useWorkshops();

  const voucherRodzaj = Form.useWatch("voucherRodzaj", form) ?? "WARSZTAT";
  const od = Form.useWatch("od", form) ?? "";
  const dla = Form.useWatch("dla", form) ?? "";
  const warsztatTyp = Form.useWatch("warsztatTyp", form);
  const kwota = Form.useWatch("kwota", form);
  const warsztatNazwa = voucherRodzaj === "WARSZTAT" ? getWorkshopById(warsztatTyp)?.nazwa ?? "" : kwota ? `${kwota} PLN` : "";

  const handleFinish = () => {
    const values = form.getFieldsValue();
    buy(voucherRodzaj === "WARSZTAT" ? { ...values, kwota: undefined } : { ...values, warsztatTyp: undefined });
  };

  const handleClose = () => {
    setPaymentLink("");
    setIsVoucherOpen(false);
  };

  return (
    <>
      <Form form={form} size="small" onFinish={handleFinish}>
        <div className="flex flex-col lg:flex-row bg-bottega-beige rounded-lg">
          <div className="font-poppins w-full lg:w-5/12 px-2 py-2 lg:px-16 lg:py-4">
            <div className="font-poppins w-full md:p-4">
              <Form.Item name="voucherRodzaj" initialValue="WARSZTAT" rules={[{ required: true, message: "Wybierz rodzaj vouchera" }]}>
                <Select
                  onChange={() => form.setFieldsValue({ warsztatTyp: undefined, kwota: undefined })}
                  options={[
                    { value: "WARSZTAT", label: "Voucher na warsztat (konkretny warsztat)" },
                    { value: "KWOTA", label: "Voucher kwotowy (na wybraną kwotę)" },
                  ]}
                />
              </Form.Item>

              {voucherRodzaj === "WARSZTAT" && <WorkshopSelect name="warsztatTyp" workshops={workshops} required />}

              {voucherRodzaj === "KWOTA" && (
                <Form.Item
                  name="kwota"
                  rules={[
                    { required: true, message: "Podaj kwotę vouchera" },
                    { pattern: /^[1-9]\d*(\.\d{1,2})?$/, message: `Podaj poprawną kwotę (min. ${MIN_AMOUNT} zł)` },
                    { validator: async (_, value) => (value && Number(value) < MIN_AMOUNT ? Promise.reject(new Error(`Kwota musi być większa lub równa ${MIN_AMOUNT} zł`)) : undefined) },
                  ]}
                >
                  <Input placeholder="Kwota (PLN)" type="number" min={1} step={1} />
                </Form.Item>
              )}

              <Form.Item name="od" rules={[{ required: true, message: "Podaj nadawcę" }]}>
                <Input placeholder="Od" />
              </Form.Item>
              <Form.Item name="dla" rules={[{ required: true, message: "Podaj odbiorcę" }]}>
                <Input placeholder="Dla" />
              </Form.Item>

              <div className="font-medium py-3">Twoje dane</div>

              <Form.Item name="imieNazwisko" rules={[{ required: true, message: "Podaj imię i nazwisko" }]}>
                <Input placeholder="Imię i nazwisko" />
              </Form.Item>
              <Form.Item name="telefon" rules={[{ required: true, message: "Podaj numer telefonu" }]}>
                <Input placeholder="Telefon kontaktowy" />
              </Form.Item>
              <Form.Item name="email" rules={[{ required: true, message: "Podaj adres e-mail" }, { type: "email", message: "Podaj poprawny adres e-mail" }]}>
                <Input placeholder="E-mail" />
              </Form.Item>
              <Form.Item name="ulica">
                <Input placeholder="Ulica" />
              </Form.Item>

              <Row className="flex flex-col lg:flex-row w-full">
                <Col className="flex flex-col w-full lg:w-1/2">
                  <Form.Item name="numerDomu">
                    <Input style={{ width: "100%" }} className="w-full" placeholder="Nr domu" />
                  </Form.Item>
                </Col>
                <Col className="flex flex-col w-full lg:w-1/2 lg:pl-10">
                  <Form.Item name="numerMieszkania">
                    <Input style={{ width: "100%" }} placeholder="Nr lokalu" />
                  </Form.Item>
                </Col>
              </Row>

              <Row className="flex flex-col lg:flex-row w-full">
                <Col className="flex flex-col w-full lg:w-1/2">
                  <Form.Item name="kodPocztowy">
                    <Input style={{ width: "100%" }} className="w-full" placeholder="Kod pocztowy" />
                  </Form.Item>
                </Col>
                <Col className="flex flex-col w-full lg:w-1/2 lg:pl-10">
                  <Form.Item name="miasto">
                    <Input style={{ width: "100%" }} placeholder="Miasto" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="komentarz">
                <Input.TextArea style={{ width: "100%", resize: "none" }} placeholder="Dodatkowy komentarz" rows={4} />
              </Form.Item>

              <Form.Item className="font-thin">
                Masz pytania? Skontaktuj się ze mną.
                <br />
                {CONTACT.phone}
              </Form.Item>
            </div>
          </div>
          <div className="hidden md:block font-poppins w-full lg:w-7/12 py-10 pr-10 pt-16 lg:pt-48">
            <VoucherPreview od={od} dla={dla} warsztatNazwa={warsztatNazwa} />
          </div>
        </div>
        <Button loading={isBuying} htmlType="submit" className="w-full bg-bottega-dark-brown text-white text-xl p-6">
          Kup voucher
        </Button>
      </Form>

      <Drawer destroyOnHidden open={!!paymentLink} onClose={handleClose} footer={null} size="100vw" closable={false}>
        <PaymentLanding link={paymentLink} info="Przejdź do płatności za voucher podarunkowy:" />
      </Drawer>
    </>
  );
}
