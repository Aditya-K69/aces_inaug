"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "PC" }),
      });

      const data = await res.json();
      console.log(data)
      if (data.trigger === true) {
        window.location.href = "https://aces-website-2025-26.vercel.app/";
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
