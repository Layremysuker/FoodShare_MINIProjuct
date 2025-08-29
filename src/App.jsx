// src/App.jsx
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Loading from "./Loading";
import Login from "./Login";
import Welcome from "./Welcome";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";
import Dashboard from "./Dashboard";
import Home from "./Home";
import Menu from "./Menu";
import Notifications from "./Notifications";
import Profile from "./Profile"; // ต้องตรงกับไฟล์จริง

function App() {
  const [currentPage, setCurrentPage] = useState("welcome"); // ตัวเลือก currentPage: welcome / login / signup / forgot / dashboard / home / menu / notifications / profile
  const [userData, setUserData] = useState(null);
  const [loadingFinished, setLoadingFinished] = useState(false);

  // ตรวจสอบ session ของ Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData({ email: user.email, uid: user.uid });
        setCurrentPage("home");
      } else {
        setUserData(null);
        setCurrentPage("welcome");
      }
    });
    return () => unsubscribe();
  }, []);

  if (!loadingFinished)
    return <Loading onFinish={() => setLoadingFinished(true)} />;

  // หน้า Welcome
  if (currentPage === "welcome") {
    return (
      <Welcome
        onLoginClick={() => setCurrentPage("login")}
        onRegisterClick={() => setCurrentPage("signup")}
      />
    );
  }

  // หน้า Login
  if (currentPage === "login") {
    return (
      <Login
        onLoginSuccess={(data) => {
          setUserData(data); // เก็บ userData จาก Login.jsx
          setCurrentPage("home"); // ไป home
        }}
        onSignUpClick={() => setCurrentPage("signup")}
        onForgotPasswordClick={() => setCurrentPage("forgot")}
      />
    );
  }

  // หน้า SignUp
  if (currentPage === "signup") {
    return (
      <SignUp
        onBackToLogin={() => setCurrentPage("login")}
        onSignUp={() => {
          alert("Sign Up Success! Please log in.");
          setCurrentPage("login");
        }}
      />
    );
  }

  // หน้า Forgot Password
  if (currentPage === "forgot") {
    return (
      <ForgotPassword
        onBackToLogin={() => setCurrentPage("login")}
      />
    );
  }

  // หน้า Dashboard
  if (currentPage === "dashboard" && userData) {
    return (
      <Dashboard
        userData={userData}
        onLogout={() => {
          setUserData(null);
          setCurrentPage("login");
        }}
      />
    );
  }

    // หน้า Home
  if (currentPage === "home" && userData) {
    return (
      <Home
        userData={userData}
        onGoToDashboard={() => setCurrentPage("dashboard")}
        onGoToMenu={() => setCurrentPage("menu")}
        onGoToProfile={() => setCurrentPage("profile")}
        onGoToNotifications={() => setCurrentPage("notifications")}
        onLogout={() => {
          setUserData(null);
          setCurrentPage("login");
        }}
      />
    );
  }

  // หน้า Menu
  if (currentPage === "menu") {
    return <Menu onBack={() => setCurrentPage("home")}
          onGoToProfile={() => setCurrentPage("profile")}
            onGoToNotifications={() => setCurrentPage("notifications")}
            onLogout={() => {
            setUserData(null);
            setCurrentPage("login");
      }}
      />;
  }

  // หน้า Notifications
  if (currentPage === "notifications") {
    return (
      <Notifications
        onGoToMenu={() => setCurrentPage("menu")}
        onGoToProfile={() => setCurrentPage("profile")}
        onBack={() => setCurrentPage("home")} 
      />
    );
  }

  // หน้า Profile
  if (currentPage === "profile" && userData) {
    return (
      <Profile
        userData={userData}
        onGoToMenu={() => setCurrentPage("menu")}
        onGoToNotifications={() => setCurrentPage("notifications")}
        onBack={() => setCurrentPage("home")} 
        onLogout={() => {
          setUserData(null);
          setCurrentPage("login");
        }}
      />
    );
  }



  // fallback
  return <div>Loading...</div>;
}

export default App;
