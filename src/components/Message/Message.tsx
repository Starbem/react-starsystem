import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Avatar } from '../Avatar'
import { Icon } from '../Icon'

export interface MessageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  side?: 'in' | 'out'
  children: ReactNode
  time?: string
  status?: 'sent' | 'delivered' | 'read'
  author?: string
  avatarSrc?: string
  avatarName?: string
  reactions?: { emoji: string; count?: number }[]
  attachment?: 'image' | 'file' | 'voice'
  imageSrc?: string
  fileName?: string
  fileSize?: string
  'data-testid'?: string
}

function Ticks({ status, testId }: { status: NonNullable<MessageProps['status']>; testId?: string }) {
  return (
    <span data-testid={testId ? `${testId}-tick` : undefined} className={cn('inline-flex', status === 'read' ? 'text-[#FF5100]' : 'text-[#98A2B3]')}>
      <Icon name={status === 'sent' ? 'check' : 'done_all'} size={14} />
    </span>
  )
}

export function Message({
  side = 'in',
  children,
  time,
  status,
  author,
  avatarSrc,
  avatarName,
  reactions,
  attachment,
  imageSrc,
  fileName,
  fileSize,
  className,
  'data-testid': testId,
  ...props
}: MessageProps) {
  const isOut = side === 'out'
  return (
    <div className={cn('flex items-end gap-[8px]', isOut ? 'justify-end' : 'justify-start', className)} {...props}>
      {!isOut && (avatarSrc || avatarName) && (avatarSrc ? <Avatar src={avatarSrc} alt={avatarName ?? ''} size="sm" /> : <Avatar name={avatarName} size="sm" />)}
      <div className="max-w-[320px] flex flex-col gap-[4px]">
        {author && <span className="text-[12px] font-medium text-[#667085] dark:text-[#98A2B3]">{author}</span>}
        <div
          className={cn(
            'rounded-[16px] px-[12px] py-[8px] text-[14px]',
            isOut ? 'bg-[#FF5100] text-white rounded-br-[4px]' : 'bg-[#F2F4F7] text-[#101828] rounded-bl-[4px] dark:bg-[#1F2937] dark:text-white',
          )}
        >
          {attachment === 'image' && imageSrc && (
            <img src={imageSrc} alt="Anexo de imagem" className="rounded-[8px] mb-[6px] max-w-[240px]" />
          )}
          {attachment === 'file' && (
            <div className="flex items-center gap-[8px] mb-[6px] rounded-[8px] bg-white/20 p-[8px]">
              <Icon name="description" size={20} />
              <div className="flex flex-col">
                <span className="text-[13px]">{fileName}</span>
                <span className="text-[11px] opacity-80">{fileSize}</span>
              </div>
              <Icon name="download" size={18} />
            </div>
          )}
          {attachment === 'voice' && (
            <div className="flex items-center gap-[8px] mb-[6px]">
              <Icon name="play_arrow" size={20} />
              <span className="flex gap-[2px]">
                {Array.from({ length: 16 }, (_, i) => (
                  <span key={i} className="w-[2px] bg-current opacity-60" style={{ height: 4 + ((i * 7) % 12) }} />
                ))}
              </span>
            </div>
          )}
          {children}
        </div>
        {reactions && reactions.length > 0 && (
          <div className="flex gap-[4px]">
            {reactions.map((r, i) => (
              <span key={i} className="rounded-full bg-[#F2F4F7] px-[6px] py-[2px] text-[12px] dark:bg-[#1F2937]">
                {r.emoji} {r.count ?? 1}
              </span>
            ))}
          </div>
        )}
        {(time || (isOut && status)) && (
          <div className={cn('flex items-center gap-[4px] text-[11px] text-[#98A2B3]', isOut ? 'justify-end' : 'justify-start')}>
            {time && <span>{time}</span>}
            {isOut && status && <Ticks status={status} testId={testId} />}
          </div>
        )}
      </div>
    </div>
  )
}

export function TypingMessage({ avatarSrc, avatarName, className }: { avatarSrc?: string; avatarName?: string; className?: string }) {
  return (
    <div className={cn('flex items-end gap-[8px] justify-start', className)}>
      {(avatarSrc || avatarName) && (avatarSrc ? <Avatar src={avatarSrc} alt={avatarName ?? ''} size="sm" /> : <Avatar name={avatarName} size="sm" />)}
      <div className="flex gap-[3px] rounded-[16px] rounded-bl-[4px] bg-[#F2F4F7] px-[14px] py-[10px] dark:bg-[#1F2937]">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-[6px] rounded-full bg-[#98A2B3] animate-bounce motion-reduce:!animate-none" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  )
}

export function MessageDay({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center py-[8px]">
      <span className="rounded-full bg-[#F2F4F7] px-[10px] py-[4px] text-[12px] text-[#667085] dark:bg-[#1F2937] dark:text-[#98A2B3]">{children}</span>
    </div>
  )
}

export function SystemMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center py-[4px]">
      <span className="text-[12px] text-[#98A2B3] text-center">{children}</span>
    </div>
  )
}

export function MessageList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-[8px] overflow-y-auto', className)}>{children}</div>
}
