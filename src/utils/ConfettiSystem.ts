import ParticleSystem, { Particle } from './ParticleSystem';

interface ConfettiParticle extends Particle {
  shape: 'rect' | 'circle';
  glowIntensity: number;
}

class ConfettiSystem extends ParticleSystem {
  createParticle(x: number, y: number, vx: number, vy: number): ConfettiParticle {
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
      glowIntensity: Math.random() * 0.5 + 0.5,
    };
  }

  explode() {
    const particleCount = 300;
    const corners = [
      { x: 0, y: 0 }, 
      { x: this.canvas.width, y: 0 },
      { x: 0, y: this.canvas.height }, 
      { x: this.canvas.width, y: this.canvas.height }
    ];

    corners.forEach(corner => {
      for (let i = 0; i < particleCount / 4; i++) {
        const angle = Math.atan2(
          this.canvas.height / 2 - corner.y, 
          this.canvas.width / 2 - corner.x
        ) + (Math.random() - 0.5) * (Math.PI / 2.5);
        const speed = Math.random() * 15 + 8;
        this.particles.push(
          this.createParticle(
            corner.x, 
            corner.y, 
            Math.cos(angle) * speed, 
            Math.sin(angle) * speed
          )
        );
      }
    });

    // Additional center burst
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 5;
      this.particles.push(
        this.createParticle(
          this.canvas.width / 2, 
          this.canvas.height / 2, 
          Math.cos(angle) * speed, 
          Math.sin(angle) * speed
        )
      );
    }

    this.animate();
  }

  drawParticle(p: ConfettiParticle) {
    this.ctx.save();
    this.ctx.shadowColor = p.color;
    this.ctx.shadowBlur = p.size * p.glowIntensity * p.alpha;
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

  updateParticle(p: ConfettiParticle): boolean {
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

export default ConfettiSystem;