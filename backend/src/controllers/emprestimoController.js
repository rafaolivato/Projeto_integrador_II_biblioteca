const pool = require('../config/database');

const emprestimoController = {
  async getAll(req, res) {
    try {
      const { status } = req.query;
      let query = `
        SELECT e.*, 
               l.nome as livro_nome, l.tombo as livro_tombo,
               a.nome as aluno_nome, a.matricula as aluno_matricula,
               u.nome as usuario_nome
        FROM emprestimos e
        LEFT JOIN livros l ON e.livro_id = l.id
        LEFT JOIN alunos a ON e.aluno_id = a.id
        LEFT JOIN usuarios u ON e.usuario_id = u.id
      `;
      
      const params = [];
      if (status) {
        query += ' WHERE e.status = $1';
        params.push(status);
      }
      
      query += ' ORDER BY e.data_emprestimo DESC';
      
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const result = await pool.query(
        `SELECT e.*, 
                l.nome as livro_nome, l.tombo as livro_tombo,
                a.nome as aluno_nome, a.matricula as aluno_matricula,
                u.nome as usuario_nome
         FROM emprestimos e
         LEFT JOIN livros l ON e.livro_id = l.id
         LEFT JOIN alunos a ON e.aluno_id = a.id
         LEFT JOIN usuarios u ON e.usuario_id = u.id
         WHERE e.id = $1`,
        [req.params.id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Empréstimo não encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const { livro_id, aluno_id, data_devolucao_prevista, observacoes } = req.body;
      
      // 1. Verifica se o livro está disponível
      const livroResult = await client.query(
        'SELECT quantidade FROM livros WHERE id = $1',
        [livro_id]
      );
      
      if (livroResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      
      if (livroResult.rows[0].quantidade < 1) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Livro não disponível para empréstimo' });
      }
      
      // 2. Cria o empréstimo
      const emprestimoResult = await client.query(
        `INSERT INTO emprestimos 
         (livro_id, aluno_id, data_devolucao_prevista, observacoes) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [livro_id, aluno_id, data_devolucao_prevista, observacoes]
      );
      
      // 3. Atualiza a quantidade do livro
      await client.query(
        'UPDATE livros SET quantidade = quantidade - 1 WHERE id = $1',
        [livro_id]
      );
      
      await client.query('COMMIT');
      
      res.status(201).json(emprestimoResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      res.status(400).json({ error: error.message });
    } finally {
      client.release();
    }
  },

  async devolver(req, res) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const { id } = req.params;
      
      // 1. Busca o empréstimo
      const emprestimoResult = await client.query(
        'SELECT * FROM emprestimos WHERE id = $1',
        [id]
      );
      
      if (emprestimoResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Empréstimo não encontrado' });
      }
      
      const emprestimo = emprestimoResult.rows[0];
      
      // 2. Atualiza o empréstimo
      const updateResult = await client.query(
        `UPDATE emprestimos 
         SET data_devolucao_real = CURRENT_DATE, status = 'finalizado'
         WHERE id = $1 
         RETURNING *`,
        [id]
      );
      
      // 3. Devolve o livro ao acervo
      await client.query(
        'UPDATE livros SET quantidade = quantidade + 1 WHERE id = $1',
        [emprestimo.livro_id]
      );
      
      await client.query('COMMIT');
      
      res.json(updateResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      res.status(400).json({ error: error.message });
    } finally {
      client.release();
    }
  },

  async getByAluno(req, res) {
    try {
      const result = await pool.query(
        `SELECT e.*, l.nome as livro_nome, l.tombo as livro_tombo
         FROM emprestimos e
         LEFT JOIN livros l ON e.livro_id = l.id
         WHERE e.aluno_id = $1
         ORDER BY e.data_emprestimo DESC`,
        [req.params.alunoId]
      );
      
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = emprestimoController;