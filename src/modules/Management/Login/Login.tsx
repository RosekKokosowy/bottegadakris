'use client';

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { App, Button, Form, Input } from "antd";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import login from "@/assets/management/login.svg";

export default function Login() {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const onFinish = async ({ username, password }: { username: string; password: string }) => {
    setLoading(true);
    const result = await signIn("credentials", { login: username, haslo: password, redirect: false });
    setLoading(false);

    if (result?.ok) {
      router.push("/olimp/dashboard");
    } else {
      message.error("Błąd logowania");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-bottega-brown/5">
      <div className="bg-white p-8 rounded-lg shadow-lg flex max-w-2xl">
        <div className="mr-8">
          <Image src={login} alt="Logowanie" className="w-full" priority />
        </div>

        <div className="max-w-sm w-full">
          <h1 className="text-center text-3xl font-semibold pb-5">Logowanie</h1>
          <Form name="login_form" onFinish={onFinish} autoComplete="off">
            <Form.Item name="username" rules={[{ required: true, message: "Prosze podać nazwę użytkownika!" }]}>
              <Input prefix={<UserOutlined />} placeholder="nazwa użytkownika" autoComplete="username" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: "Proszę podać hasło!" }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="hasło" autoComplete="current-password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full bg-bottega-dark-brown/90 hover:!bg-bottega-brown transition-colors duration-300" loading={loading}>
                Zaloguj się
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
