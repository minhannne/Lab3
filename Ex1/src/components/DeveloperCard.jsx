import { Fragment, useId, useState } from 'react'
import SkillBadge from './SkillBadge'
import styles from './DeveloperCard.module.css'

export default function DeveloperCard({
  fullName = 'Tran Vinh Khiem',
  role = 'Senior Systems Architect · UIT SST',
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240',
  metrics = {
    commits: 512,
    vdomNodes: 0,
    a11yScore: 100,
  },
  skills = [
    { id: 'sk-1', name: 'React 19', level: 'Advanced' },
    { id: 'sk-2', name: 'Semantic HTML', level: 'Advanced' },
    { id: 'sk-3', name: 'Competitive Gaming', level: 'Expert' },
  ],
}) {
  const headingId = useId()
  const [failedAvatarUrl, setFailedAvatarUrl] = useState(null)

  const initials = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?'

  const showAvatar =
    typeof avatarUrl === 'string' &&
    avatarUrl.startsWith('https://') &&
    failedAvatarUrl !== avatarUrl

  return (
    <article className={styles.card} aria-labelledby={headingId}>
      <header className={styles.header}>
        {showAvatar ? (
          <img
            className={styles.avatar}
            src={avatarUrl}
            alt={`Portrait of ${fullName}`}
            width={64}
            height={64}
            onError={() => setFailedAvatarUrl(avatarUrl)}
          />
        ) : (
          <span
            className={`${styles.avatar} ${styles.initials}`}
            role="img"
            aria-label={`Avatar of ${fullName}`}
          >
            {initials}
          </span>
        )}

        <hgroup>
          <h2 id={headingId}>{fullName}</h2>
          <p>{role}</p>
        </hgroup>
      </header>

      <dl className={styles.metrics}>
        {Object.entries(metrics).map(([key, value]) => (
          <Fragment key={key}>
            <dt>{key}</dt>
            <dd>{value}</dd>
          </Fragment>
        ))}
      </dl>

      <ul className={styles.skills} aria-label="Skills">
        {skills.map((skill) => (
          <li key={skill.id}>
            <SkillBadge name={skill.name} level={skill.level} />
          </li>
        ))}
      </ul>
    </article>
  )
}