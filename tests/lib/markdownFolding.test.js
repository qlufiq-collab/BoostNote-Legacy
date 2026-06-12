import {
  addMarkdownFolding,
  getSectionElements,
  toggleFold
} from 'browser/lib/markdownFolding'

function buildPreview(html) {
  const root = document.createElement('div')
  root.innerHTML = html
  return root
}

describe('markdownFolding', () => {
  test('getSectionElements collects siblings until next heading of same level', () => {
    const root = buildPreview(
      '<h1 id="a">A</h1><p>p1</p><h2>A1</h2><p>p2</p><h1 id="b">B</h1><p>p3</p>'
    )
    const headingA = root.querySelector('#a')
    const section = getSectionElements(headingA)

    expect(section.map(el => el.tagName)).toEqual(['P', 'H2', 'P'])
  })

  test('getSectionElements stops at headings of higher level', () => {
    const root = buildPreview(
      '<h2 id="a">A</h2><p>x</p><h3>sub</h3><p>y</p><h1>top</h1>'
    )
    const headingA = root.querySelector('#a')
    const section = getSectionElements(headingA)

    expect(section.map(el => el.tagName)).toEqual(['P', 'H3', 'P'])
  })

  test('toggleFold hides every element in the section and toggles back', () => {
    const root = buildPreview(
      '<h1 id="a">A</h1><p id="p1">x</p><h2 id="h2">A1</h2><p id="p2">y</p><h1>B</h1>'
    )
    const headingA = root.querySelector('#a')

    expect(toggleFold(headingA)).toBe(true)
    expect(headingA.classList.contains('fold-collapsed')).toBe(true)
    expect(root.querySelector('#p1').classList.contains('fold-hidden')).toBe(
      true
    )
    expect(root.querySelector('#h2').classList.contains('fold-hidden')).toBe(
      true
    )
    expect(root.querySelector('#p2').classList.contains('fold-hidden')).toBe(
      true
    )

    expect(toggleFold(headingA)).toBe(false)
    expect(headingA.classList.contains('fold-collapsed')).toBe(false)
    expect(root.querySelector('#p1').classList.contains('fold-hidden')).toBe(
      false
    )
  })

  test('addMarkdownFolding marks headings and folds on click', () => {
    const root = buildPreview(
      '<h1 id="a">A</h1><p id="p1">x</p><h1 id="b">B</h1><p id="p2">y</p>'
    )
    addMarkdownFolding(root)

    const headingA = root.querySelector('#a')
    expect(headingA.classList.contains('fold-header')).toBe(true)

    headingA.click()
    expect(headingA.classList.contains('fold-collapsed')).toBe(true)
    expect(root.querySelector('#p1').classList.contains('fold-hidden')).toBe(
      true
    )
    // sibling section under the second heading is untouched
    expect(root.querySelector('#p2').classList.contains('fold-hidden')).toBe(
      false
    )

    headingA.click()
    expect(headingA.classList.contains('fold-collapsed')).toBe(false)
    expect(root.querySelector('#p1').classList.contains('fold-hidden')).toBe(
      false
    )
  })

  test('addMarkdownFolding ignores clicks originating from inner links', () => {
    const root = buildPreview(
      '<h1 id="a">A <a id="lnk" href="#x">link</a></h1><p id="p1">x</p>'
    )
    addMarkdownFolding(root)

    const link = root.querySelector('#lnk')
    link.click()

    expect(root.querySelector('#a').classList.contains('fold-collapsed')).toBe(
      false
    )
    expect(root.querySelector('#p1').classList.contains('fold-hidden')).toBe(
      false
    )
  })

  test('addMarkdownFolding skips ctrl-click so existing line-jump still works', () => {
    const root = buildPreview('<h1 id="a">A</h1><p id="p1">x</p>')
    addMarkdownFolding(root)

    const heading = root.querySelector('#a')
    const event = new window.MouseEvent('click', {
      bubbles: true,
      ctrlKey: true
    })
    heading.dispatchEvent(event)

    expect(heading.classList.contains('fold-collapsed')).toBe(false)
    expect(root.querySelector('#p1').classList.contains('fold-hidden')).toBe(
      false
    )
  })
})
