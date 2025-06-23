"use client";

import { User } from "lucide-react";
import { useState, useEffect } from "react";

const data = [
  {
    rating: 5,
    text: `The simple design and powerful features make it so easy to plan my day. I couldn’t imagine going without it.`,
    name: "Jason M.",
    role: "Android User",
  },
  {
    rating: 4,
    text: `I love earning points for watching videos — it’s fun, fast, and I always get my rewards on time.`,
    name: "Priya S.",
    role: "iOS User",
  },
  {
    rating: 5,
    text: `The scratch cards are my favorite. I log in every day just to see what I’ll win next!`,
    name: "Carlos D.",
    role: "Web User",
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);

  const prev = () => setIdx((i) => (i - 1 + data.length) % data.length);
  const next = () => setIdx((i) => (i + 1) % data.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((i) => (i + 1) % data.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const { rating, text, name, role } = data[idx];

  return (
    <section className="relative max-w-3xl mx-auto p-4">
      <button
        onClick={prev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white text-3xl px-2"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white text-3xl px-2"
      >
        ›
      </button>

      <div className="bg-gray-800 rounded-2xl p-8 pt-12 text-white shadow-lg">
        <div className="flex space-x-1 mb-4">
          {Array.from({ length: rating }).map((_, i) => (
            <span key={i} className="text-yellow-400 text-xl">★</span>
          ))}
        </div>

        <p className="italic text-lg mb-6">“{text}”</p>

        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center">
            <User size={28} className="text-gray-400" />
          </div>
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-gray-400 text-sm">{role}</p>
          </div>
        </div>
      </div>
    </section>
  );
}