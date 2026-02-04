
import React, { useState } from 'react';
import { Lembrete } from '../types';

interface RemindersModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: Lembrete[];
  onSave: (l: Lembrete) => void;
  onDelete: (id: string) => void;
  onMarkAsRead: (id: string) => void;
}

const RemindersModal: React.FC<RemindersModalProps> = ({ isOpen, onClose, reminders, onSave, onDelete, onMarkAsRead }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    importancia: 'Media' as const,
    dataHora: ''
  });

  const handleSave = () => {
    if (!formData.titulo || !formData.dataHora) return;
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      visualizado: false,
      notificado: false
    });
    setFormData({ titulo: '', descricao: '', importancia: 'Media', dataHora: '' });
    setIsAdding(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-950/70 backdrop-blur-md p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-scaleUp flex flex-col max-h-[90vh]">
        <div className="bg-blue-900 p-6 text-white flex justify-between items-center">
          <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
            <i className="fas fa-bell"></i> Lembretes e Agendamentos
          </h3>
          <button onClick={onClose} className="hover:rotate-90 transition-transform"><i className="fas fa-times text-xl"></i></button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Seus Lembretes</h4>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="bg-blue-900 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black"
            >
              {isAdding ? 'Cancelar' : '+ Agendar Novo'}
            </button>
          </div>

          {isAdding && (
            <div className="bg-slate-50 border-2 border-blue-100 p-6 rounded-2xl space-y-4 animate-fadeIn">
              <input 
                type="text" placeholder="Título do Lembrete" 
                className="w-full border-2 border-white rounded-xl p-3 outline-none focus:border-blue-900 font-bold"
                value={formData.titulo}
                onChange={e => setFormData(p => ({ ...p, titulo: e.target.value }))}
              />
              <textarea 
                placeholder="Descrição (opcional)" 
                className="w-full border-2 border-white rounded-xl p-3 outline-none focus:border-blue-900 font-medium h-24"
                value={formData.descricao}
                onChange={e => setFormData(p => ({ ...p, descricao: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <select 
                  className="w-full border-2 border-white rounded-xl p-3 outline-none font-bold"
                  value={formData.importancia}
                  onChange={e => setFormData(p => ({ ...p, importancia: e.target.value as any }))}
                >
                  <option value="Baixa">Importância Baixa</option>
                  <option value="Media">Importância Média</option>
                  <option value="Alta">Importância Alta</option>
                </select>
                <input 
                  type="datetime-local" 
                  className="w-full border-2 border-white rounded-xl p-3 outline-none font-bold"
                  value={formData.dataHora}
                  onChange={e => setFormData(p => ({ ...p, dataHora: e.target.value }))}
                />
              </div>
              <button onClick={handleSave} className="w-full bg-blue-900 text-white font-black py-4 rounded-xl uppercase tracking-widest shadow-xl">Confirmar Agendamento</button>
            </div>
          )}

          <div className="space-y-3">
            {reminders.sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()).map(l => (
              <div 
                key={l.id} 
                className={`p-4 rounded-xl border-2 transition-all relative group ${l.visualizado ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-blue-50 hover:border-blue-200 shadow-sm'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${l.importancia === 'Alta' ? 'bg-red-600' : l.importancia === 'Media' ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
                      <h5 className="font-black text-blue-950 uppercase text-xs">{l.titulo}</h5>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium mb-2">{l.descricao}</p>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      <i className="far fa-clock mr-1"></i> {new Date(l.dataHora).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    {!l.visualizado && (
                      <button onClick={() => onMarkAsRead(l.id)} className="text-green-600 p-2 hover:bg-green-50 rounded-lg"><i className="fas fa-check-double"></i></button>
                    )}
                    <button onClick={() => onDelete(l.id)} className="text-red-600 p-2 hover:bg-red-50 rounded-lg"><i className="fas fa-trash-alt"></i></button>
                  </div>
                </div>
              </div>
            ))}
            {reminders.length === 0 && (
              <div className="text-center py-20">
                <i className="fas fa-calendar-check text-gray-100 text-6xl mb-4"></i>
                <p className="text-gray-400 font-bold">Nenhum lembrete agendado.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemindersModal;
