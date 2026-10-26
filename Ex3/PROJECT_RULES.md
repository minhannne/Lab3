# Project Rules — Exercise 3

## 1. Project Scope

- Build a PUBG Vietnam Series Live Telemetry dashboard.
- Use React 19 with Vite.
- Display simulated live telemetry data for PUBG VN esports squads.
- Implement asynchronous data fetching and four request states.
- Demonstrate request cancellation, loading feedback, error handling, and retry behavior.
- Keep components functional and avoid direct DOM manipulation.

## 2. Telemetry Data and API

- Store squad data in `src/data/pubg-vn-telemetry-spec.js`.
- Keep squad IDs consistent between the frontend and the API.
- Include squad name, map, match phase, alive players, kills, win probability, and tactical status.
- Configure the simulated `/api/telemetry` endpoint in `vite.config.js`.
- Read the requested squad ID from the API request.
- Return telemetry data for valid squad IDs.
- Return an appropriate HTTP error status for invalid squad IDs.
- Simulate network latency and occasional request failures for testing.
- Keep the response structure consistent across squads.

## 3. React State Management

- Implement the telemetry interface in `src/components/PubgMatchTelemetry.jsx`.
- Use the four states: `IDLE`, `LOADING`, `SUCCESS`, and `ERROR`.
- Display the appropriate interface for each state.
- Fetch telemetry when the selected squad changes.
- Use `AbortController` to cancel outdated requests.
- Abort requests during effect cleanup.
- Handle `AbortError` without displaying a false error alert.
- Prevent outdated requests from overwriting the latest telemetry state.
- Provide a retry mechanism for failed requests.
- Avoid unnecessary state variables and unused imports.

## 4. Loading and Error Handling

- Display a skeleton UI while telemetry is loading.
- Show telemetry information only when a request succeeds.
- Display a clear error message when a request fails.
- Use an accessible alert for error feedback.
- Provide a retry button that triggers another request.
- Ensure the retry mechanism works after a simulated API failure.
- Do not leave the interface permanently stuck in the loading state.

## 5. Styling and User Interface

- Keep application integration in `src/App.jsx`.
- Use `src/App.css` for dashboard and component styling.
- Use `src/index.css` for global styles and page defaults.
- Maintain a consistent PUBG-inspired visual theme.
- Make squad information and telemetry statistics easy to read.
- Use appropriate visual feedback for loading and error states.
- Keep the layout responsive.
- Avoid unnecessary UI libraries and direct DOM manipulation.

## 6. Asynchronous Request Safety

- Treat squad switching as a possible source of overlapping requests.
- Cancel the previous request when the selected squad changes.
- Ignore aborted requests instead of treating them as API failures.
- Ensure only the latest active request can update the interface.
- Clear pending timers or other request-related resources when appropriate.
- Handle non-successful HTTP responses explicitly.

## 7. Verification

- Run `npm run lint` and resolve reported errors.
- Run `npm run build` and confirm successful compilation.
- Test successful telemetry requests for different squads.
- Switch squads quickly and inspect requests in DevTools Network.
- Verify that outdated requests are cancelled or ignored.
- Test the loading skeleton.
- Test the error alert and retry button.
- Use browser DevTools to simulate network conditions and failures.
- Inspect the layout using Lighthouse and check Cumulative Layout Shift (CLS).
- Report only checks that were actually performed.
- Do not claim that all network or performance scenarios pass unless they have been tested.

## 8. Git Workflow

- Follow `DECOMPOSITION.md`.
- Preserve the two required implementation commits:

  1. `feat(ex3): implement PUBG VN 4-state telemetry & AbortController`
  2. `feat(ex3): add skeleton UI & retry alert`

- Review staged files before committing.
- Track source files, required configuration files, and `package-lock.json`.
- Keep `node_modules`, `dist`, and environment secrets out of Git.
- Maintain `.gitignore`.
- Do not commit API keys, passwords, or other credentials.
- Keep commits focused on the required implementation tasks.
