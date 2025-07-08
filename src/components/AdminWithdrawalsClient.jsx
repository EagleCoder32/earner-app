'use client';                                // ← must be first

import { useEffect, useState } from 'react';
import { useRouter }          from 'next/navigation';
import { useUser }            from '@clerk/nextjs';
import { ADMIN_IDS }          from '@/config/admin';

export default function AdminWithdrawalsClient() {
  const { user, isLoaded } = useUser();
  const router             = useRouter();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // ── Client‑side admin guard ─────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return; // wait for Clerk to load
    if (!user || !ADMIN_IDS.includes(user.id)) {
      router.replace('/dashboard');
    }
  }, [isLoaded, user, router]);
  // ── End guard ───────────────────────────────────────────────

  // ▶︎ Fetch all requests on mount
  useEffect(() => {
    fetch('/api/admin/withdrawals', { credentials: 'same-origin' })
      .then(res => res.json())
      .then(data => {
        if (data.records) setRecords(data.records);
        else setError(data.error || 'Failed to load');
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, []);

  // ▶︎ Update one request’s status
  function updateStatus(id, newStatus) {
    fetch(`/api/admin/withdrawals/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(data => {
        if (data.record) {
          setRecords(recs =>
            recs.map(r => r._id === id ? { ...r, status: data.record.status } : r)
          );
        } else {
          alert(data.error || 'Update failed');
        }
      })
      .catch(() => alert('Network error'));
  }

  if (loading) return <p>Loading…</p>;
  if (error)   return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin: Withdrawal Requests</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {['Date','User','Option','Tier','Country','Recipient','Points','Status','Actions']
              .map(h => <th key={h} className="border-b px-2 py-1 text-left">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r._id}>
              <td className="border-b px-2 py-1">{new Date(r.createdAt).toLocaleString()}</td>
              <td className="border-b px-2 py-1">{r.clerkId}</td>
              <td className="border-b px-2 py-1">{r.option}</td>
              <td className="border-b px-2 py-1">{r.tierLabel}</td>
              <td className="border-b px-2 py-1">{r.country}</td>
              <td className="border-b px-2 py-1">
                {r.recipient.name}<br/>{r.recipient.email}
              </td>
              <td className="border-b px-2 py-1">{r.pointsDeducted}</td>
              <td className="border-b px-2 py-1">{r.status}</td>
              <td className="border-b px-2 py-1">
                {r.status === 'Pending' ? (
                  <>
                    <button
                      className="mr-2 px-2 py-1 bg-green-500 text-white rounded"
                      onClick={() => updateStatus(r._id, 'Completed')}
                    >
                      Complete
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => updateStatus(r._id, 'Rejected')}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <button
                    className="px-2 py-1 bg-orange-500 text-white rounded"
                    onClick={() => updateStatus(r._id, 'Pending')}
                  >
                    Undo
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}