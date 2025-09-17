import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import GerenciarLivros from './components/Livros/GerenciarLivros';

function App() {
  return (
    <Router>
      <div className="App" role="main">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
          path="/livros" 
            element={
              <ProtectedRoute>
                <GerenciarLivros />
              </ProtectedRoute>
            } 
          />

          {/* Adicione outras rotas aqui posteriormente */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;