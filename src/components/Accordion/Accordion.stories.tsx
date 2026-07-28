import type { Meta, StoryObj } from '../../docs-types'
import { Accordion } from './Accordion'

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
}
export default meta
type Story = StoryObj<typeof Accordion>

const ITEMS = [
  {
    value: 'plans',
    trigger: 'Como funcionam os planos?',
    content: 'Cada plano inclui telemedicina 24h, nutrição e saúde mental, com limites variando por nível.',
  },
  {
    value: 'billing',
    trigger: 'Como funciona a cobrança?',
    content: 'A cobrança é mensal, por colaborador ativo no benefício.',
  },
  {
    value: 'support',
    trigger: 'Como falar com o suporte?',
    content: 'Pelo app do colaborador ou pelo portal RH, disponível 24h.',
  },
]

export const SingleCollapsible: Story = {
  render: () => <Accordion items={ITEMS} type="single" defaultValue="plans" />,
}

export const SingleNotCollapsible: Story = {
  render: () => <Accordion items={ITEMS} type="single" defaultValue="plans" collapsible={false} />,
}

export const Multiple: Story = {
  render: () => <Accordion items={ITEMS} type="multiple" defaultValue={['plans', 'billing']} />,
}

export const WithDisabledItem: Story = {
  render: () => (
    <Accordion
      items={[...ITEMS.slice(0, 2), { value: 'legacy', trigger: 'Item legado (desabilitado)', content: '—', disabled: true }]}
    />
  ),
}
