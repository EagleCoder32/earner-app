// src/components/ImageSlider.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ImageSlider({ images }) {
  const visibleCount = 3;         // how many images to show at once
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  // build the array of images to display this “frame”
  const frame = [];
  for (let i = 0; i < visibleCount; i++) {
    frame.push(images[(currentIdx + i) % images.length]);
  }

  return (
    <div className="max-w-4xl mx-auto my-12 overflow-hidden">
      <div className="flex space-x-4 transition-transform duration-500"
           style={{ transform: `translateX(-${(100 / visibleCount) * currentIdx}%)` }}>
        {images.map(({ src, caption }, idx) => (
          <div key={idx} className="flex-shrink-0 w-1/3 text-center">
            <Image
              src={src}
              fill
              alt={caption}

              className="w-auto h-auto object-contain rounded-lg mx-auto"
            />
            <p className="mt-2 text-gray-700 text-sm">{caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}