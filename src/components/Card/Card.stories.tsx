import type { Meta, StoryObj } from '../../docs-types'
import { Badge } from '../Badge'
import { Button } from '../Button'
import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
}
export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="max-w-[320px]">
      <Card.Header>
        <strong className="text-[16px]">Plano Premium</strong>
        <Badge size="sm" variant="success">
          Ativo
        </Badge>
      </Card.Header>
      <Card.Body>
        <p className="text-[14px] text-[#667085] dark:text-[#98A2B3]">
          Telemedicina 24h, nutrição e saúde mental inclusos.
        </p>
      </Card.Body>
      <Card.Footer>
        <Button size="sm" variant="outline">
          Detalhes
        </Button>
        <Button size="sm">Gerenciar</Button>
      </Card.Footer>
    </Card>
  ),
}

export const Outlined: Story = {
  render: () => (
    <Card variant="outlined" className="max-w-[320px]">
      <Card.Body>
        <p className="text-[14px]">Card com borda destacada.</p>
      </Card.Body>
    </Card>
  ),
}

export const Elevated: Story = {
  render: () => (
    <Card variant="elevated" className="max-w-[320px]">
      <Card.Body>
        <p className="text-[14px]">Card com sombra.</p>
      </Card.Body>
    </Card>
  ),
}

export const Clickable: Story = {
  render: () => (
    <Card variant="elevated" onClick={() => alert('Card clicado')} className="max-w-[320px]">
      <Card.Body>
        <strong className="text-[14px]">Ver relatório</strong>
        <p className="text-[14px] text-[#667085] dark:text-[#98A2B3]">
          Clique em qualquer lugar do card.
        </p>
      </Card.Body>
    </Card>
  ),
}

export const Loading: Story = {
  render: () => (
    <Card loading className="max-w-[320px]">
      <Card.Body>
        <p>Conteúdo real (não aparece durante loading)</p>
      </Card.Body>
    </Card>
  ),
}

export const NoPadding: Story = {
  render: () => (
    <Card padding="none" className="max-w-[320px] overflow-hidden">
      <img src="https://placehold.co/320x120" alt="" className="w-full h-[120px] object-cover" />
      <div className="p-[16px]">
        <p className="text-[14px]">
          Conteúdo com imagem de largura total (padding=none no Card, padding manual no conteúdo).
        </p>
      </div>
    </Card>
  ),
}
