'use client';

import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { IClient } from "@/types/ISchedule";
import { ClientModal } from "../Schedule/ClientModal";
import { DateRangeSearch, todayFilter } from "./DateRangeSearch";

interface IPaymentRow {
  klientDane: IClient;
  warsztatNazwa: string;
  kwota: string;
  data: string;
  godzina: string;
  typPlatnosci: string;
}

const columns: ColumnsType<IPaymentRow> = [
  { title: "Data", dataIndex: "data", key: "data" },
  { title: "Godzina", dataIndex: "godzina", key: "godzina" },
  { title: "Klient", key: "klient", render: (_, record) => <ClientModal klientDane={record.klientDane} /> },
  { title: "Kwota", dataIndex: "kwota", key: "kwota" },
  { title: "Warsztat", dataIndex: "warsztatNazwa", key: "warsztatNazwa" },
  { title: "Typ płatności", dataIndex: "typPlatnosci", key: "typPlatnosci" },
];

export default function PaymentsTable() {
  const [filter, setFilter] = useState(todayFilter);
  const { data, loading } = useFetch<IPaymentRow[]>("/olimp/payment/list", [], { ...filter });

  return (
    <div className="flex justify-center items-center pt-10">
      <div className="w-full px-2 md:px-0">
        <DateRangeSearch onSearch={setFilter} clientPlaceholder="Wyszukaj klienta" />
        <Table columns={columns} dataSource={data} pagination={false} loading={loading} scroll={{ x: "min-content" }} rowKey={(r) => `${r.typPlatnosci}-${r.data}-${r.godzina}-${r.klientDane.id}`} />
      </div>
    </div>
  );
}
