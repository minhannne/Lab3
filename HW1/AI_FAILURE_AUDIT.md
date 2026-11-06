## Defect 1: ESLint downgrade introduced false unused-variable errors for JSX components

### 1. Defect Description

The AI instructed the user to downgrade ESLint from version 10 to version 9 to resolve a dependency vulnerability without updating the JSX-related lint configuration.

After the downgrade, ESLint incorrectly reported React components as unused even though they were used in JSX.

### 2. Diagnostic Method

Running npm run lint produced the following errors:

'DrumPad' is defined but never used     no-unused-vars
'AudioMeter' is defined but never used  no-unused-vars
'StrictMode' is defined but never used  no-unused-vars
'App' is defined but never used         no-unused-vars

The user provided eslint.config.js. Inspection showed that JSX parsing was enabled, but the configuration lacked a rule to recognize JSX component references as variable usage.

### 3. Root Cause

The AI changed the ESLint version without checking whether the existing configuration remained sufficient.

The resulting ESLint 9 configuration did not correctly recognize component references in JSX for the no-unused-vars check.

### 4. Correction

Install the React ESLint plugin using:

npm install --save-dev eslint-plugin-react

Import the plugin in eslint.config.js using:

import react from 'eslint-plugin-react'

Register the plugin and enable the following rule:

plugins: {
  react,
},
rules: {
  'react/jsx-uses-vars': 'error',
},

Keep the existing recommended configurations and unused-variable checks.

### 5. Verification and Status

The user ran npm run lint, npm run build, and npm audit after updating the configuration.

The user confirmed that all three commands completed without reported errors or warnings.

Status: Fixed.


## Defect 2: Missing meta description in the application document

### 1. Defect Description

The AI provided instructions for implementing the Drum Kit application but did not include a meta description in index.html.

The application worked, but Lighthouse identified the missing description as an SEO failure. The initial SEO score was 82.

### 2. Diagnostic Method

The Lighthouse SEO report displayed:

Document does not have a meta description

The HTML provided by the user contained a title and viewport metadata but did not contain a meta description element.

### 3. Root Cause

The AI focused on the React components, keyboard interactions, audio playback, and accessibility features without reviewing the document metadata required for the Lighthouse target.

As a result, the application document did not include a description of its content.

### 4. Correction

Add the following element inside the head section of the project's root index.html:

<meta
  name="description"
  content="Bộ trống tương tác với 7 âm thanh, hỗ trợ bàn phím, lịch sử đánh trống và đồng hồ đo mức tín hiệu âm thanh."
/>

Update the document title to:

<title>Production Studio Drum Kit</title>

Rebuild the application using npm run build and restart the production preview before running Lighthouse again.

### 5. Verification and Status

After this correction and the robots.txt correction described in Defect 3, the user rebuilt the application and reran Lighthouse.

The user confirmed that the SEO score increased from 82 to 100. No separate intermediate score was recorded for the meta description correction alone.

Status: Fixed.


## Defect 3: Missing robots.txt caused the crawler audit to receive HTML

### 1. Defect Description

The AI did not initially instruct the user to create a robots.txt file.

When Lighthouse requested /robots.txt, the server returned the application's HTML document instead of robots directives.

Lighthouse reported that robots.txt was invalid and contained 14 syntax errors.

### 2. Diagnostic Method

The Lighthouse SEO report displayed:

robots.txt is not valid — 14 errors found

The reported content included:

<!doctype html>
<html lang="en">
<head>

These lines were marked:

Syntax not understood

This showed that the robots.txt audit received HTML rather than robots directives. It did not mean that the application contained 14 HTML syntax errors.

### 3. Root Cause

The AI omitted the crawler configuration file from the initial project instructions.

The observed response was consistent with the server's single-page application fallback returning index.html for the missing /robots.txt path.

### 4. Correction

Create public/robots.txt with the following content:

User-agent: *
Allow: /

Rebuild the application using:

npm run build

Start the production preview using:

npm run preview -- --port 5173 --strictPort

Open http://localhost:5173/robots.txt to check that it returns the two directives instead of HTML, then rerun Lighthouse on the main page.

### 5. Verification and Status

After both SEO corrections were applied and the application was rebuilt, the user confirmed that all four Desktop Lighthouse categories reached 100:

Performance: 100
Accessibility: 100
Best Practices: 100
SEO: 100

Status: Fixed.