// src/components/HeroCard.jsx
export default function HeroCard() {
  return (
    <div className="bg-white rounded-2xl p-4 w-[350px] mx-auto text-center">
      {/* Responsive YouTube embed */}
      <div className="relative" style={{ paddingTop: "56.25%" /* 16:9 */ }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src="https://www.youtube.com/embed/Dq7ER1NPtGw?si=A7fZCTz6Ns5FqzRT"
          title="How to Earn on EagleEarner"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* (Optional) CTA button below the video */}
      <button className="mt-2 inline-block bg-purple-600 text-white font-medium py-2 px-4 rounded-full hover:bg-purple-500 transition">
       How to Earn?
      </button>
    </div>
  );
}