/**
 * Web Audio Ambient Soundscapes Synthesizer
 * Generates ocean swells, mountain winds, and singing bowl chimes directly in-browser.
 * Zero external audio files or network requests required.
 */

class AmbientSoundscapes {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.natureGain = null;
    this.intervalId = null;
    this.activeNodes = [];
  }

  init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
  }

  toggle() {
    this.init();
    if (!this.audioCtx) return false;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    const bufferSize = this.audioCtx.sampleRate * 2;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.audioCtx.currentTime);

    const lfo = this.audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.audioCtx.currentTime);
    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.setValueAtTime(220, this.audioCtx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    this.natureGain = this.audioCtx.createGain();
    this.natureGain.gain.setValueAtTime(0.01, this.audioCtx.currentTime);
    this.natureGain.gain.exponentialRampToValueAtTime(0.65, this.audioCtx.currentTime + 3);

    whiteNoise.connect(filter);
    filter.connect(this.natureGain);
    this.natureGain.connect(this.audioCtx.destination);

    whiteNoise.start();
    lfo.start();
    this.activeNodes = [whiteNoise, lfo, this.natureGain];

    this.intervalId = setInterval(() => {
      if (this.isPlaying) this.playZenChime();
    }, 18000);
    this.playZenChime();
  }

  playZenChime() {
    if (!this.audioCtx || !this.isPlaying) return;
    const osc = this.audioCtx.createOscillator();
    const chimeGain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, this.audioCtx.currentTime);
    chimeGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
    chimeGain.gain.exponentialRampToValueAtTime(0.15, this.audioCtx.currentTime + 0.1);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 4.5);
    osc.connect(chimeGain);
    chimeGain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 5);
  }

  stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.natureGain) {
      this.natureGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1);
      setTimeout(() => {
        (this.activeNodes || []).forEach(n => {
          try { n.stop(); } catch (e) {}
        });
      }, 1000);
    }
  }
}

export const soundscapes = new AmbientSoundscapes();
