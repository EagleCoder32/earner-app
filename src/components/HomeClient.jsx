'use client'; // ← Marks this file as a Client Component

import dynamic from 'next/dynamic';

// Dynamically import the heavy components, client‑only:
const Navbar       = dynamic(() => import('@/components/Navbar'), { ssr: false });
const HeroCard     = dynamic(() => import('@/components/HeroCard'), { ssr: false });
const ImageSlider  = dynamic(() => import('@/components/ImageSlider'), {
  ssr: false,
  loading: () => <p className="text-center text-white mt-8">Loading slider…</p>,
});
const Testimonials = dynamic(() => import('@/components/Testimonials'), {
  ssr: false,
  loading: () => <p className="text-center text-white mt-8">Loading reviews…</p>,
});
const Footer       = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function HomeClient() {
  return (
    <>
      <Navbar />

      <main className="relative bg-black text-gray-900">
        {/* … the exact same JSX you had before … */}
        {/* Hero section, HeroCard, ImageSlider, Features, Testimonials, Footer */}
        {/* Copy that entire return block from your previous HomePage */}
      </main>
    </>
  );
}