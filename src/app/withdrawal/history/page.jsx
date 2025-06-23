// src/app/withdrawal/history/page.jsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HistoryPage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch('/api/withdrawal/history', {
      credentials: 'same-origin'
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.records) {
          // format dates if desired, e.g. new Date(rec.createdAt)
          setRecords(data.records);
        }
      })
      .catch((err) => {
        console.error('Error fetching history:', err);
      });
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6 font-sans">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/withdrawal"
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition inline-flex"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">Transaction History</h1>
      </div>

      {records.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <ul className="space-y-4">
          {records.map((rec) => (
            <li
              key={rec._id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{rec.option.charAt(0).toUpperCase() + rec.option.slice(1)}</div>
                <div className="text-sm text-gray-600">
                  {new Date(rec.createdAt).toLocaleDateString()} • {rec.country}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{rec.tierLabel}</div>
                <div className={`text-sm ${rec.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {rec.status}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}