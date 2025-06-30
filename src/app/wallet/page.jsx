// src/app/wallet/page.jsx
import { redirect }          from "next/navigation"
import { getAuth }           from "@clerk/nextjs/server"
import { headers, cookies }  from "next/headers"
import { connectToDatabase } from "@/lib/mongodb"
import User                  from "@/models/User"
import Link                  from "next/link"

export const dynamic = 'force-dynamic'

export default async function WalletPage() {
  // 1) Read the incoming request’s headers & cookies
  const reqHeaders = headers()
  const reqCookies = cookies()

  // 2) Authenticate via Clerk on the server
  const { userId } = getAuth({ headers: reqHeaders, cookies: reqCookies })
  if (!userId) {
    return redirect("/sign-in")
  }

  // 3) Fetch the user’s points
  await connectToDatabase()
  const user = await User.findOne({ clerkId: userId })
  const points = user?.points ?? 0

  // 4) Render the wallet UI
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 min-h-screen bg-gray-50">

         {/* ← Add Transaction History button here */}
      <div className="absolute top-4 right-4">
        <Link
          href="/withdrawal/history"
          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Transaction History
        </Link>
      </div>

      <div className="flex items-center space-x-3">
        <span className="text-5xl">🪙</span>
        <span className="text-5xl font-bold">{points.toLocaleString()}</span>
      </div>
      <p className="mt-2 text-gray-600">Available Balance</p>
      <Link href="/withdrawal">
        <button
          className="mt-6 inline-flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 transition"
        >
          <span className="text-xl">💼</span>
          <span className="font-medium">Redeem</span>
        </button>
      </Link>
    </div>
  )
}