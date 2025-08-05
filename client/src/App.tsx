import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Home from "./pages/home/Home";

import "./index.css";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import HotelByCityPage from "./pages/hotelbycity/HotelByCityPage";
import HotelByTypePage from "./pages/hotelbytype/HotelByTypePage";
import ProtectedRoute from "./components/protectrouters/ProtectedRoute";
import HotelCreationStepper from "./pages/hotelcreationstepper/HotelCreationStepper";
import Profile from "./pages/profile/Profile";
import RoomStep from "./components/roomStep/RoomStep";
import axios from "axios";
import BookingPage from "./pages/booking/BookingPage";
import PaymentPage from "./pages/payment/PaymentPage";
import EditProfile from "./pages/edit-profile/EditProfile";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
axios.defaults.withCredentials = true;

function AppContent() {
  // Now useAuth is inside AuthProvider's context
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const hideNavAndFooter = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {isAuthenticated && !hideNavAndFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels/search" element={<ProtectedRoute><List /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/hotels/create" element={<ProtectedRoute><HotelCreationStepper /></ProtectedRoute>} />
        <Route path="/hotels/:hotelid" element={<ProtectedRoute><Hotel /></ProtectedRoute>} />
        <Route path="/hotels/edit-rooms" element={<RoomStep />} />
        <Route path="/hotels/city/:city" element={<ProtectedRoute><HotelByCityPage /></ProtectedRoute>} />
        <Route path="/hotels/type/:type" element={<ProtectedRoute><HotelByTypePage /></ProtectedRoute>} />
        <Route path="/book/:roomId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path="/payment/:roomId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      {isAuthenticated && !hideNavAndFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;