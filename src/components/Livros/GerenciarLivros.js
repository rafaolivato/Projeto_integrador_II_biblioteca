import React, { useState } from 'react';
import ListaLivros from './ListaLivros';
import FormLivro from './FormLivro';

const GerenciarLivros = () => {
  const [modo, setModo] = useState('lista'); // 'lista' ou 'form'
  const [livroEditando, setLivroEditando] = useState(null);

  const handleNovo = () => {
    setLivroEditando(null);
    setModo('form');
  };

  const handleEditar = (livro) => {
    setLivroEditando(livro);
    setModo('form');
  };

  const handleSalvar = () => {
    setModo('lista');
    setLivroEditando(null);
  };

  const handleCancelar = () => {
    setModo('lista');
    setLivroEditando(null);
  };

  return (
    <div>
      {modo === 'lista' ? (
        <ListaLivros onEdit={handleEditar} onNew={handleNovo} />
      ) : (
        <FormLivro 
          livro={livroEditando}
          onSave={handleSalvar}
          onCancel={handleCancelar}
        />
      )}
    </div>
  );
};

export default GerenciarLivros;