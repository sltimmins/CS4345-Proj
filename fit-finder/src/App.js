import './App.css';
import React from 'react';
import { 
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import { LandingPage } from './LandingPage';
import { Login } from './Login';

function App() {
  return (
      <LandingPage />
  );
}

export default App;
