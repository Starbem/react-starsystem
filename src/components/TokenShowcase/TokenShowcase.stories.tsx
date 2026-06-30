import type { Meta, StoryObj } from '@storybook/react'
import { colors } from '../../tokens/colors'
import { fontSize, fontWeight } from '../../tokens/typography'
import { shadows, borderRadius } from '../../tokens/spacing'

const meta: Meta = {
  title: 'Tokens/Overview',
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj

const SwatchRow = ({ label, palette }: { label: string; palette: Record<string, string> }) => (
  <div style={{ marginBottom: 24 }}>
    <h3 style={{ marginBottom: 8, fontSize: 14, fontFamily: 'system-ui' }}>{label}</h3>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {(Object.entries(palette) as [string, string][]).map(([name, hex]) => (
        <div key={name} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 8,
              background: hex,
              border: '1px solid #eee',
              marginBottom: 4,
            }}
          />
          <div style={{ fontSize: 11, fontFamily: 'system-ui' }}>{name}</div>
          <div style={{ fontSize: 10, color: '#666', fontFamily: 'system-ui' }}>{hex}</div>
        </div>
      ))}
    </div>
  </div>
)

export const Colors: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <SwatchRow label="Primary (Orange — #FF5100)" palette={colors.primary} />
      <SwatchRow label="Secondary (Purple — #8660EC)" palette={colors.secondary} />
      <SwatchRow label="Terciary (Pink/Magenta — #ED2E98)" palette={colors.terciary} />
      <SwatchRow label="Neutral" palette={colors.neutral} />
    </div>
  ),
}

export const Typography: Story = {
  render: () => (
    <div style={{ fontFamily: 'system-ui', padding: 24 }}>
      {(Object.entries(fontSize) as [string, string][]).map(([name, size]) => (
        <div key={name} style={{ marginBottom: 12 }}>
          <span
            style={{
              fontSize: size,
              fontWeight: name.startsWith('h') ? fontWeight.bold : fontWeight.regular,
            }}
          >
            {name} — {size}
          </span>
        </div>
      ))}
    </div>
  ),
}

export const Elevation: Story = {
  render: () => (
    <div
      style={{ display: 'flex', gap: 24, flexWrap: 'wrap', padding: 40, background: '#f9f9f9' }}
    >
      {(Object.entries(shadows) as [string, string][]).map(([name, shadow]) => (
        <div
          key={name}
          style={{
            width: 100,
            height: 100,
            borderRadius: borderRadius.md,
            background: '#fff',
            boxShadow: shadow === 'none' ? undefined : shadow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontFamily: 'system-ui',
          }}
        >
          {name}
        </div>
      ))}
    </div>
  ),
}
