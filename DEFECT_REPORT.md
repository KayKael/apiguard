# APIGuard - Relatório de Defeitos (Defect Report)

Este documento detalha os bugs intencionais introduzidos na branch `feature/intentional-bugs` para demonstrar a eficácia do framework de testes.

| Bug ID | Resumo | Severidade | Status |
| :--- | :--- | :--- | :--- |
| BUG-001 | Senha retornada no JSON de registro de usuário | Crítica | Aberto |
| BUG-002 | Falta de validação de propriedade em projetos | Alta | Aberto |
| BUG-003 | SQL Injection potencial na busca de tarefas por título | Crítica | Aberto |

---

### BUG-001: Senha retornada no JSON de registro de usuário
- **Resumo:** O endpoint `POST /api/auth/register` está retornando o hash da senha no corpo da resposta.
- **Passos para reproduzir:**
  1. Enviar uma requisição POST para `/api/auth/register` com dados válidos.
  2. Inspecionar o objeto `user` na resposta JSON.
- **Resultado Esperado:** O objeto `user` não deve conter o campo `password`.
- **Resultado Atual:** O campo `password` (hash) está presente na resposta.
- **Severidade:** Crítica (Vazamento de dados sensíveis).
- **Status:** Aberto.

### BUG-002: Falta de validação de propriedade em projetos
- **Resumo:** Um usuário autenticado consegue deletar projetos de outros usuários se souber o ID.
- **Passos para reproduzir:**
  1. Criar um projeto com o Usuário A (ID 1).
  2. Autenticar como Usuário B.
  3. Enviar uma requisição DELETE para `/api/projects/1`.
- **Resultado Esperado:** Retornar status `403 Forbidden`.
- **Resultado Atual:** Retorna status `204 No Content` e o projeto é deletado.
- **Severidade:** Alta (Quebra de controle de acesso).
- **Status:** Aberto.

### BUG-003: SQL Injection potencial na busca de tarefas
- **Resumo:** O filtro de busca por título em tarefas concatena strings diretamente na query SQL.
- **Passos para reproduzir:**
  1. Enviar requisição GET para `/api/tasks?search='; DROP TABLE users; --`.
- **Resultado Esperado:** A busca deve tratar a string como literal ou retornar erro de validação.
- **Resultado Atual:** A query é executada, permitindo manipulação do banco de dados.
- **Severidade:** Crítica (Risco de perda total de dados).
- **Status:** Aberto.
