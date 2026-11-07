const NOTE_NAMES = [
  "C", "C#", "D", "D#", "E", "F",
  "F#", "G", "G#", "A", "A#", "B",
];

// Chuyển mã MIDI thành tần số, lấy A4 = 440 Hz làm chuẩn.
export function midiToFrequency(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

// A0 = MIDI 21, C8 = MIDI 108 → tổng cộng 88 phím.
export const pianoNotes = Array.from({ length: 88 }, (_, index) => {
  const midi = 21 + index;
  const name = NOTE_NAMES[midi % 12];
  const octave = Math.floor(midi / 12) - 1;

  return {
    midi,
    noteName: `${name}${octave}`,
    frequency: midiToFrequency(midi),
    isBlack: name.includes("#"),
  };
});