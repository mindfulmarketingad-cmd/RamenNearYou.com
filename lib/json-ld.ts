// Serialize an object for safe embedding in a <script type="application/ld+json">
// tag. Restaurant names, addresses, and review text come from a scraped
// dataset, so a field could in theory contain a closing script tag or comment
// marker and break out of the script element (a stored-XSS vector). Escaping
// the HTML-significant
// characters to their \uXXXX form keeps the JSON valid while making breakout
// impossible. Also escapes U+2028/U+2029, which are valid JSON but illegal in
// a raw <script> body.
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")
}
