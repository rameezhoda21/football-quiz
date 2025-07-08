import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

// Audio imports
import ucl from '../assets/sounds/ucl.mp3';
import premier from '../assets/sounds/prem.mp3';
import laliga from '../assets/sounds/laliga.mp3';
import worldcup from '../assets/sounds/worldcup.mp3';
import euros from '../assets/sounds/euros.mp3';

const categories = [
  {
    name: "Premier League",
    id: "premier-league",
    questions: 12,
    time: "2 mins",
    description: "Test your knowledge of England’s top flight!"
  },
  {
    name: "La Liga",
    id: "la-liga",
    questions: 10,
    time: "100s",
    description: "Dive into Spain’s greatest rivalries and stars."
  },
  {
    name: "World Cup",
    id: "world-cup",
    questions: 13,
    time: "130s",
    description: "From Maradona to Mbappé, the ultimate stage."
  },
  {
    name: "UEFA Euros",
    id: "euros",
    questions: 10,
    time: "100s",
    description: "A European football showdown through the years."
  },
  {
    name: "Champions League",
    id: "champions-league",
    questions: 15,
    time: "150s",
    description: "The elite competition of Europe’s finest clubs."
  }
];

export default function Home() {
  const navigate = useNavigate();
  const audioRef = useRef(new Audio());
  const [soundEnabled, setSoundEnabled] = useState(false);

  const sounds = {
    "champions-league": ucl,
    "premier-league": premier,
    "la-liga": laliga,
    "world-cup": worldcup,
    "euros": euros,
  };

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
    <div className="relative w-full min-h-screen overflow-hidden text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover z-[-1] bg-black"
      >
        <source src="/bg1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-4 py-10 min-h-screen">
    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-white to-gray-200 text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] mb-5">
  Choose Your Arena
</h1>


        {/* Transparent Audio Toggle Button */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`mb-8 px-6 py-2 border-2 rounded uppercase tracking-wider font-semibold transition duration-200 ${soundEnabled
            ? 'border-green-400 text-green-400 hover:bg-green-400 hover:text-black'
            : 'border-gray-400 text-gray-300 hover:bg-gray-300 hover:text-black'
            }`}
        >
          {soundEnabled ? "🔊 Audio On" : "🔇 Audio Off"}
        </button>

        {/* Quiz Cards */}
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
              whileHover={{ scale: 1.03 }}
              className="cursor-pointer p-6 h-[280px] flex flex-col justify-between
                rounded-xl border border-gray-600 bg-black/40 hover:bg-black/60
                shadow-xl hover:shadow-blue-500/20 transition duration-300
                backdrop-blur-sm text-white"
            >
              <div>
                <h2 className="text-xl font-semibold tracking-wide mb-1">{cat.name}</h2>
                <p className="text-sm text-gray-300">{cat.description}</p>
                <div className="mt-4 text-xs text-gray-400 tracking-wider">
                  🧠 {cat.questions} Questions · ⏱️ {cat.time}
                </div>
              </div>
              <div className="mt-4">
                <button className="w-full px-4 py-2 rounded text-sm font-bold uppercase tracking-widest
  bg-black/60 border border-gray-500 hover:bg-blue-500 hover:text-white hover:border-blue-400
  transition duration-200">
                  Start →
                </button>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Leaderboard Button */}
        <button
          onClick={() => {
            stopAudio();
            navigate('/leaderboard');
          }}
          className="mt-12 px-6 py-3 rounded font-bold uppercase tracking-widest
    bg-black/60 border border-gray-500 hover:bg-blue-500 hover:text-white hover:border-blue-400
    transition duration-200"
        >
          🏆 View Leaderboard
        </button>

      </div>
    </div >
  );
}
