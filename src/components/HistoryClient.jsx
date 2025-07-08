'use client'; // ← Must be first

import Head from 'next/head';                              // SEO
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/lib/api';                        // consolidated fetch

export default function HistoryClient() {
  // Loading & error state
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Pagination state
  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(1);

  // Fetch history on mount
  useEffect(() => {
    async function load() {
      try {
        const data = await apiGet('/api/withdrawal/history');
        setRecords(data.records || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Calculate paginated slice
  const paginatedRecords = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return records.slice(start, start + ITEMS_PER_PAGE);
  }, [records, page]);

  // Total pages
  const totalPages = useMemo(
    () => Math.ceil(records.length / ITEMS_PER_PAGE),
    [records.length]
  );

  // Memoized list items
  const recordList = useMemo(() => {
    return paginatedRecords.map((rec) => (
      <li
        key={rec._id}
        role="listitem"
        className="p-4 border rounded-lg flex justify-between items-center"
      >
        <div>
          <div className="font-medium">
            {rec.option.charAt(0).toUpperCase() + rec.option.slice(1)}
          </div>
          <div className="text-sm text-gray-600">
            {new Date(rec.createdAt).toLocaleDateString()} • {rec.country}
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold">{rec.tierLabel}</div>
          <div
            className={`text-sm ${
              rec.status === 'Completed'
                ? 'text-green-600'
                : 'text-yellow-600'
            }`}
          >
            {rec.status}
          </div>
        </div>
      </li>
    ));
  }, [paginatedRecords]);

  // Router for back button
  const router = useRouter();
  const goBack = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const nextPage = useCallback(() => {
    setPage((p) => Math.min(totalPages, p + 1));
  }, [totalPages]);

  return (
    <>
      <Head>
        <title>Transaction History – EagleEarner</title>
        <meta
          name="description"
          content="Review your past withdrawal requests—status, date, and amount—in your EagleEarner account."
        />
      </Head>

      <main role="main" className="max-w-screen-lg mx-auto px-4 py-6 font-sans">
        <header className="flex items-center justify-between mb-6">
          <button
            onClick={goBack}
            className="p-2 hover:bg-gray-200 rounded transition inline-flex"
            aria-label="Back to Dashboard"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold">Transaction History</h1>
        </header>

        {loading ? (
          <p>Loading transactions…</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : records.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <>
            <ul
              role="list"
              aria-label="Withdrawal transaction records"
              className="space-y-4"
            >
              {recordList}
            </ul>

            {totalPages > 1 && (
              <nav
                className="mt-6 flex justify-center space-x-4"
                role="navigation"
                aria-label="Pagination"
              >
                <button
                  onClick={prevPage}
                  disabled={page === 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  aria-label="Previous page"
                >
                  ‹ Prev
                </button>
                <span aria-live="polite">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={nextPage}
                  disabled={page === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  aria-label="Next page"
                >
                  Next ›
                </button>
              </nav>
            )}
          </>
        )}
      </main>
    </>
  );
}