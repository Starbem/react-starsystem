import type { Meta, StoryObj } from '../../docs-types'
import { BarChart, Chart, DonutChart, LineChart, Sparkline } from './Chart'

const meta: Meta<typeof Chart> = {
  title: 'Components/Chart',
  component: Chart,
}
export default meta
type Story = StoryObj<typeof Chart>

export const LineChartDefault: Story = {
  render: () => (
    <LineChart data={[12, 18, 15, 22, 19, 26, 24]} labels={['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']} />
  ),
}

export const BarChartDefault: Story = {
  render: () => (
    <BarChart
      data={[
        { label: 'Jan', value: 8 },
        { label: 'Fev', value: 14 },
        { label: 'Mar', value: 11, color: 'var(--color-secondary-base)' },
      ]}
    />
  ),
}

export const DonutChartDefault: Story = {
  render: () => (
    <DonutChart
      centerValue="78%"
      centerLabel="Adesão"
      segments={[
        { label: 'Concluídas', value: 78 },
        { label: 'Pendentes', value: 22 },
      ]}
    />
  ),
}

export const SparklineDefault: Story = {
  render: () => <Sparkline data={[3, 5, 4, 8, 6, 9, 7]} />,
}

export const UnifiedEntry: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Chart type="line" data={[12, 18, 15, 22]} />
      <Chart type="bar" data={[{ label: 'Jan', value: 8 }, { label: 'Fev', value: 14 }]} />
      <Chart type="donut" segments={[{ label: 'A', value: 60 }, { label: 'B', value: 40 }]} />
    </div>
  ),
}
