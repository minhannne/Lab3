import { useCallback, useEffect, useRef, useState } from "react";
import PianoKey from "./components/PianoKey";
import { pianoNotes, midiToFrequency } from "./pianoNotes";
import { PolyphonicSynth } from "./audio/PolyphonicSynth";
import { usePianoKeyboard } from "./hooks/usePianoKeyboard";
import { usePianoRecorder } from "./hooks/usePianoRecorder";
import "./App.css";

const whiteKeyCount = pianoNotes.filter((note) => !note.isBlack).length;
const blackKeyCount = pianoNotes.filter((note) => note.isBlack).length;

export default function App() {
  const synthRef = useRef(null);
    const inputOwnersRef = useRef(new Map());
  const playbackControllerRef = useRef(null);
  const playingRef = useRef(false);

  const [pressedNotes, setPressedNotes] = useState(() => new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [error, setError] = useState("");

  const {
    queueRef,
    isRecording,
    noteCount,
    startRecording,
    stopRecording,
    recordNoteOn,
    recordNoteOff,
  } = usePianoRecorder();

  useEffect(() => {
    const synth = new PolyphonicSynth(8);
    synthRef.current = synth;

    function handleWindowBlur() {
      playbackControllerRef.current?.abort();
      stopRecording();
      synth.stopAll();
      setPressedNotes(new Set());
    }

    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("blur", handleWindowBlur);

      playbackControllerRef.current?.abort();
      playbackControllerRef.current = null;
      playingRef.current = false;
      synthRef.current = null;

      synth.dispose().catch((disposeError) => {
        console.error("Cannot dispose audio:", disposeError);
      });
    };
  }, [stopRecording]);

  // Dùng chung cho chơi trực tiếp và phát lại.
  const startVoice = useCallback((midi) => {
    const synth = synthRef.current;
    if (!synth) return null;

    const result = synth.noteOn(midi, midiToFrequency(midi));
    if (!result.started) return result;

    setPressedNotes((previous) => {
      const next = new Set(previous);

      if (result.stolenMidi !== null) {
        next.delete(result.stolenMidi);
      }

      next.add(midi);
      return next;
    });

    return result;
  }, []);

  const releaseVoice = useCallback((midi) => {
    synthRef.current?.noteOff(midi);

    setPressedNotes((previous) => {
      if (!previous.has(midi)) return previous;

      const next = new Set(previous);
      next.delete(midi);
      return next;
    });
  }, []);

    const handleNoteOn = useCallback(
    (midi, source = "pointer") => {
      if (playingRef.current) return;

      const owners = inputOwnersRef.current.get(midi);

      // Nốt đã được giữ: thêm nguồn mới, không phát lại âm.
      if (owners) {
        owners.add(source);
        return;
      }

      const result = startVoice(midi);
      if (!result?.started) return;

      if (result.stolenMidi !== null) {
        inputOwnersRef.current.delete(result.stolenMidi);
        recordNoteOff(result.stolenMidi);
      }

      inputOwnersRef.current.set(midi, new Set([source]));
      recordNoteOn(midi);
    },
    [startVoice, recordNoteOn, recordNoteOff],
  );

  const handleNoteOff = useCallback(
    (midi, source = "pointer") => {
      if (playingRef.current) return;

      const owners = inputOwnersRef.current.get(midi);

      // Bỏ qua sự kiện thả lặp hoặc nguồn không giữ nốt.
      if (!owners || !owners.delete(source)) return;

      // Nguồn khác vẫn giữ → tiếp tục phát âm.
      if (owners.size > 0) return;

      inputOwnersRef.current.delete(midi);
      recordNoteOff(midi);
      releaseVoice(midi);
    },
    [recordNoteOff, releaseVoice],
  );

  usePianoKeyboard(handleNoteOn, handleNoteOff);

  function handleStartRecording() {
    if (playingRef.current) return;

    synthRef.current?.stopAll();
    setPressedNotes(new Set());
    setError("");
    startRecording();
  }

  function handleStopRecording() {
    stopRecording();
    synthRef.current?.stopAll();
    setPressedNotes(new Set());
  }

  async function handlePlay() {
    if (playingRef.current || isRecording || queueRef.current.size === 0) {
      return;
    }

    const controller = new AbortController();
    playbackControllerRef.current = controller;

    playingRef.current = true;
    setIsPlaying(true);
    setError("");

    try {
      const synth = synthRef.current;
      if (!synth) return;

      synth.stopAll();
      setPressedNotes(new Set());

      // Mở âm thanh ngay trong thao tác bấm của người dùng.
      synth.ensureContext();

      await queueRef.current.play({
        speed,
        signal: controller.signal,
        onNoteOn: startVoice,
        onNoteOff: releaseVoice,
      });
    } catch (playbackError) {
      if (
        playbackError.name !== "AbortError" &&
        playbackControllerRef.current === controller
      ) {
        setError(playbackError.message);
      }
    } finally {
      // Chỉ phiên hiện tại được phép cập nhật trạng thái.
      if (playbackControllerRef.current === controller) {
        playbackControllerRef.current = null;
        playingRef.current = false;
        setIsPlaying(false);
        setPressedNotes(new Set());
      }
    }
  }

  function handleStopSequence() {
    playbackControllerRef.current?.abort();
    synthRef.current?.stopAll();
    setPressedNotes(new Set());
  }

  function handleTestFIFO() {
    if (playingRef.current || isRecording) return;

    synthRef.current?.stopAll();
    setPressedNotes(new Set());

    for (let midi = 60; midi <= 68; midi++) {
      handleNoteOn(midi);
    }
  }

  function handleStopAll() {
    stopRecording();
    handleStopSequence();
  }

  return (
    <main className="piano-app">
      <h1>88-Key Polyphonic Piano</h1>

      <p>
        {pianoNotes.length} keys · {whiteKeyCount} white ·{" "}
        {blackKeyCount} black · A0–C8
      </p>

      <p>Active voices: {pressedNotes.size} / 8</p>

      <p>
        A W S E D F T G Y H U J K O L P ; → C4 đến E5
      </p>

      <div className="recorder-controls">
        <button
          type="button"
          onClick={handleStartRecording}
          disabled={isRecording || isPlaying}
        >
          Start Recording
        </button>

        <button
          type="button"
          onClick={handleStopRecording}
          disabled={!isRecording}
        >
          Stop Recording
        </button>

        <label>
          Speed:{" "}
          <select
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
            disabled={isPlaying}
          >
            <option value={0.5}>0.5×</option>
            <option value={1}>1×</option>
            <option value={2}>2×</option>
          </select>
        </label>

        <button
          type="button"
          onClick={handlePlay}
          disabled={isRecording || isPlaying || noteCount === 0}
        >
          Play Recording
        </button>

        <button
          type="button"
          onClick={handleStopSequence}
          disabled={!isPlaying}
        >
          Stop Sequence
        </button>
      </div>

      <p>
        Status: {isRecording ? "Recording" : isPlaying ? "Playing" : "Idle"}
        {" · "}Recorded notes: {noteCount}
      </p>

      {error && <p role="alert">{error}</p>}

      <div className="test-controls">
        <button
          type="button"
          onClick={handleTestFIFO}
          disabled={isRecording || isPlaying}
        >
          Test FIFO: 9 notes
        </button>

        <button type="button" onClick={handleStopAll}>
          Stop all notes
        </button>
      </div>

      <div className="piano-scroll">
        <div className="piano-keyboard">
          {pianoNotes.map((note) => (
            <div
              key={note.midi}
              className={`note-slot ${
                note.isBlack ? "black-slot" : "white-slot"
              }`}
            >
              <PianoKey
                midi={note.midi}
                noteName={note.noteName}
                isBlack={note.isBlack}
                isPressed={pressedNotes.has(note.midi)}
                onNoteOn={handleNoteOn}
                onNoteOff={handleNoteOff}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}