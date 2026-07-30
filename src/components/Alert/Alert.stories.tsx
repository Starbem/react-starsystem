import type { Meta, StoryObj } from '../../docs-types'
import { Alert } from './Alert'

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  args: { title: 'Título do alerta', description: 'Descrição complementar do alerta.' },
}
export default meta
type Story = StoryObj<typeof Alert>

export const Info: Story = {
  args: { variant: 'info' },
}

export const Success: Story = {
  args: { variant: 'success', title: 'Sucesso', description: 'Operação concluída com sucesso.' },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Atenção',
    description: 'Verifique os dados antes de continuar.',
  },
}

export const ErrorVariant: Story = {
  args: { variant: 'error', title: 'Erro', description: 'Não foi possível concluir a operação.' },
}

export const Dismissible: Story = {
  args: { variant: 'info', onClose: () => alert('closed') },
}

export const WithAction: Story = {
  args: {
    variant: 'warning',
    action: (
      <button type="button" className="text-[14px] font-medium underline">
        Ver detalhes
      </button>
    ),
  },
}

export const DescriptionOnly: Story = {
  args: { title: undefined, description: 'Alerta apenas com descrição, sem título.' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4 max-w-lg">
      <Alert variant="info" title="Info" description="Mensagem informativa." />
      <Alert variant="success" title="Success" description="Mensagem de sucesso." />
      <Alert variant="warning" title="Warning" description="Mensagem de atenção." />
      <Alert variant="error" title="Error" description="Mensagem de erro." />
    </div>
  ),
}
