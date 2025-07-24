import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Home from "./pages/home/Home";

import "./index.css";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import HotelByCityPage from "./pages/hotelbycity/HotelByCityPage";
import HotelByTypePage from "./pages/hotelbytype/HotelByTypePage";
import ProtectedRoute from "./components/protectrouters/ProtectedRoute";
import HotelCreationStepper from "./pages/hotelcreationstepper/HotelCreationStepper";
import Profile from "./pages/profile/Profile";
import RoomStep from "./components/roomStep/RoomStep";
import axios from "axios";
axios.defaults.withCredentials = true;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotels/search" element={<ProtectedRoute><List /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/hotels/create" element={<ProtectedRoute><HotelCreationStepper /></ProtectedRoute>} />
          <Route path="/hotels/:hotelid" element={<ProtectedRoute><Hotel /></ProtectedRoute>} />
          <Route path="/hotels/edit-rooms" element={<RoomStep />} />
          <Route path="/hotels/city/:city" element={<ProtectedRoute><HotelByCityPage /></ProtectedRoute>} />
          <Route path="/hotels/type/:type" element={<ProtectedRoute><HotelByTypePage /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
