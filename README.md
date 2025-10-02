อธิบายครบทั้งฟีเจอร์ วิธีติดตั้ง และการดูผ่าน GitHub Pages

````markdown
# FoodShare MINI Project (React + Vite)

เว็บแอป **"Shared Food Board"** พัฒนาด้วย **React 18 + Vite + Tailwind CSS** สำหรับแบ่งปันอาหารภายในชุมชน มาพร้อมฟีเจอร์หลัก เช่น หน้า Home, Menu, Notifications และ Profile พร้อม Bottom Navigation และ Floating Action Button (FAB)  

---

## ฟีเจอร์เด่น

- หน้า **Home / Menu / Notifications / Profile** ใช้งานง่าย
- **Animated Tabs** สำหรับ My Shares ↔ My Pickups
- ล็อกอินและออกจากระบบผ่าน **Firebase Authentication**
- ใช้ **Tailwind CSS** ออกแบบ UI เรียบง่ายและ responsive
- Floating Action Button สำหรับการสร้างโพสต์ใหม่
- จัดการ state ผ่าน **App.jsx** ให้หน้าเว็บไม่รีเฟรชระหว่างเปลี่ยนหน้า
- รองรับการใช้งานผ่าน **GitHub Pages**

---

## การติดตั้งและรันโปรเจกต์

1. **โคลนโปรเจกต์จาก GitHub**
```bash
git clone https://github.com/Layremysuker/FoodShare_MINIProjuct.git
cd FoodShare_MINIProjuct
````

2. **ติดตั้ง dependencies**

```bash
npm install
# หรือ
yarn install
```

3. **สร้างไฟล์ .env.local** (สำหรับรันในเครื่องตัวเอง)

```
VITE_API_KEY=your_firebase_apiKey
VITE_AUTH_DOMAIN=your_firebase_authDomain
VITE_PROJECT_ID=your_firebase_projectId
VITE_STORAGE_BUCKET=your_firebase_storageBucket
VITE_MESSAGING_SENDER_ID=your_firebase_messagingSenderId
VITE_APP_ID=your_firebase_appId
VITE_DATABASE_URL=your_firebase_databaseURL
VITE_MEASUREMENT_ID=your_firebase_measurementId
```

> หมายเหตุ: `.env.local` ไม่ควรอัพขึ้น GitHub เพื่อความปลอดภัย

4. **รันเว็บในโหมดพัฒนา**

```bash
npm run dev
# หรือ
yarn dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:5173`

5. **สร้างไฟล์สำหรับ Production**

```bash
npm run build
# หรือ
yarn build
```

จะได้โฟลเดอร์ `dist/` สำหรับ deploy

---

## ดูผ่าน GitHub Pages

โปรเจกต์สามารถดูได้ผ่าน GitHub Pages โดยตั้งค่า branch หรือ folder `dist` ให้เป็น source ของ Pages

* ลิงก์ตัวอย่าง:
  `https://Layremysuker.github.io/FoodShare_MINIProjuct/`

> หมายเหตุ: ปุ่ม Logout จะใช้งานได้เมื่อ Firebase Authentication ถูกตั้งค่าให้ยอมรับโดเมนของ GitHub Pages

---

## โครงสร้างโปรเจกต์ (ย่อ)

```
src/
 ├─ pages/
 │   ├─ Home.jsx
 │   ├─ Menu.jsx
 │   ├─ Notifications.jsx
 │   └─ Profile.jsx  ← ปุ่ม Logout อยู่ที่นี่
 ├─ firebase.js      ← Firebase config ดึงค่า environment variables
 ├─ App.jsx          ← State management ของหน้าเว็บ
 └─ main.jsx
```

---

## ขอบคุณ

โปรเจกต์นี้เป็น **Mini Project**
