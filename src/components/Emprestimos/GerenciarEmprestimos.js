import React, { useState } from 'react';
import ListaEmprestimos from './ListaEmprestimos';
import FormEmprestimo from './FormEmprestimo';
import './Emprestimos.css';


const GerenciarEmprestimos = () => {
  const [modo, setModo] = useState('lista'); // 'lista' ou 'form'
  const [emprestimoEditando, setEmprestimoEditando] = useState(null);

  const handleNovo = () => {
    setEmprestimoEditando(null);
    setModo('form');
  };

  const handleEditar = (emprestimo) => {
    setEmprestimoEditando(emprestimo);
    setModo('form');
  };

  const handleSalvar = () => {
    setModo('lista');
    setEmprestimoEditando(null);
  };

  const handleCancelar = () => {
    setModo('lista');
    setEmprestimoEditando(null);
  };

  return (
    <div className="gerenciar-emprestimos">
      {modo === 'lista' ? (
        <ListaEmprestimos onEdit={handleEditar} onNew={handleNovo} />
      ) : (
        <FormEmprestimo 
          emprestimo={emprestimoEditando}
          onSave={handleSalvar}
          onCancel={handleCancelar}
        />
      )}
    </div>
  );
};

export default GerenciarEmprestimos;