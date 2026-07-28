import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { DropdownMenu } from './DropdownMenu'

describe('DropdownMenu', () => {
  it('does not render items initially', () => {
    render(<DropdownMenu trigger={<button type="button">Abrir</button>} items={[{ label: 'Editar' }]} />)
    expect(screen.queryByText('Editar')).not.toBeInTheDocument()
  })

  it('opens the menu when trigger is clicked', async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu
        trigger={<button type="button">Abrir</button>}
        items={[{ label: 'Editar' }, { label: 'Excluir' }]}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Abrir' }))
    expect(await screen.findByRole('menuitem', { name: 'Editar' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Excluir' })).toBeInTheDocument()
  })

  it('renders separators and labels', async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu
        trigger={<button type="button">Abrir</button>}
        items={[{ type: 'label', label: 'Ações' }, { type: 'separator' }, { label: 'Editar' }]}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Abrir' }))
    expect(await screen.findByText('Ações')).toBeInTheDocument()
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('calls item onSelect and the top-level onSelect with the item value', async () => {
    const user = userEvent.setup()
    const itemOnSelect = vi.fn()
    const onSelect = vi.fn()
    render(
      <DropdownMenu
        trigger={<button type="button">Abrir</button>}
        onSelect={onSelect}
        items={[{ value: 'edit', label: 'Editar', onSelect: itemOnSelect }]}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Abrir' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Editar' }))
    expect(itemOnSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith('edit')
  })

  it('falls back to label when item has no value', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <DropdownMenu trigger={<button type="button">Abrir</button>} onSelect={onSelect} items={[{ label: 'Editar' }]} />,
    )
    await user.click(screen.getByRole('button', { name: 'Abrir' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Editar' }))
    expect(onSelect).toHaveBeenCalledWith('Editar')
  })

  it('does not call onSelect for a disabled item', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <DropdownMenu
        trigger={<button type="button">Abrir</button>}
        onSelect={onSelect}
        items={[{ label: 'Excluir', disabled: true }]}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Abrir' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Excluir' }))
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('toggles a checkbox item', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(
      <DropdownMenu
        trigger={<button type="button">Abrir</button>}
        items={[{ type: 'checkbox-item', label: 'Avatares', checked: false, onCheckedChange }]}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Abrir' }))
    await user.click(await screen.findByRole('menuitemcheckbox', { name: 'Avatares' }))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('renders a sub-menu trigger', async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu
        trigger={<button type="button">Abrir</button>}
        items={[{ type: 'sub-menu', label: 'Compartilhar', items: [{ label: 'Copiar link' }] }]}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Abrir' }))
    expect(await screen.findByText('Compartilhar')).toBeInTheDocument()
  })

  it('navigates items with arrow keys', async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu
        trigger={<button type="button">Abrir</button>}
        items={[{ label: 'Editar' }, { label: 'Excluir' }]}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Abrir' }))
    await screen.findByRole('menuitem', { name: 'Editar' })
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Editar' })).toHaveFocus()
  })

  it('closes when Escape is pressed', async () => {
    const user = userEvent.setup()
    render(<DropdownMenu trigger={<button type="button">Abrir</button>} items={[{ label: 'Editar' }]} />)
    await user.click(screen.getByRole('button', { name: 'Abrir' }))
    await screen.findByRole('menuitem', { name: 'Editar' })
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menuitem', { name: 'Editar' })).not.toBeInTheDocument())
  })

  it('has no a11y violations', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <DropdownMenu
        trigger={<button type="button">Abrir</button>}
        items={[{ label: 'Editar' }, { type: 'separator' }, { label: 'Excluir' }]}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Abrir' }))
    await screen.findByRole('menuitem', { name: 'Editar' })
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
