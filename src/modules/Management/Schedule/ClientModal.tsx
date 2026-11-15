'use client';

import { DesktopOutlined, GlobalOutlined } from "@ant-design/icons";
import { Modal, Table } from "antd";
import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { IClient } from "@/types/ISchedule";
import { PaymentIcon } from "./PaymentIcon";

interface IClientBooking {
  id: number;
  data: string;
  godzina: string;
  zrodloZapisu: string;
  oplacony: number;
  warsztatNazwa: string;
  ileOsob: number;
  uwagi: string;
}

export function SourceIcon({ zrodloZapisu }: { zrodloZapisu: string | null }) {
  if (zrodloZapisu === "ONLINE") return <GlobalOutlined title="Zapis online" style={{ cursor: "pointer", fontSize: "20px" }} />;
  if (zrodloZapisu === "ADMIN") return <DesktopOutlined title="Zapis administracyjny" style={{ cursor: "pointer", fontSize: "20px" }} />;
  return null;
}

/** Client name; click opens their details and active bookings. */
export function ClientModal({ klientDane }: { klientDane?: IClient | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useFetch<{ data: IClientBooking[] }>(isOpen && klientDane?.id ? "/olimp/trainings/per-client" : null, { data: [] }, { id: klientDane?.id });

  if (!klientDane) return null;

  const address = [klientDane.kodPocztowy, klientDane.miasto, klientDane.ulica, klientDane.numerDomu, klientDane.numerMieszkania].filter(Boolean).join(" ");

  return (
    <>
      <span style={{ cursor: "pointer" }} title="Podgląd klienta" onClick={() => setIsOpen(true)}>
        {klientDane.imieNazwisko}
      </span>
      <Modal destroyOnHidden open={isOpen} onCancel={() => setIsOpen(false)} footer={null} width="66vw">
        <h1 className="text-xl py-5">
          Klient #{klientDane.id} {klientDane.imieNazwisko}
        </h1>
        <p>
          Telefon: <b>{klientDane.telefon}</b> &nbsp;E-mail:&nbsp;<b>{klientDane.email}</b>
          &nbsp;Adres:&nbsp;{address}
        </p>

        <Table<IClientBooking>
          columns={[
            { title: "Data", dataIndex: "data", key: "data" },
            { title: "Godzina", dataIndex: "godzina", key: "godzina" },
            { title: "Z", dataIndex: "zrodloZapisu", key: "zrodloZapisu", render: (_, record) => <SourceIcon zrodloZapisu={record.zrodloZapisu} /> },
            { title: "P", dataIndex: "oplacony", key: "oplacony", render: (_, record) => <PaymentIcon oplacony={record.oplacony} /> },
            { title: "Warsztat", dataIndex: "warsztatNazwa", key: "warsztatNazwa" },
            { title: "Liczba osób", dataIndex: "ileOsob", key: "ileOsob" },
            { title: "Uwagi", dataIndex: "uwagi", key: "uwagi" },
          ]}
          dataSource={data.data}
          pagination={false}
          rowKey="id"
        />
      </Modal>
    </>
  );
}
