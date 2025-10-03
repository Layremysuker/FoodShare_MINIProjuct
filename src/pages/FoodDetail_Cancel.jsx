import React, { useEffect, useState } from "react";
import { getDatabase, ref, get, remove, update } from "firebase/database";
import logo from "../img/Logo.png";
import profile from "../img/profile.jpg";

export default function FoodDetail_Cancel({ ClaimItem, onBack, onGoToProfile, userData, setCurrentPage }) {
  const [showClaimPopup, setShowClaimPopup] = useState(false);

  if (!ClaimItem) return <p className="text-center mt-8 text-gray-500">Loading...</p>;

  // ดึงข้อมูลสำคัญ
  const { title, img, description, productionDate, expiryDate, location, category, foodId, id } = ClaimItem;
  const foodKey = foodId || id;

  // Preload image
  useEffect(() => {
    if (img) {
      const preloadImg = new Image();
      preloadImg.src = img;
    }
  }, [img]);

    const handleCancelClaim = async () => {
    if (!userData) {
        alert("กรุณาเข้าสู่ระบบก่อนยกเลิก");
        return;
    }

    if (!ClaimItem.claimId) {
        alert("ไม่พบ Claim ID ของรายการนี้");
        return;
    }

    try {
        const db = getDatabase();

        // ลบ Claim โดยตรงจาก claimId
        await remove(ref(db, `claims/${ClaimItem.claimId}`));

        // อัปเดต foodPosts ให้เป็น available
        const foodKey = ClaimItem.foodId || ClaimItem.id;
        if (foodKey) {
        await update(ref(db, `foodPosts/${foodKey}`), {
            ...ClaimItem,
            status: "available",
        });
        }

        // ✅ แทน alert ด้วยการแสดง popup
        setShowClaimPopup(true);

        // ปิด popup และกลับหน้า home หลัง 2 วินาที
        setTimeout(() => {
        setShowClaimPopup(false);
        setCurrentPage("home");
        }, 2000);

    } catch (err) {
        console.error("Error cancelling claim:", err);
        alert("เกิดข้อผิดพลาดในการยกเลิก Claim");
    }
    };


  return (
    <div className="relative flex flex-col min-h-screen bg-white font-sans">
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
            src={img || "/default-food.png"}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "/default-food.png"; }}
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

          {/* ปุ่ม Cancel Claim */}
            <div className="mt-6 flex justify-center">
            <button
                onClick={handleCancelClaim}
                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl shadow-md hover:bg-red-600 transition"
            >
                Cancel Claim
            </button>
            </div>
        </div>
      </main>

            {/* ✅ Popup หลังโพสต์ */}
                {showClaimPopup && (
                <div className="fixed inset-0 z-[9999] bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-8 w-64 h-64 flex flex-col items-center justify-center transform scale-75 animate-popup shadow-2xl relative">
                    
                    {/* อนิเมชันติ๊กถูก */}
                    <div className="checkmark mb-4">
                        <svg className="w-20 h-20 text-green-500" viewBox="0 0 52 52">
                        <circle
                            className="checkmark__circle"
                            cx="26"
                            cy="26"
                            r="24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                        <path
                            className="checkmark__check"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            d="M14 27l7 7 16-16"
                        />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-extrabold text-gray-900 text-center">
                        ยกเลิกรายการสำเร็จ!
                    </h2>
                    <p className="text-sm text-gray-500 mt-2 text-center">
                        ระบบได้บันทึกการยกเลิก Claim ของคุณเรียบร้อย
                    </p>
                    </div>
                </div>
        )}


        <style>{`
          @keyframes popup {
            0% { transform: scale(0.5); opacity: 0; }
            60% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); }
          }
          .animate-popup { animation: popup 0.35s ease-out forwards; }

          /* วงกลมติ๊กถูก */
          .checkmark__circle {
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
            stroke-linecap: round;
            animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
          }

          .checkmark__check {
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            stroke-linecap: round;
            animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
          }

          @keyframes stroke {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}</style>

    </div>
  );
}
