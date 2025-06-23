import Head from 'next/head';

export default function Page() {
  return (
    <>
      <Head>
        {/* Retro arcade font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-700 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-black bg-opacity-50 p-8 rounded-2xl text-center max-w-md w-full">
          <h1
            className="text-4xl font-extrabold text-white mb-6 tracking-wider"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            Play & Earn Games
          </h1>

          <p className="text-gray-200 mb-8">
            Play exciting games and earn rewards on our WordPress platform!
          </p>

          <a
            href="https://eagleearner.com/play-games/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-4 text-lg font-bold uppercase tracking-wider bg-pink-600 text-white rounded-lg"
          >
            Start Playing Games
          </a>
        </div>
      </div>
    </>
  );
}