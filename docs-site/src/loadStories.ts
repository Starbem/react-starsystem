import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '../../src/docs-types'

export type LoadedStory = {
  name: string
  args?: Record<string, unknown>
  render?: (args: Record<string, unknown>) => ReactNode
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

  const docs: LoadedComponentDoc[] = []

  for (const mod of Object.values(modules)) {
    const meta = mod.default
    if (!meta?.title) continue

    const [group, ...rest] = meta.title.split('/')
    const page = rest.length > 0 ? rest.join('/') : meta.title

    const stories: LoadedStory[] = Object.entries(mod)
      .filter(([exportName]) => exportName !== 'default')
      .map(([name, story]) => {
        const s = story as StoryObj
        return { name, args: s.args, render: s.render as LoadedStory['render'] }
      })

    docs.push({ title: meta.title, group, page, meta, stories })
  }

  return docs.sort((a, b) => a.title.localeCompare(b.title))
}
