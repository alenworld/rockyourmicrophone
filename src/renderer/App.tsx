/* eslint-disable import/order */
/* eslint-disable react/button-has-type */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { useEffect } from 'react';

function Hello() {
  useEffect(() => {
    window.scanner.onFile((file) => {
      console.log(file);
    });
  }, []);

  const startScan = () => {
    window.scanner.start();
  };

  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <button onClick={startScan}>Start scan</button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
