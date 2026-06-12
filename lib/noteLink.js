// Helpers for the boostnote:// deep-link URL scheme.
//
// External applications can open a specific note by following a link of the
// form `boostnote://open/<noteKey>`. The note key matches the new uuid v4
// hash as well as the legacy hash, e.g.
//   boostnote://open/1c211eb7dcb463de6490
//   boostnote://open/7dd23275-f2b4-49cb-9e93-3454daf1af9c

const PROTOCOL = 'boostnote'

const NOTE_LINK_REGEX = /^boostnote:\/\/open\/([a-zA-Z0-9-]{20,36})\/?$/

// Builds the external deep link that opens the given note key.
function getNoteLink(noteKey) {
  return `${PROTOCOL}://open/${noteKey}`
}

// Extracts the note key from a boostnote:// deep link, or null when the input
// is not a valid note link.
function parseNoteLink(url) {
  if (typeof url !== 'string') return null
  const match = url.match(NOTE_LINK_REGEX)
  return match ? match[1] : null
}

module.exports = {
  PROTOCOL,
  getNoteLink,
  parseNoteLink
}
