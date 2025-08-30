import React, { useState } from "react";
import logo from "../img/Logo.png";
import profile from "../img/profile.jpg";

export default function Notifications({ onBack, onGoToDashboard, onGoToMenu, onGoToNotifications , userData , onGoToProfile}) {
  const [activeTab, setActiveTab] = useState("shares");

  const notifications = {
    shares: [
      {
        title: "“ข้าวหมูกรอบ” has been successfully claimed.",
        status: "Claimed by Natcha",
        date: "July 29, 2025 at 12:45 PM",
      },
      {
        title: "“ข้าวมันไก่” has been posted and is now visible to others.",
        status: "Active",
        date: "July 29, 2025 at 11:03 AM",
      },
      {
        title: "“ขนมเลย์ถุงลมเข้า” was removed due to inactivity.",
        status: "Auto-expired",
        date: "July 29, 2025 at 9:41 AM",
      },
    ],
    pickups: [
      {
        title: "Pickup: ข้าวหมูกรอบ is ready.",
        status: "Pending",
        date: "July 29, 2025 at 1:00 PM",
      },
    ],
  };

  return (
    <div className="font-sans flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#2e2eff] flex items-center justify-between p-4 rounded-b-3xl">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
          <span className="text-white text-xl font-bold">MA THAN</span>
        </div>
        <img src={profile} alt="Profile" className="w-10 h-10 rounded-full" />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        {/* Back */}
        <button onClick={onBack} className="flex items-center text-gray-700 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-lg font-semibold">Notifications</span>
        </button>

        {/* Tabs */}
        <div className="relative border-b mb-4 flex">
          <button
            onClick={() => setActiveTab("shares")}
            className={`flex-1 text-center pb-2 ${activeTab === "shares" ? "text-[#2e2eff]" : "text-gray-500"}`}
          >
            My Shares
          </button>
          <button
            onClick={() => setActiveTab("pickups")}
            className={`flex-1 text-center pb-2 ${activeTab === "pickups" ? "text-[#2e2eff]" : "text-gray-500"}`}
          >
            My Pickups
          </button>

          {/* Animated indicator */}
          <span
            className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#2e2eff] transition-transform duration-300"
            style={{ transform: activeTab === "shares" ? "translateX(0%)" : "translateX(100%)" }}
          />
        </div>

        {/* Notification List */}
        <section className="space-y-4">
          {notifications[activeTab].map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold text-gray-800">{item.title}</h3>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{item.status}</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </section>
      </main>

        {/* Bottom Navigation for Notifications */}
        <div className="relative">
          {/* Floating Action Button */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <button
              className="w-16 h-16 bg-[#2e2eff] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
              onClick={onGoToDashboard}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Bottom Navigation */}
          <nav className="bg-white p-4 shadow-inner flex rounded-t-3xl transition-colors duration-300">
            {[
              { name: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", action: () => onBack("Home") },
              { name: "Menu", icon: "M4 6h16M4 12h16M4 18h16", action: () => onGoToMenu() },
              { empty: true },
              { name: "Notifications", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", action: () => onGoToNotifications(), active: true }, // Notifications active
              { name: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", action: () => onGoToProfile() }
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
