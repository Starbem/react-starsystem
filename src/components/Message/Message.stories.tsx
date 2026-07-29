import type { Meta, StoryObj } from '../../docs-types'
import { Message, MessageDay, MessageList, SystemMessage, TypingMessage } from './Message'

const meta: Meta<typeof Message> = {
  title: 'Components/Message',
  component: Message,
}
export default meta
type Story = StoryObj<typeof Message>

export const Conversation: Story = {
  render: () => (
    <MessageList className="max-w-[360px]">
      <MessageDay>Hoje</MessageDay>
      <Message side="in" avatarName="Dra. Ana Costa" time="09:12">
        Bom dia! Como está se sentindo?
      </Message>
      <Message side="out" status="read" time="09:13">
        Bom dia, doutora! Bem melhor, obrigado.
      </Message>
      <Message side="in" avatarName="Dra. Ana Costa" attachment="file" fileName="receita.pdf" fileSize="340 KB" time="09:14">
        Segue a receita atualizada.
      </Message>
      <SystemMessage>Consulta encerrada</SystemMessage>
      <TypingMessage avatarName="Dra. Ana Costa" />
    </MessageList>
  ),
}

export const Reactions: Story = {
  render: () => (
    <MessageList className="max-w-[360px]">
      <Message side="in" avatarName="Dra. Ana Costa" reactions={[{ emoji: '👍', count: 1 }]}>
        Combinado então!
      </Message>
    </MessageList>
  ),
}
