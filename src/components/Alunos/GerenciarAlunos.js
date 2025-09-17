import React, { useState } from 'react';
import ListaAlunos from './ListaAlunos';
import FormAluno from './FormAluno';
import './Alunos.css';

const GerenciarAlunos = () => {
  const [modo, setModo] = useState('lista'); // 'lista' ou 'form'
  const [alunoEditando, setAlunoEditando] = useState(null);

  const handleNovo = () => {
    setAlunoEditando(null);
    setModo('form');
  };

  const handleEditar = (aluno) => {
    setAlunoEditando(aluno);
    setModo('form');
  };

  const handleSalvar = () => {
    setModo('lista');
    setAlunoEditando(null);
  };

  const handleCancelar = () => {
    setModo('lista');
    setAlunoEditando(null);
  };

  return (
    <div className="gerenciar-alunos">
      {modo === 'lista' ? (
        <ListaAlunos onEdit={handleEditar} onNew={handleNovo} />
      ) : (
        <FormAluno 
          aluno={alunoEditando}
          onSave={handleSalvar}
          onCancel={handleCancelar}
        />
      )}
    </div>
  );
};

export default GerenciarAlunos;