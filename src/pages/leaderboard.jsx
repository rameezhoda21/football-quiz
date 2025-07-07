import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const categories = [
  "premier-league",
  "la-liga",
  "world-cup",
  "champions-league",
  "euros"
];

const categoryNames = {
  "premier-league": "Premier League",
  "la-liga": "La Liga",
  "world-cup": "World Cup",
  "champions-league": "Champions League",
  "euros": "UEFA Euros"
};

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState({});
  const [statsData, setStatsData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLeaderboard() {
      const data = {};
      const stats = {};

      for (const category of categories) {
        const q = query(collection(db, "leaderboard"), where("category", "==", category));
        const snapshot = await getDocs(q);

        const scores = snapshot.docs.map(doc => doc.data());
        const sorted = scores.sort((a, b) => b.score - a.score);
        data[category] = sorted;

        const totalPlayers = scores.length;
        const totalScore = scores.reduce((sum, entry) => sum + entry.score, 0);
        const averageScore = totalPlayers ? (totalScore / totalPlayers).toFixed(2) : 0;
        const topScore = sorted[0]?.score || 0;

        stats[category] = {
          topScore,
          averageScore,
          totalPlayers
        };
      }

      setLeaderboardData(data);
      setStatsData(stats);
    }

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center uppercase tracking-widest mb-10 drop-shadow-lg">
          🏆 Global Leaderboard
        </h1>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="mb-10 px-6 py-2 border-2 border-blue-400 text-blue-400 font-semibold uppercase tracking-wide rounded hover:bg-blue-400 hover:text-black transition"
          >
            ← Back Home
          </button>
        </div>

        {/* Your leaderboard cards (unchanged) */}
        {categories.map(cat => (
          <div key={cat} className="bg-black/60 rounded-xl p-6 shadow-lg border border-gray-700 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 tracking-wider uppercase text-blue-400">
              {categoryNames[cat]}
            </h2>
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800/80 p-4 rounded-lg text-center shadow">
                <p className="text-sm text-gray-400">Top Score</p>
                <p className="text-2xl font-bold">{statsData[cat]?.topScore ?? "-"}</p>
              </div>
              <div className="bg-gray-800/80 p-4 rounded-lg text-center shadow">
                <p className="text-sm text-gray-400">Average Score</p>
                <p className="text-2xl font-bold">{statsData[cat]?.averageScore ?? "-"}</p>
              </div>
              <div className="bg-gray-800/80 p-4 rounded-lg text-center shadow">
                <p className="text-sm text-gray-400">Total Players</p>
                <p className="text-2xl font-bold">{statsData[cat]?.totalPlayers ?? "-"}</p>
              </div>
            </div>

            {/* Score Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-sm text-blue-400 uppercase">
                    <th className="px-2 py-1">Rank</th>
                    <th className="px-2 py-1">Name</th>
                    <th className="px-2 py-1">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData[cat]?.length > 0 ? (
                    leaderboardData[cat].map((entry, i) => (
                      <tr key={i} className="bg-gray-900 hover:bg-gray-700 transition rounded">
                        <td className="px-2 py-1">{i + 1}</td>
                        <td className="px-2 py-1 font-medium">{entry.name}</td>
                        <td className="px-2 py-1">{entry.score}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-gray-400">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
