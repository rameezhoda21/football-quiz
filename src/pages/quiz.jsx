import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import questionsByCategory from '../data/questions';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const backgroundMap = {
  'premier-league': '/prem_bg.webp',
  'la-liga': '/laliga2.jpg',
  'world-cup': '/worldcup.jpg',
  'euros': '/euros.webp',
  'champions-league': '/ucl.jpg'
};

export default function Quiz() {
  const { category } = useParams();
  const navigate = useNavigate();

  const limitMap = {
    'premier-league': 12,
    'la-liga': 10,
    'world-cup': 13,
    'champions-league': 15,
    'euros': 10
  };

  const questions = useMemo(() => {
    const fullSet = questionsByCategory[category] || [];
    const limit = limitMap[category] || fullSet.length;
    return [...fullSet].sort(() => Math.random() - 0.5).slice(0, limit);
  }, [category]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [playerName, setPlayerName] = useState('');
  const [scoreSaved, setScoreSaved] = useState(false);

  const current = questions[currentIndex];
  const bgImage = backgroundMap[category] || '/stadium.jpg';

  useEffect(() => {
    if (selected !== null || finished) return;
    setTimeLeft(10);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 1) {
          clearInterval(interval);
          handleTimeout();
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, selected]);

  const handleAnswer = option => {
    if (selected !== null) return;
    setSelected(option);
    if (option === current.answer) setScore(score + 1);
    setTimeout(() => goToNextQuestion(), 1000);
  };

  const handleTimeout = () => {
    setSelected('timeout');
    setTimeout(() => goToNextQuestion(), 1000);
  };

  const goToNextQuestion = () => {
    const next = currentIndex + 1;
    if (next < questions.length) {
      setCurrentIndex(next);
      setSelected(null);
      setTimeLeft(10);
    } else {
      setFinished(true);
    }
  };

  const saveScoreToLeaderboard = async (name, score, category) => {
    try {
      await addDoc(collection(db, 'leaderboard'), {
        name,
        score,
        category,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.error('Error adding score:', e);
    }
  };

   return (
    <div
      className="min-h-screen text-white bg-cover bg-center relative px-4 sm:px-6 lg:px-8 py-8"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-gray-900/70 to-blue-950/80 backdrop-blur-sm z-0" />

      {/* Main Quiz Container */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="w-full max-w-xl bg-black/60 border border-gray-700 rounded-2xl shadow-lg p-4 sm:p-6 backdrop-blur-md">
          {!finished && (
            <button
              onClick={() => navigate('/')}
              className="mb-4 text-sm border border-gray-600 text-gray-300 hover:text-white hover:border-white px-3 py-1 rounded transition"
            >
              ← Back to Home
            </button>
          )}

          {!finished ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-lg sm:text-xl font-bold text-blue-400 uppercase tracking-wider">
                    Question {currentIndex + 1}
                  </h1>
                  <div className="text-sm text-gray-300 bg-gray-800 px-3 py-1 rounded-full">
                    ⏱ {timeLeft}s
                  </div>
                </div>

                <h2 className="text-base sm:text-lg font-semibold mb-4">{current.question}</h2>

                <div className="grid gap-4">
                  {current.options.map(opt => {
                    const isSelected = selected === opt;
                    const isCorrect = current.answer === opt;
                    let bg = 'bg-gray-800 hover:bg-blue-700';
                    if (selected !== null) {
                      if (isSelected && isCorrect) bg = 'bg-green-600 text-white';
                      else if (isSelected && !isCorrect) bg = 'bg-red-600 text-white';
                      else if (isCorrect) bg = 'bg-green-700 text-white';
                      else bg = 'bg-gray-700 text-gray-400';
                    }
                    return (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(opt)}
                        disabled={selected !== null}
                        className={`w-full px-4 py-3 rounded-xl text-left font-medium text-sm sm:text-base transition duration-200 ${bg}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold mb-4 text-blue-400">🎉 Quiz Complete!</h2>
              <p className="text-lg mb-6">
                You scored <span className="font-bold text-green-400">{score}</span> out of {questions.length}
              </p>

              {!scoreSaved ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full px-4 py-2 rounded bg-gray-900 text-white border border-gray-600 placeholder-gray-500"
                  />
                  <button
                    onClick={() => {
                      if (playerName.trim().length >= 2 && !scoreSaved) {
                        saveScoreToLeaderboard(playerName.trim(), score, category);
                        setScoreSaved(true);
                      }
                    }}
                    disabled={scoreSaved || playerName.trim().length < 2}
                    className={`w-full px-4 py-2 rounded uppercase font-semibold tracking-wider transition ${
                      scoreSaved
                        ? 'bg-gray-600 text-gray-300'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {scoreSaved ? 'Score Submitted' : 'Submit Score'}
                  </button>
                </div>
              ) : (
                <p className="text-green-400 mb-4">✅ Score saved to leaderboard!</p>
              )}

              <div className="space-x-4 mt-6">
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 border border-gray-500 text-white rounded hover:bg-gray-700 transition"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => {
                    setCurrentIndex(0);
                    setScore(0);
                    setFinished(false);
                    setSelected(null);
                    setTimeLeft(10);
                    setPlayerName('');
                    setScoreSaved(false);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                >
                  Play Again
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}