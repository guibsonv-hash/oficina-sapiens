
import React, { useState, useMemo } from 'react';
import { UserAccount, Olimpiada, Turma, Participante, EscolaInfo } from '../types';

interface LoginScreenProps {
  onLogin: (email: string) => void;
  users: Record<string, UserAccount>;
  olimpiadas: Olimpiada[];
  turmas: Turma[];
  participantes: Participante[];
  school: EscolaInfo;
  onPublicRegister: (data: { olimpiadaId: string; turmaId: string; estudanteId: string; nome: string; email: string }) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, users, olimpiadas, turmas, participantes, school, onPublicRegister }) => {
  // Estados para Login de Funcionário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showStaffLogin, setShowStaffLogin] = useState(false);

  // Estados para Áreas Públicas
  const [activePublicView, setActivePublicView] = useState<'HOME' | 'OLIMPIADAS' | 'CANDIDATOS'>('HOME');

  // Estados para Inscrição de Aluno (Espaço do Aluno)
  const [regOlimpId, setRegOlimpId] = useState('');
  const [regTurmaId, setRegTurmaId] = useState('');
  const [regEstudanteId, setRegEstudanteId] = useState('');
  const [regEmail, setRegEmail] = useState('');

  // Estados para Consulta de Candidato
  const [checkTurmaId, setCheckTurmaId] = useState('');
  const [checkEstudanteId, setCheckEstudanteId] = useState('');
  const [checkEmail, setCheckEmail] = useState('');
  const [foundParticipations, setFoundParticipations] = useState<Participante[] | null>(null);

  // Filtragem
  const openOlympiads = useMemo(() => olimpiadas.filter(o => o.status === 'Aberta'), [olimpiadas]);
  const selectedTurma = useMemo(() => turmas.find(t => t.id === regTurmaId), [turmas, regTurmaId]);
  const selectedCheckTurma = useMemo(() => turmas.find(t => t.id === checkTurmaId), [turmas, checkTurmaId]);

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users[email.toLowerCase().trim()];
    if (user && user.password === password) {
      onLogin(user.email);
    } else {
      setError('E-mail ou senha incorretos.');
    }
  };

  const handleConfirmRegistration = () => {
    // Validação de dados ausentes conforme solicitado
    if (!regOlimpId || !regTurmaId || !regEstudanteId || !regEmail) {
      alert("Atenção: Para realizar sua inscrição, é necessário o preenchimento de todos os dados do formulário.");
      return;
    }

    const estudanteNome = selectedTurma?.estudantes.find(e => e.id === regEstudanteId)?.nome;
    const olimpiadaNome = openOlympiads.find(o => o.id === regOlimpId)?.nome;
    
    if (!estudanteNome) return;

    // Confirmação com janela informativa antes de processar
    if (window.confirm(`Confirmar inscrição do aluno ${estudanteNome} na olimpíada ${olimpiadaNome}?`)) {
      onPublicRegister({
        olimpiadaId: regOlimpId,
        turmaId: regTurmaId,
        estudanteId: regEstudanteId,
        nome: estudanteNome,
        email: regEmail
      });
      // Reset form após sucesso
      setRegOlimpId(''); setRegTurmaId(''); setRegEstudanteId(''); setRegEmail('');
    }
  };

  const handleCheckCandidato = () => {
    if (!checkTurmaId || !checkEstudanteId || !checkEmail) {
      alert("Preencha todos os campos para consultar.");
      return;
    }
    const matches = participantes.filter(p => 
      p.turmaId === checkTurmaId && 
      p.estudanteId === checkEstudanteId && 
      p.email.toLowerCase().trim() === checkEmail.toLowerCase().trim()
    );
    
    if (matches.length > 0) {
      setFoundParticipations(matches);
    } else {
      alert("Nenhum registro encontrado. Verifique se os dados e o e-mail coincidem com a inscrição.");
      setFoundParticipations([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      {/* Top Navbar Pública */}
      <header className="bg-blue-950 text-white shadow-xl z-[100] sticky top-0">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActivePublicView('HOME')}>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-xl border border-white/20 group-hover:scale-110 transition-transform">
              <i className="fas fa-trophy"></i>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase leading-none">Oficina Sapiens</h1>
              <p className="text-[9px] text-blue-300 font-bold uppercase tracking-widest mt-1">GESTÃO DE OLÍMPIADAS ACADÊMICAS</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setActivePublicView('OLIMPIADAS'); setShowStaffLogin(false); }}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activePublicView === 'OLIMPIADAS' ? 'bg-white text-blue-950' : 'hover:bg-white/10'}`}
            >
              <i className="fas fa-list-ul mr-2"></i> Olimpíadas
            </button>
            <button 
              onClick={() => { setActivePublicView('CANDIDATOS'); setShowStaffLogin(false); }}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activePublicView === 'CANDIDATOS' ? 'bg-white text-blue-950' : 'hover:bg-white/10'}`}
            >
              <i className="fas fa-user-check mr-2"></i> Candidatos
            </button>

            <div className="h-6 w-px bg-white/20 mx-2"></div>

            <div className="relative">
              <button 
                onClick={() => setShowStaffLogin(!showStaffLogin)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${showStaffLogin ? 'bg-red-600 border-red-600 text-white' : 'border-white/20 hover:border-white'}`}
              >
                <i className="fas fa-lock mr-2"></i> Login Funcionário
              </button>

              {/* Staff Login Dropdown */}
              {showStaffLogin && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 animate-scaleUp z-[110]">
                  <h4 className="text-blue-950 font-black uppercase text-[10px] tracking-widest mb-6 border-b border-gray-50 pb-4">Acesso Restrito</h4>
                  <form onSubmit={handleStaffSubmit} className="space-y-4">
                    {error && <div className="text-red-600 text-[9px] font-black uppercase bg-red-50 p-3 rounded-xl border border-red-100">{error}</div>}
                    <input 
                      type="email" 
                      placeholder="E-mail Corporativo" 
                      className="w-full bg-slate-50 border border-gray-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-900 text-blue-950"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                    <input 
                      type="password" 
                      placeholder="Senha" 
                      className="w-full bg-slate-50 border border-gray-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-900 text-blue-950"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button type="submit" className="w-full bg-blue-900 text-white font-black py-4 rounded-xl uppercase text-[10px] tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all">Entrar</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        
        {/* VIEW: HOME / INSCRIÇÃO (Espaço do Aluno) */}
        {activePublicView === 'HOME' && (
          <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row items-center gap-16 animate-fadeIn">
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Inscrições 2026 Abertas</span>
                <h2 className="text-5xl lg:text-7xl font-black text-blue-950 tracking-tighter leading-none">Espaço do <br/><span className="text-red-600">Candidato.</span></h2>
                <p className="text-lg text-gray-500 font-medium max-w-lg">Garanta sua participação nas maiores olimpíadas acadêmicas do país através do portal Oficina Sapiens</p>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-blue-950">{openOlympiads.length}</span>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Eventos Abertos</span>
                </div>
                <div className="h-10 w-px bg-gray-200"></div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-blue-950">{participantes.length}+</span>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Alunos Inscritos</span>
                </div>
              </div>
            </div>

            {/* Formulário de Inscrição */}
            <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 p-10 border border-gray-100">
              <div className="flex items-center gap-3 mb-10 border-b border-gray-50 pb-6">
                <i className="fas fa-id-card text-3xl text-blue-900"></i>
                <div>
                  <h3 className="text-xl font-black text-blue-950 uppercase tracking-tighter">Formulário de Inscrição</h3>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Preencha os dados corretamente</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">Colégio de Origem</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={school.nome || "Aguardando configuração..."} 
                    className="w-full bg-slate-50 border-2 border-gray-50 rounded-2xl p-4 font-black text-blue-900 outline-none cursor-default"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">Escolha a Olimpíada</label>
                  <select 
                    value={regOlimpId}
                    onChange={e => setRegOlimpId(e.target.value)}
                    className="w-full border-2 border-gray-100 rounded-2xl p-4 font-black text-gray-700 outline-none focus:border-blue-900 transition-all bg-white"
                  >
                    <option value="">Selecione um desafio acadêmico...</option>
                    {openOlympiads.map(o => <option key={o.id} value={o.id}>{o.nome}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">Sua Turma</label>
                    <select 
                      value={regTurmaId}
                      onChange={e => { setRegTurmaId(e.target.value); setRegEstudanteId(''); }}
                      className="w-full border-2 border-gray-100 rounded-2xl p-4 font-black text-gray-700 outline-none focus:border-blue-900 transition-all bg-white"
                    >
                      <option value="">Turma...</option>
                      {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">Seu Nome Completo</label>
                    <select 
                      disabled={!regTurmaId}
                      value={regEstudanteId}
                      onChange={e => setRegEstudanteId(e.target.value)}
                      className="w-full border-2 border-gray-100 rounded-2xl p-4 font-black text-gray-700 outline-none focus:border-blue-900 transition-all bg-white disabled:bg-slate-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Nome...</option>
                      {selectedTurma?.estudantes.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">E-mail de Contato (Obrigatório)</label>
                  <input 
                    type="email" 
                    placeholder="exemplo@email.com" 
                    className="w-full border-2 border-gray-100 rounded-2xl p-4 font-black text-blue-900 outline-none focus:border-blue-900"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                  />
                  <p className="text-[9px] text-gray-400 mt-2 font-bold uppercase tracking-tight">* Este e-mail será necessário para consultar seu status e notas futuramente.</p>
                </div>

                <button 
                  onClick={handleConfirmRegistration}
                  className="w-full bg-red-600 hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl shadow-red-600/20 uppercase tracking-widest transition-all transform active:scale-95 mt-6 text-xs"
                >
                  Confirmar Inscrição <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: LISTA DE OLIMPÍADAS (Pública) */}
        {activePublicView === 'OLIMPIADAS' && (
          <div className="container mx-auto px-6 py-12 animate-fadeIn">
            <div className="mb-12 flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black text-blue-950 uppercase tracking-tighter">Olimpíadas Disponíveis</h2>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2">Catálogo oficial de desafios para 2026</p>
              </div>
              <button onClick={() => setActivePublicView('HOME')} className="text-blue-900 font-black text-[10px] uppercase hover:underline">Voltar ao Início</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {olimpiadas.map(o => (
                <div key={o.id} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${o.status === 'Aberta' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {o.status === 'Aberta' ? 'Inscrições Abertas' : 'Inscrições Encerradas'}
                    </span>
                    <a href={o.site} target="_blank" rel="noreferrer" className="text-blue-900 hover:text-red-600"><i className="fas fa-external-link-alt"></i></a>
                  </div>
                  <h3 className="text-2xl font-black text-blue-950 uppercase tracking-tighter mb-4 group-hover:text-red-600 transition-colors">{o.nome}</h3>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                      <i className="fas fa-calendar-day w-5 text-blue-900"></i>
                      <span>Início: {new Date(o.inicioInscricao).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                      <i className="fas fa-calendar-times w-5 text-red-600"></i>
                      <span>Fim: {new Date(o.fimInscricao).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                      <i className="fas fa-users w-5 text-blue-900"></i>
                      <div className="flex gap-1">
                        {o.segmentos.map(s => (
                          <span key={s} className="bg-blue-50 text-blue-900 px-2 py-0.5 rounded text-[8px] font-black uppercase">{s === 'Fundamental Anos Iniciais' ? 'FAI' : s === 'Fundamental Anos Finais' ? 'FAF' : 'EM'}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-50 pt-6">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Fases Previstas</h4>
                    <div className="space-y-3">
                      {o.fases.map(f => (
                        <div key={f.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-gray-100">
                          <span className="text-[10px] font-black text-blue-900 uppercase">{f.nome}</span>
                          <span className="text-[9px] font-bold text-gray-400">{new Date(f.data).toLocaleDateString('pt-BR')}</span>
                        </div>
                      ))}
                      {o.fases.length === 0 && <p className="text-[10px] text-gray-400 italic">Cronograma em definição...</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: CONSULTA DE CANDIDATOS (Pública) */}
        {activePublicView === 'CANDIDATOS' && (
          <div className="container mx-auto px-6 py-12 animate-fadeIn flex flex-col items-center">
            <div className="w-full max-w-4xl text-center mb-12">
              <h2 className="text-4xl font-black text-blue-950 uppercase tracking-tighter">Espaço do Candidato</h2>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2">Consulte suas inscrições e resultados</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full">
              {/* Form de Consulta */}
              <div className="lg:col-span-1 bg-white rounded-3xl p-8 border border-gray-100 shadow-xl h-fit">
                <h3 className="text-sm font-black text-blue-950 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Autenticação Aluno</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Sua Turma</label>
                    <select 
                      value={checkTurmaId}
                      onChange={e => { setCheckTurmaId(e.target.value); setCheckEstudanteId(''); }}
                      className="w-full border-2 border-gray-100 rounded-xl p-3 font-bold text-xs outline-none focus:border-blue-900"
                    >
                      <option value="">Selecione...</option>
                      {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Seu Nome</label>
                    <select 
                      disabled={!checkTurmaId}
                      value={checkEstudanteId}
                      onChange={e => setCheckEstudanteId(e.target.value)}
                      className="w-full border-2 border-gray-100 rounded-xl p-3 font-bold text-xs outline-none focus:border-blue-900 disabled:bg-gray-50"
                    >
                      <option value="">Escolha...</option>
                      {selectedCheckTurma?.estudantes.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">E-mail Cadastrado</label>
                    <input 
                      type="email" 
                      placeholder="E-mail da inscrição"
                      className="w-full border-2 border-gray-100 rounded-xl p-3 font-bold text-xs outline-none focus:border-blue-900"
                      value={checkEmail}
                      onChange={e => setCheckEmail(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={handleCheckCandidato}
                    className="w-full bg-blue-900 text-white font-black py-4 rounded-xl uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all mt-4"
                  >
                    Consultar Histórico
                  </button>
                </div>
              </div>

              {/* Resultados da Consulta */}
              <div className="lg:col-span-2 space-y-6">
                {!foundParticipations ? (
                  <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-100 p-20 text-center opacity-40">
                    <i className="fas fa-search text-6xl text-gray-200 mb-6"></i>
                    <p className="font-black text-xs text-gray-400 uppercase tracking-widest">Preencha os dados ao lado para visualizar seu histórico.</p>
                  </div>
                ) : foundParticipations.length === 0 ? (
                  <div className="bg-red-50 rounded-[2rem] border border-red-100 p-12 text-center">
                    <i className="fas fa-exclamation-triangle text-4xl text-red-600 mb-4"></i>
                    <p className="font-black text-red-800 uppercase text-xs tracking-widest">Nenhum registro encontrado.</p>
                    <p className="text-[10px] text-red-400 font-bold uppercase mt-2">Verifique se o e-mail digitado é o mesmo usado no momento da inscrição.</p>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fadeIn">
                    <h3 className="text-xl font-black text-blue-950 uppercase tracking-tight">Suas Inscrições</h3>
                    {foundParticipations.map(p => {
                      const o = olimpiadas.find(ol => ol.id === p.olimpiadaId);
                      return (
                        <div key={p.id} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-blue-900 transition-all">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="bg-blue-900 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase">{o?.nome}</span>
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{new Date(p.dataInclusao).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              {o?.fases.map(f => (
                                <div key={f.id} className="text-center bg-slate-50 p-2 rounded-xl border border-gray-100">
                                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter mb-1">{f.nome}</p>
                                  <p className="text-sm font-black text-blue-900">{p.notas[f.id] ?? '--'}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="text-right border-t md:border-t-0 md:border-l border-gray-50 pt-4 md:pt-0 md:pl-8">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Média Atual</p>
                            <p className="text-3xl font-black text-red-600">
                              {Object.values(p.notas).filter(v => typeof v === 'number').length > 0
                                ? (Object.values(p.notas).filter(v => typeof v === 'number').reduce((a, b) => (a as number) + (b as number), 0) as number / Object.values(p.notas).filter(v => typeof v === 'number').length).toFixed(1)
                                : '--'
                              }
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Estreito Fixo */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-100 py-3 text-center z-[150] shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">
          ©2026 Oficina Sapiens - Plataforma desenvolvida para Colégios Univap por Guibson Valerio
        </p>
      </footer>
    </div>
  );
};

export default LoginScreen;
