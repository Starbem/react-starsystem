import { useState } from 'react'
import { loadStories } from './loadStories'
import { StoryRenderer } from './StoryRenderer'
import { TopBar } from '../../src/components/TopBar'
import { cn } from '../../src/utils/cn'

export interface DocsLayoutProps {
  onBackToHome: () => void
}

export function DocsLayout({ onBackToHome }: DocsLayoutProps) {
  const docs = loadStories()
  const [selectedTitle, setSelectedTitle] = useState(docs[0]?.title ?? '')

  const groups = docs.reduce<Record<string, typeof docs>>((acc, doc) => {
    ;(acc[doc.group] ??= []).push(doc)
    return acc
  }, {})

  const selected = docs.find((d) => d.title === selectedTitle)

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar
        bordered
        start={
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center rounded-[4px] outline-none focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-1"
          >
            <img src="./brand/starbem-mark.svg" alt="Voltar para a home" className="h-[28px] w-auto" />
          </button>
        }
        center={<span className="text-[16px] font-medium text-[#101828]">Star System</span>}
      />

      <div className="flex flex-1 overflow-hidden">
        <nav className="w-[240px] shrink-0 overflow-y-auto border-r border-[#EAECF0] bg-white p-[16px]">
          {Object.entries(groups).map(([group, groupDocs]) => (
            <div key={group} className="mb-[16px]">
              <div className="mb-[4px] text-[11px] font-medium uppercase tracking-wide text-[#667085]">
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
                    d.title === selectedTitle ? 'bg-[#FFF1EB] font-medium text-[#FF5100]' : 'text-[#344054]',
                  )}
                >
                  {d.page}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <main className="flex-1 overflow-y-auto p-[24px]">
          {selected ? (
            <>
              <h1 className="mb-[16px] text-[20px] font-semibold text-[#101828]">{selected.title}</h1>
              {selected.stories.map((story) => (
                <StoryRenderer key={`${selected.title}/${story.name}`} doc={selected} story={story} />
              ))}
            </>
          ) : (
            <p>No stories found.</p>
          )}
        </main>
      </div>
    </div>
  )
}
