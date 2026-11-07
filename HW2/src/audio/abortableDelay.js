export function abortableDelay(ms, signal) {
  return new Promise((resolve, reject) => {
    // Đã bị hủy từ trước thì không tạo timer.
    if (signal?.aborted) {
      reject(new DOMException("Playback aborted", "AbortError"));
      return;
    }

    function cleanup() {
      signal?.removeEventListener("abort", handleAbort);
    }

    function handleAbort() {
      clearTimeout(timer);
      cleanup();

      reject(new DOMException("Playback aborted", "AbortError"));
    }

    const timer = setTimeout(() => {
      cleanup();
      resolve();
    }, Math.max(0, ms));

    signal?.addEventListener("abort", handleAbort, { once: true });
  });
}