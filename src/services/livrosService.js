import api from './api';

export const livrosService = {
  // Buscar todos os livros
  buscarTodosLivros: async () => {
    try {
      const response = await api.get('/livros');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao buscar livros' 
      };
    }
  },

  // Buscar livro por ID
  buscarLivroPorId: async (id) => {
    try {
      const response = await api.get(`/livros/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao buscar livro' 
      };
    }
  },

  // Criar novo livro
  criarLivro: async (livroData) => {
    try {
      const response = await api.post('/livros', livroData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao criar livro' 
      };
    }
  },

  // Atualizar livro
  atualizarLivro: async (id, livroData) => {
    try {
      const response = await api.put(`/livros/${id}`, livroData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao atualizar livro' 
      };
    }
  },

  // Deletar livro
  deletarLivro: async (id) => {
    try {
      await api.delete(`/livros/${id}`);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao deletar livro' 
      };
    }
  }
};