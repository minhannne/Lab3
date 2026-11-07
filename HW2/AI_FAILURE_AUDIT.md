# AI Failure Audit

Project: 88-Key Polyphonic Piano & Concurrent FIFO Sequencer

## Failure 1: Audio output was too quiet

### Detection
During manual testing, the user reported that notes were difficult
to hear without turning the system volume to maximum.

### Cause
The initial per-voice gain was too low for comfortable listening
on the user's audio setup.

### Unsuccessful attempt
Increasing the sustain gain from 0.05 to 0.1 did not sufficiently
improve the perceived volume.

### Fix
Added a shared output GainNode with gain set to 4 and a
DynamicsCompressorNode to control louder signals when playing chords.

Audio routing:
Oscillator → Voice Gain → Output Gain → Compressor → Destination

### Verification
The user confirmed that the revised output volume was audible
at a usable level.

### Lesson
Audio usability must be checked on the actual playback device.
A numerical gain increase alone does not guarantee suitable
perceived loudness.

## Failure 2: Releasing the mouse stopped a keyboard-held note

### Detection
The user held A on the computer keyboard, then pressed and released
the on-screen C4 key with the mouse. The sound stopped even though
A remained held.

### Cause
The initial implementation tracked active notes by MIDI number
without tracking which input sources were holding each note.
Any noteOff event could therefore stop the shared voice.

### Fix
Added a Map of MIDI notes to Sets of input sources in App.jsx.
The keyboard hook now passes identifiers such as "keyboard:KeyA",
while pointer input uses a separate source identifier.

A note is released only after its final registered input source
has released it. Source tracking is cleared when stopping or
resetting playback.

### Verification
The user repeated the keyboard-and-mouse test and confirmed that
C4 continued sounding after mouse release, then stopped when A
was released.

### Lesson
When multiple input methods control the same resource, track
ownership separately from the resource's active state.

## Failure 3: The revised envelope omitted the Decay stage

### Detection
Code review found that the volume-adjustment revision contained
Attack, Sustain, and Release, but no distinct Decay stage.

This was a specification issue found through code inspection,
rather than an audible defect reported by the user.

### Cause
During the volume revision, the envelope was simplified to rise
directly to its sustain level.

### Fix
Added an explicit Attack peak of 0.14 at 10 ms, followed by
Decay to the sustain level of 0.1 at 120 ms.

The existing Release ramp reduces gain to 0.0001 over 40 ms
before stopping the oscillator.

### Verification
The revised code contains all four ADSR stages.
The user completed the edit and continued to the next check.
A separate measurement of the envelope waveform was not performed.

### Lesson
After changing audio levels, recheck the envelope against the
specification so that a usability fix does not remove a required stage.

## Other validation

- The user confirmed 88 generated keys: 52 white and 36 black.
- The user confirmed simultaneous keyboard chord playback.
- The 9-note FIFO test retained 8 active voices and replaced C4,
  the oldest voice.
- Basic recording and replay were confirmed by the user.
- Playback at 0.5×, 1×, and 2× was manually checked.
- Stop was checked during a sounding note and during a silent gap.
- A React DevTools Ranked screenshot showed App and one PianoKey
  rendering in the inspected commit; PianoKey took approximately 0.4 ms.
- The user reported no errors from npm run lint and npm run build.

## Evidence limits

Validation was performed manually by the user, with selected
Profiler screenshots reviewed during the session.
No automated audio measurements or unmount resource measurements
were performed.