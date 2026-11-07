# Task Decomposition

## Project Information

- Project: 88-Key Polyphonic Piano & Concurrent FIFO Sequencer
- Directory: Lab3/HW2
- Technologies: React, Vite, JavaScript, Web Audio API

## 1. Project Setup

### Tasks
- Initialize a React project using Vite.
- Install project dependencies.
- Start the development server.
- Replace the starter interface with the piano application.

### Acceptance Criteria
- The application starts successfully.
- The piano page loads in the browser.

### Status
Completed and confirmed through manual testing.

## 2. Algorithmic 88-Key Generation

### File
src/pianoNotes.js

### Tasks
- Generate 88 MIDI notes from 21 to 108.
- Derive note names and octave numbers.
- Identify white and black keys.
- Calculate frequencies using:
  f = 440 * 2 ** ((midi - 69) / 12)
- Generate keys without hardcoding 88 elements.

### Acceptance Criteria
- The keyboard starts at A0 and ends at C8.
- There are 52 white keys and 36 black keys.
- There are 88 keys in total.

### Status
Completed. The user confirmed the displayed key counts.

## 3. Piano Key Component and Layout

### Files
- src/components/PianoKey.jsx
- src/App.css
- src/index.css

### Tasks
- Create a reusable PianoKey component.
- Position black keys between white keys.
- Add horizontal scrolling.
- Display pressed states.
- Add accessible note labels and aria-pressed.
- Handle pointer press, release, and cancellation.
- Capture the pointer to receive release events outside the key.
- Support Space and Enter on focused piano buttons.

### Acceptance Criteria
- The keyboard has the correct visual layout.
- Pressed keys change appearance.
- Releasing the pointer outside the key stops its note.

### Status
Implemented. Basic layout and pointer-release behavior were
confirmed through manual testing.

## 4. Polyphonic Audio Engine

### File
src/audio/PolyphonicSynth.js

### Tasks
- Create AudioContext lazily after user interaction.
- Create an oscillator and GainNode for each voice.
- Track active voices with an insertion-ordered Map.
- Limit active voices to eight.
- Release the oldest voice when a ninth note starts.
- Implement an ADSR envelope.
- Add shared output gain and compression.
- Disconnect finished oscillators.
- Stop voices and close AudioContext during disposal.

### Acceptance Criteria
- Notes produce audible sound.
- Up to eight active voices can play together.
- The ninth note replaces the oldest active voice.
- Note release uses a short gain ramp before oscillator stop.

### Status
Implemented. Audio volume and FIFO voice stealing were
confirmed through manual testing.

### Note
Released voices have short fading tails, which may briefly
overlap newly started voices.

## 5. Computer Keyboard and Input Ownership

### Files
- src/hooks/usePianoKeyboard.js
- src/App.jsx

### Tasks
- Map computer keyboard keys to notes from C4 to E5.
- Ignore repeated keydown events.
- Avoid triggering notes while typing in editable fields.
- Release held keyboard notes when the window loses focus.
- Track input sources separately for each MIDI note.
- Keep a note active while any registered source still holds it.
- Clear input ownership when stopping or resetting a session.

### Acceptance Criteria
- A, D, and G can produce a three-note chord.
- Releasing the mouse does not stop a note still held
  by the computer keyboard.
- Releasing the final input source stops the note.

### Status
Completed. Chord playback and the mouse/keyboard ownership
fix were confirmed by the user.

## 6. React.memo Render Isolation

### Files
- src/components/PianoKey.jsx
- src/App.jsx

### Tasks
- Wrap PianoKey with React.memo.
- Stabilize note callbacks using useCallback.
- Pass each key its own boolean isPressed value.
- Inspect component updates using React DevTools Profiler.

### Acceptance Criteria
- A single-key press or release updates the affected PianoKey.
- Unchanged PianoKey components skip rendering.
- App may still render because it owns the shared state.

### Status
Verified for the inspected commit.

### Evidence
The React DevTools Ranked view showed App and one PianoKey.
The displayed PianoKey render duration was approximately 0.4 ms.

## 7. Abortable Waiting Utility

### File
src/audio/abortableDelay.js

### Tasks
- Implement a Promise-based delay.
- Accept an AbortSignal.
- Reject immediately if the signal is already aborted.
- Clear pending timers when aborted.
- Remove abort listeners after completion or cancellation.

### Acceptance Criteria
- A playback delay can be cancelled before its timer finishes.
- Cancellation produces an AbortError.

### Status
Implemented and exercised through playback cancellation tests.

## 8. FIFO Queue and Concurrent Replay

### File
src/audio/AudioTaskQueue.js

### Tasks
- Store note records containing:
  - midi
  - freqHz
  - durationMs
  - deltaMs
- Preserve note onset order.
- Snapshot the queue before playback.
- Convert recorded notes into note-on and note-off events.
- Schedule overlapping notes without waiting for earlier
  notes to finish.
- Support playback speeds of 0.5×, 1×, and 2×.
- Scale both onset intervals and note durations.
- Prevent simultaneous replay sessions on the same queue.
- Release tracked playback notes when replay ends or is aborted.

### Acceptance Criteria
- Notes replay in their recorded order.
- Playback speed changes timing as expected.
- Stop prevents future scheduled notes from sounding.
- Playback can restart after cancellation.

### Status
Implemented. Basic replay, all three speeds, and cancellation
were confirmed through manual testing.

### Remaining Verification
Explicitly test replay of an overlapping recorded chord.

## 9. Recording Hook

### File
src/hooks/usePianoRecorder.js

### Tasks
- Start a new recording session.
- Replace the previous recording when a new session begins.
- Reserve note records at note-on.
- Record note durations at note-off.
- Calculate deltaMs from the previous note onset.
- Preserve onset order even when release order differs.
- Finalize held notes when recording stops.
- Transfer completed records into AudioTaskQueue.
- Expose recording state and recorded note count.

### Acceptance Criteria
- Recording A → S → D produces three note records.
- Replay reproduces the same order.
- Stopping recording finalizes unfinished note durations.

### Status
Implemented. The three-note recording and replay test passed.

### Remaining Verification
Press two notes in order, release them in reverse order,
and confirm that replay preserves their onset order.

## 10. Application Controls and Lifecycle

### File
src/App.jsx

### Tasks
- Add Start Recording and Stop Recording controls.
- Add Play Recording and Stop Sequence controls.
- Add a playback speed selector.
- Display active voice count, recorded note count, and status.
- Block direct note input during replay.
- Add a deterministic nine-note FIFO test.
- Add a Stop all notes control.
- Abort playback and release notes on window blur.
- Abort pending playback and dispose audio resources on unmount.

### Acceptance Criteria
- Controls are enabled or disabled appropriately.
- Stop works during a sounding note.
- Stop also works during a silent gap before the next note.
- The application returns to Idle after replay or cancellation.

### Status
Implemented. Recording controls, playback speeds, and both
Stop scenarios were confirmed by the user.

### Remaining Verification
Directly check pending playback cancellation and audio resource
cleanup during component unmount.

## 11. Validation and Documentation

### Files
- AI_FAILURE_AUDIT.md
- TASK_DECOMPOSITION.md

### Tasks
- Verify generated key counts and layout.
- Verify single-note and chord playback.
- Verify FIFO voice stealing with nine notes.
- Verify mixed mouse and keyboard input.
- Verify recording and playback speeds.
- Verify cancellation during sound and silence.
- Inspect render isolation using React DevTools Profiler.
- Run npm run lint.
- Run npm run build.
- Document at least three actual implementation failures.

### Validation Results
- Key counts: confirmed.
- Basic sound and chord playback: confirmed.
- Eight-voice FIFO test: confirmed.
- Mixed-input ownership fix: confirmed.
- Basic recording and replay: confirmed.
- Playback speeds: confirmed.
- Stop during sound and silence: confirmed.
- Single-key render isolation: observed in a Profiler screenshot.
- ESLint and build: the user reported no errors.

### Documented Failures
1. Audio output was too quiet.
2. Mouse release stopped a keyboard-held note.
3. A revised envelope omitted the Decay stage.

The first two failures were observed during use.
The third was identified through code review.

## Implementation Order

1. Set up the React project.
2. Generate note data.
3. Build the keyboard interface.
4. Implement the synth and FIFO voice stealing.
5. Connect keyboard input and input ownership.
6. Apply and verify React.memo.
7. Implement abortable delays and replay scheduling.
8. Implement recording.
9. Integrate controls and lifecycle cleanup.
10. Validate behavior and document failures.


## Verification Limits

Testing was performed manually by the user, with selected
Profiler screenshots reviewed during development.

Pending verification items are not confirmed failures.
No automated audio measurements or direct unmount resource
measurements were performed.