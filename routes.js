const pool = require('./src/config/database');
const express = require('express');
const router = express.Router();
router.use(express.json());
const mqtt = require('mqtt');
const mqttClient = mqtt.connect('mqtt://broker.emqx.io');


//*------------- LISTAGEM POR FILTRO -------------*//


router.get('/BESSFILTER', (req, res) => {
    const param = req.query.param;
    const limit = parseInt(req.query.limit);

    const query = `SELECT ${param} FROM bess_data ORDER BY timestamp DESC LIMIT $1`;

    try {
        pool.query(query, [limit], (error, results) => {
            if (error) {
                console.error('Erro ao executar consulta SQL:', error.database, error.message);
                res.status(500).json({ error: 'Erro interno do servidor' });
            } else {
                res.json(results.rows.map((result, i) => {
                    return result;
                }));
            }
        });
    } catch (error) {
        console.error('Erro ao executar consulta SQL:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get('/PCSFILTER', (req, res) => {
    const param = req.query.param;
    const limit = parseInt(req.query.limit);

    const query = `SELECT ${param} FROM pcs_data ORDER BY timestamp DESC LIMIT $1`;

    try {
        pool.query(query, [limit], (error, results) => {
            if (error) {
                console.error('Erro ao executar consulta SQL:', error.database, error.message);
                res.status(500).json({ error: 'Erro interno do servidor' });
            } else {
                res.json(results.rows.map((result, i) => {
                    return result;
                }));
            }
        });
    } catch (error) {
        console.error('Erro ao executar consulta SQL:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get('/METERFILTER', (req, res) => {
    const param = req.query.param;
    const limit = parseInt(req.query.limit);

    const query = `SELECT ${param} FROM meter_data ORDER BY timestamp DESC LIMIT $1`;

    try {
        pool.query(query, [limit], (error, results) => {
            if (error) {
                console.error('Erro ao executar consulta SQL:', error.database, error.message);
                res.status(500).json({ error: 'Erro interno do servidor' });
            } else {
                res.json(results.rows.map((result, i) => {
                    return result;
                }));
            }
        });
    } catch (error) {
        console.error('Erro ao executar consulta SQL:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});



//*------------- LISTAGEM SEM FILTRO -------------*//


router.get('/METER', (req, res) => {
    const query = `SELECT * FROM meter_data`;

    try {
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
    } catch (error) {
        console.error('Erro ao executar consulta SQL:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});


router.get('/PCS', (req, res) => {
    const query = `SELECT * FROM pcs_data`;

    try {
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
    } catch (error) {
        console.error('Erro ao executar consulta SQL:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/send-mqtt-command', (req, res) => {
    const topic = 'comandos';
    const command = req.body.command; // Supondo que o comando seja enviado no corpo da solicitação

    try {
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
    } catch (error) {
        console.error('Erro ao enviar o comando MQTT:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
