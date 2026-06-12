import PropTypes from 'prop-types'
import React from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './TocButton.styl'
import i18n from 'browser/lib/i18n'

const TocButton = ({ onClick, isActive }) => (
  <button
    styleName='control-tocButton'
    title={i18n.__('Table of Contents')}
    onMouseDown={e => onClick(e)}
  >
    <img
      src={
        isActive
          ? '../resources/icon/icon-toc-active.svg'
          : '../resources/icon/icon-toc.svg'
      }
    />
    <span lang={i18n.locale} styleName='tooltip'>
      {i18n.__('Table of Contents')}
    </span>
  </button>
)

TocButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired
}

export default CSSModules(TocButton, styles)
