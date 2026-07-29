export interface Benefit {
  id: string
  category: 'Saúde' | 'Bem-estar' | 'Financeiro'
  name: string
  description: string
  adherence: number
}

export const benefits: Benefit[] = [
  { id: 'b1', category: 'Saúde', name: 'Telemedicina 24h', description: 'Consultas médicas por vídeo, sem carência.', adherence: 92 },
  { id: 'b2', category: 'Saúde', name: 'Plano Odontológico', description: 'Cobertura nacional para colaboradores e dependentes.', adherence: 74 },
  { id: 'b3', category: 'Bem-estar', name: 'Terapia Online', description: 'Sessões com psicólogos credenciados.', adherence: 61 },
  { id: 'b4', category: 'Bem-estar', name: 'Nutricionista', description: 'Acompanhamento nutricional mensal.', adherence: 48 },
  { id: 'b5', category: 'Financeiro', name: 'Vale-refeição Flex', description: 'Saldo mensal em cartão flexível.', adherence: 99 },
  { id: 'b6', category: 'Financeiro', name: 'Previdência Privada', description: 'Contribuição complementar opcional.', adherence: 35 },
]

export const benefitFaqs = [
  { question: 'Como ativo um benefício?', answer: 'Acesse o app do colaborador e selecione o benefício desejado na aba Benefícios.' },
  { question: 'Dependentes podem usar a telemedicina?', answer: 'Sim, dependentes cadastrados têm acesso completo à telemedicina 24h.' },
  { question: 'Posso trocar de plano odontológico?', answer: 'A troca é permitida uma vez por ciclo anual, durante a janela de adesão.' },
]
