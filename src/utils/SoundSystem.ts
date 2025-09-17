class SoundSystem {
  private audioContext: AudioContext | null = null;
  private initialized = false;

  async init() {
    if (this.initialized) return;
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.log('Audio not supported');
    }
  }

  playKeyboardSound() {
    if (!this.initialized || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.05);
  }

  playSuccessSound() {
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

  playCelebrationSound() {
    if (!this.initialized || !this.audioContext) return;
    
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    
    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);
      
      oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.12, this.audioContext!.currentTime + index * 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext!.currentTime + 1.5);
      
      oscillator.start(this.audioContext!.currentTime + index * 0.05);
      oscillator.stop(this.audioContext!.currentTime + 1.5);
    });
  }

  playFireworkSound() {
    if (!this.initialized || !this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // Whoosh up
    const oscillator1 = this.audioContext.createOscillator();
    const gainNode1 = this.audioContext.createGain();
    oscillator1.connect(gainNode1);
    gainNode1.connect(this.audioContext.destination);
    
    oscillator1.frequency.setValueAtTime(150, now);
    oscillator1.frequency.exponentialRampToValueAtTime(600, now + 0.4);
    oscillator1.type = 'sine';
    
    gainNode1.gain.setValueAtTime(0.08, now);
    gainNode1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    
    oscillator1.start(now);
    oscillator1.stop(now + 0.4);

    // Explosion
    setTimeout(() => {
      const oscillator2 = this.audioContext!.createOscillator();
      const gainNode2 = this.audioContext!.createGain();
      oscillator2.connect(gainNode2);
      gainNode2.connect(this.audioContext!.destination);
      
      oscillator2.frequency.setValueAtTime(800, now + 0.4);
      oscillator2.frequency.exponentialRampToValueAtTime(300, now + 0.7);
      oscillator2.type = 'sine';
      
      gainNode2.gain.setValueAtTime(0.15, now + 0.4);
      gainNode2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      
      oscillator2.start(now + 0.4);
      oscillator2.stop(now + 0.7);
    }, 400);
  }

  playConfettiSound() {
    if (!this.initialized || !this.audioContext) return;
    
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);
        
        oscillator.frequency.setValueAtTime(1500 + Math.random() * 500, this.audioContext!.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.04, this.audioContext!.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext!.currentTime + 0.15);
        
        oscillator.start();
        oscillator.stop(this.audioContext!.currentTime + 0.15);
      }, i * 120);
    }
  }

  playPopSound() {
    if (!this.initialized || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.1);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }
}

export default SoundSystem;