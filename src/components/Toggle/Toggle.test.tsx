import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Toggle } from './Toggle'

describe('Toggle', () => {
  it('renders unchecked by default', () => {
    render(<Toggle label="Notifications" />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  it('renders checked when checked=true', () => {
    render(<Toggle label="Notifications" checked />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('calls onChange with toggled value on click', async () => {
    const handleChange = vi.fn()
    render(<Toggle label="Notifications" checked={false} onChange={handleChange} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('calls onChange when clicking the label text', async () => {
    const handleChange = vi.fn()
    render(<Toggle label="Notifications" checked={false} onChange={handleChange} />)
    await userEvent.click(screen.getByText('Notifications'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('toggles with Space key', async () => {
    const handleChange = vi.fn()
    render(<Toggle label="Notifications" checked={false} onChange={handleChange} />)
    screen.getByRole('switch').focus()
    await userEvent.keyboard(' ')
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('toggles with Enter key', async () => {
    const handleChange = vi.fn()
    render(<Toggle label="Notifications" checked={false} onChange={handleChange} />)
    screen.getByRole('switch').focus()
    await userEvent.keyboard('{Enter}')
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('does not call onChange when disabled', async () => {
    const handleChange = vi.fn()
    render(<Toggle label="Notifications" disabled onChange={handleChange} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('sets aria-disabled when disabled', () => {
    render(<Toggle label="Notifications" disabled />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-disabled', 'true')
  })

  it('is not focusable when disabled', () => {
    render(<Toggle label="Notifications" disabled />)
    expect(screen.getByRole('switch')).toHaveAttribute('tabIndex', '-1')
  })

  it('renders supporting text when provided', () => {
    render(<Toggle label="Notifications" supportingText="Get notified about updates." />)
    expect(screen.getByText('Get notified about updates.')).toBeInTheDocument()
  })

  it('associates label via aria-labelledby', () => {
    render(<Toggle id="notif" label="Notifications" />)
    const toggle = screen.getByRole('switch')
    const labelId = toggle.getAttribute('aria-labelledby')
    expect(labelId).toBeTruthy()
    expect(document.getElementById(labelId!)).toHaveTextContent('Notifications')
  })
})
