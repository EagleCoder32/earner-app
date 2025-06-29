// src/components/ImageSlider.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

/**
 * ImageSlider accepts `images` as either:
 * 1) An array of arrays of image objects (flat mode, no titles)
 *    e.g. [[{src, caption}, ...], ...]
 * 2) An array of groups with title + items
 *    e.g. [{ title: 'Cash', items: [{src,caption}, ...] }, ...]
 */
export default function ImageSlider({ images }) {
  const visibleCount = 3; // how many columns to show at once

  // Normalize input into groups: { title, items[] }
  const groups = Array.isArray(images[0])
    ? images.map((items) => ({ title: "", items }))
    : images;

  // Extract items for sliding and titles for headings
  const columns = groups.map((g) => g.items);
  const titles = groups.map((g) => g.title || "");

  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % columns.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [columns.length]);

  const shiftPercent = (100 / visibleCount) * currentIdx;

  return (
    <div className="max-w-4xl mx-auto my-12 overflow-hidden">
      <div
        className="flex space-x-4 transition-transform duration-500"
        style={{
          width: `${(columns.length / visibleCount) * 100}%`,
          transform: `translateX(-${shiftPercent}%)`,
        }}
      >
        {columns.map((colImages, colIdx) => (
          <div
            key={colIdx}
            className="grid gap-4 flex-shrink-0"
            style={{
              width: `${100 / visibleCount}%`,
              gridTemplateRows: `auto repeat(${colImages.length}, minmax(0, 1fr))`,
            }}
          >
            {/* Render group title if provided */}
            {titles[colIdx] && (
              <div className="col-span-full mb-2 text-center">
                <h3 className="text-lg font-semibold text-white">
                  {titles[colIdx]}
                </h3>
              </div>
            )}

            {/* Render each image */}
            {colImages.map(({ src, caption }, idx) => (
              <div key={idx} className="relative" style={{ height: "100px" }}>
                <Image
                  src={src}
                  alt={caption}
                  width={50}
                  height={50}
                  className="object-contain rounded-lg mx-auto"
                />
                <p className="mt-2 text-white text-sm text-center">
                  {caption}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}