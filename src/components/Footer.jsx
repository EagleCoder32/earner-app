// src/components/Footer.jsx

import { Facebook, Instagram, Youtube } from "lucide-react";
import Image from 'next/image';

export default function Footer() {
  return (
    <footer
      role="contentinfo"                                        // 📌 CHANGES START: semantic footer role
      className="bg-gray-900 text-gray-300"
    >
      <div className="container mx-auto px-6 py-8 text-center space-y-6 mt-2">
        {/* Branding */}
        <div className="flex justify-center">
          <Image
            src="/earner-eagle.webp"
            alt="Eagle Earner"
            width={80}
            height={80}
            className="h-14 w-auto -mt-6 -mb-5"
            priority={true}                                        // 📌 CHANGES START: prioritize above-the-fold image loading
          />
          {/* 📌 CHANGES END: priority added */}
        </div>

        {/* Links with semantic list markup */}
        <nav aria-label="Footer navigation">
          <ul role="list" className="flex justify-center flex-wrap gap-6 text-white">
            {["About", "Support", "FAQ"].map((link) => (
              <li key={link} role="listitem">            {/* 📌 CHANGES START: semantic list item role */}
                <a
                  href={`/${link.toLowerCase()}`}                
                  className="hover:text-white transition"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>  {/* 📌 CHANGES END: semantic list markup */}

        {/* Social (external links include security attributes) */}
        <div className="flex justify-center space-x-5 p-0">
          <a
            href="https://facebook.com"
            target="_blank" rel="noopener noreferrer"           // 📌 CHANGES START: security attributes
            aria-label="Facebook"
          >
            <Facebook size={26} color="#1877F2" />
          </a>

          <a
            href="https://youtube.com"
            target="_blank" rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <Youtube size={30} color="#E4405F" />
          </a>

          <a
            href="https://instagram.com"
            target="_blank" rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Instagram size={26} color="#E4405F" />
          </a>
        </div>  {/* 📌 CHANGES END: security attributes */}
      </div>

      <div className="border-t border-gray-800 py-4">
        <p className="text-center text-white text-sm font-semibold">
          <small>© {new Date().getFullYear()} Earner Eagle. All rights reserved.</small>  {/* 📌 CHANGES START: semantic small tag */}
        </p>
      </div>  {/* 📌 CHANGES END: copyright small tag */}
    </footer>
  );
}