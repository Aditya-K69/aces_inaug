'use client';

import { useState, useEffect } from 'react';

interface RedirectNoticeProps {
  show: boolean;
}

export default function RedirectNotice({ show }: RedirectNoticeProps) {
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    if (show) {
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            window.location.href = 'https://acespvgcoet.in/';
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [show]);

  return (
    <div
      className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 z-25 transition-opacity duration-500 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      Redirecting to main system in <span className="font-mono">{countdown}</span> seconds...
    </div>
  );
}