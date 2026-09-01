import type { Level, Activity, Flashcard, Mission, Badge, RankingEntry, ContentCategory, User } from '@/types';

export const LEVELS: Level[] = [
  { id: 1, title: 'Primeiros Registros', subtitle: 'O que é anotação de enfermagem', objective: 'Aprender o conceito de anotação de enfermagem e sua importância.', content: 'A anotação de enfermagem é o registro oficial e legal das informações sobre o paciente. Deve ser clara, objetiva, factual e cronológica.', rewardXp: 250, unlockXp: 0, icon: 'BookOpen', accent: 'primary' },
  { id: 2, title: 'Olhar de Enfermagem', subtitle: 'Identificar informações relevantes', objective: 'Identificar quais informações são relevantes em um cenário clínico.', content: 'O olhar de enfermagem seleciona dados que mudam a assistência: sinais vitais, queixas, comportamento, mudanças clínicas.', rewardXp: 300, unlockXp: 250, icon: 'Eye', accent: 'accent' },
  { id: 3, title: 'Terminologia na Prática', subtitle: 'Linguagem técnica correta', objective: 'Aprender e utilizar terminologias técnicas de enfermagem.', content: 'Termos como eupneico, normotenso, anúria, normocorado descrevem estados clínicos de forma objetiva e universal.', rewardXp: 350, unlockXp: 550, icon: 'Languages', accent: 'ocean' },
  { id: 4, title: 'Caçador de Erros', subtitle: 'Identificar erros em registros', objective: 'Identificar problemas em registros de enfermagem.', content: 'Erros comuns: informações vagas, abreviações não padronizadas, subjetividade, falta de horário e identificação.', rewardXp: 400, unlockXp: 900, icon: 'Bug', accent: 'warning' },
  { id: 5, title: 'Monte o Registro', subtitle: 'Organizar informações corretamente', objective: 'Organizar informações em uma sequência lógica de registro.', content: 'Um bom registro segue ordem: identificação, sinais vitais, queixa, intervenções e resposta do paciente.', rewardXp: 450, unlockXp: 1300, icon: 'Layers', accent: 'success' },
  { id: 6, title: 'Desafio Clínico', subtitle: 'Interpretar situações clínicas', objective: 'Interpretar situações clínicas e priorizar informações.', content: 'A interpretação clínica conecta sinais e sintomas às ações de enfermagem adequadas.', rewardXp: 500, unlockXp: 1750, icon: 'Activity', accent: 'error' },
  { id: 7, title: 'Escreva o Registro', subtitle: 'Produzir anotações de enfermagem', objective: 'Produzir anotações de enfermagem completas e corretas.', content: 'A produção do registro integra coleta, terminologia e sequência lógica em um texto profissional.', rewardXp: 600, unlockXp: 2250, icon: 'PenLine', accent: 'primary' },
  { id: 8, title: 'Comunicação Profissional', subtitle: 'Clareza, objetividade e precisão', objective: 'Trabalhar clareza, objetividade e precisão na comunicação.', content: 'Comunicação profissional evita juízos de valor e transfere informações com segurança entre a equipe.', rewardXp: 650, unlockXp: 2850, icon: 'MessageSquare', accent: 'accent' },
  { id: 9, title: 'Missão Clínica', subtitle: 'Resolver situações complexas', objective: 'Resolver situações clínicas mais complexas com decisões fundamentadas.', content: 'Missões clínicas simulam a prática real e exigem tomada de decisão fundamentada.', rewardXp: 800, unlockXp: 3500, icon: 'Target', accent: 'ocean' },
  { id: 10, title: 'Mestre do Registro', subtitle: 'Desafio final integrador', objective: 'Integrar todos os conhecimentos em um desafio final.', content: 'O desafio final avalia domínio completo: coleta, terminologia, registro, comunicação e tomada de decisão.', rewardXp: 1000, unlockXp: 4300, icon: 'Crown', accent: 'warning' },
];

export const BADGES: Badge[] = [
  { id: 'first-record', name: 'Primeiro Registro', description: 'Realizou sua primeira anotação.', icon: 'FileText', color: 'primary' },
  { id: 'error-hunter', name: 'Caçador de Erros', description: 'Identificou 20 erros em registros.', icon: 'Bug', color: 'warning' },
  { id: 'term-ninja', name: 'Terminologia Ninja', description: 'Acertou 30 questões de terminologia.', icon: 'Languages', color: 'ocean' },
  { id: 'perfect-note', name: 'Registro Perfeito', description: 'Concluiu um desafio sem erros.', icon: 'Sparkles', color: 'accent' },
  { id: 'comm-master', name: 'Mestre da Comunicação', description: 'Demonstrou domínio da comunicação clara e objetiva.', icon: 'MessageSquare', color: 'success' },
  { id: 'streak-7', name: 'Sequência de Estudos', description: 'Estudou durante 7 dias consecutivos.', icon: 'Flame', color: 'error' },
  { id: 'clinical-mission', name: 'Desafio Clínico', description: 'Concluiu sua primeira missão clínica.', icon: 'Target', color: 'accent' },
  { id: 'level-5', name: 'Montador de Registros', description: 'Alcançou o Nível 5.', icon: 'Layers', color: 'primary' },
];

export const FLASHCARDS: Flashcard[] = [
  { id: 'fc1', category: 'Terminologias', front: 'O que significa "eupneico"?', back: 'Respiração dentro do padrão esperado, sem esforço respiratório.' },
  { id: 'fc2', category: 'Terminologias', front: 'O que significa "normotenso"?', back: 'Pressão arterial dentro dos valores de referência.' },
  { id: 'fc3', category: 'Terminologias', front: 'O que significa "anúria"?', back: 'Ausência de diurese (eliminação urinária inferior a 100 mL em 24h).' },
  { id: 'fc4', category: 'Terminologias', front: 'O que significa "normocorado"?', back: 'Coloração da pele e mucosas dentro do padrão esperado.' },
  { id: 'fc5', category: 'Terminologias', front: 'O que significa "acetônico"?', back: 'Que apresenta acetona (corpos cetônicos), geralmente no hálito.' },
  { id: 'fc6', category: 'Sinais vitais', front: 'Qual a frequência respiratória normal de um adulto?', back: '12 a 20 irpm (incursões respiratórias por minuto).' },
  { id: 'fc7', category: 'Sinais vitais', front: 'Qual a frequência cardíaca normal de um adulto?', back: '60 a 100 bpm (batimentos por minuto).' },
  { id: 'fc8', category: 'Sinais vitais', front: 'Qual a saturação de oxigênio considerada normal?', back: 'SpO₂ acima de 95%.' },
  { id: 'fc9', category: 'Sinais vitais', front: 'Qual a temperatura corporal axilar considerada normal?', back: '36,0°C a 36,8°C.' },
  { id: 'fc10', category: 'Sinais e sintomas', front: 'O que é "síncope"?', back: 'Perda súbita e temporária da consciência, de curta duração.' },
  { id: 'fc11', category: 'Sinais e sintomas', front: 'O que é "dispneia"?', back: 'Sensação subjetiva de dificuldade respiratória ou falta de ar.' },
  { id: 'fc12', category: 'Sinais e sintomas', front: 'O que é "edema"?', back: 'Acúmulo de líquido nos tecidos, causando aumento de volume.' },
  { id: 'fc13', category: 'Procedimentos', front: 'O que é "asepsia"?', back: 'Conjunto de medidas que impedem a entrada de microrganismos em local estéril.' },
  { id: 'fc14', category: 'Procedimentos', front: 'O que é "antissepsia"?', back: 'Remoção de microrganismos da pele mediante aplicação de agentes químicos.' },
  { id: 'fc15', category: 'Comunicação', front: 'O que é uma comunicação "subjetativa"?', back: 'Registro que expressa opinião pessoal em vez de fato observável. Deve ser evitada.' },
  { id: 'fc16', category: 'Comunicação', front: 'O que significa registrar "paciente colaborador"?', back: 'Paciente que participa ativamente dos cuidados e segue orientações.' },
  { id: 'fc17', category: 'Registros de enfermagem', front: 'Um registro deve conter identificação de quem?', back: 'Nome legível do profissional, categoria (COREN) e horário da anotação.' },
  { id: 'fc18', category: 'Registros de enfermagem', front: 'É permitido usar abreviações não padronizadas?', back: 'Não. Abreviações não padronizadas geram ambiguidade e risco ao paciente.' },
  { id: 'fc19', category: 'Registros de enfermagem', front: 'O que significa "anotação de ocorrência"?', back: 'Registro de fatos relevantes fora da rotina, como quedas, recusa de medicação ou intercorrências.' },
  { id: 'fc20', category: 'Registros de enfermagem', front: 'Por que o registro deve ser cronológico?', back: 'Para permitir a evolução do quadro e a continuidade da assistência entre turnos.' },
];

export const ACTIVITIES: Activity[] = [
  // Nível 1
  {
    id: 'a1', levelId: 1, type: 'multiple-choice', xp: 50,
    title: 'Para que serve a anotação?',
    prompt: 'Qual é a principal finalidade da anotação de enfermagem?',
    options: [
      { id: 'o1', text: 'Embelezar o prontuário do paciente', correct: false },
      { id: 'o2', text: 'Registrar oficialmente as informações do paciente e a assistência prestada', correct: true },
      { id: 'o3', text: 'Comunicar-se com a família', correct: false },
      { id: 'o4', text: 'Substituir a prescrição médica', correct: false },
    ],
    explanation: 'A anotação é o registro oficial e legal das informações do paciente e da assistência de enfermagem.',
    teacherTip: 'Lembre-se: a anotação é um documento jurídico. Tudo o que não foi registrado é considerado como não feito.',
  },
  {
    id: 'a2', levelId: 1, type: 'true-false', xp: 50,
    title: 'Características do bom registro',
    prompt: 'A anotação de enfermagem deve conter opiniões pessoais do profissional sobre o paciente.',
    options: [
      { id: 't', text: 'Verdadeiro', correct: false },
      { id: 'f', text: 'Falso', correct: true },
    ],
    explanation: 'A anotação deve ser objetiva e factual. Opiniões pessoais (juízos de valor) não devem constar no registro.',
    teacherTip: 'Registre o que você observou, não o que você achou. Use dados mensuráveis sempre que possível.',
  },
  // Nível 2
  {
    id: 'a3', levelId: 2, type: 'multiple-choice', xp: 60,
    title: 'Informação relevante',
    prompt: 'Em uma admissão, qual informação é mais relevante para o registro de enfermagem?',
    options: [
      { id: 'o1', text: 'O paciente parece simpático', correct: false },
      { id: 'o2', text: 'PA 142x90, FC 110, refere dor torácica', correct: true },
      { id: 'o3', text: 'O paciente vestia camiseta azul', correct: false },
      { id: 'o4', text: 'O paciente veio acompanhado por um familiar alto', correct: false },
    ],
    explanation: 'Dados objetivos e mensuráveis (sinais vitais e queixa) são relevantes. Aparência e impressões subjetivas não.',
    teacherTip: 'Pergunte a si mesmo: essa informação muda a assistência? Se não, provavelmente não pertence ao registro.',
  },
  // Nível 3
  {
    id: 'a4', levelId: 3, type: 'association', xp: 70,
    title: 'Relacione termo e significado',
    prompt: 'Associe cada terminologia ao seu significado correto.',
    pairs: [
      { left: 'Eupneico', right: 'Respiração dentro do padrão' },
      { left: 'Normocorado', right: 'Coloração normal de pele/mucosas' },
      { left: 'Anúria', right: 'Ausência de diurese' },
      { left: 'Normotenso', right: 'Pressão arterial normal' },
    ],
    explanation: 'As terminologias descrevem estados clínicos de forma universal e objetiva, facilitando a comunicação entre a equipe.',
    teacherTip: 'Use terminologia padronizada. Evite criar suas próprias abreviações.',
  },
  {
    id: 'a5', levelId: 3, type: 'fill-blank', xp: 70,
    title: 'Complete a frase',
    prompt: 'Um paciente com respiração dentro do padrão esperado é chamado de ______.',
    sentenceParts: ['Um paciente com respiração dentro do padrão esperado é chamado de ', '.'],
    blankOptions: ['eupneico', 'dispneico', 'bradipneico', 'taquipneico'],
    blankAnswer: 'eupneico',
    explanation: 'Eupneico = respiração normal. Dispneico = com dificuldade respiratória. Bradipneico = respiração lenta. Taquipneico = respiração acelerada.',
    teacherTip: 'O prefixo "eu-" indica "bom" ou "normal", como em eupneico e eufórico.',
  },
  // Nível 4
  {
    id: 'a6', levelId: 4, type: 'find-error', xp: 80,
    title: 'Caçador de erros',
    prompt: 'Leia a anotação abaixo e toque nos trechos que contêm erros.',
    errorSegments: [
      { id: 'e1', text: 'Paciente está bem', isError: true, feedback: '"Paciente está bem" é vago e subjetivo. Especifique: sinais vitais, queixas, comportamento.' },
      { id: 'e2', text: 'tomou remédio', isError: true, feedback: '"Remédio" é termo leigo. Use o nome do medicamento, dose, via e horário.' },
      { id: 'e3', text: 'e foi embora', isError: true, feedback: 'Falta horário, destino (alta? transferência?) e identificação do profissional.' },
      { id: 'e4', text: 'às 09h00', isError: false, feedback: 'O horário está correto e é essencial no registro.' },
    ],
    explanation: 'Um registro vago, sem terminologia, sem identificação e sem horário compromete a assistência e o aspecto legal.',
    teacherTip: 'Antes de finalizar, confira: tem horário? Tem terminologia? Tem identificação? É objetivo?',
  },
  // Nível 5
  {
    id: 'a7', levelId: 5, type: 'order-info', xp: 90,
    title: 'Organize o registro',
    prompt: 'Coloque as informações na ordem correta de um registro de enfermagem.',
    fragments: [
      'Intervenção realizada e resposta do paciente',
      'Identificação do paciente e horário',
      'Queixa referida e comportamento',
      'Sinais vitais aferidos',
    ],
    correctOrder: [1, 3, 2, 0],
    explanation: 'A sequência lógica é: identificação → sinais vitais → queixa/comportamento → intervenção e resposta.',
    teacherTip: 'Uma sequência consistente facilita a leitura rápida pela equipe do próximo turno.',
  },
  // Nível 7
  {
    id: 'a8', levelId: 7, type: 'best-note', xp: 120,
    title: 'Escolha a melhor anotação',
    prompt: 'Qual das anotações abaixo é a mais adequada?',
    noteOptions: [
      { id: 'n1', text: 'Paciente passou bem, sem queixas. Continua em observação.', isBest: false, feedback: 'Vago e subjetivo. Não traz dados objetivos.' },
      { id: 'n2', text: 'Piente parece estar melhorando. Sem dor aparente.', isBest: false, feedback: 'Contém erro de digitação e impressão subjetiva ("parece").' },
      { id: 'n3', text: '14h00 — Paciente lúcido, oriented, eupneico. PA 120x80, FC 76, FR 16, SpO₂ 98%, T 36,5°C. Refere dor 0/10. Aceu dieta. Diurese presente. — Tec. Enf. Ana Lima, COREN-SP 123456', isBest: true, feedback: 'Objetiva, cronológica, com terminologia, sinais vitais, identificação e horário.' },
      { id: 'n4', text: 'Tudo ok com o paciente. Nada a relatar no momento.', isBest: false, feedback: 'Vago. "Nada a relatar" não é uma anotação adequada.' },
    ],
    explanation: 'A melhor anotação é objetiva, cronológica, usa terminologia, traz dados mensuráveis e identifica o profissional.',
    teacherTip: 'Compare as opções: qual delas outra enfermeira conseguiria entender e dar continuidade?',
  },
];

export const MISSIONS: Mission[] = [
  {
    id: 'm1', title: 'Dor abdominal na unidade de internação', levelId: 9, rewardXp: 200,
    scenario: 'Você está atuando em uma unidade de internação. São 08h00. Você realiza visita ao paciente João, 67 anos.',
    patient: { name: 'João', age: 67, info: 'Consciente e orientado. Refere dor abdominal 6/10 e náusea.' },
    vitals: [
      { label: 'PA', value: '138x82 mmHg' },
      { label: 'FC', value: '92 bpm' },
      { label: 'FR', value: '20 irpm' },
      { label: 'SpO₂', value: '96%' },
      { label: 'T', value: '37,4°C' },
    ],
    questions: [
      { id: 'q1', text: 'Quais informações são importantes neste caso?', placeholder: 'Liste os dados relevantes que devem constar no registro...' },
      { id: 'q2', text: 'Quais terminologias podem ser utilizadas?', placeholder: 'Ex.: lúcido, orientado, normotenso...' },
      { id: 'q3', text: 'Quais informações devem constar no registro?', placeholder: 'Descreva os elementos do registro...' },
      { id: 'q4', text: 'Produza uma anotação de enfermagem', placeholder: 'Escreva a anotação completa...' },
    ],
    rubric: [
      { criterion: 'Clareza', description: 'Texto compreensível e organizado.' },
      { criterion: 'Objetividade', description: 'Informações diretas, sem redundâncias.' },
      { criterion: 'Informações relevantes', description: 'Inclui sinais vitais, queixa e comportamento.' },
      { criterion: 'Terminologia', description: 'Uso correto de termos técnicos.' },
      { criterion: 'Sequência lógica', description: 'Ordem coerente dos eventos.' },
      { criterion: 'Identificação', description: 'Contém horário e identificação profissional.' },
    ],
    modelAnswer: '08h00 — Paciente João, 67 anos, lúcido e orientado. Refere dor abdominal 6/10 e náusea. PA 138x82 mmHg, FC 92 bpm, FR 20 irpm, SpO₂ 96%, T 37,4°C. Em decúrito dorsal, queixoso. Comunicado enfermeiro. Aguardando avaliação médica. — Tec. Enf. [Nome], COREN-SP.',
  },
];

export const RANKING: RankingEntry[] = [
  { id: 'r1', name: 'Ana Souza', username: '@anasou', turma: 'Técnico em Enfermagem A', xp: 4200, level: 9, avatarColor: 'from-primary-400 to-primary-600' },
  { id: 'r2', name: 'Lucas Lima', username: '@lucaslim', turma: 'Técnico em Enfermagem A', xp: 3850, level: 8, avatarColor: 'from-accent-400 to-accent-600' },
  { id: 'r3', name: 'Beatriz Rocha', username: '@biarocha', turma: 'Técnico em Enfermagem B', xp: 3400, level: 7, avatarColor: 'from-ocean-400 to-ocean-600' },
  { id: 'r4', name: 'Carlos Mendes', username: '@carlinhos', turma: 'Técnico em Enfermagem A', xp: 2900, level: 6, avatarColor: 'from-warning-400 to-warning-600' },
  { id: 'r5', name: 'Maria Alves', username: '@mariaalv', turma: 'Técnico em Enfermagem B', xp: 2100, level: 5, avatarColor: 'from-error-400 to-error-600' },
  { id: 'r6', name: 'Você', username: '@voce', turma: 'Técnico em Enfermagem A', xp: 250, level: 1, avatarColor: 'from-primary-400 to-accent-500', isMe: true },
  { id: 'r7', name: 'Pedro Nunes', username: '@pedro', turma: 'Técnico em Enfermagem B', xp: 180, level: 1, avatarColor: 'from-success-400 to-success-600' },
];

export const CONTENT_CATEGORIES: ContentCategory[] = [
  {
    id: 'c1', title: 'Anotação de Enfermagem', icon: 'FileText', color: 'primary',
    topics: [
      { title: 'O que é anotação', summary: 'Registro oficial e legal das informações do paciente.' },
      { title: 'Princípios do registro', summary: 'Clareza, objetividade, concisão e cronologia.' },
      { title: 'Aspectos legais', summary: 'O registro é um documento jurídico com valor probatório.' },
    ],
  },
  {
    id: 'c2', title: 'Terminologias', icon: 'Languages', color: 'ocean',
    topics: [
      { title: 'Termos de estado clínico', summary: 'Eupneico, normotenso, normocorado, anúria.' },
      { title: 'Termos de procedimento', summary: 'Asepsia, antissepsia, cateterismo.' },
      { title: 'Abreviações padronizadas', summary: 'PA, FC, FR, SpO₂, irpm, bpm.' },
    ],
  },
  {
    id: 'c3', title: 'Comunicação Profissional', icon: 'MessageSquare', color: 'accent',
    topics: [
      { title: 'Comunicação verbal e escrita', summary: 'Clareza e precisão na transmissão de informações.' },
      { title: 'Passagem de plantão', summary: 'Estrutura para transferência segura de cuidado.' },
      { title: 'Linguagem técnica vs leiga', summary: 'Quando usar cada uma no registro.' },
    ],
  },
  {
    id: 'c4', title: 'Segurança do Paciente', icon: 'Shield', color: 'success',
    topics: [
      { title: 'Identificação do paciente', summary: 'Protocolos para evitar erros.' },
      { title: 'Comunicação de eventos', summary: 'Notificação de incidentes e falhas.' },
      { title: 'Higiene e precauções', summary: 'Prevenção de infecções relacionadas à assistência.' },
    ],
  },
  {
    id: 'c5', title: 'Raciocínio Clínico', icon: 'Brain', color: 'warning',
    topics: [
      { title: 'Coleta de dados', summary: 'Histórico, exame físico e sinais vitais.' },
      { title: 'Priorização', summary: 'Identificar o que exige ação imediata.' },
      { title: 'Evolução do quadro', summary: 'Comparar dados ao longo do tempo.' },
    ],
  },
  {
    id: 'c6', title: 'Sinais e Sintomas', icon: 'Activity', color: 'error',
    topics: [
      { title: 'Sinais vitais', summary: 'PA, FC, FR, SpO₂ e temperatura.' },
      { title: 'Sintomas comuns', summary: 'Dor, dispneia, náusea, síncope.' },
      { title: 'Escalas', summary: 'Escala de dor 0-10, Glasgow, Braden.' },
    ],
  },
];

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Você',
  username: '@voce',
  email: 'voce@exemplo.com',
  role: 'student',
  turma: 'Técnico em Enfermagem A',
  avatarColor: 'from-primary-400 to-accent-500',
  xp: 250,
  level: 1,
  streak: 4,
  activitiesCompleted: 5,
  badgeIds: ['first-record', 'streak-7'],
  joinedAt: '2026-08-10',
};

export const DEMO_TEACHER: User = {
  id: 't1',
  name: 'Prof. Dra. Helena Castro',
  username: '@profhelena',
  email: 'helena@exemplo.com',
  role: 'teacher',
  turma: 'Técnico em Enfermagem A',
  avatarColor: 'from-accent-400 to-accent-600',
  xp: 0,
  level: 0,
  streak: 0,
  activitiesCompleted: 0,
  badgeIds: [],
  joinedAt: '2026-07-01',
};

export const TEACHER_STUDENTS: { name: string; turma: string; xp: number; level: number; errors: number; lastActive: string }[] = [
  { name: 'Ana Souza', turma: 'T-A', xp: 4200, level: 9, errors: 12, lastActive: 'há 2h' },
  { name: 'Lucas Lima', turma: 'T-A', xp: 3850, level: 8, errors: 18, lastActive: 'há 1h' },
  { name: 'Beatriz Rocha', turma: 'T-B', xp: 3400, level: 7, errors: 9, lastActive: 'hoje' },
  { name: 'Carlos Mendes', turma: 'T-A', xp: 2900, level: 6, errors: 22, lastActive: 'há 3h' },
  { name: 'Maria Alves', turma: 'T-B', xp: 2100, level: 5, errors: 15, lastActive: 'ontem' },
];
