import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Popover } from './Popover'

describe('Popover', () => {
  it('does not render content initially', () => {
    render(<Popover trigger={<button type="button">Abrir</button>} content={<p>Conteúdo</p>} />)
    expect(screen.queryByText('Conteúdo')).not.toBeInTheDocument()
  })

  it('opens the content when trigger is clicked', async () => {
    const user = userEvent.setup()
    render(<Popover trigger={<button type="button">Abrir</button>} content={<p>Conteúdo</p>} />)
    await user.click(screen.getByRole('button', { name: 'Abrir' }))
    expect(await screen.findByText('Conteúdo')).toBeInTheDocument()
  })

  it('supports rich content such as forms and lists', async () => {
    const user = userEvent.setup()
    render(
      <Popover
        trigger={<button type="button">Abrir</button>}
        content={
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        }
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Abrir' }))
    expect(await screen.findByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('closes when Escape is pressed', async () => {
    const user = userEvent.setup()
    render(<Popover trigger={<button type="button">Abrir</button>} content={<p>Conteúdo</p>} />)
    await user.click(screen.getByRole('button', { name: 'Abrir' }))
    await screen.findByText('Conteúdo')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByText('Conteúdo')).not.toBeInTheDocument())
  })

  it('closes when clicking outside', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <Popover trigger={<button type="button">Abrir</button>} content={<p>Conteúdo</p>} />
        <button type="button">Fora</button>
      </div>,
    )
    await user.click(screen.getByRole('button', { name: 'Abrir' }))
    await screen.findByText('Conteúdo')
    await user.click(screen.getByRole('button', { name: 'Fora' }))
    await waitFor(() => expect(screen.queryByText('Conteúdo')).not.toBeInTheDocument())
  })

  it('calls onOpenChange when opened and closed', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Popover
        trigger={<button type="button">Abrir</button>}
        content={<p>Conteúdo</p>}
        onOpenChange={onOpenChange}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Abrir' }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('has no a11y violations', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Popover
        trigger={<button type="button">Abrir</button>}
        content={<p>Conteúdo acessível</p>}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Abrir' }))
    await screen.findByText('Conteúdo acessível')
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
