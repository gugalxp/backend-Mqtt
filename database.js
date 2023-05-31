const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'controleMqt',
    password: '12345',
    port: 5432, // Porta padrão do PostgreSQL
});

pool.connect((error, client, release) => {
    if (error) {
        console.error('Erro ao conectar com o banco de dados:', error);
        return;
    }
    console.log('Conexão estabelecida com sucesso!');
    release(); // Libera o cliente de volta para o pool de conexões
});