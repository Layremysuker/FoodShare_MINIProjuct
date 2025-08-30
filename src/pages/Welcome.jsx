import React, { useEffect, useState } from "react";
import logo from "../img/Logo.png"; 
import googleIcon from "../img/google.png";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase"; // ✅ import auth จาก firebase

export default function Welcome({ onLoginClick, onGoogleClick, onRegisterClick, onLoginSuccess }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // 🔹 ฟังก์ชัน Google Login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google login user:", user);
      alert("Google Login Success!");
      onLoginSuccess && onLoginSuccess(user); // ส่ง user กลับไป App.jsx
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="w-full h-screen bg-[#2e2eff] font-sans flex flex-col justify-between items-center px-6 py-8">

      {/* Logo + App Name */}
      <div className={`flex flex-col items-center mt-12 transition-all duration-700 ease-out 
                       ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
        <img src={logo} alt="MA THAN Logo" className="w-20 h-20 mb-2" />
        <div className="text-white text-base font-bold">MA THAN</div>
      </div>

      {/* Middle content */}
      <div className={`flex flex-col items-center w-full max-w-sm mt-[-180px] transition-all duration-700 ease-out delay-200
                       ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
        <h1 className="text-white text-3xl font-bold mb-2">Log In</h1>
        <p className="text-white text-center mb-6">
          Please sign in with your student email to continue.
        </p>

        {/* Sign in with Email */}
        <button
          onClick={onLoginClick}
          className="w-[300px] h-[70px] py-3 bg-white text-[#2e2eff] rounded-[4vw] text-lg font-medium mb-4 shadow hover:bg-gray-100 transition"
        >
          Sign in with Email
        </button>

        {/* Sign in with Google */}
        <button
          onClick={handleGoogleLogin} // ⬅️ ใช้ฟังก์ชัน Google Login
          className="w-[150px] py-3 bg-white text-[#2e2eff] flex items-center justify-center rounded-[4vw] text-sm font-medium shadow hover:bg-gray-100 transition"
        >
          <img
            src={googleIcon}
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Google
        </button>
      </div>

      {/* Footer: Create Account */}
      <button
        onClick={onRegisterClick}
        className={`text-white text-sm hover:underline mb-4 transition-all duration-700 ease-out delay-400
                    ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        Create an Account
      </button>
    </div>
  );
}
