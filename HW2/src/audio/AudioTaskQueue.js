import { abortableDelay } from "./abortableDelay";

export class AudioTaskQueue {
  constructor() {
    this.tasks = [];
    this.isPlaying = false;
  }

  get size() {
    return this.tasks.length;
  }

  enqueue({ midi, freqHz, durationMs, deltaMs }) {
    this.tasks.push({
      midi,
      freqHz,
      durationMs,
      deltaMs,
    });
  }

  clear() {
    this.tasks = [];
  }

  async play({
    speed = 1,
    signal,
    onNoteOn,
    onNoteOff,
  }) {
    if (this.isPlaying) {
      throw new Error("The queue is already playing.");
    }

    if (![0.5, 1, 2].includes(speed)) {
      throw new Error("Playback speed must be 0.5, 1, or 2.");
    }

    if (signal?.aborted) {
      throw new DOMException("Playback aborted", "AbortError");
    }

    // Chụp lại dữ liệu để lần phát này có nội dung cố định.
    const snapshot = this.tasks.map((task) => ({ ...task }));

    const events = [];
    let startMs = 0;

    for (const task of snapshot) {
      // deltaMs: khoảng cách giữa lần bắt đầu nốt này
      // và lần bắt đầu nốt trước đó.
      startMs += task.deltaMs;

      events.push({
        timeMs: startMs / speed,
        type: "on",
        midi: task.midi,
        freqHz: task.freqHz,
      });

      events.push({
        timeMs: (startMs + task.durationMs) / speed,
        type: "off",
        midi: task.midi,
      });
    }

    // Sắp lịch theo thời điểm.
    // Cùng thời điểm thì thả nốt cũ trước khi phát nốt mới.
    events.sort((a, b) => {
      const timeDifference = a.timeMs - b.timeMs;

      if (timeDifference !== 0) return timeDifference;
      if (a.type === b.type) return 0;

      return a.type === "off" ? -1 : 1;
    });

    const activeCounts = new Map();
    this.isPlaying = true;

    try {
      const playbackStart = performance.now();

      for (const event of events) {
        const elapsed = performance.now() - playbackStart;
        const waitMs = event.timeMs - elapsed;

        await abortableDelay(Math.max(0, waitMs), signal);

        if (event.type === "on") {
          const count = activeCounts.get(event.midi) ?? 0;

          if (count === 0) {
            onNoteOn(event.midi, event.freqHz);
          }

          activeCounts.set(event.midi, count + 1);
        } else {
          const count = activeCounts.get(event.midi) ?? 0;

          if (count <= 1) {
            activeCounts.delete(event.midi);
            onNoteOff(event.midi);
          } else {
            activeCounts.set(event.midi, count - 1);
          }
        }
      }
    } finally {
      // Dù hoàn thành, bị hủy hay gặp lỗi cũng nhả nốt còn lại.
      try {
        for (const midi of activeCounts.keys()) {
          onNoteOff(midi);
        }
      } finally {
        activeCounts.clear();
        this.isPlaying = false;
      }
    }
  }
}