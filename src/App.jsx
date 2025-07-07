import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Leaderboard from './pages/leaderboard';
import Quiz from './pages/quiz';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/quiz/:category" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;
