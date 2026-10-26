# AI Failure Audit — Exercise 2

## Defect 1: Instructions to modify Ex1 before confirming the active project directory

### 1. Defect Description

The AI instructed the user to replace `src/App.jsx` and create new component and data files while working on the React exercise. The user later discovered that the changes had been made in Ex1 instead of Ex2.

The user had to restore `src/App.jsx` in Ex1 and eventually delete the unwanted changes before restarting the implementation in Ex2.

### 2. Diagnostic Method

The conversation showed that the user explicitly asked how to restore Ex1 to its original state after the AI provided instructions for creating `ScientistDirectory.jsx` and `src/data/smartPeople.js`.

The AI then instructed the user to run:

```bash
git restore --source=HEAD --worktree -- src/App.jsx
git status --short
```

The user subsequently decided to remove the changes and restart the work directly in Ex2.

### 3. Root Cause

The AI did not consistently verify the active project directory before providing file modification instructions.

This allowed the implementation steps to proceed in the wrong exercise folder, risking unintended changes to the previous assignment.

### 4. Correction

Before modifying project files, explicitly confirm that VS Code has opened `C:\Lab3\Ex2`.

Verify the working directory in the terminal:

```powershell
Get-Location
```

Confirm that the current directory contains the expected `package.json` and `src` folder.

Perform all Exercise 2 changes inside Ex2 and avoid modifying Ex1.

### 5. Verification and Status

The user decided to remove the unwanted changes and restart the implementation in Ex2. The subsequent instructions explicitly identified `C:\Lab3\Ex2` as the working directory.

The conversation does not independently confirm the final state of every file in Ex1.

Status: Addressed by restarting in Ex2; final repository state not independently verified.

---

## Defect 2: Incomplete implementation instructions for the required interactive features

### 1. Defect Description

The AI initially provided a `ScientistDirectory.jsx` component that only rendered the seven people from the dataset.

The component did not implement the required interactive features, including name search, minimum-IQ filtering, sorting, deletion, and resetting the directory.

The user later received documentation describing these requirements, but the initial implementation instructions covered only static rendering.

### 2. Diagnostic Method

The initial component contained:

```jsx
{initialData.map((person) => (
  <li className="person-card" key={person.id}>
    <h3>{person.name}</h3>
  </li>
))}
```

The component mapped the initial dataset to list items but did not include state management, search controls, filtering logic, sorting logic, or deletion and reset handlers.

The later `PROJECT_RULES.md` and `DECOMPOSITION.md` contents explicitly identified these features as required functionality.

### 3. Root Cause

The AI focused on displaying the initial dataset before presenting a complete implementation plan for all required features.

Although incremental development is reasonable, the initial instructions did not clearly distinguish the temporary first-stage implementation from the final assignment requirements.

### 4. Correction

Implement the required features incrementally in `ScientistDirectory.jsx`:

- Add React state for the people, search query, minimum IQ, and sorting mode.
- Derive the visible list from the current state.
- Implement case-insensitive name search and minimum-IQ filtering.
- Support IQ-descending and age-ascending sorting with `toSorted()`.
- Add deletion by stable ID and a Reset function.
- Display the result count and an empty-state message.
- Add keyboard-accessible controls and focus management.

Test each feature against the expected results documented in `PROJECT_RULES.md`.

### 5. Verification and Status

The conversation later included a detailed implementation plan and a functional test sequence covering search, filtering, sorting, deletion, and reset.

However, the supplied conversation does not contain the final component source code or sufficient test results to confirm that all features were implemented successfully.

Status: Requirements identified; final implementation and verification not confirmed.

---

## Defect 3: Incorrect assumption that resetting one file would fully restore Ex1

### 1. Defect Description

When the user asked how to restore Ex1, the AI recommended restoring only `src/App.jsx` from the latest Git commit.

However, the conversation also indicated that `ScientistDirectory.jsx` and `src/data/` had been created during the work.

Restoring only `App.jsx` would not remove those additional files or guarantee that Ex1 had returned completely to its original state.

### 2. Diagnostic Method

The AI provided:

```bash
git restore --source=HEAD --worktree -- src/App.jsx
git status --short
```

The accompanying explanation explicitly stated that the newly created `ScientistDirectory.jsx` and `src/data/` would remain.

This confirmed that the proposed operation restored only the specified tracked file rather than the entire project directory.

### 3. Root Cause

The AI treated restoration of the modified entry-point file as the immediate recovery step without first establishing the complete set of changes that needed to be undone.

Although the command was valid for restoring `App.jsx`, it was insufficient by itself to restore the entire exercise to its previous state.

### 4. Correction

First, inspect the working tree:

```bash
git status --short
git diff -- src/App.jsx
```

Restore only the tracked files that should return to their last committed versions:

```bash
git restore --source=HEAD --worktree -- src/App.jsx
```

Inspect the untracked files and directories separately. Remove only the unwanted files after confirming their exact paths and ensuring that they contain no work that needs to be preserved.

Finally, run:

```bash
git status --short
```

Compare the output with the original working-tree state to confirm that the unintended changes have been addressed.

### 5. Verification and Status

The user later stated that they had deleted the unwanted changes and wanted to restart directly in Ex2.

This indicates that the user chose a broader cleanup approach rather than relying solely on restoring `App.jsx`.

The conversation does not include a final `git status --short` output confirming that Ex1 was completely restored.

Status: Recovery approach corrected by restarting; complete restoration not independently verified.