
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import GenerationPage from './components/GenerationPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/generate" element={<GenerationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;