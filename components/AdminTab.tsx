
import React, { useState } from 'react';
import { UserAccount } from '../types';

interface AdminTabProps {
  users: Record<string, UserAccount>;
  onSave: (u: UserAccount) => void;
  onDelete: (email: string) => void;
  onVerifyPin: (callback: () => void) => void;
}

const CARGOS_OPTIONS = [
  'Professor',
  'Diretor',
  'Assistente de Direção',
  'Coordenador',
  'Orientador',
  'Administrativo'
];

const AdminTab: React.FC<AdminTabProps> = ({ users, onSave, onDelete, onVerifyPin }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    nome: '',
    cargo: ''
  });

  const handleAddUser = () => {
    if (!formData.email || !formData.nome || !formData.cargo) {
      alert("Preencha todos os campos.");
      return;
    }
    const email = formData.email.toLowerCase().trim();
    if (users[email]) {
      alert("Usuário já cadastrado.");
      return;
    }
    
    onSave({
      email,
      nome: formData.nome,
      cargo: formData.cargo,
      password: '123456',
      pin: null,
      profileCompleted: false
    });
    
    setIsAdding(false);
    setFormData({ email: '', nome: '', cargo: '' });
  };

  const userList: UserAccount[] = Object.values(users);

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">Administração de Usuários</h2>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Gerenciamento de acessos corporativos</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)} 
          className="bg-blue-900 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black shadow-xl shadow-blue-900/10 transition-all"
        >
          + Liberar Novo Acesso
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-blue-100 mb-10 animate-scaleUp">
          <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-6">Cadastrar Novo Usuário (Senha Padrão: 123456)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">E-mail Corporativo</label>
              <input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold focus:border-blue-900 outline-none" placeholder="nome@univap.br" />
            </div>
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Nome Completo</label>
              <input type="text" value={formData.nome} onChange={e => setFormData(p => ({ ...p, nome: e.target.value }))} className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold focus:border-blue-900 outline-none" />
            </div>
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Cargo / Função</label>
              <select 
                value={formData.cargo} 
                onChange={e => setFormData(p => ({ ...p, cargo: e.target.value }))} 
                className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold focus:border-blue-900 outline-none h-[60px]"
              >
                <option value="">Selecione...</option>
                {CARGOS_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <button onClick={handleAddUser} className="bg-blue-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest">Criar Acesso</button>
            <button onClick={() => setIsAdding(false)} className="text-gray-400 font-black uppercase text-[10px] tracking-widest px-6">Cancelar</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-gray-50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-900 text-white text-[10px] font-black uppercase tracking-widest">
              <th className="px-10 py-6">Colaborador / Cargo</th>
              <th className="px-10 py-6">E-mail de Acesso</th>
              <th className="px-10 py-6 text-center">Status de Cadastro</th>
              <th className="px-10 py-6 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {userList.map(u => (
              <tr key={u.email} className="hover:bg-slate-50 transition-colors">
                <td className="px-10 py-5">
                  <p className="font-black text-blue-950 uppercase text-sm">{u.nome || 'Pendente...'}</p>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{u.cargo || 'Funcionário Univap'}</p>
                </td>
                <td className="px-10 py-5 text-xs font-bold text-gray-600">{u.email}</td>
                <td className="px-10 py-5 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border-2 ${u.profileCompleted ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                    {u.profileCompleted ? 'Ativo' : 'Aguardando Ativação'}
                  </span>
                </td>
                <td className="px-10 py-5">
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => onVerifyPin(() => {
                        const newName = prompt("Novo Nome:", u.nome);
                        if (newName) onSave({ ...u, nome: newName });
                      })} 
                      className="text-gray-400 hover:text-blue-900 p-2"
                      title="Editar (Requer Dupla Confirmação)"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      onClick={() => onDelete(u.email)} 
                      className="text-gray-400 hover:text-red-600 p-2"
                      title="Excluir (Requer Dupla Confirmação)"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTab;
