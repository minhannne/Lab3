# Project Rules — Exercise 2

## 1. Project Goal

Build an interactive Scientist & Pioneer Directory using React.

The directory must support name search, minimum-IQ filtering,
sorting, deletion, restoration, and accessible result announcements.

## 2. Technology and Structure

- Use React with JavaScript and JSX.
- Use Vite for development and production builds.
- Keep the initial dataset in `src/data/smartPeople.js`.
- Implement the directory in `src/components/ScientistDirectory.jsx`.
- Use `src/App.jsx` to compose the page.
- Keep styling in `src/App.css` and `src/index.css`.
- Do not modify files belonging to Ex1.

## 3. Data Contract

Each person must contain:

- `id`: a unique, stable string.
- `name`: a string.
- `age`: a number.
- `iq`: a number.

The initial dataset must contain the six people supplied in the
assignment and one additional person:

- ID: `sp-7`
- Name: An
- Age: 20
- IQ: 180

An's IQ is fictional demonstration data. The other values reproduce
the assignment dataset and are not presented as verified measurements.

Never generate IDs during rendering or use array indexes as keys.

## 4. State and Derived Data

Only independent application data belongs in state:

- `people`
- `query`
- `minIq`
- `sortBy`

Calculate `visiblePeople` directly during rendering.

Do not store the filtered list, sorted list, or result count in state.
Do not use `useEffect` for filtering, sorting, or synchronizing derived data.

Refs may be used for DOM access and focus management.

## 5. Search, Filtering, and Sorting

- Search names without case sensitivity.
- Trim surrounding whitespace from the search query.
- Apply name search and minimum-IQ filtering together.
- Read numeric input through `event.target.valueAsNumber`.
- Convert `NaN` to `0` so the IQ threshold remains numeric.
- Support IQ descending and age ascending.
- Use `toSorted()` to avoid mutating the source array.
- Keep the default minimum IQ at 160.
- Keep the default sort order as IQ descending.

## 6. Delete and Reset

- Delete people by their stable IDs.
- Use a functional state update and `filter()` for deletion.
- Do not mutate existing arrays or person objects.
- Reset must restore all seven original people.
- Reset must clear the search query, restore minimum IQ to 160,
  and restore IQ-descending sorting.
- Use the original initial dataset as the restoration source.

## 7. Accessibility and Focus

- Associate every search, numeric, and sorting control with a label.
- Generate control IDs with `useId()`.
- Render the result count using an `output` element with
  `role="status"` and `aria-live="polite"`.
- Use semantic headings, lists, forms, and buttons.
- Prevent form submission from reloading the page.
- Provide visible keyboard focus indicators.
- Give each Delete button an accessible name containing the person's name.
- When deleting the focused button, move focus to the next Delete
  button, the previous one, or Reset if the list becomes empty.
- Preserve the keys and DOM identity of remaining people.

## 8. User Interface

- Use a responsive card layout.
- Keep text, controls, and action buttons readable.
- Display an empty-state message when no people match.
- Keep the result count synchronized with the visible list.
- Ensure all interactive features work with the keyboard.

## 9. Verification

Verify the following:

- The initial directory contains seven people.
- Searching `EINSTEIN` finds Albert Einstein.
- Surrounding spaces do not change the search result.
- Minimum IQ 200 with an empty query shows three people.
- Age ascending places An first.
- Deleting Johann Goethe reduces the initial count to six.
- Keyboard focus remains usable after deletion.
- Reset restores all seven people and the default filters.
- An unmatched search displays zero results and an empty-state message.
- `npm run lint` completes without errors.
- `npm run build` completes successfully.

The assignment also requests React DevTools Profiler verification
for a single-character search update. This check has not been
performed and must not be reported as passed.

A functional demonstration video does not verify the Profiler result.

## 10. Git Commit Requirements

Maintain three separate implementation commits:

1. `feat(ex2): normalize smartPeople schema with stable IDs`
2. `feat(ex2): add search, IQ filter & toSorted`
3. `feat(ex2): add delete/reset & live status`

Commit source code, configuration, package manifests, and lockfiles.

Do not commit `node_modules`, `dist`, `.env`, credentials, or secrets.