const Livro = require('../models/Livro');

const livroController = {
  // Get all books
  async getAll(req, res) {
    try {
      const livros = await Livro.findAll();
      res.json(livros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get book by ID
  async getById(req, res) {
    try {
      const livro = await Livro.findById(req.params.id);
      if (!livro) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      res.json(livro);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create new book
  async create(req, res) {
    try {
      const novoLivro = await Livro.create(req.body);
      res.status(201).json(novoLivro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update book
  async update(req, res) {
    try {
      const livroAtualizado = await Livro.update(req.params.id, req.body);
      if (!livroAtualizado) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      res.json(livroAtualizado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete book
  async delete(req, res) {
    try {
      const livroDeletado = await Livro.delete(req.params.id);
      if (!livroDeletado) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      res.json({ message: 'Livro deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = livroController;