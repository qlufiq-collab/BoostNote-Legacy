const { PROTOCOL, getNoteLink, parseNoteLink } = require('../../lib/noteLink')

describe('noteLink helper', () => {
  test('exposes the boostnote protocol', () => {
    expect(PROTOCOL).toBe('boostnote')
  })

  test('builds a deep link for a uuid v4 note key', () => {
    const key = '7dd23275-f2b4-49cb-9e93-3454daf1af9c'
    expect(getNoteLink(key)).toBe(`boostnote://open/${key}`)
  })

  test('parses a deep link with the legacy 20-char hash', () => {
    const url = 'boostnote://open/1c211eb7dcb463de6490'
    expect(parseNoteLink(url)).toBe('1c211eb7dcb463de6490')
  })

  test('parses a deep link with the uuid v4 hash', () => {
    const url = 'boostnote://open/7dd23275-f2b4-49cb-9e93-3454daf1af9c'
    expect(parseNoteLink(url)).toBe('7dd23275-f2b4-49cb-9e93-3454daf1af9c')
  })

  test('tolerates a trailing slash', () => {
    const url = 'boostnote://open/1c211eb7dcb463de6490/'
    expect(parseNoteLink(url)).toBe('1c211eb7dcb463de6490')
  })

  test('returns null for non-boostnote urls', () => {
    expect(parseNoteLink('https://example.com')).toBeNull()
    expect(parseNoteLink('nvalt://find/hello')).toBeNull()
  })

  test('returns null when the path is not /open/<key>', () => {
    expect(parseNoteLink('boostnote://other/1c211eb7dcb463de6490')).toBeNull()
    expect(parseNoteLink('boostnote://open/')).toBeNull()
  })

  test('returns null when the key is too short or too long', () => {
    expect(parseNoteLink('boostnote://open/short')).toBeNull()
    expect(parseNoteLink('boostnote://open/' + 'a'.repeat(40))).toBeNull()
  })

  test('returns null for non-string input', () => {
    expect(parseNoteLink(undefined)).toBeNull()
    expect(parseNoteLink(null)).toBeNull()
    expect(parseNoteLink(123)).toBeNull()
  })

  test('round-trips through getNoteLink and parseNoteLink', () => {
    const key = '1c211eb7dcb463de6490'
    expect(parseNoteLink(getNoteLink(key))).toBe(key)
  })
})
