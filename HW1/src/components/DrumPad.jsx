export default function DrumPad({ pad, isActive, onTrigger }) {
  return (
    <button
      type="button"
      className={`drum-pad${isActive ? ' drum-pad--active' : ''}`}
      aria-label={`${pad.name}, phím ${pad.key}`}
      aria-keyshortcuts={pad.key}
      aria-pressed={isActive}
      onClick={() => onTrigger(pad.id)}
      onKeyDown={(event) => {
        // Ngăn giữ Enter hoặc Space làm nút kích hoạt liên tục.
        if (
          event.repeat &&
          (event.code === 'Enter' || event.code === 'Space')
        ) {
          event.preventDefault();
        }
      }}
    >
      <span className="drum-pad__key" aria-hidden="true">
        {pad.key}
      </span>

      <span className="drum-pad__name">
        {pad.name}
      </span>
    </button>
  );
}