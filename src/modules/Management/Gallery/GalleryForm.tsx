'use client';

import { App, Button, Form, Input, Modal, Select, Spin } from "antd";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useServer } from "@/hooks/useServer";
import { MasonryGallery } from "@/modules/Gallery/MasonryGallery";
import { IGalleryItem, IGalleryItemRequest } from "@/types/IGalleryItem";
import { FileLinks } from "../Upload/FileLinks";
import { UploadForm } from "../Upload/UploadForm";
import { gallerySizeLabels } from "./gallerySizes";

const REQUIRED: (keyof IGalleryItemRequest)[] = ["title", "description", "alt", "size", "src"];

/** Create (no id) or edit a gallery item, with a preview of the whole gallery. */
export default function GalleryForm({ id }: { id?: number }) {
  const { message } = App.useApp();
  const router = useRouter();
  const server = useServer();
  const [form] = Form.useForm<IGalleryItemRequest>();
  const [previewOpen, setPreviewOpen] = useState(false);
  const { data: item, loading } = useFetch<IGalleryItem | null>(id ? `/olimp/gallery/${id}` : null, null);
  const { data: allItems } = useFetch<IGalleryItem[]>(previewOpen ? "/olimp/gallery" : null, []);

  const values = Form.useWatch([], form) as IGalleryItemRequest | undefined;
  const canPreview = REQUIRED.every((key) => values?.[key]);

  useEffect(() => {
    if (item) form.setFieldsValue(item);
  }, [form, item]);

  const previewItems: IGalleryItem[] = values
    ? id
      ? allItems.map((existing) => (existing.id === id ? { ...existing, ...values } : existing))
      : [{ ...values, id: -1 }, ...allItems]
    : allItems;

  const onFinish = async (submitted: IGalleryItemRequest) => {
    try {
      if (id) {
        await server.put(`/olimp/gallery/${id}`, submitted);
        message.success("Obraz został zaktualizowany.");
      } else {
        await server.post("/olimp/gallery", submitted);
        message.success("Obraz został zapisany.");
      }
      router.push("/olimp/gallery");
    } catch (error) {
      message.error(`Wystąpił błąd: ${(error as AxiosError<{ message?: string }>).response?.data?.message ?? ""}`);
    }
  };

  return (
    <div className="flex justify-center items-center pt-10">
      <div className="lg:w-2/3 mx-auto px-1">
        <Spin spinning={loading}>
          <div className="flex flex-row justify-between mb-4">
            <h1 className="pl-2 font-poppins font-medium text-xl">{id ? "Edytuj element galerii" : "Nowy element galerii"}</h1>
            {canPreview && <Button onClick={() => setPreviewOpen(true)}>Podgląd</Button>}
          </div>
          <Form className="grid gap-2" form={form} onFinish={onFinish}>
            <Form.Item className="col-span-12" name="title" rules={[{ required: true, message: "Podaj tytuł" }]}>
              <Input placeholder="Tytuł" />
            </Form.Item>
            <Form.Item className="col-span-12" name="description" rules={[{ required: true, message: "Podaj opis" }]}>
              <Input placeholder="Opis" />
            </Form.Item>
            <Form.Item className="col-span-12 md:col-span-6" name="alt" rules={[{ required: true, message: "Podaj tekst alternatywny" }]}>
              <Input placeholder="Tekst alternatywny (alt)" />
            </Form.Item>
            <Form.Item className="col-span-12 md:col-span-6" name="size" rules={[{ required: true, message: "Wybierz rozmiar" }]}>
              <Select placeholder="Rozmiar" options={Object.entries(gallerySizeLabels).map(([value, label]) => ({ value, label }))} />
            </Form.Item>
            <Form.Item className="col-span-12 md:col-span-6" name="link_url">
              <Input placeholder="Link URL" />
            </Form.Item>
            <Form.Item className="col-span-12 md:col-span-6" name="link_tytul">
              <Input placeholder="Link Tytuł" />
            </Form.Item>
            <UploadForm uploadButtonCaption="Wybierz zdjęcie" multi={false} onLinks={(links) => form.setFieldValue("src", links.join(","))} className="col-span-12" accept=".jpg,.jpeg,.png">
              <Form.Item label="Link do pobrania" rules={[{ required: true, message: "Dodaj zdjęcie" }]} name="src" className="!w-full">
                <FileLinks />
              </Form.Item>
            </UploadForm>
            <Form.Item className="flex justify-end col-span-12 mt-2">
              <Button className="bg-bottega-dark-brown/70 hover:bg-bottega-brown text-white transition duration-300" htmlType="submit">
                Zapisz
              </Button>
            </Form.Item>
          </Form>
        </Spin>

        <Modal
          open={previewOpen}
          onCancel={() => setPreviewOpen(false)}
          footer={null}
          width="90vw"
          style={{ top: 0, padding: 0 }}
          styles={{
            container: { padding: 0 },
            body: { height: "100vh", overflow: "auto", padding: 0, margin: 0, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" },
          }}
        >
          <div className="w-full h-full ">
            <div className="max-w-6xl mx-auto">
              <MasonryGallery items={previewItems} />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
