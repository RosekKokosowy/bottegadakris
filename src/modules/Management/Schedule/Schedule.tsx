'use client';

import { Tabs } from "antd";
import { ScheduleTable } from "./ScheduleTable";
import { WorkingHours } from "./WorkingHours";

export default function Schedule() {
  return (
    <Tabs
      defaultActiveKey="1"
      centered
      items={[
        {
          key: "1",
          label: "Grafik",
          children: (
            <div className="flex justify-center items-center pt-10">
              <div className="w-full px-2 md:px-0">
                <ScheduleTable />
              </div>
            </div>
          ),
        },
        {
          key: "2",
          label: "Godziny pracy",
          children: (
            <div className="flex justify-center items-center pt-10">
              <WorkingHours />
            </div>
          ),
        },
      ]}
    />
  );
}
