// src/components/EarningOptions.jsx

import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function EarningOptions() {
  const options = [

    {
      href: '/type-earn',
      iconUrl: '/typing.svg',
      title: 'Type & Earn',
      description: 'Do typing to earn',
      gradient: 'bg-gradient-to-r from-[#0029ffe3] to-[#0018ff]',
    },

    {
      href: '/read-earn',
      iconUrl: '/read-earn.svg',
      title: 'Read & Earn',
      description: 'Read short articles to earn',
      gradient: 'bg-gradient-to-r from-[#0029ffe3] to-[#0018ff]',
    },

  ];

  return (
    <div style={{ marginTop: "-75px" }} className="grid grid-cols-1 sm:grid-cols-2 gap-28">
      {options.map(({ href, iconUrl, title, description, gradient }) => (
        <Link
          key={href}
          href={href}
          className="block rounded-lg shadow-md overflow-hidden transform transition hover:shadow-lg hover:-translate-y-1"
        >
             {/* Gradient header with centered image */}
          <div className={`${gradient} h-24 flex justify-center items-center`}>
            <Image
              src={iconUrl}
              alt={title}
              width={65}
              height={65}
              className="object-cover rounded-2xl"
            />
          </div>

          {/* Description area */}
          <div className="bg-white p-4 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-black">{title}</h3>
              <p className="text-sm text-gray-800">{description}</p>
            </div>
            <ChevronRightIcon className="w-6 h-6 text-gray-400 mt-1" />
          </div>
        </Link>
      ))}
    </div>
  );
}