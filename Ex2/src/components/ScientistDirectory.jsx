import { SMART_PEOPLE } from '../data/smartPeople'

export default function ScientistDirectory({ initialData = SMART_PEOPLE }) {
  return (
    <section aria-labelledby="directory-title">
      <h2 id="directory-title">Explore the directory</h2>

      <ul className="people-list">
        {initialData.map((person) => (
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