import { chromium } from 'playwright-core';
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = resolve('.');
const out = resolve(root, 'public/cv/Raul_SGomes_CV.pdf');
const docsOut = resolve(root, 'docs/CV_Raul_SGomes.pdf');
mkdirSync(dirname(out), { recursive: true });

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Raul da Silva Gomes — CV</title>
<style>
  @page { size: A4; margin: 12mm 13mm; }
  * { box-sizing: border-box; }
  body { font-family: "Segoe UI", Arial, sans-serif; font-size: 9.4pt; line-height: 1.34; color: #1b1b1b; margin: 0; }
  h1 { font-size: 20pt; margin: 0 0 1.5mm; letter-spacing: .4px; }
  .role { font-size: 10.8pt; font-weight: 600; color: #0b5c6b; margin-bottom: 2mm; }
  .contact { font-size: 8.7pt; color: #333; margin-bottom: 4mm; }
  .contact span { margin-right: 4mm; white-space: nowrap; }
  h2 { font-size: 10.8pt; text-transform: uppercase; letter-spacing: .8px; color: #0b5c6b; border-bottom: 1.1px solid #0b5c6b; padding-bottom: 1mm; margin: 4.5mm 0 2.2mm; }
  h3 { font-size: 9.8pt; margin: 0 0 .6mm; }
  p { margin: 0 0 1.8mm; }
  ul { margin: 0 0 2mm 4mm; padding: 0; }
  li { margin-bottom: .7mm; }
  .item { margin-bottom: 2.8mm; break-inside: avoid; }
  .item-head { display: flex; justify-content: space-between; gap: 4mm; align-items: baseline; }
  .period { white-space: nowrap; color: #555; font-size: 8.7pt; }
  .company { color: #555; font-size: 8.9pt; margin-bottom: .9mm; }
  .skills { display: grid; grid-template-columns: 1fr 1fr; gap: 1.4mm 7mm; }
  .skills p { margin: 0; break-inside: avoid; }
  .skills strong { color: #0b5c6b; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm 8mm; }
  .muted { color: #555; }
  .compact { margin-bottom: 1.2mm; }
  h2, h3 { break-after: avoid; }
  .page-break { break-before: page; }
</style>
</head>
<body>
  <h1>Raul da Silva Gomes</h1>
  <div class="role">Engenheiro de Software Pleno — Backend, Dados e IA aplicada</div>
  <div class="contact">
    <span>Taguatinga, Brasília - DF</span>
    <span>(61) 99549-6161</span>
    <span>rsgomes86@gmail.com</span>
    <span>raul-gomes.github.io</span>
    <span>linkedin.com/in/raulsgomes</span>
  </div>

  <h2>Resumo</h2>
  <p>Engenheiro de Software pleno full stack, em TI desde 2006 e desenvolvendo software desde 2022. Minha base é Python e banco de dados, mas já entreguei também em TypeScript, Node.js, Angular e .NET. Levei o Café com BPO do levantamento de requisitos ao deploy, e ele está no ar; agora estou entregando o Placo e o Síndico Indica. Busco vaga remota ou híbrida em Brasília.</p>

  <h2>Habilidades</h2>
  <div class="skills">
    <p><strong>Linguagens:</strong> Python, TypeScript, JavaScript, SQL, R</p>
    <p><strong>Backend e APIs:</strong> FastAPI, Django, Flask, Node.js (Express), APIs RESTful, Pydantic, SQLAlchemy, Alembic, OAuth, JWT</p>
    <p><strong>Frontend:</strong> React, Angular, Vite, TanStack Query, React Hook Form, Zod</p>
    <p><strong>Bancos de dados:</strong> PostgreSQL, MongoDB, Oracle DB, modelagem relacional e não relacional, stored procedures, otimização de queries</p>
    <p><strong>Dados:</strong> pipelines ETL/ELT, Databricks, arquitetura medalhão (bronze/silver/gold), Data Lakes</p>
    <p><strong>Cloud e DevOps:</strong> Azure, OCI, AWS, Docker, Nginx, CI/CD, Git</p>
    <p><strong>Qualidade e observabilidade:</strong> pytest, Vitest, React Testing Library, Grafana, OpenTelemetry, API Gateway</p>
    <p><strong>IA e automação:</strong> GitHub Copilot, Claude, OpenAI Whisper, n8n, Make</p>
    <p><strong>Metodologias:</strong> Agile/Scrum, levantamento de requisitos, documentação de arquitetura</p>
  </div>

  <h2>Projetos</h2>
  <div class="item">
    <h3>Café com BPO</h3>
    <p class="company">Cofundador e desenvolvedor da plataforma SaaS para profissionais de BPO financeiro.</p>
    <ul>
      <li>APIs em FastAPI com Pydantic, SQLAlchemy e Alembic sobre PostgreSQL 16, com autenticação JWT e OAuth.</li>
      <li>Frontend em React 18 e TypeScript (Vite, TanStack Query, React Hook Form + Zod).</li>
      <li>Testes automatizados com pytest, Vitest e React Testing Library.</li>
      <li>Docker Compose, Nginx, CI/CD com GitHub Actions e deploy em VPS.</li>
    </ul>
  </div>
  <div class="item">
    <h3>Placo</h3>
    <p class="company">Cofundador e desenvolvedor de plataforma de gestão financeira para profissionais que têm CPF e CNPJ.</p>
    <ul>
      <li>Visualização de orçamentos pessoais (PF) e empresariais (PJ), separados por categorias e subcategorias.</li>
      <li>Metas de curto e médio prazo e limites de gasto por categoria.</li>
      <li>APIs RESTful em FastAPI e modelagem em PostgreSQL otimizada para consultas por categoria e período (diário, mensal, anual).</li>
      <li>Dashboard em React com gráficos de fontes de renda e gastos versus limites.</li>
      <li>Containerização com Docker Compose e CI/CD; definição de produto e posicionamento de marca.</li>
    </ul>
  </div>
  <div class="item">
    <h3>Nação Patina <span class="muted">(em desenvolvimento)</span></h3>
    <p class="company">Rede social para equipe de patinação, com perfis de atletas, feed de saídas em grupo, encontros e mídia.</p>
    <ul>
      <li>Backend em Node.js com API REST e MongoDB.</li>
      <li>Frontend em Next.js e backend Supabase.</li>
    </ul>
  </div>
  <div class="item">
    <h3>Síndico Indica</h3>
    <p class="company">Aplicativo que conecta síndicos com prestadores de serviços; em fase final de desenvolvimento, com lançamento previsto.</p>
  </div>
  <div class="item">
    <h3>Pipeline de dados com Databricks <span class="muted">(arquitetura medalhão)</span></h3>
    <p class="company">Pipeline end-to-end com camadas bronze, silver e gold.</p>
    <ul>
      <li>Coleta via HTTP, validação e consultas SQL para dashboards e KPIs.</li>
    </ul>
  </div>
  <div class="item">
    <h3>Transcrição de áudio com Whisper e mensageria</h3>
    <p class="company">Processamento assíncrono com fila de mensagens (producer-consumer).</p>
    <ul>
      <li>Múltiplos arquivos simultâneos, Docker e transcrições indexadas para busca.</li>
    </ul>
  </div>

  <h2>Experiência Profissional</h2>
  <div class="item">
    <div class="item-head"><h3>Desenvolvedor Full Stack Freelancer</h3><span class="period">Mar/2024 – Presente</span></div>
    <p class="company">Projetos diversos</p>
    <ul>
      <li>APIs REST com Python (Django, FastAPI, Flask) e frontends em Angular e React.</li>
      <li>Automação de workflows e pipelines de dados com Make e n8n.</li>
      <li>Integração de APIs para coleta, transformação e ingestão de dados.</li>
      <li>Docker e CI/CD em múltiplos projetos.</li>
      <li>Levantamento de requisitos diretamente com clientes.</li>
    </ul>
  </div>
  <div class="item">
    <div class="item-head"><h3>Analista de Desenvolvimento de Sistemas</h3><span class="period">Mai/2025 – Set/2025</span></div>
    <p class="company">Record Brasília</p>
    <ul>
      <li>APIs RESTful para processamento e integração de dados com Python (Django, FastAPI) e Node.js (Express).</li>
      <li>Modelagem de dados em MongoDB e PostgreSQL, com dados estruturados e não estruturados.</li>
      <li>Pipelines de dados com CI/CD e Docker.</li>
      <li>Frontend em React com foco em visualização de dados.</li>
      <li>Levantamento de requisitos, documentação de arquitetura e rituais Agile/Scrum.</li>
    </ul>
  </div>
  <div class="item">
    <div class="item-head"><h3>Analista de Software Pleno</h3><span class="period">Mai/2022 – Mar/2024</span></div>
    <p class="company">Instituto de Pesquisa Eldorado</p>
    <ul>
      <li>Soluções em Python (Flask) para modelagem, integração e validação de dados; Oracle DB com stored procedures e otimização de queries.</li>
      <li>PoCs de observabilidade com API Gateway, OpenTelemetry e Grafana, incluindo monitoramento de dados em tempo real.</li>
      <li>Soluções analíticas e algoritmos de machine learning com R.</li>
      <li>Bibliotecas JavaScript reutilizáveis para integração com sistemas e dashboards analíticos em Angular.</li>
      <li>CI/CD com Docker e GitLab para pipelines e microsserviços.</li>
    </ul>
  </div>
  <div class="item">
    <div class="item-head"><h3>Programador de Software Júnior</h3><span class="period">Fev/2022 – Mai/2022</span></div>
    <p class="company">G&amp;P Projetos e Sistemas S.A.</p>
    <ul>
      <li>Criação e integração de APIs com .NET e desenvolvimento low-code com Bizagi Studio (C#).</li>
      <li>CI/CD, containerização, testes e validação de funcionalidades em equipe Agile.</li>
    </ul>
  </div>
  <div class="item">
    <div class="item-head"><h3>Técnico de Suporte N2</h3><span class="period">Abr/2019 – Ago/2020</span></div>
    <p class="company">Vért Soluções em Informática / Hospital Santa Lúcia</p>
    <ul>
      <li>Controle de incidentes e requisições em Service Desk e resolução de chamados N2.</li>
      <li>Treinamento e mentoria de técnicos N1; suporte remoto à rede corporativa.</li>
    </ul>
  </div>
  <div class="item">
    <div class="item-head"><h3>Técnico de Laboratório de Física</h3><span class="period">Set/2010 – Jan/2019</span></div>
    <p class="company">Universidade Católica de Brasília</p>
    <ul>
      <li>Planejamento e execução de experimentos, manutenção e calibração de equipamentos científicos.</li>
      <li>Documentação de procedimentos e treinamento de estagiários.</li>
    </ul>
  </div>
  <div class="item">
    <div class="item-head"><h3>Técnico de Informática</h3><span class="period">Mai/2006 – Set/2010</span></div>
    <p class="company">Universidade Católica de Brasília</p>
    <ul>
      <li>Manutenção de sistemas operacionais, redes e hardware.</li>
      <li>Administração de usuários via Active Directory.</li>
    </ul>
  </div>

  <h2>Formação</h2>
  <div class="item compact">
    <div class="item-head"><h3>Especialização em Ciência de Dados e Machine Learning</h3><span class="period">2023</span></div>
    <p class="company">Pontifícia Universidade Católica de Campinas</p>
  </div>
  <div class="item compact">
    <div class="item-head"><h3>Análise e Desenvolvimento de Sistemas</h3><span class="period">2017 – 2019</span></div>
    <p class="company">Universidade Católica de Brasília</p>
  </div>
  <div class="item compact">
    <div class="item-head"><h3>Inglês Avançado</h3><span class="period">2015 – 2016</span></div>
    <p class="company">Erin School (Irlanda)</p>
  </div>
  <div class="item compact">
    <div class="item-head"><h3>Técnico em Informática</h3><span class="period">2002 – 2003</span></div>
    <p class="company">Escola Técnica de Brasília</p>
  </div>

  <h2>Certificações e Prêmios</h2>
  <div class="two-col">
    <div>
      <p class="compact"><strong>Databricks Foundations</strong> — Databricks | 2026</p>
      <p class="compact"><strong>Azure AI Engineer Associate</strong> — Microsoft | 2024</p>
      <p class="compact"><strong>Azure Fundamentals</strong> — Microsoft | 2024</p>
      <p class="compact"><strong>Scrum Foundation</strong> — Scrum.org | 2023</p>
      <p class="compact"><strong>ITIL Foundation Certificate in IT Service Management</strong> — AXELOS | 2022</p>
    </div>
    <div>
      <p class="compact"><strong>3º lugar no Innovation Challenge Microsoft</strong> — projeto de cloud computing e IA | 2025</p>
    </div>
  </div>

  <h2>Idiomas</h2>
  <p>Português (nativo) · Inglês (fluente) · Espanhol (básico) · Francês (básico)</p>
</body>
</html>`;

const executablePath =
  process.env.PW_EXECUTABLE ||
  (process.platform === 'win32'
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : '/usr/bin/google-chrome');

const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'load' });
await page.pdf({
  path: out,
  format: 'A4',
  printBackground: true,
  displayHeaderFooter: false,
});
await browser.close();

copyFileSync(out, docsOut);

console.log(`CV written to ${out}`);
