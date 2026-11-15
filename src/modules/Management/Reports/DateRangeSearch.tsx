'use client';

import { Button, Col, DatePicker, Form, Input, Row } from "antd";
import dayjs from "dayjs";

export interface IDateRangeFilter {
  dataOd: string;
  dataDo: string;
  client?: string;
}

export const todayFilter = (): IDateRangeFilter => {
  const today = dayjs().format("YYYY-MM-DD");
  return { dataOd: today, dataDo: today };
};

/** "Data od - do" + client search used by the voucher and payment reports. */
export function DateRangeSearch({ onSearch, clientPlaceholder }: { onSearch: (filter: IDateRangeFilter) => void; clientPlaceholder: string }) {
  const onFinish = ({ dateRange, client }: { dateRange: [dayjs.Dayjs, dayjs.Dayjs]; client?: string }) => {
    onSearch({ dataOd: dateRange[0].format("YYYY-MM-DD"), dataDo: dateRange[1].format("YYYY-MM-DD"), client: client || undefined });
  };

  return (
    <div className="flex flex-col items-center">
      <Form onFinish={onFinish} initialValues={{ dateRange: [dayjs(), dayjs()] }}>
        <Row gutter={16}>
          <Col>
            <Form.Item name="dateRange" label="Data od - do" rules={[{ type: "array", required: true, message: "Proszę wybrać zakres dat" }]}>
              <DatePicker.RangePicker format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="client" label="Klient">
              <Input placeholder={clientPlaceholder} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button className="bg-bottega-dark-brown/70 hover:bg-bottega-brown text-white transition duration-300" htmlType="submit">
                Szukaj
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
