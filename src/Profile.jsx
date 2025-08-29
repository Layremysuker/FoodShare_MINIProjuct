// Profile.jsx

import React from "react";
import logo from "./img/Logo.png";
import profile from "./img/profile.jpg";

export default function Profile({ onBack, onGoToDashboard, onGoToMenu, onLogout, onGoToNotifications , userData }) {
  // สมมติข้อมูล user (mock data)
  const user = {
    name: "Natcha J.",
    department: "Computer Science",
    email: "natcha123@university.ac.th",
    studentId: "65123456",
    phone: "081-234-5678",
    avatar: profile, // เปลี่ยนได้ตามไฟล์
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#2e2eff] flex items-center justify-between p-4 rounded-b-3xl">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
          <span className="text-white text-xl font-bold">MA THAN</span>
        </div>
        <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full" />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        {/* Back */}
        <button onClick={onBack} className="flex items-center self-start text-gray-700 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-lg font-semibold">Profile</span>
        </button>

        {/* Avatar */}
        <img src={user.avatar} alt="User Avatar" className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg" />

        {/* User Info */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-600">{user.department}</p>
          <p className="text-gray-600">📧 {user.email}</p>
          <p className="text-gray-600">🎓 Student ID: {user.studentId}</p>
          <p className="text-gray-600">📱 {user.phone}</p>
        </div>

        {/* Edit Profile Button */}
        <button onClick={onLogout} className="px-6 py-3 border border-[#2e2eff] text-[#2e2eff] rounded-xl hover:bg-[#2e2eff] hover:text-white transition">
          Edit Profile
        </button>

        {/* Logout Button */}
        <button
        onClick={onLogout} // ใช้ prop onLogout จาก App.jsx
        className="px-6 py-3 mt-8 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
        >
        Logout
        </button>

      </main>

      {/* Bottom Navigation */}
      <div className="relative">
        {/* Floating Action Button */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <button
            className="w-16 h-16 bg-[#2e2eff] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
            onClick={onGoToDashboard}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-white p-4 shadow-inner shadow-lg flex rounded-t-3xl">
          {[
            { name: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", active: false, action: () => onBack("Home") },
            { name: "Menu", icon: "M4 6h16M4 12h16M4 18h16", active: false, action: () => onGoToMenu() },
            { empty: true },
            { name: "Notifications", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", active: false, action: () => onGoToNotifications() },
            { name: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", active: true, action: () => {} }
          ].map((item, idx) =>
            item.empty ? (
              <div key={idx} className="w-16" />
            ) : (
              <button
                key={idx}
                onClick={item.action}
                className={`flex-1 flex flex-col items-center ${item.active ? "text-[#2e2eff]" : "text-gray-400"}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            )
          )}
        </nav>
      </div>
    </div>
  );
}
