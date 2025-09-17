import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!credentials.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!credentials.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        const result = await login(credentials.email, credentials.password);
        
        if (result.success) {
          navigate('/dashboard');
        } else {
          setErrors({ submit: result.error });
        }
      } catch (error) {
        setErrors({ submit: 'Erro ao fazer login. Tente novamente.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h1 className="login-title">Biblioteca</h1>
        <p className="login-subtitle">Faça login para acessar sua conta</p>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            aria-describedby={errors.email ? 'emailError' : undefined}
            disabled={isLoading}
          />
          {errors.email && (
            <span id="emailError" className="error-message" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            aria-describedby={errors.password ? 'passwordError' : undefined}
            disabled={isLoading}
          />
          {errors.password && (
            <span id="passwordError" className="error-message" role="alert">
              {errors.password}
            </span>
          )}
        </div>

        {errors.submit && (
          <div className="error-message submit-error" role="alert">
            {errors.submit}
          </div>
        )}

        <button 
          type="submit" 
          className="login-button"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? 'Carregando...' : 'Entrar'}
        </button>

        <div className="login-links">
          <a href="#forgot" className="link">Esqueci minha senha</a>
          <Link to="/register" className="link">Criar uma conta</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;