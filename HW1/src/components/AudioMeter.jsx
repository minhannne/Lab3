import { useEffect, useState } from 'react';

export default function AudioMeter({ analyser }) {
  const [level, setLevel] = useState(-60);

  useEffect(() => {
    if (!analyser) return;

    const samples = new Float32Array(analyser.fftSize);
    let frameId;
    let lastUpdate = 0;

    function measure(time) {
      // Cập nhật khoảng 10 lần mỗi giây.
      if (time - lastUpdate >= 100) {
        analyser.getFloatTimeDomainData(samples);

        let sum = 0;

        for (let i = 0; i < samples.length; i += 1) {
          sum += samples[i] * samples[i];
        }

        // RMS biểu diễn mức tín hiệu trong khoảng lấy mẫu.
        const rms = Math.sqrt(sum / samples.length);

        // Đổi sang dBFS, giới hạn hiển thị từ -60 đến 0.
        const decibels = rms > 0 ? 20 * Math.log10(rms) : -60;
        const nextLevel = Math.max(-60, Math.min(0, decibels));

        setLevel(Math.round(nextLevel));
        lastUpdate = time;
      }

      frameId = requestAnimationFrame(measure);
    }

    frameId = requestAnimationFrame(measure);

    return () => cancelAnimationFrame(frameId);
  }, [analyser]);

  const displayedLevel = analyser ? level : -60;

  return (
    <section className="audio-meter" aria-labelledby="meter-heading">
      <h2 id="meter-heading">Mức tín hiệu âm thanh</h2>

      <label htmlFor="sound-level">
        Mức hiện tại: {displayedLevel <= -60 ? '≤ -60' : displayedLevel} dBFS
      </label>

      <meter
        id="sound-level"
        min={-60}
        max={0}
        value={displayedLevel}
      />

      <p>
        Thang đo từ -60 đến 0 dBFS. Giá trị càng gần 0,
        mức tín hiệu càng cao.
      </p>
    </section>
  );
}