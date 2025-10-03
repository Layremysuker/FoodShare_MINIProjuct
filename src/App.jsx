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
import Post from "./pages/Post";
import FoodDetail from "./pages/FoodDetail";
import EditPost from "./pages/EditPost";
import FoodDetail_Cancel from "./pages/FoodDetail_Cancel";

function App() {
  const [currentPage, setCurrentPage] = useState("welcome");
  const [userData, setUserData] = useState(null);
  const [loadingFinished, setLoadingFinished] = useState(false);
  const [selectedFoodItem, setSelectedFoodItem] = useState(null); // ✅ เพิ่ม
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedClaim, setselectedClaim] = useState(null);

  // 👇 state สำหรับ Search ระหว่าง Home -> Menu
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedCategory, setSelectedCategory] = useState("ALL");

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
      return (
        <Welcome
          onLoginClick={() => setCurrentPage("login")}
          onRegisterClick={() => setCurrentPage("signup")}
        />
      );

    case "login":
      return (
        <Login
          onLoginSuccess={(data) => {
            setUserData(data);
            setCurrentPage("home");
          }}
          onSignUpClick={() => setCurrentPage("signup")}
          onForgotPasswordClick={() => setCurrentPage("forgot")}
        />
      );

    case "signup":
      return (
        <SignUp
          onBackToLogin={() => setCurrentPage("login")}
          onSignUp={() => {
            alert("Sign Up Success! Please log in.");
            setCurrentPage("login");
          }}
        />
      );

    case "forgot":
      return <ForgotPassword onBackToLogin={() => setCurrentPage("login")} />;

    case "dashboard":
      return <Dashboard userData={userData} setCurrentPage={setCurrentPage} />;

    case "home":
      return (
          <Home
            userData={userData}
            onGoToDashboard={() => setCurrentPage("dashboard")}
            onGoToMenu={() => {
              setCurrentPage("menu");
              // ไม่ต้องรีเซ็ตที่นี่ เพราะเราอาจต้องใช้ category ล่าสุดจาก Home
            }}
            onGoToProfile={() => setCurrentPage("profile")}
            onGoToNotifications={() => setCurrentPage("notifications")}
            onGoToPost={() => setCurrentPage("post")}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={(query) => {
              setSearchQuery(query);
              setSelectedCategory("ALL"); // search ไม่มี category → ALL
              setCurrentPage("menu");
            }}
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              setSearchQuery(""); // ล้าง search
              setCurrentPage("menu");
            }}
          />
      );

      case "menu":
        return (
          <Menu
            userData={userData}
            currentPage={currentPage}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategoryFromHome={selectedCategory} // ✅ ส่ง category จาก Home
            onBack={() => {
              setCurrentPage("home");
              setSelectedCategory("ALL"); // 🔹 รีเซ็ตเป็น ALL ตอนกลับหน้า Home
            }}
            onGoToProfile={() => setCurrentPage("profile")}
            onGoToNotifications={() => setCurrentPage("notifications")}
            onGoToPost={() => setCurrentPage("post")}
            onSelectFood={(foodItem) => {
              setSelectedFoodItem(foodItem);   // เก็บรายการที่เลือก
              setCurrentPage("foodDetail");    // เปลี่ยนหน้าไป FoodDetail
            }}
          />
        );


    case "post":
      return (
        <Post
          userData={userData}
          onBack={() => setCurrentPage("home")}
          onGoToMenu={() => setCurrentPage("menu")}
          onGoToNotifications={() => setCurrentPage("notifications")}
          onGoToProfile={() => setCurrentPage("profile")}
          setCurrentPage={setCurrentPage} // ✅ ส่ง setCurrentPage ไปด้วย
        />
      );

    case "notifications":
      return (
        <Notifications
          userData={userData}
          onBack={() => setCurrentPage("home")}
          onGoToMenu={() => setCurrentPage("menu")}
          onGoToProfile={() => setCurrentPage("profile")}
          onGoToPost={() => setCurrentPage("post")}
          onGoToEditPost={() => setCurrentPage("editPost")}
          onSelectedPost={(item) => {
                console.log("เลือกโพสต์:", item);
              setSelectedPost(item);   // เก็บรายการที่เลือก
              setCurrentPage("editPost");    // เปลี่ยนหน้าไป FoodDetail
            }}
          onSelectClaim={(claimitem) => {
              setselectedClaim(claimitem);   // เก็บรายการที่เลือก
              setCurrentPage("foodDetail_cancel");    // เปลี่ยนหน้าไป FoodDetail
            }}
        />
      );

    case "profile":
      return (
        <Profile
          userData={userData}
          onBack={() => setCurrentPage("home")}
          onGoToMenu={() => setCurrentPage("menu")}
          onGoToNotifications={() => setCurrentPage("notifications")}
          onGoToPost={() => setCurrentPage("post")}
          onLogout={handleLogout} // <- logout เฉพาะหน้า profile
        />
      );

    case "foodDetail":
      return (
        <FoodDetail
        
          userData={userData}
          // ✅ ส่งข้อมูล foodItem ที่เลือกไปด้วย
          foodItem={selectedFoodItem}   // ต้องไม่เป็น null
          onBack={() => setCurrentPage("menu")}
          setCurrentPage={setCurrentPage} // ✅ ส่ง setCurrentPage ไปด้วย
        />
      );

    case "editPost":
      return (
        <EditPost
          userData={userData}
          post={selectedPost} // ส่งโพสต์ที่เลือกไป
          onBack={() => setCurrentPage("notifications")}
          onGoToMenu={() => setCurrentPage("menu")}
          onGoToProfile={() => setCurrentPage("profile")}
          onGoToNotifications={() => setCurrentPage("notifications")}
          onGoToPost={() => setCurrentPage("post")}
        />
      );

    case "foodDetail_cancel":
      console.log("userData.uid:", userData.uid);
      console.log("👉 Claim ที่เลือก:", selectedClaim);
      return (
        <FoodDetail_Cancel  
          userData={userData}
          // ✅ ส่งข้อมูล foodItem ที่เลือกไปด้วย
          ClaimItem={selectedClaim}   // ต้องไม่เป็น null
          onBack={() => setCurrentPage("notifications")}
          setCurrentPage={setCurrentPage} // ✅ ส่ง setCurrentPage ไปด้วย
        />
      );


    default:
      return <div>Loading...</div>;
  }
}

export default App;
