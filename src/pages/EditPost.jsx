import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { getAuth } from "firebase/auth";
import imageCompression from "browser-image-compression";
import logo from "../img/Logo.png";
import profile from "../img/profile.jpg";
import { getDatabase, ref, update } from "firebase/database";

const auth = getAuth();

// ตั้งค่า Default Marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} /> : null;
}

export default function EditPost({ post, onBack, onGoToProfile }) {
  const foodData = post || {};

  const [foodName, setFoodName] = useState(foodData.title || "");
  const [description, setDescription] = useState(foodData.description || "");
  const [image, setImage] = useState(foodData.img || "");
  const [imageFile, setImageFile] = useState(null);
  const [productionDate, setProductionDate] = useState(foodData.productionDate || "");
  const [expiryDate, setExpiryDate] = useState(foodData.expiryDate || "");
  const [category, setCategory] = useState(foodData.category || "");
  const [position, setPosition] = useState(
    foodData.location ? [foodData.location.lat, foodData.location.lng] : null
  );

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (post) {
      setFoodName(post.title || "");
      setDescription(post.description || "");
      setImage(post.img || "");
      setProductionDate(post.productionDate || "");
      setExpiryDate(post.expiryDate || "");
      setCategory(post.category || "");
      setPosition(post.location ? [post.location.lat, post.location.lng] : null);
    }
  }, [post]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressedFile = await imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 1024 });
      setImage(URL.createObjectURL(compressedFile));
      setImageFile(compressedFile);
    } catch (err) {
      console.error("Error compressing image:", err);
    }
  };

  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error("Error getting location:", err)
    );
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!foodName || !productionDate || !expiryDate || !position) {
        alert("กรุณากรอกข้อมูลให้ครบ!");
        return;
      }
      try {
        const user = auth.currentUser;
        if (!user) return alert("กรุณาเข้าสู่ระบบ");

        const db = getDatabase();
        const postRef = ref(db, `foodPosts/${foodData.id}`); // ใช้ id ของโพสต์

        // อัปเดตข้อมูล
        await update(postRef, {
          title: foodName,
          description: description,
          img: image, // หรือ upload ไป IMGBB แล้วเอา URL มา
          productionDate,
          expiryDate,
          category,
          location: { lat: position[0], lng: position[1] },
        });

        // แสดง popup สำเร็จ
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onBack();
        }, 1500);

      } catch (err) {
        console.error(err);
        alert("เกิดข้อผิดพลาดในการแก้ไขโพสต์");
      }
    };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
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

      {/* Main */}
      <div className="flex-1 overflow-y-auto p-4 md:p-12 space-y-6 max-w-5xl mx-auto w-full pb-32">
        {/* Back */}
        <button onClick={onBack} className="flex items-center text-gray-700 mb-4 hover:text-[#2e2eff] transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-lg font-semibold">Notifications</span>
        </button>

        {/* Upload Image */}
        <label className="block w-full h-40 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer bg-gray-100 hover:bg-[#2e2eff10] transition-colors duration-300">
          {image ? (
            <img src={image} alt="preview" className="w-full h-full object-cover rounded-xl transform hover:scale-105 transition-transform duration-300" />
          ) : (
            <span className="text-gray-500 font-bold">ADD IMAGE</span>
          )}
          <input type="file" className="hidden" onChange={handleImageUpload} />
        </label>

        {/* Form Fields */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Food Name</label>
          <input type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)} placeholder="ใส่ชื่ออาหาร..." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2e2eff] focus:outline-none transition duration-200 hover:border-[#2e2eff]" required />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="รายละเอียดเพิ่มเติม..." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2e2eff] focus:outline-none transition duration-200 hover:border-[#2e2eff]" />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Production Date</label>
          <input type="date" value={productionDate} onChange={(e) => setProductionDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2e2eff] focus:outline-none transition duration-200 hover:border-[#2e2eff]" required />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Expiration Date</label>
          <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2e2eff] focus:outline-none transition duration-200 hover:border-[#2e2eff]" required />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Categories</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2e2eff] focus:outline-none transition duration-200 hover:border-[#2e2eff]">
            <option value="">เลือกประเภท</option>
            <option value="Lunch Boxes">Lunch Boxes</option>
            <option value="Snacks">Snacks</option>
            <option value="Beverages">Beverages</option>
          </select>
        </div>

        {/* Map */}
        <MapContainer center={position || [13.736717, 100.523186]} zoom={13} style={{ height: "300px", width: "100%", borderRadius: "12px" }} className="transition-shadow duration-300 hover:shadow-lg">
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>' subdomains="abcd" />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>

        <div className="flex justify-center mt-3">
          <button onClick={handleUseCurrentLocation} className="px-4 py-2 border border-[#2e2eff] text-[#2e2eff] rounded-lg hover:bg-[#2e2eff] hover:text-white transition duration-300">Use Current Location</button>
        </div>

        {/* Update Button */}
        <button onClick={handleSubmit} className="w-full bg-[#2e2eff] text-white py-3 rounded-lg font-bold hover:bg-[#1d1dcc] transition duration-300 transform hover:scale-105">UPDATE</button>


            {/* ✅ Popup หลังโพสต์ */}
                {showSuccess && (
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
                        อัปเดตข้อมูลสำเร็จ!
                    </h2>
                    <p className="text-sm text-gray-500 mt-2 text-center">
                        ระบบได้บันทึกการอัปเดต Post ของคุณเรียบร้อย
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


                {/* Spacer to prevent content from being hidden behind the fixed bottom nav */}
                <div className="hidden md:block">
                    <br /><br /><br /><br /><br /><br />
                </div>
        </div>
    </div>
  );
}
