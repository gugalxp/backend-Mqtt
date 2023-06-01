const express = require('express');
const app = express();
const apiRoutes = require('./apiRoutes');

// Configuração do servidor
const port = 3333;

// Registra as rotas
app.use('/', apiRoutes);

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
