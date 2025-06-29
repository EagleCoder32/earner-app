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
  // paused flags per row
  const [paused, setPaused] = useState(
    categories.map(() => false)
  );
  // refs to each row’s scroll container
  const scrollContainers = useRef([]);

  // Pause/resume helpers
  const pause = (row) =>
    setPaused((p) => p.map((v, i) => (i === row ? true : v)));
  const resume = (row) =>
    setPaused((p) => p.map((v, i) => (i === row ? false : v)));

  // When user scrolls manually: snap and update index
  const handleUserScroll = (row) => {
    const cont = scrollContainers.current[row];
    if (!cont) return;
    const slot = cont.clientWidth / visibleCount;
    const idx = Math.round(cont.scrollLeft / slot);
    setCurrentIdxs((p) => p.map((v, i) => (i === row ? idx : v)));
    pause(row);
    // resume after one interval
    setTimeout(() => resume(row), interval);
  };

  // Autoplay effect (scrolls, unless paused)
  useEffect(() => {
    const iv = setInterval(() => {
      setCurrentIdxs((prev) =>
        prev.map((curr, row) => {
          if (paused[row]) return curr;
          const len = categories[row].items.length;
          const next = (curr + 1) % len;

          // smooth‑scroll the container
          const cont = scrollContainers.current[row];
          if (cont) {
            const slot = cont.clientWidth / visibleCount;
            cont.scrollTo({
              left: next * slot,
              behavior: "smooth",
            });
          }
          return next;
        })
      );
    }, interval);
    return () => clearInterval(iv);
  }, [categories, interval, paused, visibleCount]);

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
            className="overflow-x-auto scrollbar-hide w-full"
            ref={(el) => (scrollContainers.current[row] = el)}
            onScroll={() => handleUserScroll(row)}
            onMouseEnter={() => pause(row)}
            onMouseLeave={() => resume(row)}
            onTouchStart={() => pause(row)}
            onTouchEnd={() => resume(row)}
          >
            <div
              className="flex gap-4 snap-x snap-mandatory"
              style={{ width: "100%" }}
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