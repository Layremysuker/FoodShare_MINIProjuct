// src/Dashboard.jsx
import React from "react";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

export default function Dashboard({ userData, onLogout }) {

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout(); // ส่งกลับไปหน้า Login
    } catch (error) {
      console.error(error);
      alert("Logout failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#2e2eff] flex flex-col items-center justify-start p-8">
      {/* Header */}
      <div className="text-center mt-12 text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome, {userData.name || userData.email}</h1>
        <p className="text-lg text-gray-200">Your account details</p>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mt-10 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Profile Information</h2>
        <div className="space-y-2 text-gray-700">
          <p><span className="font-bold">UID:</span> {userData.uid}</p>
          <p><span className="font-bold">Name:</span> {userData.name || "-"}</p>
          <p><span className="font-bold">Email:</span> {userData.email}</p>
          <p><span className="font-bold">Created At:</span> {userData.createdAt || "-"}</p>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-10 px-6 py-3 bg-white text-[#2e2eff] font-bold rounded-lg shadow hover:bg-gray-100 transition"
      >
        Logout
      </button>
    </div>
  );
}
