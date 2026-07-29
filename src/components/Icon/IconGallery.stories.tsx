import { useMemo, useState } from 'react'
import type { Meta, StoryObj } from '../../docs-types'
import { Input } from '../Input'
import { ToastProvider, toast } from '../Toast'
import { Icon } from './Icon'

const meta: Meta = {
  title: 'Icons/Gallery',
}
export default meta
type Story = StoryObj

// Curated set of Material Symbols Rounded names commonly used across Starbem
// products (nav, actions, status, health). Full catalog: fonts.google.com/icons
const ICON_NAMES = [
  'dashboard',
  'home',
  'menu',
  'apps',
  'settings',
  'person',
  'group',
  'groups',
  'badge',
  'logout',
  'login',
  'notifications',
  'mail',
  'chat',
  'phone',
  'search',
  'filter_list',
  'sort',
  'add',
  'remove',
  'edit',
  'delete',
  'close',
  'check',
  'check_circle',
  'cancel',
  'refresh',
  'more_vert',
  'more_horiz',
  'arrow_back',
  'arrow_forward',
  'chevron_left',
  'chevron_right',
  'expand_more',
  'expand_less',
  'visibility',
  'visibility_off',
  'lock',
  'lock_open',
  'favorite',
  'star',
  'bookmark',
  'share',
  'download',
  'upload',
  'attach_file',
  'link',
  'info',
  'warning',
  'error',
  'help',
  'dark_mode',
  'light_mode',
  'calendar_today',
  'schedule',
  'event',
  'task',
  'assignment',
  'description',
  'folder',
  'receipt',
  'credit_card',
  'attach_money',
  'savings',
  'account_balance',
  'trending_up',
  'trending_down',
  'bar_chart',
  'pie_chart',
  'table_chart',
  'analytics',
  'work',
  'business',
  'apartment',
  'location_on',
  'category',
  'health_and_safety',
  'medical_services',
  'local_hospital',
  'spa',
  'fitness_center',
  'psychology',
  'shopping_cart',
  'inventory_2',
  'local_offer',
]

function IconGalleryDemo() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ICON_NAMES
    return ICON_NAMES.filter((name) => name.includes(q))
  }, [query])

  function copyName(name: string) {
    navigator.clipboard?.writeText(name)
    toast.info({ description: `"${name}" copiado` })
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <ToastProvider />
      <div className="max-w-[320px]">
        <Input
          placeholder="Buscar ícone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <p className="text-[13px] text-[#667085] dark:text-[#9CA3AF]">
        {filtered.length} de {ICON_NAMES.length} ícones (subset curado — catálogo completo em
        fonts.google.com/icons). Clique para copiar o nome.
      </p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-[8px]">
        {filtered.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => copyName(name)}
            className="flex flex-col items-center gap-[8px] rounded-[8px] border border-[#EAECF0] p-[12px] hover:bg-[#F9FAFB] dark:border-[#1F2937] dark:hover:bg-[#1F2937]"
          >
            <Icon name={name} className="text-[#344054] dark:text-[#D0D5DD]" />
            <span className="text-[11px] text-center break-all text-[#667085] dark:text-[#9CA3AF]">
              {name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export const AllIcons: Story = {
  render: () => <IconGalleryDemo />,
}
