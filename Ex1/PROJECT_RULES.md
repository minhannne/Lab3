# Project Rules — Exercise 1

## 1. Project Scope

- Build a Semantic Engineer & Pro-Gamer Profile Card.
- Use React 19 with Vite.
- Implement DeveloperCard and reusable SkillBadge components.
- Keep components functional and avoid direct DOM manipulation.

## 2. Semantic HTML

- Do not use div elements inside DeveloperCard.jsx.
- Use article as the profile card container.
- Associate the article with its heading using aria-labelledby.
- Use a unique heading ID for each card instance.
- Use header and hgroup for the avatar, name, and role.
- Use dl, dt, and dd for profile metrics.
- Use ul and li for the skills list.
- Provide an accessible name for the skills list.
- Maintain a logical heading hierarchy.

## 3. Component and Data Rules

- Use ES6 default parameters for component props.
- Render metrics using Object.entries().
- Wrap each dt and dd pair in an explicitly keyed Fragment.
- Use stable skill IDs as list keys.
- Do not use array indexes or random values as list keys.
- Render each skill through the SkillBadge component.
- Keep profile content configurable through props.

## 4. Images and Security

- Use HTTPS URLs for remote avatars.
- Do not load avatars from insecure HTTP URLs.
- Set explicit image width and height attributes.
- Reserve the same dimensions for the avatar fallback.
- Provide meaningful alternative text for avatars.
- Display initials when the avatar is missing or fails to load.
- Never commit credentials, API keys, or environment secrets.

## 5. Styling

- Use DeveloperCard.module.css for card styling.
- Use CSS custom properties for reusable design values.
- Do not use inline style attributes.
- Keep global resets and page layout in src/index.css.
- Avoid unnecessary UI libraries and global component styles.
- Keep text readable with sufficient color contrast.

## 6. Responsive Layout

- Support a viewport width of 375px without horizontal scrolling.
- Allow skill badges to wrap onto multiple lines.
- Allow long names, roles, and metric labels to wrap.
- Include padding and borders in element sizing.
- Do not hide horizontal overflow to conceal layout defects.

## 7. Verification

- Run npm run lint and resolve reported errors.
- Run npm run build and confirm successful compilation.
- Check DeveloperCard.jsx for forbidden div elements.
- Check DeveloperCard.jsx for insecure HTTP URLs.
- Test the avatar fallback.
- Inspect the semantic structure and Accessibility Tree in DevTools.
- Test the layout at a viewport width of 375px.
- Report only checks that were actually performed.
- Do not claim complete accessibility conformance from lint or build alone.

## 8. Git Workflow

- Follow TASK_DECOMPOSITION.md.
- Preserve the two required implementation commits:

  1. feat(ex1): implement semantic DeveloperCard and SkillBadge
  2. style(ex1): add responsive 375px CSS module

- Commit later documentation updates separately.
- Review staged files before committing.
- Track source files, configuration files, and package-lock.json.
- Keep node_modules, dist, and secrets out of Git.
- Maintain .gitignore.