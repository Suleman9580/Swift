
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import GenerationPage from './components/GenerationPage';

function App() {
  return (
    <BrowserRouter>
      
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/generate" element={<GenerationPage />} />
          </Routes>
        </div>
      
    </BrowserRouter>
  );
}

export default App;