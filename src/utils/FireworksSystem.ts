import ParticleSystem, { Particle } from './ParticleSystem';

interface FireworkParticle extends Particle {
  type: 'rocket' | 'particle';
  targetY?: number;
  speed?: number;
}

class FireworksSystem extends ParticleSystem {
  launch() {
    const launchCount = 8;
    for (let i = 0; i < launchCount; i++) {
      setTimeout(() => {
        const x = this.canvas.width * (0.1 + Math.random() * 0.8);
        const targetY = this.canvas.height * (0.1 + Math.random() * 0.4);
        this.particles.push({
          type: 'rocket',
          x,
          y: this.canvas.height,
          vx: 0,
          vy: 0,
          targetY,
          color: this.colors[Math.floor(Math.random() * this.colors.length)],
          speed: 2 + Math.random() * 2,
          rotation: 0,
          rotationSpeed: 0,
          size: 3,
          alpha: 1,
          gravity: 0,
          friction: 1,
          life: 1,
          decay: 0,
        });
        // Note: Sound would be handled by the parent component
      }, Math.random() * 3000);
    }
    this.animate();
  }

  explode(x: number, y: number, color: string) {
    const particleCount = 120;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 10 + 3;
      this.particles.push({
        type: 'particle',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 1,
        color: Math.random() > 0.1 ? color : this.colors[Math.floor(Math.random() * this.colors.length)],
        alpha: 1,
        gravity: 0.1,
        friction: 0.96,
        life: 1,
        decay: 0.012 + Math.random() * 0.008,
        rotation: 0,
        rotationSpeed: 0,
      });
    }
  }

  drawParticle(p: FireworkParticle) {
    this.ctx.save();
    this.ctx.shadowColor = p.color;
    this.ctx.shadowBlur = p.size * 2;
    this.ctx.fillStyle = p.color;
    this.ctx.globalAlpha = p.alpha;
    
    if (p.type === 'rocket') {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    } else {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }

  updateParticle(p: FireworkParticle): boolean {
    if (p.type === 'rocket') {
      p.y -= p.speed!;
      p.speed! *= 1.05;
      if (p.y <= p.targetY!) {
        this.explode(p.x, p.y, p.color);
        return false;
      }
    } else {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.life -= p.decay;
      p.alpha = Math.max(0, p.life);
      return p.life > 0;
    }
    return true;
  }
}

export default FireworksSystem;