
import React from 'react';
import { Olimpiada } from '../types';

interface OlympiadTableProps {
  data: Olimpiada[];
  onEdit: (o: Olimpiada) => void;
  onDelete: (id: string) => void;
}

const OlympiadTable: React.FC<OlympiadTableProps> = ({ data, onEdit, onDelete }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-900 text-white text-[10px] font-black uppercase tracking-widest">
              <th className="px-6 py-5 border-b border-black/10">Olimpíada</th>
              <th className="px-6 py-5 border-b border-black/10">Inscrição</th>
              <th className="px-6 py-5 border-b border-black/10">Encerramento</th>
              <th className="px-6 py-5 border-b border-black/10">Segmentos</th>
              <th className="px-6 py-5 border-b border-black/10 text-right whitespace-nowrap">Custo Escola</th>
              <th className="px-6 py-5 border-b border-black/10 text-right whitespace-nowrap">Custo Aluno</th>
              <th className="px-6 py-5 border-b border-black/10 text-center">Gestão</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((olimp, idx) => (
              <tr 
                key={olimp.id} 
                className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-blue-50 transition-colors group cursor-default`}
              >
                <td className="px-6 py-5">
                  <button 
                    onClick={() => onEdit(olimp)}
                    className="font-black text-blue-900 hover:text-red-600 transition-colors text-sm uppercase text-left"
                  >
                    {olimp.nome}
                  </button>
                  <div className="mt-1 flex items-center gap-1 opacity-60">
                     <i className="fas fa-link text-[10px]"></i>
                     <span className="text-[10px] truncate max-w-[150px]">{olimp.site}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className={`inline-block px-3 py-1 rounded text-[9px] font-black uppercase tracking-tighter border-2 ${
                    olimp.status === 'Aberta' 
                    ? 'bg-green-50 text-green-700 border-green-100' 
                    : 'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    {olimp.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-xs font-bold text-gray-600">
                  {formatDate(olimp.fimInscricao)}
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-1">
                    {olimp.segmentos.map(seg => (
                      <span key={seg} className="text-[9px] px-1.5 py-0.5 bg-blue-100 text-blue-900 rounded font-black uppercase">
                        {seg === 'Fundamental Anos Iniciais' ? 'FAI' : seg === 'Fundamental Anos Finais' ? 'FAF' : 'EM'}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-5 text-sm font-black text-right text-gray-800">
                  {formatCurrency(olimp.custoEscola)}
                </td>
                <td className="px-6 py-5 text-sm font-black text-right text-gray-800">
                  {formatCurrency(olimp.custoAluno)}
                </td>
                <td className="px-6 py-5">
                   <div className="flex justify-center gap-2">
                      <button onClick={() => onEdit(olimp)} className="text-gray-400 hover:text-blue-900 p-2"><i className="fas fa-edit"></i></button>
                      <button onClick={() => onDelete(olimp.id)} className="text-gray-400 hover:text-red-600 p-2"><i className="fas fa-trash"></i></button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="p-20 text-center text-gray-300">
          <i className="fas fa-calendar-plus text-6xl mb-4 opacity-10"></i>
          <p className="text-lg font-bold">Inicie cadastrando sua primeira olimpíada!</p>
          <p className="text-sm">Clique no botão "Incluir Olimpíada" acima.</p>
        </div>
      )}
    </div>
  );
};

export default OlympiadTable;
