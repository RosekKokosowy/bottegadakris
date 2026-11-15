'use client';

import { DollarOutlined } from "@ant-design/icons";
import { Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { IVoucher } from "@/types/IVoucher";
import { ClientModal } from "../Schedule/ClientModal";
import { DateRangeSearch, todayFilter } from "./DateRangeSearch";

const columns: ColumnsType<IVoucher> = [
  { title: "Data zakupu", dataIndex: "dataZakupu", key: "dataZakupu" },
  {
    title: "P",
    key: "czyPlatnosc",
    render: (_, record) => (
      <DollarOutlined
        style={{ color: record.czyPlatnosc ? "green" : "red", cursor: "pointer", fontSize: "20px" }}
        title={record.czyPlatnosc ? "Voucher opłacony" : "Voucher nie został opłacony"}
      />
    ),
  },
  { title: "Klient", key: "klient", render: (_, record) => <ClientModal klientDane={record.klient} /> },
  { title: "Od", dataIndex: "od", key: "od" },
  { title: "Dla", dataIndex: "dla", key: "dla" },
  { title: "Warsztat", dataIndex: "warsztatNazwa", key: "warsztatNazwa" },
  {
    title: "Kwota",
    key: "kwota",
    render: (_, record) => (record.rodzaj === "KWOTA" ? <Tooltip title={`Wykorzystano: ${record.kwotaWykorzystana ?? 0} PLN`}>{record.kwota} PLN</Tooltip> : ""),
  },
  { title: "Uwagi", dataIndex: "uwagi", key: "uwagi" },
  { title: "Status", dataIndex: "status", key: "status" },
  { title: "Kod", dataIndex: "kod", key: "kod" },
];

export default function VouchersTable() {
  const [filter, setFilter] = useState(todayFilter);
  const { data, loading } = useFetch<IVoucher[]>("/olimp/voucher", [], { ...filter });

  return (
    <div className="flex justify-center items-center pt-10">
      <div className="w-full px-2 md:px-0">
        <DateRangeSearch onSearch={setFilter} clientPlaceholder="Szukaj klienta" />
        <Table columns={columns} dataSource={data} pagination={false} loading={loading} scroll={{ x: "min-content" }} rowKey="id" />
      </div>
    </div>
  );
}
