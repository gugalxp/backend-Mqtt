const { Pool } = require('pg');
const express = require('express');
const router = express.Router();
router.use(express.json());
const mqtt = require('mqtt');
const mqttClient = mqtt.connect('mqtt://broker.emqx.io');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'controleMqt',
    password: '12345',
    port: 5432,
});

router.post('/send-command', (req, res) => {
    const topic = 'comandos';
    const command = req.body.command; // Supondo que o comando seja enviado no corpo da solicitação
    mqttClient.publish(topic, command);
  
    res.send('Comando MQTT enviado com sucesso!');
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


router.post('/testando', (req, res) => {
    const topic = 'comandos';
    const command = req.body.command; // Supondo que o comando seja enviado no corpo da solicitação

    // Verificação do comando e inclusão do payload completo
    if (command.manualMode.Enable === 0 || (command.manualMode.Enable === 1 && command.manualMode.scheduleStart && command.manualMode.scheduleStop && command.manualMode.Power)) {
        const payload = {
            manualMode: {
                Enable: command.manualMode.Enable,
                scheduleStart: command.manualMode.scheduleStart,
                scheduleStop: command.manualMode.scheduleStop,
                Power: command.manualMode.Power
            }
        };

        // Envio do comando via MQTT
        mqttClient.publish(topic, JSON.stringify(payload));
        res.json({ message: 'Comando MQTT enviado com sucesso!' });
    } else {
        res.status(400).json({ error: 'Comando inválido' });
    }
});

module.exports = router;
