'use client';

import { Checkbox, Form, Input } from "antd";
import { useContact } from "@/hooks/useContact";

export function ContactForm() {
  const { form, isSending, send } = useContact();

  return (
    <Form form={form} size="large" onFinish={send}>
      <Form.Item name="imieNazwisko" required>
        <Input required placeholder="Imię i nazwisko" />
      </Form.Item>
      <Form.Item name="telefon" required>
        <Input required placeholder="Telefon kontaktowy" />
      </Form.Item>
      <Form.Item name="email" required>
        <Input required type="email" placeholder="E-mail" />
      </Form.Item>
      <Form.Item name="wiadomosc" required>
        <Input.TextArea required style={{ width: "100%", resize: "none" }} placeholder="Treść wiadomości" rows={4} />
      </Form.Item>
      <Form.Item required>
        <Checkbox required /> Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z Polityką prywatności
      </Form.Item>

      <Form.Item>
        <button
          type="submit"
          disabled={isSending}
          className="w-full bg-bottega-dark-brown text-bottega-beige border font-lato p-[10px] px-[40px] my-5 hover:shadow-lg transform transition ease-in-out"
        >
          Wyślij wiadomość
        </button>
      </Form.Item>
    </Form>
  );
}
