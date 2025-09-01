import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { getDatabase, ref as dbRef, push, set, serverTimestamp } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import logo from "../img/Logo.png";
import profile from "../img/profile.jpg";
import imageCompression from "browser-image-compression";

const db = getDatabase();
const storage = getStorage();
const auth = getAuth();


// ตั้งค่า Default Marker ใหม่
delete L.Icon.Default.prototype._getIconUrl; // เคลียร์ path เก่า
// ตั้งค่า Default Marker
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component สำหรับเลือกตำแหน่งจากการคลิก
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]); // อัปเดตตำแหน่งเมื่อคลิก
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function AddPost({ userData, onLogout, onGoToDashboard, onGoToMenu, onGoToNotifications , onGoToProfile, onBack, onGoToPost}) {
  const [image, setImage] = useState(null);       // preview
  const [imageFile, setImageFile] = useState(null); // สำหรับอัปโหลด
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [productionDate, setProductionDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [category, setCategory] = useState("");
  const [position, setPosition] = useState(null);

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY; // ใส่ API Key ของคุณใน .env

  // อัปโหลดรูปภาพพร้อมบีบอัด
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // บีบอัดภาพก่อน
    const options = {
      maxSizeMB: 0.5,           // ไม่เกิน 0.5MB
      maxWidthOrHeight: 1024,   // ความกว้าง/สูงไม่เกิน 1024px
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      setImage(URL.createObjectURL(compressedFile)); // preview
      setImageFile(compressedFile);                  // สำหรับอัปโหลด
    } catch (error) {
      console.error("Error compressing image:", error);
    }
  };

  // ใช้ตำแหน่งปัจจุบัน
  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      },
      (err) => {
        console.error("Error getting location: ", err);
      }
    );
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!foodName || !productionDate || !expiryDate || !position) {
      alert("กรุณากรอกข้อมูลให้ครบ!");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("กรุณาเข้าสู่ระบบก่อนโพสต์");
        return;
      }

      let imageUrl = null;

      // อัปโหลดรูปไป ImgBB
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("key", IMGBB_API_KEY);

        const res = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.success) {
          imageUrl = data.data.url; // URL ของรูป
        } else {
          console.error("ImgBB upload failed:", data);
        }
      }

      console.log("Selected position:", position);

      // สร้าง reference ใหม่ใน Realtime Database
      const newPostRef = push(dbRef(db, "foodPosts"));
      await set(newPostRef, {
        userId: user.uid,
        image: imageUrl || null,
        foodName,
        description,
        productionDate,
        expiryDate,
        category,
        location: { lat: parseFloat(position[0]), lng: parseFloat(position[1]) },
        createdAt: serverTimestamp(),
      });

      alert("Post created in Realtime Database!");

      // รีเซ็ตฟอร์ม
      setImage(null);
      setImageFile(null);
      setFoodName("");
      setDescription("");
      setProductionDate("");
      setExpiryDate("");
      setCategory("");
      setPosition(null);

    } catch (error) {
      console.error("Error posting data:", error);
      alert("เกิดข้อผิดพลาดในการโพสต์ข้อมูล");
    }
  };

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

      {/* Main */}
      <div className="flex-1 overflow-y-auto p-4 md:p-12 space-y-6 max-w-5xl mx-auto w-full pb-32">

        {/* Back Button */}
        <button onClick={onBack} className="flex items-center text-gray-700 mb-4 hover:text-[#2e2eff] transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-lg font-semibold">Post</span>
        </button>

        {/* Upload Image */}
        <label className="block w-full h-40 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer bg-gray-100 hover:bg-[#2e2eff10] transition-colors duration-300">
            {image ? (
                <img
                src={image}
                alt="preview"
                className="w-full h-full object-cover rounded-xl transform hover:scale-105 transition-transform duration-300"
                />
            ) : (
                <span className="text-gray-500 font-bold">ADD IMAGE</span>
            )}
            <input type="file" className="hidden" onChange={handleImageUpload} />
        </label>

        {/* Food Name */}
        <div>
            <label className="block text-gray-700 font-medium mb-1">Food Name</label>
                <input
                    type="text"
                    placeholder="ใส่ชื่ออาหาร..."
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2e2eff] focus:outline-none transition duration-200 hover:border-[#2e2eff]"
                    required
                />
        </div>

        {/* Description */}
        <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
                <textarea
                    placeholder="รายละเอียดเพิ่มเติม..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2e2eff] focus:outline-none transition duration-200 hover:border-[#2e2eff]"
                />
        </div>

        {/* Production Date */}
        <div>
            <label className="block text-gray-700 font-medium mb-1">Production Date</label>
                <input
                    type="date"
                    value={productionDate}
                    onChange={(e) => setProductionDate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2e2eff] focus:outline-none transition duration-200 hover:border-[#2e2eff]"
                    required
                />
        </div>

        {/* Expiry Date */}
        <div>
            <label className="block text-gray-700 font-medium mb-1">Expiration Date</label>
                <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2e2eff] focus:outline-none transition duration-200 hover:border-[#2e2eff]"
                    required
                />
        </div>

        {/* Category */}
        <div>
            <label className="block text-gray-700 font-medium mb-1">Categories</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2e2eff] focus:outline-none transition duration-200 hover:border-[#2e2eff]"
                >
                    <option value="">เลือกประเภท</option>
                    <option value="Lunch Boxes">Lunch Boxes</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Beverages">Beverages</option>
                </select>
        </div>

        {/* Map */}
        <MapContainer
            center={[13.736717, 100.523186]}
            zoom={13}
            style={{ height: "300px", width: "100%", borderRadius: "12px" }}
            className="transition-shadow duration-300 hover:shadow-lg"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
                    subdomains="abcd"
                />
                    <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>

        {/* Use Current Location Button */}
        <div className="flex justify-center mt-3">
            <button
                onClick={handleUseCurrentLocation}
                className="px-4 py-2 border border-[#2e2eff] text-[#2e2eff] rounded-lg hover:bg-[#2e2eff] hover:text-white transition duration-300"
            >
                Use Current Location
            </button>
        </div>

        {/* Post Button */}
        <button
        onClick={handleSubmit}
        className="w-full bg-[#2e2eff] text-white py-3 rounded-lg font-bold hover:bg-[#1d1dcc] transition duration-300 transform hover:scale-105"
        >
        POST
        </button>


                {/* Spacer to prevent content from being hidden behind the fixed bottom nav */}
                <div className="hidden md:block">
                    <br /><br /><br /><br /><br /><br />
                </div>

        {/* Bottom Navigation Container */}
        <div className="fixed left-0 right-0 bottom-0 z-[1000] max-w-3xl mx-auto w-full">
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
                { name: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", active: false, action: () => onBack("Home") },
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
    </div>
  );
}
