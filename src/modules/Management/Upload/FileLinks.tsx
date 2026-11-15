'use client';

import { CopyOutlined, DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { App } from "antd";
import { getAbsoluteUrl } from "@/utils/files";

export const splitLinks = (value?: string) => (value ?? "").split(",").map((link) => link.trim()).filter(Boolean);

/** Form control listing the links stored in a comma-separated field, with delete/download/copy. */
export function FileLinks({ value, onChange, copyButton = false }: { value?: string; onChange?: (value: string) => void; copyButton?: boolean }) {
  const { message } = App.useApp();
  const links = splitLinks(value);

  const remove = (link: string) => onChange?.(links.filter((l) => l !== link).join(","));
  const copy = (link: string) => {
    navigator.clipboard.writeText(link);
    message.success("Skopiowano do schowka!");
  };

  const action = "opacity-0 group-hover:opacity-100 transition duration-300 px-1 hover:bg-[rgba(0,0,0,0.06)]";

  return (
    <ul className="w-fit space-y-1 mt-1 !list-none !ml-0">
      {links.map((link) => (
        <li key={link} className="flex items-center gap-x-3 group hover:bg-[rgba(0,0,0,0.04)]">
          <span>{link}</span>
          <div className="flex gap-x-2 items-center">
            <button type="button" onClick={() => remove(link)} title="Delete link" className={action}>
              <DeleteOutlined />
            </button>
            <a download href={getAbsoluteUrl(link)} title="Download link" className={`${action} !text-black`}>
              <DownloadOutlined />
            </a>
            {copyButton && (
              <button type="button" onClick={() => copy(link)} title="Copy link" className={action}>
                <CopyOutlined />
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
