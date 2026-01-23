import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

/**
 * Example component tests using Vitest + React Testing Library
 */

describe('NotFound Component', () => {
  it('renders 404 text', () => {
    // Simple render test
    const { container } = render(
      <div>
        <h1>404</h1>
        <p>Page Not Found</p>
      </div>
    )

    expect(container.textContent).toContain('404')
    expect(container.textContent).toContain('Page Not Found')
  })

  it('has accessible heading', () => {
    render(
      <div role="main">
        <h1>404</h1>
        <h2>Page Not Found</h2>
      </div>
    )

    // Test for heading presence
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined()
  })
})

/**
 * For testing components with TanStack Router:
 *
 * import { createMemoryHistory, RouterProvider, createRootRoute, createRouter } from '@tanstack/react-router'
 *
 * function renderWithRouter(component: React.ReactNode) {
 *   const rootRoute = createRootRoute({ component: () => component })
 *   const router = createRouter({ routeTree: rootRoute, history: createMemoryHistory() })
 *   return render(<RouterProvider router={router} />)
 * }
 */
