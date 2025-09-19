const express = require('express');
const router = express.Router();
const livroController = require('../controllers/livroController');
const pool = require('../config/database'); //

// Rota de busca
router.get('/busca', async (req, res) => {
  try {
    const { termo, titulo, autor, tombo, disponivel } = req.query;
    
    let query = `
      SELECT * FROM livros 
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (termo) {
      paramCount++;
      query += ` AND (nome ILIKE $${paramCount} OR autor ILIKE $${paramCount} OR tombo ILIKE $${paramCount})`;
      params.push(`%${termo}%`);
    }

    if (titulo) {
      paramCount++;
      query += ` AND nome ILIKE $${paramCount}`;
      params.push(`%${titulo}%`);
    }

    if (autor) {
      paramCount++;
      query += ` AND autor ILIKE $${paramCount}`;
      params.push(`%${autor}%`);
    }

    if (tombo) {
      paramCount++;
      query += ` AND tombo ILIKE $${paramCount}`;
      params.push(`%${tombo}%`);
    }

    if (disponivel === 'true') {
      query += ` AND quantidade > 0`;
    }

    query += ' ORDER BY nome';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// Mantenha as rotas existentes
router.get('/', livroController.getAll);
router.get('/:id', livroController.getById);
router.post('/', livroController.create);
router.put('/:id', livroController.update);
router.delete('/:id', livroController.delete);

module.exports = router;