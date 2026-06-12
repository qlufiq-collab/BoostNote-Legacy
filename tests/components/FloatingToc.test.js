/**
 * @fileoverview Unit test for browser/components/FloatingToc heading extraction
 */

const { extractHeadings } = require('browser/components/FloatingToc')

describe('extractHeadings', () => {
  test('should return empty array for empty input', () => {
    expect(extractHeadings('')).toEqual([])
    expect(extractHeadings(null)).toEqual([])
    expect(extractHeadings(undefined)).toEqual([])
  })

  test('should extract single heading', () => {
    const result = extractHeadings('# Hello World')
    expect(result).toEqual([
      { level: 1, text: 'Hello World', slug: 'Hello-World' }
    ])
  })

  test('should extract multiple headings at different levels', () => {
    const md = `# Title
## Section One
### Subsection
## Section Two`
    const result = extractHeadings(md)
    expect(result).toHaveLength(4)
    expect(result[0]).toEqual({ level: 1, text: 'Title', slug: 'Title' })
    expect(result[1]).toEqual({
      level: 2,
      text: 'Section One',
      slug: 'Section-One'
    })
    expect(result[2]).toEqual({
      level: 3,
      text: 'Subsection',
      slug: 'Subsection'
    })
    expect(result[3]).toEqual({
      level: 2,
      text: 'Section Two',
      slug: 'Section-Two'
    })
  })

  test('should ignore headings inside code fences', () => {
    const md = `# Real Heading
\`\`\`python
# This is a comment
\`\`\`
## Another Real Heading`
    const result = extractHeadings(md)
    expect(result).toHaveLength(2)
    expect(result[0].text).toBe('Real Heading')
    expect(result[1].text).toBe('Another Real Heading')
  })

  test('should handle duplicate headings with incremented slugs', () => {
    const md = `# Intro
# Intro
# Intro`
    const result = extractHeadings(md)
    expect(result).toHaveLength(3)
    expect(result[0].slug).toBe('Intro')
    expect(result[1].slug).toBe('Intro-1')
    expect(result[2].slug).toBe('Intro-2')
  })

  test('should handle headings with trailing hash marks', () => {
    const result = extractHeadings('## Hello ##')
    expect(result[0].text).toBe('Hello')
  })

  test('should ignore empty headings', () => {
    const md = `# Title
##
## Valid`
    const result = extractHeadings(md)
    expect(result).toHaveLength(2)
    expect(result[0].text).toBe('Title')
    expect(result[1].text).toBe('Valid')
  })
})
