
import React, { useState, useEffect, useMemo } from 'react';
import { Olimpiada, Segmento, EscolaInfo, Participante, Turma, UserAuth, Lembrete, UserAccount } from './types';
import Header from './components/Header';
import OlympiadTable from './components/OlympiadTable';
import OlympiadModal from './components/OlympiadModal';
import SetupScreen from './components/SetupScreen';
import LoginScreen from './components/LoginScreen';
import SchoolConfigModal from './components/SchoolConfigModal';
import ParticipantesTab from './components/ParticipantesTab';
import TurmasTab from './components/TurmasTab';
import MetricasTab from './components/MetricasTab';
import AdminTab from './components/AdminTab';
import ConfigModal from './components/ConfigModal';
import PinVerifyModal from './components/PinVerifyModal';
import RemindersModal from './components/RemindersModal';
import SearchModal from './components/SearchModal';

const INITIAL_USERS: Record<string, UserAccount> = {
  'guibson@univap.br': { email: 'guibson@univap.br', password: '123456', pin: null, profileCompleted: false },
  'amanda.cavalca@univap.br': { email: 'amanda.cavalca@univap.br', password: '123456', pin: null, profileCompleted: false },
  'vcarneiro@univap.br': { email: 'vcarneiro@univap.br', password: '123456', pin: null, profileCompleted: false },
  'rogusmao@univap.br': { email: 'rogusmao@univap.br', password: '123456', pin: null, profileCompleted: false },
  'rrocha@univap.br': { email: 'rrocha@univap.br', password: '123456', pin: null, profileCompleted: false },
  'rodrigo.moura@univap.br': { email: 'rodrigo.moura@univap.br', password: '123456', pin: null, profileCompleted: false },
  'aquarius@univap.br': { email: 'aquarius@univap.br', password: '123456', pin: null, profileCompleted: false },
};

const App: React.FC = () => {
  const [auth, setAuth] = useState<UserAuth>(() => {
    const saved = sessionStorage.getItem('sapiens_auth');
    return saved ? JSON.parse(saved) : { isAuthenticated: false, email: null };
  });

  const [school, setSchool] = useState<EscolaInfo>(() => {
    const saved = localStorage.getItem('sapiens_school_info');
    return saved ? JSON.parse(saved) : { nome: "", cnpj: "", inep: "", segmentosAtivos: [] };
  });

  const [olimpiadas, setOlimpiadas] = useState<Olimpiada[]>(() => {
    const saved = localStorage.getItem('sapiens_olimpiadas');
    return saved ? JSON.parse(saved) : [];
  });

  const [participantes, setParticipantes] = useState<Participante[]>(() => {
    const saved = localStorage.getItem('sapiens_participantes');
    return saved ? JSON.parse(saved) : [];
  });

  const [turmas, setTurmas] = useState<Turma[]>(() => {
    const saved = localStorage.getItem('sapiens_turmas');
    return saved ? JSON.parse(saved) : [];
  });

  const [lembretes, setLembretes] = useState<Lembrete[]>(() => {
    const saved = localStorage.getItem('sapiens_lembretes');
    return saved ? JSON.parse(saved) : [];
  });

  const [users, setUsers] = useState<Record<string, UserAccount>>(() => {
    const saved = localStorage.getItem('sapiens_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [activeTab, setActiveTab] = useState<'OLIMPÍADAS' | 'PARTICIPANTES' | 'TURMAS' | 'MÉTRICAS' | 'ADMINISTRADORES'>('OLIMPÍADAS');
  const [olimpSegmentFilter, setOlimpSegmentFilter] = useState<string>('todos');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [editingOlimpiada, setEditingOlimpiada] = useState<Olimpiada | null>(null);
  const [pinRequest, setPinRequest] = useState<{ isOpen: boolean; onVerify: () => void; isDouble?: boolean; step?: number } | null>(null);
  const [activeReminder, setActiveReminder] = useState<Lembrete | null>(null);

  useEffect(() => {
    localStorage.setItem('sapiens_school_info', JSON.stringify(school));
    localStorage.setItem('sapiens_olimpiadas', JSON.stringify(olimpiadas));
    localStorage.setItem('sapiens_participantes', JSON.stringify(participantes));
    localStorage.setItem('sapiens_turmas', JSON.stringify(turmas));
    localStorage.setItem('sapiens_lembretes', JSON.stringify(lembretes));
    localStorage.setItem('sapiens_users', JSON.stringify(users));
    sessionStorage.setItem('sapiens_auth', JSON.stringify(auth));
  }, [school, olimpiadas, participantes, turmas, lembretes, users, auth]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!auth.isAuthenticated) return;
      const now = new Date();
      const nextReminder = lembretes.find(l => !l.notificado && new Date(l.dataHora) <= now);
      if (nextReminder) {
        setLembretes(prev => prev.map(l => l.id === nextReminder.id ? { ...l, notificado: true } : l));
        setActiveReminder(nextReminder);
      }
    }, 5000); 
    return () => clearInterval(interval);
  }, [lembretes, auth.isAuthenticated]);

  const currentUser = auth.email ? users[auth.email] : null;

  const filteredOlimpiadas = useMemo(() => {
    if (olimpSegmentFilter === 'todos') return olimpiadas;
    return olimpiadas.filter(o => o.segmentos.includes(olimpSegmentFilter as Segmento));
  }, [olimpiadas, olimpSegmentFilter]);

  const requestPinAction = (action: () => void, isDouble = false) => {
    const userPin = currentUser?.pin;
    if (!userPin) {
      action();
      return;
    }

    if (isDouble) {
      setPinRequest({ 
        isOpen: true, 
        isDouble: true, 
        step: 1, 
        onVerify: () => {
          setPinRequest({
            isOpen: true,
            isDouble: true,
            step: 2,
            onVerify: action
          });
        } 
      });
    } else {
      setPinRequest({ isOpen: true, onVerify: action });
    }
  };

  const handleSavePin = (newPin: string | null) => {
    if (!auth.email) return;
    setUsers(prev => ({ ...prev, [auth.email!]: { ...prev[auth.email!], pin: newPin } }));
  };

  const handleChangePassword = (newPass: string) => {
    if (!auth.email) return;
    setUsers(prev => ({ ...prev, [auth.email!]: { ...prev[auth.email!], password: newPass } }));
  };

  const handleFinishSetup = (userData: Partial<UserAccount>, schoolData?: EscolaInfo) => {
    if (!auth.email) return;
    setUsers(prev => ({ ...prev, [auth.email!]: { ...prev[auth.email!], ...userData, profileCompleted: true } }));
    if (schoolData) setSchool(schoolData);
  };

  const handleSaveOlimpiada = (data: Olimpiada) => {
    if (editingOlimpiada) setOlimpiadas(prev => prev.map(o => o.id === data.id ? data : o));
    else setOlimpiadas(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9), observacoes: [] }]);
    setIsModalOpen(false);
    setEditingOlimpiada(null);
  };

  const handleDeleteOlimpiada = (id: string) => {
    requestPinAction(() => {
      if (window.confirm('Excluir olimpiada?')) {
        setOlimpiadas(prev => prev.filter(o => o.id !== id));
        setParticipantes(prev => prev.filter(p => p.olimpiadaId !== id));
      }
    });
  };

  const handleSaveUser = (u: UserAccount) => {
    setUsers(prev => ({ ...prev, [u.email]: u }));
  };

  const handleDeleteUser = (email: string) => {
    if (email === auth.email) {
      alert("Não é possível excluir o próprio usuário logado.");
      return;
    }
    requestPinAction(() => {
      setUsers(prev => {
        const next = { ...prev };
        delete next[email];
        return next;
      });
    }, true);
  };

  const handleClearSystem = () => {
    requestPinAction(() => {
      if (window.confirm('ATENÇÃO: Limpar TODO o sistema?')) {
        localStorage.clear();
        window.location.reload();
      }
    }, true);
  };

  // Lógica para inscrição pública (aluno se inscrevendo na home)
  const handlePublicRegister = (data: { olimpiadaId: string; turmaId: string; estudanteId: string; nome: string; email: string }) => {
    const turma = turmas.find(t => t.id === data.turmaId);
    if (!turma) return;

    const alreadyRegistered = participantes.some(p => p.olimpiadaId === data.olimpiadaId && p.estudanteId === data.estudanteId);
    if (alreadyRegistered) {
      alert("Atenção: Você já possui uma inscrição ativa nesta olimpíada.");
      return;
    }

    const newParticipant: Participante = {
      id: Math.random().toString(36).substr(2, 9),
      olimpiadaId: data.olimpiadaId,
      turmaId: data.turmaId,
      estudanteId: data.estudanteId,
      nome: data.nome,
      segmento: turma.segmento,
      email: data.email,
      dataInclusao: new Date().toISOString(),
      notas: {}
    };

    setParticipantes(prev => [...prev, newParticipant]);
    
    // Janela informativa de sucesso conforme solicitado
    alert(`Inscrição confirmada com sucesso!\n\nParabéns, ${data.nome}! Sua participação está garantida. Prepare-se para o desafio e acompanhe os resultados no Espaço do Candidato.`);
  };

  if (!auth.isAuthenticated) {
    return (
      <LoginScreen 
        onLogin={(e) => setAuth({ isAuthenticated: true, email: e })} 
        users={users} 
        olimpiadas={olimpiadas}
        turmas={turmas}
        participantes={participantes}
        school={school}
        onPublicRegister={handlePublicRegister}
      />
    );
  }

  if (currentUser && !currentUser.profileCompleted) return <SetupScreen onFinish={handleFinishSetup} initialSchoolData={school} isSchoolConfigured={!!school.nome} />;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 pb-20">
      <Header school={school} user={currentUser!} onEditSchool={() => setIsSchoolModalOpen(true)} onOpenConfig={() => setIsConfigModalOpen(true)} onOpenReminders={() => setIsRemindersOpen(true)} onOpenSearch={() => setIsSearchOpen(true)} onLogout={() => setAuth({ isAuthenticated: false, email: null })} unreadReminders={lembretes.filter(l => !l.visualizado && new Date(l.dataHora) <= new Date()).length} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex border-b border-gray-300 mb-6 overflow-x-auto bg-white rounded-t-2xl px-2">
          {(['OLIMPÍADAS', 'PARTICIPANTES', 'TURMAS', 'MÉTRICAS', 'ADMINISTRADORES'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-4 font-black text-[10px] tracking-widest transition-all whitespace-nowrap uppercase ${activeTab === tab ? 'border-b-4 border-blue-900 text-blue-900' : 'text-gray-400 hover:text-blue-900'}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'OLIMPÍADAS' && (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6 gap-4">
              <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">Olimpíadas Acadêmicas</h2>
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <select 
                    value={olimpSegmentFilter}
                    onChange={(e) => setOlimpSegmentFilter(e.target.value)}
                    className="bg-white border-2 border-gray-100 rounded-xl px-4 font-black uppercase text-[10px] tracking-widest h-[52px] outline-none focus:border-blue-900 transition-all text-blue-900 shadow-sm"
                  >
                    <option value="todos">Todos os Segmentos</option>
                    {Object.values(Segmento).map(seg => (
                      <option key={seg} value={seg}>{seg}</option>
                    ))}
                  </select>
                </div>
                <button onClick={() => { setEditingOlimpiada(null); setIsModalOpen(true); }} className="bg-blue-900 hover:bg-black text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 font-black transition-all transform hover:scale-105 uppercase text-[10px] tracking-widest h-[52px]"><i className="fas fa-plus"></i> Incluir Olimpíada</button>
              </div>
            </div>
            <OlympiadTable data={filteredOlimpiadas} onEdit={(o) => { setEditingOlimpiada(o); setIsModalOpen(true); }} onDelete={handleDeleteOlimpiada} />
          </div>
        )}

        {activeTab === 'PARTICIPANTES' && <ParticipantesTab olimpiadas={olimpiadas} participantes={participantes} turmas={turmas} onSave={(p) => setParticipantes(prev => prev.find(x => x.id === p.id) ? prev.map(x => x.id === p.id ? p : x) : [...prev, p])} onDelete={(id) => requestPinAction(() => setParticipantes(prev => prev.filter(p => p.id !== id)))} onBulkAdd={(oid, tid) => {
          const turma = turmas.find(t => t.id === tid);
          if (turma) {
            setParticipantes(prev => {
              const news = [...prev];
              turma.estudantes.forEach(est => {
                if (!prev.some(p => p.olimpiadaId === oid && p.estudanteId === est.id)) {
                  news.push({ id: Math.random().toString(36).substr(2, 9), olimpiadaId: oid, turmaId: tid, estudanteId: est.id, nome: est.nome, segmento: turma.segmento, email: '', dataInclusao: new Date().toISOString(), notas: {} });
                }
              });
              return news;
            });
          }
        }} />}

        {activeTab === 'TURMAS' && <TurmasTab turmas={turmas} schoolSegments={school.segmentosAtivos} onSaveTurma={(t) => setTurmas(prev => prev.find(x => x.id === t.id) ? prev.map(x => x.id === t.id ? t : x) : [...prev, t])} onDeleteTurma={(id) => requestPinAction(() => setTurmas(prev => prev.filter(t => t.id !== id)))} onDeleteStudent={(tid, eid) => requestPinAction(() => { setTurmas(prev => prev.map(t => t.id === tid ? { ...t, estudantes: t.estudantes.filter(e => e.id !== eid) } : t)); setParticipantes(prev => prev.filter(p => p.turmaId !== tid || p.estudanteId !== eid)); })} />}

        {activeTab === 'MÉTRICAS' && <MetricasTab olimpiadas={olimpiadas} participantes={participantes} turmas={turmas} />}
        
        {activeTab === 'ADMINISTRADORES' && <AdminTab users={users} onSave={handleSaveUser} onDelete={handleDeleteUser} onVerifyPin={(cb) => requestPinAction(cb, true)} />}
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-sm border-t border-gray-100 py-2.5 text-center z-[100] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.15em]">
          ©2026 Oficina Sapiens - Plataforma desenvolvida para Colégios Univap por Guibson Valerio
        </p>
      </footer>

      {isModalOpen && <OlympiadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveOlimpiada} initialData={editingOlimpiada || undefined} activeSegments={school.segmentosAtivos} systemPin={currentUser?.pin || null} onVerifyPin={(cb) => requestPinAction(cb)} />}
      {isSchoolModalOpen && <SchoolConfigModal isOpen={isSchoolModalOpen} onClose={() => setIsSchoolModalOpen(false)} onSave={(d) => setSchool(d)} initialData={school} needsPin={!!school.nome} systemPin={currentUser?.pin || null} onVerifyPin={(cb) => requestPinAction(cb)} />}
      {isConfigModalOpen && <ConfigModal isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)} config={{ pin: currentUser?.pin || null }} currentUser={currentUser!} onSavePin={handleSavePin} onChangePassword={handleChangePassword} onClearSystem={handleClearSystem} onExportData={() => {}} onLogout={() => setAuth({ isAuthenticated: false, email: null })} />}
      {isRemindersOpen && <RemindersModal isOpen={isRemindersOpen} onClose={() => setIsRemindersOpen(false)} reminders={lembretes} onSave={(l) => setLembretes(p => [l, ...p])} onDelete={(id) => setLembretes(p => p.filter(x => x.id !== id))} onMarkAsRead={(id) => setLembretes(prev => prev.map(l => l.id === id ? { ...l, visualizado: true } : l))} />}
      {isSearchOpen && <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} participantes={participantes} olimpiadas={olimpiadas} turmas={turmas} onEditParticipante={(p) => setParticipantes(prev => prev.map(x => x.id === p.id ? p : x))} />}
      {pinRequest?.isOpen && <PinVerifyModal isOpen={pinRequest.isOpen} correctPin={currentUser?.pin || ''} onSuccess={() => { pinRequest.onVerify(); setPinRequest(null); }} onClose={() => setPinRequest(null)} />}
      {activeReminder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-blue-950/90 backdrop-blur-xl p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-10 text-center animate-scaleUp">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-xl ${activeReminder.importancia === 'Alta' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              <i className="fas fa-bell"></i>
            </div>
            <h3 className="text-2xl font-black text-blue-950 uppercase mb-2">{activeReminder.titulo}</h3>
            <p className="text-gray-500 font-medium mb-8">{activeReminder.descricao}</p>
            <button onClick={() => setActiveReminder(null)} className="w-full bg-blue-900 text-white font-black py-4 rounded-xl uppercase tracking-widest shadow-xl">Entendido</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
