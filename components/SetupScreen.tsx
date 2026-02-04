
import React, { useState } from 'react';
import { EscolaInfo, Segmento, UserAccount } from '../types';

interface SetupScreenProps {
  onFinish: (userData: Partial<UserAccount>, schoolData?: EscolaInfo) => void;
  initialSchoolData: EscolaInfo;
  isSchoolConfigured: boolean;
}

const CARGOS_OPTIONS = [
  'Professor',
  'Diretor',
  'Assistente de Direção',
  'Coordenador',
  'Orientador',
  'Administrativo'
];

const SetupScreen: React.FC<SetupScreenProps> = ({ onFinish, initialSchoolData, isSchoolConfigured }) => {
  const [userData, setUserData] = useState({
    nome: '',
    cargo: '',
    password: '',
    confirmPassword: '',
    pin: '',
    confirmPin: ''
  });

  const [schoolData, setSchoolData] = useState<EscolaInfo>(initialSchoolData);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSchoolData(prev => ({ ...prev, [name]: value }));
  };

  const validatePassword = (pass: string) => {
    const hasLetter = /[a-zA-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    return hasLetter && hasNumber;
  };

  const toggleSegmento = (seg: Segmento) => {
    setSchoolData(prev => {
      const exists = prev.segmentosAtivos.includes(seg);
      if (exists) {
        return { ...prev, segmentosAtivos: prev.segmentosAtivos.filter(s => s !== seg) };
      }
      return { ...prev, segmentosAtivos: [...prev.segmentosAtivos, seg] };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData.nome || !userData.cargo || !userData.password || !userData.pin) {
      alert("Todos os campos de perfil são obrigatórios.");
      return;
    }
    
    if (!validatePassword(userData.password)) {
      alert("A senha deve conter pelo menos uma letra e um número.");
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }
    if (userData.pin.length !== 6) {
      alert("O PIN deve ter 6 dígitos.");
      return;
    }
    if (userData.pin !== userData.confirmPin) {
      alert("Os PINs não coincidem.");
      return;
    }

    if (!isSchoolConfigured) {
      if (!schoolData.nome || !schoolData.cnpj || !schoolData.inep || schoolData.segmentosAtivos.length === 0) {
        alert("Configuração completa do colégio (Nome, CNPJ, INEP e Segmentos) é obrigatória para o primeiro acesso.");
        return;
      }
    }

    onFinish(
      { 
        nome: userData.nome, 
        cargo: userData.cargo, 
        password: userData.password, 
        pin: userData.pin 
      }, 
      isSchoolConfigured ? undefined : schoolData
    );
  };

  return (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 animate-scaleUp">
        <div className="bg-blue-900 p-8 text-center text-white">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center text-white text-4xl shadow-xl mx-auto mb-4">
            <i className="fas fa-trophy drop-shadow-md"></i>
          </div>
          <h1 className="text-xl font-black tracking-tight mb-2 uppercase">Configuração de Primeiro Acesso</h1>
          <p className="text-blue-200 text-xs font-medium uppercase tracking-widest">Complete seus dados para ativar o sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto">
          <section className="space-y-4">
            <h4 className="text-blue-900 font-black uppercase text-[11px] tracking-widest border-b border-blue-50 pb-2">Seu Perfil de Usuário</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-wider">Nome Completo</label>
                <input required type="text" name="nome" value={userData.nome} onChange={handleUserChange} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-900 outline-none transition-all font-semibold" placeholder="Seu nome" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-wider">Cargo / Função</label>
                <select 
                  required 
                  name="cargo" 
                  value={userData.cargo} 
                  onChange={handleUserChange} 
                  className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-900 outline-none transition-all font-semibold"
                >
                  <option value="">Selecione...</option>
                  {CARGOS_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-wider">Nova Senha (Letra + Número)</label>
                <input required type="password" name="password" value={userData.password} onChange={handleUserChange} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-900 outline-none font-semibold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-wider">Confirmar Senha</label>
                <input required type="password" name="confirmPassword" value={userData.confirmPassword} onChange={handleUserChange} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-900 outline-none font-semibold" />
              </div>
            </div>

            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <i className="fas fa-shield-alt"></i> PIN de Segurança Pessoal
                </h4>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Criar PIN (6 dígitos)</label>
                <input required type="password" name="pin" maxLength={6} value={userData.pin} onChange={e => setUserData(p => ({ ...p, pin: e.target.value.replace(/\D/g, '') }))} className="w-full text-center text-xl tracking-[0.5rem] border-2 border-gray-100 rounded-xl p-2 focus:border-red-600 outline-none font-black" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Confirmar PIN</label>
                <input required type="password" name="confirmPin" maxLength={6} value={userData.confirmPin} onChange={e => setUserData(p => ({ ...p, confirmPin: e.target.value.replace(/\D/g, '') }))} className="w-full text-center text-xl tracking-[0.5rem] border-2 border-gray-100 rounded-xl p-2 focus:border-red-600 outline-none font-black" />
              </div>
            </div>
          </section>

          {!isSchoolConfigured && (
            <section className="space-y-4 pt-4 border-t border-gray-100 animate-fadeIn">
              <h4 className="text-blue-900 font-black uppercase text-[11px] tracking-widest border-b border-blue-50 pb-2 flex items-center gap-2">
                <i className="fas fa-university"></i> Dados Obrigatórios do Colégio
              </h4>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-wider">Nome do Colégio</label>
                <input required type="text" name="nome" value={schoolData.nome} onChange={handleSchoolChange} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-900 outline-none font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">CNPJ</label>
                  <input required type="text" name="cnpj" value={schoolData.cnpj} onChange={handleSchoolChange} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-900 outline-none font-bold" placeholder="00.000.000/0000-00" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">INEP</label>
                  <input required type="text" name="inep" value={schoolData.inep} onChange={handleSchoolChange} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-900 outline-none font-bold" placeholder="00000000" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Segmentos Ativos</label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.values(Segmento).map(seg => (
                    <label key={seg} className="flex items-center gap-3 p-3 border-2 border-gray-50 bg-gray-50 rounded-xl cursor-pointer hover:border-blue-200">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 accent-blue-900"
                        checked={schoolData.segmentosAtivos.includes(seg)} 
                        onChange={() => toggleSegmento(seg)}
                      />
                      <span className="text-[10px] font-black text-gray-600 uppercase">{seg}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>
          )}

          <button type="submit" className="w-full bg-blue-900 hover:bg-black text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-900/20 uppercase tracking-widest transition-all transform active:scale-95 text-xs">
            Finalizar e Acessar Sistema <i className="fas fa-check-circle ml-2"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupScreen;
