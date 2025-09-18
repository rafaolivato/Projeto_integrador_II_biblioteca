const express = require('express');
const router = express.Router();
const emprestimoController = require('../controllers/emprestimoController');

// Todas as rotas de empréstimos
router.get('/', emprestimoController.getAll);
router.get('/:id', emprestimoController.getById);
router.post('/', emprestimoController.create);
router.put('/:id/devolver', emprestimoController.devolver);
router.get('/aluno/:alunoId', emprestimoController.getByAluno);

module.exports = router;