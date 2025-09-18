import api from './api';

export const emprestimosService = {
  // Buscar todos os empréstimos
  buscarTodosEmprestimos: async () => {
    try {
      const response = await api.get('/emprestimos');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao buscar empréstimos' 
      };
    }
  },

  // Buscar empréstimo por ID
  buscarEmprestimoPorId: async (id) => {
    try {
      const response = await api.get(`/emprestimos/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao buscar empréstimo' 
      };
    }
  },

  // Criar novo empréstimo
  criarEmprestimo: async (emprestimoData) => {
    try {
      const response = await api.post('/emprestimos', emprestimoData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao criar empréstimo' 
      };
    }
  },

  // Devolver livro (atualizar empréstimo)
  devolverLivro: async (id) => {
    try {
      const response = await api.put(`/emprestimos/${id}/devolver`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao devolver livro' 
      };
    }
  },

  // Buscar empréstimos ativos
  buscarEmprestimosAtivos: async () => {
    try {
      const response = await api.get('/emprestimos?status=ativo');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao buscar empréstimos ativos' 
      };
    }
  },

  // Buscar empréstimos por aluno
  buscarEmprestimosPorAluno: async (alunoId) => {
    try {
      const response = await api.get(`/emprestimos/aluno/${alunoId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao buscar empréstimos do aluno' 
      };
    }
  }
};