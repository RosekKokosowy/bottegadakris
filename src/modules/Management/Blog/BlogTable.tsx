'use client';

import { EllipsisOutlined } from "@ant-design/icons";
import { App, Button, Dropdown, Form, Input, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useServer } from "@/hooks/useServer";
import { IBlogPost } from "@/types/IBlogPost";
import { getAbsoluteUrl } from "@/utils/files";

export default function BlogTable() {
  const { message } = App.useApp();
  const server = useServer();
  const [search, setSearch] = useState("");
  const { data, loading, reload } = useFetch<IBlogPost[]>("/olimp/blog", [], { search });

  const handleDelete = async (id: number) => {
    try {
      await server.delete(`/olimp/blog/posts/${id}`);
      reload();
      message.success("Post został usunięty.");
    } catch {
      message.error("Wystąpił błąd podczas usuwania postu");
    }
  };

  const columns: ColumnsType<IBlogPost> = [
    {
      title: "Zdjęcie",
      dataIndex: "attachments",
      key: "attachments",
      render: (files: string[]) =>
        files[0] ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail of an upload or external link
          <img className="h-24 w-auto min-w-16 max-w-32 object-cover" src={getAbsoluteUrl(files[0])} alt="Blog post image" />
        ) : null,
    },
    { title: "Tytuł", dataIndex: "tytul", key: "tytul" },
    { title: "Slug", dataIndex: "slug", key: "slug" },
    { title: "Data utworzenia", dataIndex: "data_utworzenia", key: "data_utworzenia" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Akcje",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: "edit", label: <Link href={`/olimp/blog/${record.id}`}>Edytuj</Link> },
              { key: "delete", label: "Usuń", onClick: () => handleDelete(record.id) },
            ],
          }}
          trigger={["click"]}
        >
          <Button icon={<EllipsisOutlined />} aria-label="Akcje" />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="flex justify-center items-center pt-10">
      <div className="w-full px-2 md:px-0">
        <div className="flex flex-col-reverse md:flex-row justify-between">
          <Form name="search" layout="inline" onFinish={({ search }) => setSearch(search || "")} className="w-full mb-4 !basis-full">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:items-center">
              <div className="flex-1 max-w-80 w-full">
                <Form.Item name="search" label="Blog:">
                  <Input placeholder="Szukaj blogów" />
                </Form.Item>
              </div>
              <div className="w-full sm:w-auto flex flex-row gap-2">
                <Form.Item>
                  <Button className="bg-bottega-dark-brown/70 hover:bg-bottega-brown text-white transition duration-300" htmlType="submit">
                    Szukaj
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
          <Link className="self-end mb-2 md:mb-4" href="/olimp/blog/create">
            <Button type="default">+ Dodaj post</Button>
          </Link>
        </div>
        <Table columns={columns} dataSource={data} loading={loading} pagination={false} rowKey="id" scroll={{ x: "min-content" }} />
      </div>
    </div>
  );
}
