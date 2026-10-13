<p align="right">
  <a href="README.md">🇺🇸 English</a> · <a href="README.pt-BR.md"><strong>🇧🇷 Português</strong></a>
</p>

<p align="center">
  <img src="docs/screenshots/fitcpx-logo.png" alt="Logo do FitCPX" width="96" />
</p>

<h1 align="center">FitCPX · API Backend</h1>

<p align="center">
  <strong>Os serviços por trás de um SaaS real de gestão fitness — e a engenharia que conecta tudo isso.</strong>
</p>

<p align="center">
  <a href="https://fitcpx.com">Produto oficial</a> ·
  <a href="https://github.com/Allyyssoonnn/fitcpx-web">Aplicação web</a> ·
  <a href="#por-dentro-deste-repositório">Explorar o código</a>
</p>

<p align="center">
  <code>Node.js</code> &nbsp; <code>TypeScript</code> &nbsp; <code>NestJS</code> &nbsp;
  <code>Express</code> &nbsp; <code>Sequelize</code> &nbsp; <code>MySQL</code>
</p>

---

## O projeto

O FitCPX é uma plataforma comercial para personal trainers e empresas do setor fitness. Reúne **gestão de alunos, prescrição de treinos, avaliações físicas, agenda, contratos, planos, pagamentos e comunicação**.

Este repositório contém o **backend responsável por esses fluxos**. Não é um template inicial nem um projeto demonstrativo isolado. Seu histórico Git registra a evolução de uma aplicação real desde **novembro de 2024**, com novos módulos, manutenção e mudanças de arquitetura.

Desenvolvi e mantive funcionalidades de backend envolvendo endpoints, regras de negócio, persistência de dados, integrações externas e operações do produto. O código reflete desafios reais de manter funcionalidades interdependentes funcionando ao longo do tempo.

> **Limite do repositório:** este é o backend, não todo o ecossistema FitCPX. A [aplicação web dos profissionais](https://github.com/Allyyssoonnn/fitcpx-web), o aplicativo **FitCPX – Aluno** e o **aplicativo independente de biblioteca de exercícios** possuem códigos-fonte separados.

## O que a API oferece

| Área | Responsabilidades implementadas no backend |
| --- | --- |
| **Contas e empresas** | Autenticação, cadastro de usuários, registros de empresas, licenças e informações de dashboards |
| **Alunos** | Perfis, operações de conta, anexos e registros relacionados |
| **Treinos** | Treinos, sessões, exercícios, histórico de execução e geração de PDFs |
| **Avaliações físicas** | Registros de avaliações, imagens, medidas e relatórios em PDF |
| **Agenda e serviços** | Eventos de calendário, agendamentos, serviços e planos |
| **Contratos e cobranças** | Criação de contratos, assinatura eletrônica, checkout, licenças, pagamentos e repasses |
| **Comunicação** | Mensagens de chat, e-mails transacionais, notificações e endpoints para o aplicativo do aluno |

Essas funcionalidades abrangem vários módulos e serviços externos. Alguns fluxos exigem credenciais, dados e aplicações clientes conectadas; a presença do código não significa que tudo funcione sem configuração.

## Destaques técnicos

### Arquitetura em evolução: Express + NestJS

A aplicação combina um ponto de entrada legado em **Express** com uma aplicação modular em **NestJS**, montada no mesmo servidor HTTP. As rotas JavaScript mais antigas convivem com módulos TypeScript mais recentes, refletindo uma evolução incremental da arquitetura, não uma reescrita feita de uma só vez.

- **Camada Express:** `index.js`, `api/routes/` e `api/controllers/` mantêm fluxos legados da API.
- **Módulos NestJS:** `app.module.ts` e `modules/` organizam controllers, services, repositories e integrações por domínio.
- **Persistência:** modelos, migrations e seeders do Sequelize conectam os fluxos da aplicação ao MySQL.
- **Controle de acesso:** middleware de verificação de tokens atende requisições autenticadas, incluindo tokens específicos do aplicativo do aluno; o NestJS também configura limitação de requisições.
- **Operação:** Docker, PM2, um script de teste de carga com k6 e configurações de monitoramento fazem parte do repositório.

### Como as partes se conectam

```text
FitCPX Web ─────────────────┐
                           │
FitCPX – Aluno (mobile) ────┼──► Servidor HTTP Node.js
                           │       ├── Rotas Express legadas
Outros clientes autorizados ┘       └── Módulos NestJS
                                       ├── Controllers e services
                                       ├── Repositories / models Sequelize ──► MySQL
                                       └── Integrações externas
                                             ├── Asaas / Autentique
                                             ├── AWS S3
                                             ├── Notificações Firebase
                                             └── Serviços de e-mail
```

A **biblioteca independente de exercícios** é outro produto mobile e não deve ser confundida com o aplicativo do aluno conectado à plataforma de gestão.

### Integrações presentes no código

- **Asaas:** cobranças, licenças, operações financeiras e tratamento de eventos.
- **Autentique:** fluxos de assinatura eletrônica de contratos.
- **AWS S3:** armazenamento de arquivos enviados e imagens relacionadas a avaliações.
- **Firebase Admin:** notificações push para fluxos mobile compatíveis.
- **Mailtrap:** envio de e-mails e configuração de sandbox.
- **Geração de PDFs:** templates e fluxos de renderização de documentos de treinos e avaliações físicas.

A disponibilidade das integrações depende das contas e configurações dos provedores. Dependências e integrações presentes em commits antigos podem ser diferentes da implementação atual.

### Exemplos de rotas da API

Estes são exemplos conectados pela entrada Express atual ou por módulos NestJS registrados, **não uma documentação completa da API**:

| Método | Rota | Área |
| --- | --- | --- |
| `POST` | `/users/login` | Autenticação |
| `GET` | `/students` | Gestão de alunos |
| `POST` | `/treino/getTreinos` | Rotas legadas de treinos |
| `POST` | `/contracts/newContract` | Contratos |
| `GET` | `/payments/getPayouts` | Operações financeiras |
| `POST` | `/mobile/login` | Aplicativo do aluno |

A maioria das operações exige token e contexto adequado. Integrações externas também podem ser necessárias.

## Tecnologias

| Área | Tecnologias e ferramentas |
| --- | --- |
| Servidor | Node.js, JavaScript, TypeScript, Express, NestJS |
| Banco de dados | MySQL, Sequelize, Sequelize CLI |
| Autenticação | JSON Web Tokens, middlewares e throttling do NestJS |
| Integrações | Asaas, Autentique, AWS SDK para S3, Firebase Admin, Mailtrap |
| Documentos | Puppeteer, templates HTML para PDFs |
| Implantação | Docker, Docker Compose, PM2 |
| Testes / diagnóstico | Configuração Jest, script k6, OpenTelemetry e configurações de monitoramento |

O repositório contém ferramentas e configurações para testes e observabilidade, mas este README **não afirma que exista uma suíte de testes automatizados ou monitoramento integralmente configurado**. `WorkoutsModule`, `PhysicalAssessmentsModule` e `ExercisesModule` estão registrados em `AppModule.imports`, embora seu funcionamento em execução não tenha sido validado nesta revisão da documentação.

## Por dentro deste repositório

```text
index.js                  # Entrada Express / servidor HTTP
main.ts                   # Inicialização NestJS na instância Express
app.module.ts             # Composição dos módulos NestJS
api/                      # Rotas e controllers JavaScript legados
modules/                  # Módulos NestJS organizados por domínio
  users/                  # Contas e autenticação
  companies/              # Empresas e dashboards
  students/               # Gestão de alunos
  workouts/               # Treinos, exercícios e PDFs
  physicalAssessments/    # Avaliações e relatórios
  contracts/              # Contratos
  payments/               # Operações financeiras
  mobile/                 # Endpoints do aplicativo do aluno
  ...                     # Agenda, chat, eventos, serviços etc.
database/                 # Models, migrations e seeders Sequelize
shared/                   # Middlewares de autenticação e utilitários
infra/                    # Configuração de observabilidade
Dockerfile                # Construção do contêiner
Arquivos Docker Compose   # Exemplos de orquestração
docs/legacy-workflows/    # Workflows de CI/CD arquivados (inativos na main)
```

## Executando localmente

Este backend faz parte de um sistema comercial com múltiplos serviços. Apenas baixar o código-fonte **não fornece um ambiente de desenvolvimento funcional automaticamente**.

### Pré-requisitos

- Node.js e npm (o Dockerfile atual utiliza uma imagem-base Node 18; revise a versão do runtime antes de implantar).
- Servidor MySQL acessível e banco de dados criado para o seu ambiente.
- Configuração privada dos serviços necessários aos módulos que pretende executar.
- Arquivo JSON de conta de serviço Firebase para o caminho usado atualmente na inicialização das notificações, mesmo para iniciar a API.

### Configuração

```bash
npm install
cp .env.example .env
cp database/config.example.json database/config.json
```

Preencha somente as credenciais necessárias no seu ambiente de desenvolvimento. **Nunca versione** `.env`, `database/config.json` nem chaves privadas do Firebase. O `.env.example` não contém segredos reais.

O Sequelize CLI lê `database/config.json` através de `.sequelizerc`; o arquivo de variáveis de ambiente **não substitui esse JSON**. Configure banco, usuário, senha e host de desenvolvimento conforme seu MySQL local.

A inicialização atual do Firebase em `modules/notifications/notifications.api.ts` referencia **um nome específico de arquivo JSON local dentro de `modules/notifications/keys/`**. Forneça uma conta de serviço de desenvolvimento no caminho esperado pelo código ou adapte intencionalmente a inicialização para o seu ambiente. Esse arquivo privado não acompanha o repositório público.

Depois de criar o banco e fornecer as configurações necessárias:

```bash
npx sequelize-cli db:migrate
npm run dev
```

O servidor Express normalmente utiliza a **porta 8070**; com `NODE_ENV=test`, seleciona a **8071**. A aplicação NestJS fica montada na mesma instância Express.

Para verificar a compilação TypeScript:

```bash
npm run build
```

**Atenção:** não recomendo usar `npm run reset` como atalho de configuração: o script existente recria um banco chamado `educapp`, enquanto `database/config.example.json` usa nomes de exemplo iniciados por `fitcpx_`. Confira e alinhe essas configurações antes de executar comandos destrutivos de banco. Revise também a configuração Docker/Compose antes de usá-la em um ambiente público.

Os comandos acima documentam scripts existentes; **não foram validados como instalação integral do zero, com todas as integrações**.

**Nota de segurança para Docker:** o contexto de build deve excluir `.env*`, `database/config.json` e os arquivos JSON privados do Firebase. O `.gitignore` não protege automaticamente as imagens Docker. Forneça os segredos em tempo de execução por configurações seguras ou arquivos montados; a inicialização atual do Firebase espera um JSON no disco. Revise o processo de deploy antes de alterar um ambiente de produção.

## Outros produtos FitCPX

O backend atende à plataforma web dos profissionais e a fluxos mobile do **FitCPX – Aluno**, aplicativo para clientes de profissionais cadastrados. O aluno pode acessar treinos prescritos e informações relacionadas — **não se trata do aplicativo independente de biblioteca de exercícios**.

- **Aplicação web profissional:** [fitcpx-web](https://github.com/Allyyssoonnn/fitcpx-web)
- **FitCPX – Aluno:** [Google Play](https://play.google.com/store/apps/details?id=com.devcomplexlab.alunofitcpx) · [App Store](https://apps.apple.com/br/app/fitcpx-aluno/id6749808580)
- **Biblioteca independente FitCPX:** [Google Play](https://play.google.com/store/apps/details?id=com.devcomplexlab.fitcpx) · [App Store](https://apps.apple.com/us/app/fitcpx/id6749830273)

Os dois aplicativos móveis possuem códigos-fonte próprios, não incluídos neste repositório.

## Por que o histórico importa

O histórico Git foi preservado intencionalmente de **2024 a 2026**, registrando desenvolvimento real, mudanças arquiteturais e manutenção. Abordagens antigas e migrações incrementais fazem parte desse registro — nem toda implementação histórica representa a arquitetura preferida atualmente.

Arquivos gerados volumosos e materiais sensíveis antigos foram retirados durante a preparação para revisão pública. Preservar o histórico de engenharia não significa disponibilizar a infraestrutura de produção ou credenciais privadas.

## Produto e código-fonte

- **Produto oficial:** [fitcpx.com](https://fitcpx.com)
- **Empresa / projeto:** FitCPX, LAB COMPLEX DEV LTDA
- **Objetivo do repositório:** portfólio técnico e demonstração do código-fonte

O FitCPX é um produto comercial. Salvo inclusão de licença adequada pelos titulares dos direitos, a publicação deste repositório **não concede permissão para reutilizar ou redistribuir o código**. Credenciais de produção e dados pessoais não devem ser publicados.

---

<p align="center"><sub>Construído como produto real. Compartilhado para mostrar o trabalho por trás dele.</sub></p>
