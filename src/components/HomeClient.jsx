'use client'; // ← Marks this file as a Client Component

import dynamic from 'next/dynamic';
import { SignUpButton } from '@clerk/nextjs';

// Dynamically import the heavy components, client‑only:
const Navbar       = dynamic(() => import('@/components/Navbar'), { ssr: false });
const HeroCard     = dynamic(() => import('@/components/HeroCard'), { ssr: false });
const ImageSlider  = dynamic(() => import('@/components/ImageSlider'), {
  ssr: false,
  loading: () => <p className="text-center text-white mt-8">Loading slider…</p>,
});
const Testimonials = dynamic(() => import('@/components/Testimonials'), {
  ssr: false,
  loading: () => <p className="text-center text-white mt-8">Loading reviews…</p>,
});
const Footer       = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function HomeClient() {
  return (
    <>
      <Navbar />

      <main className="relative bg-black text-gray-900">
           {/* ==== Hero ==== */}
               <section className="relative overflow-hidden">
                 <div className="bg-gradient-to-br from-purple-600 to-indigo-600 pt-20 pb-32">
                   <div className="container mx-auto px-6 lg:px-20 text-center mt-12">
                     <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                       Earn Cash, Gift Cards &amp; Games Currency
                     </h1>
                     <p className="mt-4 text-lg text-purple-100 max-w-2xl mx-auto">
                       100% Legit Site for Earning and we guranteed we pay everyone, if you not believe then try one time  !
                     </p>
                     <SignUpButton mode="modal">
                       <button className="mt-8 inline-block bg-white text-purple-700 py-3 px-8 rounded-full  transition font-bold">
                         Start Earning!
                       </button>
                     </SignUpButton>
                   </div>
                 </div>
       
       
       
       
                 {/* Hero “card” preview */}
                 <div className="-mt-16 flex justify-center">
                   <HeroCard />
                 </div>
               </section>
       
               {/* Divider */}
               <div className="w-full h-1 bg-white opacity-65 my-12 -mb-9 mt-20" />
       
       
       
               {/* ==== Image Slider ==== */}
               <section className="my-24">
       
                 <h2 className="my-14 text-center text-4xl font-extrabold text-green-500 ">
                   Redeem 💵
                 </h2>
       
                 {/* ==== Image Slider ==== */}
       
                 <ImageSlider
                   visibleCount={3}
                   interval={3000}
                   categories={[
                     {
                       title: "Cash",
                       items: [
                         { src: "/paypal.svg", caption: "PayPal" },
                         { src: "/upi-pay.svg", caption: "UPI" },
                         { src: "/gcash.webp", caption: "GCash" },
                       ],
                     },
                     {
                       title: "Gift Cards",
                       items: [
                         { src: "/google-play.svg", caption: "Google Play\nRedeem Code" },
                         { src: "/amazon-gift-card.svg", caption: "Amazon" },
                         { src: "/flipkart.svg", caption: "Flipkart" },
                         { src: "/steam.svg", caption: "Steam" },
                       ],
                     },
                     {
                       title: "Games Currency",
                       items: [
                         { src: "/free-fire-diamond.png", caption: "Free Fire\nDiamond" },
                         { src: "/roblox-robux.svg", caption: "Robux" },
                         { src: "/uc.png", caption: "BGMI/PUBG\nUC" },
                         { src: "/call-of-duty-mobile-cp.png", caption: "Call of Duty\n(CP)" },
                         { src: "/mobile-legends-diamond.webp", caption: "Mobile Legends\n (Diamonds)" },
                         { src: "/fortnite-v-bucks.webp", caption: "Fortnite \n(Vbucks)" },
                       ],
                     },
                   ]}
                 />
               </section>
       
       
               {/* Divider */}
               <div className="w-full h-1 bg-white opacity-65 my-24 -mt-7" />
       
       
               {/* ==== Features Teaser ==== */}
               <h2 className="my-0 text-center text-4xl font-extrabold text-white mb-16">
                 How To Earn💰
               </h2>
               <section className="container mx-auto px-6 lg:px-20  grid grid-cols-1 md:grid-cols-3 gap-8">
       
       
                 <div className="bg-white rounded-xl shadow p-6 text-center">
                   <h3 className="text-2xl font-semibold mb-2">🎥 Type &amp; Earn</h3>
                   <p className="text-gray-600">
                     Earn by typing simple text
                   </p>
                 </div>
       
                 <div className="bg-white rounded-xl shadow p-6 text-center">
                   <h3 className="text-2xl font-semibold mb-2">📰 Read &amp; Earn</h3>
                   <p className="text-gray-600">
                     Read articles and Earn
                   </p>
                 </div>
       
                 <div className="bg-white rounded-xl shadow p-6 text-center">
                   <h3 className="text-2xl font-semibold mb-2">💰 Redeem</h3>
                   <p className="text-gray-600">
                     Cash out your points instantly via Cash, Gift Cards, or Game Currency
                   </p>
                 </div>
               </section>
       
               {/* Divider */}
               <div className="h-1 bg-white opacity-65 my-24" />
       
               {/* ==== User Reviews ==== */}
               <section className="container mx-auto px-6 lg:px-20 mt-20 mb-16">
                 <h2 className="text-3xl font-extrabold text-center  text-lime-400 -mt-11">User Reviews</h2>
       
                 {/* ==== Testimonials ==== */}
                 <Testimonials />
       
               </section>
       
       
               {/* …all your sections… */}
       
               {/* Footer */}
               <Footer />
       
      </main>
    </>
  );
}

// 'use client'; // ← Marks this file as a Client Component

// import dynamic from 'next/dynamic';

// // Dynamically import the heavy components, client‑only:
// const Navbar       = dynamic(() => import('@/components/Navbar'), { ssr: false });
// const HeroCard     = dynamic(() => import('@/components/HeroCard'), { ssr: false });
// const ImageSlider  = dynamic(() => import('@/components/ImageSlider'), {
//   ssr: false,
//   loading: () => <p className="text-center text-white mt-8">Loading slider…</p>,
// });
// const Testimonials = dynamic(() => import('@/components/Testimonials'), {
//   ssr: false,
//   loading: () => <p className="text-center text-white mt-8">Loading reviews…</p>,
// });
// const Footer       = dynamic(() => import('@/components/Footer'), { ssr: false });

// export default function HomeClient() {
//   return (
//     <>
//       <Navbar />

//       <main className="relative bg-black text-gray-900">
//         {/* … the exact same JSX you had before … */}
//         {/* Hero section, HeroCard, ImageSlider, Features, Testimonials, Footer */}
//         {/* Copy that entire return block from your previous HomePage */}
//       </main>
//     </>
//   );
// }