import { useState } from 'react'
import {
  Alert,
  Breadcrumb,
  Button,
  Checkbox,
  Divider,
  FormField,
  Icon,
  Radio,
  Spinner,
  Textarea,
  Toggle,
  toast,
} from '@starbemtech/react-starsystem'

export function Settings() {
  const [bio, setBio] = useState('Star System é o design system de saúde corporativa da Starbem.')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [frequency, setFrequency] = useState<'diario' | 'semanal' | 'mensal'>('semanal')
  const [betaFeatures, setBetaFeatures] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaving(true)
    setSaved(false)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      toast.success('Configurações salvas com sucesso.')
    }, 500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560 }}>
      <Breadcrumb items={[{ label: 'Início', href: '/' }, { label: 'Configurações' }]} />
      <h1>Configurações</h1>

      {saved && (
        <Alert
          variant="success"
          title="Salvo"
          description="Suas preferências foram atualizadas."
          onClose={() => setSaved(false)}
        />
      )}

      <FormField label="Bio da empresa" helperText="Exibida no portal do colaborador.">
        <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
      </FormField>

      <Divider label="Notificações" />

      <Toggle
        checked={emailNotifications}
        onChange={setEmailNotifications}
        label="Receber notificações por e-mail"
      />

      <FormField label="Frequência de notificações">
        <div style={{ display: 'flex', gap: 16 }}>
          <Radio name="frequency" value="diario" checked={frequency === 'diario'} onSelect={() => setFrequency('diario')} label="Diário" />
          <Radio name="frequency" value="semanal" checked={frequency === 'semanal'} onSelect={() => setFrequency('semanal')} label="Semanal" />
          <Radio name="frequency" value="mensal" checked={frequency === 'mensal'} onSelect={() => setFrequency('mensal')} label="Mensal" />
        </div>
      </FormField>

      <Divider label="Recursos" />

      <Checkbox checked={betaFeatures} onChange={setBetaFeatures} label="Participar do programa beta" />

      <div>
        <Button
          onClick={handleSave}
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}
        >
          {saving ? <Spinner size="sm" label="Salvando" /> : <Icon name="save" size={18} />}
          {saving ? 'Salvando' : 'Salvar alterações'}
        </Button>
      </div>
    </div>
  )
}
