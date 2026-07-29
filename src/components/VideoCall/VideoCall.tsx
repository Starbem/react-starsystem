import { useState } from 'react'
import { cn } from '../../utils/cn'
import { Avatar } from '../Avatar'
import { Icon } from '../Icon'
import { Spinner } from '../Spinner'

export interface VideoCallProps {
  name?: string
  specialty?: string
  remoteSrc?: string
  selfSrc?: string
  layout?: 'spotlight' | 'grid'
  status?: 'live' | 'connecting' | 'ended'
  timer?: string
  connection?: string
  caption?: string
  mic?: boolean
  camera?: boolean
  onToggleMic?: (next: boolean) => void
  onToggleCamera?: (next: boolean) => void
  onEnd?: () => void
  onChat?: () => void
  onMore?: () => void
  className?: string
}

function Tile({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  return (
    <div className={cn('relative overflow-hidden bg-[#1C1B1F] rounded-[16px]', className)}>
      {src ? <img src={src} alt={alt} className="size-full object-cover" /> : <div className="size-full flex items-center justify-center text-[#667085] text-[13px]">Sem vídeo</div>}
    </div>
  )
}

export function VideoCall({
  name = 'Dra. Luciana Martins',
  specialty = 'Dermatologia',
  remoteSrc,
  selfSrc,
  layout = 'spotlight',
  status = 'live',
  timer = '12:04',
  connection = 'Conexão estável',
  caption,
  mic,
  camera,
  onToggleMic,
  onToggleCamera,
  onEnd,
  onChat,
  onMore,
  className,
}: VideoCallProps) {
  const [internalMic, setInternalMic] = useState(true)
  const [internalCamera, setInternalCamera] = useState(true)
  const micOn = mic ?? internalMic
  const cameraOn = camera ?? internalCamera

  function toggleMic() {
    const next = !micOn
    if (mic === undefined) setInternalMic(next)
    onToggleMic?.(next)
  }

  function toggleCamera() {
    const next = !cameraOn
    if (camera === undefined) setInternalCamera(next)
    onToggleCamera?.(next)
  }

  if (status === 'connecting') {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-[16px] rounded-[16px] bg-[#1C1B1F] p-[32px] text-white', className)}>
        <Avatar name={name} size="xl" />
        <div className="text-center">
          <p className="font-medium">{name}</p>
          <p className="text-[13px] text-[#98A2B3]">{specialty}</p>
        </div>
        <Spinner size="md" color="white" label="Conectando..." />
        <p className="text-[13px] text-[#98A2B3]">Conectando...</p>
        {onEnd && (
          <button type="button" aria-label="Cancelar chamada" onClick={onEnd} className="rounded-full bg-[#FF4242] px-[16px] py-[8px] text-[13px]">
            Cancelar
          </button>
        )}
      </div>
    )
  }

  if (status === 'ended') {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-[12px] rounded-[16px] bg-[#1C1B1F] p-[32px] text-white', className)}>
        <Avatar name={name} size="xl" />
        <p className="font-medium">Consulta encerrada</p>
      </div>
    )
  }

  return (
    <div className={cn('relative rounded-[16px] bg-[#1C1B1F] p-[8px] text-white', className)}>
      {layout === 'spotlight' ? (
        <div className="relative">
          <Tile src={remoteSrc} alt={name} className="w-full aspect-video" />
          <Tile src={selfSrc} alt="Você" className="absolute bottom-[12px] right-[12px] w-[96px] aspect-video ring-2 ring-white/20" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-[8px]">
          <Tile src={remoteSrc} alt={name} className="aspect-video" />
          <Tile src={selfSrc} alt="Você" className="aspect-video" />
        </div>
      )}

      {caption && (
        <p className="absolute bottom-[80px] left-1/2 -translate-x-1/2 rounded-[8px] bg-black/60 px-[12px] py-[4px] text-[13px]">{caption}</p>
      )}

      <div className="flex items-center justify-between mt-[8px] px-[4px]">
        <span className="inline-flex items-center gap-[6px] text-[12px] text-[#98A2B3]">
          <Icon name="signal_cellular_alt" size={16} />
          {connection}
        </span>
        <span className="text-[12px] text-[#98A2B3]">{timer}</span>
      </div>

      <div className="flex items-center justify-center gap-[12px] mt-[12px]">
        <button
          type="button"
          aria-label={micOn ? 'Desativar microfone' : 'Ativar microfone'}
          onClick={toggleMic}
          className={cn('inline-flex items-center justify-center size-[44px] rounded-full', micOn ? 'bg-white/10 hover:bg-white/20' : 'bg-white text-[#101828]')}
        >
          <Icon name={micOn ? 'mic' : 'mic_off'} size={20} />
        </button>
        <button
          type="button"
          aria-label={cameraOn ? 'Desativar câmera' : 'Ativar câmera'}
          onClick={toggleCamera}
          className={cn('inline-flex items-center justify-center size-[44px] rounded-full', cameraOn ? 'bg-white/10 hover:bg-white/20' : 'bg-white text-[#101828]')}
        >
          <Icon name={cameraOn ? 'videocam' : 'videocam_off'} size={20} />
        </button>
        <button type="button" aria-label="Encerrar chamada" onClick={onEnd} className="inline-flex items-center justify-center size-[44px] rounded-full bg-[#FF4242]">
          <Icon name="call_end" size={20} />
        </button>
        {onChat && (
          <button type="button" aria-label="Chat" onClick={onChat} className="inline-flex items-center justify-center size-[44px] rounded-full bg-white/10 hover:bg-white/20">
            <Icon name="chat_bubble" size={20} />
          </button>
        )}
        {onMore && (
          <button type="button" aria-label="Mais opções" onClick={onMore} className="inline-flex items-center justify-center size-[44px] rounded-full bg-white/10 hover:bg-white/20">
            <Icon name="more_horiz" size={20} />
          </button>
        )}
      </div>
    </div>
  )
}
