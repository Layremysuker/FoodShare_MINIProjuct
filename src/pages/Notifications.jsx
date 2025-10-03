import React, { useState, useEffect } from "react";
import logo from "../img/Logo.png";
import profile from "../img/profile.jpg";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";

const db = getDatabase();
const auth = getAuth();

export default function Notifications({ onBack, onGoToProfile, onGoToMenu, onGoToPost, userData , onGoToEditPost,onSelectedPost , onSelectClaim , setCurrentPage ,}) {
  const [activeTab, setActiveTab] = useState("shares");
  const [myShares, setMyShares] = useState([]);
  const [myPickups, setMyPickups] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // ดึง My Shares
    const postsRef = dbRef(db, "foodPosts");
    onValue(postsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const userPosts = Object.keys(data)
        .map((key) => ({ id: key, ...data[key] }))
        .filter(post => post.userId === user.uid);
      setMyShares(userPosts.reverse());
    });

    // ดึง My Pickups
      const claimsRef = dbRef(db, "claims");
      onValue(claimsRef, (snapshot) => {
        const data = snapshot.val() || {};
        const userClaims = Object.keys(data)
          .map(key => ({ id: key, ...data[key] })) // id = key ของ claim
          .filter(claim => claim.userId === auth.currentUser.uid);

        const pickups = userClaims.map(claim => ({
          ...claim.foodData,   // ข้อมูลอาหาร
          claimedAt: claim.claimedAt,
          claimId: claim.id,   // ✅ เก็บ key ของ claim
          foodId: claim.foodId, // ✅ เก็บ foodId เผื่อใช้ตรวจสอบ
          userId: claim.userId // ✅ เก็บ userId เผื่อใช้ตรวจสอบ
        }));

        setMyPickups(pickups.reverse());
      });
  }, []);


  return (
    <div className="font-sans flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="p-4 bg-[#2e2eff] flex items-center justify-between shadow-sm rounded-b-3xl md:px-12 md:py-6">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w-10 h-10 md:w-14 md:h-14 rounded-full" />
          <span className="text-xl md:text-2xl font-bold text-white tracking-wide">MA THAN</span>
        </div>
        <div className="flex items-center space-x-4">
          <img src={profile} alt="Profile" className="w-10 h-10 md:w-14 md:h-14 rounded-full cursor-pointer hover:scale-110 transition-transform duration-300" onClick={onGoToProfile} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-12 space-y-6 max-w-5xl mx-auto w-full pb-32">
        {/* Back */}
        <button onClick={onBack} className="flex items-center text-gray-700 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-lg font-semibold">Notifications</span>
        </button>

        {/* Tabs */}
        <div className="relative border-b mb-4 flex">
          <button onClick={() => setActiveTab("shares")} className={`flex-1 text-center pb-2 ${activeTab === "shares" ? "text-[#2e2eff]" : "text-gray-500"}`}>My Shares</button>
          <button onClick={() => setActiveTab("pickups")} className={`flex-1 text-center pb-2 ${activeTab === "pickups" ? "text-[#2e2eff]" : "text-gray-500"}`}>My Pickups</button>
          <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#2e2eff] transition-transform duration-300" style={{ transform: activeTab === "shares" ? "translateX(0%)" : "translateX(100%)" }} />
        </div>

        {/* Notification List */}
          <section className="space-y-4">
            {(activeTab === "shares" ? myShares : myPickups).map((item, idx) => (
              <div
                key={idx}
                className="relative bg-white rounded-xl shadow p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
              >
                {/* Icon button ขวาบน */}
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors duration-300"
                      onClick={() => {
                        if (activeTab === "shares") {
                          onSelectedPost(item, "shares");   // 👉 ส่ง type ไปด้วย
                        } else {
                          onSelectClaim(item, "pickups");  // 👉 ส่ง type ไปด้วย
                        }
                      }}
                  >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>

                {/* Content ของ Card */}
                <h3 className="font-semibold text-gray-800">{item.title || item.name || "Untitled"}</h3>
                {item.description && <p className="text-gray-500 text-sm mt-1">{item.description}</p>}

                {/* Status */}
                <div className="flex items-center text-green-500 text-sm mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{activeTab === "shares" ? item.status : item.pickupStatus || "Confirmed"}</span>
                </div>

                {/* Time */}
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(item.claimedAt || item.createdAt?.seconds * 1000).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </section>
      </main>

              {/* Spacer to prevent content from being hidden behind the fixed bottom nav */}
                <div className="hidden md:block">
                    <br /><br /><br /><br /><br /><br />
                </div>

      {/* Bottom Navigation for Notifications */}
      <div className="fixed left-0 right-0 bottom-0 z-50 max-w-3xl mx-auto w-full">
        {/* Floating Action Button */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
          <button
            className="w-16 h-16 bg-[#2e2eff] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 border-4 border-white"
            onClick={onGoToPost}
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
