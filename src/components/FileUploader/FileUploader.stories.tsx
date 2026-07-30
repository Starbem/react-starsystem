import { useState } from 'react'
import type { Meta, StoryObj } from '../../docs-types'
import { FileUploader, type UploadFile } from './FileUploader'

const meta: Meta<typeof FileUploader> = {
  title: 'Components/FileUploader',
  component: FileUploader,
}
export default meta
type Story = StoryObj<typeof FileUploader>

export const Default: Story = {}

export const Compact: Story = {
  args: { variant: 'compact', hint: 'Anexe seu documento' },
}

export const WithFiles: Story = {
  args: {
    files: [
      { name: 'exame-sangue.pdf', size: 248000, done: true },
      { name: 'foto-pele.jpg', size: 1200000, progress: 60 },
    ] satisfies UploadFile[],
  },
}

export const WithError: Story = {
  args: { error: 'Arquivo excede o tamanho máximo de 10 MB' },
}

export const Interactive: Story = {
  render: () => {
    const [files, setFiles] = useState<UploadFile[]>([
      { name: 'exame-sangue.pdf', size: 248000, done: true },
    ])
    return (
      <FileUploader
        files={files}
        onFiles={(list) =>
          setFiles((prev) => [
            ...prev,
            ...Array.from(list).map((f) => ({ name: f.name, size: f.size, done: true })),
          ])
        }
        onRemove={(_, i) => setFiles((prev) => prev.filter((_, x) => x !== i))}
      />
    )
  },
}
