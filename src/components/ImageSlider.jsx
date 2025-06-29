// src/components/ImageSlider.jsx
"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import Image from "next/image";

export default function ImageSlider({
  categories = [],
  visibleCount = 3,
  interval = 3000,
}) {
  const [currentIdxs, setCurrentIdxs] = useState(categories.map(() => 0));
  const [isInteracting, setIsInteracting] = useState(categories.map(() => false));
  const [isVisible, setIsVisible] = useState(false);
  const sliderRef = useRef(null);
  const scrollContainers = useRef([]);

  // Visibility observer
  useEffect(() => {
    if (!sliderRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(sliderRef.current);
    return () => obs.disconnect();
  }, []);

  // Manual scroll
  const handleUserScroll = (row) => {
    const cont = scrollContainers.current[row];
    if (!cont) return;
    const slot = cont.clientWidth / visibleCount;
    const idx = Math.round(cont.scrollLeft / slot);
    setCurrentIdxs((prev) => prev.map((v, i) => (i === row ? idx : v)));
  };

  // Auto-advance when visible
  useEffect(() => {
    let iv;
    if (isVisible) {
      iv = setInterval(() => {
        setCurrentIdxs((prev) =>
          prev.map((curr, row) => {
            const len = categories[row].items.length;
            const next = (curr + 1) % len;
            const cont = scrollContainers.current[row];
            if (cont) {
              cont.scrollTo({
                left: next * (cont.clientWidth / visibleCount),
                behavior: "smooth",
              });
            }
            return next;
          })
        );
      }, interval);
    }
    return () => clearInterval(iv);
  }, [isVisible, categories, interval, visibleCount]);

  return (
    <div ref={sliderRef} className="max-w-4xl mx-auto my-12">
      {categories.map(({ title, items }, row) => (
        <div key={row} className="mb-16">
          {title && (
            <h3 className="mb-9 text-2xl font-bold text-white text-center">
              {title}
            </h3>
          )}

          <div
            className={`w-full ${
              isInteracting[row] ? "overflow-x-auto" : "overflow-x-hidden"
            } ${isInteracting[row] ? "" : "scrollbar-hide"}`}
            ref={(el) => (scrollContainers.current[row] = el)}
            onScroll={() => handleUserScroll(row)}
            onTouchStart={() =>
              setIsInteracting((prev) => prev.map((v, i) => (i === row))
            )}
            onTouchEnd={() =>
              setIsInteracting((prev) => prev.map((v, i) => (i === row ? false : v)))
            }
            onMouseEnter={() =>
              setIsInteracting((prev) => prev.map((v, i) => (i === row))
            )}
            onMouseLeave={() =>
              setIsInteracting((prev) => prev.map((v, i) => (i === row ? false : v)))
            }
          >
            <div className="flex gap-4 snap-x snap-mandatory">
              {items.map(({ src, caption }, idx) => (
                <div
                  key={idx}
                  className="relative flex-shrink-0 snap-start"
                  style={{ width: `${100 / visibleCount}%`, height: "100px" }}
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