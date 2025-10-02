import React from "react";
import logo from "../img/Logo.png";
import profile from "../img/profile.jpg";

export default function FoodDetail({ foodItem, onBack, onGoToProfile }) {
  if (!foodItem) return <p className="text-center mt-8 text-gray-500">Loading...</p>;

  const { title, img, description, productionDate, expiryDate, location, category } = foodItem;

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
          <span className="text-lg font-semibold">Go Back</span>
        </button>

        {/* รูปอาหาร */}
        <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-md bg-gray-100">
        <img
            src={img || "/default-food.png"}  // ใช้ default ถ้าไม่มีรูป
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "/default-food.png"; }} // fallback รูปถ้าโหลดไม่ได้
            loading="lazy"
        />
        </div>


        {/* ข้อมูลอาหาร */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>

          {category && (
            <span
              className={`inline-block px-2 py-1 text-xs font-semibold rounded-full
                ${category === "Lunch Boxes" ? "bg-yellow-100 text-yellow-800" :
                  category === "Snacks" ? "bg-pink-100 text-pink-800" :
                  category === "Beverages" ? "bg-blue-100 text-blue-800" :
                  "bg-gray-100 text-gray-800"}`}
            >
              {category}
            </span>
          )}

          {/* Description */}
          <div className="mt-3">
            <label className="block text-gray-400 text-sm mb-1">Description</label>
            <div className="bg-gray-100 rounded-lg p-3 min-h-[80px] max-h-64 overflow-y-auto text-gray-700 text-sm">
              {description || "ไม่มีคำอธิบาย"}
            </div>
          </div>

          {/* วันที่ผลิต และวันหมดอายุ */}
          <div className="flex flex-wrap gap-4 text-gray-500 text-sm mt-2">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>ผลิต: {productionDate || "-"}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>หมดอายุ: {expiryDate || "-"}</span>
            </div>
          </div>

          {/* Map */}
          {location ? (
            <div className="mt-4 h-64 w-full border rounded-xl overflow-hidden shadow-md">
              <iframe
                src={`https://www.google.com/maps?q=${location.lat},${location.lng}&hl=th&z=15&output=embed`}
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                title="Food Location"
              ></iframe>
            </div>
          ) : (
            <p className="text-gray-400 text-sm mt-2">ไม่พบพิกัดสำหรับรายการนี้</p>
          )}
        </div>
      </main>
    </div>
  );
}
