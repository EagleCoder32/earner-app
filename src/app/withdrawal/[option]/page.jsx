// src/app/withdrawal/[option]/page.jsx
'use client';



import Head from 'next/head';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';

import { apiPost } from '@/lib/api';
import { withdrawalItems } from '../withdrawalItems';
import { withdrawalTiers } from '../withdrawalTiers';

// 1️⃣ Stronger validation schema
const RedeemSchema = z.object({
  name:  z.string().min(1).regex(/^[A-Za-z ]+$/, 'Letters and spaces only'),
  email: z.string().email(),
});

export default function OptionPage() {
  const router = useRouter();
  const { option } = useParams();

  // 2️⃣ Memoize derived item & tiers
  const item = useMemo(() => withdrawalItems[option], [option]);
  const tiers = useMemo(() => withdrawalTiers[option] || [], [option]);

  // State
  const [selectedTier, setSelectedTier]       = useState(null);
  const [showForm, setShowForm]               = useState(false);
  const [formName, setFormName]               = useState('');
  const [formEmail, setFormEmail]             = useState('');
  const [formError, setFormError]             = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Auto‑hide confirmation
  useEffect(() => {
    if (showConfirmation) {
      const timer = setTimeout(() => setShowConfirmation(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [showConfirmation]);

  // 3️⃣ Handlers wrapped in useCallback
  const openForm = useCallback((tier) => {
    setSelectedTier(tier);
    setShowForm(true);
    setShowConfirmation(false);
    setFormName('');
    setFormEmail('');
    setFormError(null);
  }, []);

  const closeForm = useCallback(() => {
    setShowForm(false);
    setFormError(null);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setFormError(null);

      // 4️⃣ Declarative validation
      const result = RedeemSchema.safeParse({ name: formName, email: formEmail });
      if (!result.success) {
        setFormError(result.error.errors.map(err => err.message).join('; '));
        return;
      }

      // 5️⃣ Consolidated fetch logic
      try {
        await apiPost('/api/withdrawal/request', {
          option,
          tierValue: selectedTier.value,
          tierLabel: selectedTier.label,
          country: localStorage.getItem('withdrawalCountry') || '',
          recipient: { name: formName, email: formEmail }
        });
        setShowForm(false);
        setShowConfirmation(true);
      } catch (err) {
        setFormError(err.message);
      }
    },
    [option, selectedTier, formName, formEmail]
  );

  // If option invalid
  if (!item) {
    return (
      <>
        <Head>
          <title>Withdrawal Option Not Found – EagleEarner</title>
        </Head>
        <main role="main" className="max-w-screen-md mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Option Not Found</h1>
          <p>The withdrawal option “{option}” does not exist.</p>
          <button
            onClick={() => router.push('/withdrawal')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            aria-label="Back to Withdrawal"
          >
            ← Back
          </button>
        </main>
      </>
    );
  }

  return (
    <>
      {/* SEO Metadata */}
      <Head>
        <title>Redeem {item.name} – EagleEarner</title>
        <meta
          name="description"
          content={`Redeem your points for ${item.name}. Choose a tier and enter your details.`}
        />
      </Head>

      <main role="main" className="max-w-screen-md mx-auto px-4 py-6 font-sans">
        {/* Header */}
        <header className="mb-8 flex items-center">
          <Link href="/withdrawal" aria-label="Back to Withdrawal">
            <span className="text-blue-500 hover:underline">← Back</span>
          </Link>
          <h1 className="flex-grow text-3xl font-bold text-center">{item.name}</h1>
        </header>

        {/* Tier buttons */}
        <section aria-labelledby="tiers-heading" className="mb-8">
          <h2 id="tiers-heading" className="sr-only">
            Available Redeem Tiers
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {tiers.map((tier) => (
              <button
                key={tier.value}
                onClick={() => openForm(tier)}
                className="bg-blue-500 text-white rounded-lg p-4 hover:bg-blue-600 transition focus:outline-none focus:ring"
                aria-label={`Redeem ${tier.label} for ${tier.points} points`}
              >
                <div className="font-semibold">{tier.label}</div>
                <div className="text-sm">{tier.points} points</div>
              </button>
            ))}
          </div>
        </section>

        {/* Form Modal */}
        {showForm && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="redeem-form-title"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div
              className="relative bg-white rounded-lg p-6 w-11/12 max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeForm}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                aria-label="Close redeem form"
              >
                ×
              </button>

              <h2 id="redeem-form-title" className="text-xl font-semibold mb-4">
                Redeem {selectedTier.label}
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Name Field */}
                <div className="mb-4">
                  <label htmlFor="redeem-name" className="block mb-1">
                    Name
                  </label>
                  <input
                    id="redeem-name"
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                  />
                </div>

                {/* Email Field */}
                <div className="mb-4">
                  <label htmlFor="redeem-email" className="block mb-1">
                    Email
                  </label>
                  <input
                    id="redeem-email"
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                  />
                </div>

                {/* Error Message */}
                {formError && (
                  <p className="mb-4 text-red-600" role="alert">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition focus:outline-none focus:ring"
                  aria-label="Submit redeem request"
                >
                  Redeem
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div
            role="alertdialog"
            aria-labelledby="redeem-confirmation-title"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-sm text-center">
              <h2 id="redeem-confirmation-title" className="text-xl font-semibold mb-4">
                Success!
              </h2>
              <p className="mb-2">Thank you, {formName}!</p>
              <p>You’ll receive your {selectedTier.label} in 48–72 hours.</p>
              <button
                onClick={() => setShowConfirmation(false)}
                className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring"
                aria-label="Close confirmation dialog"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}