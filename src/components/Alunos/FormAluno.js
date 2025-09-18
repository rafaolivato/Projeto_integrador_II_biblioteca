import React, { useState, useEffect } from 'react';
import { alunosService } from '../../services/alunosService';
import './Alunos.css';

const FormAluno = ({ aluno, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: '',
    matricula: '',
    turma: '',
    periodo: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (aluno) {
      setFormData({
        nome: aluno.nome || '',
        matricula: aluno.matricula || '',
        turma: aluno.turma || '',
        periodo: aluno.periodo || ''
      });
    }
  }, [aluno]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.matricula.trim()) {
      newErrors.matricula = 'Matrícula é obrigatória';
    }

    if (!formData.turma.trim()) {
      newErrors.turma = 'Turma é obrigatória';
    }

    if (!formData.periodo.trim()) {
      newErrors.periodo = 'Período é obrigatório';
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
      
      if (aluno) {
        // Editar aluno existente
        resultado = await alunosService.atualizarAluno(aluno.id, formData);
      } else {
        // Criar novo aluno
        resultado = await alunosService.criarAluno(formData);
      }

      if (resultado.success) {
        alert(aluno ? 'Aluno atualizado com sucesso!' : 'Aluno criado com sucesso!');
        onSave();
      } else {
        alert(`Erro: ${resultado.error}`);
      }
    } catch (error) {
      alert('Erro ao salvar aluno');
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

  return (
    <div className="form-aluno">
      <h2>{aluno ? 'Editar Aluno' : 'Novo Aluno'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className={errors.nome ? 'error' : ''}
            placeholder="Nome completo do aluno"
            disabled={loading}
          />
          {errors.nome && <span className="error-message">{errors.nome}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="matricula">Matrícula *</label>
          <input
            type="text"
            id="matricula"
            name="matricula"
            value={formData.matricula}
            onChange={handleChange}
            className={errors.matricula ? 'error' : ''}
            placeholder="Número de matrícula"
            disabled={loading}
          />
          {errors.matricula && <span className="error-message">{errors.matricula}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="turma">Turma *</label>
          <input
            type="text"
            id="turma"
            name="turma"
            value={formData.turma}
            onChange={handleChange}
            className={errors.turma ? 'error' : ''}
            placeholder="Ex: 8º A, 9º B"
            disabled={loading}
          />
          {errors.turma && <span className="error-message">{errors.turma}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="periodo">Período *</label>
          <select
            id="periodo"
            name="periodo"
            value={formData.periodo}
            onChange={handleChange}
            className={errors.periodo ? 'error' : ''}
            disabled={loading}
          >
            <option value="">Selecione o período</option>
            <option value="Manhã">Manhã</option>
            <option value="Tarde">Tarde</option>
            <option value="Noite">Noite</option>
            <option value="Integral">Integral</option>
          </select>
          {errors.periodo && <span className="error-message">{errors.periodo}</span>}
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
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Salvando...' : (aluno ? 'Atualizar' : 'Criar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormAluno;