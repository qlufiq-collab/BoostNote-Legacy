const fs = require('fs')
const path = require('path')

const formatHTMLSource = fs.readFileSync(
  path.join(
    __dirname,
    '..',
    '..',
    'browser',
    'main',
    'lib',
    'dataApi',
    'formatHTML.js'
  ),
  'utf8'
)

function extractPrintMediaBlock(source) {
  // Find the @media print block inside buildStyle's template literal
  const printIndex = source.indexOf('@media print {')
  if (printIndex === -1) return ''
  // Track brace depth from the opening of @media print
  let depth = 0
  let i = printIndex
  while (i < source.length) {
    if (source[i] === '{') depth++
    else if (source[i] === '}') {
      depth--
      if (depth === 0) {
        return source.slice(printIndex, i + 1)
      }
    }
    i++
  }
  return ''
}

describe('formatHTML print styles - PDF code block display', () => {
  // Extract every @media print block from the source. There should be
  // multiple; the buildStyle one (the second) handles code blocks.
  const printBlocks = []
  let cursor = 0
  while (true) {
    const idx = formatHTMLSource.indexOf('@media print {', cursor)
    if (idx === -1) break
    const block = extractPrintMediaBlock(formatHTMLSource.slice(idx))
    printBlocks.push(block)
    cursor = idx + block.length
  }

  test('the source defines at least one @media print block', () => {
    expect(printBlocks.length).toBeGreaterThan(0)
  })

  test('print styles include page-break-inside: avoid for pre elements', () => {
    const combined = printBlocks.join('\n')
    expect(combined).toMatch(/pre\s*\{[^}]*page-break-inside:\s*avoid/)
  })

  test('print styles include break-inside: avoid for pre elements', () => {
    const combined = printBlocks.join('\n')
    expect(combined).toMatch(/pre\s*\{[^}]*break-inside:\s*avoid/)
  })

  test('print styles wrap long code lines instead of clipping them', () => {
    const combined = printBlocks.join('\n')
    expect(combined).toMatch(/pre\s*\{[^}]*white-space:\s*pre-wrap/)
    expect(combined).toMatch(/pre code\s*\{[^}]*white-space:\s*pre-wrap/)
  })

  test('print styles override display: flex with display: block for pre', () => {
    const combined = printBlocks.join('\n')
    expect(combined).toMatch(/pre\s*\{[^}]*display:\s*block/)
  })
})
