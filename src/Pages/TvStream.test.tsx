import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Mock } from 'vitest'
import TvStream from './TvStream'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router'

// Mock Firebase hooks
vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: () => [null, false],
}))

vi.mock('../firebase/firebase', () => ({
  auth: {},
  firestore: {},
}))

// Mock react-router's useLocation
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    useLocation: () => ({
      state: { tmdbId: 456 }
    }),
  }
})

// Mock generic pointer/element methods for Radix UI (Tabs/ScrollArea)
window.HTMLElement.prototype.scrollIntoView = vi.fn()
window.HTMLElement.prototype.hasPointerCapture = vi.fn()
window.HTMLElement.prototype.releasePointerCapture = vi.fn()

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('TvStream Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
    // Mock localStorage to return 'true' so AdblockDialog doesn't open
    Storage.prototype.getItem = vi.fn(() => 'true')
  })

  it('renders initial state and fetches tv details', async () => {
    const mockTvDetails = {
      id: 456,
      name: 'Breaking Bad',
      seasons: [
        { season_number: 1, episode_count: 7 },
      ],
    }
    const mockSeasonDetails = {
      episodes: [
        { episode_number: 1, name: 'Pilot' },
        { episode_number: 2, name: 'Cats in the Bag' },
      ],
    }

    ;(global.fetch as Mock).mockImplementation((url) => {
      if (url.includes('/season/1')) {
        return Promise.resolve({ ok: true, json: async () => mockSeasonDetails })
      }
      return Promise.resolve({ ok: true, json: async () => mockTvDetails })
    })

    render(
      <MemoryRouter>
        <TvStream />
      </MemoryRouter>
    )

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.themoviedb.org/3/tv/456',
      expect.any(Object)
    )

    // Wait for the season tab to appear
    await waitFor(() => {
      expect(screen.getByText('Season 1')).toBeInTheDocument()
    })

    // Verify default iframe src
    const iframe = document.querySelector('iframe')
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute('src', 'https://vidsrc.icu/embed/tv/456/1/1')
  })

  it('toggles server correctly', async () => {
    const mockTvDetails = { id: 456, name: 'Breaking Bad', seasons: [] }
    
    ;(global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTvDetails,
    })

    render(
      <MemoryRouter>
        <TvStream />
      </MemoryRouter>
    )

    const toggle = screen.getByRole('checkbox')
    const user = userEvent.setup()
    await user.click(toggle)

    await waitFor(() => {
      expect(toggle).toBeChecked()
      const iframe = document.querySelector('iframe')
      expect(iframe).toHaveAttribute('src', 'https://vidlink.pro/tv/456/1/1')
    })
  })

  it('selects episode correctly', async () => {
    const mockTvDetails = {
      id: 456,
      name: 'Breaking Bad',
      seasons: [
        { season_number: 1, episode_count: 2 },
      ],
    }
    const mockSeasonDetails = {
      episodes: [
        { episode_number: 1, name: 'Pilot' },
        { episode_number: 2, name: 'Cats in the Bag' },
      ],
    }

    ;(global.fetch as Mock).mockImplementation((url) => {
      if (url.includes('/season/1')) {
        return Promise.resolve({ ok: true, json: async () => mockSeasonDetails })
      }
      return Promise.resolve({ ok: true, json: async () => mockTvDetails })
    })

    render(
      <MemoryRouter>
        <TvStream />
      </MemoryRouter>
    )

    // Wait for episode 2 to be rendered
    const episode2Button = await screen.findByText('Cats in the Bag')
    expect(episode2Button).toBeInTheDocument()

    // Click on episode 2
    const user = userEvent.setup()
    await user.click(episode2Button)

    await waitFor(() => {
      const iframe = document.querySelector('iframe')
      expect(iframe).toHaveAttribute('src', 'https://vidsrc.icu/embed/tv/456/1/2')
    })
  })
})
