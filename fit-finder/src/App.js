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

    <Router>
      <Route component = {Login} path="/login" exact/>
      <Route component = {LandingPage} path="/" exact/>
    </Router>
    
  );
}

export default App;
