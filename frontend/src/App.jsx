import SignUpPage from "./pages/SignUpPage.jsx"
import LoginPage from "./pages/loginPage.jsx"
import HomePage from "./pages/HomePage.jsx"
import SettingsPage from "./pages/SettingsPage.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"
import { useAuthStore } from "./store/useAuthStore";
import {Routes , Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx"
import { useEffect } from "react";

const App = () => {

  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();

  useEffect(() => {
    // Load authUser from localStorage on app start
    const storedUser = JSON.parse(localStorage.getItem("authUser"));
    if (storedUser) {
      useAuthStore.setState({ authUser: storedUser });
    }
  }, []);
  return (
    
    <div>
      <Navbar />
 <Routes>
  <Route path="/" element={authUser? <HomePage />: <Navigate to="/login"/>} />
  <Route path="/signup" element={<SignUpPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/settings" element={<SettingsPage />} />
  <Route path="/profile" element={<ProfilePage />} />
 </Routes>

 <Toaster />
    </div>
  )
}

export default App
