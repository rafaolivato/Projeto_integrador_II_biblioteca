import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import './Dashboard.css';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Biblioteca Digital</h1>
        <image src="/logo192.png" alt="Logo" className="logo" />
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
            <button className="feature-btn">Acessar</button>
          </div>
          </Link>

          <div className="feature-card">
            <h3>🔍 Buscar Livros</h3>
            <p>Encontre novos livros para adicionar à sua coleção</p>
            <button className="feature-btn">Buscar</button>
          </div>

          <div className="feature-card">
            <h3>📊 Estatísticas</h3>
            <p>Veja analytics sobre sua biblioteca</p>
            <button className="feature-btn">Visualizar</button>
          </div>

          <div className="feature-card">
            <h3>⚙️ Configurações</h3>
            <p>Personalize sua experiência</p>
            <button className="feature-btn">Configurar</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;