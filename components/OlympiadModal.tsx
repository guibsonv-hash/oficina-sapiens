
import React, { useState, useEffect } from 'react';
import { Olimpiada, Segmento, Fase, Observacao } from '../types';

interface OlympiadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Olimpiada) => void;
  initialData?: Olimpiada;
  activeSegments: Segmento[];
  systemPin: string | null;
  onVerifyPin: (callback: () => void) => void;
}

const OlympiadModal: React.FC<OlympiadModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  activeSegments,
  systemPin,
  onVerifyPin
}) => {
  const [formData, setFormData] = useState<Olimpiada>({
    id: '',
    nome: '',
    site: '',
    telefone: '',
    email: '',
    login: '',
    senha: '',
    inicioInscricao: '',
    fimInscricao: '',
    status: 'Fechada',
    custoEscola: 0,
    custoAluno: 0,
    segmentos: [],
    fases: [],
    observacoes: []
  });

  const [newFase, setNewFase] = useState({ nome: '', data: '' });
  const [newObs, setNewObs] = useState('');
  const [credentialsUnlocked, setCredentialsUnlocked] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        observacoes: initialData.observacoes || []
      });
      setCredentialsUnlocked(!initialData.id);
    } else {
      setCredentialsUnlocked(true);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSegmento = (seg: Segmento) => {
    setFormData(prev => {
      const exists = prev.segmentos.includes(seg);
      if (exists) {
        return { ...prev, segmentos: prev.segmentos.filter(s => s !== seg) };
      }
      return { ...prev, segmentos: [...prev.segmentos, seg] };
    });
  };

  const handleAddFase = () => {
    if (!newFase.nome || !newFase.data) return;
    const fase: Fase = {
      id: Math.random().toString(36).substr(2, 9),
      nome: newFase.nome,
      data: newFase.data
    };
    setFormData(prev => ({ ...prev, fases: [...prev.fases, fase] }));
    setNewFase({ nome: '', data: '' });
  };

  const removeFase = (id: string) => {
    setFormData(prev => ({ ...prev, fases: prev.fases.filter(f => f.id !== id) }));
  };

  const handleAddObs = () => {
    if (!newObs.trim()) return;
    const obs: Observacao = {
      id: Math.random().toString(36).substr(2, 9),
      texto: newObs.trim(),
      data: new Date().toISOString()
    };
    setFormData(prev => ({ ...prev, observacoes: [obs, ...prev.observacoes] }));
    setNewObs('');
  };

  const handleRemoveObs = (id: string) => {
    onVerifyPin(() => {
      setFormData(prev => ({
        ...prev,
        observacoes: prev.observacoes.filter(o => o.id !== id)
      }));
    });
  };

  const handleUnlockCredentials = () => {
    if (systemPin) {
      onVerifyPin(() => setCredentialsUnlocked(true));
    } else {
      setCredentialsUnlocked(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.segmentos.length === 0) {
      alert("Por favor, selecione ao menos 1 segmento.");
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/80 backdrop-blur-sm p-4 overflow-hidden">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-scaleUp overflow-hidden">
        {/* Header */}
        <div className="bg-blue-900 text-white px-10 py-8 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter">
              {initialData ? 'Editar Olimpíada' : 'Cadastrar Olimpíada'}
            </h3>
            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest mt-1">Configuração de Parâmetros e Prazos</p>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform duration-300 p-2">
            <i className="fas fa-times text-3xl"></i>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-12 bg-slate-50/20">
          
          <section className="space-y-6">
            <h4 className="text-blue-900 font-black uppercase text-xs tracking-widest border-l-4 border-red-600 pl-4">Dados Principais</h4>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Nome da Olimpíada</label>
                <input required type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full border-2 border-gray-100 rounded-2xl p-4 focus:border-blue-900 outline-none transition-all font-bold text-lg" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Site Oficial (Link Direto)</label>
                <input required type="url" name="site" value={formData.site} onChange={handleChange} className="w-full border-2 border-gray-100 rounded-2xl p-4 focus:border-blue-900 outline-none transition-all font-bold" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Telefone de Contato</label>
                  <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} className="w-full border-2 border-gray-100 rounded-2xl p-4 focus:border-blue-900 outline-none font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">E-mail de Suporte</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border-2 border-gray-100 rounded-2xl p-4 focus:border-blue-900 outline-none font-bold" />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2rem] border-2 border-gray-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-blue-900 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                <i className={`fas ${credentialsUnlocked ? 'fa-unlock text-red-600' : 'fa-lock'}`}></i> Credenciais do Portal
              </h4>
              {!credentialsUnlocked && (
                <button type="button" onClick={handleUnlockCredentials} className="bg-blue-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-lg">Desbloquear</button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Login / Matrícula</label>
                <input disabled={!credentialsUnlocked} type="text" name="login" value={formData.login} onChange={handleChange} className={`w-full border-2 rounded-2xl p-4 outline-none transition-all font-bold ${credentialsUnlocked ? 'border-gray-200 focus:border-red-600' : 'bg-gray-100 border-transparent cursor-not-allowed'}`} />
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Senha Institucional</label>
                <input disabled={!credentialsUnlocked} type="password" name="senha" value={formData.senha} onChange={handleChange} className={`w-full border-2 rounded-2xl p-4 outline-none transition-all font-bold ${credentialsUnlocked ? 'border-gray-200 focus:border-red-600' : 'bg-gray-100 border-transparent cursor-not-allowed'}`} />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h4 className="text-blue-900 font-black uppercase text-xs tracking-widest border-l-4 border-red-600 pl-4">Calendário</h4>
              <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-100 shadow-sm space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Abertura</label>
                    <input required type="date" name="inicioInscricao" value={formData.inicioInscricao} onChange={handleChange} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-900 font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Fechamento</label>
                    <input required type="date" name="fimInscricao" value={formData.fimInscricao} onChange={handleChange} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-900 font-bold" />
                  </div>
                </div>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full border-2 border-gray-100 rounded-xl p-4 focus:border-blue-900 font-black uppercase text-xs text-blue-900 bg-blue-50/50">
                  <option value="Aberta">Inscrições Abertas</option>
                  <option value="Fechada">Inscrições Encerradas</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-blue-900 font-black uppercase text-xs tracking-widest border-l-4 border-red-600 pl-4">Segmentos</h4>
              <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-100 shadow-sm space-y-4">
                {activeSegments.map(seg => (
                  <label key={seg} className={`flex items-center gap-4 p-3 border-2 rounded-2xl cursor-pointer transition-all ${formData.segmentos.includes(seg) ? 'border-blue-900 bg-blue-50' : 'border-gray-50 bg-gray-50'}`}>
                    <input type="checkbox" checked={formData.segmentos.includes(seg)} onChange={() => toggleSegmento(seg)} className="w-5 h-5 accent-blue-900" />
                    <span className="text-xs font-black text-gray-700 uppercase">{seg}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h4 className="text-blue-900 font-black uppercase text-xs tracking-widest border-l-4 border-red-600 pl-4">Financeiro</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-100 shadow-sm flex items-center gap-6">
                <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center text-xl shadow-lg shadow-blue-900/20"><i className="fas fa-university"></i></div>
                <div className="flex-1">
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Custo Escola (R$)</label>
                  <input type="number" name="custoEscola" value={formData.custoEscola} onChange={handleChange} className="w-full border-b-2 border-gray-100 p-2 text-2xl font-black text-blue-900 focus:border-blue-900 outline-none" />
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-100 shadow-sm flex items-center gap-6">
                <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg shadow-red-600/20"><i className="fas fa-user-graduate"></i></div>
                <div className="flex-1">
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Taxa Aluno (R$)</label>
                  <input type="number" name="custoAluno" value={formData.custoAluno} onChange={handleChange} className="w-full border-b-2 border-gray-100 p-2 text-2xl font-black text-red-600 focus:border-red-600 outline-none" />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h4 className="text-blue-900 font-black uppercase text-xs tracking-widest border-l-4 border-red-600 pl-4">Fases de Avaliação</h4>
            <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <input type="text" placeholder="Ex: 1ª Fase Teórica" value={newFase.nome} onChange={(e) => setNewFase(p => ({...p, nome: e.target.value}))} className="flex-1 border-2 border-gray-100 rounded-2xl p-4 font-bold outline-none focus:border-blue-900" />
                <input type="date" value={newFase.data} onChange={(e) => setNewFase(p => ({...p, data: e.target.value}))} className="md:w-48 border-2 border-gray-100 rounded-2xl p-4 font-bold outline-none focus:border-blue-900" />
                <button type="button" onClick={handleAddFase} className="bg-blue-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all">Adicionar</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.fases.map(f => (
                  <div key={f.id} className="flex items-center justify-between bg-blue-50 border-2 border-blue-100 p-4 rounded-2xl">
                    <div className="min-w-0">
                      <p className="font-black text-blue-900 text-[10px] uppercase truncate">{f.nome}</p>
                      <p className="text-[9px] font-bold text-blue-400 mt-1">{new Date(f.data).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <button type="button" onClick={() => removeFase(f.id)} className="text-red-500 hover:text-red-700 ml-4"><i className="fas fa-times-circle text-lg"></i></button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6 pb-6">
            <h4 className="text-blue-900 font-black uppercase text-xs tracking-widest border-l-4 border-red-600 pl-4">Observações Adicionais</h4>
            <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-100 shadow-sm space-y-6">
              <div className="flex gap-4">
                <textarea placeholder="Inserir anotação interna..." className="flex-1 border-2 border-gray-100 rounded-2xl p-4 font-medium outline-none focus:border-blue-900 min-h-[100px] resize-none" value={newObs} onChange={e => setNewObs(e.target.value)} />
                <button type="button" onClick={handleAddObs} className="bg-blue-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black self-end shadow-lg shadow-blue-900/10">Salvar Nota</button>
              </div>
              <div className="space-y-3">
                {formData.observacoes.map(o => (
                  <div key={o.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl relative group">
                    <p className="text-[9px] font-black text-gray-400 mb-1 uppercase tracking-tighter">{new Date(o.data).toLocaleString('pt-BR')}</p>
                    <p className="text-xs font-semibold text-gray-700 leading-relaxed">{o.texto}</p>
                    <button type="button" onClick={() => handleRemoveObs(o.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all p-2"><i className="fas fa-trash-alt"></i></button>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="bg-white px-10 py-8 border-t border-gray-100 flex justify-end gap-4 shrink-0">
          <button type="button" onClick={onClose} className="px-8 py-4 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:text-blue-900 transition-colors">Cancelar</button>
          <button type="submit" onClick={handleSubmit} className="px-12 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 shadow-xl shadow-red-600/20 active:scale-95 transition-all uppercase text-[10px] tracking-widest">Salvar Alterações</button>
        </div>
      </div>
    </div>
  );
};

export default OlympiadModal;
