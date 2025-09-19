import React, { useState, useEffect } from 'react';
import { buscaService } from '../../services/buscaService';
import { livrosService } from '../../services/livrosService';
import { Link } from 'react-router-dom';
import './BuscarLivros.css';

const BuscarLivros = () => {
  const [termoBusca, setTermoBusca] = useState('');
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [filtros, setFiltros] = useState({
    tipo: 'todos', // 'todos', 'titulo', 'autor', 'tombo'
    disponivel: false
  });

  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

  // Buscar livros
  const buscarLivros = async (e) => {
    if (e) e.preventDefault();
    
    if (!termoBusca.trim() && !filtros.disponivel) {
      setResultados([]);
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      const params = {};
      
      if (termoBusca.trim()) {
        if (filtros.tipo === 'todos') {
          params.termo = termoBusca;
        } else {
          params[filtros.tipo] = termoBusca;
        }
      }
      
      if (filtros.disponivel) {
        params.disponivel = true;
      }

      const resultado = await buscaService.buscarLivros(params);
      
      if (resultado.success) {
        setResultados(resultado.data);
      } else {
        setErro(resultado.error);
      }
    } catch (error) {
      setErro('Erro ao buscar livros');
    } finally {
      setCarregando(false);
      setMostrarSugestoes(false);
    }
  };

  // Buscar sugestões para autocomplete
  useEffect(() => {
    const buscarSugestoes = async () => {
      if (termoBusca.length > 2) {
        const resultado = await buscaService.buscarSugestoes(termoBusca);
        if (resultado.success) {
          setSugestoes(resultado.data);
          setMostrarSugestoes(true);
        }
      } else {
        setSugestoes([]);
        setMostrarSugestoes(false);
      }
    };

    const timeoutId = setTimeout(buscarSugestoes, 300);
    return () => clearTimeout(timeoutId);
  }, [termoBusca]);

  // Carregar todos os livros inicialmente
  useEffect(() => {
    const carregarTodosLivros = async () => {
      const resultado = await livrosService.buscarTodosLivros();
      if (resultado.success) {
        setResultados(resultado.data);
      }
    };
    
    carregarTodosLivros();
  }, []);

  const handleSugestaoClick = (sugestao) => {
    setTermoBusca(sugestao);
    setMostrarSugestoes(false);
    buscarLivros();
  };

  const limparBusca = () => {
    setTermoBusca('');
    setResultados([]);
    setErro('');
    setFiltros({ tipo: 'todos', disponivel: false });
  };

  return (
    <div className="buscar-livros">
      <div className="header">
        <div className="header-left">
          <Link to="/dashboard" className="btn-voltar">
            ← Voltar
          </Link>
          <h2>🔍 Buscar Livros</h2>
        </div>
      </div>

      {/* Formulário de Busca */}
      <div className="busca-container">
        <form onSubmit={buscarLivros} className="busca-form">
          <div className="busca-input-group">
            <div className="input-with-sugestoes">
              <input
                type="text"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                placeholder="Digite título, autor, tombo..."
                className="busca-input"
              />
              
              {mostrarSugestoes && sugestoes.length > 0 && (
                <div className="sugestoes-dropdown">
                  {sugestoes.map((sugestao, index) => (
                    <div
                      key={index}
                      className="sugestao-item"
                      onClick={() => handleSugestaoClick(sugestao)}
                    >
                      {sugestao}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button type="submit" className="btn-buscar" disabled={carregando}>
              {carregando ? 'Buscando...' : 'Buscar'}
            </button>
          </div>

          {/* Filtros */}
          <div className="filtros-group">
            <label className="filtro-label">
              <span>Buscar por:</span>
              <select
                value={filtros.tipo}
                onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                className="filtro-select"
              >
                <option value="todos">Tudo</option>
                <option value="titulo">Título</option>
                <option value="autor">Autor</option>
                <option value="tombo">Tombo</option>
              </select>
            </label>

            <label className="filtro-checkbox">
              <input
                type="checkbox"
                checked={filtros.disponivel}
                onChange={(e) => setFiltros({ ...filtros, disponivel: e.target.checked })}
              />
              <span>Mostrar apenas disponíveis</span>
            </label>

            {termoBusca && (
              <button type="button" onClick={limparBusca} className="btn-limpar">
                Limpar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Resultados */}
      <div className="resultados-container">
        {carregando && <div className="loading">Buscando livros...</div>}
        
        {erro && (
          <div className="error">
            {erro}
            <button onClick={limparBusca} className="btn-tentar-novamente">
              Tentar novamente
            </button>
          </div>
        )}

        {!carregando && !erro && resultados.length === 0 && termoBusca && (
          <div className="empty-state">
            <p>Nenhum livro encontrado para "{termoBusca}"</p>
            <button onClick={limparBusca} className="btn-primary">
              Ver todos os livros
            </button>
          </div>
        )}

        {!carregando && resultados.length > 0 && (
          <>
            <div className="resultados-info">
              <p>
                {resultados.length} livro(s) encontrado(s)
                {termoBusca && ` para "${termoBusca}"`}
                {filtros.disponivel && ' (apenas disponíveis)'}
              </p>
            </div>

            <div className="livros-grid">
              {resultados.map((livro) => (
                <div key={livro.id} className="livro-card">
                  <div className="livro-header">
                    <h3>{livro.nome}</h3>
                    <span className={`status ${livro.quantidade > 0 ? 'disponivel' : 'indisponivel'}`}>
                      {livro.quantidade > 0 ? 'Disponível' : 'Indisponível'}
                    </span>
                  </div>
                  
                  <div className="livro-info">
                    <p><strong>Tombo:</strong> {livro.tombo}</p>
                    <p><strong>Quantidade:</strong> {livro.quantidade}</p>
                    {livro.autor && <p><strong>Autor:</strong> {livro.autor}</p>}
                    {livro.editora && <p><strong>Editora:</strong> {livro.editora}</p>}
                    {livro.ano && <p><strong>Ano:</strong> {livro.ano}</p>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BuscarLivros;