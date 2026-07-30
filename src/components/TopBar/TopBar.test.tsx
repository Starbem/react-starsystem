import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { TopBar } from './TopBar'

describe('TopBar', () => {
  it('renders start, center and end slots', () => {
    render(
      <TopBar
        start={<span>Logo</span>}
        center="Título"
        end={<button type="button">Ação</button>}
      />,
    )
    expect(screen.getByText('Logo')).toBeInTheDocument()
    expect(screen.getByText('Título')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ação' })).toBeInTheDocument()
  })

  it('renders only the provided slots', () => {
    const { container } = render(<TopBar start={<span>Logo</span>} />)
    expect(screen.getByText('Logo')).toBeInTheDocument()
    expect(container.querySelector('header')).toBeInTheDocument()
  })

  it('applies bordered class when bordered=true', () => {
    render(<TopBar bordered start={<span>Logo</span>} />)
    expect(screen.getByRole('banner')).toHaveClass('border-b')
  })

  it('does not apply bordered class by default', () => {
    render(<TopBar start={<span>Logo</span>} />)
    expect(screen.getByRole('banner')).not.toHaveClass('border-b')
  })

  it('applies sticky class when sticky=true', () => {
    render(<TopBar sticky start={<span>Logo</span>} />)
    expect(screen.getByRole('banner')).toHaveClass('sticky')
  })

  it('adds a shadow after scrolling when sticky', () => {
    render(<TopBar sticky start={<span>Logo</span>} />)
    const header = screen.getByRole('banner')
    expect(header.className).not.toMatch(/shadow-/)
    Object.defineProperty(window, 'scrollY', { value: 100, configurable: true })
    fireEvent.scroll(window)
    expect(header.className).toMatch(/shadow-/)
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <TopBar
        bordered
        start={<span>Logo</span>}
        center="Título"
        end={<button type="button">Ação</button>}
      />,
    )
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
