import { useRef, useState, type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'
import { Button } from '../Button'
import { Icon } from '../Icon'

function fmtSize(bytes?: number) {
  if (bytes == null) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const EXT_ICON: Record<string, string> = {
  pdf: 'picture_as_pdf',
  doc: 'description',
  docx: 'description',
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
}
const DEFAULT_ICON = 'draft'

export interface UploadFile {
  id?: string | number
  name: string
  size?: number
  progress?: number
  done?: boolean
  error?: string
  thumb?: string
}

export interface FileItemProps extends UploadFile {
  onRemove?: () => void
}

export function FileItem({ name, size, progress, done, error, thumb, onRemove }: FileItemProps) {
  const ext = (name || '').split('.').pop()?.toLowerCase() ?? ''
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border border-ink-200 p-3 dark:border-ink-700',
        error && 'border-error-base dark:border-error-base',
      )}
    >
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-ink-100 dark:bg-ink-700">
        {thumb ? (
          <img src={thumb} alt="" className="size-full rounded-md object-cover" />
        ) : (
          <Icon name={EXT_ICON[ext] ?? DEFAULT_ICON} />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] leading-[20px] font-medium text-ink-900 dark:text-ink-100">{name}</p>
        <p className="flex items-center gap-1 text-[12px] leading-[16px] text-ink-600 dark:text-ink-400">
          {error ? (
            <span className="text-error-base">{error}</span>
          ) : done ? (
            <>
              <span>{fmtSize(size)}</span>
              <span className="inline-flex items-center gap-1 text-success-base">
                <Icon name="check_circle" size={14} />
                Enviado
              </span>
            </>
          ) : (
            <span>{fmtSize(size)}</span>
          )}
        </p>
        {progress != null && !done && !error && (
          <div className="mt-1 h-[4px] w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700">
            <div className="h-full rounded-full bg-primary-base" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
      {onRemove && (
        <button
          type="button"
          aria-label="Remover"
          onClick={onRemove}
          className="inline-flex shrink-0 items-center justify-center rounded-full p-1 text-ink-500 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-700"
        >
          <Icon name="close" size={18} />
        </button>
      )}
    </div>
  )
}

export interface FileUploaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  variant?: 'dropzone' | 'compact'
  accept?: string
  multiple?: boolean
  title?: string
  hint?: string
  files?: UploadFile[]
  onFiles?: (files: FileList) => void
  onRemove?: (file: UploadFile, index: number) => void
  error?: string
}

export function FileUploader({
  variant = 'dropzone',
  accept,
  multiple = false,
  title = 'Arraste um arquivo ou clique para enviar',
  hint = 'PNG, JPG ou PDF · até 10 MB',
  files = [],
  onFiles,
  onRemove,
  error,
  className,
  ...rest
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const open = () => inputRef.current?.click()
  const handle = (list: FileList | null) => {
    if (list && list.length) onFiles?.(list)
  }

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept={accept}
      multiple={multiple}
      hidden
      onChange={(e) => handle(e.target.files)}
    />
  )

  return (
    <div className={cn('w-full', className)} {...rest}>
      {variant === 'compact' ? (
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md" iconLeft={<Icon name="upload" />} onClick={open}>
            Escolher arquivo
          </Button>
          <span className="text-[13px] leading-[18px] text-ink-500 dark:text-ink-400">{hint}</span>
          {input}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={open}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              open()
            }
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setDrag(true)
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDrag(false)
            handle(e.dataTransfer.files)
          }}
          className={cn(
            'flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-ink-300 p-8 text-center outline-none dark:border-ink-700',
            'focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2',
            drag && 'border-primary-base bg-primary-lightest',
            error && 'border-error-base dark:border-error-base',
          )}
        >
          <Icon name="cloud_upload" size={32} className="text-ink-400 dark:text-ink-500" />
          <span className="text-[14px] leading-[20px] text-ink-700 dark:text-ink-200">{title}</span>
          <span className="text-[13px] leading-[18px] text-ink-500 dark:text-ink-400">{hint}</span>
          {input}
        </div>
      )}

      {error && (
        <span className="mt-2 flex items-center gap-1 text-[13px] leading-[18px] text-error-base">
          <Icon name="error" size={16} />
          {error}
        </span>
      )}

      {files.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {files.map((f, i) => (
            <FileItem key={f.id ?? i} {...f} onRemove={onRemove ? () => onRemove(f, i) : undefined} />
          ))}
        </div>
      )}
    </div>
  )
}
