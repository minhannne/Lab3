## Defect 1: Dependency installation attempted before project initialization was confirmed

### 1. Defect Description

The AI instructed the user to run npm install inside the Ex1 directory without confirming that the Vite project had been successfully initialized.

The directory did not contain package.json, so npm install failed with an ENOENT error.

### 2. Diagnostic Method

The terminal reported:

Could not read package.json: Error: ENOENT: no such file or directory, open 'C:\Lab3\Ex1\package.json'

The user then ran dir. The output showed only package-lock.json, confirming that the project files were missing from the target directory.

### 3. Root Cause

The AI treated the user's completion message as confirmation of successful project initialization without checking the generated files or command output.

As a result, the instructions proceeded to dependency installation before the required package.json file existed.

### 4. Correction

Initialize the React project inside Ex1 using:

npm create vite@latest . -- --template react

Choose "Ignore files and continue" when prompted about the existing directory.

After initialization completes, install dependencies with npm install and start the development server with npm run dev.

### 5. Verification and Status

After initializing the project, the user confirmed that the application opened successfully at http://localhost:5173/.

The user later confirmed that npm run lint and npm run build completed without errors.

Status: Fixed.