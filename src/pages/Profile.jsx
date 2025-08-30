import React, { useEffect, useState } from "react";
import logo from "../img/Logo.png";
import profile from "../img/profile.jpg";
import { signOut } from "firebase/auth";
import { auth, database } from "../firebase"; 
import { ref, get, set } from "firebase/database";

export default function Profile({ onBack, onLogout, userData , onGoToMenu, onGoToNotifications, onGoToProfile , onGoToDashboard}) {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    fullName: "",
    studentId: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    async function fetchUser() {
      if (!userData?.uid) return;

      try {
        const snapshot = await get(ref(database, `users/${userData.uid}`));
        const data = snapshot.exists() ? snapshot.val() : {};

        // ตั้งค่า default ถ้า field ยังไม่มี
        const defaults = {
          name: data.name || "",
          fullName: data.fullName || "",
          studentId: data.studentId || "00000000",
          phone: data.phone || "000-000-0000",
          email: data.email || "",
        };

        setUser(defaults);
        setEditData(defaults);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }

    fetchUser();
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!userData?.uid) return;

    try {
      await set(ref(database, `users/${userData.uid}`), editData);
      setUser(editData);
      setEditMode(false);
      alert("บันทึกข้อมูลเรียบร้อย ✅");
    } catch (err) {
      console.error("Error saving data:", err);
      alert("เกิดข้อผิดพลาด ❌");
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => onLogout())
      .catch(console.error);
  };

  if (!user) return <p className="text-gray-500 p-6">Loading user info...</p>;

  const fields = [
    { key: "name", label: "ชื่อในระบบ", placeholder: "No Name" },
    { key: "fullName", label: "ชื่อเต็ม", placeholder: "No Full Name" },
    { key: "studentId", label: "รหัสนักศึกษา", placeholder: "00000000" },
    { key: "phone", label: "เบอร์โทร", placeholder: "000-000-0000" },
    { key: "email", label: "Email", placeholder: "No Email" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#2e2eff] flex items-center justify-between p-4 rounded-b-3xl">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
          <span className="text-white text-xl font-bold">MA THAN</span>
        </div>
        <img src={profile} alt="Profile" className="w-10 h-10 rounded-full" />
      </header>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        <button
          onClick={onBack}
          className="flex items-center self-start text-gray-700 mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2"
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-lg font-semibold">Profile</span>
        </button>

        {/* Avatar */}
        <img src={profile} alt="User Avatar"
             className="w-28 h-28 rounded-full object-cover mb-6 shadow-sm border border-gray-200" />

        {/* User Info */}
        <div className="w-full max-w-md space-y-3">
          {fields.map(({ key, placeholder }) => (
            <div key={key} className="flex flex-col bg-white rounded-lg shadow-sm p-3">
              {/* Label ภาษาอังกฤษ */}
              <label className="text-gray-500 text-xs mb-1">
                {key === "name" ? "UserName" :
                key === "fullName" ? "Full Name" :
                key === "studentId" ? "Student ID" :
                key === "phone" ? "Phone" :
                "Email"}
              </label>

              {/* Input / Display */}
              <div className="flex items-center justify-between">
                {editMode ? (
                  <input
                    type={key === "email" ? "email" : "text"}
                    name={key}
                    value={editData[key]}
                    onChange={handleChange}
                    className="flex-1 text-gray-800 text-sm focus:outline-none"
                  />
                ) : (
                  <span className="text-gray-700 text-sm">{user[key] || placeholder}</span>
                )}

                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="ml-3 px-3 py-1 text-blue-500 text-xs font-semibold rounded-md hover:bg-blue-50 transition"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}

          {editMode && (
            <button
              onClick={handleSave}
              className="w-full py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition mt-2"
            >
              Save
            </button>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-5 py-2 mt-5 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm font-medium"
        >
          Logout
        </button>
      </main>

        {/* Bottom Navigation Container for Profile */}
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
              { name: "Notifications", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", action: () => onGoToNotifications() },
              { name: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", action: () => onGoToProfile(), active: true } // Profile active
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