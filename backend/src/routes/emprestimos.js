const express = require('express');
const router = express.Router();

// Rota temporária - vamos implementar depois
router.get('/', (req, res) => {
  res.json({ message: 'API de empréstimos funcionando!' });
});

module.exports = router;