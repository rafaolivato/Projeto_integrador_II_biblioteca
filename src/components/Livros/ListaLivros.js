import React, { useState, useEffect } from 'react';
import { livrosService } from '../../services/livrosService';
import './Livros.css';
import { Link } from 'react-router-dom';

const ListaLivros = ({ onEdit, onNew }) => {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const carregarLivros = async () => {
    try {
      setLoading(true);
      const resultado = await livrosService.buscarTodosLivros();

      if (resultado.success) {
        setLivros(resultado.data);
        setError('');
      } else {
        setError(resultado.error);
      }
    } catch (err) {
      setError('Erro ao carregar livros');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (id, tombo) => {
    if (window.confirm(`Tem certeza que deseja deletar o livro de tombo ${tombo}?`)) {
      const resultado = await livrosService.deletarLivro(id);

      if (resultado.success) {
        alert('Livro deletado com sucesso!');
        carregarLivros();
      } else {
        alert(`Erro ao deletar: ${resultado.error}`);
      }
    }
  };

  useEffect(() => {
    carregarLivros();
  }, []);

  if (loading) return <div className="loading">Carregando livros...</div>;
  if (error) return <div className="error">Erro: {error}</div>;

  return (
    <div className="lista-livros">
      <div className="header">


        <h2>Acervo de Livros</h2>
        <div className="header-left">
          <Link to="/dashboard" className="btn-voltar">
            ← Voltar
          </Link>
        </div>
        <button onClick={onNew} className="btn-primary">
          + Novo Livro
        </button>
      </div>

      <div className="livros-grid">
        {livros.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum livro cadastrado ainda.</p>
            <button onClick={onNew} className="btn-primary">
              Adicionar Primeiro Livro
            </button>
          </div>
        ) : (
          livros.map((livro) => (
            <div key={livro.id} className="livro-card">
              <div className="livro-header">
                <h3>{livro.nome}</h3>
                <span className={`status ${livro.quantidade > 0 ? 'disponivel' : 'indisponivel'}`}>
                  {livro.quantidade > 0 ? 'Disponível' : 'Indisponível'}
                </span>
              </div>

              <div className="livro-info">
                <p><strong>Tombo:</strong> {livro.tombo}</p>
                <p><strong>Quantidade:</strong> {livro.quantidade} unidade(s)</p>
                {livro.autor && <p><strong>Autor:</strong> {livro.autor}</p>}
                {livro.editora && <p><strong>Editora:</strong> {livro.editora}</p>}
                {livro.ano && <p><strong>Ano:</strong> {livro.ano}</p>}
              </div>

              <div className="livro-actions">
                <button
                  onClick={() => onEdit(livro)}
                  className="btn-secondary"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeletar(livro.id, livro.tombo)}
                  className="btn-danger"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListaLivros;