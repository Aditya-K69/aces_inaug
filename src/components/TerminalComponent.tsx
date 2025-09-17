'use client';

import { useState, useEffect, useRef } from 'react';
import SoundSystem from '../utils/SoundSystem';

interface TerminalComponentProps {
  onLaunch: () => void;
  isLaunched: boolean;
  opacity: number;
  soundSystem: SoundSystem | null;
}

interface TerminalLine {
  type: 'command' | 'output' | 'success' | 'progress';
  text: string;
}

export default function TerminalComponent({ onLaunch, isLaunched, opacity, soundSystem }: TerminalComponentProps) {
  const [showCursor, setShowCursor] = useState(true);
  const [showButton, setShowButton] = useState(true);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [progressWidth, setProgressWidth] = useState(0);
  const terminalContentRef = useRef<HTMLDivElement>(null);

  const compilationLines: TerminalLine[] = [
    { type: 'command', text: 'gcc -o ACES main.c -std=c25 -Wall -O2' },
    { type: 'output', text: 'Compiling main.c...' },
    { type: 'progress', text: '' },
    { type: 'output', text: 'Linking libraries...' },
    { type: 'output', text: 'Optimizing code...' },
    { type: 'success', text: 'Build successful.' },
    { type: 'command', text: './launch_aces' },
    { type: 'output', text: 'Initializing ACES system...' },
    { type: 'output', text: 'Loading modules...' },
    { type: 'success', text: 'ACES system online.' },
  ];

  const addLine = (lineData: TerminalLine, index: number) => {
    setTimeout(() => {
      if (lineData.type === 'progress') {
        setTerminalLines(prev => [...prev, lineData]);
        setTimeout(() => setProgressWidth(100), 100);
      } else {
        setTerminalLines(prev => [...prev, { ...lineData, text: '' }]);
        let currentIndex = 0;
        const typeInterval = setInterval(() => {
          if (currentIndex < lineData.text.length) {
            soundSystem?.playKeyboardSound();
            setTerminalLines(prev => {
              const newLines = [...prev];
              newLines[newLines.length - 1] = {
                ...lineData,
                text: lineData.text.substring(0, currentIndex + 1)
              };
              return newLines;
            });
            currentIndex++;
          } else {
            clearInterval(typeInterval);
            if (lineData.type === 'success') {
              setTimeout(() => soundSystem?.playSuccessSound(), 100);
            }
          }
        }, 50);
      }

      if (terminalContentRef.current) {
        terminalContentRef.current.scrollTop = terminalContentRef.current.scrollHeight;
      }
    }, index === 0 ? 500 : 1000 + (index * (lineData.type === 'progress' ? 1500 : (lineData.type === 'command' ? 1800 : 1000))));
  };

  const handleLaunch = () => {
    if (isLaunched) return;
    setShowCursor(false);
    setShowButton(false);
    compilationLines.forEach((line, index) => addLine(line, index));
    onLaunch();
  };

  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'Enter') && !isLaunched) {
        e.preventDefault();
        handleLaunch();
      }
    };
    document.addEventListener('keydown', keydownHandler);
    return () => document.removeEventListener('keydown', keydownHandler);
  }, [isLaunched]);

  return (
    <div className="flex justify-center items-center w-full">
      <div 
        className={`
          bg-black border-2 border-neutral-700 rounded-lg p-5 shadow-[0_0_20px_rgba(0,255,0,0.3)]
          font-mono text-sm relative transition-all
          w-[90%] max-w-5xl h-[70vh]
        `}
        style={{ 
          opacity: opacity, 
          transform: opacity === 0.1 ? 'scale(0.9)' : 'scale(1)' 
        }}
      >
        {/* Header */}
        <div className="flex items-center mb-5 pb-2 border-b border-neutral-700">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 mr-4"></div>
          <div className="text-neutral-500 text-xs">Terminal - ACES Development Environment</div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-70px)] overflow-y-auto" ref={terminalContentRef}>
          {/* Prompt */}
          <div className="leading-relaxed my-1">
            <span className="text-green-500">user@aces-dev:~$</span>
            {showCursor && <span className="inline-block bg-green-500 w-2 h-4 animate-pulse ml-1"></span>}
          </div>

          {/* Lines */}
          {terminalLines.map((line, index) => (
            <div key={index} className="leading-relaxed my-1">
              {line.type === 'command' && (
                <>
                  <span className="text-green-500">user@aces-dev:~$</span>{' '}
                  <span className="text-white">{line.text}</span>
                </>
              )}
              {line.type === 'output' && <span className="text-neutral-400 ml-5">{line.text}</span>}
              {line.type === 'success' && <span className="text-green-500 font-bold">{line.text}</span>}
              {line.type === 'progress' && (
                <div className="w-full h-1 bg-neutral-800 rounded mt-2">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 shadow-[0_0_10px_#00ff00] transition-all duration-500"
                    style={{ width: `${progressWidth}%` }}
                  />
                </div>
              )}
            </div>
          ))}

          {/* Launch Button */}
          {showButton && (
            <div className="text-center mt-10">
              <button
                onClick={handleLaunch}
                className="px-6 py-3 border-2 border-green-500 text-green-500 rounded-md uppercase tracking-wider font-mono text-sm shadow-[0_0_10px_rgba(0,255,0,0.3)] hover:bg-green-500 hover:text-black transition-all"
              >
                Initialize Compilation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
