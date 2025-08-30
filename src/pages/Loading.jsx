import { useEffect, useState } from "react";
import logo from "../img/Logo.png";

export default function Loading({ onFinish }) {
  const [show, setShow] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimateOut(true), 1800);
    const timer2 = setTimeout(() => {
      setShow(false);
      onFinish();
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  if (!show) return null;

  return (
    <div className="w-full h-screen bg-[#2e2eff] font-sans text-white flex justify-center ">
      {/* 🔹 เพิ่ม mt-[-20px] ขยับขึ้น 20px */}
      <div
        className={`text-center mt-[250px] transition-all duration-500 ${
          animateOut ? "animate-slide-up-fade" : ""
        }`}
      >
        <img src={logo} alt="Logo" className="w-24 h-auto mx-auto mb-3" />
        <h1 className="text-2xl font-bold tracking-widest">MA THAN</h1>
      </div>
    </div>
  );
}
