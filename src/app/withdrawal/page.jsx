"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { withdrawalItems } from './withdrawalItems';
import { countryConfig } from './withdrawalData';

const countries  = Object.keys(countryConfig);
const categories = ['Cash', 'Gift Cards', 'Games'];

export default function WithdrawalPage() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showModal, setShowModal]         = useState(false);
  const [search, setSearch]               = useState('');

  // On mount, check localStorage for saved country
  useEffect(() => {
    const stored = localStorage.getItem('withdrawalCountry');
    if (stored && countries.includes(stored)) {
      setSelectedCountry(stored);
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  }, []);

  const filtered = countries.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  const onSelectCountry = (c) => {
    localStorage.setItem('withdrawalCountry', c);
    setSelectedCountry(c);
    setShowModal(false);
    setSearch('');
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 font-sans">
       {/* Header: Back arrow + Title */}
      <div className="flex items-center justify-between mb-6">
         <Link
    href="/dashboard"
    className="mr-4 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition inline-flex"
  >
    <Image
      src="/left-arrow.svg"
      alt="Back to Dashboard"
      width={17}
      height={17}
      
    />
  </Link>
      <h1 className="text-2xl font-bold">Withdrawal</h1>
        {/* Transaction History link */}
      </div>

      {/* Change country button */}
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 mb-8"
      >
        {selectedCountry ? `Country: ${selectedCountry}` : 'Select Country'}
      </button>

      {/* Country selection modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4 w-11/12 max-w-md">
            <h2 className="text-lg font-semibold mb-4">Choose your country</h2>
            <input
              type="text"
              placeholder="Search country"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
            />
            <div className="max-h-60 overflow-y-auto">
              {filtered.map((c) => (
                <div
                  key={c}
                  onClick={() => onSelectCountry(c)}
                  className="flex items-center py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                >
                  {/* Flag from SVG */}
                  <Image
                    src={`/flags/${c.toLowerCase().replace(/\s+/g, '-')}.svg`}
                    alt={`${c} flag`}
                    width={16}
                    height={16}
                    className="mr-3 object-cover rounded-sm"
                    onError={(e) => { e.target.style.display = 'none'; }}
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
            <section key={cat} className="mb-10">
              <h2 className="text-xl font-semibold mb-4">{cat}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {keys.map((key) => {
                  const item = withdrawalItems[key];
                  if (!item) return null; // safety check
                  return (
                    <Link
                      href={`/withdrawal/${item.path}`}
                      key={key}
                      className="w-full bg-white dark:bg-gray-800 shadow rounded-2xl p-6 flex flex-col items-center hover:shadow-md transition"
                    >
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="mb-3 object-contain"
                      />
                <span className="mt-auto text-white font-bold text-center">
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
    </div>
  );
}