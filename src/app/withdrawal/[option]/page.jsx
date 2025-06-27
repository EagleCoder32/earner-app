// src/app/withdrawal/[option]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { withdrawalItems } from '../withdrawalItems';
import { withdrawalTiers } from '../withdrawalTiers';

export default function OptionPage() {
  const { option } = useParams();
  const item = withdrawalItems[option];
  const tiers = withdrawalTiers[option] || [];

  const [selectedTier, setSelectedTier] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [nameError, setNameError] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (showConfirmation) {
      const timer = setTimeout(() => setShowConfirmation(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [showConfirmation]);

  if (!item) {
    return (
      <div className="max-w-screen-md mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Option Not Found</h1>
        <p>The withdrawal option &quot;{option}&quot; does not exist.</p>
      </div>
    );
  }

  const openForm = (tier) => {
    setSelectedTier(tier);
    setShowForm(true);
    setShowConfirmation(false);
    setFormName('');
    setFormEmail('');
    setNameError('');
  };

  const validateName = (name) => /^[A-Za-z ]+$/.test(name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateName(formName)) {
      setNameError('Please enter a valid name using letters and spaces only.');
      return;
    }

    // ► New: send to backend
    const country = localStorage.getItem('withdrawalCountry') || '';
    try {
      const res = await fetch('/api/withdrawal/request', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          option,
          tierValue: selectedTier.value,
          tierLabel: selectedTier.label,
          country,
          recipient: { name: formName, email: formEmail }
        })
      });
      const data = await res.json();
      if (res.ok) {
        setShowForm(false);
        setShowConfirmation(true);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    }
  };

  return (
     <>

      {/* 1) Back button lives entirely outside the padded container */}
      <div className="px-4 pt-6">
        <Link href="/withdrawal">
          <span className="inline-block text-blue-500 hover:underline">
            ← Back
          </span>
        </Link>
      </div>
    
   <div className="max-w-screen-md mx-auto px-4 py-6 font-sans">
  {/* Header */}
  
  <div className="relative mb-8">

    {/* Centered title */}
    <h1 className="text-3xl font-bold text-center">
      {item.name}
    </h1>
  </div>


      {/* Tier buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {tiers.map((tier) => (
          <button
            key={tier.value}
            className="bg-blue-500 text-white rounded-lg p-4 hover:bg-blue-600 transition"
            onClick={() => openForm(tier)}
          >
            <div className="font-semibold">{tier.label}</div>
            <div className="text-sm">{tier.points} points</div>
          </button>
        ))}
      </div>

       {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white rounded-lg p-6 w-11/12 max-w-sm">
            {/* ✕ Close button */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              aria-label="Close form"
            >
              &times;
            </button>


            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold mb-4">
                Redeem {selectedTier.label}
              </h2>
              <div className="mb-4">
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                {nameError && (
                  <p className="mt-1 text-red-500 text-sm">{nameError}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
              >
                Redeem
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-sm">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto mb-4 h-12 w-12 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <p className="mb-2">Thank you, {formName}!</p>
              <p>You’ll receive your {selectedTier.label} in 48–72 hours.</p>
              <button
                onClick={() => setShowConfirmation(false)}
                className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
     </>
  );
}