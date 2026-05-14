# 📋 Próximos Passos - Projeto K6

## ✅ O que foi implementado

- ✅ Backend CRUD API (Node.js + Express + PostgreSQL)
- ✅ Frontend Vanilla JS (HTML + CSS)
- ✅ Docker Compose (5 serviços: API, Frontend, Postgres, InfluxDB, Grafana)
- ✅ Testes k6 (Smoke, Load, Stress, Spike, Browser)
- ✅ Swagger/OpenAPI documentation
- ✅ GitHub Actions CI/CD pipelines
- ✅ Logging estruturado com Pino

---

## 🎯 Próximos Passos (Em Ordem de Prioridade)

### 1. **Monitorar com Grafana** (PRIORITÁRIO)

O Grafana já está pré-configurado com datasource InfluxDB. Para usar:

#### Passo 1: Subir Docker com InfluxDB
```bash
docker compose up -d
```

#### Passo 2: Rodar k6 enviando métricas para InfluxDB
```bash
k6 run --out influxdb=http://localhost:8086/k6 k6/scenarios/load.js
```

#### Passo 3: Acessar o Grafana
- URL: http://localhost:3001
- Login: `admin` / `admin`
- Navegar para: **Dashboards** → **K6 Load Test**

#### Métricas visíveis no dashboard:
- 📊 HTTP Request Duration (p50, p95, p99)
- 📈 Request Rate (req/s)
- ❌ Error Rate (%)
- 👥 Virtual Users ativos
- ✅ Checks passando/falhando

---

### 2. **Configurar Credentials do GitHub (Opcional)**

Se quiser usar os workflows do GitHub Actions:

1. No repositório, ir em **Settings** → **Secrets and Variables** → **Actions**
2. Adicionar uma secret `GHCR_TOKEN` com seu token do GitHub Container Registry (se for publicar imagens Docker)
3. Push para `release` branch vai disparar o CI automaticamente

---

### 3. **Expandir Cenários de Teste (Roadmap)**

Após validar o setup atual, considerar:

- **Soak Testing**: Rodar por 24-48h com carga constante (80 VUs)
- **Threshold Customization**: Ajustar limites de p95/p99 baseado em SLA
- **Custom Metrics**: Adicionar métricas de negócio (ex: checkout flow time)
- **Performance Baseline**: Documentar números de referência para comparações futuras

---

### 4. **Aprimoramentos no Backend**

- [ ] Adicionar cache (Redis) para endpoint de listagem
- [ ] Implementar rate limiting para evitar abuso
- [ ] Adicionar autenticação JWT (se necessário)
- [ ] Melhorar tratamento de erros com códigos HTTP mais específicos
- [ ] Adicionar migrations automáticas no startup

---

### 5. **Frontend Enhancements**

- [ ] Adicionar paginação visual
- [ ] Toast notifications para operações bem-sucedidas
- [ ] Validação do lado do cliente mais robusta
- [ ] Busca/filtro de livros
- [ ] Exportar dados em CSV

---

### 6. **Documentação e Portfolio**

- [ ] Criar exemplos de como rodar cada cenário k6
- [ ] Documentar resultados dos testes (screenshots do Grafana)
- [ ] Atualizar README com instruções de Grafana
- [ ] Adicionar seção "Learnings" explicando decisões arquiteturais

---

## 🚀 Como Usar em Desenvolvimento

### Setup Local (Primeira Vez)
```bash
# 1. Clonar repo
git clone https://github.com/Gabriel-Cavalcantte/K6.git
cd K6

# 2. Subir infra
docker compose up -d

# 3. Validar saúde
curl http://localhost:3000/health

# 4. Acessar aplicação
# API docs: http://localhost:3000/api-docs
# Frontend: http://localhost:8080
# Grafana: http://localhost:3001
```

### Rodar Testes
```bash
# Smoke test (rápido, ~2 min)
k6 run k6/scenarios/smoke.js

# Load test com métricas no Grafana (recomendado, ~5 min)
k6 run --out influxdb=http://localhost:8086/k6 k6/scenarios/load.js

# Stress test (encontra o breaking point)
k6 run --out influxdb=http://localhost:8086/k6 k6/scenarios/stress.js

# Spike test (pico repentino)
k6 run --out influxdb=http://localhost:8086/k6 k6/scenarios/spike.js

# Browser test (UI automation)
K6_BROWSER_ENABLED=true k6 run k6/scenarios/browser.js
```

### Ver Logs
```bash
# Logs da API em tempo real
docker compose logs -f api

# Logs de todos os serviços
docker compose logs -f

# Logs do container específico
docker compose logs -f postgres
```

---

## 📊 Interpretar Resultados no Grafana

### O que observar:
1. **Response Time**: Mantém abaixo do threshold (p95 < 500ms)?
2. **Error Rate**: Deve estar perto de 0% durante load normal
3. **Request Rate**: Quantas requisições/segundo a API consegue processar?
4. **VUs**: Observar comportamento quando aumenta de 1 → 30 VUs

### Red Flags:
- 🔴 Error Rate aumentando (conexão DB pode estar saturada)
- 🔴 Response Time subindo linearmente (sem cache, sem otimização DB)
- 🔴 VUs travados (pool de conexão do banco cheio)

---

## 🔧 Troubleshooting

### Erro: "connection refused" no k6
```bash
# Verificar se API está rodando
curl http://localhost:3000/health

# Reiniciar Docker
docker compose restart api
```

### Erro: "no such bucket" no InfluxDB
```bash
# Verificar se InfluxDB está pronto
docker compose logs influxdb | tail -20

# Aguardar ~30s para inicializar completamente
```

### Grafana sem dados
1. Certificar que k6 foi rodado com `--out influxdb=...`
2. Ir em Grafana → Data Sources → InfluxDB → Test Connection
3. Confirmar que a query está procurando pela organização correta

---

## 📈 Métricas Importantes para Portfolio

Quando apresentar este projeto:
- ✅ 906 iterações completadas (load test de 5 min com 30 VUs)
- ✅ 0% taxa de erro
- ✅ Response time médio: ~5-10ms
- ✅ Throughput: 180-190 requests/segundo
- ✅ 100% de checks passando (validações OK)

---

## 🎓 Conceitos Demonstrados

Este projeto mostra:
- **Load Testing**: Comparar comportamento em carga diferente
- **Monitoring**: Integração com Grafana + InfluxDB
- **Infrastructure as Code**: Docker Compose para reproducibilidade
- **CI/CD**: GitHub Actions para automação
- **API Design**: RESTful com OpenAPI/Swagger
- **Database**: Migrations automáticas, pool de conexões
- **Logging**: Estruturado em JSON para observabilidade
- **Frontend**: Integração com backend via Fetch API

---

## ❓ Dúvidas Frequentes

**P: Por que usar k6 e não JMeter/Gatling?**
R: k6 é moderno, baseado em JavaScript, tem sintaxe limpa e integração nativa com InfluxDB.

**P: Docker Compose é suficiente para produção?**
R: Não. Use Kubernetes/ECS. Docker Compose é para dev/teste local.

**P: Como adicionar autenticação na API?**
R: Adicionar middleware JWT antes das rotas. Ver [JWT Guide](https://nodejs.org/en/docs/).

**P: Os testes k6 validam segurança?**
R: Não. Use ferramentas como OWASP ZAP ou Burp Suite para isso.

---

## 📞 Contato & Portfolio

Este projeto é parte do portfólio QA/Performance Testing de **Gabriel Cavalcante**.
- GitHub: https://github.com/Gabriel-Cavalcantte/K6
- Email: almeida.cavalcante09@gmail.com

---

**Última atualização**: 2026-05-13
