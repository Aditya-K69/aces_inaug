"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "PC" }),
      });

      const data = await res.json();
      console.log(data);

      if (data.trigger === true) {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        if (timer === 1) {
          window.location.href = "https://aces-website-2025-26.vercel.app/";
        }
      }
    }, 1000); // poll every second

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen text-2xl">
        ACES INAUGURATION WEBSITE Time to Reveal : {timer}
      </div>
      <div className="text-white">
        
      </div>
    </div>
  );
}
