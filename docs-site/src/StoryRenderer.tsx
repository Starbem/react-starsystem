import { useState, type ComponentType } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import type { LoadedComponentDoc, LoadedStory } from './loadStories'
import type { Theme } from './useTheme'

type Props = {
  doc: LoadedComponentDoc
  story: LoadedStory
  theme: Theme
}

export function StoryRenderer({ doc, story, theme }: Props) {
  const [args, setArgs] = useState<Record<string, unknown>>({
    ...doc.meta.args,
    ...story.args,
  })
  const [showCode, setShowCode] = useState(false)

  const argTypes = doc.meta.argTypes ?? {}
  const controlKeys = Object.keys(argTypes)
  const Component = doc.meta.component as ComponentType<Record<string, unknown>>

  return (
    <div className="mb-[32px] rounded-[8px] border border-[#e5e5e5] p-[16px] dark:border-[#1F2937] dark:bg-[#151B2C]">
      <h3 className="mb-[12px] text-[14px] font-semibold text-[#101828] dark:text-white">{story.name}</h3>

      {controlKeys.length > 0 && (
        <div className="mb-[16px] flex flex-wrap gap-[12px]">
          {controlKeys.map((key) => {
            const argType = argTypes[key]!
            const value = args[key]

            if (argType.control === 'boolean') {
              return (
                <label key={key} className="text-[12px] text-[#101828] dark:text-[#D0D5DD]">
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
                <label key={key} className="text-[12px] text-[#101828] dark:text-[#D0D5DD]">
                  {key}{' '}
                  <select
                    value={String(value ?? '')}
                    onChange={(e) => setArgs((a) => ({ ...a, [key]: e.target.value }))}
                    className="dark:border-[#1F2937] dark:bg-[#0B0F19] dark:text-white"
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
              <label key={key} className="text-[12px] text-[#101828] dark:text-[#D0D5DD]">
                {key}{' '}
                <input
                  type="text"
                  value={String(value ?? '')}
                  onChange={(e) => setArgs((a) => ({ ...a, [key]: e.target.value }))}
                  className="dark:border-[#1F2937] dark:bg-[#0B0F19] dark:text-white"
                />
              </label>
            )
          })}
        </div>
      )}

      <div className="p-[16px] text-[#101828] dark:text-[#F2F4F7]">
        {story.render ? (
          story.render(args)
        ) : Component ? (
          <Component {...args} />
        ) : null}
      </div>

      {story.code && (
        <div className="mt-[8px]">
          <button
            type="button"
            onClick={() => setShowCode((v) => !v)}
            className={
              showCode
                ? 'rounded-[6px] border border-[#e5e5e5] bg-[#f5f5f5] px-[10px] py-[4px] text-[12px] text-[#101828] dark:border-[#1F2937] dark:bg-[#1F2937] dark:text-white'
                : 'rounded-[6px] border border-[#e5e5e5] bg-white px-[10px] py-[4px] text-[12px] text-[#101828] dark:border-[#1F2937] dark:bg-[#151B2C] dark:text-white'
            }
          >
            {showCode ? 'Hide code' : 'Show code'}
          </button>

          {showCode && (
            <Highlight theme={theme === 'dark' ? themes.vsDark : themes.oneLight} code={story.code.trim()} language="tsx">
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
