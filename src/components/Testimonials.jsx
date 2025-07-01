// src/components/Testimonials.jsx
"use client";

import { User } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";

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

// Simple debounce utility
function debounce(fn, delay) {
  let timer;
  const debounced = (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
  };
  return debounced;
}

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Pause auto-advance when out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-advance only when visible
  useEffect(() => {
    if (!isVisible) return;
    const iv = setInterval(() => {
      setIdx(i => (i + 1) % data.length);
    }, 5000);
    return () => clearInterval(iv);
  }, [isVisible]);

  const { rating, text, name, role } = data[idx];

  // Memoize star icons for performance
  const stars = useMemo(
    () =>
      Array.from({ length: rating }).map((_, i) => (
        <span key={i} className="text-yellow-400 text-xl">
          ★
        </span>
      )),
    [rating]
  );

  // Debounced controls
  const debouncedPrev = useMemo(
    () => debounce(() => setIdx(i => (i - 1 + data.length) % data.length), 100),
    []
  );
  const debouncedNext = useMemo(
    () => debounce(() => setIdx(i => (i + 1) % data.length), 100),
    []
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedPrev.cancel();
      debouncedNext.cancel();
    };
  }, [debouncedPrev, debouncedNext]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="testimonials-title"
      className="relative max-w-3xl mx-auto p-4"
    >
      {/* Visually hidden heading for SEO/accessibility */}
      <h2 id="testimonials-title" className="sr-only">
        User Testimonials
      </h2>

      {/* Manual Controls */}
      <button
        onClick={debouncedPrev}
        aria-label="Previous testimonial"
        className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white text-3xl px-2 focus:outline-none focus:ring"
      >
        ‹
      </button>
      <button
        onClick={debouncedNext}
        aria-label="Next testimonial"
        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white text-3xl px-2 focus:outline-none focus:ring"
      >
        ›
      </button>

      {/* Testimonial Card */}
      <article className="bg-gray-800 rounded-2xl p-8 pt-12 text-white shadow-lg">
        {/* Star Rating */}
        <div className="flex space-x-1 mb-4">{stars}</div>

        {/* Quote Text */}
        <p className="italic text-lg mb-6">“{text}”</p>

        {/* Author Info */}
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center">
            <User size={28} className="text-gray-400" />
          </div>
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-gray-400 text-sm">{role}</p>
          </div>
        </div>
      </article>
    </section>
  );
}