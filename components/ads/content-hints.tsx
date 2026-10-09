// Journey by Mediavine content hints. If any hint exists inside
// #page-list-view, Journey stops auto-placing and puts in-content ads only at
// hints, so on long listing pages these set the spacing: roughly one ad per
// screenview (mobile and desktop intervals differ, hence the two classes).
// The hidden-per-breakpoint and full-row rules live in globals.css.
//
// Render after the item at `index`; nothing after the last item, so a page
// with fewer items than an interval gets no hint and Journey's auto-placement
// handles it instead.
export default function ContentHints({
  index,
  total,
  mobileEvery,
  desktopEvery,
  as: Tag = 'div',
}: {
  index: number
  total: number
  mobileEvery: number
  desktopEvery: number
  // 'li' when the list is a <ul>/<ol>, so the markup stays valid.
  as?: 'div' | 'li'
}) {
  const n = index + 1
  if (n >= total) return null
  const mobile = n % mobileEvery === 0
  const desktop = n % desktopEvery === 0
  if (!mobile && !desktop) return null
  return (
    <>
      {mobile && <Tag className="content_mobile_hint" aria-hidden="true" />}
      {desktop && <Tag className="content_desktop_hint" aria-hidden="true" />}
    </>
  )
}
