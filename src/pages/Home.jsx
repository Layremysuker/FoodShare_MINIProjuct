// src/Home.jsx
import React from "react";
import logo from "../img/Logo.png";
import profile from "../img/profile.jpg";
import lunchboxImg from "../img/ข้าวกล่อง.png";
import snackImg from "../img/ขนม.png";
import beverageImg from "../img/เครื่องดื่ม.png";
import postImg from "../img/ข้าวกระเพรา.png";

// ...existing code...
export default function Home({ userData, onLogout, onGoToDashboard, onGoToMenu, onGoToNotifications , onGoToProfile, onBack}) {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="p-4 bg-[#2e2eff] flex items-center justify-between shadow-sm rounded-b-3xl transition-all duration-500
        md:px-12 md:py-6">
        <div className="flex items-center space-x-2">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 md:w-14 md:h-14 rounded-full"
          />
          <span className="text-xl md:text-2xl font-bold text-white tracking-wide">MA THAN</span>
        </div>
        <div className="flex items-center space-x-4">
          <img
            src={profile}
            alt="Profile"
            className="w-10 h-10 md:w-14 md:h-14 rounded-full cursor-pointer hover:scale-110 transition-transform duration-300 "
            onClick={onGoToProfile}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-12 space-y-6 max-w-5xl mx-auto w-full pb-32">
        {/* Greeting */}
        <div className="my-4 animate-fadeIn">
          <h1 className="text-[16px] md:text-2xl font-bold text-gray-800">
            HEY! HELLO,{" "}
            <span className="text-[#2e2eff]">Good Afternoon!</span>
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative my-4 w-full  mx-auto">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2e2eff] transition-shadow duration-300 hover:shadow-md text-base md:text-lg"
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
            <h2 className="text-lg md:text-2xl font-bold text-gray-800">All Categories</h2>
            <a href="#" className="text-[#2e2eff] text-sm md:text-base font-semibold hover:underline transition">
              See All &gt;
            </a>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-6">
            {[
              { name: "Lunch Boxes", img: lunchboxImg },
              { name: "Snacks", img: snackImg },
              { name: "Beverages", img: beverageImg },
            ].map((cat, i) => (
              <div
                key={i}
                className="flex flex-col items-center bg-white w-full cursor-pointer transform transition duration-300 shadow-md hover:scale-105 hover:shadow-xl rounded-xl p-4"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-20 h-20 md:w-28 md:h-28 object-contain rounded-lg"
                />
                <span className="mt-2 text-sm md:text-base text-center font-medium">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Shared Nearby */}
        <section className="my-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-2xl font-bold text-gray-800">
              What's Being Shared Nearby?
            </h2>
            <a href="#" className="text-[#2e2eff] text-sm md:text-base font-semibold hover:underline transition">
              See All &gt;
            </a>
          </div>

          {/* Example Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((_, idx) => (
              <div key={idx} className="bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transform transition duration-300 hover:-translate-y-1">
                <img
                  src={postImg}
                  alt="Post"
                  className="w-full h-48 md:h-56 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">
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
            ))}
          </div>
        </section>
      </main>

      {/* Spacer to prevent content from being hidden behind the fixed bottom nav */}
      <div className="hidden md:block">
        <br /><br /><br /><br /><br />
      </div>


      {/* Bottom Navigation Container */}
      <div className="fixed left-0 right-0 bottom-0 z-50 max-w-3xl mx-auto w-full ">
        {/* Floating Action Button */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
          <button
            className="w-16 h-16 bg-[#2e2eff] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 border-4 border-white"
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
        <nav className="bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4 shadow-2xl flex rounded-t-3xl transition-colors duration-300 justify-between md:justify-evenly">
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
                <span className="text-xs md:text-sm mt-1">{item.name}</span>
              </button>
            )
          )}
        </nav>
      </div>
    </div>
  );
}
// ...existing code...