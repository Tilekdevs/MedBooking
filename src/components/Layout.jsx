/* eslint-disable react/prop-types */
import '../style/Layout.scss'

export function Layout({ children, title }) {
  return (
    <div className="layout-root">
      <div className="layout-container">
        {title && <h1 className="layout-title">{title}</h1>}
        {children}
      </div>
    </div>
  )
}
