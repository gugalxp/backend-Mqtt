const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'controleMqt',
    password: '12345',
    port: 5432,
});

//*------------- LISTAGEM POR FILTRO -------------*//

// Rota para obter as informações do último payload BESS filter
router.get('/BESSFILTER', (req, res) => {
    const param = req.query.param; // Tipo de informação (COV, CLV, Tmax, Tmin, etc.)
    const limit = parseInt(req.query.limit); // Quantidade de informações a serem retornadas

    // Consulta SQL para recuperar as informações do banco de dados ordenadas por data/hora decrescente
    const query = `SELECT ${param} FROM bess_data ORDER BY timestamp DESC LIMIT $1`;

    // Executa a consulta SQL com o parâmetro de limite
    pool.query(query, [limit], (error, results) => {
        if (error) {
            console.error('Erro ao executar consulta SQL:', error.database, error.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
        } else {
            // Retorna apenas as informações solicitadas (param) em formato JSON

            res.json(results.rows.map((result, i) => {
                return result;
            }));
        }
    });
});

// Rota para obter as informações do último payload PCS filter
router.get('/PCSFILTER', (req, res) => {
    const param = req.query.param;
    const limit = parseInt(req.query.limit); // Quantidade de informações a serem retornadas

    // Consulta SQL para recuperar as informações do banco de dados ordenadas por data/hora decrescente
    const query = `SELECT ${param} FROM pcs_data ORDER BY timestamp DESC LIMIT $1`;

    // Executa a consulta SQL com o parâmetro de limite
    pool.query(query, [limit], (error, results) => {
        if (error) {
            console.error('Erro ao executar consulta SQL:', error.database, error.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
        } else {
            // Retorna apenas as informações solicitadas (param) em formato JSON

            res.json(results.rows.map((result, i) => {
                return result;
            }));
        }
    });
});


// Rota para obter as informações do último payload METER filter
router.get('/METERFILTER', (req, res) => {
    const param = req.query.param;
    const limit = parseInt(req.query.limit); // Quantidade de informações a serem retornadas

    // Consulta SQL para recuperar as informações do banco de dados ordenadas por data/hora decrescente
    const query = `SELECT ${param} FROM meter_data ORDER BY timestamp DESC LIMIT $1`;

    // Executa a consulta SQL com o parâmetro de limite
    pool.query(query, [limit], (error, results) => {
        if (error) {
            console.error('Erro ao executar consulta SQL:', error.database, error.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
        } else {
            // Retorna apenas as informações solicitadas (param) em formato JSON

            res.json(results.rows.map((result, i) => {
                return result;
            }));
        }
    });
});


//*------------- LISTAGEM SEM FILTRO -------------*//

router.get('/METER', (req, res) => {

    const query = `SELECT * FROM meter_data`;

    pool.query(query, (error, results) => {
        if (error) {
            console.error('Erro ao executar consulta SQL:', error.database, error.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
        } else {

            res.json(results.rows.map((result, i) => {
                return result;
            }));
        }
    });
});

router.get('/PCS', (req, res) => {

    const query = `SELECT * FROM pcs_data`;

    pool.query(query, (error, results) => {
        if (error) {
            console.error('Erro ao executar consulta SQL:', error.database, error.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
        } else {

            res.json(results.rows.map((result, i) => {
                return result;
            }));
        }
    });
});

// Rota para obter as informações do último payload BESS filter
router.get('/BESS', (req, res) => {
    // Consulta SQL para recuperar as informações do banco de dados ordenadas por data/hora decrescente
    const query = `SELECT * FROM bess_data`;

    // Executa a consulta SQL com o parâmetro de limite
    pool.query(query, (error, results) => {
        if (error) {
            console.error('Erro ao executar consulta SQL:', error.database, error.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
        } else {
            // Retorna apenas as informações solicitadas (param) em formato JSON

            res.json(results.rows.map((result, i) => {
                return result;
            }));
        }
    });
});


// Rota para enviar comandos via MQTT
router.post('/sendCommand', (req, res) => {
    const command = req.body; // Comando recebido do browser

    // Validação do comando (Enable, scheduleStart, scheduleStop, Power)
    if (command.manualMode.Enable === 0 || (command.manualMode.Enable === 1 && command.manualMode.scheduleStart && command.manualMode.scheduleStop && command.manualMode.Power)) {
        // Lógica para enviar o comando via MQTT
        // ...

        res.json({ message: 'Comando enviado com sucesso' });
    } else {
        res.status(400).json({ error: 'Comando inválido' });
    }
});

module.exports = router;
