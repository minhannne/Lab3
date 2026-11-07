import { memo } from "react";

const PianoKey = memo(function PianoKey({
  midi,
  noteName,
  isBlack,
  isPressed,
  onNoteOn,
  onNoteOff,
}) {
  function handlePointerDown(event) {
    // Chỉ nhận nút chuột trái hoặc thao tác chạm.
    if (event.button !== 0) return;

    // Vẫn nhận sự kiện thả khi con trỏ ra ngoài phím.
    event.currentTarget.setPointerCapture(event.pointerId);
    onNoteOn(midi);
  }

  function handleKeyDown(event) {
    if (event.key !== " " && event.key !== "Enter") return;

    event.preventDefault();

    // Giữ phím không tạo thêm nhiều lần noteOn.
    if (!event.repeat) {
      onNoteOn(midi);
    }
  }

  function handleKeyUp(event) {
    if (event.key !== " " && event.key !== "Enter") return;

    event.preventDefault();
    onNoteOff(midi);
  }

  return (
    <button
      type="button"
      className={[
        "piano-key",
        isBlack ? "black-key" : "white-key",
        isPressed ? "pressed" : "",
      ].join(" ")}
      aria-label={noteName}
      aria-pressed={isPressed}
      onPointerDown={handlePointerDown}
      onPointerUp={() => onNoteOff(midi)}
      onPointerCancel={() => onNoteOff(midi)}
      onLostPointerCapture={() => onNoteOff(midi)}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={() => onNoteOff(midi)}
    >
      <span>{noteName}</span>
    </button>
  );
});

export default PianoKey;