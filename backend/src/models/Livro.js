const pool = require('../config/database');

const Livro = {
  // Buscar todos os livros
  async findAll() {
    const result = await pool.query(
      'SELECT * FROM livros ORDER BY criado_em DESC'
    );
    return result.rows;
  },

  // Buscar por ID
  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM livros WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // Criar novo livro
  async create(livroData) {
    const { tombo, nome, quantidade, autor, editora, ano } = livroData;
    const result = await pool.query(
      `INSERT INTO livros (tombo, nome, quantidade, autor, editora, ano) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [tombo, nome, quantidade, autor, editora, ano]
    );
    return result.rows[0];
  },

  // Atualizar livro
  async update(id, livroData) {
    const { tombo, nome, quantidade, autor, editora, ano } = livroData;
    const result = await pool.query(
      `UPDATE livros 
       SET tombo = $1, nome = $2, quantidade = $3, autor = $4, editora = $5, ano = $6, atualizado_em = NOW() 
       WHERE id = $7 
       RETURNING *`,
      [tombo, nome, quantidade, autor, editora, ano, id]
    );
    return result.rows[0];
  },

  // Deletar livro
  async delete(id) {
    const result = await pool.query(
      'DELETE FROM livros WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
};

module.exports = Livro;