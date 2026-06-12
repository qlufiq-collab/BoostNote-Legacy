const HEADING_TAGS = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']

function isHeading(element) {
  return element != null && HEADING_TAGS.indexOf(element.tagName) !== -1
}

function getHeadingLevel(element) {
  return HEADING_TAGS.indexOf(element.tagName) + 1
}

// Collect the elements that belong to a heading's section: every following
// sibling up to (but not including) the next heading whose level is the same
// or higher than the given heading.
function getSectionElements(heading) {
  const level = getHeadingLevel(heading)
  const section = []
  let sibling = heading.nextElementSibling
  while (sibling) {
    if (isHeading(sibling) && getHeadingLevel(sibling) <= level) {
      break
    }
    section.push(sibling)
    sibling = sibling.nextElementSibling
  }
  return section
}

// Collapse or expand the section that follows a heading. Returns the new
// collapsed state so callers can react to it if needed.
function toggleFold(heading) {
  const collapsed = heading.classList.toggle('fold-collapsed')
  getSectionElements(heading).forEach(element => {
    if (collapsed) {
      element.classList.add('fold-hidden')
    } else {
      element.classList.remove('fold-hidden')
    }
  })
  return collapsed
}

function isInsideAnchor(element, boundary) {
  let current = element
  while (current != null && current !== boundary) {
    if (current.tagName === 'A') return true
    current = current.parentElement
  }
  return false
}

// Make every heading inside the given root foldable. Clicking a heading
// collapses or expands the content underneath it. Clicks on links inside a
// heading and modifier clicks (used for jumping to the editor line) are left
// untouched.
function addMarkdownFolding(root) {
  if (root == null) return
  const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6')
  Array.prototype.forEach.call(headings, heading => {
    heading.classList.add('fold-header')
    heading.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey) return
      if (isInsideAnchor(event.target, heading)) return
      toggleFold(heading)
    })
  })
}

export { addMarkdownFolding, getSectionElements, toggleFold }
export default addMarkdownFolding
