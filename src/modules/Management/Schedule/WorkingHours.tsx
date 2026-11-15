'use client';

import { ClockCircleOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Popover, Table, TimePicker } from "antd";
import { ColumnsType } from "antd/es/table";
import { AxiosError } from "axios";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useServer } from "@/hooks/useServer";
import { IBreak, IWorkingHours, WEEKDAYS } from "@/types/ISchedule";

dayjs.extend(customParseFormat);

const format = "HH:mm";
const dayNames = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];

interface IDayRow {
  key: (typeof WEEKDAYS)[number];
  day: string;
  godzina_od?: string;
  godzina_do?: string;
  breaks: Partial<IBreak>[];
}

const toTime = (value?: string | null) => (value ? dayjs(value, [format, "HH:mm:ss"]) : null);
const fromTime = (time: Dayjs | null) => (time ? time.format(format) : undefined);

const breaksLabel = (count: number) => (count === 0 ? "Dodaj przerwy" : `${count} ${count === 1 ? "przerwa" : count < 5 ? "przerwy" : "przerw"}`);

export function WorkingHours() {
  const { message } = App.useApp();
  const server = useServer();
  const { data, loading, reload } = useFetch<IWorkingHours[]>("/olimp/schedule/zarzadzaj/godziny-pracy", []);
  // Unsaved edits per weekday; rows without edits show the stored hours.
  const [edits, setEdits] = useState<Partial<Record<IDayRow["key"], IDayRow>>>({});

  const rows: IDayRow[] = WEEKDAYS.map((key, index) => {
    const stored = data.find((d) => d.dzien === index);
    return edits[key] ?? { key, day: dayNames[index], godzina_od: stored?.godzina_od ?? undefined, godzina_do: stored?.godzina_do ?? undefined, breaks: stored?.breaks ?? [] };
  });

  const update = (row: IDayRow, change: Partial<IDayRow>) => setEdits((current) => ({ ...current, [row.key]: { ...row, ...change } }));
  const updateBreak = (row: IDayRow, index: number, change: Partial<IBreak>) => update(row, { breaks: row.breaks.map((b, i) => (i === index ? { ...b, ...change } : b)) });

  const handleSave = async (row: IDayRow) => {
    try {
      await server.post("/olimp/schedule", { day: row.key, start: row.godzina_od, end: row.godzina_do, breaks: row.breaks });
      message.success("Grafik zaktualizowany");
      setEdits((current) => {
        const rest = { ...current };
        delete rest[row.key];
        return rest;
      });
      reload();
    } catch (error) {
      message.error((error as AxiosError<{ error?: string }>).response?.data?.error ?? "Błąd podczas zmiany grafiku");
    }
  };

  const breaksPopover = (row: IDayRow) => (
    <div style={{ width: 300 }}>
      <div style={{ marginBottom: 16 }}>
        <strong>Przerwy w pracy</strong>
      </div>
      {row.breaks.map((item, index) => (
        <div key={index} style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <TimePicker format={format} minuteStep={10} value={toTime(item.start)} placeholder="Od" size="small" onChange={(time) => updateBreak(row, index, { start: fromTime(time) })} />
          <span>-</span>
          <TimePicker format={format} minuteStep={10} value={toTime(item.end)} placeholder="Do" size="small" onChange={(time) => updateBreak(row, index, { end: fromTime(time) })} />
          <Button type="text" icon={<DeleteOutlined />} size="small" danger aria-label="Usuń przerwę" onClick={() => update(row, { breaks: row.breaks.filter((_, i) => i !== index) })} />
        </div>
      ))}
      <Button type="dashed" icon={<PlusOutlined />} size="small" style={{ width: "100%" }} onClick={() => update(row, { breaks: [...row.breaks, {}] })}>
        Dodaj przerwę
      </Button>
    </div>
  );

  const columns: ColumnsType<IDayRow> = [
    { title: "Dzień tygodnia", dataIndex: "day", key: "day" },
    {
      title: "Od",
      key: "start",
      render: (_, row) => <TimePicker format={format} minuteStep={10} value={toTime(row.godzina_od)} placeholder="" onChange={(time) => update(row, { godzina_od: fromTime(time) })} />,
    },
    {
      title: "Do",
      key: "end",
      render: (_, row) => <TimePicker format={format} minuteStep={10} value={toTime(row.godzina_do)} placeholder="" onChange={(time) => update(row, { godzina_do: fromTime(time) })} />,
    },
    {
      title: "Przerwy",
      key: "breaks",
      render: (_, row) => (
        <Popover content={breaksPopover(row)} title="Zarządzaj przerwami" trigger="click" placement="left">
          <Button
            type="link"
            icon={<ClockCircleOutlined />}
            className={`!px-0 hover:!text-bottega-dark-brown ${row.breaks.length ? "text-bottega-brown font-semibold" : "text-bottega-gray font-normal"}`}
          >
            {breaksLabel(row.breaks.length)}
          </Button>
        </Popover>
      ),
    },
    { title: "Akcja", key: "action", render: (_, row) => <Button onClick={() => handleSave(row)}>Zapisz</Button> },
  ];

  return <Table loading={loading} columns={columns} dataSource={rows} pagination={false} rowKey="key" />;
}
