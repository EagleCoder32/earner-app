'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Wallet } from 'lucide-react';

export default function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#1A1A1A] text-white px-4 py-3 flex justify-between items-center shadow-md relative">
      {/* Hamburger Menu */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
        <Menu size={24} />
      </button>

      {/* Title */}
      <div className="text-lg font-semibold">Dashboard</div>

      {/* Wallet Icon */}
      <Link href="/wallet" className="focus:outline-none">
        <Wallet size={24} />
      </Link>

{/* Sidebar */}
{menuOpen && (
  <div className="absolute top-full left-0 w-full bg-[#2a2a2a] p-4 z-50">
    <ul className="flex flex-col space-y-7">
      <li>
        <Link href="/" className="hover:text-yellow-400 block">
          Dashboard
        </Link>
      </li>
      <li>
        <Link href="/withdrawal" className="hover:text-yellow-400 block">
          Withdraw
        </Link>
      </li>
      <li>
        <Link href="/wallet" className="hover:text-yellow-400 block">
          Wallet
        </Link>
      </li>
    </ul>
        </div>
      )}
    </nav>
  );
}