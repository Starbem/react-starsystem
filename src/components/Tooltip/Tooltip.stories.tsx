import type { Meta, StoryObj } from '../../docs-types'
import { Button } from '../Button'
import { Tooltip } from './Tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
}
export default meta
type Story = StoryObj<typeof Tooltip>

export const Top: Story = {
  render: () => (
    <Tooltip content="Informação adicional" side="top">
      <Button>Passe o mouse</Button>
    </Tooltip>
  ),
}

export const Bottom: Story = {
  render: () => (
    <Tooltip content="Informação adicional" side="bottom">
      <Button>Passe o mouse</Button>
    </Tooltip>
  ),
}

export const Left: Story = {
  render: () => (
    <Tooltip content="Informação adicional" side="left">
      <Button>Passe o mouse</Button>
    </Tooltip>
  ),
}

export const Right: Story = {
  render: () => (
    <Tooltip content="Informação adicional" side="right">
      <Button>Passe o mouse</Button>
    </Tooltip>
  ),
}

export const RichContent: Story = {
  render: () => (
    <Tooltip
      content={
        <div className="flex flex-col gap-[4px]">
          <strong>Plano Premium</strong>
          <span>Inclui telemedicina 24h e nutrição.</span>
        </div>
      }
    >
      <Button variant="outline">Ver detalhes do plano</Button>
    </Tooltip>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Tooltip content="Nunca aparece" disabled>
      <Button>Tooltip desabilitado</Button>
    </Tooltip>
  ),
}

export const CustomDelay: Story = {
  render: () => (
    <Tooltip content="Aparece após 800ms" delay={800}>
      <Button>Delay maior</Button>
    </Tooltip>
  ),
}

export const LightTone: Story = {
  render: () => (
    <Tooltip content="Light tooltip" tone="light">
      <button type="button">Hover me</button>
    </Tooltip>
  ),
}

export const BrandTone: Story = {
  render: () => (
    <Tooltip content="Brand tooltip" tone="brand">
      <button type="button">Hover me</button>
    </Tooltip>
  ),
}

export const Rich: Story = {
  render: () => (
    <Tooltip title="Keyboard shortcut" content="Press Cmd+K to open the command palette">
      <button type="button">Hover me</button>
    </Tooltip>
  ),
}
