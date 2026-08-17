/**
 * 3D GALAXY PORTFOLIO - WEB AUDIO SYNTHESIZER
 * Zero external audio files required! 100% Web Audio API procedural generation.
 * Generates ambient deep space drones, holographic UI SFX, and warp effects.
 */

class CosmicAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.isPlaying = false;
    this.ambientGain = null;
    this.droneOscillators = [];
    this.noiseNode = null;
    this.filterNode = null;

    // Load initial preference if saved
    const savedMute = localStorage.getItem('galaxy_audio_muted');
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }
  }

  // Initialize Audio Context on first user interaction
  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.setupMasterBus();
      this.setupAmbientDrone();
    } catch (e) {
      console.warn("Web Audio API is not supported or was blocked.", e);
    }
  }

  setupMasterBus() {
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  setupAmbientDrone() {
    if (!this.ctx) return;

    // Ambient Master Gain
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    this.ambientGain.connect(this.masterGain);

    // Cosmic frequencies (Harmonic chords in D minor celestial scale)
    const frequencies = [55.00, 110.00, 164.81, 220.00, 329.63]; // D1, D2, E3, A3, E4

    frequencies.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

      osc.type = i === 0 ? 'sine' : (i % 2 === 0 ? 'triangle' : 'sine');
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Subtle frequency detune for warm cosmic chorus
      const detuneLFO = this.ctx.createOscillator();
      const detuneGain = this.ctx.createGain();
      detuneLFO.frequency.setValueAtTime(0.1 + i * 0.05, this.ctx.currentTime);
      detuneGain.gain.setValueAtTime(3 + i, this.ctx.currentTime);
      detuneLFO.connect(detuneGain);
      detuneGain.connect(osc.detune);
      detuneLFO.start();

      gain.gain.setValueAtTime(0.03 / (i + 1), this.ctx.currentTime);

      if (panner) {
        panner.pan.setValueAtTime((i % 2 === 0 ? -0.4 : 0.4), this.ctx.currentTime);
        osc.connect(gain).connect(panner).connect(this.ambientGain);
      } else {
        osc.connect(gain).connect(this.ambientGain);
      }

      osc.start();
      this.droneOscillators.push(osc);
    });

    // Cosmic wind noise layer
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter noise into deep cosmic wind
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(250, this.ctx.currentTime);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.02, this.ctx.currentTime);

    whiteNoise.connect(this.filterNode).connect(noiseGain).connect(this.ambientGain);
    whiteNoise.start();
  }

  // Toggle Mute State
  toggleMute() {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    localStorage.setItem('galaxy_audio_muted', this.isMuted);

    const targetGain = this.isMuted ? 0 : 1;
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.3);

    return !this.isMuted;
  }

  // Sci-Fi Hologram Hover Beep
  playHoverSound() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1600, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain).connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch (e) {}
  }

  // Sci-Fi Hologram Click Sound
  playClickSound() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(240, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain).connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch (e) {}
  }

  // Warp Speed Engine Travel Whoosh
  playWarpSound() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.4);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.9);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(3000, this.ctx.currentTime + 0.4);
      filter.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 0.9);

      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.9);

      osc.connect(filter).connect(gain).connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.95);
    } catch (e) {}
  }
}

// Global instance
window.cosmicAudio = new CosmicAudioEngine();
