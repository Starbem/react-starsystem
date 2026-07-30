import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { Message, MessageDay, MessageList, SystemMessage, TypingMessage } from './Message'

describe('Message', () => {
  it('renders incoming and outgoing bubbles with different alignment', () => {
    const { container: inContainer } = render(<Message side="in">Oi, tudo bem?</Message>)
    const { container: outContainer } = render(<Message side="out">Tudo ótimo!</Message>)
    expect(inContainer.firstChild).toHaveClass('justify-start')
    expect(outContainer.firstChild).toHaveClass('justify-end')
  })

  it('renders delivery ticks only for outgoing messages', () => {
    render(
      <Message side="out" status="read" data-testid="msg">
        Lida
      </Message>,
    )
    expect(screen.getByTestId('msg-tick')).toBeInTheDocument()
  })

  it('does not render ticks for incoming messages even with a status', () => {
    render(
      <Message side="in" status="read" data-testid="msg">
        Recebida
      </Message>,
    )
    expect(screen.queryByTestId('msg-tick')).not.toBeInTheDocument()
  })

  it('renders an image attachment', () => {
    render(
      <Message side="in" attachment="image" imageSrc="https://example.com/x.png">
        Foto
      </Message>,
    )
    expect(screen.getByRole('img', { name: 'Anexo de imagem' })).toBeInTheDocument()
  })

  it('renders a file attachment with name and size', () => {
    render(
      <Message side="in" attachment="file" fileName="exame.pdf" fileSize="1.2 MB">
        Anexo
      </Message>,
    )
    expect(screen.getByText('exame.pdf')).toBeInTheDocument()
    expect(screen.getByText('1.2 MB')).toBeInTheDocument()
  })

  it('renders reactions with counts', () => {
    render(
      <Message side="in" reactions={[{ emoji: '👍', count: 3 }]}>
        Ok
      </Message>,
    )
    expect(screen.getByText('👍 3')).toBeInTheDocument()
  })

  it('renders TypingMessage, MessageDay and SystemMessage', () => {
    render(
      <>
        <TypingMessage avatarName="Ana" />
        <MessageDay>Hoje</MessageDay>
        <SystemMessage>Consulta agendada</SystemMessage>
      </>,
    )
    expect(screen.getByText('Hoje')).toBeInTheDocument()
    expect(screen.getByText('Consulta agendada')).toBeInTheDocument()
  })

  it('has no a11y violations in a full MessageList', async () => {
    const { container } = render(
      <MessageList>
        <MessageDay>Hoje</MessageDay>
        <Message side="in" avatarName="Ana">
          Oi
        </Message>
        <Message side="out" status="read">
          Olá!
        </Message>
        <TypingMessage avatarName="Ana" />
      </MessageList>,
    )
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
