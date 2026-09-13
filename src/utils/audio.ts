// Web Audio API sound synthesis for ZenFit
// Provides zen singing bowls, workout timer ticks, and calming ambient white noise

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientSource: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play Tibetan / Zen Singing Bowl harmonic tone
  playSingingBowl(enabled: boolean = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const fundamental = 261.63; // Middle C / C4
      const harmonics = [1, 2.76, 5.4, 8.9];
      const gains = [0.4, 0.2, 0.1, 0.05];

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 0.1);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.5);
      masterGain.connect(ctx.destination);

      harmonics.forEach((ratio, i) => {
        const osc = ctx.createOscillator();
        const harmGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundamental * ratio, ctx.currentTime);

        harmGain.gain.setValueAtTime(gains[i], ctx.currentTime);
        osc.connect(harmGain);
        harmGain.connect(masterGain);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 4.5);
      });
    } catch (e) {
      console.warn('Audio playSingingBowl error:', e);
    }
  }

  // Play countdown beep for workout player
  playCountdownBeep(enabled: boolean = true, isLast: boolean = false) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isLast ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(isLast ? 880 : 440, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isLast ? 0.4 : 0.15));

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + (isLast ? 0.4 : 0.15));
    } catch (e) {
      console.warn('Audio playCountdownBeep error:', e);
    }
  }

  // Play gentle bell for breath phase shift
  playBreathBell(enabled: boolean = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // 528Hz DNA/Transformation frequency

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 2.0);
    } catch (e) {
      console.warn('Audio playBreathBell error:', e);
    }
  }

  // Start calming sound generator
  startAmbient(type: 'rain' | 'waves' | 'bowl' | 'forest' = 'rain') {
    const ctx = this.getContext();
    if (!ctx) return;

    this.stopAmbient();

    try {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pink/Brown noise generator
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise filter for deep soothing sound
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Gain compensation
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Filter to simulate ocean / gentle rain
      const filter = ctx.createBiquadFilter();
      if (type === 'waves') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);
      } else {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.Q.setValueAtTime(1.2, ctx.currentTime);
      }

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      this.ambientSource = noise;
      this.ambientGain = gain;
      this.isAmbientPlaying = true;
    } catch (err) {
      console.warn('Start ambient error:', err);
    }
  }

  stopAmbient() {
    try {
      if (this.ambientSource) {
        (this.ambientSource as any).stop?.();
        this.ambientSource.disconnect();
        this.ambientSource = null;
      }
      this.isAmbientPlaying = false;
    } catch (e) {
      // Ignored
    }
  }

  isAmbientActive() {
    return this.isAmbientPlaying;
  }
}

export const sound = new SoundEngine();
