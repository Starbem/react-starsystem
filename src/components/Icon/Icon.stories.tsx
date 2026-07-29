import type { Meta, StoryObj } from '../../docs-types'
import { Icon } from './Icon'

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  description: (
    <>
      Renderiza ícones do{' '}
      <a
        href="https://fonts.google.com/icons?icon.set=Material+Symbols&icon.style=Outlined"
        target="_blank"
        rel="noreferrer"
        className="text-[#FF5100] underline"
      >
        Material Symbols
      </a>{' '}
      (variante Outlined, sempre em espessura 200). O link acima mostra todos os nomes de ícone
      disponíveis para uso — qualquer nome de lá funciona no componente <code>Icon</code>. Um
      subset curado também pode ser explorado em <strong>Icons/Gallery</strong> no menu ao lado.
    </>
  ),
  args: { name: 'home' },
}
export default meta
type Story = StoryObj<typeof Icon>

export const Default: Story = {}

export const CustomSize: Story = {
  args: { name: 'settings', size: 32 },
}

export const Filled: Story = {
  args: { name: 'favorite', fill: true },
}

export const WithAccessibleLabel: Story = {
  args: { name: 'notifications', label: 'Notificações' },
}

export const CommonIcons: Story = {
  render: () => (
    <div className="flex gap-4 items-center text-[#344054] dark:text-[#D0D5DD]">
      <Icon name="home" />
      <Icon name="settings" />
      <Icon name="person" />
      <Icon name="notifications" />
      <Icon name="search" />
      <Icon name="favorite" fill />
      <Icon name="check_circle" />
      <Icon name="close" />
    </div>
  ),
}
