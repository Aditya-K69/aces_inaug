import ParticleSystem, { Particle } from './ParticleSystem';

interface PopParticle extends Particle {
  type: 'confetti_rect' | 'confetti_circle' | 'sparkle';
  glowIntensity: number;
}

class MarriagePopEffects extends ParticleSystem {
  private particleTypes = {
    CONFETTI_RECT: 'confetti_rect' as const,
    CONFETTI_CIRCLE: 'confetti_circle' as const,
    SPARKLE: 'sparkle' as const
  };

  private marriageColors = [
    '#FFD700', '#FFC0CB', '#FFFFFF',
    '#F0E68C', '#DDA0DD', '#FFB6C1'
  ];

  private lastFrameTime = 0;
  private frameInterval = 1000 / 30; // Target 30fps

  createParticle(x: number, y: number, vx: number, vy: number, type?: string): PopParticle {
    const particleType = type || this.getRandomParticleType();

    return {
      x, y, vx, vy,
      type: particleType as PopParticle['type'],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
      size: this.getParticleSize(particleType),
      color: this.marriageColors[Math.floor(Math.random() * this.marriageColors.length)],
      alpha: 1,
      gravity: this.getParticleGravity(particleType),
      friction: 0.97 + Math.random() * 0.02,
      life: 1,
      decay: 0.006 + Math.random() * 0.006,
      glowIntensity: Math.random() * 0.5 + 0.3,
    };
  }

  getRandomParticleType(): string {
    const rand = Math.random();
    if (rand < 0.6) return this.particleTypes.CONFETTI_RECT;
    if (rand < 0.9) return this.particleTypes.CONFETTI_CIRCLE;
    return this.particleTypes.SPARKLE;
  }

  getParticleSize(type: string): number {
    const sizeMap: Record<string, number> = {
      [this.particleTypes.CONFETTI_RECT]: Math.random() * 6 + 3,
      [this.particleTypes.CONFETTI_CIRCLE]: Math.random() * 5 + 2,
      [this.particleTypes.SPARKLE]: Math.random() * 3 + 1
    };
    return sizeMap[type] || 4;
  }

  getParticleGravity(type: string): number {
    const gravityMap: Record<string, number> = {
      [this.particleTypes.CONFETTI_RECT]: 0.15 + Math.random() * 0.1,
      [this.particleTypes.CONFETTI_CIRCLE]: 0.18 + Math.random() * 0.12,
      [this.particleTypes.SPARKLE]: 0.02 + Math.random() * 0.03
    };
    return gravityMap[type] || 0.15;
  }

  celebrationBurst() {
    const burstLocations = [
      { x: this.canvas.width * 0.3, y: this.canvas.height * 0.3 },
      { x: this.canvas.width * 0.7, y: this.canvas.height * 0.3 },
      { x: this.canvas.width * 0.3, y: this.canvas.height * 0.7 },
      { x: this.canvas.width * 0.7, y: this.canvas.height * 0.7 }
    ];

    burstLocations.forEach((location, index) => {
      setTimeout(() => {
        this.createBurstAt(location.x, location.y, 50);
      }, index * 200);
    });

    this.animate();
  }

  createBurstAt(x: number, y: number, particleCount: number) {
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 15 + 4;
      const spread = Math.random() * 1.0 + 0.8;

      const vx = Math.cos(angle) * speed * spread;
      const vy = Math.sin(angle) * speed * spread - (Math.random() * 4);

      this.particles.push(this.createParticle(x, y, vx, vy));
    }
  }

  continuousCelebration(duration = 5000) {
    const interval = setInterval(() => {
      const side = Math.floor(Math.random() * 4);
      let x: number, y: number, vx: number, vy: number;

      switch (side) {
        case 0: // Top
          x = Math.random() * this.canvas.width;
          y = -10;
          vx = (Math.random() - 0.5) * 6;
          vy = Math.random() * 5 + 2;
          break;
        case 1: // Right
          x = this.canvas.width + 10;
          y = Math.random() * this.canvas.height;
          vx = -Math.random() * 5 - 2;
          vy = (Math.random() - 0.5) * 6;
          break;
        case 2: // Bottom
          x = Math.random() * this.canvas.width;
          y = this.canvas.height + 10;
          vx = (Math.random() - 0.5) * 6;
          vy = -Math.random() * 5 - 2;
          break;
        case 3: // Left
          x = -10;
          y = Math.random() * this.canvas.height;
          vx = Math.random() * 5 + 2;
          vy = (Math.random() - 0.5) * 6;
          break;
        default:
          return;
      }

      for (let i = 0; i < 8; i++) {
        this.particles.push(this.createParticle(x, y, vx, vy));
      }
    }, 400);

    setTimeout(() => clearInterval(interval), duration);
  }

  drawParticle(p: PopParticle) {
    this.ctx.save();

    if (Math.random() > 0.7) {
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = p.size * p.glowIntensity * p.alpha;
    }

    this.ctx.translate(p.x, p.y);
    this.ctx.rotate((p.rotation * Math.PI) / 180);

    this.ctx.globalAlpha = p.alpha;
    this.ctx.fillStyle = p.color;

    this.drawParticleShape(p);

    this.ctx.restore();
  }

  drawParticleShape(p: PopParticle) {
    const size = p.size;

    switch (p.type) {
      case this.particleTypes.CONFETTI_RECT:
        this.ctx.fillRect(-size / 2, -size / 4, size, size / 2);
        break;

      case this.particleTypes.CONFETTI_CIRCLE:
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        break;

      case this.particleTypes.SPARKLE:
        this.ctx.strokeStyle = p.color;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -size / 2);
        this.ctx.lineTo(0, size / 2);
        this.ctx.moveTo(-size / 2, 0);
        this.ctx.lineTo(size / 2, 0);
        this.ctx.stroke();
        break;
    }
  }

  updateParticle(p: PopParticle): boolean {
    p.x += p.vx;
    p.y += p.vy;

    p.vy += p.gravity;

    p.vx *= p.friction;
    p.vy *= p.friction;

    p.rotation += p.rotationSpeed;
    p.rotationSpeed *= 0.99;

    p.life -= p.decay;
    p.alpha = Math.max(0, p.life);

    return p.life > 0 && p.x > -50 && p.x < this.canvas.width + 50 && p.y < this.canvas.height + 50;
  }

  animate() {
    const now = Date.now();
    const delta = now - this.lastFrameTime;

    if (delta > this.frameInterval) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles = this.particles.filter(p => this.updateParticle(p));
      this.particles.forEach(p => this.drawParticle(p));
      this.lastFrameTime = now - (delta % this.frameInterval);
    }

    if (this.particles.length > 0) {
      this.animationFrame = requestAnimationFrame(() => this.animate());
    }
  }
}

export default MarriagePopEffects;