'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Wallet } from 'lucide-react';

// Navigation items array for easy maintenance and DRY code
const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/withdrawal', label: 'Withdraw' },
  { href: '/wallet', label: 'Wallet' },
];

export default function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);           // State to track sidebar open/closed
  const menuRef = useRef(null);                              // Ref for click-outside detection
  const pathname = usePathname();                            // Current route path

  // 1️⃣ Close menu on route change
  useEffect(() => {
    setMenuOpen(false);  // this code part end here: effect to auto-close on navigation
  }, [pathname]);

  // 2️⃣ Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);  // this code part end here: click-outside effect


  return (
    <nav
      role="navigation"                         // Semantic role for navigation
      aria-label="Dashboard navigation"         // Accessible label
      className="bg-[#1A1A1A] text-white px-4 py-3 flex justify-between items-center shadow-md relative"
    >
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setMenuOpen((open) => !open)}
        className="focus:outline-none"
        aria-label="Toggle menu"                // Screen-reader label
        aria-expanded={menuOpen}                 // Indicates expanded/collapsed state
      >
        <Menu size={24} />
      </button> 
      {/* Title */}
      <div className="text-lg font-semibold">Dashboard</div>

      {/* Wallet Icon Link */}
      <Link
        href="/wallet"
        className="focus:outline-none"
        aria-label="Go to wallet"               // Screen-reader label
      >
        <Wallet size={24} />
      </Link>  

      {/* Sidebar Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          role="menu"                          // Semantic role
          className="absolute top-full left-0 w-full bg-[#2a2a2a] p-4 z-50"
        >
          <ul className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <li key={item.href}>          
                <Link
                  href={item.href}
                  className="hover:text-yellow-400 block"
                  onClick={() => setMenuOpen(false)}  // Close on click
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