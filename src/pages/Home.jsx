// src/Home.jsx
import React from "react";
import logo from "../img/Logo.png";
import profile from "../img/profile.jpg";
import lunchboxImg from "../img/ข้าวกล่อง.png";
import snackImg from "../img/ขนม.png";
import beverageImg from "../img/เครื่องดื่ม.png";
import postImg from "../img/ข้าวกระเพรา.png";

export default function Home({ userData, onLogout, onGoToDashboard, onGoToMenu, onGoToNotifications , onGoToProfile, onBack}) {
  return (
    <div className="flex flex-col h-screen bg-white font-sans">
      {/* Header */}
      <header className="p-4 bg-[#2e2eff] flex items-center justify-between shadow-sm rounded-b-3xl transition-all duration-500">
        <div className="flex items-center space-x-2">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 rounded-full "
          />
          <span className="text-xl font-bold text-white">MA THAN</span>
        </div>
        <div className="flex items-center space-x-4">
          <img
            src={profile}
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform duration-300"
            onClick={onGoToProfile}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Greeting */}
        <div className="my-4 animate-fadeIn">
          <h1 className="text-[16px] font-bold text-gray-800">
            HEY! HELLO,{" "}
            <span className="text-[#2e2eff]">Good Afternoon!</span>
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative my-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2e2eff] transition-shadow duration-300 hover:shadow-md"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Categories */}
        <section className="my-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">All Categories</h2>
            <a href="#" className="text-[#2e2eff] text-sm font-semibold hover:underline transition">
              See All &gt;
            </a>
          </div>
          <div className="flex justify-between space-x-4">
            {[
              { name: "Lunch Boxes", img: lunchboxImg },
              { name: "Snacks", img: snackImg },
              { name: "Beverages", img: beverageImg },
            ].map((cat, i) => (
              <div
                key={i}
                className="flex flex-col items-center w-1/4 cursor-pointer transform transition duration-300 shadow-md hover:scale-105 hover:shadow-lg rounded-lg"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <span className="mt-2 text-sm text-center font-medium">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Shared Nearby */}
        <section className="my-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              What's Being Shared Nearby?
            </h2>
            <a href="#" className="text-[#2e2eff] text-sm font-semibold hover:underline transition">
              See All &gt;
            </a>
          </div>

          {/* Example Post */}
          <div className="bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transform transition duration-300 hover:-translate-y-1">
            <img
              src={ postImg }
              alt="Post"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800">
                ข้าวหมูทอด - ข้าวกล่องจากกิจกรรม
              </h3>
              <p className="text-gray-500 text-sm mt-1 flex items-center">
                📍 หอพักชาย - หอตาหลา - ใต้หอพัก
              </p>
              <p className="text-gray-500 text-sm mt-1 flex items-center">
                📅 วันผลิต - 22/2/2222 หมดอายุ - 24/2/2222
              </p>
            </div>
          </div>

        {/* Example Post */}
          <div className="bg-gray-100 rounded-xl overflow-hidden shadow-md mt-4">
            <img
              src={ postImg }
              alt="Post"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800">
                ข้าวหมูทอด - ข้าวกล่องจากกิจกรรม
              </h3>
              <p className="text-gray-500 text-sm mt-1 flex items-center">
                📍 หอพักชาย - หอตาหลา - ใต้หอพัก
              </p>
              <p className="text-gray-500 text-sm mt-1 flex items-center">
                📅 วันผลิต - 22/2/2222 หมดอายุ - 24/2/2222
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation Container */}
      <div className="relative">
        {/* Floating Action Button */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <button
            className="w-16 h-16 bg-[#2e2eff] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
            onClick={onGoToDashboard}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-white p-4 shadow-inner flex rounded-t-3xl transition-colors duration-300">
          {[
            { name: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", active: true, action: () => onBack("Home") },
            { name: "Menu", icon: "M4 6h16M4 12h16M4 18h16", active: false, action: () => onGoToMenu() },
            { empty: true },
            { name: "Notifications", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", active: false, action: () => onGoToNotifications() },
            { name: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", active: false, action: () => onGoToProfile() }
          ].map((item, idx) =>
            item.empty ? (
              <div key={idx} className="w-16" />
            ) : (
              <button
                key={idx}
                onClick={item.action}
                className={`flex-1 flex flex-col items-center transition-colors duration-300 ${item.active ? "text-[#2e2eff]" : "text-gray-400"} hover:text-[#2e2eff]`}
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
