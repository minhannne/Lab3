# Project Rules — HW1 Production Studio Drum Kit

## 1. Project Scope

- Build an interactive Production Studio Drum Kit using React and Vite.
- Provide seven drum pads controlled by W, A, S, D, J, K, and L.
- Support mouse, touch, and keyboard interaction.
- Include audio playback, visual feedback, hit history, and an audio level meter.
- Target WCAG 2.2 AA and Lighthouse scores of 100.
- Keep components functional and manage UI state through React.

## 2. Component and Data Rules

- Define drum configuration in src/pads.js.
- Give each drum a stable ID, name, key label, physical key code, and sound path.
- Use a reusable DrumPad component.
- Keep keyboard handling in useDrumKeyboard.
- Keep audio level rendering in AudioMeter.
- Use stable drum IDs and unique hit IDs as list keys.
- Do not use array indexes or random values as list keys.
- Keep event handlers stable when used as effect dependencies.

## 3. Keyboard Interaction

- Use event.code instead of deprecated keyCode.
- Map KeyW, KeyA, KeyS, KeyD, KeyJ, KeyK, and KeyL.
- Prevent automatic repeated triggers when holding a key.
- Track key releases and clear pressed keys when the window loses focus.
- Ignore drum shortcuts inside input, textarea, select, and editable elements.
- Ignore shortcuts involving Ctrl, Alt, or Meta.
- Call preventDefault only when handling a recognized drum shortcut.
- Preserve native Tab, Enter, and Space behavior.
- Remove event listeners during effect cleanup.

## 4. Semantic HTML and Accessibility

- Use main for the primary application content.
- Maintain a logical heading hierarchy.
- Use native button elements with type="button" for drum pads.
- Give each drum button an accessible name.
- Provide aria-keyshortcuts for the drum shortcuts.
- Expose the active pad state through aria-pressed.
- Provide visible instructions for keyboard operation.
- Display hit updates through an output with aria-live="polite".
- Use an ordered list for recent hit history.
- Associate form controls with visible labels.
- Use a labeled meter element for the audio level.
- Avoid continuous live announcements from the audio meter.
- Display playback errors through an accessible alert.
- Provide visible keyboard focus and avoid keyboard traps.

## 5. Audio and Resource Management

- Store the seven drum sound files in public/sounds.
- Keep sound filenames consistent with src/pads.js.
- Trigger audio only after user interaction.
- Handle rejected audio playback promises.
- Initialize the AudioContext after user interaction.
- Resume the AudioContext when necessary.
- Connect drum audio through the analyser to the audio destination.
- Calculate the meter level from the actual audio signal.
- Label the measurement as dBFS rather than physical sound pressure.
- Pause audio, clear timers, cancel animation frames, and close the AudioContext during cleanup.

## 6. Visual Feedback and Hit History

- Show a temporary visual active state when a drum is triggered.
- Reset the feedback timer when the same drum is triggered again.
- Display the latest hit and total hit count.
- Keep a maximum of eight recent history entries.
- Display the newest history entry first.
- Provide visual feedback alongside audio playback.
- Avoid unnecessary flashing and animation.

## 7. Styling and Responsive Layout

- Keep global resets in src/index.css.
- Keep application and component styles in src/App.css.
- Use a responsive grid for drum pads.
- Support a viewport width of 375px without horizontal scrolling.
- Allow text to wrap without clipping.
- Include padding and borders in element sizing.
- Maintain readable text and sufficient color contrast.
- Keep focus indicators visible against surrounding colors.
- Provide adequately sized interactive targets.
- Do not hide overflow to conceal layout defects.

## 8. Document Metadata and SEO

- Set a descriptive document title in index.html.
- Set the document language to match the main interface language.
- Include a meaningful meta description.
- Keep the viewport meta tag.
- Create a valid public/robots.txt file.
- Confirm that /robots.txt returns crawler directives rather than HTML.
- Edit source files instead of generated files inside dist.
- Rebuild after changing source files used by the production preview.

## 9. Dependencies and Security

- Review dependency warnings using npm audit.
- Check compatibility before changing dependency versions.
- Keep ESLint and @eslint/js versions compatible.
- Configure react/jsx-uses-vars to recognize JSX component references.
- Keep unused-variable checks enabled.
- Do not use npm audit fix --force without reviewing its proposed changes.
- Track package-lock.json for reproducible dependency installation.
- Never commit credentials, API keys, or environment secrets.

## 10. Verification

- Run npm run lint and resolve reported errors.
- Run npm run build and confirm successful compilation.
- Run npm audit and review reported vulnerabilities.
- Test all seven drum pads with mouse and keyboard input.
- Confirm that holding a shortcut triggers only once.
- Confirm that typing in form controls does not trigger drums.
- Test Tab navigation and Enter/Space activation.
- Check focus visibility and the absence of keyboard traps.
- Test live hit announcements with a screen reader.
- Verify the recent hit history and audio meter.
- Test the layout at 375px width and 200% zoom.
- Run Lighthouse against the production preview.
- Record the device mode with Lighthouse results.
- Report only checks that were actually performed.
- Do not claim WCAG 2.2 AA conformance from Lighthouse scores alone.

## 11. Documentation and Git Workflow

- Follow TASK_DECOMPOSITION.md.
- Maintain AI_FAILURE_AUDIT.md with three confirmed defects.
- Record each defect's description, diagnosis, root cause, correction, and verification.
- Distinguish AI guidance errors from third-party dependency vulnerabilities.
- Preserve evidence of the final Lighthouse results.
- Review staged files before committing.
- Track source files, configuration files, public assets, and package-lock.json.
- Keep node_modules, dist, and secrets out of Git.
- Maintain .gitignore.
- Do not claim commits were created unless verified in Git history.