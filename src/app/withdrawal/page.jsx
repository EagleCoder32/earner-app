export const runtime = 'edge'; 

'use client';

import Head from 'next/head';                          // SEO metadata
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';                     // Close icon

import { withdrawalItems } from './withdrawalItems';
import { countryConfig }   from './withdrawalData';

// Helpers
function getFlagUrl(country) {
  return `/flags/${country.toLowerCase().replace(/\s+/g, '-')}.svg`;
}

// Debounce hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const iv = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(iv);
  }, [value, delay]);
  return debounced;
}

export default function WithdrawalPage() {
  // State
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showModal, setShowModal]             = useState(false);
  const [search, setSearch]                   = useState('');

  // Debounced search term
  const debouncedSearch = useDebounce(search, 200);

  const countries  = useMemo(() => Object.keys(countryConfig), []);
  const categories = ['Cash', 'Gift Cards', 'Games'];

  // Memoized filtered list
  const filtered = useMemo(
    () =>
      countries.filter((c) =>
        c.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [countries, debouncedSearch]
  );

  // On mount, load saved country
  useEffect(() => {
    const stored = localStorage.getItem('withdrawalCountry');
    if (stored && countries.includes(stored)) {
      setSelectedCountry(stored);
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  }, [countries]);

  // Handlers
  const onSelectCountry = (c) => {
    localStorage.setItem('withdrawalCountry', c);
    setSelectedCountry(c);
    setShowModal(false);
    setSearch('');
  };

  const closeModal = () => setShowModal(false);

  return (
    <>
      {/* SEO Metadata */}
      <Head>
        <title>Withdrawal – EagleEarner</title>
        <meta
          name="description"
          content="Select your country and redeem points for cash, gift cards, or game credits."
        />
      </Head>

      {/* Page content */}
      <main role="main" className="max-w-screen-xl mx-auto px-4 py-6 font-sans">
        <header className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard"
            className="mr-4 p-2 hover:bg-gray-200 rounded transition"
            aria-label="Back to Dashboard"
          >
            <Image
              src="/left-arrow.svg"
              alt="Back to Dashboard"
              width={17}
              height={17}
            />
          </Link>
          <h1 className="text-2xl font-bold">Withdrawal</h1>
        </header>

        {/* Change country button */}
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 mb-8"
          aria-haspopup="dialog"
          aria-expanded={showModal}
        >
          {selectedCountry ? `Country: ${selectedCountry}` : 'Select Country'}
        </button>

        {/* Country selection modal */}
        {showModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-lg p-4 w-11/12 max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                aria-label="Close country selector"
              >
                <X size={20} />
              </button>

              <h2 id="country-dialog-title" className="text-lg font-semibold mb-4">
                Choose your country
              </h2>

              {/* Search input */}
              <input
                type="text"
                placeholder="Search country"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
                aria-labelledby="country-dialog-title"
              />

              {/* Country list */}
              <div className="max-h-60 overflow-y-auto">
                {filtered.map((c) => (
                  <div
                    key={c}
                    onClick={() => onSelectCountry(c)}
                    className="flex items-center py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  >
                    {/* Lazy‑load flag */}
                    <Image
                      src={getFlagUrl(c)}
                      alt={`${c} flag`}
                      width={16}
                      height={16}
                      className="mr-3 object-cover rounded-sm"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Withdrawal categories */}
        {selectedCountry &&
          categories.map((cat) => {
            const keys = countryConfig[selectedCountry][cat] || [];
            return (
              <section
                key={cat}
                aria-labelledby={`cat-${cat}`}
                className="mb-10"
              >
                <h2 id={`cat-${cat}`} className="text-xl font-semibold mb-4">
                  {cat}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {keys.map((key) => {
                    const item = withdrawalItems[key];
                    if (!item) return null;
                    return (
                      <Link
                        href={`/withdrawal/${item.path}`}
                        key={key}
                        className="w-full bg-white shadow rounded-2xl p-6 flex flex-col items-center hover:shadow-md transition"
                      >
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="mb-3 object-contain"
                          loading="lazy"
                        />
                        <span className="mt-auto font-bold text-center text-gray-900">
                          {item.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
      </main>
    </>
  );
}