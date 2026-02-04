
import React, { useState, useMemo } from 'react';
import { Participante, Olimpiada, Turma } from '../types';
import ParticipanteModal from './ParticipanteModal';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  participantes: Participante[];
  olimpiadas: Olimpiada[];
  turmas: Turma[];
  onEditParticipante: (p: Participante) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, participantes, olimpiadas, turmas, onEditParticipante }) => {
  const [query, setQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingP, setEditingP] = useState<{ p: Participante; o: Olimpiada } | null>(null);

  const searchResults = useMemo(() => {
    if (query.length < 2) return [];
    const normalized = query.toLowerCase();
    
    // Group all participations by student name (or ID if we had it, using name+turmaId as proxy for uniqueness here)
    const grouped: Record<string, { nome: string; participacoes: Participante[] }> = {};
    
    participantes.forEach(p => {
      if (p.nome.toLowerCase().includes(normalized)) {
        if (!grouped[p.nome]) grouped[p.nome] = { nome: p.nome, participacoes: [] };
        grouped[p.nome].participacoes.push(p);
      }
    });

    return Object.values(grouped);
  }, [participantes, query]);

  const studentDetails = useMemo(() => {
    if (!selectedStudent) return null;
    return searchResults.find(s => s.nome === selectedStudent);
  }, [searchResults, selectedStudent]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-blue-950/80 backdrop-blur-xl p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scaleUp flex flex-col h-[85vh]">
        <div className="bg-blue-900 p-8 text-white flex justify-between items-center shrink-0">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-blue-300"></i>
              <input 
                autoFocus
                type="text" 
                placeholder="Pesquisar nome do aluno..." 
                className="w-full bg-white/10 border-2 border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-blue-300 outline-none focus:border-white transition-all font-bold"
                value={query}
                onChange={e => { setQuery(e.target.value); setSelectedStudent(null); }}
              />
            </div>
          </div>
          <button onClick={onClose} className="ml-6 hover:rotate-90 transition-transform"><i className="fas fa-times text-2xl"></i></button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Results Sidebar */}
          <div className="w-80 border-r border-gray-100 overflow-y-auto p-6 bg-slate-50">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Resultados Encontrados</h4>
            <div className="space-y-2">
              {searchResults.map(s => (
                <button 
                  key={s.nome}
                  onClick={() => setSelectedStudent(s.nome)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border-2 ${selectedStudent === s.nome ? 'bg-white border-blue-900 shadow-lg' : 'bg-white border-transparent hover:border-gray-200'}`}
                >
                  <p className="font-black text-blue-950 uppercase text-xs truncate">{s.nome}</p>
                  <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{s.participacoes.length} Participações</p>
                </button>
              ))}
              {query.length >= 2 && searchResults.length === 0 && (
                <p className="text-center py-10 text-gray-400 text-xs font-bold uppercase">Nenhum aluno encontrado.</p>
              )}
            </div>
          </div>

          {/* Details Main Area */}
          <div className="flex-1 overflow-y-auto p-10 bg-white">
            {!selectedStudent ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                <i className="fas fa-address-card text-9xl mb-6"></i>
                <p className="font-black text-2xl uppercase">Ficha Acadêmica Sapiens</p>
              </div>
            ) : (
              <div className="animate-fadeIn space-y-8">
                <div>
                  <h2 className="text-3xl font-black text-blue-950 uppercase tracking-tight">{studentDetails?.nome}</h2>
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Histórico Consolidado de Olimpíadas</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {studentDetails?.participacoes.map(p => {
                    const olimp = olimpiadas.find(o => o.id === p.olimpiadaId);
                    const turma = turmas.find(t => t.id === p.turmaId);
                    const scores = Object.values(p.notas).filter(v => typeof v === 'number');
                    const avg = scores.length ? (scores.reduce((a, b) => (a as number) + (b as number), 0) as number) / scores.length : 0;

                    return (
                      <div key={p.id} className="bg-slate-50 rounded-3xl p-8 border border-gray-100 flex justify-between items-center group hover:bg-white hover:shadow-xl hover:border-blue-100 transition-all">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-blue-900 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase">{olimp?.nome}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{turma?.nome}</span>
                          </div>
                          <p className="text-xs font-medium text-gray-500">Inscrito em: {new Date(p.dataInclusao).toLocaleDateString('pt-BR')}</p>
                          
                          <div className="flex gap-4 mt-4">
                             {olimp?.fases.map(f => (
                               <div key={f.id} className="text-center">
                                 <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter mb-1">{f.nome}</p>
                                 <p className="text-sm font-black text-blue-900">{p.notas[f.id] ?? '--'}</p>
                               </div>
                             ))}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Média Geral</p>
                          <p className="text-2xl font-black text-red-600">{avg.toFixed(1)}</p>
                          <button 
                            onClick={() => {
                              setEditingP({ p, o: olimp! });
                              setIsEditingModalOpen(true);
                            }}
                            className="mt-4 bg-blue-900 text-white text-[9px] font-black px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest"
                          >
                            Abrir Ficha
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditingModalOpen && editingP && (
        <ParticipanteModal 
          isOpen={isEditingModalOpen}
          onClose={() => setIsEditingModalOpen(false)}
          onSave={(updated) => {
            onEditParticipante(updated);
            setIsEditingModalOpen(false);
          }}
          initialData={editingP.p}
          olimpiada={editingP.o}
          turmas={turmas}
        />
      )}
    </div>
  );
};

export default SearchModal;
