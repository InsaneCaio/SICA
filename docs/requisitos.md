# Requisitos Funcionais (RF)

| ID   | Nome do Requisito                | Descrição                                                                 | Prioridade |
|------|----------------------------------|---------------------------------------------------------------------------|------------|
| RF01 | Listar clínicas próximas        | Exibe clínicas com base na localização do usuário.                       | Alta       |
| RF02 | Selecionar clínica              | Permite escolher uma clínica para atendimento.                           | Alta       |
| RF03 | Selecionar especialidade        | Permite escolher a especialidade médica desejada.                        | Alta       |
| RF04 | Listar médicos                  | Exibe médicos disponíveis da especialidade selecionada.                  | Alta       |
| RF05 | Selecionar médico               | Permite escolher um médico específico.                                   | Alta       |
| RF06 | Ver dias disponíveis            | Exibe os dias disponíveis do médico selecionado.                         | Alta       |
| RF07 | Ver horários disponíveis        | Exibe horários disponíveis em um dia selecionado.                        | Alta       |
| RF08 | Selecionar data e horário       | Permite escolher data e horário para consulta.                           | Alta       |
| RF09 | Informar dados pessoais         | Solicita nome, CPF e data de nascimento para agendamento.                | Alta       |
| RF10 | Validar dados                   | Verifica se os dados obrigatórios foram preenchidos corretamente.        | Alta       |
| RF11 | Confirmar agendamento           | Finaliza o agendamento após validação dos dados.                         | Alta       |
| RF12 | Iniciar agendamento de exame    | Permite iniciar o fluxo de agendamento de exames.                        | Alta       |
| RF13 | Enviar encaminhamento           | Exige upload de arquivo médico para exames.                              | Alta       |
| RF14 | Validar arquivo                | Verifica formato do arquivo enviado (.png, .jpg, .pdf, etc.).           | Alta       |
| RF15 | Prosseguir após validação       | Permite continuar após envio válido do encaminhamento.                   | Alta       |
| RF16 | Fluxo de exame                 | Repete o fluxo de agendamento para exames.                               | Alta       |
| RF17 | Visualizar agendamentos         | Permite ver consultas e exames agendados.                                | Média      |
| RF18 | Armazenar agendamentos          | Guarda os dados dos agendamentos realizados.                             | Média      |
| RF19 | Cancelar agendamento            | Permite cancelar consultas ou exames agendados.                          | Baixa      |
| RF20 | Atualizar disponibilidade       | Atualiza horários após agendamento ou cancelamento.                      | Média      |
| RF21 | Notificação de lembrete         | Envia notificação 2 dias antes do agendamento.                           | Média      |
| RF22 | Cadastrar dependentes           | Permite cadastrar pessoas dependentes.                                   | Média      |
| RF23 | Editar dependentes              | Permite atualizar dados dos dependentes cadastrados.                     | Média      |
| RF24 | Remover dependentes             | Permite excluir dependentes cadastrados.                                 | Média      |
| RF25 | Selecionar dependente           | Permite escolher dependente para agendamento.                            | Média      |
| RF26 | Associar agendamento            | Vincula agendamento ao usuário ou dependente.                            | Média      |
| RF27 | Listar por dependente           | Exibe agendamentos separados por dependente.                             | Média      |
| RF28 | Ver agendamentos do dependente  | Mostra todos os agendamentos de um dependente específico.                | Média      |
| RF29 | Identificar responsável         | Indica claramente para quem é cada agendamento.                          | Média      |

# Requisitos Não Funcionais (RNF)

| ID    | Nome do Requisito        | Descrição | Prioridade |
|-------|---------------------------|------------|-------------|
| RNF01 | Segurança – Criptografia | O sistema deve criptografar todos os dados sensíveis (CPF, laudos e histórico médico) em repouso e em trânsito utilizando o protocolo TLS 1.3 ou superior. | Alta |
| RNF02 | Desempenho – Tempo de Resposta | O tempo de resposta para a busca de clínicas por proximidade não deve exceder 2 segundos sob condições normais de rede (4G/5G). | Alta |
| RNF03 | Confiabilidade – Disponibilidade | A aplicação deve garantir uma disponibilidade de 99,9% (SLA), com janelas de manutenção programadas apenas em horários de baixa utilização. | Alta |
| RNF04 | Usabilidade – Acessibilidade | A interface deve seguir as diretrizes de acessibilidade WCAG 2.1, garantindo suporte a leitores de tela e contraste adequado para usuários com deficiência visual. | Alta |
| RNF05 | Escalabilidade – Acessos Simultâneos | O sistema deve suportar picos de até 10.000 acessos simultâneos sem degradação perceptível de performance por meio de escalonamento horizontal. | Alta |
| RNF06 | Segurança – Armazenamento Seguro | Todos os anexos enviados (.pdf, .png, .jpg) devem ser armazenados em ambiente isolado (Bucket) com controle de acesso via tokens temporários. | Alta |
| RNF07 | Desempenho – Carregamento Inicial | O carregamento inicial do mapa e dos marcadores de clínicas deve ser otimizado para não ultrapassar 3 segundos. | Média |
| RNF08 | Confiabilidade – Consistência Transacional | O aplicativo deve manter a consistência transacional (ACID), garantindo que um horário de consulta nunca seja agendado em duplicidade (overbooking). | Alta |
| RNF09 | Usabilidade – Padrões de Interface | A interface deve seguir os padrões nativos de Design System (Human Interface Guidelines para iOS e Material Design para Android). | Média |
| RNF10 | Segurança – Auditoria e Logs | O sistema deve registrar logs de auditoria imutáveis para qualquer acesso ou alteração em dados de saúde, conforme exigido pela LGPD. | Alta |
| RNF11 | Manutenibilidade – Microsserviços | O backend deve ser arquitetado em microsserviços para permitir atualizações independentes de módulos sem afetar a disponibilidade total do app. | Média |
| RNF12 | Desempenho – Tamanho do Aplicativo | O tamanho total do pacote de instalação do aplicativo não deve exceder 150MB para facilitar o download em conexões móveis. | Média |
| RNF13 | Confiabilidade – Backup e Recuperação | O sistema deve realizar backups automáticos e incrementais a cada 6 horas, com tempo de recuperação (RTO) máximo de 1 hora. | Alta |
| RNF14 | Segurança – Autenticação 2FA | A aplicação deve implementar autenticação de dois fatores (2FA) para o acesso às funcionalidades de visualização de exames e dados de perfil. | Alta |
| RNF15 | Manutenibilidade – Testes Automatizados | O código-fonte deve possuir cobertura de testes unitários mínima de 80% para garantir a estabilidade durante evoluções do software. | Média |
