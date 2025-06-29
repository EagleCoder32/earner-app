// src/components/ImageSlider.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

/**
 * ImageSlider displays multiple categories (rows) that slide together,
 * but each row cycles independently when its own images end.
 *
 * Props:
 * - categories: Array<{ title: string, items: {src: string, caption: string}[] }>
 * - visibleCount: how many items to show per row at once (default 3)
 * - interval: slide interval in ms (default 3000)
 */
export default function ImageSlider({ categories, visibleCount = 3, interval = 3000 }) {
  // Ensure categories is an array
  const cats = Array.isArray(categories) ? categories : [];

  // Track current index for each row independently
  const [currentIdxs, setCurrentIdxs] = useState(
    cats.map(() => 0)
  );

  useEffect(() => {
    // On each interval tick, advance each row's index independently
    const iv = setInterval(() => {
      setCurrentIdxs((prev) =>
        prev.map((curr, row) => {
          const len = cats[row].items.length;
          return (curr + 1) % len;
        })
      );
    }, interval);
    return () => clearInterval(iv);
  }, [cats, interval]);

  // Calculate shift percent for a given row index
  const shiftPct = (row) => (100 / visibleCount) * currentIdxs[row];

  return (
    <div className="max-w-4xl mx-auto my-12">
      {cats.map(({ title, items }, row) => (
        <div key={row} className="mb-8">
          {/* Static row title */}
          {title && (
            <h3 className="mb-4 text-2xl font-bold text-gray-800 text-center">
              {title}
            </h3>
          )}

          {/* Sliding row of images */}
          <div className="overflow-hidden">
            <div
              className="flex space-x-4 transition-transform duration-500"
              style={{
                width: `${(items.length / visibleCount) * 100}%`,
                transform: `translateX(-${shiftPct(row)}%)`,
              }}
            >
              {items.map(({ src, caption }, idx) => (
                <div
                  key={idx}
                  className="relative flex-shrink-0"
                  style={{ width: `${100 / visibleCount}%`, height: "100px" }}
                >
                  <Image
                    src={src}
                    alt={caption}
                    width={50}
                    height={50}
                    className="object-contain rounded-lg mx-auto"
                  />
                  <p className="mt-2 text-gray-700 text-sm text-center">
                    {caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}