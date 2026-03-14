import { render, screen, fireEvent } from '@testing-library/react'
import LoginButton from './LoginButton'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn(),
  getAuth: vi.fn(),
  GoogleAuthProvider: vi.fn(),
}))

// Mock our local firebase file
vi.mock('../firebase/firebase', () => ({
  auth: {},
  provider: {},
}))

describe('LoginButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders sign in button correctly', () => {
    render(<LoginButton />)
    expect(screen.getByText(/sign in with google/i)).toBeInTheDocument()
  })

  it('shows loading state when clicked', async () => {
    render(<LoginButton />)
    const button = screen.getByRole('button')
    
    fireEvent.click(button)
    
    expect(screen.getByText(/connecting.../i)).toBeInTheDocument()
    expect(button).toBeDisabled()
  })
})
