import React from 'react';
import logo from './logo.svg';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Properties from './pages/properties'
import Bookings from './pages/bookings'

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/bookings">
            <Bookings />
          </Route>
          <Route path="/">
            <Properties />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
