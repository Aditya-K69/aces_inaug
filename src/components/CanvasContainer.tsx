'use client';

import { useRef, useEffect } from 'react';
import MatrixRain from '../utils/MatrixRain';
import ConfettiSystem from '../utils/ConfettiSystem';
import FireworksSystem from '../utils/FireworksSystem';
import MarriagePopEffects from '../utils/MarriagePopEffects';
import SoundSystem from '../utils/SoundSystem';

interface CanvasContainerProps {
  showMatrix: boolean;
  showCelebration: boolean;
  soundSystem: SoundSystem | null;
}

export default function CanvasContainer({ showMatrix, showCelebration, soundSystem }: CanvasContainerProps) {
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksCanvasRef = useRef<HTMLCanvasElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const popCanvasRef = useRef<HTMLCanvasElement>(null);

  const matrixRainRef = useRef<MatrixRain | null>(null);
  const celebrationColors = ['#FFFFFF', '#E9D5FF', '#C084FC', '#9333EA', '#4C1D95'];

  useEffect(() => {
    if (showMatrix && matrixCanvasRef.current) {
      matrixRainRef.current = new MatrixRain(matrixCanvasRef.current);
      matrixRainRef.current.start();

      // Stop matrix after 3.5 seconds
      setTimeout(() => {
        matrixRainRef.current?.stop();
      }, 3500);
    }
  }, [showMatrix]);

  useEffect(() => {
    if (showCelebration && confettiCanvasRef.current && popCanvasRef.current) {
      // Initialize celebration effects
      const confetti = new ConfettiSystem(confettiCanvasRef.current, celebrationColors);
      // const fireworks = new FireworksSystem(fireworksCanvasRef.current, celebrationColors);
      // const popEffects = new MarriagePopEffects(popCanvasRef.current, celebrationColors);

      // Start celebration sequence
      setTimeout(() => {
        soundSystem?.playConfettiSound();
        // popEffects.celebrationBurst();
        // popEffects.continuousCelebration(7000);
        confetti.explode();
        // fireworks.launch();

        // Additional bursts
        setTimeout(() => {
          soundSystem?.playConfettiSound();
          // popEffects.celebrationBurst();
          confetti.explode();
        }, 1500);

        setTimeout(() => {
          soundSystem?.playConfettiSound();
          // popEffects.celebrationBurst();
          confetti.explode();
        }, 3000);
      }, 500);
    }
  }, [showCelebration, soundSystem]);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {/* Matrix Canvas */}
      <canvas
        ref={matrixCanvasRef}
        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 z-[5] ${
          showMatrix ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Fireworks Canvas */}
      <canvas
        ref={fireworksCanvasRef}
        className="absolute top-0 left-0 w-full h-full z-[20]"
      />
      
      {/* Confetti Canvas */}
      <canvas
        ref={confettiCanvasRef}
        className="absolute top-0 left-0 w-full h-full z-[20]"
      />
      
      {/* Pop Effects Canvas */}
      <canvas
        ref={popCanvasRef}
        className="absolute top-0 left-0 w-full h-full z-[22]"
      />
    </div>
  );
}



