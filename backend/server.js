const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/livros', require('./src/routes/livros'));
app.use('/api/alunos', require('./src/routes/alunos'));
app.use('/api/emprestimos', require('./src/routes/emprestimos'));

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({ message: 'Servidor funcionando!', status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Rota padrão
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bem-vindo à API da Biblioteca!',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      livros: '/api/livros',
      alunos: '/api/alunos',
      emprestimos: '/api/emprestimos'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📚 API disponível em: http://localhost:${PORT}`);
});