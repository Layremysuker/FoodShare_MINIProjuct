// src/Login.jsx
import React, { useState, useEffect } from "react";
import googleIcon from "./img/google.png";
import { ref, get, set } from "firebase/database";
import { auth, database } from "./firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Login({ onSignUpClick, onForgotPasswordClick, onLoginSuccess }) {
  const [animate, setAnimate] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // toggle password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // SVG Icons
  const eyeIcon = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#9D9B9B" 
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
    viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  `);

  const eyeOffIcon = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#9D9B9B" 
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
    viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8 
      a18.2 18.2 0 0 1 2.53-3.69"/>
      <path d="M9.88 9.88a3 3 0 0 1 4.24 4.24"/>
      <path d="M3 3l18 18"/>
    </svg>
  `);

    // 🔹 Login ด้วย Email/Password
    const handleLogin = async (e) => {
    e.preventDefault();

    try {
        // 🔹 ตรวจสอบ email & password ผ่าน Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 🔹 ตรวจสอบข้อมูลเพิ่มเติมใน Database (ถ้ามี)
        const snapshot = await get(ref(database, "users/" + user.uid));
        let userData = {};
        if (snapshot.exists()) {
        userData = snapshot.val();
        }

        // 🔹 Login สำเร็จ → ส่งข้อมูลกลับไปที่ App.jsx
        console.log("Login success!", user.email);
        onLoginSuccess && onLoginSuccess({ email: user.email, uid: user.uid, ...userData });

    } catch (error) {
        console.error("Login error:", error.code, error.message);

        // 🔹 แสดง error ตามประเภท
        if (error.code === "auth/user-not-found") {
        alert("ไม่พบบัญชีนี้ กรุณาสมัครก่อน ❌");
        } else if (error.code === "auth/wrong-password") {
        alert("รหัสผ่านไม่ถูกต้อง ❌");
        } else if (error.code === "auth/invalid-credential") {
        alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง ❌");
        } else {
        alert("เกิดข้อผิดพลาด: " + error.message);
        }
    }
    };


  // 🔹 Login ด้วย Google
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ตรวจสอบ DB
      const snapshot = await get(ref(database, "users/" + user.uid));
      if (!snapshot.exists()) {
        // สร้าง user ใหม่ใน DB
        await set(ref(database, "users/" + user.uid), {
          email: user.email,
          name: user.displayName || "",
          uid: user.uid,
        });
      }

      onLoginSuccess && onLoginSuccess({ email: user.email, name: user.displayName, uid: user.uid });
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="w-full bg-[#2e2eff] flex flex-col justify-start items-center pt-8">
      {/* Header */}
      <div
        className={`text-center mt-12 transition-all duration-700 ease-out
        ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        <h1 className="text-4xl font-bold text-white mb-2">Log In</h1>
        <p className="text-white text-sm">Please sign in to your existing account</p>
      </div>

      {/* Form */}
      <div
        className={`flex flex-col items-center w-full h-full max-w-md mt-8 transition-all duration-700 ease-out delay-200
        ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        <div className="bg-white w-full h-[700px] p-6 md:p-10 rounded-t-3xl">
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mt-6 mb-4">
              <label htmlFor="email" className="block text-[#9D9B9B] text-xs font-bold mb-1">EMAIL</label>
              <input
                type="email"
                id="email"
                placeholder="example@email.com"
                className="w-full px-4 py-3 bg-[#F3F3F3] text-gray-900 placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-[#9D9B9B] text-xs font-bold mb-1">PASSWORD</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                className="w-full pr-12 px-4 py-3 bg-[#F3F3F3] text-gray-900 placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="absolute right-4 top-1/2 mt-2 -translate-y-1/2 w-6 h-6 cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,${showPassword ? eyeOffIcon : eyeIcon}")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "1.5rem",
                }}
                onClick={() => setShowPassword(!showPassword)}
              ></span>
            </div>

            {/* Remember Me / Forgot Password */}
            <div className="flex justify-between items-center mb-6 text-sm">
              <div className="flex items-center">
                <input type="checkbox" id="remember-me" className="form-checkbox text-[#2e2eff] rounded border-gray-300 focus:ring-[#2e2eff]" />
                <label htmlFor="remember-me" className="ml-2 text-gray-700">Remember me</label>
              </div>
              <button type="button" onClick={onForgotPasswordClick} className="text-[#2e2eff] font-medium">
                Forgot Password
              </button>
            </div>

            {/* Login Button */}
            <div className="flex flex-col items-center mt-16">
              <button
                type="submit"
                className="flex justify-center w-[300px] py-4 bg-[#2e2eff] text-white text-lg font-bold rounded-[4vw] shadow-lg transition duration-300 hover:bg-[#1a1aee] mb-4"
              >
                LOG IN
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <span className="absolute text-gray-400 bg-white px-2">or</span>
            <hr className="w-full border-t border-gray-300" />
          </div>

          {/* Google Login */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-[200px] py-3 bg-white text-gray-600 font-medium rounded-[4vw] border border-gray-300 shadow transition hover:bg-gray-100"
            >
              <img src={googleIcon} alt="Google" className="h-5 w-5 mr-2" />
              Google
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="flex justify-center mt-6 text-sm">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button onClick={onSignUpClick} className="text-[#2e2eff] font-medium">SIGN UP</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
