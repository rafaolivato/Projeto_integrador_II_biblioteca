const pool = require('../config/database');

const alunoController = {
  async getAll(req, res) {
    try {
      const result = await pool.query('SELECT * FROM alunos ORDER BY nome');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const result = await pool.query('SELECT * FROM alunos WHERE id = $1', [req.params.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { nome, matricula, turma, periodo } = req.body;
      
      const result = await pool.query(
        `INSERT INTO alunos (nome, matricula, turma, periodo) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [nome, matricula, turma, periodo]
      );
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      if (error.code === '23505') { // Violação de unique constraint
        res.status(400).json({ error: 'Matrícula já existe' });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  },

  async update(req, res) {
    try {
      const { nome, matricula, turma, periodo } = req.body;
      const { id } = req.params;
      
      const result = await pool.query(
        `UPDATE alunos 
         SET nome = $1, matricula = $2, turma = $3, periodo = $4 
         WHERE id = $5 
         RETURNING *`,
        [nome, matricula, turma, periodo, id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const result = await pool.query(
        'DELETE FROM alunos WHERE id = $1 RETURNING *',
        [req.params.id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      
      res.json({ message: 'Aluno deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = alunoController;