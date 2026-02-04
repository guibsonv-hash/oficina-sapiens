
import React, { useState, useMemo } from 'react';
import { Turma, Segmento, Estudante } from '../types';

interface TurmasTabProps {
  turmas: Turma[];
  schoolSegments: Segmento[];
  onSaveTurma: (t: Turma) => void;
  onDeleteTurma: (id: string) => void;
  onDeleteStudent: (turmaId: string, studentId: string) => void;
}

const TurmasTab: React.FC<TurmasTabProps> = ({ turmas, schoolSegments, onSaveTurma, onDeleteTurma, onDeleteStudent }) => {
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>('');
  const [isAddingTurma, setIsAddingTurma] = useState(false);
  const [newTurmaName, setNewTurmaName] = useState('');
  const [newTurmaSeg, setNewTurmaSeg] = useState<Segmento>(schoolSegments[0]);

  const [studentInput, setStudentInput] = useState('');
  const [isAddingIndividual, setIsAddingIndividual] = useState(true);

  const selectedTurma = useMemo(() => turmas.find(t => t.id === selectedTurmaId), [turmas, selectedTurmaId]);

  const handleAddTurma = () => {
    if (!newTurmaName) return;
    const n: Turma = {
      id: Math.random().toString(36).substr(2, 9),
      nome: newTurmaName,
      segmento: newTurmaSeg,
      estudantes: []
    };
    onSaveTurma(n);
    setNewTurmaName('');
    setIsAddingTurma(false);
    setSelectedTurmaId(n.id);
  };

  const handleAddStudents = () => {
    if (!selectedTurma || !studentInput) return;
    
    let studentsToAdd: Estudante[] = [];
    if (isAddingIndividual) {
      studentsToAdd = [{ id: Math.random().toString(36).substr(2, 9), nome: studentInput.trim() }];
    } else {
      studentsToAdd = studentInput.split('\n').filter(s => s.trim()).map(s => ({
        id: Math.random().toString(36).substr(2, 9),
        nome: s.trim()
      }));
    }

    onSaveTurma({
      ...selectedTurma,
      estudantes: [...selectedTurma.estudantes, ...studentsToAdd]
    });
    setStudentInput('');
  };

  const removeStudent = (estId: string) => {
    if (!selectedTurma) return;
    onDeleteStudent(selectedTurma.id, estId);
  };

  return (
    <div className="animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: Turmas List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest">Suas Turmas</h3>
            <button onClick={() => setIsAddingTurma(true)} className="text-blue-900 hover:text-red-600"><i className="fas fa-plus-circle"></i></button>
          </div>

          <div className="space-y-2">
            {turmas.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTurmaId(t.id)}
                className={`w-full text-left p-3 rounded-lg text-sm font-bold border-2 transition-all ${selectedTurmaId === t.id ? 'border-blue-900 bg-blue-50 text-blue-900' : 'border-transparent bg-gray-50 text-gray-500 hover:border-gray-200'}`}
              >
                {t.nome}
                <span className="block text-[9px] uppercase opacity-60">{t.segmento}</span>
              </button>
            ))}
            {turmas.length === 0 && <p className="text-[10px] text-gray-400 italic">Nenhuma turma criada.</p>}
          </div>

          {isAddingTurma && (
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-fadeIn">
              <input 
                type="text" 
                placeholder="Nome da Turma" 
                className="w-full text-xs p-2 rounded border"
                value={newTurmaName}
                onChange={e => setNewTurmaName(e.target.value)}
              />
              <select 
                className="w-full text-xs p-2 rounded border"
                value={newTurmaSeg}
                onChange={e => setNewTurmaSeg(e.target.value as Segmento)}
              >
                {schoolSegments.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="flex gap-2">
                <button onClick={handleAddTurma} className="flex-1 bg-blue-900 text-white text-[10px] font-bold py-2 rounded">Criar</button>
                <button onClick={() => setIsAddingTurma(false)} className="flex-1 bg-gray-200 text-gray-600 text-[10px] font-bold py-2 rounded">X</button>
              </div>
            </div>
          )}
        </div>

        {/* Main Content: Students List */}
        <div className="lg:col-span-3">
          {!selectedTurma ? (
            <div className="bg-white h-full rounded-xl flex items-center justify-center border border-dashed border-gray-200 p-12">
              <div className="text-center">
                <i className="fas fa-users text-4xl text-gray-100 mb-2"></i>
                <p className="text-gray-400 font-bold text-sm">Selecione uma turma para ver os alunos.</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col h-full">
              <div className="bg-blue-900 p-6 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">{selectedTurma.nome}</h2>
                  <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">{selectedTurma.segmento}</p>
                </div>
                <button 
                  onClick={() => onDeleteTurma(selectedTurma.id)}
                  className="bg-red-600/20 hover:bg-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                >
                  <i className="fas fa-trash-alt mr-2"></i> Excluir Turma
                </button>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <button 
                      onClick={() => setIsAddingIndividual(true)}
                      className={`text-xs font-black uppercase tracking-widest ${isAddingIndividual ? 'text-blue-900 border-b-2 border-blue-900' : 'text-gray-400'}`}
                    >
                      Individual
                    </button>
                    <button 
                      onClick={() => setIsAddingIndividual(false)}
                      className={`text-xs font-black uppercase tracking-widest ${!isAddingIndividual ? 'text-blue-900 border-b-2 border-blue-900' : 'text-gray-400'}`}
                    >
                      Lista (Multiplos)
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    {isAddingIndividual ? (
                      <input 
                        type="text" 
                        placeholder="Nome completo do aluno"
                        className="flex-1 border-2 border-gray-100 rounded-lg p-3 font-bold text-sm outline-none focus:border-blue-900"
                        value={studentInput}
                        onChange={e => setStudentInput(e.target.value)}
                      />
                    ) : (
                      <textarea 
                        placeholder="Cole a lista de nomes (um por linha)"
                        className="flex-1 border-2 border-gray-100 rounded-lg p-3 font-bold text-sm outline-none focus:border-blue-900 min-h-[100px]"
                        value={studentInput}
                        onChange={e => setStudentInput(e.target.value)}
                      />
                    )}
                    <button 
                      onClick={handleAddStudents}
                      className="bg-blue-900 hover:bg-black text-white px-8 py-3 rounded-lg font-black uppercase text-xs tracking-widest whitespace-nowrap"
                    >
                      Incluir Aluno(s)
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 pb-10">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Alunos Cadastrados ({selectedTurma.estudantes.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedTurma.estudantes.map(e => (
                      <div key={e.id} className="flex justify-between items-center p-4 bg-white border-2 border-gray-50 rounded-xl hover:border-blue-100 transition-all group">
                        <span className="text-sm font-bold text-gray-700 uppercase">{e.nome}</span>
                        <button 
                          onClick={() => removeStudent(e.id)}
                          className="text-gray-300 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <i className="fas fa-times-circle text-lg"></i>
                        </button>
                      </div>
                    ))}
                    {selectedTurma.estudantes.length === 0 && (
                      <div className="col-span-full py-10 text-center text-gray-300 italic text-sm">Nenhum aluno nesta turma.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TurmasTab;
