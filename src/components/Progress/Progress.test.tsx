import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { Progress, ProgressCircle } from './Progress'

describe('Progress', () => {
  it('renders a progressbar with the right aria attributes', () => {
    render(<Progress value={64} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '64')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
  })

  it('clamps the fill width between 0 and 100 percent', () => {
    const { container } = render(<Progress value={150} />)
    const fill = container.querySelector('[data-progress-fill]')
    expect(fill).toHaveStyle({ width: '100%' })
  })

  it('clamps the fill width at 0 percent for negative values', () => {
    const { container } = render(<Progress value={-10} />)
    const fill = container.querySelector('[data-progress-fill]')
    expect(fill).toHaveStyle({ width: '0%' })
  })

  it('shows the label and rounded percentage when showValue is set', () => {
    render(<Progress value={64.6} label="Perfil completo" showValue />)
    expect(screen.getByText('Perfil completo')).toBeInTheDocument()
    expect(screen.getByText('65%')).toBeInTheDocument()
  })

  it('omits aria-valuenow when indeterminate', () => {
    render(<Progress indeterminate label="Enviando…" />)
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow')
  })

  it('applies the success tone class', () => {
    const { container } = render(<Progress value={40} tone="success" />)
    expect(container.querySelector('[data-progress-fill]')).toHaveClass('bg-success-base')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Progress value={64} label="Perfil completo" showValue />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('ProgressCircle', () => {
  it('renders a progressbar with the rounded percentage in aria-valuenow', () => {
    render(<ProgressCircle value={72} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '72')
  })

  it('shows the percentage label by default', () => {
    render(<ProgressCircle value={72} />)
    expect(screen.getByText('72%')).toBeInTheDocument()
  })

  it('renders custom center children instead of the percentage', () => {
    render(<ProgressCircle value={72}>2/3</ProgressCircle>)
    expect(screen.getByText('2/3')).toBeInTheDocument()
    expect(screen.queryByText('72%')).not.toBeInTheDocument()
  })

  it('omits aria-valuenow when indeterminate', () => {
    render(<ProgressCircle indeterminate />)
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<ProgressCircle value={30} tone="warning" aria-label="Processing" />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})
