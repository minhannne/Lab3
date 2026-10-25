import { useId, useState } from 'react'
import { SMART_PEOPLE } from '../data/smartPeople'

export default function ScientistDirectory({ initialData = SMART_PEOPLE }) {
  const id = useId()
  const [people] = useState(initialData)
  const [query, setQuery] = useState('')
  const [minIq, setMinIq] = useState(160)
  const [sortBy, setSortBy] = useState('iq-desc')

  const visiblePeople = people
    .filter(
      (person) =>
        person.name.toLowerCase().includes(query.trim().toLowerCase()) &&
        person.iq >= minIq,
    )
    .toSorted((a, b) =>
      sortBy === 'iq-desc' ? b.iq - a.iq : a.age - b.age,
    )

  return (
    <section aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>Explore the directory</h2>

      <form
        className="filters"
        role="search"
        aria-label="Filter the directory"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="field">
          <label htmlFor={`${id}-query`}>Search by name</label>
          <input
            id={`${id}-query`}
            type="search"
            placeholder="Try Einstein or An..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor={`${id}-iq`}>Minimum IQ</label>
          <input
            id={`${id}-iq`}
            type="number"
            min="0"
            step="1"
            value={minIq}
            onChange={(event) => {
              const value = event.target.valueAsNumber
              setMinIq(Number.isNaN(value) ? 0 : value)
            }}
          />
        </div>

        <div className="field">
          <label htmlFor={`${id}-sort`}>Sort by</label>
          <select
            id={`${id}-sort`}
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="iq-desc">IQ: highest first</option>
            <option value="age-asc">Age: youngest first</option>
          </select>
        </div>
      </form>

      {visiblePeople.length === 0 && (
        <p className="empty-state">No people match your filters.</p>
      )}

      <ul className="people-list">
        {visiblePeople.map((person) => (
          <li className="person-card" key={person.id}>
            <h3>{person.name}</h3>

            <dl className="person-details">
              <div>
                <dt>Age</dt>
                <dd>{person.age}</dd>
              </div>
              <div>
                <dt>IQ</dt>
                <dd>{person.iq}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </section>
  )
}