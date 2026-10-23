export default function SkillBadge({
  name = 'Unknown skill',
  level = 'Beginner',
}) {
  return (
    <span>
      <strong>{name}</strong>
      {' · '}
      <span>{level}</span>
    </span>
  )
}