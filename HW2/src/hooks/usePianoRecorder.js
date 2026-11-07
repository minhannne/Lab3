import { useCallback, useRef, useState } from "react";
import { AudioTaskQueue } from "../audio/AudioTaskQueue";
import { midiToFrequency } from "../pianoNotes";

export function usePianoRecorder() {
  const queueRef = useRef(null);

  if (queueRef.current === null) {
    queueRef.current = new AudioTaskQueue();
  }

  const recordingRef = useRef(false);
  const tasksRef = useRef([]);
  const pendingRef = useRef(new Map());
  const lastStartRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [noteCount, setNoteCount] = useState(0);

  const startRecording = useCallback(() => {
    if (recordingRef.current) return;

    queueRef.current.clear();
    tasksRef.current = [];
    pendingRef.current.clear();
    lastStartRef.current = null;

    recordingRef.current = true;
    setIsRecording(true);
    setNoteCount(0);
  }, []);

  const recordNoteOn = useCallback((midi) => {
    if (!recordingRef.current) return;
    if (pendingRef.current.has(midi)) return;

    const now = performance.now();

    const task = {
      midi,
      freqHz: midiToFrequency(midi),
      durationMs: 0,

      // Nốt đầu tiên bắt đầu ngay khi phát lại.
      deltaMs:
        lastStartRef.current === null
          ? 0
          : now - lastStartRef.current,
    };

    lastStartRef.current = now;

    // Lưu theo thứ tự NHẤN, không phụ thuộc thứ tự THẢ.
    tasksRef.current.push(task);
    pendingRef.current.set(midi, { task, startedAt: now });

    setNoteCount(tasksRef.current.length);
  }, []);

  const recordNoteOff = useCallback((midi) => {
    if (!recordingRef.current) return;

    const pending = pendingRef.current.get(midi);
    if (!pending) return;

    pending.task.durationMs = Math.max(
      1,
      performance.now() - pending.startedAt,
    );

    pendingRef.current.delete(midi);
  }, []);

  const stopRecording = useCallback(() => {
    if (!recordingRef.current) return;

    const now = performance.now();

    // Nếu dừng ghi khi vẫn giữ phím, chốt thời lượng tại đây.
    for (const { task, startedAt } of pendingRef.current.values()) {
      task.durationMs = Math.max(1, now - startedAt);
    }

    pendingRef.current.clear();
    recordingRef.current = false;

    // Đưa các nốt vào FIFO theo đúng thứ tự bắt đầu.
    queueRef.current.clear();

    for (const task of tasksRef.current) {
      queueRef.current.enqueue(task);
    }

    setIsRecording(false);
    setNoteCount(queueRef.current.size);
  }, []);

  return {
    queueRef,
    isRecording,
    noteCount,
    startRecording,
    stopRecording,
    recordNoteOn,
    recordNoteOff,
  };
}