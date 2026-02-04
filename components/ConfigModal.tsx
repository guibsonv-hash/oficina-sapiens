
import React, { useState } from 'react';
import { SystemConfig, UserAccount } from '../types';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SystemConfig;
  currentUser: UserAccount;
  onSavePin: (pin: string | null) => void;
  onChangePassword: (pass: string) => void;
  onClearSystem: () => void;
  onExportData: () => void;
  onLogout: () => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ 
  isOpen, 
  onClose, 
  config, 
  currentUser,
  onSavePin, 
  onChangePassword,
  onClearSystem, 
  onExportData,
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'PIN' | 'PASSWORD' | 'SYSTEM'>('PIN');
  
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');

  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');

  const handleUpdatePin = () => {
    if (config.pin && oldPin !== config.pin) {
      alert("PIN atual incorreto.");
      return;
    }
    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      alert("PIN deve ter 6 dígitos.");
      return;
    }
    if (newPin !== confirmNewPin) {
      alert("PINs não coincidem.");
      return;
    }
    onSavePin(newPin);
    alert("PIN pessoal atualizado.");
    setOldPin(''); setNewPin(''); setConfirmNewPin('');
  };

  const handleUpdatePassword = () => {
    if (currPass !== currentUser.password) {
      alert("Senha atual incorreta.");
      return;
    }
    if (newPass.length < 6) {
      alert("Nova senha deve ter ao menos 6 caracteres.");
      return;
    }
    if (newPass !== confirmNewPass) {
      alert("Novas senhas não coincidem.");
      return;
    }
    onChangePassword(newPass);
    alert("Senha alterada com sucesso.");
    setCurrPass(''); setNewPass(''); setConfirmNewPass('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-950/70 backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleUp flex flex-col">
        <div className="bg-blue-900 p-8 text-white flex justify-between items-center shrink-0">
          <h3 className="text-xl font-black uppercase tracking-widest">Configurações e Segurança</h3>
          <button onClick={onClose} className="hover:rotate-90 transition-transform"><i className="fas fa-times text-xl"></i></button>
        </div>

        <div className="flex border-b border-gray-100 px-4 shrink-0">
          {(['PIN', 'PASSWORD', 'SYSTEM'] as const).map(t => (
            <button 
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'text-blue-900 border-b-2 border-blue-900' : 'text-gray-400 hover:text-blue-900'}`}
            >
              {t === 'PIN' ? 'PIN Pessoal' : t === 'PASSWORD' ? 'Alterar Senha' : 'Administração'}
            </button>
          ))}
        </div>
        
        <div className="p-10 space-y-8 overflow-y-auto max-h-[60vh]">
          {activeTab === 'PIN' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-4">
                <p className="text-[10px] text-blue-900 font-black uppercase tracking-widest">Gerenciar PIN pessoal</p>
                {config.pin && (
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">PIN Atual</label>
                    <input 
                      type="password" maxLength={6} 
                      className="w-full bg-white border-2 border-blue-100 rounded-xl p-3 text-center text-xl tracking-[0.5rem] font-black outline-none"
                      value={oldPin} onChange={e => setOldPin(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Novo PIN</label>
                    <input 
                      type="password" maxLength={6}
                      className="w-full bg-white border-2 border-blue-100 rounded-xl p-3 text-center text-xl tracking-[0.5rem] font-black outline-none"
                      value={newPin} onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Confirmar</label>
                    <input 
                      type="password" maxLength={6}
                      className="w-full bg-white border-2 border-blue-100 rounded-xl p-3 text-center text-xl tracking-[0.5rem] font-black outline-none"
                      value={confirmNewPin} onChange={e => setConfirmNewPin(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </div>
              </div>
              <button onClick={handleUpdatePin} className="w-full bg-blue-900 text-white font-black py-4 rounded-xl uppercase tracking-widest shadow-xl">Salvar Novo PIN</button>
            </div>
          )}

          {activeTab === 'PASSWORD' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">E-mail Corporativo</label>
                  <input type="text" disabled value={currentUser.email} className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-4 text-gray-400 font-bold outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Senha Atual</label>
                  <input type="password" value={currPass} onChange={e => setCurrPass(e.target.value)} className="w-full border-2 border-gray-100 rounded-xl p-4 font-bold outline-none focus:border-blue-900" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Nova Senha</label>
                    <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full border-2 border-gray-100 rounded-xl p-4 font-bold outline-none focus:border-blue-900" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Confirmar</label>
                    <input type="password" value={confirmNewPass} onChange={e => setConfirmNewPass(e.target.value)} className="w-full border-2 border-gray-100 rounded-xl p-4 font-bold outline-none focus:border-blue-900" />
                  </div>
                </div>
              </div>
              <button onClick={handleUpdatePassword} className="w-full bg-blue-900 text-white font-black py-4 rounded-xl uppercase tracking-widest shadow-xl">Confirmar Troca de Senha</button>
            </div>
          )}

          {activeTab === 'SYSTEM' && (
            <div className="space-y-6 animate-fadeIn">
              <button 
                onClick={onExportData}
                className="w-full bg-blue-50 border-2 border-blue-100 text-blue-900 font-black py-5 rounded-2xl flex items-center justify-center gap-4 hover:bg-blue-100 transition-all uppercase tracking-widest text-xs"
              >
                <i className="fas fa-file-export text-xl"></i> Exportar Base de Dados (.json)
              </button>
              
              <div className="h-px bg-gray-100"></div>

              <button 
                onClick={() => { onLogout(); onClose(); }}
                className="w-full border-2 border-gray-200 text-gray-600 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all uppercase tracking-widest text-[10px]"
              >
                <i className="fas fa-sign-out-alt"></i> Sair da Minha Conta
              </button>

              <button 
                onClick={onClearSystem}
                className="w-full bg-red-50 text-red-600 font-black py-4 rounded-2xl border-2 border-red-100 hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
              >
                <i className="fas fa-trash-alt"></i> Redefinir Sistema (Wipe All)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;
