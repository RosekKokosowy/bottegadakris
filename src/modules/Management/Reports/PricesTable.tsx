'use client';

import { DollarOutlined, SaveOutlined } from "@ant-design/icons";
import { App, Button, InputNumber, Popover, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { AxiosError } from "axios";
import { useState } from "react";
import { useServer } from "@/hooks/useServer";
import { useWorkshops } from "@/hooks/useWorkshops";
import { IWorkshop } from "@/types/IWorkshop";

export default function PricesTable() {
  const { message } = App.useApp();
  const server = useServer();
  const { workshops, workshopsLoading, refreshWorkshops } = useWorkshops();
  // The workshop whose price popover is open, with the price being typed.
  const [editing, setEditing] = useState<{ id: number; cena: number } | null>(null);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.cena || editing.cena <= 0) {
      message.error("Cena musi być większa od 0");
      return;
    }

    try {
      await server.put(`/olimp/trainings/update-price/${editing.id}`, { cena: editing.cena });
      message.success(`Cena została zaktualizowana na ${editing.cena.toFixed(2)} PLN`);
      setEditing(null);
      refreshWorkshops();
    } catch (error) {
      message.error((error as AxiosError<{ error?: string }>).response?.data?.error ?? "Błąd podczas aktualizacji ceny");
    }
  };

  const pricePopover = (record: IWorkshop) => (
    <div style={{ width: 250 }}>
      <div style={{ marginBottom: 16 }}>
        <strong>Edytuj cenę warsztatu</strong>
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ marginBottom: 8, fontSize: "14px", color: "#666" }}>
          Aktualna cena: <strong>{record.cena.toFixed(2)} PLN</strong>
        </div>
        <InputNumber
          value={editing?.cena ?? record.cena}
          onChange={(value) => setEditing({ id: record.id, cena: value ?? 0 })}
          min={0}
          step={0.01}
          precision={2}
          style={{ width: "100%" }}
          suffix="PLN"
          placeholder="Wprowadź nową cenę"
          onPressEnter={handleSave}
        />
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Button size="small" onClick={() => setEditing(null)}>
          Anuluj
        </Button>
        <Button type="primary" size="small" icon={<SaveOutlined />} onClick={handleSave} className="bg-bottega-brown hover:!bg-bottega-dark-brown text-white transition-colors duration-300">
          Zapisz
        </Button>
      </div>
    </div>
  );

  const columns: ColumnsType<IWorkshop> = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Nazwa warsztatu", dataIndex: "nazwa", key: "nazwa", ellipsis: true },
    { title: "Czas trwania", dataIndex: "czas", key: "czas", width: 120 },
    { title: "Max osób", dataIndex: "max_osob", key: "max_osob", width: 100, align: "center" },
    { title: "Sloty (h)", dataIndex: "sloty", key: "sloty", width: 100, align: "center" },
    {
      title: "Cena (PLN)",
      dataIndex: "cena",
      key: "cena",
      width: 150,
      align: "right",
      render: (cena: number, record) => (
        <Popover
          content={pricePopover(record)}
          title="Edycja ceny"
          trigger="click"
          placement="left"
          open={editing?.id === record.id}
          onOpenChange={(open) => setEditing(open ? { id: record.id, cena: record.cena } : null)}
        >
          <Button type="link" icon={<DollarOutlined />} className="!px-0 hover:!text-bottega-dark-brown text-bottega-brown font-semibold">
            {cena.toFixed(2)} PLN
          </Button>
        </Popover>
      ),
    },
  ];

  return (
    <div className="flex justify-center items-center pt-10">
      <div className="w-full px-2 md:px-0">
        <div className="flex flex-col items-center mb-4"></div>
        <Table columns={columns} dataSource={workshops} pagination={false} loading={workshopsLoading} scroll={{ x: "min-content" }} rowKey="id" size="middle" bordered />
      </div>
    </div>
  );
}
