import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { Accordion } from './Accordion'

const ITEMS = [
  { value: 'a', trigger: 'Pergunta A', content: 'Resposta A' },
  { value: 'b', trigger: 'Pergunta B', content: 'Resposta B' },
  { value: 'c', trigger: 'Pergunta C', content: 'Resposta C' },
]

describe('Accordion', () => {
  it('renders all triggers', () => {
    render(<Accordion items={ITEMS} />)
    expect(screen.getByRole('button', { name: 'Pergunta A' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pergunta B' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pergunta C' })).toBeInTheDocument()
  })

  it('expands an item on click and sets aria-expanded', async () => {
    const user = userEvent.setup()
    render(<Accordion items={ITEMS} />)
    const trigger = screen.getByRole('button', { name: 'Pergunta A' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Resposta A')).toBeVisible()
  })

  it('sets aria-controls pointing to the content region', async () => {
    const user = userEvent.setup()
    render(<Accordion items={ITEMS} />)
    const trigger = screen.getByRole('button', { name: 'Pergunta A' })
    await user.click(trigger)
    const controlsId = trigger.getAttribute('aria-controls')
    expect(controlsId).toBeTruthy()
    expect(document.getElementById(controlsId!)).toHaveTextContent('Resposta A')
  })

  it('respects defaultValue for single type', () => {
    render(<Accordion items={ITEMS} type="single" defaultValue="b" />)
    expect(screen.getByRole('button', { name: 'Pergunta B' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('closes the previously open item when another is opened (type=single)', async () => {
    const user = userEvent.setup()
    render(<Accordion items={ITEMS} type="single" defaultValue="a" />)
    await user.click(screen.getByRole('button', { name: 'Pergunta B' }))
    expect(screen.getByRole('button', { name: 'Pergunta A' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(screen.getByRole('button', { name: 'Pergunta B' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('allows multiple items open at once (type=multiple)', async () => {
    const user = userEvent.setup()
    render(<Accordion items={ITEMS} type="multiple" />)
    await user.click(screen.getByRole('button', { name: 'Pergunta A' }))
    await user.click(screen.getByRole('button', { name: 'Pergunta B' }))
    expect(screen.getByRole('button', { name: 'Pergunta A' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Pergunta B' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('does not toggle a disabled item', async () => {
    const user = userEvent.setup()
    render(
      <Accordion
        items={[
          ...ITEMS.slice(0, 2),
          { value: 'd', trigger: 'Pergunta D', content: 'D', disabled: true },
        ]}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Pergunta D' }))
    expect(screen.getByRole('button', { name: 'Pergunta D' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('navigates triggers with arrow keys', async () => {
    const user = userEvent.setup()
    render(<Accordion items={ITEMS} />)
    screen.getByRole('button', { name: 'Pergunta A' }).focus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('button', { name: 'Pergunta B' })).toHaveFocus()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Accordion items={ITEMS} defaultValue="a" />)
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
