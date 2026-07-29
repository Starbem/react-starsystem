import { useState } from 'react'
import { loadStories } from './loadStories'
import { StoryRenderer } from './StoryRenderer'
import { TopBar } from '../../src/components/TopBar'
import { cn } from '../../src/utils/cn'
import { ThemeToggle } from './ThemeToggle'
import type { Theme } from './useTheme'

export interface DocsLayoutProps {
  onBackToHome: () => void
  theme: Theme
  onToggleTheme: () => void
}

export function DocsLayout({ onBackToHome, theme, onToggleTheme }: DocsLayoutProps) {
  const docs = loadStories()
  const [selectedTitle, setSelectedTitle] = useState(docs[0]?.title ?? '')

  const groups = docs.reduce<Record<string, typeof docs>>((acc, doc) => {
    ;(acc[doc.group] ??= []).push(doc)
    return acc
  }, {})

  const selected = docs.find((d) => d.title === selectedTitle)

  return (
    <div className="flex h-screen flex-col overflow-hidden dark:bg-[#0B0F19]">
      <TopBar
        bordered
        className="dark:border-[#1F2937] dark:bg-[#0B0F19]"
        start={
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center rounded-[4px] outline-none focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-1"
          >
            <img src="./brand/starbem-mark.svg" alt="Voltar para a home" className="h-[28px] w-auto" />
          </button>
        }
        center={<span className="text-[16px] font-medium text-[#101828] dark:text-white">Star System</span>}
        end={<ThemeToggle theme={theme} onToggle={onToggleTheme} />}
      />

      <div className="flex flex-1 overflow-hidden">
        <nav className="w-[240px] shrink-0 overflow-y-auto border-r border-[#EAECF0] bg-white p-[16px] dark:border-[#1F2937] dark:bg-[#0B0F19]">
          {Object.entries(groups).map(([group, groupDocs]) => (
            <div key={group} className="mb-[16px]">
              <div className="mb-[4px] text-[11px] font-medium uppercase tracking-wide text-[#667085] dark:text-[#667085]">
                {group}
              </div>
              {groupDocs.map((d) => (
                <button
                  key={d.title}
                  type="button"
                  onClick={() => setSelectedTitle(d.title)}
                  className={cn(
                    'block w-full rounded-[6px] px-[8px] py-[6px] text-left text-[13px] outline-none',
                    'hover:bg-[#F2F4F7] focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-1',
                    'dark:hover:bg-[#1F2937]',
                    d.title === selectedTitle
                      ? 'bg-[#FFF1EB] font-medium text-[#FF5100] dark:bg-[#3A2418]'
                      : 'text-[#344054] dark:text-[#D0D5DD]',
                  )}
                >
                  {d.page}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Page background can go dark: each StoryRenderer wraps its example in
            its own fixed-light card, so components without their own surface
            (e.g. Breadcrumb's bare text) still get correct contrast. */}
        <main className="flex-1 overflow-y-auto bg-white p-[24px] dark:bg-[#0B0F19]">
          {selected ? (
            <>
              <h1 className="mb-[8px] text-[20px] font-semibold text-[#101828] dark:text-white">
                {selected.title}
              </h1>
              {selected.meta.description && (
                <p className="mb-[16px] text-[13px] text-[#667085] dark:text-[#9CA3AF]">
                  {selected.meta.description}
                </p>
              )}
              {selected.stories.map((story) => (
                <StoryRenderer key={`${selected.title}/${story.name}`} doc={selected} story={story} theme={theme} />
              ))}
            </>
          ) : (
            <p className="dark:text-[#D0D5DD]">No stories found.</p>
          )}
        </main>
      </div>
    </div>
  )
}
