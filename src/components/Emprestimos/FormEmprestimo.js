import React, { useState, useEffect } from 'react';
import { emprestimosService } from '../../services/emprestimosService';
import { livrosService } from '../../services/livrosService';
import { alunosService } from '../../services/alunosService';
import './Emprestimos.css';

const FormEmprestimo = ({ emprestimo, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    livro_id: '',
    aluno_id: '',
    data_devolucao_prevista: '',
    observacoes: ''
  });

  const [alunos, setAlunos] = useState([]);
  const [livrosDisponiveis, setLivrosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [carregandoDados, setCarregandoDados] = useState(true);

  // Carregar livros e alunos disponíveis
  useEffect(() => {
  const carregarDados = async () => {
    try {
      setCarregandoDados(true);
      
      // Carregar livros
      const resultadoLivros = await livrosService.buscarTodosLivros();
      if (resultadoLivros.success) {
        // Apenas armazenar livros disponíveis
        const disponiveis = resultadoLivros.data.filter(livro => livro.quantidade > 0);
        setLivrosDisponiveis(disponiveis);
      }
      
      // Carregar alunos
      const resultadoAlunos = await alunosService.buscarTodosAlunos();
      if (resultadoAlunos.success) {
        setAlunos(resultadoAlunos.data);
      }
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setCarregandoDados(false);
    }
  };
  
  carregarDados();
}, []);

  // Preencher formulário se estiver editando
  useEffect(() => {
    if (emprestimo) {
      setFormData({
        livro_id: emprestimo.livro_id || '',
        aluno_id: emprestimo.aluno_id || '',
        data_devolucao_prevista: emprestimo.data_devolucao_prevista || '',
        observacoes: emprestimo.observacoes || ''
      });
    }
  }, [emprestimo]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.livro_id) {
      newErrors.livro_id = 'Selecione um livro';
    }

    if (!formData.aluno_id) {
      newErrors.aluno_id = 'Selecione um aluno';
    }

    if (!formData.data_devolucao_prevista) {
      newErrors.data_devolucao_prevista = 'Data de devolução é obrigatória';
    } else {
      const dataDevolucao = new Date(formData.data_devolucao_prevista);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      if (dataDevolucao <= hoje) {
        newErrors.data_devolucao_prevista = 'Data deve ser futura';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      let resultado;
      
      if (emprestimo) {
        // Editar empréstimo existente
        resultado = await emprestimosService.atualizarEmprestimo(emprestimo.id, formData);
      } else {
        // Criar novo empréstimo
        resultado = await emprestimosService.criarEmprestimo(formData);
      }

      if (resultado.success) {
        alert(emprestimo ? 'Empréstimo atualizado com sucesso!' : 'Empréstimo criado com sucesso!');
        onSave();
      } else {
        alert(`Erro: ${resultado.error}`);
      }
    } catch (error) {
      alert('Erro ao salvar empréstimo');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Calcular data de devolução padrão (7 dias a partir de hoje)
  const getDataDevolucaoPadrao = () => {
    const data = new Date();
    data.setDate(data.getDate() + 7);
    return data.toISOString().split('T')[0];
  };

  if (carregandoDados) {
    return <div className="loading">Carregando dados...</div>;
  }

  return (
    <div className="form-emprestimo">
      <h2>{emprestimo ? 'Editar Empréstimo' : 'Novo Empréstimo'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="aluno_id">Aluno *</label>
          <select
            id="aluno_id"
            name="aluno_id"
            value={formData.aluno_id}
            onChange={handleChange}
            className={errors.aluno_id ? 'error' : ''}
            disabled={loading}
          >
            <option value="">Selecione um aluno</option>
            {alunos.map(aluno => (
              <option key={aluno.id} value={aluno.id}>
                {aluno.nome} - {aluno.matricula} ({aluno.turma})
              </option>
            ))}
          </select>
          {errors.aluno_id && <span className="error-message">{errors.aluno_id}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="livro_id">Livro *</label>
          <select
            id="livro_id"
            name="livro_id"
            value={formData.livro_id}
            onChange={handleChange}
            className={errors.livro_id ? 'error' : ''}
            disabled={loading || livrosDisponiveis.length === 0}
          >
            <option value="">Selecione um livro</option>
            {livrosDisponiveis.map(livro => (
              <option key={livro.id} value={livro.id}>
                {livro.nome} - {livro.tombo} ({livro.quantidade} disponíveis)
              </option>
            ))}
          </select>
          {errors.livro_id && <span className="error-message">{errors.livro_id}</span>}
          {livrosDisponiveis.length === 0 && (
            <span className="error-message">Nenhum livro disponível para empréstimo</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="data_devolucao_prevista">Data de Devolução Prevista *</label>
          <input
            type="date"
            id="data_devolucao_prevista"
            name="data_devolucao_prevista"
            value={formData.data_devolucao_prevista}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className={errors.data_devolucao_prevista ? 'error' : ''}
            disabled={loading}
            placeholder={getDataDevolucaoPadrao()}
          />
          {errors.data_devolucao_prevista && (
            <span className="error-message">{errors.data_devolucao_prevista}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="observacoes">Observações</label>
          <textarea
            id="observacoes"
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            rows="3"
            disabled={loading}
            placeholder="Observações sobre o empréstimo (opcional)"
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading || livrosDisponiveis.length === 0}
            className="btn-primary"
          >
            {loading ? 'Salvando...' : (emprestimo ? 'Atualizar' : 'Criar Empréstimo')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormEmprestimo;