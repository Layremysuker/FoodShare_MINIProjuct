import React, { useState, useEffect } from "react";
import { auth, database } from "./firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { ref, set } from "firebase/database";

export default function SignUp({ onBackToLogin }) {
  const [animate, setAnimate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // สำหรับแสดง loading

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // SVG Icons
  const eyeIcon = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" fill="none"  stroke="#9D9B9B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`);
  const eyeOffIcon = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#9D9B9B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8 a18.2 18.2 0 0 1 2.53-3.69"/><path d="M9.88 9.88a3 3 0 0 1 4.24 4.24"/><path d="M3 3l18 18"/></svg>`);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== rePassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
    setIsLoading(true); // เริ่มแสดง loading

    // สมัครผ่าน Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // บันทึกข้อมูลเพิ่มเติมใน Database
    await set(ref(database, "users/" + user.uid), {
        name,
        email,
        uid: user.uid,
        createdAt: new Date().toISOString()
    });

    // ออกจากระบบทันทีหลังสมัครเสร็จ
    await signOut(auth);

    // รอสักครู่ให้ผู้ใช้เห็น loading
    setTimeout(() => {
        setIsLoading(false); // ปิด loading
        alert("Sign Up Success! Please login.");
        onBackToLogin();
    }, 1000); // รอ 1 วินาที
    } catch (error) {
    console.error(error);
    setIsLoading(false); // ปิด loading ถ้า error
    alert(error.message);
    }

  };

  if (isLoading) {
    // หน้า Loading
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center bg-[#2e2eff] text-white">
        <div className="loader border-t-4 border-b-4 border-white rounded-full w-12 h-12 animate-spin mb-4"></div>
        <p className="text-lg font-medium">Signing up, please wait...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#2e2eff] flex flex-col justify-start items-center pt-8">
      {/* Header */}
      <div className={`text-center mt-12 transition-all duration-700 ease-out ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
        <h1 className="text-4xl font-bold text-white mb-2">Sign Up</h1>
        <p className="text-white text-sm">Create an account to get started</p>
      </div>

      {/* Form */}
      <div className={`flex flex-col items-center w-full h-full max-w-md mt-8 transition-all duration-700 ease-out delay-200 ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
        <div className="bg-white w-full h-[700px] p-6 md:p-10 rounded-t-3xl">
          <form onSubmit={handleSignUp}>
            {/* Name */}
            <div className="mt-6 mb-4">
              <label htmlFor="name" className="block text-[#9D9B9B] text-xs font-bold mb-1">NAME</label>
              <input type="text" id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#F3F3F3] text-gray-900 placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-[#9D9B9B] text-xs font-bold mb-1">EMAIL</label>
              <input type="email" id="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#F3F3F3] text-gray-900 placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>

            {/* Password */}
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-[#9D9B9B] text-xs font-bold mb-1">PASSWORD</label>
              <input type={showPassword ? "text" : "password"} id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-12 px-4 py-3 bg-[#F3F3F3] text-gray-900 placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              <span className="absolute right-4 top-1/2 mt-2 -translate-y-1/2 w-6 h-6 cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml;utf8,${showPassword ? eyeOffIcon : eyeIcon}")`, backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "1.5rem" }}
                onClick={() => setShowPassword(!showPassword)}></span>
            </div>

            {/* Re-type Password */}
            <div className="mb-6 relative">
              <label htmlFor="retype-password" className="block text-[#9D9B9B] text-xs font-bold mb-1">RE-TYPE PASSWORD</label>
              <input type={showRePassword ? "text" : "password"} id="retype-password" placeholder="Re-enter your password" value={rePassword} onChange={(e) => setRePassword(e.target.value)}
                className="w-full pr-12 px-4 py-3 bg-[#F3F3F3] text-gray-900 placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              <span className="absolute right-4 top-1/2 mt-2 -translate-y-1/2 w-6 h-6 cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml;utf8,${showRePassword ? eyeOffIcon : eyeIcon}")`, backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "1.5rem" }}
                onClick={() => setShowRePassword(!showRePassword)}></span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col items-center mt-8">
              <button type="submit" className="flex justify-center w-[300px] py-4 bg-[#2e2eff] text-white text-lg font-bold rounded-[4vw] shadow-lg transition duration-300 hover:bg-[#1a1aee] mb-4">
                SIGN UP
              </button>

              <button type="button" onClick={onBackToLogin} className="w-[250px] flex justify-center py-3 text-[#2e2eff] font-medium rounded-[4vw] border border-[#2e2eff] hover:bg-white hover:text-[#2e2eff] transition">
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
