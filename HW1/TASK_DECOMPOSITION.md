# HW1 — Task Decomposition

## Task 1: Project Setup

- Initialize a React project using Vite inside Lab3/HW1.
- Install dependencies.
- Create src/components, src/hooks, and public/sounds.
- Confirm that the application runs successfully.

## Task 2: Drum Pad Components

- Define seven drums and their sound paths in src/pads.js.
- Map W, A, S, D, J, K, and L to physical key codes.
- Create a reusable DrumPad component.
- Use native button elements.
- Add accessible names and aria-keyshortcuts.
- Represent the active state using aria-pressed.
- Render drum pads using stable IDs as keys.

## Task 3: Keyboard Interaction

- Create the useDrumKeyboard hook.
- Handle keydown and keyup events using event.code.
- Prevent repeated triggers when holding a key.
- Ignore shortcuts inside input, textarea, select, and editable elements.
- Ignore shortcuts involving Ctrl, Alt, or Meta.
- Clear tracked keys when the window loses focus.
- Remove event listeners during cleanup.

## Task 4: Audio Playback

- Add seven drum audio files to public/sounds.
- Prepare audio elements for playback.
- Trigger sounds through mouse clicks and keyboard input.
- Restart the selected sound when triggered again.
- Display accessible error messages when playback fails.
- Release audio resources during cleanup.

## Task 5: Visual Feedback and Hit History

- Highlight a drum pad temporarily when activated.
- Display the latest hit and total hit count.
- Use an output element with aria-live="polite".
- Show the eight most recent hits, newest first.
- Use unique hit IDs as history list keys.
- Clear pending feedback timers during cleanup.

## Task 6: Audio Level Meter

- Create the AudioMeter component.
- Connect drum audio to a Web Audio analyser.
- Calculate the RMS level and convert it to dBFS.
- Display the level between -60 and 0 dBFS.
- Use a labeled native meter element.
- Avoid continuous screen-reader announcements.
- Cancel animation frames and close the AudioContext during cleanup.

## Task 7: Responsive Styling and Accessibility

- Replace the starter CSS with the Drum Kit interface styles.
- Create a responsive drum pad grid.
- Provide visible keyboard focus indicators.
- Maintain readable text and sufficient color contrast.
- Support Tab navigation and Enter/Space activation.
- Add a labeled notes field to test shortcut isolation.
- Check small-screen layouts and browser zoom.

## Task 8: Dependency and Lint Configuration

- Inspect dependency warnings using npm audit.
- Resolve the reported vulnerable dependency chain.
- Align ESLint and @eslint/js versions.
- Configure eslint-plugin-react and react/jsx-uses-vars.
- Keep unused-variable checks enabled.
- Confirm that lint and build complete successfully.

## Task 9: SEO and Lighthouse

- Set a descriptive page title.
- Set the document language to Vietnamese.
- Add a meta description.
- Create a valid public/robots.txt file.
- Build the application and run the production preview.
- Run Lighthouse and inspect failed audits.
- Verify the confirmed Desktop scores of 100 in all four categories.

## Task 10: AI Failure Audit

- Document the JSX unused-variable errors after the ESLint downgrade.
- Document the missing meta description.
- Document the missing robots.txt and HTML fallback response.
- Include the description, diagnostic method, root cause, correction, and verification for each defect.

## Verification

- Run npm run lint, npm run build, and npm audit.
- Test all seven drums with mouse and keyboard input.
- Confirm that holding a shortcut triggers only one hit.
- Confirm that typing in the notes field does not trigger drums.
- Test Tab navigation, Enter/Space activation, and focus visibility.
- Confirm that hit history and the audio meter update correctly.
- Test live hit announcements with a screen reader.
- Check the layout at 375px width and 200% zoom.
- Confirm that /robots.txt returns valid directives.
- Preserve the final Lighthouse results as evidence.
- Complete manual accessibility checks before claiming WCAG 2.2 AA conformance.