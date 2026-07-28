import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '../../src/docs-types'
import { extractStoryCode } from './extractStoryCode'

export type LoadedStory = {
  name: string
  args?: Record<string, unknown>
  render?: (args: Record<string, unknown>) => ReactNode
  code?: string
}

export type LoadedComponentDoc = {
  title: string
  group: string
  page: string
  meta: Meta
  stories: LoadedStory[]
}

type StoryModule = {
  default: Meta
  [exportName: string]: Meta | StoryObj | undefined
}

export function loadStories(): LoadedComponentDoc[] {
  const modules = import.meta.glob<StoryModule>('../../src/components/**/*.stories.tsx', {
    eager: true,
  })
  const sources = import.meta.glob('../../src/components/**/*.stories.tsx', {
    eager: true,
    query: '?raw',
    import: 'default',
  }) as Record<string, string>

  const docs: LoadedComponentDoc[] = []

  for (const [path, mod] of Object.entries(modules)) {
    const meta = mod.default
    if (!meta?.title) continue

    const [group, ...rest] = meta.title.split('/')
    const page = rest.length > 0 ? rest.join('/') : meta.title
    const source = sources[path]

    const stories: LoadedStory[] = Object.entries(mod)
      .filter(([exportName]) => exportName !== 'default')
      .map(([name, story]) => {
        const s = story as StoryObj
        const code = source ? extractStoryCode(source, name) : undefined
        return { name, args: s.args, render: s.render as LoadedStory['render'], code }
      })

    docs.push({ title: meta.title, group, page, meta, stories })
  }

  return docs.sort((a, b) => a.title.localeCompare(b.title))
}
