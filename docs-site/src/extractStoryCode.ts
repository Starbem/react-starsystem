/**
 * Turns a story into copy-pasteable usage code for the docs site.
 *
 * A story is either:
 * - `render: () => (<JSX/>)` — the author already wrote real usage code.
 *   We extract just that JSX (not the `export const X: Story = { render: ... }`
 *   wrapper around it) from the raw `.stories.tsx` source.
 * - `args: {...}` only, no `render` — the story is config, not code. We
 *   synthesize `<ComponentName prop="value">` from the merged args instead
 *   of showing the internal Story object, which isn't valid usage on its own.
 */

/**
 * Scans forward from `openIdx` (which must point at an opening bracket) and
 * returns the index of its matching closing bracket, or -1 if unbalanced.
 * Tracks string/template-literal/comment boundaries so brackets inside JSX
 * prop strings or comments don't throw off the count.
 */
function scanBalanced(source: string, openIdx: number): number {
  const openChar = source[openIdx]
  const closeChar = openChar === '{' ? '}' : openChar === '(' ? ')' : openChar === '[' ? ']' : undefined
  if (!closeChar) return -1

  let depth = 0
  let inString: '"' | "'" | '`' | null = null
  const templateDepthStack: number[] = []

  for (let j = openIdx; j < source.length; j++) {
    const ch = source[j]

    if (inString) {
      if (ch === '\\') {
        j++
        continue
      }
      if (inString === '`' && ch === '$' && source[j + 1] === '{') {
        templateDepthStack.push(depth)
        depth++
        inString = null
        j++
        continue
      }
      if (ch === inString) inString = null
      continue
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      inString = ch
      continue
    }

    if (ch === '/' && source[j + 1] === '/') {
      while (j < source.length && source[j] !== '\n') j++
      continue
    }
    if (ch === '/' && source[j + 1] === '*') {
      j += 2
      while (j < source.length && !(source[j] === '*' && source[j + 1] === '/')) j++
      j++
      continue
    }

    if (ch === '{' || ch === '(' || ch === '[') {
      depth++
      continue
    }

    if (ch === '}' || ch === ')' || ch === ']') {
      depth--
      if (templateDepthStack.length > 0 && depth === templateDepthStack[templateDepthStack.length - 1]) {
        templateDepthStack.pop()
        inString = '`'
        continue
      }
      if (depth === 0 && ch === closeChar) return j
    }
  }

  return -1
}

/** Locates `export const <name> = <bracket>...` and returns its full span. */
function findStorySpan(source: string, exportName: string): { start: number; end: number } | undefined {
  const marker = `export const ${exportName}`
  const start = source.indexOf(marker)
  if (start === -1) return undefined

  const eqIdx = source.indexOf('=', start + marker.length)
  if (eqIdx === -1) return undefined

  let i = eqIdx + 1
  while (i < source.length && /\s/.test(source[i]!)) i++
  if (source[i] !== '{' && source[i] !== '(') return undefined

  const end = scanBalanced(source, i)
  if (end === -1) return undefined
  return { start, end }
}

function dedent(text: string): string {
  const lines = text.split('\n')
  const indents = lines.filter((line) => line.trim().length > 0).map((line) => line.match(/^\s*/)![0].length)
  const min = indents.length > 0 ? Math.min(...indents) : 0
  return lines.map((line) => line.slice(min)).join('\n').trim()
}

/** Extracts just the JSX returned by a story's `render: () => (...)`. */
function extractRenderJSX(source: string, exportName: string): string | undefined {
  const span = findStorySpan(source, exportName)
  if (!span) return undefined

  const body = source.slice(span.start, span.end + 1)
  const renderIdx = body.indexOf('render:')
  if (renderIdx === -1) return undefined

  const arrowIdx = body.indexOf('=>', renderIdx)
  if (arrowIdx === -1) return undefined

  let i = arrowIdx + 2
  while (i < body.length && /\s/.test(body[i]!)) i++

  const openChar = body[i]
  if (openChar !== '(' && openChar !== '{') return undefined

  const closeIdx = scanBalanced(body, i)
  if (closeIdx === -1) return undefined

  let inner = body.slice(i + 1, closeIdx)
  if (openChar === '{') {
    // Block-body render: () => { return (<JSX/>) }
    const returnIdx = inner.indexOf('return')
    if (returnIdx === -1) return undefined
    let k = returnIdx + 'return'.length
    while (k < inner.length && /\s/.test(inner[k]!)) k++
    if (inner[k] !== '(') return undefined
    const returnClose = scanBalanced(inner, k)
    if (returnClose === -1) return undefined
    inner = inner.slice(k + 1, returnClose)
  }

  return dedent(inner)
}

function formatJSXValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'function') return '{() => { /* ... */ }}'
  if (typeof value === 'boolean' || typeof value === 'number') return `{${value}}`
  if (value == null) return '{undefined}'
  try {
    return `{${JSON.stringify(value)}}`
  } catch {
    return '{/* ... */}'
  }
}

/** Builds `<ComponentName prop="value">` from a story's merged args. */
function synthesizeUsage(componentName: string, args: Record<string, unknown> | undefined): string {
  const entries = Object.entries(args ?? {}).filter(([key]) => key !== 'children')
  const children = args?.children

  const props = entries
    .map(([key, value]) => {
      if (typeof value === 'boolean' && value === true) return key
      return `${key}=${formatJSXValue(value)}`
    })
    .join(' ')

  const openTag = props ? `<${componentName} ${props}` : `<${componentName}`

  if (children != null && typeof children !== 'object') {
    return `${openTag}>${String(children)}</${componentName}>`
  }
  return `${openTag} />`
}

export function getStoryUsageCode(
  source: string | undefined,
  exportName: string,
  componentName: string,
  mergedArgs: Record<string, unknown> | undefined,
): string {
  if (source) {
    const jsx = extractRenderJSX(source, exportName)
    if (jsx) return jsx
  }
  return synthesizeUsage(componentName, mergedArgs)
}
