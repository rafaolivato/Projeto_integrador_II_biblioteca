import React, { useState, useEffect } from 'react';
import { livrosService } from '../../services/livrosService';
import './Livros.css';

const FormLivro = ({ livro, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    tombo: '',
    nome: '',
    quantidade: 1,
    autor: '',
    editora: '',
    ano: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (livro) {
      setFormData({
        tombo: livro.tombo || '',
        nome: livro.nome || '',
        quantidade: livro.quantidade || 1,
        autor: livro.autor || '',
        editora: livro.editora || '',
        ano: livro.ano || ''
      });
    }
  }, [livro]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tombo.trim()) {
      newErrors.tombo = 'Tombo é obrigatório';
    }

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome do livro é obrigatório';
    }

    if (!formData.quantidade || formData.quantidade < 0) {
      newErrors.quantidade = 'Quantidade deve ser maior ou igual a 0';
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
      
      if (livro) {
        // Editar livro existente
        resultado = await livrosService.atualizarLivro(livro.id, formData);
      } else {
        // Criar novo livro
        resultado = await livrosService.criarLivro(formData);
      }

      if (resultado.success) {
        alert(livro ? 'Livro atualizado com sucesso!' : 'Livro criado com sucesso!');
        onSave();
      } else {
        alert(`Erro: ${resultado.error}`);
      }
    } catch (error) {
      alert('Erro ao salvar livro');
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
    <div className="form-livro">
      <h2>{livro ? 'Editar Livro' : 'Novo Livro'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tombo">Tombo *</label>
          <input
            type="text"
            id="tombo"
            name="tombo"
            value={formData.tombo}
            onChange={handleChange}
            className={errors.tombo ? 'error' : ''}
            placeholder="Número de tombo do livro"
          />
          {errors.tombo && <span className="error-message">{errors.tombo}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="nome">Nome do Livro *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className={errors.nome ? 'error' : ''}
            placeholder="Título do livro"
          />
          {errors.nome && <span className="error-message">{errors.nome}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="quantidade">Quantidade *</label>
          <input
            type="number"
            id="quantidade"
            name="quantidade"
            value={formData.quantidade}
            onChange={handleChange}
            className={errors.quantidade ? 'error' : ''}
            min="0"
          />
          {errors.quantidade && <span className="error-message">{errors.quantidade}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="autor">Autor</label>
          <input
            type="text"
            id="autor"
            name="autor"
            value={formData.autor}
            onChange={handleChange}
            placeholder="Autor do livro (opcional)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="editora">Editora</label>
          <input
            type="text"
            id="editora"
            name="editora"
            value={formData.editora}
            onChange={handleChange}
            placeholder="Editora (opcional)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ano">Ano de Publicação</label>
          <input
            type="number"
            id="ano"
            name="ano"
            value={formData.ano}
            onChange={handleChange}
            placeholder="Ano (opcional)"
            min="1000"
            max={new Date().getFullYear()}
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Salvando...' : (livro ? 'Atualizar' : 'Criar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormLivro;