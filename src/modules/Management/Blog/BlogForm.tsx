'use client';

import { App, Button, Form, Input, Select, Spin } from "antd";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useServer } from "@/hooks/useServer";
import { IBlogPost, IBlogStatus } from "@/types/IBlogPost";
import { FileLinks, splitLinks } from "../Upload/FileLinks";
import { UploadForm } from "../Upload/UploadForm";
import { HtmlEditor } from "./HtmlEditor";

interface IBlogFormValues {
  tytul: string;
  slug: string;
  status: IBlogStatus;
  tresc: string;
  /** Comma-separated links; the first one is the post's cover image. */
  attachments: string;
}

/** Create (no id) or edit a blog post. */
export default function BlogForm({ id }: { id?: number }) {
  const { message } = App.useApp();
  const router = useRouter();
  const server = useServer();
  const [form] = Form.useForm<IBlogFormValues>();
  const { data: post, loading } = useFetch<IBlogPost | null>(id ? `/olimp/blog/posts/${id}` : null, null);

  useEffect(() => {
    if (post) form.setFieldsValue({ ...post, attachments: post.attachments.join(",") });
  }, [form, post]);

  const onFinish = async (values: IBlogFormValues) => {
    const body = { ...values, attachments: splitLinks(values.attachments) };
    try {
      if (id) {
        await server.put(`/olimp/blog/posts/${id}`, body);
        message.success("Artykuł został zaktualizowany.");
      } else {
        await server.post("/olimp/blog/posts", body);
        message.success("Artykuł został zapisany.");
      }
      router.push("/olimp/blog");
    } catch (error) {
      message.error(`Wystąpił błąd: ${(error as AxiosError<{ message?: string }>).response?.data?.message ?? ""}`);
    }
  };

  return (
    <div className="flex justify-center items-center pt-10">
      <div className="lg:w-2/3 mx-auto px-1">
        <Spin spinning={loading}>
          <h1 className="pl-2 font-poppins font-medium text-xl">{id ? "Edytuj artykuł" : "Nowy artykuł"}</h1>
          <Form className="grid gap-2" form={form} onFinish={onFinish} initialValues={{ status: "AKTYWNY" }}>
            <Form.Item className="col-span-12" name="tytul" rules={[{ required: true, message: "Podaj tytuł" }]}>
              <Input placeholder="Tytuł" />
            </Form.Item>
            <Form.Item className="col-span-12 sm:col-span-6" name="slug" rules={[{ required: true, message: "Podaj slug" }]}>
              <Input placeholder="Slug" />
            </Form.Item>
            <Form.Item className="col-span-12 sm:col-span-6" name="status" rules={[{ required: true }]}>
              <Select
                placeholder="Status"
                options={[
                  { value: "AKTYWNY", label: "Aktywny" },
                  { value: "NIEAKTYWNY", label: "Nieaktywny" },
                ]}
              />
            </Form.Item>
            <Form.Item name="tresc" className="col-span-12" rules={[{ required: true, message: "Wpisz treść" }]}>
              <HtmlEditor />
            </Form.Item>
            <UploadForm uploadButtonCaption="Wybierz plik" multi={false} onLinks={(links) => form.setFieldValue("attachments", links.join(","))} className="col-span-12" accept=".jpg,.jpeg,.png">
              <Form.Item label="Link do pobrania" rules={[{ required: true, message: "Dodaj zdjęcie" }]} name="attachments" className="!w-full">
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
      </div>
    </div>
  );
}
