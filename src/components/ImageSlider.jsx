// src/components/ImageSlider.jsx
"use client";

import { useState, useEffect, Fragment } from "react";
import Image from "next/image";

/**
 * ImageSlider displays multiple categories (rows) that slide together,
 * each row cycles independently when its own images end.
 *
 * Props:
 * - categories: Array<{ title: string, items: {src: string, caption: string}[] }>
 * - visibleCount: how many items to show per row at once (default 3)
 * - interval: slide interval in ms (default 3000)
 */
export default function ImageSlider({
  categories = [],
  visibleCount = 3,
  interval = 3000,
}) {
  // current slide index per row
  const [currentIdxs, setCurrentIdxs] = useState(
    categories.map(() => 0)
  );

  // auto‑advance timer
  useEffect(() => {
    const iv = setInterval(() => {
      setCurrentIdxs((prev) =>
        prev.map((curr, row) => {
          const len = categories[row].items.length;
          return (curr + 1) % len;
        })
      );
    }, interval);
    return () => clearInterval(iv);
  }, [categories, interval]);

  // percentage to slide for this row
  const shiftPct = (row) =>
    (currentIdxs[row] * 100) / visibleCount;

  return (
    <div className="max-w-4xl mx-auto my-12">
      {categories.map(({ title, items }, row) => (
        <div key={row} className="mb-8">
          {title && (
            <h3 className="mb-9 text-2xl font-bold text-white text-center">
              {title}
            </h3>
          )}
          <div className="overflow-hidden w-full">
            <div
              className="flex gap-4 transition-transform duration-500"
              style={{
                width: "100%",
                transform: `translateX(-${shiftPct(row)}%)`,
              }}
            >
              {items.map(({ src, caption }, idx) => (
                <div
                  key={idx}
                  className="relative flex-shrink-0"
                  style={{
                    width: `${100 / visibleCount}%`,
                    height: "100px",
                  }}
                >
                  <Image
                    src={src}
                    alt={caption}
                    width={50}
                    height={50}
                    className="object-contain rounded-lg mx-auto"
                  />
                  <p className="mt-2 text-white text-sm text-center">
                    {caption.split("\n").map((line, i, arr) => (
                      <Fragment key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </Fragment>
                    ))}
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