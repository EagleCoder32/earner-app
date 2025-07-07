'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Wallet } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/withdrawal', label: 'Withdraw' },
  { href: '/wallet', label: 'Wallet' },
  { href: '/profile', label: 'Profile' },
];

export default function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef   = useRef(null);  // For sidebar itself
  const buttonRef = useRef(null);  // For the hamburger button
  const pathname  = usePathname();

  // 1️⃣ Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // 2️⃣ Close menu when clicking outside *both* button & menu
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuOpen &&
        menuRef.current &&
        buttonRef.current &&
        // If click is not inside menu AND not on the button, close
        !menuRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <nav
      role="navigation"
      aria-label="Dashboard navigation"
      className="bg-[#1A1A1A] text-white px-4 py-3 flex justify-between items-center shadow-md relative"
    >
      {/* Hamburger Menu Button */}
      <button
        ref={buttonRef}                               // ← attach ref here
        onClick={() => setMenuOpen((open) => !open)}  // toggle open/closed
        className="focus:outline-none"
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <Menu size={24} />
      </button>

      {/* Title */}
      <div className="text-lg font-semibold">Dashboard</div>

      {/* Wallet Icon Link */}
      <Link href="/wallet" className="focus:outline-none" aria-label="Go to wallet">
        <Wallet size={24} />
      </Link>

      {/* Sidebar Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute top-full left-0 w-full bg-[#2a2a2a] p-4 z-50"
        >
          <ul className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-yellow-400 block"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}