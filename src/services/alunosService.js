import api from './api';

export const alunosService = {
  // Buscar todos os alunos
  buscarTodosAlunos: async () => {
    try {
      const response = await api.get('/alunos');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao buscar alunos' 
      };
    }
  },

  // Buscar aluno por ID
  buscarAlunoPorId: async (id) => {
    try {
      const response = await api.get(`/alunos/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao buscar aluno' 
      };
    }
  },

  // Criar novo aluno
  criarAluno: async (alunoData) => {
    try {
      const response = await api.post('/alunos', alunoData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao criar aluno' 
      };
    }
  },

  // Atualizar aluno
  atualizarAluno: async (id, alunoData) => {
    try {
      const response = await api.put(`/alunos/${id}`, alunoData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao atualizar aluno' 
      };
    }
  },

  // Deletar aluno
  deletarAluno: async (id) => {
    try {
      await api.delete(`/alunos/${id}`);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao deletar aluno' 
      };
    }
  },

  // Importar alunos de planilha (para depois)
  importarAlunos: async (fileData) => {
    try {
      const response = await api.post('/alunos/importar', fileData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao importar alunos' 
      };
    }
  }
};