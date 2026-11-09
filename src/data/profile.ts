import type { Profile } from './types';

export const profile: Profile = {
  name: 'Raul da Silva Gomes',
  handle: 'raul@nostromo',
  role: {
    pt: 'Engenheiro de Software Pleno — Backend, Dados e IA aplicada',
    en: 'Mid-level Software Engineer — Backend, Data and Applied AI',
  },
  location: {
    pt: 'Taguatinga, Brasília — DF',
    en: 'Taguatinga, Brasília — Brazil',
  },
  email: 'rsgomes86@gmail.com',
  phone: '(61) 99549-6161',
  website: 'https://raul-gomes.github.io/',
  github: 'https://github.com/raul-gomes',
  linkedin: 'https://www.linkedin.com/in/raulsgomes',
  cvPath: '/cv/Raul_SGomes_CV.pdf',
  bioShort: {
    pt: 'Full stack com base em Python e dados, entregando produto do requisito ao deploy.',
    en: 'Full stack with a Python and data foundation, shipping products from requirements to deployment.',
  },
  bioLong: {
    pt: [
      'Engenheiro de Software pleno full stack, em TI desde 2006 e desenvolvendo software desde 2022. Minha base é Python e banco de dados, mas já entreguei também em TypeScript, Node.js, Angular e .NET.',
      'Levei o Café com BPO do levantamento de requisitos ao deploy, e ele está no ar; agora estou entregando o Placo e o Síndico Indica. Busco vaga remota ou híbrida em Brasília.',
      'Tenho experiência com APIs RESTful, modelagem de dados, pipelines ETL/ELT, Databricks, arquitetura medalhão, cloud (Azure, OCI, AWS), Docker, CI/CD e observabilidade. Também aplico IA e automação com GitHub Copilot, Claude, Whisper, n8n e Make.',
      'Gosto de código com fronteiras claras, testes de verdade e documentação que ajuda quem vem depois. Aprendo continuamente e ajo como dono da qualidade do que entrego.',
    ].join('\n\n'),
    en: [
      'Mid-level full-stack Software Engineer, in IT since 2006 and building software since 2022. My foundation is Python and databases, but I have also delivered in TypeScript, Node.js, Angular and .NET.',
      'I took Café com BPO from requirements gathering to deployment, and it is live; I am now delivering Placo and Síndico Indica. I am looking for a remote or hybrid role in Brasília.',
      'I have experience with RESTful APIs, data modeling, ETL/ELT pipelines, Databricks, medallion architecture, cloud (Azure, OCI, AWS), Docker, CI/CD and observability. I also apply AI and automation with GitHub Copilot, Claude, Whisper, n8n and Make.',
      'I like code with clear boundaries, real tests and documentation that helps whoever comes next. I learn continuously and act as an owner of the quality I ship.',
    ].join('\n\n'),
  },
};
