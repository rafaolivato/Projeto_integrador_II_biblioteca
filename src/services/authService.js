export const authService = {
  login: async (email, password) => {
    try {
      // SIMULAÇÃO - substitua pela sua API real
      console.log('Tentando login com:', email, password);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulação de login bem-sucedido
      if (email === 'admin@escola.com' && password === 'senha123') {
        const user = { 
          id: 1, 
          email: email, 
          name: 'Administrador',
          role: 'admin'
        };
        const token = 'mock-token-' + Date.now();
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        console.log('Login bem-sucedido!');
        return { success: true, user };
      } else {
        console.log('Credenciais inválidas');
        return { success: false, error: 'Email ou senha incorretos' };
      }
      
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        error: 'Erro no login. Tente novamente.' 
      };
    }
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Erro ao recuperar usuário:', error);
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  // Método adicional para verificar se está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};