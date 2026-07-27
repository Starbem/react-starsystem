import type { ComponentProps, ComponentType, ReactNode } from 'react'

export type ArgType =
  | { control: 'boolean' }
  | { control: 'select'; options: readonly string[] }
  | { control: 'text' }

export type Meta<T extends ComponentType<any> = ComponentType<any>> = {
  title: string
  component?: T
  args?: Partial<ComponentProps<T>>
  argTypes?: Partial<Record<keyof ComponentProps<T>, ArgType>>
}

export type StoryObj<T extends ComponentType<any> = ComponentType<any>> = {
  args?: Partial<ComponentProps<T>>
  render?: (args: ComponentProps<T>) => ReactNode
}
