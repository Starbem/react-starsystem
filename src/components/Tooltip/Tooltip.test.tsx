import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  it('does not render the tooltip content initially', () => {
    render(
      <Tooltip content="Dica">
        <button type="button">Trigger</button>
      </Tooltip>,
    )
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('shows the tooltip content on hover', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Dica útil" delay={0}>
        <button type="button">Trigger</button>
      </Tooltip>,
    )
    await user.hover(screen.getByRole('button', { name: 'Trigger' }))
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Dica útil')
  })

  it('hides the tooltip content when Escape is pressed', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Dica útil" delay={0}>
        <button type="button">Trigger</button>
      </Tooltip>,
    )
    const trigger = screen.getByRole('button', { name: 'Trigger' })
    await user.hover(trigger)
    await screen.findByRole('tooltip')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
  })

  it('renders rich content', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip
        content={
          <div>
            <strong>Título</strong>
            <span>Descrição</span>
          </div>
        }
        delay={0}
      >
        <button type="button">Trigger</button>
      </Tooltip>,
    )
    await user.hover(screen.getByRole('button', { name: 'Trigger' }))
    expect(await screen.findByText('Título')).toBeInTheDocument()
    expect(screen.getByText('Descrição')).toBeInTheDocument()
  })

  it('never shows the tooltip when disabled', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Dica" disabled>
        <button type="button">Trigger</button>
      </Tooltip>,
    )
    await user.hover(screen.getByRole('button', { name: 'Trigger' }))
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('renders the trigger unwrapped when disabled', () => {
    render(
      <Tooltip content="Dica" disabled>
        <button type="button">Trigger</button>
      </Tooltip>,
    )
    expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Tooltip content="Dica útil" delay={0}>
        <button type="button">Trigger</button>
      </Tooltip>,
    )
    await user.hover(screen.getByRole('button', { name: 'Trigger' }))
    await screen.findByRole('tooltip')
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
