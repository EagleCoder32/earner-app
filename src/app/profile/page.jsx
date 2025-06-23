"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  // In a real app you'd fetch this from your auth context or an API
  useEffect(() => {
    // Mock fetch
    setTimeout(() => {
      setUser({
        name: "Jane Doe",
        email: "jane.doe@example.com",
        points: 23450,
        joined: "2024-01-15",
      });
    }, 300);
  }, []);

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <p className="text-gray-500">Loading your profile…</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 font-sans">
      {/* Back to Dashboard */}
      <div className="mb-6">
        <Link href="/dashboard" className="text-blue-500 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
        <div className="space-y-3">
          <div>
            <span className="font-medium">Name: </span>
            <span>{user.name}</span>
          </div>
          <div>
            <span className="font-medium">Email: </span>
            <span>{user.email}</span>
          </div>
          <div>
            <span className="font-medium">Points Balance: </span>
            <span>{user.points.toLocaleString()}</span>
          </div>
          <div>
            <span className="font-medium">Member Since: </span>
            <span>{new Date(user.joined).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}