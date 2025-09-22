import React, { useState, useEffect } from 'react';
import { alunosService } from '../../services/alunosService';
import { Link } from 'react-router-dom';
import ImportarAlunos from './ImportarAlunos'; // ← Adicione este import
import './Alunos.css';

const ListaAlunos = ({ onEdit, onNew }) => {
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [mostrarImportar, setMostrarImportar] = useState(false); // ← Estado para controlar o modal

  const carregarAlunos = async () => {
    try {
      setCarregando(true);
      const resultado = await alunosService.buscarTodosAlunos();
      
      console.log('Resultado:', resultado);
      
      if (resultado.success) {
        setAlunos(Array.isArray(resultado.data) ? resultado.data : []);
        setErro('');
      } else {
        setErro(resultado.error);
        setAlunos([]);
      }
    } catch (err) {
      setErro('Erro ao carregar alunos');
      setAlunos([]);
    } finally {
      setCarregando(false);
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

  // Função chamada quando a importação é bem-sucedida
  const handleImportacaoSucesso = () => {
    carregarAlunos(); // Recarrega a lista de alunos
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  if (carregando) return <div className="loading">Carregando alunos...</div>;
  if (erro) return <div className="error">Erro: {erro}</div>;

  return (
    <div className="lista-alunos">
      <div className="header">
        <div className="header-left">
          <Link to="/dashboard" className="btn-voltar">
            ← Voltar
          </Link>
          <h2>Gestão de Alunos</h2>
        </div>
        
        <div className="header-actions">
          {/* Botão para abrir o modal de importação */}
          <button 
            onClick={() => setMostrarImportar(true)} 
            className="btn-importar"
          >
            📊 Importar Excel
          </button>
          
          <button onClick={onNew} className="btn-primary">
            + Novo Aluno
          </button>
        </div>
      </div>

      {/* Modal de importação */}
      {mostrarImportar && (
        <ImportarAlunos 
          onClose={() => setMostrarImportar(false)}
          onImportSuccess={handleImportacaoSucesso}
        />
      )}

      <div className="alunos-grid">
        {alunos.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum aluno cadastrado ainda.</p>
            <div className="empty-state-actions">
              <button onClick={onNew} className="btn-primary">
                Adicionar Primeiro Aluno
              </button>
              <button 
                onClick={() => setMostrarImportar(true)} 
                className="btn-importar"
              >
                📊 Importar de Planilha
              </button>
            </div>
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

      {/* Estatísticas rápidas */}
      {alunos.length > 0 && (
        <div className="estatisticas">
          <div className="estatistica-item">
            <span className="numero">{alunos.length}</span>
            <span className="label">Total de Alunos</span>
          </div>
          
          <div className="estatistica-item">
            <span className="numero">
              {[...new Set(alunos.map(a => a.turma))].length}
            </span>
            <span className="label">Turmas Diferentes</span>
          </div>
          
          <div className="estatistica-item">
            <span className="numero">
              {[...new Set(alunos.map(a => a.periodo))].length}
            </span>
            <span className="label">Períodos</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaAlunos;