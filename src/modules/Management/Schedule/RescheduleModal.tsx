'use client';

import { App, Button, Modal } from "antd";
import { useState } from "react";
import { ScheduleCalendar } from "@/components/ScheduleCalendar/ScheduleCalendar";
import { useScheduleCalendar } from "@/hooks/useScheduleCalendar";
import { useServer } from "@/hooks/useServer";
import { useTrace } from "@/hooks/useTrace";
import { ISlotBooking } from "@/types/ISchedule";

/** Moves a booking to another free hour; the booking's own hours count as free. */
export function RescheduleModal({ booking, onClose }: { booking: ISlotBooking; onClose: (saved: boolean) => void }) {
  const { message } = App.useApp();
  const server = useServer();
  const { log } = useTrace();
  const [saving, setSaving] = useState(false);
  const calendar = useScheduleCalendar({ sloty: booking.warsztat.sloty, warsztatTyp: booking.warsztat.id, zapisId: booking.id });

  const handleSave = async () => {
    const { data, godzina } = calendar;
    if (!data || !godzina || (data === booking.data && godzina === booking.godzina)) {
      message.warning("Zmień termin, aby kontynuować");
      return;
    }

    setSaving(true);
    try {
      await server.put("/olimp/trainings/reschedule", { data, godzina, id: booking.id });
      message.success("Termin został zmieniony");
      onClose(true);
    } catch (error) {
      log("[ErrorProvider]", error, "reschedule has failed.");
      message.error("Błąd podczas zmiany terminu");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      destroyOnHidden
      open
      onCancel={() => onClose(false)}
      title={<h1 className="text-2xl font-semibold pt-6 pl-6 mb-0">Zmień termin warsztatu</h1>}
      footer={
        <Button onClick={handleSave} loading={saving} className="w-full bg-bottega-dark-brown text-white text-xl p-6" style={{ marginTop: 0 }}>
          Zmień termin
        </Button>
      }
      className="!w-full md:!w-4/5 lg:!w-3/5 xl:!w-1/2 "
      centered
      styles={{
        container: { height: "80vh", maxHeight: "80vh", padding: 0, display: "flex", flexDirection: "column" },
        body: { flex: 1, overflow: "hidden", padding: "24px", overflowY: "auto" },
        footer: { padding: "24px" },
      }}
    >
      <div className="h-full">
        <ScheduleCalendar
          schedule={calendar.schedule}
          loading={calendar.scheduleLoading}
          data={calendar.data}
          godzina={calendar.godzina}
          onShiftDays={calendar.shiftDays}
          onSelectSlot={calendar.selectSlot}
        />
      </div>
    </Modal>
  );
}
