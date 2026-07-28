import { useState, type ComponentType } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
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
  const [showCode, setShowCode] = useState(false)

  const argTypes = doc.meta.argTypes ?? {}
  const controlKeys = Object.keys(argTypes)
  const Component = doc.meta.component as ComponentType<Record<string, unknown>>

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

      <div style={{ padding: 16 }}>
        {story.render ? (
          story.render(args)
        ) : Component ? (
          <Component {...args} />
        ) : null}
      </div>

      {story.code && (
        <div style={{ marginTop: 8 }}>
          <button
            type="button"
            onClick={() => setShowCode((v) => !v)}
            style={{
              fontSize: 12,
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid #e5e5e5',
              background: showCode ? '#f5f5f5' : '#fff',
              cursor: 'pointer',
            }}
          >
            {showCode ? 'Hide code' : 'Show code'}
          </button>

          {showCode && (
            <Highlight theme={themes.oneLight} code={story.code.trim()} language="tsx">
              {({ style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  style={{
                    ...style,
                    marginTop: 8,
                    padding: 16,
                    borderRadius: 8,
                    overflowX: 'auto',
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      {line.map((token, tokenIdx) => (
                        <span key={tokenIdx} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          )}
        </div>
      )}
    </div>
  )
}
