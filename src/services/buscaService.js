import api from './api';

export const buscaService = {
  // Buscar livros com filtros
  buscarLivros: async (filtros = {}) => {
    try {
      const response = await api.get('/livros/busca', { params: filtros });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao buscar livros' 
      };
    }
  },

  // Buscar sugestões para autocomplete
  buscarSugestoes: async (termo) => {
    try {
      const response = await api.get('/livros/sugestoes', { 
        params: { termo } 
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao buscar sugestões' 
      };
    }
  },

  // Buscar livros por categoria (se tiver categorias)
  buscarPorCategoria: async (categoria) => {
    try {
      const response = await api.get('/livros/categoria', { 
        params: { categoria } 
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao buscar por categoria' 
      };
    }
  }
};