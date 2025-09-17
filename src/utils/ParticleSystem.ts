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
  [key: string]: any;
}

abstract class ParticleSystem {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected particles: Particle[] = [];
  protected colors: string[];
  protected animationFrame: number | null = null;

  constructor(canvas: HTMLCanvasElement, colors: string[]) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.colors = colors;
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles = this.particles.filter(p => this.updateParticle(p));
    this.particles.forEach(p => this.drawParticle(p));
    
    if (this.particles.length > 0) {
      this.animationFrame = requestAnimationFrame(() => this.animate());
    }
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.particles = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  abstract drawParticle(particle: Particle): void;
  abstract updateParticle(particle: Particle): boolean;
}

export default ParticleSystem;
export type { Particle };