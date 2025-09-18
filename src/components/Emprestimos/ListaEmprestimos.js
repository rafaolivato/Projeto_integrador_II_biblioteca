import React, { useState, useEffect } from 'react';
import { emprestimosService } from '../../services/emprestimosService';
import './Emprestimos.css';

const ListaEmprestimos = ({ onEdit, onNew }) => {
  const [emprestimos, setEmprestimos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const carregarEmprestimos = async () => {
    try {
      setLoading(true);
      let resultado;
      
      if (filtroStatus === 'todos') {
        resultado = await emprestimosService.buscarTodosEmprestimos();
      } else {
        resultado = await emprestimosService.buscarEmprestimosAtivos();
      }
      
      if (resultado.success) {
        setEmprestimos(Array.isArray(resultado.data) ? resultado.data : []);
        setError('');
      } else {
        setError(resultado.error);
      }
    } catch (err) {
      setError('Erro ao carregar empréstimos');
    } finally {
      setLoading(false);
    }
  };

  const handleDevolucao = async (id, livroNome) => {
    if (window.confirm(`Confirmar devolução do livro "${livroNome}"?`)) {
      const resultado = await emprestimosService.devolverLivro(id);
      
      if (resultado.success) {
        alert('Livro devolvido com sucesso!');
        carregarEmprestimos();
      } else {
        alert(`Erro ao devolver: ${resultado.error}`);
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ativo':
        return 'status-ativo';
      case 'finalizado':
        return 'status-finalizado';
      case 'atrasado':
        return 'status-atrasado';
      default:
        return '';
    }
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const calcularDiasRestantes = (dataDevolucao) => {
    const hoje = new Date();
    const devolucao = new Date(dataDevolucao);
    const diffTime = devolucao - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
  const carregarEmprestimos = async () => {
    try {
      setLoading(true);
      let resultado;
      
      if (filtroStatus === 'todos') {
        resultado = await emprestimosService.buscarTodosEmprestimos();
      } else {
        resultado = await emprestimosService.buscarEmprestimosAtivos();
      }
      
      if (resultado.success) {
        setEmprestimos(Array.isArray(resultado.data) ? resultado.data : []);
        setError('');
      } else {
        setError(resultado.error);
      }
    } catch (err) {
      setError('Erro ao carregar empréstimos');
    } finally {
      setLoading(false);
    }
  };

  carregarEmprestimos();
}, [filtroStatus]);

  return (
    <div className="lista-emprestimos">
      <div className="header">
        <h2>Controle de Empréstimos</h2>
        <div className="header-actions">
          <select 
            value={filtroStatus} 
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="filtro-select"
          >
            <option value="todos">Todos</option>
            <option value="ativo">Ativos</option>
            <option value="finalizado">Finalizados</option>
          </select>
          <button onClick={onNew} className="btn-primary">
            + Novo Empréstimo
          </button>
        </div>
      </div>

      <div className="emprestimos-grid">
        {emprestimos.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum empréstimo encontrado.</p>
            <button onClick={onNew} className="btn-primary">
              Fazer Primeiro Empréstimo
            </button>
          </div>
        ) : (
          emprestimos.map((emprestimo) => {
            const diasRestantes = calcularDiasRestantes(emprestimo.data_devolucao_prevista);
            const estaAtrasado = diasRestantes < 0 && emprestimo.status === 'ativo';
            
            return (
              <div key={emprestimo.id} className="emprestimo-card">
                <div className="emprestimo-header">
                  <h3>{emprestimo.livro_nome || `Livro #${emprestimo.livro_id}`}</h3>
                  <span className={`status ${getStatusStyle(emprestimo.status)}`}>
                    {estaAtrasado ? 'ATRASADO' : emprestimo.status?.toUpperCase()}
                  </span>
                </div>
                
                <div className="emprestimo-info">
                  <p><strong>Aluno:</strong> {emprestimo.aluno_nome || `Aluno #${emprestimo.aluno_id}`}</p>
                  <p><strong>Matrícula:</strong> {emprestimo.aluno_matricula || 'N/A'}</p>
                  <p><strong>Empréstimo:</strong> {formatarData(emprestimo.data_emprestimo)}</p>
                  <p><strong>Devolução prevista:</strong> {formatarData(emprestimo.data_devolucao_prevista)}</p>
                  
                  {emprestimo.data_devolucao_real && (
                    <p><strong>Devolvido em:</strong> {formatarData(emprestimo.data_devolucao_real)}</p>
                  )}
                  
                  {emprestimo.status === 'ativo' && (
                    <p className={estaAtrasado ? 'dias-atrasado' : 'dios-restantes'}>
                      <strong>{estaAtrasado ? 'Atrasado: ' : 'Dias restantes: '}</strong>
                      {Math.abs(diasRestantes)} {estaAtrasado ? 'dias' : 'dias'}
                    </p>
                  )}
                  
                  {emprestimo.observacoes && (
                    <p><strong>Observações:</strong> {emprestimo.observacoes}</p>
                  )}
                </div>

                <div className="emprestimo-actions">
                  {emprestimo.status === 'ativo' && (
                    <button 
                      onClick={() => handleDevolucao(emprestimo.id, emprestimo.livro_nome)}
                      className="btn-success"
                    >
                      Devolver
                    </button>
                  )}
                  
                  <button 
                    onClick={() => onEdit(emprestimo)}
                    className="btn-secondary"
                  >
                    Detalhes
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ListaEmprestimos;