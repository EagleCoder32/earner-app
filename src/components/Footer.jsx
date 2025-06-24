import { Facebook, Instagram, Youtube } from "lucide-react";
import Image from 'next/image';


export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-14">
      <div className="container mx-auto px-6 py-8 text-center space-y-6 mt-40">
        {/* Branding */}
        <div className="flex justify-center">
          <Image
            src="/earner-eagle.webp"
            alt="Eagle Earner"
            width={80} 
            height={80}
            className="h-14 w-auto"
          />
        </div>
     
        {/* Links */}
        <nav className="flex justify-center flex-wrap gap-6 text-white">
          {["About", "Support", "FAQ?"].map((link) => (
            <a
              key={link}
              href={`/${link.toLowerCase()}`}
              className="hover:text-white transition"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Social (use your own URLs or replace with SVGs) */}
        <div className="flex justify-center space-x-5 pt-4 -mb-28">

          <a href="https://facebook.com" aria-label="Facebook">
            <Facebook size={26} color="#1877F2" />
          </a>

          <a
            href="https://youtube.com"
            aria-label="YouTube">
            <Youtube size={30} color="#E4405F" />
          </a>

          <a href="https://instagram.com" aria-label="Instagram" className="hover:text-white">
            <Instagram size={26} color="#E4405F" />
          </a>





        </div>
      </div>
      <div className="border-t border-gray-800 py-4">
        <p className="text-center text-white text-sm font-semibold">
          © {new Date().getFullYear()} EagleEarner. All rights reserved.
        </p>
      </div>
    </footer>
  );
}