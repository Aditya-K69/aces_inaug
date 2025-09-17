'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface LogoContainerProps {
  show: boolean;
}

export default function LogoContainer({ show }: LogoContainerProps) {
  const welcomeTextRef = useRef<HTMLDivElement>(null);
  const launchStatusRef = useRef<HTMLDivElement>(null);

  const animateText = (element: HTMLElement) => {
    const text = element.textContent?.trim() || '';
    element.innerHTML = '';
    
    text.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.className = 'inline-block opacity-0 animate-reveal-char';
      span.style.animationDelay = `${index * 0.05}s`; // fixed here
      element.appendChild(span);
    });
  };

  useEffect(() => {
    if (show && welcomeTextRef.current && launchStatusRef.current) {
      setTimeout(() => {
        animateText(welcomeTextRef.current!);
        animateText(launchStatusRef.current!);
      }, 100);
    }
  }, [show]);

  return (
    <div
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-15 transition-all duration-1000 ${
        show
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-75'
      }`}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}
    >
      {/* ACES Logo */}
      <div className="mb-5 flex justify-center items-center">
        <Image
          src="/ACES_Logo_White.png"
          alt="ACES Logo"
          width={220}
          height={220}
          className="animate-logo-pulse mx-auto"
          style={{
            filter: 'drop-shadow(0 0 25px #c084fc) drop-shadow(0 0 50px #a855f7) drop-shadow(0 0 80px #818cf8)'
          }}
        />
      </div>

      {/* Welcome Text */}
      <div
        ref={welcomeTextRef}
        className="text-2xl mb-6 tracking-wide"
        style={{
          background: 'linear-gradient(to right, #ffffff, #e9d5ff, #c084fc, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 15px rgba(192,132,252,0.7)'
        }}
      >
        Welcome to the Inauguration of ACES 2025–26
      </div>

      {/* Launch Status */}
      <div
        ref={launchStatusRef}
        className="text-2xl text-green-500"
        style={{
          textShadow: '0 0 20px #00ff00'
        }}
      >
        LAUNCH SUCCESSFUL
      </div>
    </div>
  );
}
