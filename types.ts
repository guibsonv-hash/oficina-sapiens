
export enum Segmento {
  INICIAIS = 'Fundamental Anos Iniciais',
  FINAIS = 'Fundamental Anos Finais',
  MEDIO = 'Ensino Médio'
}

export interface Fase {
  id: string;
  nome: string;
  data: string;
}

export interface Observacao {
  id: string;
  texto: string;
  data: string;
}

export interface Olimpiada {
  id: string;
  nome: string;
  site: string;
  telefone?: string;
  email?: string;
  login?: string;
  senha?: string;
  inicioInscricao: string;
  fimInscricao: string;
  status: 'Aberta' | 'Fechada';
  custoEscola: number;
  custoAluno: number;
  segmentos: Segmento[];
  fases: Fase[];
  observacoes: Observacao[];
}

export interface Lembrete {
  id: string;
  titulo: string;
  descricao: string;
  importancia: 'Baixa' | 'Media' | 'Alta';
  dataHora: string;
  visualizado: boolean;
  notificado: boolean;
}

export interface Estudante {
  id: string;
  nome: string;
}

export interface Turma {
  id: string;
  nome: string;
  segmento: Segmento;
  estudantes: Estudante[];
}

export interface Participante {
  id: string;
  olimpiadaId: string;
  estudanteId: string;
  turmaId: string;
  nome: string;
  segmento: Segmento;
  email: string;
  dataInclusao: string;
  notas: Record<string, number | "">;
}

export interface EscolaInfo {
  nome: string;
  cnpj: string;
  inep: string;
  segmentosAtivos: Segmento[];
}

export interface SystemConfig {
  pin: string | null;
}

export interface UserAuth {
  isAuthenticated: boolean;
  email: string | null;
}

export interface UserAccount {
  email: string;
  password: string;
  pin: string | null;
  nome?: string;
  cargo?: string;
  profileCompleted: boolean;
}
