import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import type { Mock } from 'vitest'
import Home from './Home'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router'

// Mocking the assets
vi.mock('@/assests/meme.gif', () => ({
  default: 'meme-stub',
}))

// Mocking UI components that use Canvas or complex animations/timers
// This avoids issues with JSDOM not supporting Canvas and speeds up tests
vi.mock('../components/ui/placeholders-and-vanish-input', () => ({
  PlaceholdersAndVanishInput: ({
    onChange,
    onSubmit,
    placeholders,
  }: {
    onChange: React.ChangeEventHandler<HTMLInputElement>
    onSubmit: React.FormEventHandler<HTMLFormElement>
    placeholders: string[]
  }) => (
    <form onSubmit={onSubmit} data-testid="search-form">
      <input data-testid="search-input" onChange={onChange} placeholder={placeholders[0]} />
      <button type="submit">Search</button>
    </form>
  ),
}))

vi.mock('../components/ui/flip-words', () => ({
  FlipWords: ({ words }: { words: string[] }) => <span>{words[0]}</span>,
}))

vi.mock('@/components/ui/3d-pin', () => ({
  PinContainer: ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <div data-testid="pin-container" title={title}>
      {children}
    </div>
  ),
}))

// Mock Firebase hooks as they are used inside Cards component
vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: () => [null, false], // Not logged in
}))

vi.mock('../firebase/firebase', () => ({
  auth: {},
  firestore: {},
}))

describe('Home Page Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock global fetch
    global.fetch = vi.fn()
  })

  it('renders initial state with search input and placeholder meme', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    expect(screen.getByTestId('search-input')).toBeInTheDocument()
    expect(screen.getByTestId('pin-container')).toBeInTheDocument()
    expect(screen.getByAltText(/the meme is loading/i)).toBeInTheDocument()
  })

  it('fetches and displays movie results when typing in search input', async () => {
    const mockMovies = [
      {
        id: 1,
        title: 'Inception',
        media_type: 'movie',
        poster_path: '/path.jpg',
        release_date: '2010-07-16',
      },
    ]

    // Setup fetch mock response
    ;(global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: mockMovies }),
    })

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    const input = screen.getByTestId('search-input')

    // Simulate user typing
    fireEvent.change(input, { target: { value: 'Inception' } })

    // Verify fetch was called
    expect(global.fetch).toHaveBeenCalled()

    // Wait for results to be rendered in Cards component
    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument()
    })

    // Placeholder meme should be gone
    expect(screen.queryByTestId('pin-container')).not.toBeInTheDocument()
  })

  it('handles API error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    ;(global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    })

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: 'Inception' } })

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
    })

    // Still shows placeholder meme on error
    expect(screen.getByTestId('pin-container')).toBeInTheDocument()

    consoleSpy.mockRestore()
  })
})
