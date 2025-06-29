// src/components/ImageSlider.jsx
"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import Image from "next/image";

export default function ImageSlider({
  categories = [],
  visibleCount = 3,
  interval = 3000,
}) {
  // current slide index per row
  const [currentIdxs, setCurrentIdxs] = useState(
    categories.map(() => 0)
  );

  // refs to each row’s scroll container
  const scrollContainers = useRef([]);

  // When user scrolls manually, recompute currentIdx
  const handleUserScroll = (row) => {
    const cont = scrollContainers.current[row];
    if (!cont) return;
    const slotWidth = cont.clientWidth / visibleCount;
    const idx = Math.round(cont.scrollLeft / slotWidth);
    setCurrentIdxs((prev) =>
      prev.map((v, i) => (i === row ? idx : v))
    );
  };

  // auto‑advance timer (unchanged)
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
        <div key={row} className="mb-16">
          {title && (
            <h3 className="mb-9 text-2xl font-bold text-white text-center">
              {title}
            </h3>
          )}

          <div
          className="overflow-x-auto scrollbar-hide w-full md:overflow-x-hidden"


            ref={(el) => (scrollContainers.current[row] = el)}
            onScroll={() => handleUserScroll(row)}
          >
            <div
              className="flex gap-4 snap-x snap-mandatory"
              style={{
                width: "100%",
                transform: `translateX(-${shiftPct(row)}%)`,
                transition: "transform 0.5s ease",
              }}
            >
              {items.map(({ src, caption }, idx) => (
                <div
                  key={idx}
                  className="relative flex-shrink-0 snap-start"
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

