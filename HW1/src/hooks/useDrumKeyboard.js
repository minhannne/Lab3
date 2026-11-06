import { useEffect } from 'react';

export default function useDrumKeyboard(
  padMap,
  onTriggerPad,
  isEnabled = true
) {
  useEffect(() => {
    if (!isEnabled) return;

    // Ghi nhớ các phím đang được giữ.
    const pressedKeys = new Set();

    function onKeyDown(event) {
      // Không kích hoạt liên tục khi giữ phím.
      if (event.repeat || pressedKeys.has(event.code)) return;

      // Không đánh trống khi đang nhập liệu.
      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (target.closest('input, textarea, select') ||
          target.isContentEditable)
      ) {
        return;
      }

      // Không ảnh hưởng các tổ hợp như Ctrl + S.
      if (event.ctrlKey || event.altKey || event.metaKey) return;

      // Dùng vị trí phím vật lý, ví dụ KeyW.
      const pad = padMap.get(event.code);

      if (!pad) return;

      event.preventDefault();
      pressedKeys.add(event.code);
      onTriggerPad(pad.id);
    }

    function onKeyUp(event) {
      pressedKeys.delete(event.code);
    }

    function onBlur() {
      pressedKeys.clear();
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);

    // Gỡ các listener khi component bị tháo hoặc effect chạy lại.
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [padMap, onTriggerPad, isEnabled]);
}