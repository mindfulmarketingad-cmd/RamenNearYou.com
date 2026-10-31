// Desktop-only sidebar for Journey by Mediavine (dashboard "Sidebar
// Selector": #sidebar). Journey only fills it when it is at least 300px wide,
// so it is exactly 300px at ≥1024px and display:none below (globals.css,
// .ad-sidebar). Left empty on purpose: the first sidebar ad sits at the top,
// and min-height reserves its space so it doesn't shift the layout.
export default function AdSidebar({ className = '' }: { className?: string }) {
  return <aside id="sidebar" className={`ad-sidebar ${className}`} aria-label="Advertisements" />
}
