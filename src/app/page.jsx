// src/app/page.jsx

export const runtime = 'edge'; 


import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import HomeClient from "@/components/HomeClient";

export default async function HomePage() {
  // Server‑side auth check:
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return <HomeClient />;
}