"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";


interface ApiResponse {
  trigger: boolean;
}

interface CompilationLine {
  type: "command" | "output" | "success" | "progress";
  text: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  color: string;
  alpha: number;
  gravity: number;
  friction: number;
  life: number;
  decay: number;
  shape: "rect" | "circle";
}

interface SoundSystem {
  audioContext: AudioContext | null;
  initialized: boolean;
  init(): Promise<void>;
  playKeyboardSound(): void;
  playSuccessSound(): void;
  playCelebrationSound(): void;
}

class SoundSystemImpl implements SoundSystem {
  audioContext: AudioContext | null = null;
  initialized: boolean = false;

  async init(): Promise<void> {
    if (this.initialized) return;
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.log('Audio not supported');
    }
  }

  playKeyboardSound(): void {
    if (!this.initialized || !this.audioContext) return;
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

  playSuccessSound(): void {
    if (!this.initialized || !this.audioContext) return;
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

  playCelebrationSound(): void {
    if (!this.initialized || !this.audioContext) return;
    const frequencies = [523.25, 659.25, 783.99];
    frequencies.forEach((freq, index) => {
      if (!this.audioContext) return;
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
}

abstract class ParticleSystem {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected particles: Particle[] = [];
  protected colors: string[];
  protected animationFrame: number | null = null;

  constructor(canvas: HTMLCanvasElement, colors: string[]) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");
    this.ctx = ctx;
    this.colors = colors;
    this.resizeCanvas();
  }

  protected resizeCanvas(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  protected animate(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles = this.particles.filter(p => this.updateParticle(p));
    this.particles.forEach(p => this.drawParticle(p));
    if (this.particles.length > 0) {
      this.animationFrame = requestAnimationFrame(() => this.animate());
    }
  }

  protected abstract updateParticle(particle: Particle): boolean;
  protected abstract drawParticle(particle: Particle): void;
}

class ConfettiSystem extends ParticleSystem {
  createParticle(x: number, y: number, vx: number, vy: number): Particle {
    return {
      x, y, vx, vy,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 20,
      size: Math.random() * 8 + 3,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      alpha: 1,
      gravity: 0.2 + Math.random() * 0.2,
      friction: 0.98,
      life: 1,
      decay: 0.008 + Math.random() * 0.004,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    };
  }

  explode(): void {
    const particleCount = 200;
    const corners = [
      { x: 0, y: 0 }, 
      { x: this.canvas.width, y: 0 },
      { x: 0, y: this.canvas.height }, 
      { x: this.canvas.width, y: this.canvas.height }
    ];

    corners.forEach(corner => {
      for (let i = 0; i < particleCount / 4; i++) {
        const angle = Math.atan2(this.canvas.height / 2 - corner.y, this.canvas.width / 2 - corner.x) + (Math.random() - 0.5) * (Math.PI / 2.5);
        const speed = Math.random() * 15 + 8;
        this.particles.push(this.createParticle(corner.x, corner.y, Math.cos(angle) * speed, Math.sin(angle) * speed));
      }
    });

    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 5;
      this.particles.push(this.createParticle(
        this.canvas.width / 2, 
        this.canvas.height / 2, 
        Math.cos(angle) * speed, 
        Math.sin(angle) * speed
      ));
    }

    this.animate();
  }

  protected drawParticle(p: Particle): void {
    this.ctx.save();
    this.ctx.shadowColor = p.color;
    this.ctx.shadowBlur = p.size * p.alpha;
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate((p.rotation * Math.PI) / 180);
    this.ctx.globalAlpha = p.alpha;
    this.ctx.fillStyle = p.color;
    if (p.shape === "rect") {
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
    } else {
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  protected updateParticle(p: Particle): boolean {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= p.friction;
    p.vy *= p.friction;
    p.rotation += p.rotationSpeed;
    p.life -= p.decay;
    p.alpha = Math.max(0, p.life);
    p.rotationSpeed *= 0.99;
    return p.life > 0;
  }
}

interface AnimatedTextProps {
  children: string;
  delay?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ children, delay = 0 }) => {
  const [visible, setVisible] = useState<boolean>(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`transition-all duration-1000 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
      {children.split('').map((char, index) => (
        <span
          key={index}
          className="inline-block"
          style={{
            animation: visible ? `revealChar 1s ${index * 0.05}s forwards` : 'none',
            opacity: 0
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
};

export default function Home(): React.JSX.Element {
  const [started, setStarted] = useState<boolean>(false);
  const [isLaunched, setIsLaunched] = useState<boolean>(false);
  const [showTerminal, setShowTerminal] = useState<boolean>(true);
  const [showLogo, setShowLogo] = useState<boolean>(false);
  const [compilationStep, setCompilationStep] = useState<number>(0);
  const [showMatrix, setShowMatrix] = useState<boolean>(false);
  const [isBlurred, setIsBlurred] = useState<boolean>(true); // New state for blur effect
  
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const soundSystemRef = useRef<SoundSystem | null>(null);

  // Initialize sound system
  useEffect(() => {
    soundSystemRef.current = new SoundSystemImpl();
  }, []);

  // Matrix Rain Effect
  useEffect(() => {
    if (!showMatrix) return;

    const canvas = matrixCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(0);

    let animationFrame: number;

    const draw = (): void => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff00";
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = characters[Math.floor(Math.random() * characters.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(char, x, y);
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [showMatrix]);

  // Particle Systems
  useEffect(() => {
    if (!showLogo || !confettiCanvasRef.current) return;

    const celebrationColors = ["#FFFFFF", "#E9D5FF", "#C084FC", "#9333EA", "#4C1D95"];
    const confetti = new ConfettiSystem(confettiCanvasRef.current, celebrationColors);
    
    // Start celebration effects
    setTimeout(() => {
      if (soundSystemRef.current) {
        soundSystemRef.current.playCelebrationSound();
      }
      confetti.explode();
    }, 500);

    // Additional bursts
 

  }, [showLogo]);

  // Poll API until trigger is received - IMMEDIATELY START COMPILATION WHEN RECEIVED
  useEffect(() => {
    if (started) return;
    
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/trigger", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ module: "PC" }),
        });
        const data: ApiResponse = await res.json();
        console.log(data);
        if (data.trigger === true) {
          setStarted(true);
          setIsBlurred(false); // Remove blur when trigger is received
          clearInterval(interval);
          // IMMEDIATELY start compilation - no countdown, no manual button click
          startCompilation();
        }
      } catch (error) {
        console.error('API call failed:', error);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [started]);

  const startCompilation = async (): Promise<void> => {
    if (isLaunched) return;
    setIsLaunched(true);
    
    // Initialize sound
    if (soundSystemRef.current) {
      await soundSystemRef.current.init();
    }

    const compilationSteps: string[] = [
      "gcc -o ACES main.c -std=c25 -Wall -O2",
      "Compiling main.c...",
      "progress",
      "Linking libraries...",
      "Optimizing code...",
      "Build successful.",
      "./launch_aces",
      "Initializing ACES system...",
      "Loading modules...",
      "ACES system online."
    ];

    // Execute all compilation steps
    for (let i = 0; i < compilationSteps.length; i++) {
      await new Promise<void>(resolve => {
        setTimeout(() => {
          setCompilationStep(i + 1);
          if (soundSystemRef.current && (i === 5 || i === 9)) {
            soundSystemRef.current.playSuccessSound();
          } else if (soundSystemRef.current && compilationSteps[i] !== "progress") {
            soundSystemRef.current.playKeyboardSound();
          }
          resolve();
        }, i === 2 ? 1500 : (compilationSteps[i].startsWith("./") ? 1800 : 1000));
      });
    }

    // Start matrix effect
    setTimeout(() => {
      setShowMatrix(true);
      setShowTerminal(false);
      
      // Show logo and celebration after matrix
      setTimeout(() => {
        setShowMatrix(false);
        setShowLogo(true);
        
        // Redirect to ACES website after celebration (5 seconds total)
        setTimeout(() => {
          window.location.href = "https://www.acespvgcoet.in/";
        }, 5000);
      }, 3500);
    }, 1000);
  };

  const compilationLines: CompilationLine[] = [
    { type: "command", text: "gcc -o ACES main.c -std=c25 -Wall -O2" },
    { type: "output", text: "Compiling main.c..." },
    { type: "progress", text: "" },
    { type: "output", text: "Linking libraries..." },
    { type: "output", text: "Optimizing code..." },
    { type: "success", text: "Build successful." },
    { type: "command", text: "./launch_aces" },
    { type: "output", text: "Initializing ACES system..." },
    { type: "output", text: "Loading modules..." },
    { type: "success", text: "ACES system online." }
  ];

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'JetBrains Mono', 'Courier New', monospace;
          background: #000;
          color: #00ff00;
          overflow: hidden;
          height: 100vh;
          transition: background-color 1s ease;
        }

        .blur-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          backdrop-filter: blur(20px);
          background: rgba(0, 0, 0, 0.3);
          z-index: 1000;
          transition: opacity 1.5s ease-out, backdrop-filter 1.5s ease-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .blur-overlay.inactive {
          opacity: 0;
          backdrop-filter: blur(0px);
          pointer-events: none;
        }

        .waiting-message {
          color: #00ff00;
          font-size: 1.5rem;
          text-align: center;
          text-shadow: 0 0 20px #00ff00;
          animation: pulse-text 2s ease-in-out infinite;
        }

        @keyframes pulse-text {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        .celebrate-bg {
          animation: backgroundPulse 3s ease-in-out infinite;
        }

        @keyframes backgroundPulse {
          0%, 100% { background-color: #000; }
          50% { background-color: #11081f; }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes revealChar {
          0% { opacity: 0; transform: translateY(20px) scale(0.5) rotate(15deg); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); }
        }

        @keyframes pulse {
          0%, 100% { filter: drop-shadow(0 0 25px #c084fc) drop-shadow(0 0 50px #a855f7) drop-shadow(0 0 80px #818cf8); }
          50% { filter: drop-shadow(0 0 35px #e9d5ff) drop-shadow(0 0 60px #c084fc) drop-shadow(0 0 100px #a855f7); }
        }

        .terminal-container {
          width: 90%;
          max-width: 800px;
          height: 70vh;
          background: #0a0a0a;
          border: 2px solid #333;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
          position: relative;
          z-index: 10;
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .terminal-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #333;
        }

        .terminal-button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 8px;
        }

        .close { background: #ff5f57; }
        .minimize { background: #ffbd2e; }
        .maximize { background: #28ca42; }

        .terminal-title {
          font-size: 14px;
          color: #666;
          margin-left: 15px;
        }

        .terminal-line {
          line-height: 1.6;
          margin: 5px 0;
        }

        .prompt { color: #00ff00; }
        .command { color: #ffffff; }
        .output { color: #888; margin-left: 20px; }
        .success { color: #00ff00; font-weight: bold; }

        .cursor {
          display: inline-block;
          background: #00ff00;
          width: 8px;
          height: 16px;
          animation: blink 1s infinite;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background: #333;
          margin: 10px 0;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00ff00, #00cc00);
          width: 0%;
          transition: width 0.5s ease;
          box-shadow: 0 0 10px #00ff00;
        }

        .aces-logo {
          width: 220px;
          height: auto;
          filter: drop-shadow(0 0 25px #c084fc) drop-shadow(0 0 50px #a855f7) drop-shadow(0 0 80px #818cf8);
          animation: pulse 2.5s ease-in-out infinite;
          margin-bottom: 20px;
        }

        .welcome-text, .launch-status {
          text-align: center;
          letter-spacing: 0.04em;
        }

        .welcome-text {
          font-size: 1.6rem;
          margin-bottom: 25px;
          background: linear-gradient(to right, #ffffff, #e9d5ff, #c084fc, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 15px rgba(192,132,252,0.7);
        }

        .launch-status {
          font-size: 1.5rem;
          color: #00ff00;
          text-shadow: 0 0 20px #00ff00;
        }

        canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .matrix-canvas {
          opacity: 0;
          transition: opacity 1s ease;
        }

        .matrix-canvas.active {
          opacity: 1;
        }
      `}</style>

      {/* Blur Overlay */}
      <div className={`blur-overlay ${!isBlurred ? 'inactive' : ''}`}>
        <div className="waiting-message">
          Awaiting system initialization...
        </div>
      </div>

      <div className="flex items-center justify-center min-h-screen relative">
        {/* Canvas elements */}
        <canvas ref={matrixCanvasRef} className={`matrix-canvas ${showMatrix ? 'active' : ''}`} style={{ zIndex: 5 }} />
        <canvas ref={confettiCanvasRef} style={{ zIndex: 20 }} />
        {/* <canvas ref={fireworksCanvasRef} style={{ zIndex: 20 }} /> */}

        {/* Terminal Interface */}
        {showTerminal && (
          <div className="terminal-container" style={{ opacity: showMatrix ? 0.1 : 1, transform: showMatrix ? 'scale(0.9)' : 'scale(1)' }}>
            <div className="terminal-header">
              <div className="terminal-button close"></div>
              <div className="terminal-button minimize"></div>
              <div className="terminal-button maximize"></div>
              <div className="terminal-title">Terminal - ACES Development Environment</div>
            </div>
            <div className="h-full overflow-y-auto relative">
              {/* Initial state - shows waiting message or auto-starts compilation */}
              {!isLaunched && (
                <>
                  <div className="terminal-line">
                    <span className="prompt">user@aces-dev:~$</span>
                    <span className="cursor"></span>
                  </div>
                  <div className="text-center mt-12">
                    <div className="text-2xl text-white">
                      {!started ? "" : "Initializing compilation..."}
                    </div>
                  </div>
                </>
              )}

              {/* Compilation output */}
              {isLaunched && compilationLines.slice(0, compilationStep).map((line, index) => (
                <div key={index} className="terminal-line">
                  {line.type === "command" && (
                    <>
                      <span className="prompt">user@aces-dev:~$</span>{' '}
                      <span className="command">{line.text}</span>
                    </>
                  )}
                  {line.type === "output" && (
                    <span className="output">{line.text}</span>
                  )}
                  {line.type === "success" && (
                    <span className="success">{line.text}</span>
                  )}
                  {line.type === "progress" && (
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: compilationStep > index ? '100%' : '0%' }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logo and Celebration */}
        {showLogo && (
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-15 transition-all duration-1000 ${showLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-80'}`}>
           <Image src={"/ACES_Logo_White.png"} alt="aces-logo"/>
            <AnimatedText delay={0}>
              Welcome to the Inauguration of ACES 2025-26
            </AnimatedText>
            <AnimatedText delay={500}>
              LAUNCH SUCCESSFUL
            </AnimatedText>
            <div className="mt-8 text-lg text-purple-300">
              Redirecting to main system...
            </div>
          </div>
        )}

        {/* Background celebration class */}
        <div className={showLogo ? 'celebrate-bg' : ''}></div>
      </div>
    </>
  );
}