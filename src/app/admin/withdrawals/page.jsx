// src/app/admin/withdrawals/page.jsx
export const runtime = 'edge';         // ← add this!
'use client';


import { useEffect, useState } from 'react';
import { useRouter }          from 'next/navigation';
import { useUser }            from '@clerk/nextjs';
import { ADMIN_IDS }          from '@/config/admin';

export default function AdminWithdrawalsPage() {
  const { user, isLoaded } = useUser();
  const router             = useRouter();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // ── Client-side admin guard ───────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;                         // wait for Clerk to load
    if (!user || !ADMIN_IDS.includes(user.id)) {
      router.replace('/dashboard');                // non-admins go home
    }
  }, [isLoaded, user, router]);
  // ── End guard ─────────────────────────────────────────────

  // ▶︎ Fetch all requests on mount
  useEffect(() => {
    fetch('/api/admin/withdrawals', { credentials: 'same-origin' })
      .then((res) => res.json())
      .then((data) => {
        if (data.records) {
          setRecords(data.records);
        } else {
          setError(data.error || 'Failed to load');
        }
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
      .then((res) => res.json())
      .then((data) => {
        if (data.record) {
          // Reflect change in UI
          setRecords((recs) =>
            recs.map((r) =>
              r._id === id ? { ...r, status: data.record.status } : r
            )
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
    <div style={{ padding: '2rem' }}>
      <h1>Admin: Withdrawal Requests</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th style={th}>Date</th>
            <th style={th}>User</th>
            <th style={th}>Option</th>
            <th style={th}>Tier</th>
            <th style={th}>Country</th>
            <th style={th}>Recipient</th>
            <th style={th}>Points</th>
            <th style={th}>Status</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r._id}>
              <td style={td}>{new Date(r.createdAt).toLocaleString()}</td>
              <td style={td}>{r.clerkId}</td>
              <td style={td}>{r.option}</td>
              <td style={td}>{r.tierLabel}</td>
              <td style={td}>{r.country}</td>
              <td style={td}>
                {r.recipient.name}<br/>{r.recipient.email}
              </td>
              <td style={td}>{r.pointsDeducted}</td>
              <td style={td}>{r.status}</td>
              <td style={td}>
                {r.status === 'Pending' ? (
                  <>
                    <button
                      style={btn('green')}
                      onClick={() => updateStatus(r._id, 'Completed')}
                    >
                      Complete
                    </button>
                    <button
                      style={btn('red')}
                      onClick={() => updateStatus(r._id, 'Rejected')}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <button
                    style={btn('orange')}
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

// Simple cell styles
const th = {
  borderBottom: '1px solid #ccc',
  padding:      '8px',
  textAlign:    'left'
};
const td = {
  borderBottom:  '1px solid #eee',
  padding:       '8px',
  verticalAlign: 'top'
};
// Button style factory
function btn(color) {
  let background;
  switch (color) {
    case 'green':  background = '#4caf50'; break;
    case 'red':    background = '#f44336'; break;
    case 'orange': background = '#ff9800'; break;
    default:       background = '#ccc';
  }
  return {
    marginRight:  '4px',
    padding:      '4px 8px',
    background,
    color:        '#fff',
    border:       'none',
    borderRadius: '4px',
    cursor:       'pointer'
  };
}