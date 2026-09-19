/**
 * Romantic Ambient Music Generator using Web Audio API
 * Generates a warm, dreamy music-box / electric piano chime melody without needing external MP3 files.
 */
class RomanticSynthesizer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.step = 0;
    // Pentatonic romantic notes in Hertz: C4, D4, E4, G4, A4, C5, D5, E5
    this.scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
    // Gentle melodic pattern
    this.pattern = [
      0, 2, 4, 7, 4, 2,
      1, 3, 5, 7, 5, 3,
      0, 4, 7, 6, 4, 2,
      3, 5, 7, 5, 3, 1
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
  }

  playTone(freq, duration = 1.2, volume = 0.08) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Dual oscillator for a warm celesta / electric piano bell tone
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.002, now); // subtle shimmer harmonic

    // Warm lowpass filter to remove harshness
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + duration);

    // Bell-like envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(filter);
    filter.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  start() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;
    this.step = 0;

    const playLoop = () => {
      if (!this.isPlaying) return;
      const noteIdx = this.pattern[this.step % this.pattern.length];
      const freq = this.scale[noteIdx];
      this.playTone(freq, 1.4, 0.07);

      // Add a soft bass foundation every 6 notes
      if (this.step % 6 === 0) {
        const rootFreq = (this.scale[noteIdx] || 261.63) / 2;
        this.playTone(rootFreq, 2.5, 0.05);
      }

      this.step++;
      this.timer = setTimeout(playLoop, 380); // Gentle 79 BPM tempo
    };

    playLoop();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

export const musicPlayer = new RomanticSynthesizer();
