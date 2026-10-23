# Requisitos Funcionais (RF)

| ID | Nome do Requisito | Explicação Resumida |
| :--- | :--- | :--- |
| **RF01** | Autenticação de Usuário (Login) | Permite que o usuário realize o acesso ao sistema utilizando suas credenciais. |
| **RF02** | Cadastro de Usuário | Permite o registro de novos usuários, funcionários, médicos e dependentes no sistema. |
| **RF03** | Encerramento de Sessão (Logout) | Permite que o usuário encerre a sua sessão ativa no sistema. |
| **RF04** | Visualização de Usuários | Permite listar e visualizar os detalhes e cadastros de funcionários, médicos e dependentes no sistema. |
| **RF05** | Visualização de Consultas e Histórico | Permite visualizar as consultas agendadas, realizadas e o histórico de atendimento. |
| **RF06** | Visualização de Notificações | Permite ao usuário visualizar avisos e notificações enviadas pelo sistema. |
| **RF07** | Agendamento de Consulta | Permite marcar novas consultas médicas. |
| **RF08** | Gerenciar Consulta | Permite reagendar (alterar data/horário) e cancelar consultas agendadas previamente. |
| **RF09** | Gerenciar Usuários | Permite editar perfis/dados cadastrais e inativar cadastros de usuários (administrador, paciente, funcionários, médicos e dependentes). |
| **RF10** | Visualização de Agenda | Permite ao paciente visualizar a disponibilidade de horários e a agenda médica. |


# Requisitos Não Funcionais (RNF)

| ID    | Nome do Requisito | Tipo | Descrição
|-------|--------------------|------|------------|
| RNF01 | Criptografia de Dados Sensíveis | Segurança | O sistema deve criptografar todos os dados sensíveis (CPF, laudos e histórico médico) em repouso e em trânsito utilizando o protocolo TLS 1.3 ou superior.
| RNF02 | Consistência Transacional | Confiabilidade | O aplicativo deve manter a consistência transacional (ACID), garantindo que um horário de consulta nunca seja agendado em duplicidade (overbooking).
| RNF03 | Registro de Logs de Auditoria | Segurança | O sistema deve registrar logs de auditoria imutáveis para qualquer acesso ou alteração em dados de saúde, conforme exigido pela LGPD. 
| RNF04 | Controle de Acesso por Nível | Segurança | Apenas usuários autorizados podem acessar o painel administrativo e dados sensíveis
| RNF05 | Interface Intuitiva para Gestão | Usabilidade | O painel deve ser intuitivo, com visualização clara de métricas e indicadores 
