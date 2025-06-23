'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Wallet } from 'lucide-react'; // optional: swap icons if needed


export default function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#1A1A1A] text-white px-4 py-3 flex justify-between items-center shadow-md">
      {/* Hamburger Menu */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
        <Menu size={24} />
      </button>

      {/* Placeholder for brand or center content */}
      <div className="text-lg font-semibold">Dashboard</div>

      {/* Wallet Icon as a Link */}
      <Link href="/wallet" className="focus:outline-none">
        <Wallet size={24} />
      </Link>


      {/* Optional Sidebar (shown on hamburger click) */}
      {menuOpen && (
        <div className="absolute top-12 left-0 w-56 bg-[#2a2a2a] h-screen p-4 z-50">
          <ul className="space-y-4">
            <li><a href="#" className="hover:text-yellow-400">Home</a></li>
            <li><a href="/withdrawal" className="hover:text-yellow-400">Withdrawal</a></li>
            <li><a href="/profile" className="hover:text-yellow-400">Profile</a></li>
            {/* Add more links as needed */}
          </ul>
        </div>
      )}
    </nav>
  );
}