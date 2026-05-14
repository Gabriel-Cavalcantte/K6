# K6 - Complete Load Testing Portfolio Project

[🇧🇷 Versão em Português](#português) | [🇬🇧 English Version](#english)

---

## Português

# 📚 K6 - Projeto Completo de Testes de Carga

Um projeto completo de portfólio para QA que demonstra automação de testes de performance, carga e browser usando **k6**, integrado com uma API REST funcional, frontend responsivo, e dashboard em tempo real com Grafana.

## 🎯 Objetivo

Este projeto foi criado para demonstrar:
- ✅ Expertise em testes de carga com **k6**
- ✅ Desenvolvimento de API REST com **Node.js + Express**
- ✅ Testes de browser com **k6 Browser (Chromium)**
- ✅ Containerização com **Docker e Docker Compose**
- ✅ Monitoramento em tempo real com **Grafana + InfluxDB**
- ✅ CI/CD automatizado com **GitHub Actions**
- ✅ Logs estruturados e observabilidade

## 📁 Estrutura do Projeto

```
K6/
├── api/                    # Backend Node.js + Express
│   ├── src/
│   │   ├── app.js         # Servidor Express principal
│   │   ├── db/            # Conexão PostgreSQL e schema
│   │   ├── routes/        # Endpoints CRUD
│   │   └── middleware/    # Logging com Pino
│   ├── swagger.yaml       # Documentação OpenAPI
│   └── Dockerfile
│
├── frontend/              # Frontend HTML + Vanilla JS
│   ├── index.html        # Interface responsiva
│   ├── app.js           # Lógica de CRUD
│   └── Dockerfile
│
├── k6/                    # Testes de carga k6
│   ├── scenarios/        # Smoke, Load, Stress, Spike, Browser
│   ├── helpers/          # Funções reutilizáveis
│   └── options/          # Configurações por cenário
│
├── grafana/              # Dashboards e datasources
│   └── provisioning/    # Auto-provisioned na startup
│
├── docker-compose.yml    # Orquestra todos os serviços
└── .github/workflows/    # Pipelines CI/CD
```

## 🚀 Quick Start

### Pré-requisitos
- Docker e Docker Compose
- k6 (para rodar tests localmente)
- Node.js 20+ (para desenvolvimento)

### 1. Subir a infraestrutura completa

```bash
docker-compose up -d
```

Isso vai iniciar:
- **API Backend**: http://localhost:3000
- **Frontend**: http://localhost:8080
- **Swagger UI**: http://localhost:3000/api-docs
- **Grafana**: http://localhost:3001 (admin/admin)
- **InfluxDB**: http://localhost:8086 (admin/adminpassword)
- **PostgreSQL**: localhost:5432

### 2. Rodar testes k6

```bash
# Smoke test (validação básica)
k6 run --out json=smoke.json k6/scenarios/smoke.js

# Load test (carga normal)
k6 run --out influxdb=http://localhost:8086/k6 k6/scenarios/load.js

# Stress test (encontrar limite de capacidade)
k6 run k6/scenarios/stress.js

# Spike test (pico repentino)
k6 run k6/scenarios/spike.js

# Browser test (UI automation com Chromium)
K6_BROWSER_ENABLED=true k6 run k6/scenarios/browser.js
```

### 3. Visualizar métricas em tempo real

- Acesse **Grafana** em http://localhost:3001
- Login: `admin` / `admin`
- Dashboard: "k6 Load Testing Dashboard"

## 📊 Cenários de Teste

### Smoke Test ✅
- **Usuários**: 2 VUs
- **Duração**: 1 min 20s
- **Objetivo**: Validar rapidamente que todos os endpoints funcionam
- **Thresholds**:
  - Response time p95 < 500ms
  - Failure rate < 1%
  - Checks pass rate > 95%

### Load Test 📈
- **Usuários**: 0 → 10 → 30 VUs
- **Duração**: 8 min (ramp-up, hold, ramp-down)
- **Objetivo**: Simular carga normal e comportamento realista
- **Thresholds**:
  - Response time p95 < 500ms, p99 < 1000ms
  - Failure rate < 5%
  - Mínimo 50 req/s

### Stress Test 💪
- **Usuários**: 0 → 50 → 100 → 200 VUs
- **Duração**: 9 min (encontrar limite)
- **Objetivo**: Descobrir breaking point da API
- **Thresholds**:
  - Response time p95 < 1000ms
  - Failure rate < 10%
  - Checks pass rate > 80%

### Spike Test 🔥
- **Usuários**: 10 → 300 VUs (10s) → ramp-down
- **Duração**: 45s
- **Objetivo**: Testar recuperação de pico repentino
- **Thresholds**:
  - Response time p95 < 1500ms
  - Failure rate < 20%

### Browser Test 🌐
- **Usuários**: 1 VU
- **Iterações**: 3
- **Objetivo**: Testar UI com Chromium automation
- **Ações**:
  - Navegar para o site
  - Preencher formulário de criação de livro
  - Verificar se livro aparece na tabela
  - Validar elementos da página

## 🔌 API Endpoints

### Books CRUD

```http
GET    /api/books              # Listar livros (com paginação)
GET    /api/books/:id          # Obter livro específico
POST   /api/books              # Criar novo livro
PUT    /api/books/:id          # Atualizar livro
DELETE /api/books/:id          # Deletar livro
```

### Health & Docs

```http
GET    /health                 # Health check
GET    /api-docs               # Swagger UI com documentação interativa
```

## 📈 Métricas Monitoradas

O Grafana monitora em tempo real:
- **HTTP Request Duration**: p50, p95, p99 percentis
- **Request Rate**: Requisições por segundo
- **Error Rate**: Porcentagem de falhas
- **Virtual Users (VUs)**: Usuários ativos durante teste
- **Checks**: Taxa de sucesso das validações

## 🐳 Docker Compose Services

| Serviço | Imagem | Porta | Healthcheck |
|---------|--------|-------|-------------|
| api | Node.js 20 Alpine | 3000 | GET /health |
| frontend | Nginx Alpine | 8080 | GET / |
| postgres | PostgreSQL 16 | 5432 | pg_isready |
| influxdb | InfluxDB 2.7 | 8086 | GET /health |
| grafana | Grafana Latest | 3001 | GET /api/health |

## 🔄 CI/CD com GitHub Actions

### ci.yml (Automático em push)
- ✅ Build de Docker images
- ✅ Deploy dos serviços
- ✅ Execução de smoke test
- ✅ Upload de resultados

**Triggered**: Push para branch `release`

### k6-load-test.yml (Manual)
- 🎯 Menu dropdown para escolher cenário (smoke/load/stress/spike)
- 📊 Executa teste escolhido
- 📁 Salva resultados por 30 dias
- 📈 Métricas no InfluxDB

**Triggered**: `workflow_dispatch` (botão no GitHub)

Como executar:
1. Vá para **Actions** no GitHub
2. Selecione **"k6 Load Test"**
3. Clique **"Run workflow"**
4. Escolha o cenário desejado
5. Monitore a execução

## 📝 Modelo de Dados (Books)

```sql
CREATE TABLE books (
  id        SERIAL PRIMARY KEY,
  title     VARCHAR(255) NOT NULL,
  author    VARCHAR(255) NOT NULL,
  isbn      VARCHAR(20) UNIQUE,
  year      INTEGER,
  stock     INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 Credenciais Padrão

```
PostgreSQL:
  User: user
  Password: password
  Database: k6_books

InfluxDB:
  User: admin
  Password: adminpassword
  Database: k6

Grafana:
  User: admin
  Password: admin
```

## 📚 Exemplo de Requisição

### Criar livro

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Go Programming Language",
    "author": "Robert Griesemer",
    "isbn": "978-0134190441",
    "year": 2015,
    "stock": 5
  }'
```

### Listar livros

```bash
curl http://localhost:3000/api/books?page=1&limit=10
```

## 🛠️ Desenvolvimento Local

### Instalar dependências da API

```bash
cd api
npm install
npm start  # ou npm run dev para hot-reload
```

### Frontend

Abra `frontend/index.html` em um navegador ou use:

```bash
cd frontend
python -m http.server 8000  # ou live-server
```

## 📊 Como Interpretar Resultados

### No Grafana
- **Duration Chart**: Ver se response times estão dentro de SLA
- **Error Rate**: Verificar se taxa de erro aumenta com carga
- **Request Rate**: Confirmar que está atingindo throughput esperado
- **VUs**: Correlacionar comportamento com número de usuários

### No JSON de Resultados k6

```bash
# Visualizar resumo dos resultados
jq '.metrics | keys' smoke.json
```

## 🎓 O Que Este Projeto Demonstra

### Para QA/Testes:
- ✅ Proficiência em k6 e load testing
- ✅ Conhecimento de smoke, load, stress e spike tests
- ✅ Automação de testes de browser com k6
- ✅ Validação de múltiplos critérios (checks)
- ✅ Análise de métricas e SLAs

### Para DevOps/SRE:
- ✅ Docker e containerização
- ✅ Docker Compose para orquestração local
- ✅ Health checks e readiness probes
- ✅ Logging estruturado com Pino
- ✅ Monitoramento com InfluxDB + Grafana

### Para Full-Stack:
- ✅ API REST com Node.js/Express
- ✅ Frontend responsivo sem frameworks
- ✅ PostgreSQL e gerenciamento de BD
- ✅ Swagger/OpenAPI documentation
- ✅ CI/CD with GitHub Actions

## 📞 Support & Recursos

- **k6 Docs**: https://k6.io/docs
- **k6 Browser**: https://k6.io/docs/using-k6-browser/
- **Grafana Docs**: https://grafana.com/docs/grafana/latest/
- **InfluxDB**: https://docs.influxdata.com/influxdb/cloud/
- **Express.js**: https://expressjs.com/

---

## English

# 📚 K6 - Complete Load Testing Portfolio Project

A comprehensive portfolio project for QA demonstrating performance, load, and browser testing automation using **k6**, integrated with a functional REST API, responsive frontend, and real-time Grafana dashboard.

## 🎯 Objectives

This project demonstrates:
- ✅ Expertise in load testing with **k6**
- ✅ REST API development with **Node.js + Express**
- ✅ Browser testing with **k6 Browser (Chromium)**
- ✅ Containerization with **Docker and Docker Compose**
- ✅ Real-time monitoring with **Grafana + InfluxDB**
- ✅ Automated CI/CD with **GitHub Actions**
- ✅ Structured logging and observability

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- k6 (for running tests locally)
- Node.js 20+ (for development)

### 1. Start all services

```bash
docker-compose up -d
```

### 2. Run k6 tests

```bash
# Smoke test
k6 run --out json=smoke.json k6/scenarios/smoke.js

# Load test with InfluxDB output
k6 run --out influxdb=http://localhost:8086/k6 k6/scenarios/load.js

# Stress test
k6 run k6/scenarios/stress.js

# Spike test
k6 run k6/scenarios/spike.js

# Browser test
K6_BROWSER_ENABLED=true k6 run k6/scenarios/browser.js
```

### 3. View metrics

- **Grafana**: http://localhost:3001 (admin/admin)
- **API Docs**: http://localhost:3000/api-docs
- **Frontend**: http://localhost:8080

## 📊 Test Scenarios

### Smoke Test ✅
- **VUs**: 2
- **Duration**: 1m 20s
- **Purpose**: Quick validation of all endpoints
- **Thresholds**: p95<500ms, failure rate<1%, checks>95%

### Load Test 📈
- **VUs**: 0 → 10 → 30
- **Duration**: 8 minutes
- **Purpose**: Realistic load simulation
- **Thresholds**: p95<500ms, p99<1000ms, failure rate<5%

### Stress Test 💪
- **VUs**: 0 → 50 → 100 → 200
- **Duration**: 9 minutes
- **Purpose**: Find breaking point
- **Thresholds**: p95<1000ms, failure rate<10%

### Spike Test 🔥
- **VUs**: 10 → 300 (sudden)
- **Duration**: 45 seconds
- **Purpose**: Test recovery from sudden load
- **Thresholds**: p95<1500ms, failure rate<20%

### Browser Test 🌐
- **VUs**: 1
- **Iterations**: 3
- **Purpose**: UI automation with Chromium
- **Actions**: Navigate, fill form, verify table

## 🔌 API Endpoints

```
GET    /api/books              # List books with pagination
GET    /api/books/:id          # Get specific book
POST   /api/books              # Create new book
PUT    /api/books/:id          # Update book
DELETE /api/books/:id          # Delete book
GET    /health                 # Health check
GET    /api-docs               # Swagger/OpenAPI documentation
```

## 🔄 CI/CD Pipelines

### ci.yml (Automatic)
- Triggered on push to `release` branch
- Builds Docker images
- Runs smoke test
- Uploads artifacts

### k6-load-test.yml (Manual)
- Triggered via `workflow_dispatch`
- Choose scenario: smoke/load/stress/spike
- 30-day result retention
- InfluxDB metrics collection

## 📝 Database Schema

```sql
CREATE TABLE books (
  id        SERIAL PRIMARY KEY,
  title     VARCHAR(255) NOT NULL,
  author    VARCHAR(255) NOT NULL,
  isbn      VARCHAR(20) UNIQUE,
  year      INTEGER,
  stock     INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 Default Credentials

```
PostgreSQL:    user/password
InfluxDB:      admin/adminpassword
Grafana:       admin/admin
```

## 📚 Example Requests

### Create Book
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Go Programming Language",
    "author": "Robert Griesemer",
    "isbn": "978-0134190441",
    "year": 2015,
    "stock": 5
  }'
```

### List Books
```bash
curl http://localhost:3000/api/books?page=1&limit=10
```

## 🛠️ Local Development

### API
```bash
cd api
npm install
npm start        # Production
npm run dev      # Development with hot-reload
```

### Frontend
```bash
# Serve locally (requires Python)
cd frontend
python -m http.server 8000
```

## 📊 Monitoring & Dashboards

**Grafana automatically provisions**:
- HTTP Duration metrics (p50, p95, p99)
- Request rate (req/s)
- Error rate (%)
- Active Virtual Users
- Checks pass/fail rates

## 🎓 Skills Demonstrated

### QA/Testing:
- k6 load testing expertise
- Smoke, load, stress, spike test design
- Browser test automation
- Check/assertion validation
- Metrics analysis and SLA verification

### DevOps:
- Docker containerization
- Docker Compose orchestration
- Health checks and probes
- Structured logging (Pino)
- Monitoring (InfluxDB + Grafana)

### Development:
- Node.js/Express REST API
- Responsive frontend (HTML/CSS/JS)
- PostgreSQL management
- OpenAPI/Swagger documentation
- GitHub Actions CI/CD

## 📞 Resources

- **k6**: https://k6.io
- **Grafana**: https://grafana.com
- **InfluxDB**: https://www.influxdata.com
- **Express.js**: https://expressjs.com
- **Docker**: https://docker.com

---

**Created by Gabriel Cavalcante for QA Portfolio - International Job Applications** 🚀