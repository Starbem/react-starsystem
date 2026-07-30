import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { IconButton } from './IconButton'

describe('IconButton', () => {
  it('renders a button with the accessible label', () => {
    render(<IconButton icon="close" label="Fechar" />)
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeInTheDocument()
  })

  it('sets title to the label as well', () => {
    render(<IconButton icon="close" label="Fechar" />)
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Fechar')
  })

  it('applies the ghost variant by default', () => {
    render(<IconButton icon="close" label="Fechar" />)
    expect(screen.getByRole('button')).toHaveClass('bg-transparent')
  })

  it('applies the solid variant', () => {
    render(<IconButton icon="videocam" variant="solid" label="Iniciar vídeo" />)
    expect(screen.getByRole('button')).toHaveClass('bg-secondary-base')
  })

  it('applies the outline variant', () => {
    render(<IconButton icon="more_vert" variant="outline" label="Mais opções" />)
    expect(screen.getByRole('button')).toHaveClass('border')
  })

  it('applies the pill class when pill is true', () => {
    render(<IconButton icon="close" label="Fechar" pill />)
    expect(screen.getByRole('button')).toHaveClass('rounded-full')
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<IconButton icon="close" label="Fechar" onClick={handleClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('has no a11y violations', async () => {
    const { container } = render(<IconButton icon="close" label="Fechar" />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})
