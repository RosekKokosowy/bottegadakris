'use client';

import { EllipsisOutlined } from "@ant-design/icons";
import { App, Button, Dropdown, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { useFetch } from "@/hooks/useFetch";
import { useServer } from "@/hooks/useServer";
import { IGalleryItem } from "@/types/IGalleryItem";
import { getAbsoluteUrl } from "@/utils/files";
import { gallerySizeLabels } from "./gallerySizes";

export default function GalleryTable() {
  const { message } = App.useApp();
  const server = useServer();
  const { data, loading, reload } = useFetch<IGalleryItem[]>("/olimp/gallery", []);

  const handleDelete = async (id: number) => {
    try {
      await server.delete(`/olimp/gallery/${id}`);
      reload();
      message.success("Obraz został usunięty.");
    } catch {
      message.error("Wystąpił błąd podczas usuwania obrazu");
    }
  };

  const columns: ColumnsType<IGalleryItem> = [
    {
      title: "Zdjęcie",
      dataIndex: "src",
      key: "src",
      // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail of an upload or external link
      render: (src: string) => <img className="h-24  min-w-16 w-full object-cover" src={getAbsoluteUrl(src)} alt="Obraz galerii" />,
    },
    { title: "Tytuł", dataIndex: "title", key: "title" },
    { title: "Opis", dataIndex: "description", key: "description" },
    {
      title: "Link",
      dataIndex: "link_url",
      key: "link_url",
      render: (linkUrl: string | null, record) =>
        linkUrl ? (
          <a className="text-bottega-brown hover:text-bottega-dark-brown transition-colors duration-300" href={linkUrl} target="_blank" rel="noopener noreferrer">
            {record.link_tytul || "Otwórz link"}
          </a>
        ) : null,
    },
    { title: "Rozmiar", dataIndex: "size", key: "size", render: (size: IGalleryItem["size"]) => gallerySizeLabels[size] ?? "Nieznany rozmiar" },
    {
      title: "Akcje",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: "edit", label: <Link href={`/olimp/gallery/${record.id}`}>Edytuj</Link> },
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
        <div className="flex flex-col-reverse md:flex-row justify-end">
          <Link className="self-end mb-2 md:mb-4" href="/olimp/gallery/create">
            <Button type="default">+ Dodaj obraz</Button>
          </Link>
        </div>
        <Table columns={columns} dataSource={data} loading={loading} pagination={false} scroll={{ x: "min-content" }} rowKey="id" />
      </div>
    </div>
  );
}
