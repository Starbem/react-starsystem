import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { Avatar, AvatarGroup } from './Avatar'

describe('Avatar', () => {
  it('renders an image with the given alt text', () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="Julio Sousa" />)
    expect(screen.getByRole('img', { name: 'Julio Sousa' })).toBeInTheDocument()
  })

  it('renders initials from the name when no src is provided', () => {
    render(<Avatar name="Julio Sousa" />)
    expect(screen.getByText('JS')).toBeInTheDocument()
  })

  it('renders a single-word name as a two-letter initial', () => {
    render(<Avatar name="Julio" />)
    expect(screen.getByText('JU')).toBeInTheDocument()
  })

  it('renders a fallback icon when there is no src and no name', () => {
    const { container } = render(<Avatar />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('falls back to initials when the image fails to load', () => {
    render(<Avatar src="https://example.com/broken.jpg" alt="José Tenório" name="José Tenório" />)
    const img = screen.getByRole('img', { name: 'José Tenório' })
    fireEvent.error(img)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText('JT')).toBeInTheDocument()
  })

  it('applies size classes', () => {
    const { container } = render(<Avatar name="Julio Sousa" size="xl" />)
    expect(container.querySelector('span > span')).toHaveClass('size-[64px]')
  })

  it('renders a status indicator when provided', () => {
    render(<Avatar name="Julio Sousa" status="online" />)
    expect(screen.getByRole('img', { name: 'status: online' })).toBeInTheDocument()
  })

  it('does not render a status indicator by default', () => {
    render(<Avatar name="Julio Sousa" />)
    expect(screen.queryByLabelText(/status:/)).not.toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Avatar src="https://example.com/avatar.jpg" alt="Julio Sousa" status="online" />)
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('AvatarGroup', () => {
  const AVATARS = [
    { name: 'Julio Sousa' },
    { name: 'Bárbara Koch' },
    { name: 'José Tenório' },
    { name: 'João Dias' },
  ]

  it('renders all avatars when there is no max', () => {
    render(<AvatarGroup avatars={AVATARS} />)
    expect(screen.getByText('JS')).toBeInTheDocument()
    expect(screen.getByText('BK')).toBeInTheDocument()
    expect(screen.getByText('JT')).toBeInTheDocument()
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('truncates and shows a +N overflow indicator when max is set', () => {
    render(<AvatarGroup avatars={AVATARS} max={2} />)
    expect(screen.getByText('JS')).toBeInTheDocument()
    expect(screen.getByText('BK')).toBeInTheDocument()
    expect(screen.queryByText('JT')).not.toBeInTheDocument()
    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('does not show an overflow indicator when max fits all avatars', () => {
    render(<AvatarGroup avatars={AVATARS} max={10} />)
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument()
  })
})
