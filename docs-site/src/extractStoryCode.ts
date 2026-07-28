/**
 * Extracts the source text of a single `export const <name> = ...` statement
 * from a raw `.stories.tsx` file, so the docs site can show "the code" for
 * each story without anyone hand-maintaining a duplicate snippet.
 *
 * Tracks string/template-literal/comment boundaries so braces and parens
 * inside JSX prop strings or comments don't throw off the bracket count.
 */
export function extractStoryCode(source: string, exportName: string): string | undefined {
  const marker = `export const ${exportName}`
  const startIdx = source.indexOf(marker)
  if (startIdx === -1) return undefined

  const eqIdx = source.indexOf('=', startIdx + marker.length)
  if (eqIdx === -1) return undefined

  let i = eqIdx + 1
  while (i < source.length && /\s/.test(source[i]!)) i++

  const openChar = source[i]
  if (openChar !== '{' && openChar !== '(') return undefined
  const closeChar = openChar === '{' ? '}' : ')'

  let depth = 0
  let end = -1
  let inString: '"' | "'" | '`' | null = null
  const templateDepthStack: number[] = []

  for (let j = i; j < source.length; j++) {
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
      if (depth === 0 && ch === closeChar) {
        end = j
        break
      }
    }
  }

  if (end === -1) return undefined
  return source.slice(startIdx, end + 1)
}
