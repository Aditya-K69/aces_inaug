"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [timer, setTimer] = useState(10);
  const [started, setStarted] = useState(false);

  // Poll API until trigger is received
  useEffect(() => {
    if (started) return; // stop polling once countdown starts

    const interval = setInterval(async () => {
      const res = await fetch("/api/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "PC" }),
      });

      const data = await res.json();
      console.log(data);

      if (data.trigger === true) {
        setStarted(true); // start countdown
        clearInterval(interval); // stop polling
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [started]);

  // Countdown logic
  useEffect(() => {
    if (!started) return;

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev > 1) return prev - 1;
        clearInterval(countdown);
        window.location.href = "https://aces-website-2025-26.vercel.app/";
        return 0;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [started]);

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen text-2xl">
        ACES INAUGURATION WEBSITE{" "}
        {started ? `Time to Reveal : ${timer}` : "Waiting for trigger..."}
      </div>
      <div className="text-white"></div>
    </div>
  );
}
