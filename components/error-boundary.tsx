'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}
interface State {
  hasError: boolean
  resetCount: number
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, resetCount: 0 }

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('ErrorBoundary caught:', error)
    // Auto-reset up to 3 times for transient errors; stop looping after that.
    if (this.state.resetCount < 3) {
      setTimeout(() => this.setState(s => ({ hasError: false, resetCount: s.resetCount + 1 })), 1500)
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null
    return this.props.children
  }
}
