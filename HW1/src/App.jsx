import { useCallback, useEffect, useRef, useState } from 'react';
import DrumPad from './components/DrumPad';
import useDrumKeyboard from './hooks/useDrumKeyboard';
import { pads, padMap } from './pads';
import './App.css';
import AudioMeter from './components/AudioMeter';
export default function App() {
  const [activePads, setActivePads] = useState([]);
  const [lastHit, setLastHit] = useState('Chưa có lượt đánh.');
  const [hitCount, setHitCount] = useState(0);
  const [error, setError] = useState('');
const [hitHistory, setHitHistory] = useState([]);
const hitSequence = useRef(0);
const [analyser, setAnalyser] = useState(null);
const audioContextRef = useRef(null);
  const audioMap = useRef(new Map());
  const timers = useRef(new Map());

  useEffect(() => {
    const sounds = audioMap.current;
    const pendingTimers = timers.current;

    // Chuẩn bị âm thanh cho từng trống.
    pads.forEach((pad) => {
      const audio = new Audio(pad.sound);
      audio.preload = 'auto';
      sounds.set(pad.id, audio);
    });

    return () => {
      pendingTimers.forEach((timer) => clearTimeout(timer));
      pendingTimers.clear();

      sounds.forEach((audio) => {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      });

      sounds.clear();
      const context = audioContextRef.current;

if (context && context.state !== 'closed') {
  void context.close();
}

audioContextRef.current = null;
    };
  }, []);

  const triggerPad = useCallback((id) => {
    const pad = pads.find((item) => item.id === id);
    const audio = audioMap.current.get(id);

    if (!pad || !audio) return;
    try {
  // Chỉ tạo AudioContext sau thao tác đầu tiên của người dùng.
  if (!audioContextRef.current) {
    const context = new AudioContext();
    const meterNode = context.createAnalyser();

    meterNode.fftSize = 2048;

    // Đưa âm thanh của cả 7 trống qua bộ đo.
    audioMap.current.forEach((sound) => {
      const source = context.createMediaElementSource(sound);
      source.connect(meterNode);
    });

    // Đưa tín hiệu ra loa.
    meterNode.connect(context.destination);

    audioContextRef.current = context;
    setAnalyser(meterNode);
  }

  // Tiếp tục xử lý âm thanh nếu trình duyệt đang tạm dừng.
  if (audioContextRef.current.state === 'suspended') {
    audioContextRef.current.resume().catch(() => {
      setError('Không thể bật bộ xử lý âm thanh. Hãy tải lại trang.');
    });
  }
} catch {
  setError('Không thể khởi tạo bộ đo âm thanh. Hãy tải lại trang.');
  return;
}

    // Phát lại từ đầu khi đánh cùng một trống.
    audio.currentTime = 0;
    setError('');

    audio.play().catch(() => {
      setError(`Không phát được ${pad.name}. Kiểm tra file ${pad.sound}.`);
    });

    setHitCount((count) => count + 1);
    setLastHit(pad.name);
    hitSequence.current += 1;

const hit = {
  id: hitSequence.current,
  name: pad.name,
  key: pad.key,
};

setHitHistory((current) => [hit, ...current].slice(0, 8));

    // Bật trạng thái trực quan của nút.
    setActivePads((current) => (
      current.includes(id) ? current : [...current, id]
    ));

    // Đánh lại cùng nút sẽ tính lại thời gian hiệu ứng.
    clearTimeout(timers.current.get(id));

    const timer = setTimeout(() => {
      setActivePads((current) => (
        current.filter((activeId) => activeId !== id)
      ));

      timers.current.delete(id);
    }, 150);

    timers.current.set(id, timer);
  }, []);

  useDrumKeyboard(padMap, triggerPad);

  return (
    <main className="studio">
      <h1>Production Studio Drum Kit</h1>

      <p id="drum-instructions">
        Bấm W, A, S, D, J, K, L hoặc nhấp vào nút để đánh trống.
        Bạn cũng có thể dùng Tab để chọn nút, rồi nhấn Enter hoặc Space.
      </p>

      <div
        className="drum-grid"
        role="group"
        aria-label="Bộ trống"
        aria-describedby="drum-instructions"
      >
        {pads.map((pad) => (
          <DrumPad
            key={pad.id}
            pad={pad}
            isActive={activePads.includes(pad.id)}
            onTrigger={triggerPad}
          />
        ))}
      </div>

      <section aria-labelledby="hit-heading">
        <h2 id="hit-heading">Lượt đánh gần nhất</h2>

        <output aria-live="polite" aria-atomic="true">
          {lastHit} — Tổng lượt đánh: {hitCount}
        </output>
        <h3>Lịch sử đánh trống</h3>

{hitHistory.length === 0 ? (
  <p>Chưa có lịch sử.</p>
) : (
  <ol aria-label="8 lượt đánh gần nhất, mới nhất ở đầu">
    {hitHistory.map((hit) => (
      <li key={hit.id}>
        Lượt {hit.id}: {hit.name} — phím {hit.key}
      </li>
    ))}
  </ol>
)}
      </section>
      <AudioMeter analyser={analyser} />
<section aria-labelledby="notes-heading" className="notes">
  <h2 id="notes-heading">Ghi chú buổi tập</h2>

  <label htmlFor="practice-notes">
    Nhập ghi chú của bạn
  </label>

  <p id="notes-help">
    Phím tắt đánh trống được bỏ qua khi bạn nhập trong ô này.
  </p>

  <textarea
    id="practice-notes"
    rows={3}
    aria-describedby="notes-help"
    placeholder="Ví dụ: Luyện nhịp trống trong 10 phút..."
  />
</section>
      {error && <p role="alert">{error}</p>}
    </main>
  );
}