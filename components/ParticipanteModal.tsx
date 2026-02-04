
import React, { useState, useEffect, useMemo } from 'react';
import { Participante, Olimpiada, Turma, Segmento } from '../types';
import PinVerifyModal from './PinVerifyModal';

interface ParticipanteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (p: Participante) => void;
  initialData: Participante | null;
  olimpiada: Olimpiada;
  turmas: Turma[];
}

const ParticipanteModal: React.FC<ParticipanteModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  olimpiada,
  turmas
}) => {
  const [formData, setFormData] = useState<Participante>({
    id: '',
    olimpiadaId: olimpiada.id,
    turmaId: '',
    estudanteId: '',
    nome: '',
    segmento: Segmento.MEDIO,
    email: '',
    dataInclusao: new Date().toISOString(),
    notas: {}
  });

  const [isEditing, setIsEditing] = useState(false);
  const [pinRequest, setPinRequest] = useState<{ phaseId: string } | null>(null);
  const systemPin = JSON.parse(localStorage.getItem('sapiens_sys_config') || '{}').pin;

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsEditing(false);
    } else {
      setFormData({
        id: Math.random().toString(36).substr(2, 9),
        olimpiadaId: olimpiada.id,
        turmaId: '',
        estudanteId: '',
        nome: '',
        segmento: Segmento.MEDIO,
        email: '',
        dataInclusao: new Date().toISOString(),
        notas: {}
      });
      setIsEditing(true);
    }
  }, [initialData, olimpiada]);

  const validTurmas = useMemo(() => 
    turmas.filter(t => olimpiada.segmentos.includes(t.segmento)),
    [turmas, olimpiada]
  );

  const selectedTurma = useMemo(() => 
    turmas.find(t => t.id === formData.turmaId),
    [turmas, formData.turmaId]
  );

  const handleTurmaChange = (turmaId: string) => {
    const turma = turmas.find(t => t.id === turmaId);
    setFormData(prev => ({ 
      ...prev, 
      turmaId, 
      estudanteId: '', 
      nome: '', 
      segmento: turma?.segmento || Segmento.MEDIO 
    }));
  };

  const handleEstudanteChange = (estudanteId: string) => {
    const estudante = selectedTurma?.estudantes.find(e => e.id === estudanteId);
    setFormData(prev => ({ 
      ...prev, 
      estudanteId, 
      nome: estudante?.nome || '' 
    }));
  };

  const handleNotaChange = (faseId: string, value: string) => {
    if (value === "" && formData.notas[faseId] !== "" && formData.notas[faseId] !== undefined) {
      // Trying to clear an existing score
      setPinRequest({ phaseId: faseId });
      return;
    }
    const pontos = value === "" ? "" : parseFloat(value);
    setFormData(prev => ({
      ...prev,
      notas: { ...prev.notas, [faseId]: pontos }
    }));
  };

  const handleSaveNota = () => {
    onSave(formData);
    alert('Pontuações salvas com sucesso!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.estudanteId) {
      alert("Por favor, selecione um aluno.");
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-blue-950/70 backdrop-blur-md p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scaleUp flex flex-col max-h-[90vh]">
        <div className="bg-blue-900 px-8 py-6 text-white flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-xl font-black uppercase tracking-wider">
              {initialData ? 'Ficha do Participante' : 'Nova Inscrição'}
            </h3>
            <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">{olimpiada.nome}</p>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform"><i className="fas fa-times text-2xl"></i></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <h4 className="text-blue-900 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                  <i className="fas fa-user-graduate"></i> Seleção do Aluno
                </h4>
                {initialData && !isEditing && (
                  <button type="button" onClick={() => setIsEditing(true)} className="text-red-600 font-black text-[10px] uppercase hover:underline">Editar Vínculo</button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Selecione a Turma</label>
                  <select 
                    disabled={!isEditing}
                    value={formData.turmaId} 
                    onChange={e => handleTurmaChange(e.target.value)} 
                    className={`w-full border-2 rounded-xl p-3 outline-none font-bold text-gray-800 transition-all ${isEditing ? 'border-gray-100 focus:border-blue-900 bg-white' : 'border-transparent bg-gray-50 cursor-not-allowed'}`}
                  >
                    <option value="">Escolha uma turma...</option>
                    {validTurmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Selecione o Aluno</label>
                  <select 
                    disabled={!isEditing || !formData.turmaId}
                    value={formData.estudanteId} 
                    onChange={e => handleEstudanteChange(e.target.value)} 
                    className={`w-full border-2 rounded-xl p-3 outline-none font-bold text-gray-800 transition-all ${isEditing ? 'border-gray-100 focus:border-blue-900 bg-white' : 'border-transparent bg-gray-50 cursor-not-allowed'}`}
                  >
                    <option value="">{formData.turmaId ? 'Escolha o aluno...' : 'Selecione a turma primeiro'}</option>
                    {selectedTurma?.estudantes.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <h4 className="text-blue-900 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                  <i className="fas fa-trophy"></i> Pontuações das Fases
                </h4>
                {initialData && (
                  <button 
                    type="button" 
                    onClick={handleSaveNota}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md transition-all active:scale-95"
                  >
                    <i className="fas fa-save mr-1"></i> Salvar Notas
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {olimpiada.fases.map(f => (
                  <div key={f.id} className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <label className="block text-[10px] font-black text-blue-900 uppercase mb-1">{f.nome}</label>
                    <input 
                      type="number" step="0.01" value={formData.notas[f.id] ?? ""} 
                      onChange={e => handleNotaChange(f.id, e.target.value)} 
                      className="w-full bg-white border-2 border-blue-100 rounded-lg p-2 font-black text-blue-900 outline-none focus:border-blue-900"
                    />
                  </div>
                ))}
                {olimpiada.fases.length === 0 && <p className="text-xs text-gray-400 italic py-4">Sem fases cadastradas nesta olimpíada.</p>}
              </div>
            </div>
          </form>
        </div>

        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-3 text-gray-500 font-bold uppercase text-[10px] tracking-widest hover:bg-white rounded-xl">Fechar</button>
          {isEditing && (
            <button onClick={handleSubmit} className="px-10 py-3 bg-red-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-red-600/20 active:scale-95 transition-all">Confirmar Inscrição</button>
          )}
        </div>
      </div>

      {pinRequest && (
        <PinVerifyModal 
          isOpen={!!pinRequest}
          correctPin={systemPin}
          onSuccess={() => {
            const phaseId = pinRequest.phaseId;
            setFormData(prev => ({
              ...prev,
              notas: { ...prev.notas, [phaseId]: "" }
            }));
            setPinRequest(null);
          }}
          onClose={() => setPinRequest(null)}
        />
      )}
    </div>
  );
};

export default ParticipanteModal;
