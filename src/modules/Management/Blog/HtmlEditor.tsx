'use client';

import { Input } from "antd";

/** HTML textarea with a live preview; works as an antd form control. */
export function HtmlEditor({ value, onChange }: { value?: string; onChange?: (value: string) => void }) {
  return (
    <div className="flex gap-5">
      <Input.TextArea rows={20} placeholder="Wprowadź treść..." value={value} onChange={(e) => onChange?.(e.target.value)} className="w-1/2 h-96" />
      {/* Preview of the admin's own HTML, rendered the same way as on the blog page. */}
      <div className="w-1/2" dangerouslySetInnerHTML={{ __html: value ?? "" }}></div>
    </div>
  );
}
