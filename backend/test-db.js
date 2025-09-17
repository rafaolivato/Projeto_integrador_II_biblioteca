require('dotenv').config();
const pool = require('./src/config/database');

async function testDatabase() {
  try {
    console.log('🧪 Testando conexão com o PostgreSQL...');
    
    // Testar conexão
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('✅ Conexão bem-sucedida!');
    console.log('⏰ Hora do servidor:', result.rows[0].current_time);
    
    // Testar tabelas
    const livros = await pool.query('SELECT COUNT(*) as total FROM livros');
    const alunos = await pool.query('SELECT COUNT(*) as total FROM alunos');
    const usuarios = await pool.query('SELECT COUNT(*) as total FROM usuarios');
    
    console.log(`📚 Livros: ${livros.rows[0].total}`);
    console.log(`👥 Alunos: ${alunos.rows[0].total}`);
    console.log(`👤 Usuários: ${usuarios.rows[0].total}`);
    
    // Testar inserção
    const novoLivro = await pool.query(
      'INSERT INTO livros (tombo, nome, quantidade) VALUES ($1, $2, $3) RETURNING *',
      ['TOMBO-TEST', 'Livro de Teste', 1]
    );
    
    console.log('✅ Inserção testada:', novoLivro.rows[0].nome);
    
    // Limpar teste
    await pool.query('DELETE FROM livros WHERE tombo = $1', ['TOMBO-TEST']);
    
    console.log('🎉 Todos os testes passaram! O banco está pronto.');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    process.exit();
  }
}

testDatabase();