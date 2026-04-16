import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info)
    }
  }

  reset = () => this.setState({ error: null })

  render() {
    if (this.state.error) {
      return (
        <div className="max-w-xl mx-auto my-16 panel p-6">
          <p className="eyebrow mb-2">/error</p>
          <h2 className="text-lg font-semibold text-fg mb-1">Something broke rendering this view.</h2>
          <p className="text-muted text-sm mb-4 font-mono break-words">
            {this.state.error.message || String(this.state.error)}
          </p>
          <button onClick={this.reset} className="btn-secondary">Try again</button>
        </div>
      )
    }
    return this.props.children
  }
}
