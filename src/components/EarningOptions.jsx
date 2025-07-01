// src/components/EarningOptions.jsx

'use client'; // Enable client-side interactivity

import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

// Default gradient to avoid duplication
const defaultGradient = 'bg-gradient-to-r from-[#0029ffe3] to-[#0018ff]';

// Array of earning options for DRY code
const options = [
  {
    href: '/type-earn',
    iconUrl: '/typing.svg',
    title: 'Type & Earn',
    description: 'Do typing to earn',
    gradient: defaultGradient,
  },
  {
    href: '/read-earn',
    iconUrl: '/read-earn.svg',
    title: 'Read & Earn',
    description: 'Read short articles to earn',
    gradient: defaultGradient,
  },
];

export default function EarningOptions() {
  return (
    <div
      // 📌 CHANGES START: replaced inline style with Tailwind utility
      className="-mt-[75px] grid grid-cols-1 sm:grid-cols-2 gap-24"
      // 📌 CHANGES END: marginTop utility applied
    >
      {options.map(({ href, iconUrl, title, description, gradient }) => (
        <Link
          key={href} // Unique, stable key for list items
          href={href}
          className="block rounded-lg shadow-md overflow-hidden transform transition hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring"
          aria-label={`Go to ${title}`} // Screen-reader label
        >
          {/* Gradient header with centered image */}
          <div className={`${gradient} h-24 flex justify-center items-center`}>
            <Image
              src={iconUrl}
              alt={title} // Alt text for accessibility
              width={65}
              height={65}
              className="object-cover rounded-2xl"
              priority={true} // 📌 CHANGES START: load above-the-fold
            />
            {/* 📌 CHANGES END: priority added */}
          </div>

          {/* Description area */}
          <div className="bg-white p-4 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-black">{title}</h3>
              <p className="text-sm text-gray-800">{description}</p>
            </div>
            <ChevronRightIcon
              className="w-6 h-6 text-gray-400 mt-1"
              aria-hidden="true" // Decorative icon hidden from screen readers
            />
          </div>
        </Link>
      ))}
    </div>
  );
}