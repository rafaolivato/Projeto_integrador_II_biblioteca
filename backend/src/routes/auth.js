const express = require('express');
const router = express.Router();

// Rota temporária - vamos implementar depois
router.post('/login', (req, res) => {
  res.json({ 
    message: 'API de auth funcionando!',
    token: 'mock-token',
    user: { id: 1, name: 'Admin', email: 'admin@escola.com' }
  });
});

module.exports = router;