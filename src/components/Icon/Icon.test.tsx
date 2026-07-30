import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { Icon } from './Icon'

describe('Icon', () => {
  it('renders the Material Symbols ligature name', () => {
    render(<Icon name="home" />)
    expect(screen.getByText('home')).toBeInTheDocument()
  })

  it('applies the material-symbols-rounded class', () => {
    render(<Icon name="home" />)
    expect(screen.getByText('home')).toHaveClass('material-symbols-rounded')
  })

  it('always renders at weight 200', () => {
    render(<Icon name="home" />)
    expect(screen.getByText('home')).toHaveStyle({
      fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 24",
    })
  })

  it('applies a custom size to font-size and optical size', () => {
    render(<Icon name="home" size={32} />)
    const el = screen.getByText('home')
    expect(el).toHaveStyle({ fontSize: '32px' })
    expect(el).toHaveStyle({ fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 32" })
  })

  it('sets the FILL axis when fill is true', () => {
    render(<Icon name="favorite" fill />)
    expect(screen.getByText('favorite')).toHaveStyle({
      fontVariationSettings: "'FILL' 1, 'wght' 200, 'GRAD' 0, 'opsz' 24",
    })
  })

  it('is decorative (aria-hidden) by default', () => {
    render(<Icon name="home" data-testid="icon" />)
    expect(screen.getByTestId('icon')).toHaveAttribute('aria-hidden', 'true')
  })

  it('exposes an accessible name via the label prop', () => {
    render(<Icon name="home" label="Início" />)
    expect(screen.getByRole('img', { name: 'Início' })).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Icon name="home" label="Início" />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})
