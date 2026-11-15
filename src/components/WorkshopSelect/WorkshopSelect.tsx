'use client';

import { Form, Select } from "antd";
import { IWorkshop } from "@/types/IWorkshop";

const GROUP_WORKSHOP = "GRUPY ZORGANIZOWANE";

interface Props {
  name: string;
  workshops: IWorkshop[];
  required?: boolean;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

export function WorkshopSelect({ name, workshops, required, onChange, disabled }: Props) {
  return (
    <Form.Item name={name} rules={[{ required: required ?? false, message: "Wybierz rodzaj warsztatu" }]} className="w-full">
      <Select
        style={{ width: "100%" }}
        placeholder="Rodzaj warsztatu"
        onChange={onChange}
        disabled={disabled}
        options={workshops.map((el) => ({
          value: el.id,
          label: el.nazwa === GROUP_WORKSHOP ? `${el.nazwa} - cena ustalana indywidualnie (${el.sloty}H)` : `${el.nazwa} - ${el.cena}zł (${el.sloty}H)`,
        }))}
      />
    </Form.Item>
  );
}
