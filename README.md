# APIGuard: Framework de Testes e QA para API RESTful

## Visão Geral do Projeto

O APIGuard é um projeto de portfólio desenvolvido para demonstrar proficiência em Engenharia de Qualidade (QA) de Backend, com foco em testes automatizados para serviços RESTful. Ele apresenta uma API de gerenciamento de tarefas simples, mas completa, construída com Node.js e TypeScript, utilizando PostgreSQL como banco de dados. O projeto inclui uma suíte robusta de testes, uma coleção Postman detalhada e uma pipeline de CI/CD com GitHub Actions, tudo orquestrado com Docker.

### Arquitetura do Projeto

A arquitetura do APIGuard segue um padrão modular, separando as responsabilidades em camadas distintas para facilitar a manutenção e escalabilidade. Os principais componentes são:

- **API RESTful (Node.js/TypeScript/Express):** O coração da aplicação, expondo endpoints para gerenciamento de usuários, projetos e tarefas. Utiliza JWT para autenticação e `zod` para validação de entrada.
- **Banco de Dados (PostgreSQL):** Armazena os dados das entidades `Users`, `Projects` e `Tasks`, garantindo integridade referencial e transacional.
- **Camada de Repositório:** Abstrai a lógica de acesso ao banco de dados, utilizando `pg` para interagir com o PostgreSQL de forma segura (consultas parametrizadas).
- **Camada de Serviço:** Contém a lógica de negócios, orquestrando as operações dos repositórios e aplicando regras de negócio.
- **Camada de Controle:** Lida com as requisições HTTP, invoca os serviços apropriados e formata as respostas.
- **Middleware de Autenticação:** Protege os endpoints da API, verificando e validando tokens JWT.
- **Docker e Docker Compose:** Utilizados para containerizar a aplicação e o banco de dados, garantindo um ambiente de desenvolvimento e teste consistente e isolado.
- **Testes Automatizados (Jest/Supertest):** Uma suíte abrangente de testes unitários, de integração e de validação de banco de dados para garantir a qualidade do código e o comportamento correto da API.
- **Coleção Postman/Newman:** Uma coleção completa de requisições da API, com variáveis de ambiente e scripts de teste automatizados para validação rápida e manual dos endpoints.
- **CI/CD (GitHub Actions):** Uma pipeline de integração contínua que automatiza a execução dos testes em cada push ou pull request, garantindo que novas alterações não introduzam regressões.

## Como Rodar a Aplicação e Testes Localmente com Docker

Para executar o APIGuard e sua suíte de testes em seu ambiente local usando Docker, siga os passos abaixo:

1.  **Pré-requisitos:**
    *   Docker Desktop (ou Docker Engine e Docker Compose) instalado.
    *   Git instalado.

2.  **Clonar o Repositório:**
    ```bash
    git clone https://github.com/seu-usuario/apiguard.git # Substitua pelo seu repositório
    cd apiguard
    ```

3.  **Configurar Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto, copiando o conteúdo de `.env.example` e preenchendo as variáveis, se necessário. Para desenvolvimento local, as configurações padrão geralmente são suficientes.
    ```bash
    cp .env.example .env
    ```

4.  **Iniciar os Serviços com Docker Compose:**
    Este comando irá construir as imagens Docker (se necessário), criar os contêineres para o banco de dados PostgreSQL e a API, e iniciá-los.
    ```bash
    docker-compose up --build -d
    ```
    A flag `-d` executa os contêineres em segundo plano.

5.  **Inicializar o Banco de Dados:**
    Após os contêineres estarem em execução, você precisa inicializar o esquema do banco de dados. Execute o seguinte comando dentro do contêiner da API:
    ```bash
    docker exec -it apiguard-api npm run build
    docker exec -it apiguard-api ts-node src/config/init-db.ts
    ```
    Isso criará as tabelas `users`, `projects` e `tasks`.

6.  **Acessar a API:**
    A API estará disponível em `http://localhost:3000`. Você pode verificar se está funcionando acessando `http://localhost:3000/health` no seu navegador ou com uma ferramenta como o Postman.

7.  **Executar os Testes Automatizados:**
    Para rodar a suíte completa de testes (unitários, integração e banco de dados), execute o comando `npm test` dentro do contêiner da API:
    ```bash
    docker exec -it apiguard-api npm test
    ```
    Alternativamente, você pode rodar os testes localmente após instalar as dependências (sem Docker para a API, mas com o DB rodando no Docker):
    ```bash
    npm install
    npm test
    ```

## Como Rodar a Coleção Postman

1.  **Importar a Coleção:**
    *   Abra o Postman.
    *   Clique em `Import` e selecione o arquivo `postman_collection.json` localizado na raiz deste repositório.

2.  **Configurar o Ambiente:**
    *   No Postman, crie um novo ambiente chamado `APIGuard Local`.
    *   Adicione uma variável de ambiente chamada `base_url` com o valor `http://localhost:3000`.
    *   Selecione este ambiente para uso.

3.  **Executar as Requisições:**
    *   A coleção contém pastas para `Auth` e `Projects` (e `Tasks` quando implementado).
    *   Comece com as requisições de `Auth` para registrar e logar um usuário. O token JWT será automaticamente salvo em uma variável de ambiente (`auth_token`) para uso nas requisições subsequentes.
    *   Prossiga para as requisições de `Projects` e `Tasks`.

4.  **Executar Testes Automatizados do Postman (Newman):**
    Para executar a coleção via linha de comando com Newman (útil para CI/CD ou automação local):
    ```bash
    # Instale o Newman globalmente se ainda não o fez
    npm install -g newman

    # Exporte o ambiente do Postman (se tiver variáveis dinâmicas como o token)
    # Ou crie um arquivo de ambiente JSON manualmente com a base_url
    # Exemplo de arquivo de ambiente (apiguard-env.json):
    # {"id": "...", "name": "APIGuard Local", "values": [{"key": "base_url", "value": "http://localhost:3000", "enabled": true}]}

    newman run postman_collection.json -e apiguard-env.json
    ```

## Pipeline CI/CD com GitHub Actions

O projeto APIGuard utiliza GitHub Actions para automatizar o processo de Integração Contínua (CI). A pipeline é definida no arquivo `.github/workflows/ci.yml` e é acionada em cada `push` para as branches `main` e `develop`, e em cada `pull_request` para a branch `main`.

### Fluxo da Pipeline:

1.  **Checkout do Código:** O código do repositório é clonado.
2.  **Configuração do Node.js:** Um ambiente Node.js (versão 22) é configurado.
3.  **Instalação de Dependências:** As dependências do projeto são instaladas usando `npm ci` para garantir instalações limpas e reproduzíveis.
4.  **Serviço PostgreSQL:** Um contêiner PostgreSQL é iniciado como um serviço para os testes, configurado com as variáveis de ambiente necessárias e uma verificação de saúde para garantir que o banco de dados esteja pronto antes da execução dos testes.
5.  **Execução de Lint:** O `eslint` é executado para verificar a conformidade do código com os padrões de estilo e qualidade definidos.
6.  **Execução de Testes com Cobertura:** A suíte de testes (`npm run test:coverage`) é executada, incluindo testes unitários, de integração e de banco de dados. As variáveis de ambiente para o banco de dados são injetadas para que os testes possam se conectar ao serviço PostgreSQL em execução.
7.  **Upload de Relatórios de Cobertura:** Os resultados da cobertura de código são enviados para o Codecov (requer `CODECOV_TOKEN` configurado como um segredo no GitHub).

Esta pipeline garante que todas as alterações de código passem por verificações de qualidade e testes automatizados antes de serem integradas, promovendo um ciclo de desenvolvimento rápido e confiável.

## Sumário de Cobertura de Testes

O projeto APIGuard visa uma alta cobertura de testes para garantir a confiabilidade e robustez da API. A meta é atingir pelo menos **80% de cobertura** na camada de lógica de negócios (serviços e repositórios).

Os testes são divididos em:

-   **Testes Unitários:** Focam em componentes isolados (e.g., `AuthService`), garantindo que a lógica individual funcione conforme o esperado.
-   **Testes de Integração:** Verificam a interação entre diferentes módulos e a API como um todo (e.g., rotas de autenticação), garantindo que os endpoints funcionem corretamente com o banco de dados e outros serviços.
-   **Testes de Validação de Banco de Dados:** Asseguram que as operações de CRUD e as restrições do banco de dados (e.g., unicidade de email) funcionem como esperado.

Para visualizar o relatório de cobertura de testes localmente, execute `npm run test:coverage` e abra o arquivo `coverage/lcov-report/index.html` no seu navegador.

## Relatório de Defeitos

Uma parte crucial da Engenharia de Qualidade é a identificação e documentação de defeitos. Este projeto inclui um `DEFECT_REPORT.md` que detalha **três bugs intencionalmente introduzidos** em uma branch separada (`feature/intentional-bugs`). Este relatório demonstra a capacidade de identificar, descrever e categorizar defeitos, incluindo passos para reprodução, resultados esperados vs. atuais e severidade.

Consulte o arquivo `DEFECT_REPORT.md` para mais detalhes sobre os bugs e como eles foram documentados.

## Qualidade do Código

O projeto adere a altos padrões de qualidade de código, incluindo:

-   **TypeScript com `strict` mode:** Garante tipagem forte e previne erros comuns em tempo de compilação.
-   **Validação de Entrada:** Todos os endpoints utilizam `zod` para validação rigorosa dos dados de entrada, retornando mensagens de erro significativas.
-   **Consultas Parametrizadas:** Todas as interações com o banco de dados utilizam consultas parametrizadas para prevenir ataques de SQL Injection.
-   **Código Limpo e Modular:** A estrutura do projeto é organizada em camadas claras (repositórios, serviços, controladores) para promover a manutenibilidade e a legibilidade.

---

**Autor:** Manus AI
**Licença:** MIT
