
import React, { useState } from 'react';

interface PinVerifyModalProps {
  isOpen: boolean;
  correctPin: string;
  onSuccess: () => void;
  onClose: () => void;
}

const PinVerifyModal: React.FC<PinVerifyModalProps> = ({ isOpen, correctPin, onSuccess, onClose }) => {
  const [input, setInput] = useState('');

  const handleVerify = () => {
    if (input === correctPin) {
      onSuccess();
    } else {
      alert("PIN Incorreto!");
      setInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-blue-950/80 backdrop-blur-md p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center animate-scaleUp">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
          <i className="fas fa-lock"></i>
        </div>
        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight mb-2">Ação Restrita</h3>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-6">Insira o PIN para confirmar a exclusão</p>
        
        <input 
          autoFocus
          type="password" 
          maxLength={6}
          className="w-full text-center text-3xl tracking-[1rem] border-2 border-gray-100 rounded-xl p-4 focus:border-red-600 outline-none font-black mb-6"
          value={input}
          onChange={e => {
            const val = e.target.value.replace(/\D/g, '');
            setInput(val);
            if (val.length === 6 && val === correctPin) {
              onSuccess();
            }
          }}
        />

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-3 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Cancelar</button>
          <button onClick={handleVerify} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default PinVerifyModal;
