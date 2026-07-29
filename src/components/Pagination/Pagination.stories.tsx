import { useState } from 'react'
import type { Meta, StoryObj } from '../../docs-types'
import { Pagination } from './Pagination'

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
}
export default meta
type Story = StoryObj<typeof Pagination>

function PaginationDemo({
  total,
  siblingCount,
  showFirstLast,
  initialPage = 1,
}: {
  total: number
  siblingCount?: number
  showFirstLast?: boolean
  initialPage?: number
}) {
  const [page, setPage] = useState(initialPage)

  return (
    <Pagination
      page={page}
      total={total}
      onChange={setPage}
      siblingCount={siblingCount}
      showFirstLast={showFirstLast}
    />
  )
}

export const FewPages: Story = {
  render: () => <PaginationDemo total={5} />,
}

export const ManyPagesMiddle: Story = {
  render: () => <PaginationDemo total={20} initialPage={10} />,
}

export const ManyPagesStart: Story = {
  render: () => <PaginationDemo total={20} initialPage={1} />,
}

export const ManyPagesEnd: Story = {
  render: () => <PaginationDemo total={20} initialPage={20} />,
}

export const WithFirstLast: Story = {
  render: () => <PaginationDemo total={20} initialPage={10} showFirstLast />,
}

export const WiderSiblingRange: Story = {
  render: () => <PaginationDemo total={20} initialPage={10} siblingCount={2} />,
}

export const Pill: Story = {
  args: { page: 3, total: 10, pill: true },
}
