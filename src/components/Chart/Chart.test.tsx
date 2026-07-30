import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { BarChart, Chart, DonutChart, LineChart, Sparkline } from './Chart'

describe('Sparkline', () => {
  it('renders an svg path for the data', () => {
    const { container } = render(<Sparkline data={[3, 5, 4, 8, 6]} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0)
  })
})

describe('LineChart', () => {
  it('renders one dot per data point', () => {
    const { container } = render(<LineChart data={[12, 18, 15, 22]} />)
    expect(container.querySelectorAll('circle').length).toBe(4)
  })

  it('renders x-axis labels when provided', () => {
    render(<LineChart data={[1, 2, 3]} labels={['Seg', 'Ter', 'Qua']} />)
    expect(screen.getByText('Seg')).toBeInTheDocument()
  })
})

describe('BarChart', () => {
  it('renders one bar rect per datum', () => {
    const { container } = render(
      <BarChart data={[{ label: 'Jan', value: 8 }, { label: 'Fev', value: 14 }]} />,
    )
    expect(container.querySelectorAll('rect').length).toBe(2)
  })

  it('renders each bar label', () => {
    render(<BarChart data={[{ label: 'Jan', value: 8 }, { label: 'Fev', value: 14 }]} />)
    expect(screen.getByText('Jan')).toBeInTheDocument()
    expect(screen.getByText('Fev')).toBeInTheDocument()
  })
})

describe('DonutChart', () => {
  it('renders one arc circle per segment plus the background circle', () => {
    const { container } = render(
      <DonutChart segments={[{ label: 'Concluídas', value: 78 }, { label: 'Pendentes', value: 22 }]} />,
    )
    expect(container.querySelectorAll('circle').length).toBe(3)
  })

  it('renders the center value and label', () => {
    render(<DonutChart segments={[{ label: 'A', value: 1 }]} centerValue="78%" centerLabel="Adesão" />)
    expect(screen.getByText('78%')).toBeInTheDocument()
    expect(screen.getByText('Adesão')).toBeInTheDocument()
  })

  it('renders the legend with percentages', () => {
    render(<DonutChart segments={[{ label: 'Concluídas', value: 78 }, { label: 'Pendentes', value: 22 }]} />)
    expect(screen.getByText('78%')).toBeInTheDocument()
  })
})

describe('Chart', () => {
  it('dispatches to LineChart by default', () => {
    const { container } = render(<Chart data={[1, 2, 3]} />)
    expect(container.querySelectorAll('circle').length).toBe(3)
  })

  it('dispatches to BarChart when type="bar"', () => {
    const { container } = render(<Chart type="bar" data={[{ label: 'Jan', value: 8 }]} />)
    expect(container.querySelectorAll('rect').length).toBe(1)
  })

  it('has no a11y violations', async () => {
    const { container } = render(<LineChart data={[1, 2, 3]} labels={['Seg', 'Ter', 'Qua']} />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})
