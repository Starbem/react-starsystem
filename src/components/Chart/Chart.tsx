import { useState, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

const PALETTE = [
  'var(--color-primary-base)',
  'var(--color-secondary-base)',
  'var(--color-terciary-base)',
  'var(--color-success-base)',
  'var(--color-warning-base)',
]

function buildPath(data: number[], w: number, h: number, pad: number, min?: number, max?: number) {
  const effMax = max ?? Math.max(...data, 1)
  const effMin = min ?? Math.min(...data, 0)
  const span = effMax - effMin || 1
  const step = (w - pad * 2) / (data.length - 1 || 1)
  return data.map((v, i) => {
    const x = pad + i * step
    const y = h - pad - ((v - effMin) / span) * (h - pad * 2)
    return { x, y }
  })
}

function niceMax(v: number) {
  if (v <= 0) return 1
  const pow = Math.pow(10, Math.floor(Math.log10(v)))
  const n = v / pow
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10
  return step * pow
}

const fmtTick = (v: number) => {
  if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`
  return Number.isInteger(v) ? String(v) : v.toFixed(1)
}

function YAxis({
  min,
  max,
  rows,
  pad,
  format = fmtTick,
}: {
  min: number
  max: number
  rows: number
  pad: number
  format?: (value: number) => string
}) {
  const ticks = Array.from({ length: rows + 1 }, (_, i) => max - ((max - min) * i) / rows)
  return (
    <div
      className="flex flex-col justify-between text-[11px] leading-none text-ink-500 dark:text-ink-300"
      style={{ paddingTop: pad, paddingBottom: pad }}
    >
      {ticks.map((t, i) => (
        <span key={i}>{format(t)}</span>
      ))}
    </div>
  )
}

export interface SparklineProps extends HTMLAttributes<HTMLSpanElement> {
  data: number[]
  width?: number
  height?: number
  color?: string
  area?: boolean
}

export function Sparkline({
  data = [],
  width = 96,
  height = 28,
  color = 'var(--color-primary-base)',
  area = true,
  className,
  ...rest
}: SparklineProps) {
  const pts = buildPath(data, width, height, 3)
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const fill = `${line} L${(width - 3).toFixed(1)} ${height - 3} L3 ${height - 3} Z`
  return (
    <span className={cn('inline-block', className)} {...rest}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {area && <path d={fill} fill={color} opacity="0.14" />}
        <path
          d={line}
          fill="none"
          style={{ stroke: color }}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export interface LineChartProps extends HTMLAttributes<HTMLDivElement> {
  data: number[]
  labels?: string[]
  height?: number
  color?: string
  area?: boolean
  showDots?: boolean
  grid?: boolean
  yAxis?: boolean
  yTickFormat?: (value: number) => string
  tooltip?: boolean
}

export function LineChart({
  data = [],
  labels = [],
  height = 200,
  color = 'var(--color-primary-base)',
  area = true,
  showDots = true,
  grid = true,
  yAxis = true,
  yTickFormat,
  tooltip = true,
  className,
  ...rest
}: LineChartProps) {
  const W = 360
  const H = height
  const pad = 28
  const rows = 4
  const [hover, setHover] = useState<number | null>(null)
  const dMax = Math.max(...data, 1)
  const dMin = Math.min(...data, 0)
  const max = niceMax(dMax)
  const min = dMin < 0 ? -niceMax(-dMin) : 0
  const pts = buildPath(data, W, H, pad, min, max)
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const fill = `${line} L${W - pad} ${H - pad} L${pad} ${H - pad} Z`

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tooltip || data.length === 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    const f = (e.clientX - rect.left) / rect.width
    const t = (f - pad / W) / ((W - pad * 2) / W)
    setHover(Math.max(0, Math.min(data.length - 1, Math.round(t * (data.length - 1)))))
  }
  const hp = hover != null ? pts[hover] : null

  return (
    <div className={cn('w-full', className)} {...rest}>
      <div className="flex gap-2">
        {yAxis && <YAxis min={min} max={max} rows={rows} pad={pad} format={yTickFormat} />}
        <div className="relative flex-1" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height, width: '100%' }}>
            {grid &&
              Array.from({ length: rows + 1 }).map((_, i) => {
                const y = pad + (i * (H - pad * 2)) / rows
                return (
                  <line
                    key={i}
                    x1={pad}
                    y1={y}
                    x2={W - pad}
                    y2={y}
                    className="stroke-ink-100 dark:stroke-ink-700"
                  />
                )
              })}
            {area && (
              <>
                <defs>
                  <linearGradient id="sbLineFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={color} stopOpacity="0.28" />
                    <stop offset="1" stopColor={color} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={fill} fill="url(#sbLineFill)" />
              </>
            )}
            <path d={line} fill="none" style={{ stroke: color }} strokeWidth="2" />
            {showDots &&
              pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="white" strokeWidth="2" style={{ stroke: color }} />
              ))}
          </svg>
          {hp && (
            <div
              className="pointer-events-none absolute top-0 rounded-md bg-ink-900 px-2 py-1 text-[11px] text-white dark:bg-ink-700"
              style={{ left: `${(hp.x / W) * 100}%`, top: hp.y }}
            >
              <span>{data[hover as number]}</span>
              {labels[hover as number] && <span className="ml-1 opacity-70">{labels[hover as number]}</span>}
            </div>
          )}
        </div>
      </div>
      {labels.length > 0 && (
        <div
          className="flex justify-between text-[11px] text-ink-500 dark:text-ink-300"
          style={{ paddingLeft: yAxis ? 44 : 0 }}
        >
          {labels.map((l, i) => (
            <span
              key={i}
              className={hover === i ? 'font-medium text-ink-900 dark:text-ink-100' : undefined}
            >
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export interface BarDatum {
  label: string
  value: number
  color?: string
}

export interface BarChartProps extends HTMLAttributes<HTMLDivElement> {
  data: BarDatum[]
  height?: number
  showValues?: boolean
  grid?: boolean
  yAxis?: boolean
  yTickFormat?: (value: number) => string
  tooltip?: boolean
}

export function BarChart({
  data = [],
  height = 200,
  showValues = true,
  grid = true,
  yAxis = true,
  yTickFormat,
  className,
  ...rest
}: BarChartProps) {
  const W = 360
  const H = height
  const pad = 28
  const gap = 12
  const botPad = 36
  const rows = 4
  const max = niceMax(Math.max(...data.map((d) => d.value), 1))
  const plotH = H - pad - botPad
  const bw = (W - pad * 2 - gap * (data.length - 1)) / data.length
  const colW = bw + gap

  return (
    <div className={cn('w-full', className)} {...rest}>
      <div className="flex gap-2">
        {yAxis && (
          <div
            className="flex flex-col justify-between text-[11px] leading-none text-ink-500 dark:text-ink-300"
            style={{ paddingTop: pad, paddingBottom: botPad }}
          >
            {Array.from({ length: rows + 1 }, (_, i) => (
              <span key={i}>{(yTickFormat ?? fmtTick)(max - (max * i) / rows)}</span>
            ))}
          </div>
        )}
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height, width: '100%' }}>
          {grid &&
            Array.from({ length: rows + 1 }).map((_, i) => {
              const y = pad + (i * plotH) / rows
              return (
                <line
                  key={i}
                  x1={pad}
                  y1={y}
                  x2={W - pad}
                  y2={y}
                  className="stroke-ink-100 dark:stroke-ink-700"
                />
              )
            })}
          {data.map((d, i) => {
            const bh = (d.value / max) * plotH
            const x = pad + i * colW
            const y = H - botPad - bh
            return (
              <g key={i}>
                <rect x={x} y={y} width={bw} height={bh} rx="6" style={{ fill: d.color ?? PALETTE[i % PALETTE.length] }} />
                {showValues && (
                  <text
                    x={x + bw / 2}
                    y={y - 6}
                    textAnchor="middle"
                    className="fill-ink-900 text-[11px] dark:fill-ink-100"
                  >
                    {d.value}
                  </text>
                )}
                <text
                  x={x + bw / 2}
                  y={H - botPad + 18}
                  textAnchor="middle"
                  className="fill-ink-500 text-[11px] dark:fill-ink-300"
                >
                  {d.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

export interface DonutSegment {
  label: string
  value: number
  color?: string
}

export interface DonutChartProps extends HTMLAttributes<HTMLDivElement> {
  segments: DonutSegment[]
  size?: number
  thickness?: number
  centerValue?: ReactNode
  centerLabel?: string
  legend?: boolean
}

export function DonutChart({
  segments = [],
  size = 160,
  thickness = 26,
  centerValue,
  centerLabel,
  legend = true,
  className,
  ...rest
}: DonutChartProps) {
  const r = (size - thickness) / 2
  const circ = 2 * Math.PI * r
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  const arcs = segments.reduce<{ items: { len: number; off: number }[]; acc: number }>(
    (state, s) => {
      const len = (s.value / total) * circ
      const off = -state.acc
      return { items: [...state.items, { len, off }], acc: state.acc + len }
    },
    { items: [], acc: 0 },
  ).items
  return (
    <div className={cn('flex items-center gap-5 flex-wrap', className)} {...rest}>
      <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={thickness}
            className="stroke-ink-100 dark:stroke-ink-700"
          />
          {segments.map((s, i) => {
            const { len, off } = arcs[i]
            const dash = `${len} ${circ - len}`
            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                strokeWidth={thickness}
                style={{ stroke: s.color ?? PALETTE[i % PALETTE.length] }}
                strokeDasharray={dash}
                strokeDashoffset={off}
                strokeLinecap="butt"
              />
            )
          })}
        </svg>
        {(centerValue != null || centerLabel) && (
          <span className="absolute inline-flex flex-col items-center">
            {centerValue != null && (
              <span
                className="font-semibold text-ink-900 dark:text-ink-100"
                style={{ fontSize: size * 0.22 }}
              >
                {centerValue}
              </span>
            )}
            {centerLabel && <span className="text-[12px] text-ink-500 dark:text-ink-300">{centerLabel}</span>}
          </span>
        )}
      </span>
      {legend && (
        <div className="flex flex-col gap-1.5">
          {segments.map((s, i) => (
            <span
              key={i}
              className="flex items-center gap-2 text-[13px] text-ink-700 dark:text-ink-300"
            >
              <i
                className="inline-block size-2.5 rounded-full"
                style={{ background: s.color ?? PALETTE[i % PALETTE.length] }}
              />
              {s.label}
              <b className="font-medium">{Math.round((s.value / total) * 100)}%</b>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export interface ChartProps {
  type?: 'line' | 'bar' | 'donut' | 'sparkline'
  [key: string]: unknown
}

export function Chart({ type = 'line', ...props }: ChartProps) {
  if (type === 'bar') return <BarChart {...(props as unknown as BarChartProps)} />
  if (type === 'donut') return <DonutChart {...(props as unknown as DonutChartProps)} />
  if (type === 'sparkline') return <Sparkline {...(props as unknown as SparklineProps)} />
  return <LineChart {...(props as unknown as LineChartProps)} />
}
