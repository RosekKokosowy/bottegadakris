'use client';

import { Form, Select } from "antd";

const getPersonLabel = (count: number) => {
  if (count === 1) return "1 osoba";
  if (count >= 2 && count <= 4) return `${count} osoby`;
  return `${count} osób`;
};

export function PersonSelect({ name, maxOsob, required }: { name: string; maxOsob: number; required?: boolean }) {
  return (
    <Form.Item name={name} rules={[{ required: required ?? false, message: "Wybierz liczbę osób" }]} className="w-full">
      <Select
        style={{ width: "100%" }}
        placeholder="Liczba osób"
        options={Array.from({ length: maxOsob }, (_, index) => ({ value: index + 1, label: getPersonLabel(index + 1) }))}
      />
    </Form.Item>
  );
}
