import { type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  name: string
  size?: number
  fill?: boolean
  label?: string
}

// Star System always renders Material Symbols Outlined at weight 200; consumers
// must load the font themselves via the `material-symbols` peer dependency
// (e.g. `import 'material-symbols/outlined.css'`).
const WEIGHT = 200

export function Icon({ name, size = 24, fill = false, label, className, style, ...props }: IconProps) {
  return (
    <span
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      className={cn('material-symbols-outlined select-none', className)}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${WEIGHT}, 'GRAD' 0, 'opsz' ${size}`,
        ...style,
      }}
      {...props}
    >
      {name}
    </span>
  )
}
