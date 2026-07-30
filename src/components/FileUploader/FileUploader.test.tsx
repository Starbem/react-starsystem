import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { FileItem, FileUploader } from './FileUploader'

describe('FileItem', () => {
  it('renders the file name and formatted size', () => {
    render(<FileItem name="exame.pdf" size={248000} />)
    expect(screen.getByText('exame.pdf')).toBeInTheDocument()
    expect(screen.getByText('242 KB')).toBeInTheDocument()
  })

  it('shows "Enviado" when done', () => {
    render(<FileItem name="exame.pdf" size={248000} done />)
    expect(screen.getByText('Enviado')).toBeInTheDocument()
  })

  it('shows the error message when error is set', () => {
    render(<FileItem name="exame.pdf" error="Falha no envio" />)
    expect(screen.getByText('Falha no envio')).toBeInTheDocument()
  })

  it('calls onRemove when the remove button is clicked', async () => {
    const handleRemove = vi.fn()
    render(<FileItem name="exame.pdf" onRemove={handleRemove} />)
    await userEvent.click(screen.getByRole('button', { name: 'Remover' }))
    expect(handleRemove).toHaveBeenCalledTimes(1)
  })

  it('renders an accessible progressbar when progress is set and not done/error', () => {
    render(<FileItem name="foto-pele.jpg" size={1200000} progress={60} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '60')
  })

  it('does not render a progressbar once done', () => {
    render(<FileItem name="foto-pele.jpg" size={1200000} progress={100} done />)
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
})

describe('FileUploader', () => {
  it('renders the dropzone prompt by default', () => {
    render(<FileUploader />)
    expect(screen.getByText('Clique para enviar', { exact: false })).toBeInTheDocument()
  })

  it('renders a custom title as visible text', () => {
    render(<FileUploader title="Envie seu comprovante" />)
    expect(screen.getByText('Envie seu comprovante')).toBeInTheDocument()
  })

  it('renders the compact button when variant is compact', () => {
    render(<FileUploader variant="compact" />)
    expect(screen.getByRole('button', { name: 'Escolher arquivo' })).toBeInTheDocument()
  })

  it('renders the hint text', () => {
    render(<FileUploader hint="PNG, JPG ou PDF · até 10 MB" />)
    expect(screen.getByText('PNG, JPG ou PDF · até 10 MB')).toBeInTheDocument()
  })

  it('renders a file list entry per file', () => {
    render(<FileUploader files={[{ name: 'a.pdf', size: 1000, done: true }]} />)
    expect(screen.getByText('a.pdf')).toBeInTheDocument()
  })

  it('renders the zone-level error message', () => {
    render(<FileUploader error="Arquivo muito grande" />)
    expect(screen.getByText('Arquivo muito grande')).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<FileUploader files={[{ name: 'a.pdf', size: 1000, done: true }]} />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})
