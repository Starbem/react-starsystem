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

  it('renders size 2xl', () => {
    render(<Avatar name="Jane Doe" size="2xl" />)
    expect(screen.getByText('JD').parentElement).toHaveClass('size-[72px]')
  })

  it('accepts a boolean status and renders a plain indicator', () => {
    render(<Avatar name="Jane Doe" status />)
    expect(screen.getByLabelText('status indicator')).toBeInTheDocument()
  })

  it('does not require alt when src is provided', () => {
    render(<Avatar src="/a.png" name="Jane Doe" />)
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Jane Doe')
  })

  it('renders shape square', () => {
    render(<Avatar name="Jane Doe" shape="square" />)
    expect(screen.getByText('JD').parentElement).toHaveClass('rounded-none')
  })

  it('renders a custom fallback icon when provided and there is no name', () => {
    render(<Avatar icon={<span data-testid="custom-icon" />} />)
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('applies ring classes when ring is true', () => {
    render(<Avatar name="Jane Doe" ring />)
    expect(screen.getByText('JD').parentElement).toHaveClass('ring-2')
  })
})

describe('AvatarGroup', () => {
  it('renders all avatars when there is no max', () => {
    render(
      <AvatarGroup>
        <Avatar name="Julio Sousa" />
        <Avatar name="Bárbara Koch" />
        <Avatar name="José Tenório" />
        <Avatar name="João Dias" />
      </AvatarGroup>,
    )
    expect(screen.getByText('JS')).toBeInTheDocument()
    expect(screen.getByText('BK')).toBeInTheDocument()
    expect(screen.getByText('JT')).toBeInTheDocument()
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('truncates and shows a +N overflow indicator when max is set', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Julio Sousa" />
        <Avatar name="Bárbara Koch" />
        <Avatar name="José Tenório" />
        <Avatar name="João Dias" />
      </AvatarGroup>,
    )
    expect(screen.getByText('JS')).toBeInTheDocument()
    expect(screen.getByText('BK')).toBeInTheDocument()
    expect(screen.queryByText('JT')).not.toBeInTheDocument()
    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('does not show an overflow indicator when max fits all avatars', () => {
    render(
      <AvatarGroup max={10}>
        <Avatar name="Julio Sousa" />
        <Avatar name="Bárbara Koch" />
        <Avatar name="José Tenório" />
      </AvatarGroup>,
    )
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument()
  })

  it('renders Avatar children and forwards size to each', () => {
    render(
      <AvatarGroup size="sm">
        <Avatar name="Ann Lee" />
        <Avatar name="Bo Kim" />
      </AvatarGroup>,
    )
    expect(screen.getByText('AL').parentElement).toHaveClass('size-[28px]')
    expect(screen.getByText('BK').parentElement).toHaveClass('size-[28px]')
  })

  it('shows an overflow count beyond max', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Ann Lee" />
        <Avatar name="Bo Kim" />
        <Avatar name="Cy Ora" />
      </AvatarGroup>,
    )
    expect(screen.getByText('+1')).toBeInTheDocument()
  })
})
