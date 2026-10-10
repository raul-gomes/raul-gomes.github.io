import type { Profile } from './types';

export const profile: Profile = {
  name: 'Raul da Silva Gomes',
  handle: 'raul@nostromo',
  role: {
    pt: 'Engenheiro de Software · Backend & Arquitetura',
    en: 'Software Engineer · Backend & Architecture',
  },
  location: {
    pt: 'Taguatinga, Brasília — DF',
    en: 'Taguatinga, Brasília — Brazil',
  },
  email: 'rsgomes86@gmail.com',
  github: 'https://github.com/raul-gomes',
  linkedin: 'https://www.linkedin.com/in/raulsgomes/',
  cvPath: '/cv/Raul_SGomes_CV.pdf',
  bioShort: {
    pt: 'Engenheiro de Software com 3+ anos construindo APIs, arquitetura de sistemas e aplicações full-stack. Python no coração, cloud e DevOps na veia.',
    en: 'Software Engineer with 3+ years building APIs, system architecture and full-stack applications. Python at the core, cloud and DevOps in the veins.',
  },
  bioLong: {
    pt: [
      'Trabalho com backend, arquitetura de sistemas e full-stack. Meu terreno principal é Python — Django, FastAPI e Flask — passando por modelagem de bancos relacionais e não-relacionais, cloud computing e DevOps.',
      'Tenho background sólido em CI/CD, containerização, microserviços e observabilidade, e sou certificado Azure AI Engineer, com formação em Ciência de Dados.',
      'Em 2025 conquistei o 3º lugar no Innovation Challenge da Microsoft com um projeto de cloud computing, inteligência artificial e arquitetura escalável.',
      'Gosto de código com fronteiras claras, testes de verdade e documentação que ajuda quem vem depois. Aprendo continuamente e ajo como dono da qualidade do que entrego.',
    ].join('\n\n'),
    en: [
      'I work with backend, system architecture and full-stack. My main ground is Python — Django, FastAPI and Flask — spanning relational and non-relational data modeling, cloud computing and DevOps.',
      'I have a solid background in CI/CD, containerization, microservices and observability, and I am a certified Azure AI Engineer with a degree in Data Science.',
      'In 2025 I placed 3rd in Microsoft Innovation Challenge with a project on cloud computing, artificial intelligence and scalable architecture.',
      'I like code with clear boundaries, real tests and documentation that helps whoever comes next. I learn continuously and act as an owner of the quality I ship.',
    ].join('\n\n'),
  },
};
