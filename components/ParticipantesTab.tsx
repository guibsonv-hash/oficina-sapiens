
import React, { useState, useMemo } from 'react';
import { Olimpiada, Participante, Turma } from '../types';
import ParticipanteModal from './ParticipanteModal';

interface ParticipantesTabProps {
  olimpiadas: Olimpiada[];
  participantes: Participante[];
  turmas: Turma[];
  onSave: (p: Participante) => void;
  onDelete: (id: string) => void;
  onBulkAdd: (olimpiadaId: string, turmaId: string) => void;
}

const ParticipantesTab: React.FC<ParticipantesTabProps> = ({ 
  olimpiadas, 
  participantes, 
  turmas,
  onSave, 
  onDelete,
  onBulkAdd
}) => {
  const [selectedOlimpiadaId, setSelectedOlimpiadaId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParticipante, setEditingParticipante] = useState<Participante | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedTurmaForBulk, setSelectedTurmaForBulk] = useState('');

  const selectedOlimpiada = useMemo(() => 
    olimpiadas.find(o => o.id === selectedOlimpiadaId), 
    [olimpiadas, selectedOlimpiadaId]
  );

  const filteredParticipantes = useMemo(() => 
    participantes.filter(p => p.olimpiadaId === selectedOlimpiadaId),
    [participantes, selectedOlimpiadaId]
  );

  const validTurmas = useMemo(() => {
    if (!selectedOlimpiada) return [];
    return turmas.filter(t => selectedOlimpiada.segmentos.includes(t.segmento));
  }, [turmas, selectedOlimpiada]);

  return (
    <div className="animate-fadeIn">
      <div className="bg-white p-8 rounded-3xl shadow-sm mb-8 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex-1 min-w-[300px]">
            <label className="block text-[10px] font-black text-blue-900 uppercase tracking-widest mb-3">Filtrar por Olimpíada Acadêmica</label>
            <select 
              value={selectedOlimpiadaId} 
              onChange={(e) => setSelectedOlimpiadaId(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-2xl p-4 font-black text-gray-700 focus:border-blue-900 outline-none transition-all bg-slate-50/50"
            >
              <option value="">Selecione o evento acadêmico...</option>
              {olimpiadas.map(o => (
                <option key={o.id} value={o.id}>{o.nome}</option>
              ))}
            </select>
          </div>
          
          {selectedOlimpiadaId && (
            <div className="flex items-stretch gap-3 h-[64px]">
              <div className="bg-blue-950 text-white px-8 rounded-2xl flex flex-col items-center justify-center min-w-[140px] shadow-xl shadow-blue-950/10">
                <span className="text-[8px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">Inscritos</span>
                <span className="text-2xl font-black leading-none">{filteredParticipantes.length}</span>
              </div>

              <button
                onClick={() => setIsBulkModalOpen(true)}
                className="bg-blue-900 hover:bg-black text-white px-8 rounded-2xl shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 font-black transition-all transform hover:scale-[1.02] active:scale-95 uppercase text-[10px] tracking-widest whitespace-nowrap"
              >
                <i className="fas fa-users-class text-lg"></i> Incluir Turma
              </button>

              <button
                onClick={() => { setEditingParticipante(null); setIsModalOpen(true); }}
                className="bg-red-600 hover:bg-red-700 text-white px-8 rounded-2xl shadow-xl shadow-red-600/20 flex items-center justify-center gap-3 font-black transition-all transform hover:scale-[1.02] active:scale-95 uppercase text-[10px] tracking-widest whitespace-nowrap"
              >
                <i className="fas fa-user-plus text-lg"></i> Incluir Aluno
              </button>
            </div>
          )}
        </div>
      </div>

      {!selectedOlimpiadaId ? (
        <div className="bg-white rounded-[2rem] p-32 text-center border-2 border-dashed border-gray-200">
          <i className="fas fa-list-check text-8xl text-blue-50 mb-6"></i>
          <p className="text-gray-400 font-black uppercase text-xs tracking-widest">Selecione uma olimpíada no filtro acima para carregar os participantes.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-blue-900 text-white text-[10px] font-black uppercase tracking-widest">
                <th className="px-10 py-6">Nome Completo do Aluno</th>
                <th className="px-10 py-6">Turma Atual</th>
                <th className="px-10 py-6">Inclusão</th>
                <th className="px-10 py-6 text-center">Gestão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredParticipantes.map((p, idx) => (
                <tr key={p.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} hover:bg-blue-50/50 transition-colors group`}>
                  <td className="px-10 py-5">
                    <button 
                      onClick={() => { setEditingParticipante(p); setIsModalOpen(true); }}
                      className="font-black text-blue-950 hover:text-red-600 transition-colors uppercase text-sm"
                    >
                      {p.nome}
                    </button>
                    <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-widest">{p.email || 'SEM E-MAIL CADASTRADO'}</p>
                  </td>
                  <td className="px-10 py-5">
                    <span className="text-xs font-black text-gray-500 uppercase">{turmas.find(t => t.id === p.turmaId)?.nome || 'TURMA EXCLUÍDA'}</span>
                  </td>
                  <td className="px-10 py-5 text-xs font-bold text-gray-400">{new Date(p.dataInclusao).toLocaleDateString('pt-BR')}</td>
                  <td className="px-10 py-5">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => { setEditingParticipante(p); setIsModalOpen(true); }} className="text-gray-400 hover:text-blue-900 p-2"><i className="fas fa-edit"></i></button>
                      <button onClick={() => onDelete(p.id)} className="text-gray-400 hover:text-red-600 p-2"><i className="fas fa-trash-alt"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredParticipantes.length === 0 && (
            <div className="p-32 text-center text-gray-300 italic font-black uppercase tracking-widest text-xs opacity-50">Nenhum registro encontrado nesta categoria.</div>
          )}
        </div>
      )}

      {isBulkModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-950/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-scaleUp">
            <div className="bg-blue-900 p-8 text-white flex justify-between items-center">
              <h3 className="text-lg font-black uppercase tracking-widest">Inscrição em Massa</h3>
              <button onClick={() => setIsBulkModalOpen(false)} className="p-2 hover:rotate-90 transition-all"><i className="fas fa-times text-2xl"></i></button>
            </div>
            <div className="p-10 space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-3">Selecione a Turma Destino</label>
                <select 
                  value={selectedTurmaForBulk} 
                  onChange={(e) => setSelectedTurmaForBulk(e.target.value)} 
                  className="w-full border-2 border-gray-100 rounded-2xl p-4 font-black text-gray-700 outline-none bg-slate-50 focus:border-blue-900 transition-all"
                >
                  <option value="">Escolha uma turma compatível...</option>
                  {validTurmas.map(t => (
                    <option key={t.id} value={t.id}>{t.nome} ({t.segmento})</option>
                  ))}
                </select>
                <p className="mt-4 text-[9px] text-gray-400 leading-relaxed font-semibold uppercase tracking-tight">
                  Este processo inscreverá automaticamente todos os alunos desta turma que ainda não possuem cadastro nesta olimpíada específica.
                </p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsBulkModalOpen(false)} 
                  className="flex-1 py-4 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:text-blue-900 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  disabled={!selectedTurmaForBulk} 
                  onClick={() => { 
                    onBulkAdd(selectedOlimpiadaId, selectedTurmaForBulk); 
                    setIsBulkModalOpen(false); 
                    setSelectedTurmaForBulk(''); 
                  }} 
                  className="flex-[2] bg-red-600 hover:bg-red-700 disabled:bg-gray-200 text-white font-black py-4 px-10 rounded-2xl uppercase tracking-widest shadow-xl shadow-red-600/20 transition-all active:scale-95"
                >
                  Confirmar Inscrição
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && selectedOlimpiada && (
        <ParticipanteModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={onSave}
          initialData={editingParticipante}
          olimpiada={selectedOlimpiada}
          turmas={turmas}
        />
      )}
    </div>
  );
};

export default ParticipantesTab;
