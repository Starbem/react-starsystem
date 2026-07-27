import { useState } from 'react'
import type { LoadedComponentDoc, LoadedStory } from './loadStories'

type Props = {
  doc: LoadedComponentDoc
  story: LoadedStory
}

export function StoryRenderer({ doc, story }: Props) {
  const [args, setArgs] = useState<Record<string, unknown>>({
    ...doc.meta.args,
    ...story.args,
  })

  const argTypes = doc.meta.argTypes ?? {}
  const controlKeys = Object.keys(argTypes)

  const Component = doc.meta.component as React.ComponentType<Record<string, unknown>> | undefined

  return (
    <div style={{ marginBottom: 32, padding: 16, border: '1px solid #e5e5e5', borderRadius: 8 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{story.name}</h3>

      {controlKeys.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          {controlKeys.map((key) => {
            const argType = argTypes[key]!
            const value = args[key]

            if (argType.control === 'boolean') {
              return (
                <label key={key} style={{ fontSize: 12 }}>
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(e) => setArgs((a) => ({ ...a, [key]: e.target.checked }))}
                  />{' '}
                  {key}
                </label>
              )
            }

            if (argType.control === 'select') {
              return (
                <label key={key} style={{ fontSize: 12 }}>
                  {key}{' '}
                  <select
                    value={String(value ?? '')}
                    onChange={(e) => setArgs((a) => ({ ...a, [key]: e.target.value }))}
                  >
                    {argType.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              )
            }

            return (
              <label key={key} style={{ fontSize: 12 }}>
                {key}{' '}
                <input
                  type="text"
                  value={String(value ?? '')}
                  onChange={(e) => setArgs((a) => ({ ...a, [key]: e.target.value }))}
                />
              </label>
            )
          })}
        </div>
      )}

      <div>
        {story.render ? story.render(args) : Component ? <Component {...args} /> : null}
      </div>
    </div>
  )
}
