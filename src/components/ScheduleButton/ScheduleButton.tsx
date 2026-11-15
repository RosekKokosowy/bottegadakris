'use client';

import { Button } from "@/components/Button/Button";
import { useModalContext } from "@/hooks/useModalContext";

/** "Umów warsztaty" — opens the booking dialog. */
export function ScheduleButton({ className }: { className: string }) {
  const { setIsScheduleOpen } = useModalContext();

  return (
    <Button type="button" className={className} onClick={() => setIsScheduleOpen(true)}>
      Umów warsztaty
    </Button>
  );
}
