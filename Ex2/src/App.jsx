import ScientistDirectory from './components/ScientistDirectory'
import './App.css'

export default function App() {
  return (
    <main className="app">
      <header className="page-header">
        <p className="eyebrow">SCIENTISTS & PIONEERS</p>
        <h1>Brilliant minds, one directory.</h1>
        <p>Explore remarkable people through an interactive directory.</p>
      </header>

      <ScientistDirectory />
    </main>
  )
}