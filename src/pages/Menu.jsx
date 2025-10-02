import React, { useState, useEffect ,useRef } from "react";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import logo from "../img/Logo.png";
import profile from "../img/profile.jpg";

export default function Menu({
  onBack,
  onGoToDashboard,
  onGoToMenu,
  onGoToNotifications,
  onGoToProfile,
  onGoToPost,
  searchQuery,
  setSearchQuery,
  selectedCategoryFromHome = "ALL",
  onSelectFood
}) {
  const [selectedCategory, setSelectedCategory] = useState(selectedCategoryFromHome);
  const [foodItems, setFoodItems] = useState([]);
  const categories = ["ALL", "Lunch Boxes", "Snacks", "Beverages"];

  // Update selectedCategory เมื่อ props.selectedCategoryFromHome เปลี่ยน
  useEffect(() => {
    setSelectedCategory(selectedCategoryFromHome);
  }, [selectedCategoryFromHome]);



  // ดึงข้อมูลจาก Firebase
  useEffect(() => {
    const db = getDatabase();
    const postsRef = dbRef(db, "foodPosts");

    const unsubscribe = onValue(postsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const loadedPosts = Object.entries(data).map(([id, value]) => ({
          id,
          title: value.foodName || "Untitled",
          img: value.image || "/default-food.png",
          description: value.description || "",
          productionDate: value.productionDate || "",
          expiryDate: value.expiryDate || "",
          category: value.category || "Uncategorized",
          location: value.location || null,
          createdAt: value.createdAt || null,
        }));
        setFoodItems(loadedPosts);
      } else {
        setFoodItems([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Filter ตาม category + searchQuery
    const filteredFood = foodItems.filter((item) => {
      const matchCategory =
        selectedCategory === "ALL" || item.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchSearch =
        !searchQuery || item.title?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });



  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="p-4 bg-[#2e2eff] flex items-center justify-between shadow-sm rounded-b-3xl md:px-12 md:py-6">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w-10 h-10 md:w-14 md:h-14 rounded-full" />
          <span className="text-xl md:text-2xl font-bold text-white tracking-wide">MA THAN</span>
        </div>
        <div className="flex items-center space-x-4">
          <img
            src={profile}
            alt="Profile"
            className="w-10 h-10 md:w-14 md:h-14 rounded-full cursor-pointer hover:scale-110 transition-transform duration-300"
            onClick={onGoToProfile}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-12 space-y-6 max-w-5xl mx-auto w-full pb-32">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center text-gray-700 mb-4 hover:text-[#2e2eff] transition-colors duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-lg font-semibold">Shared Food Board</span>
        </button>

        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 placeholder-gray-400 shadow transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#2e2eff] hover:shadow-md"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Categories */}
        <div className="flex space-x-4 overflow-x-auto text-gray-600 mb-4">
          {categories.map((cat, idx) => (
            <span
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 border-b-2 cursor-pointer transition-colors duration-300 ease-in-out
                ${selectedCategory === cat ? "border-[#2e2eff] text-[#2e2eff]" : "border-transparent hover:border-gray-300 hover:text-[#2e2eff]"}`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Food List */}
        <section className="space-y-4">
          {filteredFood.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onSelectFood(item)}
                className="flex flex-col sm:flex-row bg-white rounded-xl shadow-md p-4 space-y-2 sm:space-y-0 sm:space-x-4 items-start sm:items-center transform transition duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
              >
                {/* รูปอาหาร */}
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                />

                {/* เนื้อหา */}
                <div className="flex-1 flex flex-col justify-between w-full">
                  <h3 className="font-semibold text-gray-800 text-base md:text-lg">{item.title}</h3>

                  {/* Location */}
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{item.location ? `Lat: ${item.location.lat}, Lng: ${item.location.lng}` : "ไม่ระบุพิกัด"}</span>
                  </div>

                  {/* วันที่ผลิต และวันหมดอายุ */}
                  <div className="flex flex-wrap items-center text-gray-500 text-sm mt-2 space-x-4">
                    {/* วันที่ผลิต */}
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>ผลิต: {item.productionDate || "-"}</span>
                    </div>

                    {/* วันหมดอายุ */}
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>หมดอายุ: {item.expiryDate || "-"}</span>
                    </div>
                  </div>

                  {/* Category badge */}
                  <div className="mt-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full
                        ${item.category === "Lunch Boxes" ? "bg-yellow-100 text-yellow-800" :
                          item.category === "Snacks" ? "bg-pink-100 text-pink-800" :
                          item.category === "Beverages" ? "bg-blue-100 text-blue-800" :
                          "bg-gray-100 text-gray-800"}`}
                    >
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            ))
          }
        </section>
      </main>

      {/* Spacer to prevent content from being hidden behind the fixed bottom nav */}
      <div className="hidden md:block">
        <br /><br /><br /><br /><br />
      </div>

      {/* Bottom Navigation */}
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        {/* Bottom Navigation Bar */}
        <nav className="bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4 shadow-2xl flex rounded-t-3xl transition-colors duration-300 justify-between md:justify-evenly">
          {[
            {
              name: "Home",
              icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
              active: false,
              action: () => onBack("Home"),
            },
            {
              name: "Menu",
              icon: "M4 6h16M4 12h16M4 18h16",
              active: true,
              action: () => onGoToMenu(),
            },
            { empty: true },
            {
              name: "Notifications",
              icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
              active: false,
              action: () => onGoToNotifications(),
            },
            {
              name: "Profile",
              icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
              active: false,
              action: () => onGoToProfile(),
            },
          ].map((item, idx) =>
            item.empty ? (
              <div key={idx} className="w-16" />
            ) : (
              <button
                key={idx}
                onClick={item.action}
                className={`flex-1 flex flex-col items-center transition-colors duration-300 ${
                  item.active ? "text-[#2e2eff]" : "text-gray-400"
                } hover:text-[#2e2eff]`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 md:h-7 md:w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    d={item.icon}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
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
