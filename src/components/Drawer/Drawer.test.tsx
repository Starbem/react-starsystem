import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Drawer } from './Drawer'

describe('Drawer', () => {
  it('does not render content when closed', () => {
    render(
      <Drawer open={false} onClose={() => {}} title="Título">
        <p>Conteúdo</p>
      </Drawer>,
    )
    expect(screen.queryByText('Conteúdo')).not.toBeInTheDocument()
  })

  it('renders title and children when open', () => {
    render(
      <Drawer open onClose={() => {}} title="Detalhes">
        <p>Conteúdo</p>
      </Drawer>,
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Detalhes')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Drawer open onClose={onClose} title="Detalhes">
        <p>Conteúdo</p>
      </Drawer>,
    )
    await user.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Drawer open onClose={onClose} title="Detalhes">
        <p>Conteúdo</p>
      </Drawer>,
    )
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('applies right position classes by default', () => {
    render(
      <Drawer open onClose={() => {}} title="Detalhes">
        <p>Conteúdo</p>
      </Drawer>,
    )
    expect(screen.getByRole('dialog')).toHaveClass('right-0')
  })

  it('applies left position classes', () => {
    render(
      <Drawer open onClose={() => {}} position="left" title="Detalhes">
        <p>Conteúdo</p>
      </Drawer>,
    )
    expect(screen.getByRole('dialog')).toHaveClass('left-0')
  })

  it('applies bottom position classes', () => {
    render(
      <Drawer open onClose={() => {}} position="bottom" title="Detalhes">
        <p>Conteúdo</p>
      </Drawer>,
    )
    expect(screen.getByRole('dialog')).toHaveClass('bottom-0')
  })

  it('applies size classes', () => {
    render(
      <Drawer open onClose={() => {}} size="lg" title="Detalhes">
        <p>Conteúdo</p>
      </Drawer>,
    )
    expect(screen.getByRole('dialog')).toHaveClass('w-[560px]')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Drawer open onClose={() => {}} title="Detalhes">
        <p>Conteúdo</p>
      </Drawer>,
    )
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
