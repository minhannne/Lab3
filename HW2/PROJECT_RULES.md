# Project Rules

## 1. Project Scope

Build an 88-Key Polyphonic Piano & Concurrent FIFO Sequencer
using React, JavaScript, Vite, and the Web Audio API.

Required features:
- Algorithmic generation of 88 keys from A0 to C8.
- Eight active voices with FIFO voice stealing.
- Memoized piano keys with isolated rendering.
- Recording and concurrent replay of note sequences.
- Playback speeds of 0.5×, 1×, and 2×.
- Playback cancellation using AbortController.
- Audio and event-listener cleanup.

## 2. Development Workflow

- Implement one logical step at a time.
- Explain each step before requesting user changes.
- Wait for user confirmation before continuing.
- When a test fails, investigate and fix it before proceeding.
- Provide complete replacement files when requested.
- Avoid unrelated changes and unnecessary dependencies.
- Do not claim that a test passed without evidence.

## 3. Project Structure

Keep responsibilities separated:

| File | Responsibility |
| --- | --- |
| src/pianoNotes.js | Note generation and frequency calculation |
| src/components/PianoKey.jsx | Individual memoized piano key |
| src/audio/PolyphonicSynth.js | Voice creation, envelopes, FIFO stealing, and disposal |
| src/audio/abortableDelay.js | Cancellable asynchronous waiting |
| src/audio/AudioTaskQueue.js | Recorded note storage and replay scheduling |
| src/hooks/usePianoKeyboard.js | Computer keyboard input |
| src/hooks/usePianoRecorder.js | Recording state and timing |
| src/App.jsx | Integration, controls, and displayed state |
| src/App.css | Piano and application layout |
| src/index.css | Global styles |

Keep audio scheduling outside the presentation component
where practical.

## 4. Algorithmic Keyboard Rules

- Generate exactly 88 notes using MIDI values 21–108.
- Start at A0 and end at C8.
- Generate 52 white keys and 36 black keys.
- Derive note names and octave numbers from MIDI values.
- Calculate frequency using:
  f = 440 * 2 ** ((midi - 69) / 12)
- Do not hardcode 88 button elements.
- Use MIDI numbers as stable React list keys.

## 5. React State and Rendering Rules

- Use React.memo for PianoKey.
- Use useCallback for shared note handlers.
- Pass each key its own boolean isPressed value.
- Avoid passing newly created objects or callback wrappers
  from App to every PianoKey on each render.
- Update Sets and other React state immutably.
- Keep audio objects and mutable input tracking in refs.
- Keep state updater functions free of audio side effects.
- Do not create AudioContext during React rendering.
- Verify render isolation using React DevTools Profiler.

App may render when shared state changes. Unchanged
PianoKey components should skip rendering.

## 6. Audio Engine Rules

- Create AudioContext lazily after user interaction.
- Resume a suspended context when necessary.
- Reuse the context during the mounted application session.
- Use one oscillator and one GainNode per voice.
- Prevent duplicate active voices for the same MIDI note.
- Track active voices using an insertion-ordered Map.
- Allow at most eight active voices.
- Before starting a ninth voice, release the oldest voice.
- Use the same voice-management logic for live input and replay.
- Keep gain values above zero when using exponential ramps.
- Use shared output gain and compression to manage volume.

Released voices may retain a short fading tail. The eight-voice
limit applies to the active voice pool, with these release tails
documented separately.

## 7. Envelope and Cleanup Rules

- Include Attack, Decay, Sustain, and Release stages.
- Apply a short release ramp before stopping an oscillator.
- Avoid abruptly cutting gain during normal note release.
- Disconnect oscillator and gain nodes after the voice ends.
- Make repeated noteOff calls harmless.
- Track releasing voices until cleanup is complete.
- On disposal, stop remaining oscillators, disconnect audio
  nodes, and close AudioContext.
- Handle asynchronous cleanup errors explicitly.

## 8. Input Handling Rules

- Support pointer press, release, and cancellation.
- Capture the pointer so release outside a key is received.
- Ignore unsupported mouse buttons.
- Ignore repeated keyboard keydown events.
- Do not trigger mapped notes while typing in editable fields.
- Distinguish computer-keyboard sources from pointer input.
- Track registered input sources separately for each MIDI note.
- Stop a shared note only when its final registered source releases it.
- Clear ownership when a voice is stolen or a session is reset.
- Release held notes when the window loses focus.
- Remove event listeners during hook cleanup.

## 9. Recording Rules

Each recorded note must contain:
- midi
- freqHz
- durationMs
- deltaMs

Timing rules:
- Use performance.now() for recording timestamps.
- Reserve a note record when the note starts.
- Preserve onset order even if release order differs.
- Calculate durationMs when the note ends.
- Calculate deltaMs relative to the previous note onset.
- Start the first replayed note without retaining leading
  silence from the recording session.
- Finalize unfinished durations when recording stops.
- End the recorded duration of a voice when FIFO stealing releases it.
- Start a fresh recording when Start Recording is selected again.
- Do not record replayed notes back into the recording queue.

## 10. FIFO Replay Rules

- Preserve the recorded order of note onsets.
- Snapshot queue contents at the beginning of replay.
- Schedule note-on and note-off events separately.
- Allow recorded notes to overlap.
- Do not wait for one note to finish before scheduling
  the start of another overlapping note.
- Support exactly 0.5×, 1×, and 2× playback speeds.
- Divide onset intervals and durations by playback speed.
- Compare scheduled times against an elapsed-time reference
  to reduce accumulated waiting drift.
- Prevent concurrent replay sessions on the same queue.
- Keep live input blocked during replay.

## 11. Cancellation and Lifecycle Rules

- Give each replay session its own AbortController.
- Pass its AbortSignal to cancellable waits.
- Stop Sequence must cancel pending waits and release voices.
- Cancelling during silence must prevent later notes from starting.
- Release tracked playback notes in a finally block.
- Remove abort listeners and clear timers when waits finish or abort.
- Treat AbortError as expected cancellation.
- Show unexpected playback errors to the user.
- Prevent an old session from changing a newer session's state.
- Abort playback on window blur and component unmount.
- Dispose audio resources when the component unmounts.

## 12. Interface Rules

- Show the generated key counts.
- Show active voice count out of eight.
- Show recording status and recorded note count.
- Provide recording, replay, speed, and Stop controls.
- Disable controls that conflict with the current session.
- Keep the full keyboard reachable through horizontal scrolling.
- Provide visible pressed and keyboard-focus states.
- Use meaningful button labels and accessible note names.
- Keep the deterministic FIFO test available for verification.

## 13. Validation Rules

Perform checks appropriate to each feature:

- Confirm 88 keys: 52 white and 36 black.
- Check basic note-on and note-off behavior.
- Check pointer release outside a key.
- Check keyboard chord playback.
- Check mixed mouse and keyboard ownership.
- Play nine notes and verify FIFO replacement.
- Record and replay a simple sequence.
- Record and replay overlapping notes.
- Check that reverse release order does not change onset order.
- Check all three replay speeds.
- Stop during a note and during a silent gap.
- Restart replay after cancellation.
- Inspect a single-key update using React DevTools Profiler.
- Check cancellation and audio cleanup on unmount.
- Run npm run lint and npm run build.

Rerun affected checks after relevant fixes. Mark unperformed
checks as pending instead of reporting them as passed.

## 14. AI Failure Audit Rules

Maintain AI_FAILURE_AUDIT.md throughout development.

For each actual failure, document:
- Observed behavior or code-review finding.
- Expected behavior.
- Root cause.
- Relevant files.
- Attempted fixes, including unsuccessful attempts.
- Final correction.
- Verification result.
- Lesson learned.

Additional rules:
- Document at least three distinct actual failures.
- Never invent failures to meet the required count.
- Do not count repeated attempts at the same issue as separate failures.
- Distinguish user-observed defects from code-review findings.
- Do not treat normal setup choices as failures.
- Keep unresolved issues clearly marked.

## 15. Documentation and Completion Rules

Maintain:
- PROJECT_RULES.md
- TASK_DECOMPOSITION.md
- AI_FAILURE_AUDIT.md

Documentation must reflect the implemented behavior and available evidence.

Before declaring the project complete:
- Review the assignment requirements.
- Complete remaining required verification.
- Resolve known blocking failures.
- Confirm lint and build results.
- Retain useful Profiler evidence.
- Record any remaining limitations honestly.

This file defines project expectations. It does not, by itself,
prove that every requirement has been tested.