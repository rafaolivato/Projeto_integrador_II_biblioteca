import React, { useState, useEffect } from 'react';
import { alunosService } from '../../services/alunosService';
import './Alunos.css';
import { Link } from 'react-router-dom';

const ListaAlunos = ({ onEdit, onNew }) => {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const carregarAlunos = async () => {
    try {
      setLoading(true);
      const resultado = await alunosService.buscarTodosAlunos();
      
      console.log('Resultado:', resultado); // Para debug
      
      if (resultado.success) {
        // Garante que sempre seja um array
        setAlunos(Array.isArray(resultado.data) ? resultado.data : []);
        setError('');
      } else {
        setError(resultado.error);
        setAlunos([]); // Garante array vazio em caso de erro
      }
    } catch (err) {
      setError('Erro ao carregar alunos');
      setAlunos([]); // Garante array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja deletar o aluno ${nome}?`)) {
      const resultado = await alunosService.deletarAluno(id);
      
      if (resultado.success) {
        alert('Aluno deletado com sucesso!');
        carregarAlunos();
      } else {
        alert(`Erro ao deletar: ${resultado.error}`);
      }
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  if (loading) return <div className="loading">Carregando alunos...</div>;
  if (error) return <div className="error">Erro: {error}</div>;

  return (
    <div className="lista-alunos">
      <div className="header">
        <h2>Gestão de Alunos</h2>
        <div className="header-left">
          <Link to="/dashboard" className="btn-voltar">
            ← Voltar
          </Link>
        </div>
        <button onClick={onNew} className="btn-primary">
          + Novo Aluno
        </button>
      </div>

      <div className="alunos-grid">
        {!alunos || alunos.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum aluno cadastrado ainda.</p>
            <button onClick={onNew} className="btn-primary">
              Adicionar Primeiro Aluno
            </button>
          </div>
        ) : (
          alunos.map((aluno) => (
            <div key={aluno.id} className="aluno-card">
              <div className="aluno-header">
                <h3>{aluno.nome}</h3>
                <span className="matricula">{aluno.matricula}</span>
              </div>
              
              <div className="aluno-info">
                <p><strong>Turma:</strong> {aluno.turma}</p>
                <p><strong>Período:</strong> {aluno.periodo}</p>
              </div>

              <div className="aluno-actions">
                <button 
                  onClick={() => onEdit(aluno)}
                  className="btn-secondary"
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDeletar(aluno.id, aluno.nome)}
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

export default ListaAlunos;