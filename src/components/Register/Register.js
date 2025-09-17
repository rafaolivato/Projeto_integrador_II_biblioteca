import React, { useState } from 'react';
import { authService } from '../../services/authService';
import './Register.css';
import { useNavigate} from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!userData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!userData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (userData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (validateForm()) {
    setIsLoading(true);
    try {
      // Substitua a lógica do Firebase por:
      const result = await authService.register(userData);
      
      if (result.success) {
        setSuccess(true);
        setUserData({ email: '', password: '', confirmPassword: '' });
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setErrors({ submit: result.error });
      }
      
    } catch (error) {
      setErrors({ submit: 'Erro ao criar conta. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  }
};

  if (success) {
    return (
      <div className="register-container">
        <div className="register-success">
          <h2>Conta criada com sucesso!</h2>
          <p>Você já pode fazer login com seu email e senha.</p>
          <button onClick={() => setSuccess(false)}>Criar outra conta</button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <h1 className="register-title">Criar Conta</h1>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Senha</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Criando conta...' : 'Criar Conta'}
        </button>
      </form>
    </div>
  );
};

export default Register;