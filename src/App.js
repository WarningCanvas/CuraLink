import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import MessageHistory from './pages/MessageHistory';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show splash screen for 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route 
            path="/" 
            element={<Dashboard />} 
          />
          <Route 
            path="/settings" 
            element={<Settings />} 
          />
          <Route 
            path="/history" 
            element={<MessageHistory />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;