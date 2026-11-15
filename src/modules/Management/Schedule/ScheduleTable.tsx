'use client';

import { DeleteOutlined, EllipsisOutlined, SwapOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { App, Button, DatePicker, Dropdown, MenuProps, Modal, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useServer } from "@/hooks/useServer";
import { useTrace } from "@/hooks/useTrace";
import { IDaySchedule, ISlotBooking } from "@/types/ISchedule";
import { AdminBookingModal } from "./AdminBookingModal";
import { ClientModal, SourceIcon } from "./ClientModal";
import { canTakePayment, PaymentIcon } from "./PaymentIcon";
import { RescheduleModal } from "./RescheduleModal";

/** One row of the day: a free hour, a break, or the bookings running in that hour. */
interface IRow {
  key: string;
  data: string;
  godzina: string;
  kind: "free" | "break" | "booked";
  bookings: ISlotBooking[];
}

type Dialog =
  | { type: "add"; data: string; godzina: string; warsztatTyp?: number }
  | { type: "reschedule"; booking: ISlotBooking }
  | { type: "payment"; booking: ISlotBooking };

const toRows = (day?: IDaySchedule): IRow[] =>
  day
    ? Object.entries(day.godziny).map(([godzina, slot]) => ({
        key: `${day.data}-${godzina}`,
        data: day.data,
        godzina,
        kind: slot === "wolne" ? "free" : slot === "przerwa" ? "break" : "booked",
        bookings: typeof slot === "string" ? [] : slot.zajete,
      }))
    : [];

export function ScheduleTable() {
  const { message, modal } = App.useApp();
  const server = useServer();
  const { log } = useTrace();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [dialog, setDialog] = useState<Dialog | null>(null);

  const { data: days, loading, reload } = useFetch<IDaySchedule[]>("/olimp/schedule/zarzadzaj/zapisane", [], { data: selectedDate.format("YYYY-MM-DD") });
  const rows = useMemo(() => toRows(days[0]), [days]);

  const closeDialog = (saved: boolean) => {
    setDialog(null);
    if (saved) reload();
  };

  const cancelBookings = (ids: number[]) =>
    modal.confirm({
      title: "Czy na pewno chcesz odwołać warsztaty?",
      okText: "Tak",
      cancelText: "Nie",
      onOk: async () => {
        try {
          await server.post("/olimp/trainings/remove", { ids });
          message.success("Warsztat odwołany");
          reload();
        } catch (error) {
          log("[ErrorProvider]", error, "cancelling bookings has failed.");
          message.error("Błąd podczas odwoływania warsztatu");
        }
      },
    });

  const takePayment = async (booking: ISlotBooking) => {
    try {
      await server.post("/olimp/trainings/set-payed", { id: booking.id, oplacony: !booking.oplacony, doplata: booking.doplata });
      message.success("Status płatności zmieniony");
      setDialog(null);
      reload();
    } catch (error) {
      log("[ErrorProvider]", error, "taking a payment has failed.");
      message.error("Błąd podczas zmiany statusu płatności");
    }
  };

  const paymentIcon = (booking: ISlotBooking, size: number, prefix?: string) => (
    <PaymentIcon
      oplacony={booking.oplacony}
      size={size}
      prefix={prefix}
      onClick={canTakePayment(booking.oplacony) ? () => setDialog({ type: "payment", booking }) : undefined}
    />
  );

  const actions = (row: IRow): MenuProps["items"] => {
    if (row.kind === "free") return [{ key: "add", icon: <UsergroupAddOutlined />, label: "Dodaj", onClick: () => setDialog({ type: "add", data: row.data, godzina: row.godzina }) }];

    const [first] = row.bookings;
    const totalPersons = row.bookings.reduce((sum, b) => sum + b.ileOsob, 0);
    const items: MenuProps["items"] = [];

    if (totalPersons < first.maxOsob) {
      items.push({ key: "add", icon: <UsergroupAddOutlined />, label: "Dodaj", onClick: () => setDialog({ type: "add", data: row.data, godzina: row.godzina, warsztatTyp: first.warsztat.id }) });
    }

    if (row.bookings.length === 1) {
      items.push(
        { key: "cancel", icon: <DeleteOutlined />, label: "Anuluj", onClick: () => cancelBookings([first.id]) },
        { key: "reschedule", icon: <SwapOutlined />, label: "Zmień termin", onClick: () => setDialog({ type: "reschedule", booking: first }) },
      );
      return items;
    }

    items.push({ key: "cancel-all", icon: <DeleteOutlined />, label: "Anuluj warsztat", onClick: () => cancelBookings(row.bookings.map((b) => b.id)) });
    row.bookings.forEach((booking) =>
      items.push({
        key: `booking-${booking.id}`,
        type: "group",
        label: booking.klient.imieNazwisko,
        children: [
          { key: `cancel-${booking.id}`, icon: <DeleteOutlined />, label: "Anuluj", onClick: () => cancelBookings([booking.id]) },
          { key: `reschedule-${booking.id}`, icon: <SwapOutlined />, label: "Zmień termin", onClick: () => setDialog({ type: "reschedule", booking }) },
        ],
      }),
    );
    return items;
  };

  const columns: ColumnsType<IRow> = [
    { title: "Data", dataIndex: "data", key: "data" },
    { title: "Godzina", dataIndex: "godzina", key: "godzina" },
    {
      title: "Z",
      key: "zrodloZapisu",
      render: (_, row) => (row.kind === "booked" ? <SourceIcon zrodloZapisu={row.bookings[0].zrodloZapisu} /> : null),
    },
    {
      title: "Klient",
      key: "klient",
      render: (_, row) => {
        if (row.kind !== "booked") return null;
        if (row.bookings.length > 1) {
          return (
            <div>
              <div style={{ fontWeight: "bold", marginBottom: 4 }}>{row.bookings.length} klientów</div>
              {row.bookings.map((booking) => (
                <div key={booking.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  {paymentIcon(booking, 16, booking.klient.imieNazwisko)}
                  <ClientModal klientDane={booking.klient} />
                </div>
              ))}
            </div>
          );
        }
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {paymentIcon(row.bookings[0], 20)}
            <ClientModal klientDane={row.bookings[0].klient} />
          </div>
        );
      },
    },
    {
      title: "Warsztat",
      key: "warsztat",
      render: (_, row) => {
        if (row.kind === "break") return <div>PRZERWA</div>;
        if (row.kind === "free") return null;
        const [first] = row.bookings;
        const totalPersons = row.bookings.reduce((sum, b) => sum + b.ileOsob, 0);
        return (
          <div>
            <div>{first.warsztat.nazwa}</div>
            {first.maxOsob ? (
              <div style={{ fontSize: "12px", color: "#666" }}>
                {totalPersons}/{first.maxOsob} osób
                {first.availableSpots > 0 && (
                  <Tag color="green" style={{ marginLeft: 4 }}>
                    +{first.availableSpots} wolne
                  </Tag>
                )}
              </div>
            ) : null}
          </div>
        );
      },
    },
    {
      title: "Uwagi",
      key: "uwagi",
      render: (_, row) =>
        row.bookings.length > 1 ? (
          <div>
            {row.bookings
              .filter((b) => b.uwagi)
              .map((b) => (
                <div key={b.id} style={{ fontSize: "12px", marginBottom: 2 }}>
                  {b.uwagi}
                </div>
              ))}
          </div>
        ) : (
          row.bookings[0]?.uwagi
        ),
    },
    {
      title: "Akcje",
      key: "akcje",
      render: (_, row) =>
        row.kind === "break" ? null : (
          <Dropdown menu={{ items: actions(row) }} trigger={["click"]} placement="bottomRight">
            <Button icon={<EllipsisOutlined />} aria-label="Akcje" />
          </Dropdown>
        ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col items-center">
        <DatePicker value={selectedDate} onChange={(date) => date && setSelectedDate(date)} className="mb-5" allowClear={false} />
      </div>
      <Table columns={columns} dataSource={rows} pagination={false} loading={loading} rowKey="key" scroll={{ x: "min-content" }} />

      {dialog?.type === "add" && <AdminBookingModal data={dialog.data} godzina={dialog.godzina} warsztatTyp={dialog.warsztatTyp} onClose={closeDialog} />}
      {dialog?.type === "reschedule" && <RescheduleModal booking={dialog.booking} onClose={closeDialog} />}
      <Modal destroyOnHidden open={dialog?.type === "payment"} onCancel={() => setDialog(null)} onOk={() => dialog?.type === "payment" && takePayment(dialog.booking)} okText="Przyjmij dopłatę">
        <p className="text-center py-6">Pozostała kwota: {dialog?.type === "payment" ? dialog.booking.doplata : 0} PLN</p>
      </Modal>
    </div>
  );
}
