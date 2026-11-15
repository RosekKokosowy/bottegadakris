'use client';

import { Modal } from "antd";
import { ChevronLeft, ChevronRight, Info, X } from "lucide-react";
import { useState } from "react";
import { UploadedImage } from "@/components/UploadedImage/UploadedImage";
import { IGalleryItem, IGallerySize } from "@/types/IGalleryItem";

const sizeClasses: Record<IGallerySize, string> = {
  tall: "md:row-span-2 col-span-1 row-span-1",
  wide: "row-span-1 md:col-span-2 col-span-1",
  small: "row-span-1 col-span-1",
  medium: "row-span-1 col-span-1",
  large: "md:row-span-2 lg:col-span-2 md:col-span-3 row-span-1 col-span-1",
  "small-wide": "row-span-1 md:col-span-2 col-span-1",
  "small-tall": "md:row-span-2 col-span-1 row-span-1",
  "medium-wide": "row-span-1 md:col-span-2 col-span-1",
  "medium-tall": "md:row-span-2 col-span-1 row-span-1",
};

export function MasonryGallery({ items }: { items: IGalleryItem[] }) {
  const [selected, setSelected] = useState<number | null>(null);

  const navigate = (step: 1 | -1) => {
    if (selected === null) return;
    setSelected((selected + step + items.length) % items.length);
  };

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Brak zdjęć w galerii.</p>
      </div>
    );
  }

  const current = selected !== null ? items[selected] : undefined;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto py-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4">
          {items.map((image, index) => (
            <div
              key={image.id}
              className={`${sizeClasses[image.size] ?? "row-span-1 col-span-1"} group cursor-pointer overflow-hidden relative transition-transform duration-300 hover:z-10 hover:shadow-xl hover:scale-[1.02]`}
              onClick={() => setSelected(index)}
            >
              <div className="relative h-full w-full overflow-hidden">
                <UploadedImage
                  link={image.src}
                  alt={image.alt}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110"
                  sizes="(min-width: 1024px) 50vw, (min-width: 768px) 66vw, 100vw"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <h3 className="text-white text-lg font-light mb-1">{image.title}</h3>
                  <p className="text-white text-xs font-light opacity-80 line-clamp-2">{image.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={current !== undefined}
        onCancel={() => setSelected(null)}
        footer={null}
        closable={false}
        width="100vw"
        style={{ top: 0, padding: 0 }}
        styles={{
          container: { padding: 0 },
          body: {
            height: "100vh",
            overflow: "hidden",
            padding: 0,
            margin: 0,
            backgroundColor: "rgba(0,0,0,0.95)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          },
        }}
      >
        {current && selected !== null && (
          <>
            <div
              className="absolute inset-0 bg-[#b39b8e] opacity-10"
              style={{ backgroundImage: "radial-gradient(circle, rgba(179,155,142,0.2) 0%, rgba(0,0,0,0) 70%)" }}
            ></div>

            <button aria-label="Zamknij" className="absolute top-6 right-6 text-white p-2 hover:bg-white/20 rounded-full z-10" onClick={() => setSelected(null)}>
              <X className="w-6 h-6" />
            </button>

            <button aria-label="Poprzednie zdjęcie" className="absolute left-6 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/20 rounded-full z-10" onClick={() => navigate(-1)}>
              <ChevronLeft className="w-8 h-8" />
            </button>

            <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center">
                <UploadedImage link={current.src} alt={current.alt} className="object-contain max-h-full max-w-full" sizes="(min-width: 1024px) 1024px, 100vw" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm text-white p-6 transform transition-transform duration-500">
                <div className="flex items-start gap-4">
                  <Info className="w-5 h-5 mt-1 text-[#b39b8e]" />
                  <div>
                    <h3 className="text-2xl font-light mb-2 text-gray-300">{current.title}</h3>
                    <p className="text-sm text-gray-300">{current.description}</p>
                    {current.link_url && (
                      <a
                        href={current.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bottega-brown hover:text-bottega-beige transition-colors duration-300 text-base  mt-2 inline-block"
                      >
                        {current.link_tytul || "Otwórz link"}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button aria-label="Następne zdjęcie" className="absolute right-6 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/20 rounded-full z-10" onClick={() => navigate(1)}>
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="absolute bottom-6 left-6 text-white text-sm">
              {selected + 1} / {items.length}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
