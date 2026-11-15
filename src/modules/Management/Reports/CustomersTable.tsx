'use client';

import { Button, Form, Input, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { ICustomer } from "@/types/ICustomer";
import { ClientModal } from "../Schedule/ClientModal";

const columns: ColumnsType<ICustomer> = [
  { title: "Imię i nazwisko", dataIndex: "imieNazwisko", key: "imieNazwisko", render: (_, record) => <ClientModal klientDane={record} /> },
  { title: "Telefon", dataIndex: "telefon", key: "telefon" },
  { title: "E-mail", dataIndex: "email", key: "email" },
  {
    title: "Adres",
    key: "adres",
    render: (_, r) => `${[r.kodPocztowy, r.miasto, r.ulica, r.numerDomu].filter(Boolean).join(" ")}${r.numerMieszkania ? `/${r.numerMieszkania}` : ""}`,
  },
];

export default function CustomersTable() {
  const [search, setSearch] = useState("");
  const { data, loading } = useFetch<ICustomer[]>("/olimp/customers", [], { search });

  return (
    <div className="flex justify-center items-center pt-10">
      <div className="w-full px-2 md:px-0">
        <div className="flex flex-col items-center">
          <Form name="search" layout="inline" onFinish={({ search }) => setSearch(search || "")} className="w-full mb-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <div className="flex-1 max-w-80">
                <Form.Item name="search" label="Klient:">
                  <Input placeholder="Szukaj klientów" />
                </Form.Item>
              </div>
              <div className="w-full sm:w-auto">
                <Form.Item>
                  <Button className="bg-bottega-dark-brown/70 hover:bg-bottega-brown text-white transition duration-300" htmlType="submit">
                    Szukaj
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
        <Table columns={columns} dataSource={data} pagination={false} loading={loading} scroll={{ x: "min-content" }} rowKey="id" />
      </div>
    </div>
  );
}
