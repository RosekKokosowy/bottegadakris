'use client';

import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { App, Button, Checkbox, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { PersonSelect } from "@/components/PersonSelect/PersonSelect";
import { ScheduleCalendar } from "@/components/ScheduleCalendar/ScheduleCalendar";
import { WorkshopSelect } from "@/components/WorkshopSelect/WorkshopSelect";
import { useBooking } from "@/hooks/useBooking";
import { useModalContext } from "@/hooks/useModalContext";
import { useScheduleCalendar } from "@/hooks/useScheduleCalendar";
import { useVoucherCode } from "@/hooks/useVoucherCode";
import { useWorkshops } from "@/hooks/useWorkshops";
import { CONTACT } from "@/utils/navigation";

export function BookingForm() {
  const router = useRouter();
  const { message } = App.useApp();
  const { setIsScheduleOpen } = useModalContext();
  const { form, isBooking, book } = useBooking();
  const { workshops, getWorkshopById } = useWorkshops();

  const warsztatTyp = Form.useWatch("warsztatTyp", form);
  const workshop = getWorkshopById(warsztatTyp);
  const calendar = useScheduleCalendar({ sloty: workshop?.sloty ?? 0, warsztatTyp });

  const handleWorkshopChange = () => {
    form.setFieldValue("liczbaOsob", null);
    calendar.resetSelection();
  };

  const voucher = useVoucherCode({
    onWorkshopVoucher: ({ warsztatTyp }) => {
      form.setFieldValue("warsztatTyp", warsztatTyp);
      handleWorkshopChange();
    },
  });

  const handleFinish = async () => {
    const uuid = await book({ ...form.getFieldsValue(), data: calendar.data, godzina: calendar.godzina, zrodloZapisu: "ONLINE" });
    if (!uuid) return;

    form.resetFields();
    calendar.resetSelection();
    setIsScheduleOpen(false);
    router.push(`/warsztaty-status?id=${uuid}`);
    message.success("Warsztaty zostały zarezerwowane");
  };

  return (
    <Form form={form} size="middle" onFinish={handleFinish}>
      <div className="flex flex-col md:flex-row bg-bottega-beige rounded-lg">
        <div className="font-poppins w-full md:w-1/2 md:pt-6">
          <div className="font-poppins w-full p-4">
            <Form.Item name="voucher" valuePropName="checked">
              <Checkbox onChange={(e) => voucher.setShowVoucherCode(e.target.checked)}>Posiadam voucher podarunkowy</Checkbox>
            </Form.Item>

            {voucher.showVoucherCode ? (
              <Form.Item name="voucherKod" help={voucher.voucherHint || undefined} rules={[{ required: true, message: "Podaj kod vouchera podarunkowego" }]}>
                <Input
                  placeholder="Kod vouchera podarunkowego"
                  onChange={voucher.handleVoucherCodeChange}
                  maxLength={8}
                  suffix={
                    voucher.isVoucherCodeValid ? (
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />
                    ) : (
                      <CloseCircleOutlined style={{ color: "#ff4d4f" }} title="kod VOUCHERA niepoprawny" />
                    )
                  }
                />
              </Form.Item>
            ) : null}

            <div className="flex flex-col md:flex-row gap-x-4">
              <div className="flex w-full md:w-2/3">
                <WorkshopSelect
                  name="warsztatTyp"
                  workshops={workshops}
                  required
                  onChange={handleWorkshopChange}
                  disabled={voucher.isVoucherCodeValid && !voucher.voucherHint}
                />
              </div>
              <div className="flex w-full md:w-1/3">
                <PersonSelect name="liczbaOsob" maxOsob={workshop?.max_osob ?? 0} required />
              </div>
            </div>

            <Form.Item name="imieNazwisko" rules={[{ required: true, message: "Wpisz imię i nazwisko" }]}>
              <Input placeholder="Imię i nazwisko" />
            </Form.Item>
            <Form.Item name="telefon" rules={[{ required: true, message: "Wpisz numer telefonu" }]}>
              <Input placeholder="Telefon kontaktowy" />
            </Form.Item>
            <Form.Item name="email" rules={[{ required: true, message: "Wpisz adres e-mail" }, { type: "email", message: "Wpisz poprawny adres e-mail" }]}>
              <Input placeholder="E-mail" />
            </Form.Item>
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

        <div className="w-full md:w-1/2">
          <ScheduleCalendar
            loading={calendar.scheduleLoading}
            schedule={calendar.schedule}
            data={calendar.data}
            godzina={calendar.godzina}
            onShiftDays={calendar.shiftDays}
            onSelectSlot={calendar.selectSlot}
          />
        </div>
      </div>

      <Button loading={isBooking} htmlType="submit" className="w-full bg-bottega-dark-brown text-white text-xl p-6">
        Umów warsztaty
      </Button>
    </Form>
  );
}
