# Task Decomposition — Exercise 3

## 1. Project Setup

**Objective:** Set up the React application and its development environment.

- Initialize the React 19 and Vite project.
- Install the required dependencies.
- Configure the project scripts for development, linting, and production builds.
- Organize the source code into components and data modules.
- Configure `.gitignore` to exclude generated files and local secrets.

**Expected result:** The project runs locally and has a clear, maintainable structure.

## 2. Telemetry Data Specification

**Objective:** Define sample telemetry data for PUBG Vietnam Series squads.

- Create `src/data/pubg-vn-telemetry-spec.js`.
- Define stable squad IDs and consistent data fields.
- Include team name, map, match phase, alive players, kills, win probability, and tactical status.
- Export the data for use by the API simulation and React interface.

**Expected result:** Multiple squads can be selected and displayed using a consistent data structure.

## 3. Simulated Telemetry API

**Objective:** Implement an API endpoint that simulates live telemetry requests.

- Configure `/api/telemetry` in `vite.config.js`.
- Accept a squad ID as a request parameter.
- Simulate network latency.
- Return the corresponding squad telemetry for valid requests.
- Return an appropriate HTTP error for an unknown squad.
- Simulate occasional server or packet-loss failures.

**Expected result:** The frontend can experience successful responses, delayed responses, and failures without requiring a real external telemetry service.

## 4. Four-State Telemetry Component

**Objective:** Implement the telemetry request lifecycle in React.

- Create `src/components/PubgMatchTelemetry.jsx`.
- Implement `IDLE`, `LOADING`, `SUCCESS`, and `ERROR` states.
- Fetch telemetry for the selected squad.
- Use `AbortController` to cancel obsolete requests.
- Handle effect cleanup and aborted requests correctly.
- Prevent stale responses from replacing current data.
- Render the correct UI for each state.

**Expected result:** The telemetry component responds correctly to squad selection changes and asynchronous request outcomes.

## 5. Loading Skeleton and Retry UI

**Objective:** Improve the user experience during delayed requests and failures.

- Create a skeleton interface for the loading state.
- Display telemetry information after a successful response.
- Display an error alert when a request fails.
- Add a retry button to initiate another request.
- Ensure the retry button works after an unsuccessful request.
- Style the dashboard in `src/App.css` and `src/index.css`.

**Expected result:** Users receive clear loading feedback and can recover from request failures without reloading the page.

## 6. Application Integration

**Objective:** Integrate the telemetry component into the main application.

- Import `PubgMatchTelemetry` into `src/App.jsx`.
- Render the telemetry dashboard.
- Ensure the application entry point in `src/main.jsx` loads the correct app.
- Verify the Vite development server serves the frontend and simulated API.

**Expected result:** The dashboard and telemetry API work together in the local development environment.

## 7. Testing and Validation

**Objective:** Verify the main functionality and implementation requirements.

- Run `npm run lint`.
- Run `npm run build`.
- Test successful requests for different squads.
- Switch squads rapidly and inspect request cancellation behavior.
- Test the loading state under delayed network conditions.
- Trigger a failed request and verify the error alert.
- Test retry behavior.
- Inspect the page with browser DevTools.
- Run Lighthouse and inspect CLS and other reported performance metrics.

**Expected result:** The application passes linting and production build checks, and its primary telemetry behaviors are verified.

## 8. Git Commits and Deliverables

**Objective:** Maintain the required implementation history and submit the project files.

- Review the staged files before each commit.
- Create the first required implementation commit:

  `feat(ex3): implement PUBG VN 4-state telemetry & AbortController`

- Create the second required implementation commit:

  `feat(ex3): add skeleton UI & retry alert`

- Include the files required to run and build the project.
- Keep generated output, dependencies, and secrets out of version control.
- Confirm the final Git status after committing.

**Expected result:** The Ex3 source code, configuration, and documentation are organized and the two required implementation commits are present.
