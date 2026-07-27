import { useState } from 'react'
import { loadStories } from './loadStories'
import { StoryRenderer } from './StoryRenderer'

export function App() {
  const docs = loadStories()
  const [selectedTitle, setSelectedTitle] = useState(docs[0]?.title ?? '')

  const groups = docs.reduce<Record<string, typeof docs>>((acc, doc) => {
    ;(acc[doc.group] ??= []).push(doc)
    return acc
  }, {})

  const selected = docs.find((d) => d.title === selectedTitle)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui' }}>
      <nav style={{ width: 220, borderRight: '1px solid #e5e5e5', padding: 16, flexShrink: 0 }}>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>Star System</h2>
        {Object.entries(groups).map(([group, groupDocs]) => (
          <div key={group} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#888', marginBottom: 4 }}>
              {group}
            </div>
            {groupDocs.map((d) => (
              <button
                key={d.title}
                onClick={() => setSelectedTitle(d.title)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '4px 8px',
                  background: d.title === selectedTitle ? '#f0f0f0' : 'transparent',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                {d.page}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
        {selected ? (
          <>
            <h1 style={{ fontSize: 20, marginBottom: 16 }}>{selected.title}</h1>
            {selected.stories.map((story) => (
              <StoryRenderer key={`${selected.title}/${story.name}`} doc={selected} story={story} />
            ))}
          </>
        ) : (
          <p>No stories found.</p>
        )}
      </main>
    </div>
  )
}
