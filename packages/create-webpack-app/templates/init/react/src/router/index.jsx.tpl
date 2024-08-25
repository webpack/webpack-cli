import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../components/Home';
import HelloWorld from '../components/HelloWorld';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hello" element={<HelloWorld msg="Hello World" />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
