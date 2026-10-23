# Exercise 1 — Task Decomposition

## Commit 1: Semantic components

Commit message:
feat(ex1): implement semantic DeveloperCard and SkillBadge

Tasks:
- Build DeveloperCard and reusable SkillBadge components.
- Use ES6 default parameters for props.
- Use article, header, hgroup, dl, dt, dd, ul, and li.
- Use keyed Fragments when rendering metric pairs.
- Use stable skill IDs as list keys.
- Do not use div tags inside DeveloperCard.jsx.
- Use an HTTPS avatar with explicit width and height.
- Display fallback initials when the avatar is unavailable.
- Render the components in App.jsx.

## Commit 2: Responsive styling

Commit message:
style(ex1): add responsive 375px CSS module

Tasks:
- Style the card using DeveloperCard.module.css.
- Use CSS custom properties.
- Avoid inline styles.
- Support a 375px viewport without horizontal scrolling.
- Maintain readable text and sufficient color contrast.

## Verification

- Run npm run lint and npm run build.
- Check DeveloperCard.jsx for div tags and insecure media URLs.
- Test avatar fallback initials.
- Inspect semantic structure in Chrome DevTools.
- Check the layout at a viewport width of 375px.
- Verify the two implementation commits in Git history.