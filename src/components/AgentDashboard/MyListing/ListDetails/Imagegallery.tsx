"use client";

import { useState } from "react";
import Image from "next/image";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [active, setActive] = useState(0);

  if (!images.length) return null;

  const prev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-2">
      {/* Main Image */}
      <div className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden bg-gray-100 group">
        <Image
          src={images[active]}
          alt={`${title} - photo ${active + 1}`}
          fill
          className="object-cover transition-all duration-300"
          unoptimized
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <LeftOutlined className="text-xs text-gray-700" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <RightOutlined className="text-xs text-gray-700" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full">
              {active + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative flex-shrink-0 w-16 h-11 rounded-lg overflow-hidden border-2 transition-all ${
                i === active ? "border-[#0d9488]" : "border-transparent opacity-60 hover:opacity-90"
              }`}
            >
              <Image src={src} alt={`thumb-${i}`} fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}