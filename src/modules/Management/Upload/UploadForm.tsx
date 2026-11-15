'use client';

import { FileAddOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Space, Upload, UploadFile } from "antd";
import { ReactNode, useState } from "react";
import { useServer } from "@/hooks/useServer";
import { useTrace } from "@/hooks/useTrace";

interface Props {
  uploadButtonCaption?: string;
  /** Receives the links of uploaded files (or a pasted link). */
  onLinks: (links: string[]) => void;
  multi?: boolean;
  className?: string;
  accept?: string;
  children?: ReactNode;
}

/** Pick files, send them to the server, or paste a link to an existing file. */
export function UploadForm({ uploadButtonCaption, onLinks, multi = true, className, accept, children }: Props) {
  const { message } = App.useApp();
  const server = useServer();
  const { log } = useTrace();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [manualLink, setManualLink] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach((file) => formData.append("files", file as unknown as File));

    setUploading(true);
    try {
      const { data } = await server.post<{ urls: string[] }>("/olimp/files/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      message.success("Sukces.");
      setFileList([]);
      onLinks(data.urls);
    } catch (error) {
      log("[ErrorProvider]", error, "file upload has failed.");
      message.error("Wysyłka nie powiodła się.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`bg-white flex flex-col items-center justify-center gap-5 rounded-xl  p-2 sm:p-6 md:p-10 ${className ?? ""}`}>
      <Upload
        multiple={multi}
        accept={accept}
        disabled={uploading}
        fileList={fileList}
        beforeUpload={(file) => {
          setFileList((prev) => (multi ? [...prev, file] : [file]));
          return false;
        }}
        onRemove={(file) => setFileList((prev) => prev.filter((item) => item.uid !== file.uid))}
      >
        <Button className="h-full" icon={<PlusOutlined />}>
          <span className="text-wrap">{uploadButtonCaption || "Wybierz pliki do wysłania na serwer"}</span>
        </Button>
      </Upload>
      <Button loading={uploading} disabled={fileList.length === 0} onClick={handleUpload} icon={<UploadOutlined />}>
        Wyślij
      </Button>
      <Form.Item label="Dodaj link do pliku" className="!w-full">
        <Space.Compact className="w-full">
          <Input value={manualLink} onChange={(e) => setManualLink(e.target.value)} />
          <Button
            icon={<FileAddOutlined />}
            disabled={manualLink.trim() === ""}
            aria-label="Dodaj link"
            onClick={() => {
              onLinks([manualLink.trim()]);
              setManualLink("");
            }}
          />
        </Space.Compact>
      </Form.Item>
      {children}
    </div>
  );
}
