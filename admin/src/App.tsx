import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Login from './pages/login/Login';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/protectrouters/ProtectedRoute';

import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Analytics from './pages/Analytics/Analytics';
import Bookings from './pages/Bookings/Bookings';
import Complaints from './pages/Complaints/Complaints';
import Hotels from './pages/Hotels/Hotels';
import Users from './pages/Users/Users';
import Profile from './pages/profile/Profile';
import Hotel from './components/hotel/Hotel';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="hotels" element={<Hotels />} />
            <Route path="/hotels/:hotelid" element={<ProtectedRoute><Hotel /></ProtectedRoute>} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="complaints" element={<Complaints />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;