// Saved recipes are tied to a logged-in account via /api/recipe-saves (backed
// by the `saved_recipes` Supabase table). Logged-out requests get an empty
// list back rather than an error, so callers don't need to check auth just
// to render initial state.

export async function getSavedRecipeSlugs(): Promise<string[]> {
  try {
    const res = await fetch('/api/recipe-saves')
    const data = await res.json().catch(() => ({}))
    return Array.isArray(data.saves) ? data.saves : []
  } catch {
    return []
  }
}

export interface ToggleSavedRecipeResult {
  saved: boolean
  unauthorized: boolean
}

export async function toggleSavedRecipe(slug: string, currentlySaved: boolean): Promise<ToggleSavedRecipeResult> {
  try {
    const res = await fetch('/api/recipe-saves', {
      method: currentlySaved ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
    if (res.status === 401) return { saved: currentlySaved, unauthorized: true }
    if (!res.ok) return { saved: currentlySaved, unauthorized: false }
    return { saved: !currentlySaved, unauthorized: false }
  } catch {
    return { saved: currentlySaved, unauthorized: false }
  }
}
