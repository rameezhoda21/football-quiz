import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

// Audio imports
import ucl from '../assets/sounds/ucl.mp3';
import premier from '../assets/sounds/prem.mp3';
import laliga from '../assets/sounds/laliga.mp3';
import worldcup from '../assets/sounds/worldcup.mp3';
import euros from '../assets/sounds/euros.mp3';

const categories = [
  { name: "Premier League", id: "premier-league", questions: 12, time: "2 mins", description: "Test your knowledge of England’s top flight!" },
  { name: "La Liga", id: "la-liga", questions: 10, time: "100s", description: "Dive into Spain’s greatest rivalries and stars." },
  { name: "World Cup", id: "world-cup", questions: 13, time: "130s", description: "From Maradona to Mbappé, the ultimate stage." },
  { name: "UEFA Euros", id: "euros", questions: 10, time: "100s", description: "A European football showdown through the years." },
  { name: "Champions League", id: "champions-league", questions: 15, time: "150s", description: "The elite competition of Europe’s finest clubs." }
];

export default function Home() {
  const navigate = useNavigate();
  const audioRef = useRef(new Audio());
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sounds = {
    "champions-league": ucl,
    "premier-league": premier,
    "la-liga": laliga,
    "world-cup": worldcup,
    "euros": euros,
  };

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const handleHover = (id) => {
    if (!soundEnabled) return;
    const src = sounds[id];
    if (src) {
      audioRef.current.pause();
      audioRef.current.src = src;
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const stopAudio = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden text-white">
      {/* Background: video on desktop, gradient on mobile */}
      {isMobile ? (
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-gray-900 to-blue-950 z-0" />
      ) : (
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src="/bg1.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-4 py-10">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Choose Your Football Arena
        </h1>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`mb-6 px-4 py-2 rounded border ${soundEnabled ? 'border-green-400 text-green-400' : 'border-gray-500 text-gray-300'
            } bg-transparent hover:bg-white/10 transition`}
        >
          {soundEnabled ? "🔊 Audio On" : "🔇 Audio Off"}
        </button>

        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              onClick={() => {
                stopAudio();
                navigate(`/quiz/${cat.id}`);
              }}
              onMouseEnter={() => handleHover(cat.id)}
              onMouseLeave={stopAudio}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="cursor-pointer p-6 h-[280px] flex flex-col justify-between
                rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10
                shadow-md hover:shadow-lg transition-all duration-300 ease-in-out
                backdrop-blur-sm"
            >
              <div>
                <h2 className="text-lg font-bold">{cat.name}</h2>
                <p className="text-sm text-gray-300 mt-2">{cat.description}</p>
                <div className="mt-4 text-sm text-gray-400">
                  🧠 {cat.questions} Questions · ⏱️ {cat.time}
                </div>
              </div>
              <div className="mt-4">
                <button className="w-full px-4 py-2 rounded text-sm font-semibold border border-blue-400 text-blue-400 bg-transparent hover:bg-blue-500/20 transition">
                  Start Quiz →
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => {
            stopAudio();
            navigate('/leaderboard');
          }}
          className="mt-10 px-6 py-3 border border-cyan-400 text-cyan-400 hover:bg-cyan-500/10 rounded font-semibold transition"
        >
          🏆 View Leaderboard
        </button>
      </div>
    </div>
  );
}
