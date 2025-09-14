"use client";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [timer, setTimer] = useState(10);
  const [started, setStarted] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [countdown, setCountdown] = useState(7);
  const [showCountdown, setShowCountdown] = useState(false);

  // Canvas refs
  const matrixCanvasRef = useRef(null);
  const confettiCanvasRef = useRef(null);
  const fireworksCanvasRef = useRef(null);
  const popCanvasRef = useRef(null);
  
  // System refs
  const soundSystemRef = useRef(null);
  const matrixRainRef = useRef(null);
  const popEffectsRef = useRef(null);

  // Poll API until trigger is received (original logic)
  useEffect(() => {
    if (started) return;
    const interval = setInterval(async () => {
      const res = await fetch("/api/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "PC" }),
      });
      const data = await res.json();
      console.log(data);
      if (data.trigger === true) {
        setStarted(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [started]);

  // Original countdown logic (runs after trigger but before final redirect)
  useEffect(() => {
    if (!started) return;
    const countdownTimer = setInterval(() => {
      setTimer((prev) => {
        if (prev > 1) return prev - 1;
        clearInterval(countdownTimer);
        window.location.href = "https://aces-website-2025-26.vercel.app/";
        return 0;
      });
    }, 1000);
    return () => clearInterval(countdownTimer);
  }, [started]);

  // Final countdown before redirect (7-second countdown)
  useEffect(() => {
    if (!showCountdown) return;
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          window.location.href = "https://aces-website-2025-26.vercel.app/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showCountdown]);

  // Initialize systems on mount
  useEffect(() => {
    // Sound System
    class SoundSystem {
      constructor() {
        this.audioContext = null;
        this.initialized = false;
      }

      async init() {
        if (this.initialized) return;
        try {
          this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
          this.initialized = true;
        } catch (e) {
          console.log('Audio not supported');
        }
      }

      playKeyboardSound() {
        if (!this.initialized) return;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.05);
      }

      playSuccessSound() {
        if (!this.initialized) return;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
      }

      playCelebrationSound() {
        if (!this.initialized) return;
        const frequencies = [523.25, 659.25, 783.99];
        frequencies.forEach((freq, index) => {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
          oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.12, this.audioContext.currentTime + index * 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1.5);
          oscillator.start(this.audioContext.currentTime + index * 0.05);
          oscillator.stop(this.audioContext.currentTime + 1.5);
        });
      }

      playConfettiSound() {
        if (!this.initialized) return;
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            oscillator.frequency.setValueAtTime(1500 + Math.random() * 500, this.audioContext.currentTime);
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.04, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.15);
          }, i * 120);
        }
      }
    }

    // Initialize systems
    soundSystemRef.current = new SoundSystem();
    
    return () => {
      // Cleanup
      if (matrixRainRef.current) matrixRainRef.current.stop();
    };
  }, []);

  const startCompilation = async () => {
    if (isLaunched) return;
    setIsLaunched(true);

    // Initialize sound
    if (soundSystemRef.current) {
      await soundSystemRef.current.init();
    }

    // Add typing delay simulation
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Start matrix effect
    if (matrixCanvasRef.current) {
      matrixRainRef.current = new (class MatrixRain {
        constructor(canvas) {
          this.canvas = canvas;
          this.ctx = canvas.getContext("2d");
          this.canvas.width = window.innerWidth;
          this.canvas.height = window.innerHeight;
          this.characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?";
          this.fontSize = 14;
          this.columns = Math.floor(this.canvas.width / this.fontSize);
          this.drops = Array(this.columns).fill(0);
        }
        draw() {
          this.ctx.fillStyle = "rgba(0,0,0,0.05)";
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.fillStyle = "#00ff00";
          this.ctx.font = `${this.fontSize}px 'JetBrains Mono', monospace`;
          for (let i = 0; i < this.drops.length; i++) {
            const char = this.characters[Math.floor(Math.random() * this.characters.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;
            this.ctx.fillText(char, x, y);
            if (y > this.canvas.height && Math.random() > 0.975) this.drops[i] = 0;
            this.drops[i]++;
          }
        }
        start() {
          const animate = () => {
            this.draw();
            this.animationFrame = requestAnimationFrame(animate);
          };
          animate();
        }
        stop() {
          if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        }
      })(matrixCanvasRef.current);
      
      matrixRainRef.current.start();
    }

    setShowTerminal(false);

    setTimeout(() => {
      if (matrixRainRef.current) matrixRainRef.current.stop();
      setShowLogo(true);
      
      // Play celebration sound
      if (soundSystemRef.current) {
        soundSystemRef.current.playCelebrationSound();
      }

      // Start confetti
      if (confettiCanvasRef.current) {
        const celebrationColors = ["#FFFFFF", "#E9D5FF", "#C084FC", "#9333EA", "#4C1D95"];
        const confetti = new (class ConfettiSystem {
          constructor(canvas, colors) {
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");
            this.particles = [];
            this.colors = colors;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
          }
          explode() {
            const particleCount = 200;
            for (let i = 0; i < particleCount; i++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = Math.random() * 12 + 5;
              this.particles.push({
                x: this.canvas.width / 2, y: this.canvas.height / 2,
                vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                size: Math.random() * 6 + 2,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                alpha: 1, life: 1, decay: 0.01
              });
            }
            this.animate();
          }
          animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.particles = this.particles.filter(p => {
              p.x += p.vx; p.y += p.vy; p.vy += 0.3;
              p.life -= p.decay; p.alpha = Math.max(0, p.life);
              this.ctx.save();
              this.ctx.globalAlpha = p.alpha;
              this.ctx.fillStyle = p.color;
              this.ctx.beginPath();
              this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              this.ctx.fill();
              this.ctx.restore();
              return p.life > 0;
            });
            if (this.particles.length > 0) {
              requestAnimationFrame(() => this.animate());
            }
          }
        })(confettiCanvasRef.current, celebrationColors);
        
        confetti.explode();
        
        // Play confetti sound
        if (soundSystemRef.current) {
          soundSystemRef.current.playConfettiSound();
        }
      }

      setTimeout(() => {
        setShowCountdown(true);
      }, 3000);
    }, 3500);
  };

  return (
    <div className="relative w-full h-screen bg-black text-green-400 font-mono overflow-hidden">
      {/* Canvas layers */}
      <canvas
        ref={matrixCanvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
        style={{ opacity: showTerminal ? 0 : 1 }}
      />
      <canvas
        ref={confettiCanvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
      />
      <canvas
        ref={fireworksCanvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
      />
      <canvas
        ref={popCanvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-22"
      />

      {/* Terminal Interface - Always shown first */}
      {showTerminal && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-10 transition-all duration-500"
          style={{
            opacity: isLaunched ? 0.1 : 1,
            transform: isLaunched ? 'scale(0.9)' : 'scale(1)'
          }}
        >
          <div className="w-11/12 max-w-4xl h-3/4 bg-gray-900 border-2 border-gray-600 rounded-lg p-5 shadow-2xl shadow-green-400/30">
            {/* Terminal Header */}
            <div className="flex items-center mb-4 pb-2 border-b border-gray-600">
              <div className="flex gap-2 mr-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-sm text-gray-500">Terminal - ACES Development Environment</div>
            </div>
            
            {/* Terminal Content */}
            <div className="flex flex-col h-full">
              {/* Command prompt */}
              <div className="mb-4">
                <span className="text-green-400">user@aces-dev:~$</span>
                {!isLaunched && <span className="inline-block bg-green-400 w-2 h-4 ml-1 animate-pulse"></span>}
              </div>
              
              {/* Center content */}
              <div className="flex items-center justify-center flex-1">
                <div className="text-center">
                  {/* Status message */}
                  {!started && (
                    <div className="mb-6 text-green-400 text-lg animate-pulse">
                      ACES INAUGURATION WEBSITE
                    </div>
                  )}
                  {!started && (
                    <div className="mb-8 text-gray-400 text-base">
                      Waiting for trigger...
                    </div>
                  )}
                  {started && !isLaunched && (
                    <div className="mb-8 text-green-400 text-base animate-bounce">
                      System ready! Click to initialize.
                    </div>
                  )}
                  
                  {/* Launch button */}
                  <button
                    onClick={startCompilation}
                    disabled={!started || isLaunched}
                    className={`
                      bg-gradient-to-r from-gray-800 to-gray-600 
                      border-2 border-green-400 text-green-400 
                      px-8 py-4 font-mono text-lg rounded 
                      uppercase tracking-wider shadow-lg 
                      transition-all duration-300
                      ${started && !isLaunched
                        ? 'hover:bg-green-400 hover:bg-opacity-10 hover:shadow-green-400/50 hover:-translate-y-0.5 cursor-pointer' 
                        : 'opacity-50 cursor-not-allowed'
                      }
                    `}
                  >
                    Initialize Compilation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logo and Welcome Screen */}
      {showLogo && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center z-15 transition-all duration-1000"
          style={{ 
            background: 'linear-gradient(45deg, #000000, #11081f)',
            animation: 'backgroundPulse 3s ease-in-out infinite'
          }}
        >
          <div className="text-center">
            <div className="mb-8">
              <div className="w-56 h-56 mx-auto mb-6 bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-6xl font-bold text-white shadow-2xl animate-pulse">
                ACES
              </div>
            </div>
            <div className="text-2xl mb-6 text-white">
              <span className="inline-block animate-bounce">Welcome to the Inauguration of ACES 2025–26</span>
            </div>
            <div className="text-xl text-green-400 font-bold">
              <span className="inline-block animate-pulse">LAUNCH SUCCESSFUL</span>
            </div>
          </div>
        </div>
      )}

      {/* Countdown Notice */}
      {showCountdown && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 z-25">
          Redirecting to main system in <span className="text-green-400 font-bold">{countdown}</span> seconds...
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        
        @keyframes backgroundPulse {
          0%, 100% { background-color: #000; }
          50% { background-color: #11081f; }
        }
        
        .font-mono {
          font-family: 'JetBrains Mono', 'Courier New', monospace;
        }
      `}</style>
    </div>
  );
}