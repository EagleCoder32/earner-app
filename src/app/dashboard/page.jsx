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
    <main className="p-4 bg-black">
          <DashboardNavbar />

           <div className="mt-32">
      {/* other dashboard content */}
      <EarningOptions />
    </div>

            {/* Footer */}
            <Footer />
    </main>

      </>
  );
}