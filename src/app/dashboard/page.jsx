// src/app/dashboard/page.jsx


import DashboardClient from '@/components/DashboardClient';

export default function DashboardPage() {
  return <DashboardClient />;
}



// old code--------------------------------------------
// import { auth } from '@clerk/nextjs/server';
// import { redirect } from 'next/navigation';
// import DashboardClient from '@/components/DashboardClient';

// export default async function DashboardPage() {
//   const { userId } = await auth();
//   if (!userId) redirect('/');

//   return <DashboardClient />;
// }