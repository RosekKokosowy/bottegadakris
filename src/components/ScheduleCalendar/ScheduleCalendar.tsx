'use client';

import { LeftOutlined, RightOutlined, UserOutlined } from "@ant-design/icons";
import { Spin, Tooltip } from "antd";
import { IGrafikDay, IGrafikSlot } from "@/types/ISchedule";

interface Props {
  loading: boolean;
  schedule: IGrafikDay[];
  data: string;
  godzina: string;
  onShiftDays: (days: number) => void;
  onSelectSlot: (slot: IGrafikSlot, day: IGrafikDay) => void;
}

function Arrow({ mode, onClick }: { mode: "left" | "right"; onClick: () => void }) {
  const Icon = mode === "left" ? LeftOutlined : RightOutlined;
  return (
    <div className="flex flex-col self-start mt-2">
      <div className="flex flex-row w-full h-full px-1 md:px-5">
        <Icon onClick={onClick} className="text-2xl" aria-label={mode === "left" ? "Poprzednie dni" : "Następne dni"} />
      </div>
    </div>
  );
}

export function ScheduleCalendar({ loading, schedule, data, godzina, onShiftDays, onSelectSlot }: Props) {
  return (
    <div className="font-poppins w-full h-full  py-6">
      <Spin spinning={loading}>
        <div className="flex flex-row font-poppins w-full ">
          {schedule.length ? <Arrow mode="left" onClick={() => onShiftDays(-5)} /> : null}

          {schedule.map((day) => (
            <div key={day.data} className="flex flex-col w-1/5 text-center">
              <div className="flex flex-row w-full items-center text-center justify-center">
                {day.dzien.skrocony},<br />
                {day.dzien.data}
              </div>

              {day.godziny.map((slot, index) => {
                const isSelected = `${data} ${godzina}` === `${day.data} ${slot.symbol}`;
                return (
                  <div key={index} className="flex flex-row w-full items-center text-center my-2 justify-center h-10 px-1">
                    <div
                      onClick={() => onSelectSlot(slot, day)}
                      className={`flex flex-col justify-center ${slot.symbol !== "-" ? "border-[1px] border-bottega-brown cursor-pointer" : ""} justify-center w-full py-1 h-12 items-center text-center ${isSelected ? "bg-bottega-brown text-white" : ""}
                          ${slot.readonly ? `cursor-auto pointer-events-none text-xs text-bottega-gray ${isSelected ? " text-white" : ""}` : ""}
                          `}
                    >
                      <Tooltip title={slot.liczba_zapisanych ? <small>{slot.liczba_zapisanych} zapisane</small> : null}>
                        <span>{slot.symbol.substring(0, 5)}</span>
                        <div className={`text-xs text-bottega-gray ${isSelected ? " text-white" : ""}`}>
                          {(slot.liczba_zapisanych ?? 0) > 0 && !slot.readonly && (
                            <>
                              <UserOutlined /> <small>{slot.liczba_zapisanych} zapisane</small>
                            </>
                          )}
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {schedule.length ? <Arrow mode="right" onClick={() => onShiftDays(5)} /> : null}
        </div>
      </Spin>
    </div>
  );
}
