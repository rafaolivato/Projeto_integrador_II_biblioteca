export const authService = {
  login: async (email, password) => {
    try {
      // SIMULAÇÃO - substitua pela sua API real
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
        
        return { success: true, user };
      } else {
        return { success: false, error: 'Email ou senha incorretos' };
      }
      
    } catch (error) {
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

  register: async (userData) => {
    try {
      // SIMULAÇÃO - substitua pela sua API real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { email } = userData;
      
      // Verifica se o email já existe (simulação)
      if (email === 'admin@escola.com') {
        return { 
          success: false, 
          error: 'Este email já está em uso' 
        };
      }
      
      // Simulação de registro bem-sucedido
      const user = { 
        id: Date.now(), 
        email: email, 
        name: 'Novo Usuário',
        role: 'user'
      };
      
      const token = 'mock-token-register-' + Date.now();
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('Usuário registrado com sucesso!');
      return { success: true, user };
      
    } catch (error) {
      return { 
        success: false, 
        error: 'Erro no registro. Tente novamente.' 
      };
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};