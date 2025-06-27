import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardNavbar from '@/components/DashboardNavbar';
import EarningOptions from "@/components/EarningOptions";
import Footer from "@/components/Footer";


export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/"); // or use Clerk's default behavior
  }

  return (
    <>
          <main className="flex flex-col min-h-screen bg-black">

        <DashboardNavbar />

        <div className="flex-grow pt-32 px-4">

          {/* other dashboard content */}
          <EarningOptions />
        </div>

      </main>

    </>
  );
}