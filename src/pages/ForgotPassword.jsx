// src/ForgotPassword.jsx
import React, { useState, useEffect } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

export default function ForgotPassword({ onBackToLogin }) {
  const [animate, setAnimate] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email!");

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
      onBackToLogin(); // กลับไปหน้า Login หลังส่งเมล
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="w-full bg-[#2e2eff] font-sans flex flex-col justify-start items-center pt-8">
      {/* Header */}
      <div
        className={`text-center mt-12 transition-all duration-700 ease-out
        ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        <h1 className="text-4xl font-bold text-white mb-2">Forgot Password</h1>
        <p className="text-white text-sm">Enter your email to reset your password</p>
      </div>

      {/* Form */}
      <div
        className={`flex flex-col items-center w-full h-full max-w-md mt-8 transition-all duration-700 ease-out delay-200
        ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        <div className="bg-white w-full h-[700px] p-6 md:p-10 rounded-t-3xl">
          <form onSubmit={handleSendResetEmail}>
            <div className="mt-6 mb-4">
              <label htmlFor="email" className="block text-[#9D9B9B] text-xs font-bold mb-1">EMAIL</label>
              <input
                type="email"
                id="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#F3F3F3] text-gray-900 placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col items-center mt-8">
              <button
                type="submit"
                className="flex justify-center w-[300px] py-4 bg-[#2e2eff] text-white text-lg font-bold rounded-[4vw] shadow-lg transition duration-300 hover:bg-[#1a1aee] mb-4"
              >
                SEND RESET EMAIL
              </button>
            </div>
          </form>

          <div className="flex justify-center mt-6 text-sm">
            <button onClick={onBackToLogin} className="text-[#2e2eff] font-medium">
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
