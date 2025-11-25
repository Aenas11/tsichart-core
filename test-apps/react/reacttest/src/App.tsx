import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { LineChartDemo } from './pages/charts/LineChartDemo';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/charts/line" element={<LineChartDemo />} />
            <Route path="*" element={<ComingSoon />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function ComingSoon() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Coming Soon</h1>
        <p>This page is under construction</p>
      </header>
    </div>
  );
}

export default App;
