import { loadStories } from './loadStories'

export function App() {
  const docs = loadStories()
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Star System — Docs</h1>
      <ul>
        {docs.map((d) => (
          <li key={d.title}>
            {d.title} — {d.stories.length} stories
          </li>
        ))}
      </ul>
    </div>
  )
}
