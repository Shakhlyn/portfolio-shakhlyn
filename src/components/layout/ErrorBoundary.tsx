import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';

import { ErrorFallback } from '@/components/layout/ErrorFallback';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * The one permitted class component in this codebase: React has no hook
 * equivalent for componentDidCatch, so AGENTS.md §2's function-components rule
 * cannot be satisfied here. This catches render-phase errors the router's
 * errorElement does not see.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console -- development-only diagnostics
      console.error('Render error caught by ErrorBoundary:', error, errorInfo);
    }
  }

  render(): ReactNode {
    const { error } = this.state;

    if (error) {
      return <ErrorFallback detail={error.stack ?? error.message} />;
    }

    return this.props.children;
  }
}
