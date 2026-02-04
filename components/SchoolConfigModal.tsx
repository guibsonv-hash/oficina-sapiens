
import React, { useState, useEffect } from 'react';
import { EscolaInfo, Segmento } from '../types';

interface SchoolConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EscolaInfo) => void;
  initialData: EscolaInfo;
  needsPin: boolean;
  systemPin: string | null;
  onVerifyPin: (callback: () => void) => void;
}

const SchoolConfigModal: React.FC<SchoolConfigModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData,
  needsPin,
  systemPin,
  onVerifyPin
}) => {
  const [formData, setFormData] = useState<EscolaInfo>(initialData);
  const [isUnlocked, setIsUnlocked] = useState(!needsPin);

  useEffect(() => {
    setFormData(initialData);
    setIsUnlocked(!needsPin);
  }, [initialData, needsPin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSegmento = (seg: Segmento) => {
    setFormData(prev => {
      const exists = prev.segmentosAtivos.includes(seg);
      if (exists) {
        return { ...prev, segmentosAtivos: prev.segmentosAtivos.filter(s => s !== seg) };
      }
      return { ...prev, segmentosAtivos: [...prev.segmentosAtivos, seg] };
    });
  };

  const handleSave = () => {
    if (!formData.nome || !formData.cnpj) {
      alert("Preencha ao menos o nome e o CNPJ.");
      return;
    }
    onSave(formData);
  };

  const handleUnlock = () => {
    if (systemPin) {
      onVerifyPin(() => setIsUnlocked(true));
    } else {
      setIsUnlocked(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-blue-950/60 backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleUp">
        <div className="bg-blue-900 px-8 py-6 text-white flex justify-between items-center">
          <h3 className="text-xl font-black uppercase tracking-wider">Dados do Colégio</h3>
          <button onClick={onClose} className="hover:rotate-90 transition-transform"><i className="fas fa-times text-xl"></i></button>
        </div>

        <div className="p-10 space-y-6">
          {!isUnlocked && (
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center space-y-4">
              <i className="fas fa-lock text-3xl text-red-600 mb-2"></i>
              <p className="text-xs font-bold text-red-800 uppercase tracking-widest">Estes dados são restritos.</p>
              <button 
                onClick={handleUnlock}
                className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-600/20"
              >
                Desbloquear com PIN
              </button>
            </div>
          )}

          <div className={`space-y-4 transition-all ${!isUnlocked ? 'opacity-20 pointer-events-none' : ''}`}>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Nome Fantasia do Colégio</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full border-2 border-gray-100 rounded-xl p-4 focus:border-blue-900 outline-none font-bold text-gray-800" placeholder="Ex: Colégio Univap" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">CNPJ</label>
                <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} className="w-full border-2 border-gray-100 rounded-xl p-4 focus:border-blue-900 outline-none font-bold" placeholder="00.000.000/0001-00" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">INEP</label>
                <input type="text" name="inep" value={formData.inep} onChange={handleChange} className="w-full border-2 border-gray-100 rounded-xl p-4 focus:border-blue-900 outline-none font-bold" placeholder="12345678" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Segmentos Ativos</label>
              <div className="grid grid-cols-1 gap-2">
                {Object.values(Segmento).map(seg => (
                  <label key={seg} className="flex items-center gap-3 p-3 border-2 border-gray-50 bg-gray-50 rounded-xl cursor-pointer hover:border-blue-200 transition-all">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-blue-900"
                      checked={formData.segmentosAtivos.includes(seg)} 
                      onChange={() => toggleSegmento(seg)}
                    />
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{seg}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <button onClick={onClose} className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-black text-gray-400 uppercase text-[10px] tracking-widest hover:bg-gray-50">Cancelar</button>
            <button 
              disabled={!isUnlocked}
              onClick={handleSave} 
              className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black shadow-xl shadow-red-600/20 hover:bg-red-700 active:scale-95 transition-all uppercase text-[10px] tracking-widest disabled:opacity-50"
            >
              Confirmar Alteração
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolConfigModal;
