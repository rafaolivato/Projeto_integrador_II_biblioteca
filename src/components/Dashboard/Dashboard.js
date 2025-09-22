import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import './Dashboard.css';
import { Link } from 'react-router-dom';


const Dashboard = () => {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      authService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo-container">
          <img src="/images/logo.jpg" alt="Logo Biblioteca" className="logo" />
          <h1>Biblioteca</h1>
        </div>
        <div className="user-info">
          <span>Olá, {currentUser?.email}</span>
          <button onClick={handleLogout} className="logout-btn">
            Sair
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Bem-vindo à sua biblioteca</h2>
          <p>Gerencie seu acervo digital de forma simples e eficiente</p>
        </div>

        <div className="features-grid">
          <Link to="/livros" className="feature-card-link">
            <div className="feature-card">
              <h3>📚 Meus Livros</h3>
              <p>Visualize e gerencie todos os livros da sua coleção</p>
              <div className="feature-btn">Acessar</div>
            </div>
          </Link>

          <Link to="/alunos" className="feature-card-link">
            <div className="feature-card">
              <h3>👥 Alunos</h3>
              <p>Cadastre e gerencie os alunos da escola</p>
              <div className="feature-btn">Gerenciar</div>
            </div>
          </Link>

          <Link to="/emprestimos" className="feature-card-link">
            <div className="feature-card">
              <h3>🔄 Empréstimos</h3>
              <p>Controle os empréstimos de livros</p>
              <div className="feature-btn">Controlar</div>
            </div>
          </Link>

          <Link to="/buscar" className="feature-card-link">
            <div className="feature-card">
              <h3>🔍 Buscar Livros</h3>
              <p>Encontre livros no acervo</p>
              <div className="feature-btn">Buscar</div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;