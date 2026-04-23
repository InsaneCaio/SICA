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
| RF12 | Enviar encaminhamento           | Exige upload de arquivo médico.                                          | Alta       |
| RF13 | Validar arquivo                | Verifica formato do arquivo enviado (.png, .jpg, .pdf, etc.).             | Alta       |
| RF14 | Prosseguir após validação       | Permite continuar após envio válido do encaminhamento.                   | Alta       |
| RF15 | Visualizar agendamentos         | Permite ver consultas agendados.                                         | Média      |
| RF16 | Armazenar agendamentos          | Guarda os dados dos agendamentos realizados.                             | Média      |
| RF17 | Cancelar agendamento            | Permite cancelar consultas agendados.                                    | Baixa      |
| RF18 | Atualizar disponibilidade       | Atualiza horários após agendamento ou cancelamento.                      | Média      |
| RF19 | Notificação de lembrete         | Envia notificação 2 dias antes do agendamento.                           | Média      |
| RF20 | Cadastrar dependentes           | Permite cadastrar pessoas dependentes.                                   | Média      |
| RF21 | Editar dependentes              | Permite atualizar dados dos dependentes cadastrados.                     | Média      |
| RF22 | Remover dependentes             | Permite excluir dependentes cadastrados.                                 | Média      |
| RF23 | Selecionar dependente           | Permite escolher dependente para agendamento.                            | Média      |
| RF24 | Associar agendamento            | Vincula agendamento ao usuário ou dependente.                            | Média      |
| RF25 | Listar por dependente           | Exibe agendamentos separados por dependente.                             | Média      |
| RF26 | Ver agendamentos do dependente  | Mostra todos os agendamentos de um dependente específico.                | Média      |
| RF27 | Identificar responsável         | Indica claramente para quem é cada agendamento.                          | Média      |
| RF28 | Visualizar receita total             | Permite ao gestor visualizar o total de receitas do sistema              | Alta       |
| RF29 | Visualizar despesas totais           | Permite ao gestor visualizar o total de despesas                         | Alta       |
| RF30 | Consultar lucro/prejuízo            | Calcula e exibe o lucro ou prejuízo com base em receitas e despesas      | Alta       |
| RF31 | Gerar relatórios financeiros        | Gera relatórios detalhados de receitas, despesas e resultados financeiros | Alta       |
| RF32 | Visualizar previsão de receita mensal | Exibe estimativas de receita com base em dados históricos                | Média      |
| RF33 | Visualizar previsão de despesas     | Exibe estimativas de despesas futuras                                    | Média      |
| RF34 | Comparar desempenho entre períodos  | Permite comparar métricas financeiras entre períodos distintos           | Média      |
| RF35 | Visualizar assinaturas ativas       | Lista todas as assinaturas ativas no sistema                             | Alta       |
| RF36 | Consultar detalhes de pagamento     | Exibe informações detalhadas de pagamento por clínica                    | Alta       |
| RF37 | Alterar plano de assinatura         | Permite modificar o plano de assinatura de uma clínica                   | Alta       |
| RF38 | Cancelar assinatura                 | Permite cancelar uma assinatura ativa                                   | Alta       |
| RF39 | Reativar assinatura                 | Permite reativar uma assinatura previamente cancelada                   | Média      |
| RF40 | Acessar painel administrativo       | Permite acesso ao painel completo de gestão do sistema                  | Alta       |
| RF41 | Monitorar funcionamento do sistema  | Exibe status e desempenho geral do sistema                              | Alta       |
| RF42 | Visualizar logs de atividades       | Permite consultar registros de ações realizadas no sistema              | Média      |
| RF43 | Gerenciar usuários administrativos  | Permite criar, editar e remover usuários administrativos                | Alta       |
| RF44 | Receber alertas de falhas no sistema| Notifica o gestor sobre falhas ou indisponibilidade do sistema          | Alta       |
| RF45 | Receber alertas de inadimplência    | Notifica sobre assinaturas com pagamentos em atraso                     | Alta       |
| RF46 | Receber alertas financeiros         | Notifica sobre variações financeiras relevantes                         | Média      |




# Requisitos Não Funcionais (RNF)

| ID    | Nome do Requisito | Tipo | Descrição | Prioridade |
|-------|--------------------|------|------------|-------------|
| RNF01 | Criptografia de Dados Sensíveis | Segurança | O sistema deve criptografar todos os dados sensíveis (CPF, laudos e histórico médico) em repouso e em trânsito utilizando o protocolo TLS 1.3 ou superior. | Alta |
| RNF02 | Tempo de Resposta na Busca | Desempenho | O tempo de resposta para a busca de clínicas por proximidade não deve exceder 2 segundos sob condições normais de rede (4G/5G). | Alta |
| RNF03 | Disponibilidade do Sistema | Confiabilidade | A aplicação deve garantir uma disponibilidade de 99,9% (SLA), com janelas de manutenção programadas apenas em horários de baixa utilização. | Alta |
| RNF04 | Acessibilidade da Interface | Usabilidade | A interface deve seguir as diretrizes de acessibilidade WCAG 2.1, garantindo suporte a leitores de tela e contraste adequado para usuários com deficiência visual. | Alta |
| RNF05 | Suporte a Acessos Simultâneos | Escalabilidade | O sistema deve suportar picos de até 10.000 acessos simultâneos sem degradação perceptível de performance por meio de escalonamento horizontal. | Alta |
| RNF06 | Armazenamento Seguro de Anexos | Segurança | Todos os anexos enviados (.pdf, .png, .jpg) devem ser armazenados em ambiente isolado (Bucket) com controle de acesso via tokens temporários. | Alta |
| RNF07 | Tempo de Carregamento do Mapa | Desempenho | O carregamento inicial do mapa e dos marcadores de clínicas deve ser otimizado para não ultrapassar 3 segundos. | Média |
| RNF08 | Consistência Transacional | Confiabilidade | O aplicativo deve manter a consistência transacional (ACID), garantindo que um horário de consulta nunca seja agendado em duplicidade (overbooking). | Alta |
| RNF09 | Padrões de Interface Nativa | Usabilidade | A interface deve seguir os padrões nativos de Design System (Human Interface Guidelines para iOS e Material Design para Android). | Média |
| RNF10 | Registro de Logs de Auditoria | Segurança | O sistema deve registrar logs de auditoria imutáveis para qualquer acesso ou alteração em dados de saúde, conforme exigido pela LGPD. | Alta |
| RNF11 | Arquitetura em Microsserviços | Manutenibilidade | O backend deve ser arquitetado em microsserviços para permitir atualizações independentes de módulos sem afetar a disponibilidade total do app. | Média |
| RNF12 | Tamanho do Aplicativo | Desempenho | O tamanho total do pacote de instalação do aplicativo não deve exceder 150MB para facilitar o download em conexões móveis. | Média |
| RNF13 | Backup e Recuperação de Dados | Confiabilidade | O sistema deve realizar backups automáticos e incrementais a cada 6 horas, com tempo de recuperação (RTO) máximo de 1 hora. | Alta |
| RNF14 | Autenticação em Dois Fatores | Segurança | A aplicação deve implementar autenticação de dois fatores (2FA) para o acesso às funcionalidades de visualização de consultas e dados de perfil. | Alta |
| RNF15 | Cobertura de Testes Unitários | Manutenibilidade | O código-fonte deve possuir cobertura de testes unitários mínima de 80% para garantir a estabilidade durante evoluções do software. | Média |
| RNF16 | Tempo de Atualização de Dados Financeiros | Desempenho | Dados financeiros devem ser atualizados em no máximo 5 segundos após alteração | Alta |
| RNF17 | Precisão das Previsões Financeiras | Confiabilidade | O sistema deve utilizar dados históricos consistentes para gerar previsões com margem mínima de erro aceitável | Média |
| RNF18 | Segurança de Dados Financeiros | Segurança | Informações financeiras devem ser protegidas com criptografia e controle de acesso restrito | Alta |
| RNF19 | Controle de Acesso por Nível | Segurança | Apenas usuários autorizados podem acessar o painel administrativo e dados sensíveis | Alta |
| RNF20 | Registro de Logs Administrativos | Auditoria | Todas as ações do gestor devem ser registradas para auditoria e rastreabilidade | Alta |
| RNF21 | Disponibilidade do Painel Administrativo | Confiabilidade | O painel deve estar disponível com SLA de 99,9% | Alta |
| RNF22 | Escalabilidade do Sistema Financeiro | Escalabilidade | O sistema deve suportar aumento no volume de dados e usuários sem perda de desempenho | Média |
| RNF23 | Tempo de Geração de Relatórios | Desempenho | Relatórios financeiros devem ser gerados em até 10 segundos | Média |
| RNF24 | Interface Intuitiva para Gestão | Usabilidade | O painel deve ser intuitivo, com visualização clara de métricas e indicadores | Média |
| RNF25 | Backup de Dados Financeiros | Confiabilidade | Dados financeiros devem ser salvos com backups automáticos periódicos | Alta |

