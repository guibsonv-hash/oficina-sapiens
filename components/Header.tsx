
import React from 'react';
import { EscolaInfo, UserAccount } from '../types';

interface HeaderProps {
  school: EscolaInfo;
  user: UserAccount;
  onEditSchool: () => void;
  onOpenConfig: () => void;
  onOpenReminders: () => void;
  onOpenSearch: () => void;
  onLogout: () => void;
  unreadReminders: number;
}

const Header: React.FC<HeaderProps> = ({ 
  school, 
  user,
  onEditSchool, 
  onOpenConfig, 
  onOpenReminders, 
  onOpenSearch, 
  onLogout,
  unreadReminders
}) => {
  return (
    <header className="bg-white border-b-4 border-red-600 shadow-sm px-4 py-4 sticky top-0 z-50">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl shrink-0 border-2 border-white/20">
            <i className="fas fa-trophy drop-shadow-md"></i>
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-black text-blue-900 tracking-tighter leading-none mb-1">
              OFICINA SAPIENS
            </h1>
            <div className="flex flex-col text-[10px] font-black text-gray-500 uppercase tracking-tighter">
              <span className="text-red-600 truncate mb-0.5">{school.nome || 'COLÉGIO NÃO CONFIGURADO'}</span>
              <div className="flex gap-4 opacity-70">
                <span className="flex items-center gap-1"><i className="fas fa-id-card text-[8px]"></i> CNPJ: {school.cnpj || '00.000.000/0000-00'}</span>
                <span className="flex items-center gap-1"><i className="fas fa-barcode text-[8px]"></i> INEP: {school.inep || '00000000'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-full border border-gray-100">
            <button onClick={onOpenSearch} className="w-10 h-10 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-blue-900 transition-all" title="Pesquisar Aluno">
              <i className="fas fa-search"></i>
            </button>

            <button onClick={onOpenReminders} className="w-10 h-10 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-blue-900 transition-all relative" title="Lembretes">
              <i className="fas fa-bell"></i>
              {unreadReminders > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                  {unreadReminders}
                </span>
              )}
            </button>

            <div className="h-8 w-px bg-gray-200 mx-1"></div>

            <div className="text-right px-2 hidden sm:block max-w-[150px]">
              <p className="text-[10px] font-black text-blue-900 uppercase leading-none truncate">{user.nome || 'Usuário'}</p>
              <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1 truncate">{user.cargo || 'Gestão Univap'}</p>
            </div>

            <button onClick={onEditSchool} className="w-10 h-10 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center text-blue-900 hover:ring-2 hover:ring-blue-900 transition-all" title="Dados do Colégio">
              <i className="fas fa-university"></i>
            </button>

            <button onClick={onOpenConfig} className="w-10 h-10 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-blue-900 transition-all" title="Configurações Pessoais">
              <i className="fas fa-cog"></i>
            </button>

            <button onClick={onLogout} className="w-10 h-10 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-red-600 transition-all" title="Sair">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
