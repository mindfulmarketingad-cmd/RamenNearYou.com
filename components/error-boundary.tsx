'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}
interface State {
  hasError: boolean
}

/**
 * Catches render/runtime errors in a subtree so a failure in one widget (e.g.
 * the interactive map) can never take down the whole page. Renders `fallback`
 * instead of letting the error bubble to the route.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    // Swallow — the fallback keeps the page usable.
    if (process.env.NODE_ENV !== 'production') console.error('ErrorBoundary caught:', error)
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null
    return this.props.children
  }
}
