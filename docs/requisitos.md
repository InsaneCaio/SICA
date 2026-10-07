# Requisitos Funcionais (RF)

| ID   | Nome do Requisito                | Descrição                                                                 | Prioridade |
|------|----------------------------------|---------------------------------------------------------------------------|------------|
| RF01 | Visualizar agendamentos          | Permite ver consultas agendados.                                         | Média       |
| RF02 | Selecionar especialidade        | Permite escolher a especialidade médica desejada.                        | Alta       |
| RF03 | Listar médicos                  | Exibe médicos disponíveis da especialidade selecionada.                  | Alta       |
| RF04 | Selecionar médico               | Permite escolher um médico específico.                                   | Alta       |
| RF05| Ver dias disponíveis            | Exibe os dias disponíveis do médico selecionado.                         | Alta       |
| RF06 | Ver horários disponíveis        | Exibe horários disponíveis em um dia selecionado.                        | Alta       |
| RF07 | Selecionar data e horário       | Permite escolher data e horário para consulta.                           | Alta       |
| RF08 | Informar dados pessoais         | Solicita nome, CPF e data de nascimento para agendamento.                | Alta       |
| RF09 | Validar dados                   | Verifica se os dados obrigatórios foram preenchidos corretamente.        | Alta       |
| RF10 | Confirmar agendamento           | Finaliza o agendamento após validação dos dados.                         | Alta       |
| RF11 | Receber alertas de falhas no sistema |  Notifica o gestor sobre falhas ou indisponibilidade do sistema.    | Alta       |
| RF12 | Receber alertas de inadimplência| Notifica sobre assinaturas com pagamentos em atraso.                     | Alta       |
| RF13 | Receber alertas financeiros    | Notifica sobre variações financeiras relevantes                           | Média      |
| RF14 | Armazenar agendamentos          | Guarda os dados dos agendamentos realizados.                             | Média      |
| RF15 | Cancelar agendamento            | Permite cancelar consultas agendados.                                    | Baixa      |
| RF16 | Atualizar disponibilidade       | Atualiza horários após agendamento ou cancelamento.                      | Média      |
| RF17 | Notificação de lembrete         | Envia notificação 2 dias antes do agendamento.                           | Média      |
| RF18 | Cadastrar dependentes           | Permite cadastrar pessoas dependentes.                                   | Média      |
| RF19 | Editar dependentes              | Permite atualizar dados dos dependentes cadastrados.                     | Média      |
| RF20 | Remover dependentes             | Permite excluir dependentes cadastrados.                                 | Média      |
| RF21 | Selecionar dependente           | Permite escolher dependente para agendamento.                            | Média      |
| RF22 | Associar agendamento            | Vincula agendamento ao usuário ou dependente.                            | Média      |
| RF23 | Listar por dependente           | Exibe agendamentos separados por dependente.                             | Média      |
| RF24 | Ver agendamentos do dependente  | Mostra todos os agendamentos de um dependente específico.                | Média      |
| RF25 | Identificar responsável         | Indica claramente para quem é cada agendamento.                          | Média      |
| RF26 | Visualizar receita total             | Permite ao gestor visualizar o total de receitas do sistema              | Alta       |
| RF27 | Visualizar despesas totais           | Permite ao gestor visualizar o total de despesas                         | Alta       |
| RF28 | Consultar lucro/prejuízo            | Calcula e exibe o lucro ou prejuízo com base em receitas e despesas      | Alta       |
| RF29 | Visualizar assinaturas ativas       | Lista todas as assinaturas ativas no sistema                             | Alta       |
| RF30 | Consultar detalhes de pagamento     | Exibe informações detalhadas de pagamento por clínica                    | Alta       |
| RF31 | Alterar plano de assinatura         | Permite modificar o plano de assinatura de uma clínica                   | Alta       |
| RF32 | Cancelar assinatura                 | Permite cancelar uma assinatura ativa                                   | Alta       |
| RF33 | Reativar assinatura                 | Permite reativar uma assinatura previamente cancelada                   | Média      |
| RF34 | Acessar painel administrativo       | Permite acesso ao painel completo de gestão do sistema                  | Alta       |
| RF35 | Monitorar funcionamento do sistema  | Exibe status e desempenho geral do sistema                              | Alta       |
| RF36 | Visualizar logs de atividades       | Permite consultar registros de ações realizadas no sistema              | Média      |
| RF37 | Gerenciar usuários administrativos  | Permite criar, editar e remover usuários administrativos                | Alta       |

# Requisitos Não Funcionais (RNF)

| ID    | Nome do Requisito | Tipo | Descrição | Prioridade |
|-------|--------------------|------|------------|-------------|
| RNF01 | Criptografia de Dados Sensíveis | Segurança | O sistema deve criptografar todos os dados sensíveis (CPF, laudos e histórico médico) em repouso e em trânsito utilizando o protocolo TLS 1.3 ou superior. | Alta |
| RNF02 | Consistência Transacional | Confiabilidade | O aplicativo deve manter a consistência transacional (ACID), garantindo que um horário de consulta nunca seja agendado em duplicidade (overbooking). | Alta |
| RNF03 | Registro de Logs de Auditoria | Segurança | O sistema deve registrar logs de auditoria imutáveis para qualquer acesso ou alteração em dados de saúde, conforme exigido pela LGPD. | Alta |
| RNF04 | Controle de Acesso por Nível | Segurança | Apenas usuários autorizados podem acessar o painel administrativo e dados sensíveis | Alta |
| RNF05 | Interface Intuitiva para Gestão | Usabilidade | O painel deve ser intuitivo, com visualização clara de métricas e indicadores | Média |
