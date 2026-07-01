import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Radio } from './Radio'
import { RadioGroup } from './RadioGroup'

function renderGroup(props: Partial<ComponentProps<typeof RadioGroup>> = {}) {
  const handleChange = vi.fn()
  render(
    <RadioGroup label="Plan" value="basic" onChange={handleChange} {...props}>
      <Radio value="basic" label="Basic" />
      <Radio value="pro" label="Pro" />
      <Radio value="enterprise" label="Enterprise" disabled />
    </RadioGroup>,
  )
  return { handleChange }
}

describe('RadioGroup + Radio', () => {
  it('renders all radios inside role=radiogroup', () => {
    renderGroup()
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(3)
  })

  it('marks the radio matching value as checked, others unchecked', () => {
    renderGroup()
    const radios = screen.getAllByRole('radio')
    expect(radios[0]).toHaveAttribute('aria-checked', 'true')
    expect(radios[1]).toHaveAttribute('aria-checked', 'false')
    expect(radios[2]).toHaveAttribute('aria-checked', 'false')
  })

  it('calls onChange with clicked radio value', async () => {
    const { handleChange } = renderGroup()
    await userEvent.click(screen.getByText('Pro'))
    expect(handleChange).toHaveBeenCalledWith('pro')
  })

  it('only the checked radio has tabIndex=0, others -1', () => {
    renderGroup()
    const radios = screen.getAllByRole('radio')
    expect(radios[0]).toHaveAttribute('tabIndex', '0')
    expect(radios[1]).toHaveAttribute('tabIndex', '-1')
  })

  it('defaults tabIndex=0 to first item when nothing is checked', () => {
    renderGroup({ value: undefined })
    const radios = screen.getAllByRole('radio')
    expect(radios[0]).toHaveAttribute('tabIndex', '0')
  })

  it('ArrowDown selects next enabled radio', async () => {
    const { handleChange } = renderGroup()
    screen.getAllByRole('radio')[0].focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(handleChange).toHaveBeenCalledWith('pro')
  })

  it('ArrowUp wraps to previous enabled radio', async () => {
    const { handleChange } = renderGroup({ value: 'basic' })
    screen.getAllByRole('radio')[0].focus()
    await userEvent.keyboard('{ArrowUp}')
    // basic is index 0; enabled indexes are [0,1] (enterprise disabled) -> wraps to index 1 (pro)
    expect(handleChange).toHaveBeenCalledWith('pro')
  })

  it('skips disabled radios during arrow navigation', async () => {
    const { handleChange } = renderGroup({ value: 'pro' })
    screen.getAllByRole('radio')[1].focus()
    await userEvent.keyboard('{ArrowDown}')
    // pro (index1) -> next enabled wraps back to basic (index0), never lands on disabled enterprise
    expect(handleChange).toHaveBeenCalledWith('basic')
  })

  it('does not call onChange when RadioGroup disabled', async () => {
    const { handleChange } = renderGroup({ disabled: true })
    await userEvent.click(screen.getByText('Pro'))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('individual disabled radio ignores clicks even if group enabled', async () => {
    const { handleChange } = renderGroup()
    await userEvent.click(screen.getByText('Enterprise'))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('renders supporting text', () => {
    render(
      <RadioGroup value="a" onChange={vi.fn()}>
        <Radio value="a" label="Option A" supportingText="Helper text" />
      </RadioGroup>,
    )
    expect(screen.getByText('Helper text')).toBeInTheDocument()
  })

  it('applies horizontal orientation layout', () => {
    const { container } = render(
      <RadioGroup value="a" onChange={vi.fn()} orientation="horizontal">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    )
    expect(container.querySelector('[role="radiogroup"]')).toHaveClass('flex-row')
  })
})
