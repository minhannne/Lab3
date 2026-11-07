export class PolyphonicSynth {
  constructor(maxVoices = 8) {
    this.ctx = null;
    this.outputGain = null;
    this.compressor = null;
    this.maxVoices = maxVoices;

    // Map giữ thứ tự thêm vào để thay giọng theo FIFO.
    this.voices = new Map();

    // Theo dõi cả những giọng đang trong giai đoạn nhả âm.
    this.allVoices = new Set();
  }

  ensureContext() {
    if (!this.ctx) {
      this.ctx = new window.AudioContext();

      // Khuếch đại âm lượng chung.
      this.outputGain = this.ctx.createGain();
      this.outputGain.gain.value = 4;

      // Nén tín hiệu lớn khi chơi nhiều nốt đồng thời.
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -12;
      this.compressor.knee.value = 12;
      this.compressor.ratio.value = 12;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.15;

      // Các giọng → khuếch đại → nén → loa.
      this.outputGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch((error) => {
        console.error("Cannot resume audio:", error);
      });
    }

    return this.ctx;
  }

  noteOn(midi, freqHz) {
    const ctx = this.ensureContext();

    // Không tạo thêm oscillator cho nốt đang hoạt động.
    if (this.voices.has(midi)) {
      return { started: false, stolenMidi: null };
    }

    let stolenMidi = null;

    // Đủ số giọng → nhả giọng cũ nhất trước.
    if (this.voices.size >= this.maxVoices) {
      stolenMidi = this.voices.keys().next().value;
      this.noteOff(stolenMidi);
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freqHz, now);

      // Attack: tăng lên mức đỉnh trong 10 ms.
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.14, now + 0.01);

    // Decay: giảm từ mức đỉnh về mức duy trì.
    gain.gain.exponentialRampToValueAtTime(0.1, now + 0.12);

    // Sustain: giữ mức 0.1 đến khi noteOff() thực hiện Release.

    osc.connect(gain);
    gain.connect(this.outputGain);

    const voice = { osc, gain };

    this.voices.set(midi, voice);
    this.allVoices.add(voice);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
      this.allVoices.delete(voice);
    };

    osc.start(now);

    return { started: true, stolenMidi };
  }

  noteOff(midi) {
    const voice = this.voices.get(midi);

    // Gọi nhiều lần cho cùng một nốt vẫn an toàn.
    if (!voice || !this.ctx) return;

    this.voices.delete(midi);

    const now = this.ctx.currentTime;
    const volume = voice.gain.gain;

    // Giữ mức âm hiện tại rồi giảm dần để tránh tiếng click.
    volume.cancelAndHoldAtTime(now);
    volume.exponentialRampToValueAtTime(0.0001, now + 0.04);

    voice.osc.stop(now + 0.045);
  }

  stopAll() {
    for (const midi of this.voices.keys()) {
      this.noteOff(midi);
    }
  }

  async dispose() {
    const ctx = this.ctx;
    const outputGain = this.outputGain;
    const compressor = this.compressor;

    this.ctx = null;
    this.outputGain = null;
    this.compressor = null;
    this.voices.clear();

    // Dừng cả giọng đang phát và giọng đang nhả âm.
    for (const voice of this.allVoices) {
      voice.osc.onended = null;
      voice.osc.stop();
      voice.osc.disconnect();
      voice.gain.disconnect();
    }

    this.allVoices.clear();

    outputGain?.disconnect();
    compressor?.disconnect();

    if (ctx && ctx.state !== "closed") {
      await ctx.close();
    }
  }
}