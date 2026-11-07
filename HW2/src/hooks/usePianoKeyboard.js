import { useEffect } from "react";

// Các phím tương ứng với các nốt từ C4 đến E5.
const KEY_TO_MIDI = {
  KeyA: 60,
  KeyW: 61,
  KeyS: 62,
  KeyE: 63,
  KeyD: 64,
  KeyF: 65,
  KeyT: 66,
  KeyG: 67,
  KeyY: 68,
  KeyH: 69,
  KeyU: 70,
  KeyJ: 71,
  KeyK: 72,
  KeyO: 73,
  KeyL: 74,
  KeyP: 75,
  Semicolon: 76,
};

export function usePianoKeyboard(onNoteOn, onNoteOff) {
  useEffect(() => {
    const heldKeys = new Set();

    function handleKeyDown(event) {
      const target = event.target;

      // Không chơi đàn khi đang nhập liệu.
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest("input, textarea, select"))
      ) {
        return;
      }

      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const midi = KEY_TO_MIDI[event.code];
      if (midi === undefined) return;

      event.preventDefault();

      // Giữ phím chỉ phát một lần.
      if (event.repeat || heldKeys.has(event.code)) return;

      heldKeys.add(event.code);

      // Phân biệt nguồn bàn phím với nguồn chuột.
      onNoteOn(midi, `keyboard:${event.code}`);
    }

    function handleKeyUp(event) {
      if (!heldKeys.delete(event.code)) return;

      const midi = KEY_TO_MIDI[event.code];
      onNoteOff(midi, `keyboard:${event.code}`);
    }

    function releaseHeldKeys() {
      for (const code of heldKeys) {
        const midi = KEY_TO_MIDI[code];
        onNoteOff(midi, `keyboard:${code}`);
      }

      heldKeys.clear();
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", releaseHeldKeys);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", releaseHeldKeys);
      releaseHeldKeys();
    };
  }, [onNoteOn, onNoteOff]);
}