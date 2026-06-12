import PropTypes from 'prop-types'
import React from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './FloatingToc.styl'
import slugify from 'browser/lib/slugify'

const HEADING_REGEX = /^(#{1,6})\s+(.+?)\s*#*\s*$/

/**
 * Extract a flat list of headings from markdown source.
 * Code fences are ignored so that lines like `# comment` inside ```python``` blocks
 * are not treated as headings.
 */
function extractHeadings(markdownText) {
  if (!markdownText) return []

  const lines = markdownText.split(/\r?\n/)
  const headings = []
  const slugCounts = {}
  let inFence = false

  for (const line of lines) {
    const fenceMatch = line.match(/^\s*(```|~~~)/)
    if (fenceMatch) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const match = line.match(HEADING_REGEX)
    if (!match) continue

    const level = match[1].length
    const text = match[2].trim()
    if (text.length === 0) continue

    let slug = slugify(text)
    const count = slugCounts[slug] || 0
    slugCounts[slug] = count + 1
    if (count > 0) {
      slug = `${slug}-${count}`
    }

    headings.push({ level, text, slug })
  }

  return headings
}

class FloatingToc extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e, slug) {
    e.preventDefault()
    if (typeof this.props.onJump === 'function') {
      this.props.onJump(slug)
    }
  }

  renderItems(headings) {
    if (headings.length === 0) {
      return <div styleName='empty'>{this.props.emptyLabel}</div>
    }

    const minLevel = Math.min.apply(null, headings.map(h => h.level))

    return (
      <ul styleName='list'>
        {headings.map((heading, i) => {
          const indent = heading.level - minLevel
          const itemStyle = { paddingLeft: `${indent * 12}px` }
          return (
            <li
              key={`${heading.slug}-${i}`}
              styleName={`item level-${heading.level}`}
              style={itemStyle}
            >
              <a
                href={`#${heading.slug}`}
                onClick={e => this.handleClick(e, heading.slug)}
                title={heading.text}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ul>
    )
  }

  render() {
    const { value, title, style } = this.props
    const headings = extractHeadings(value)

    return (
      <div styleName='root' style={style}>
        <div styleName='header'>{title}</div>
        <div styleName='body'>{this.renderItems(headings)}</div>
      </div>
    )
  }
}

FloatingToc.propTypes = {
  value: PropTypes.string,
  onJump: PropTypes.func,
  title: PropTypes.string,
  emptyLabel: PropTypes.string,
  style: PropTypes.object
}

FloatingToc.defaultProps = {
  value: '',
  title: 'Table of Contents',
  emptyLabel: 'No headings'
}

export { extractHeadings }
export default CSSModules(FloatingToc, styles)
