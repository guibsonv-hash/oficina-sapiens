
import React, { useState, useMemo } from 'react';
import { Olimpiada, Participante, Turma, Segmento } from '../types';

interface MetricasTabProps {
  olimpiadas: Olimpiada[];
  participantes: Participante[];
  turmas: Turma[];
}

const MetricasTab: React.FC<MetricasTabProps> = ({ olimpiadas, participantes, turmas }) => {
  const [selectedOlimpId, setSelectedOlimpId] = useState<string>(olimpiadas[0]?.id || '');
  const [rankOlimpId, setRankOlimpId] = useState<string>(olimpiadas[0]?.id || '');
  const [rankTurmaId, setRankTurmaId] = useState<string>('');
  const [rankSegmento, setRankSegmento] = useState<string>('');
  const [rankLimit, setRankLimit] = useState<number>(10);
  const [rankFaseId, setRankFaseId] = useState<string>('total');

  // Filtros para o Volume de Inscrições
  const [volTurmaId, setVolTurmaId] = useState<string>('');
  const [volSegmento, setVolSegmento] = useState<string>('');

  const enrollmentsData = useMemo(() => {
    return olimpiadas.map(o => {
      let filtered = participantes.filter(p => p.olimpiadaId === o.id);
      if (volTurmaId) filtered = filtered.filter(p => p.turmaId === volTurmaId);
      if (volSegmento) filtered = filtered.filter(p => p.segmento === volSegmento);
      return { nome: o.nome, count: filtered.length };
    }).sort((a, b) => b.count - a.count);
  }, [olimpiadas, participantes, volTurmaId, volSegmento]);

  const classPerformance = useMemo(() => {
    if (!selectedOlimpId) return [];
    return turmas.map(t => {
      const pList = participantes.filter(p => p.olimpiadaId === selectedOlimpId && p.turmaId === t.id);
      if (pList.length === 0) return { nome: t.nome, avg: 0 };
      let total = 0, count = 0;
      pList.forEach(p => Object.values(p.notas).forEach(v => { if (typeof v === 'number') { total += v; count++; } }));
      return { nome: t.nome, avg: count > 0 ? total / count : 0 };
    }).sort((a, b) => b.avg - a.avg);
  }, [selectedOlimpId, participantes, turmas]);

  const participantRanking = useMemo(() => {
    if (!rankOlimpId) return [];
    let filtered = participantes.filter(p => p.olimpiadaId === rankOlimpId);
    if (rankTurmaId) filtered = filtered.filter(p => p.turmaId === rankTurmaId);
    if (rankSegmento) filtered = filtered.filter(p => p.segmento === rankSegmento);
    const scored = filtered.map(p => ({
      ...p,
      currentScore: rankFaseId === 'total' ? Object.values(p.notas).reduce<number>((a, v) => a + (typeof v === 'number' ? v : 0), 0) : (typeof p.notas[rankFaseId] === 'number' ? p.notas[rankFaseId] as number : 0),
      turmaNome: turmas.find(t => t.id === p.turmaId)?.nome || 'N/A'
    }));
    return scored.sort((a, b) => b.currentScore - a.currentScore).slice(0, rankLimit);
  }, [participantes, rankOlimpId, rankTurmaId, rankSegmento, rankLimit, rankFaseId, turmas]);

  const generatePDFReport = (reportType: 'ranking' | 'enrollments' | 'performance') => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let content = '';
    let title = '';
    const dateStr = new Date().toLocaleDateString('pt-BR');

    const css = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; background: white; }
        .header { display: flex; align-items: center; border-bottom: 4px solid #dc2626; padding-bottom: 20px; margin-bottom: 30px; }
        .header-logo { width: 60px; height: 60px; background: linear-gradient(135deg, #fbbf24, #d97706); color: white; display: flex; align-items: center; justify-content: center; border-radius: 12px; margin-right: 20px; font-size: 32px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header-info h1 { font-size: 28px; font-weight: 900; color: #1e3a8a; margin: 0; }
        .header-info p { margin: 0; font-size: 11px; font-weight: bold; color: #64748b; letter-spacing: 1px; }
        .report-title { text-transform: uppercase; font-size: 14px; font-weight: 900; background: #f1f5f9; padding: 10px 20px; border-radius: 8px; margin-bottom: 30px; border-left: 5px solid #1e3a8a; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background: #1e3a8a; color: white; text-align: left; padding: 12px; font-size: 10px; text-transform: uppercase; font-weight: 900; }
        td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
        .footer { margin-top: 40px; text-align: center; font-size: 9px; color: #94a3b8; font-weight: bold; text-transform: uppercase; }
        .pos { font-weight: 900; color: #1e3a8a; width: 40px; text-align: center; }
        .val { font-weight: 900; text-align: right; }
      </style>
    `;

    if (reportType === 'ranking') {
      title = `Ranking de Participantes - ${olimpiadas.find(o => o.id === rankOlimpId)?.nome}`;
      content = `
        <table>
          <thead><tr><th style="width: 50px">Pos</th><th>Nome do Aluno</th><th>Turma</th><th style="text-align: right">Pontuação</th></tr></thead>
          <tbody>
            ${participantRanking.map((p, i) => `
              <tr>
                <td class="pos">${i + 1}º</td>
                <td><b>${p.nome}</b></td>
                <td>${p.turmaNome}</td>
                <td class="val">${p.currentScore.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (reportType === 'enrollments') {
      title = `Relatório Global de Inscrições ${volTurmaId ? ' - Turma Selecionada' : ''} ${volSegmento ? ` - ${volSegmento}` : ''}`;
      content = `
        <table>
          <thead><tr><th>Nome da Olimpíada</th><th style="text-align: right">Total de Inscritos</th></tr></thead>
          <tbody>
            ${enrollmentsData.map(d => `
              <tr>
                <td><b>${d.nome}</b></td>
                <td class="val">${d.count} alunos</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      title = `Desempenho por Turma - ${olimpiadas.find(o => o.id === selectedOlimpId)?.nome}`;
      content = `
        <table>
          <thead><tr><th>Identificação da Turma</th><th style="text-align: right">Média de Pontuação</th></tr></thead>
          <tbody>
            ${classPerformance.map(d => `
              <tr>
                <td><b>${d.nome}</b></td>
                <td class="val">${d.avg.toFixed(2)} pts</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>${css}
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </head>
        <body>
          <div class="header">
            <div class="header-logo"><i class="fas fa-trophy"></i></div>
            <div class="header-info">
              <h1>OFICINA SAPIENS</h1>
              <p>Relatório Institucional • Gerado em ${dateStr}</p>
            </div>
          </div>
          <div class="report-title">${title}</div>
          ${content}
          <div class="footer">Este documento é propriedade do Colégio Univap - Oficina Sapiens</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  return (
    <div className="animate-fadeIn space-y-8 pb-20">
      <div className="bg-white rounded-[2rem] shadow-sm p-10 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-gray-50 pb-6">
          <div className="flex items-center gap-4">
            <i className="fas fa-trophy text-yellow-500 text-3xl"></i>
            <div>
              <h3 className="text-xl font-black text-blue-900 uppercase tracking-tighter">Ranking de Desempenho</h3>
              <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">Classificação geral dos participantes</p>
            </div>
          </div>
          <button 
            onClick={() => generatePDFReport('ranking')}
            className="bg-red-600 hover:bg-black text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-600/20 transition-all flex items-center gap-2"
          >
            <i className="fas fa-file-pdf"></i> Extrair Ranking
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-10">
          <div>
            <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Olimpíada</label>
            <select value={rankOlimpId} onChange={e => { setRankOlimpId(e.target.value); setRankFaseId('total'); }} className="w-full text-xs font-black border-2 border-gray-100 rounded-xl p-3 bg-slate-50 outline-none focus:border-blue-900">
              {olimpiadas.map(o => <option key={o.id} value={o.id}>{o.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Turma</label>
            <select value={rankTurmaId} onChange={e => setRankTurmaId(e.target.value)} className="w-full text-xs font-black border-2 border-gray-100 rounded-xl p-3 bg-slate-50 outline-none focus:border-blue-900">
              <option value="">Todas</option>
              {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Segmento</label>
            <select value={rankSegmento} onChange={e => setRankSegmento(e.target.value)} className="w-full text-xs font-black border-2 border-gray-100 rounded-xl p-3 bg-slate-50 outline-none focus:border-blue-900">
              <option value="">Todos</option>
              {Object.values(Segmento).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Top</label>
            <select value={rankLimit} onChange={e => setRankLimit(parseInt(e.target.value))} className="w-full text-xs font-black border-2 border-gray-100 rounded-xl p-3 bg-slate-50 outline-none focus:border-blue-900">
              <option value={10}>10 Melhores</option>
              <option value={25}>25 Melhores</option>
              <option value={50}>50 Melhores</option>
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Critério</label>
            <select value={rankFaseId} onChange={e => setRankFaseId(e.target.value)} className="w-full text-xs font-black border-2 border-gray-100 rounded-xl p-3 bg-slate-50 outline-none focus:border-blue-900">
              <option value="total">Pontuação Acumulada</option>
              {olimpiadas.find(o => o.id === rankOlimpId)?.fases.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-gray-50 shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-blue-950 text-white text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-5 text-center w-20">Pos</th>
                <th className="px-6 py-5">Aluno</th>
                <th className="px-6 py-5">Turma</th>
                <th className="px-6 py-5 text-right">Pontos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {participantRanking.map((p, idx) => (
                <tr key={p.id} className={`${idx < 3 ? 'bg-blue-50/20 font-black' : ''} hover:bg-blue-50 transition-colors`}>
                  <td className="px-6 py-5 text-center">
                    <span className={`w-8 h-8 rounded-full inline-flex items-center justify-center font-black text-[10px] ${idx === 0 ? 'bg-yellow-500 text-white' : idx === 1 ? 'bg-slate-400 text-white' : idx === 2 ? 'bg-orange-600 text-white' : 'text-gray-400 border border-gray-100'}`}>{idx + 1}</span>
                  </td>
                  <td className="px-6 py-5 font-black text-blue-950 uppercase text-xs">{p.nome}</td>
                  <td className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{p.turmaNome}</td>
                  <td className="px-6 py-5 text-right font-black text-blue-900 text-sm">{p.currentScore.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2rem] shadow-sm p-10 border border-gray-100 flex flex-col">
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest border-l-4 border-red-600 pl-4">Volume de Inscrições</h3>
              <button onClick={() => generatePDFReport('enrollments')} className="text-[10px] font-black text-red-600 uppercase hover:underline">Extrair PDF</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[8px] font-black text-gray-400 uppercase mb-1">Filtrar por Turma</label>
                <select value={volTurmaId} onChange={e => setVolTurmaId(e.target.value)} className="w-full text-[10px] font-black border-2 border-gray-100 rounded-xl px-4 py-2 bg-slate-50 outline-none">
                  <option value="">Todas as Turmas</option>
                  {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[8px] font-black text-gray-400 uppercase mb-1">Filtrar por Segmento</label>
                <select value={volSegmento} onChange={e => setVolSegmento(e.target.value)} className="w-full text-[10px] font-black border-2 border-gray-100 rounded-xl px-4 py-2 bg-slate-50 outline-none">
                  <option value="">Todos os Segmentos</option>
                  {Object.values(Segmento).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto max-h-[400px] pr-2">
            {enrollmentsData.map(d => (
              <div key={d.nome} className="group">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-black text-gray-700 uppercase truncate max-w-[200px]">{d.nome}</span>
                  <span className="text-xs font-black text-blue-900">{d.count} alunos</span>
                </div>
                <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-gray-100">
                  <div className="h-full bg-blue-900 transition-all duration-1000" style={{ width: `${(d.count / Math.max(...enrollmentsData.map(x=>x.count), 1)) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm p-10 border border-gray-100 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest border-l-4 border-red-600 pl-4">Médias por Turma</h3>
            <div className="flex items-center gap-3">
              <select value={selectedOlimpId} onChange={e => setSelectedOlimpId(e.target.value)} className="text-[10px] font-black border-2 border-gray-100 rounded-xl px-4 py-2 outline-none bg-slate-50">
                {olimpiadas.map(o => <option key={o.id} value={o.id}>{o.nome}</option>)}
              </select>
              <button onClick={() => generatePDFReport('performance')} className="text-[10px] font-black text-red-600 uppercase hover:underline">Extrair PDF</button>
            </div>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto max-h-[400px] pr-2">
            {classPerformance.map(d => (
              <div key={d.nome} className="group">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-black text-gray-700 uppercase">{d.nome}</span>
                  <span className="text-xs font-black text-red-600">{d.avg.toFixed(1)} pts</span>
                </div>
                <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-gray-100">
                  <div className="h-full bg-red-600 transition-all duration-1000" style={{ width: `${(d.avg / Math.max(...classPerformance.map(x=>x.avg), 1)) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricasTab;
