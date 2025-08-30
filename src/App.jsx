import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Loading from "./pages/Loading";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

function App() {
  const [currentPage, setCurrentPage] = useState("welcome");
  const [userData, setUserData] = useState(null);
  const [loadingFinished, setLoadingFinished] = useState(false);

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

  // logout เฉพาะหน้า profile
  const handleLogout = () => {
    setUserData(null);
    setCurrentPage("login");
  };

  if (!loadingFinished)
    return <Loading onFinish={() => setLoadingFinished(true)} />;

  switch (currentPage) {
    case "welcome":
      return <Welcome onLoginClick={() => setCurrentPage("login")} onRegisterClick={() => setCurrentPage("signup")} />;
    case "login":
      return <Login
                onLoginSuccess={(data) => { setUserData(data); setCurrentPage("home"); }}
                onSignUpClick={() => setCurrentPage("signup")}
                onForgotPasswordClick={() => setCurrentPage("forgot")}
             />;
    case "signup":
      return <SignUp
                onBackToLogin={() => setCurrentPage("login")}
                onSignUp={() => { alert("Sign Up Success! Please log in."); setCurrentPage("login"); }}
             />;
    case "forgot":
      return <ForgotPassword onBackToLogin={() => setCurrentPage("login")} />;
    case "dashboard":
      return <Dashboard userData={userData} setCurrentPage={setCurrentPage} />;
    case "home":
      return <Home
                userData={userData}
                onGoToDashboard={() => setCurrentPage("dashboard")}
                onGoToMenu={() => setCurrentPage("menu")}
                onGoToProfile={() => setCurrentPage("profile")}
                onGoToNotifications={() => setCurrentPage("notifications")}
             />;
    case "menu":
      return <Menu
                userData={userData}
                onBack={() => setCurrentPage("home")}
                onGoToProfile={() => setCurrentPage("profile")}
                onGoToNotifications={() => setCurrentPage("notifications")}
             />;
    case "notifications":
      return <Notifications
                userData={userData}
                onBack={() => setCurrentPage("home")}
                onGoToMenu={() => setCurrentPage("menu")}
                onGoToProfile={() => setCurrentPage("profile")}
             />;
    case "profile":
      return <Profile
                userData={userData}
                onBack={() => setCurrentPage("home")}
                onGoToMenu={() => setCurrentPage("menu")}
                onGoToNotifications={() => setCurrentPage("notifications")}
                onLogout={handleLogout}  // <- logout เฉพาะหน้า profile
             />;
    default:
      return <div>Loading...</div>;
  }
}

export default App;