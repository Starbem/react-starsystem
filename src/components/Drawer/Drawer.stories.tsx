import { useState } from 'react'
import type { Meta, StoryObj } from '../../docs-types'
import { Button } from '../Button'
import { Drawer } from './Drawer'

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
}
export default meta
type Story = StoryObj<typeof Drawer>

function DrawerDemo({
  position,
  size,
}: {
  position?: 'left' | 'right' | 'bottom'
  size?: 'sm' | 'md' | 'lg' | 'full'
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir drawer</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        position={position}
        size={size}
        title="Detalhes"
      >
        <p className="text-[14px] leading-[20px]">Conteúdo do drawer vai aqui.</p>
      </Drawer>
    </>
  )
}

export const Right: Story = {
  render: () => <DrawerDemo position="right" />,
}

export const Left: Story = {
  render: () => <DrawerDemo position="left" />,
}

export const Bottom: Story = {
  render: () => <DrawerDemo position="bottom" />,
}

export const Small: Story = {
  render: () => <DrawerDemo size="sm" />,
}

export const Large: Story = {
  render: () => <DrawerDemo size="lg" />,
}

export const FullScreen: Story = {
  render: () => <DrawerDemo size="full" />,
}
