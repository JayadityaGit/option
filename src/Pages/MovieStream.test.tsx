import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Mock } from 'vitest'
import MovieStream from './MovieStream'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router'

// Mock Firebase hooks as they are used inside FavoriteButton component
vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: () => [null, false], // Not logged in
}))

vi.mock('../firebase/firebase', () => ({
  auth: {},
  firestore: {},
}))

// Mock react-router's useLocation
const mockLocation = vi.fn()
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    useLocation: () => mockLocation(),
    Navigate: vi.fn(({ to }) => <div data-testid="navigate" data-to={to} />),
  }
})

describe('MovieStream Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock location state
    mockLocation.mockReturnValue({ state: { tmdbId: 123 } })
    // Mock global fetch
    global.fetch = vi.fn()
    // Mock localStorage to return 'true' so AdblockDialog doesn't open
    Storage.prototype.getItem = vi.fn(() => 'true')
  })

  it('redirects to home if tmdbId is missing', () => {
    mockLocation.mockReturnValue({ state: null })

    render(
      <MemoryRouter>
        <MovieStream />
      </MemoryRouter>
    )

    expect(screen.getByTestId('navigate')).toBeInTheDocument()
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/')
  })

  it('renders initial state and fetches movie details', async () => {
    const mockMovie = {
      id: 123,
      title: 'Inception',
      overview: 'A mind-bending thriller.',
    }

    ;(global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovie,
    })

    render(
      <MemoryRouter>
        <MovieStream />
      </MemoryRouter>
    )

    // Verify fetch was called with correct URL
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.themoviedb.org/3/movie/123',
      expect.objectContaining({ method: 'GET' })
    )

    // Verify default server iframe is rendered (VidSrc)
    const iframe = screen.getByTitle('Movie Stream')
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute('src', 'https://vidsrc.icu/embed/movie/123')
  })

  it('toggles server correctly', async () => {
    ;(global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 123, title: 'Inception' }),
    })

    render(
      <MemoryRouter>
        <MovieStream />
      </MemoryRouter>
    )

    const toggle = screen.getByRole('checkbox')
    expect(toggle).not.toBeChecked()

    // Simulate clicking the toggle
    const user = userEvent.setup()
    await user.click(toggle)

    await waitFor(() => {
      expect(toggle).toBeChecked()
      const iframe = screen.getByTitle('Movie Stream')
      expect(iframe).toHaveAttribute('src', 'https://vidlink.pro/movie/123')
    })
  })
})
