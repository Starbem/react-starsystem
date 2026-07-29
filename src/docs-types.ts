import type { ComponentProps, ComponentType, ReactNode } from 'react'

export type ArgType =
  | { control: 'boolean' }
  | { control: 'select'; options: readonly string[] }
  | { control: 'text' }

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ComponentType's props generic needs `any` for generic component type
export type Meta<T extends ComponentType<any> = ComponentType<any>> = {
  title: string
  component?: T
  description?: ReactNode
  args?: Partial<ComponentProps<T>>
  argTypes?: Partial<Record<keyof ComponentProps<T>, ArgType>>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ComponentType's props generic needs `any` for generic component type
export type StoryObj<T extends ComponentType<any> = ComponentType<any>> = {
  args?: Partial<ComponentProps<T>>
  render?: (args: ComponentProps<T>) => ReactNode
}
