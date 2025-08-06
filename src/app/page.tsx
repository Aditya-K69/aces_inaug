"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/trigger");
        const data = await res.json();

        if (data.flag) {
          window.location.href = "https://acespvgcoet.in/";
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 500); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-2xl">
      ACES INAUGURATION WEBSITE
    </div>
  );
}
