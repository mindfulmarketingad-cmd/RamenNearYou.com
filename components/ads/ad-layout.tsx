import AdSidebar from './ad-sidebar'

// Two-column wrapper for content pages: the page content plus the 300px
// Journey sidebar on desktop (≥1024px). Below that it's a plain block, so
// mobile layouts are unchanged. The sidebar stretches to the content's height
// so Journey's sticky sidebar ad can travel down until #footer.
//
// `wide` delays the sidebar to ≥1440px, for layouts that already carry their
// own desktop side column (e.g. a sticky map) and can't spare 332px at 1024.
export default function AdLayout({
  children,
  className = '',
  wide = false,
  sidebar = true,
}: {
  children: React.ReactNode
  className?: string
  wide?: boolean
  // false for pages promised to be ad-free (claimed listings): same width,
  // no #sidebar.
  sidebar?: boolean
}) {
  return (
    <div className={`ad-layout ${wide ? 'ad-layout-wide' : ''} ${className}`}>
      <div className="ad-layout-main">{children}</div>
      {sidebar && <AdSidebar />}
    </div>
  )
}
