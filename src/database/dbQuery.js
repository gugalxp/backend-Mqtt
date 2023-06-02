const pool = require('../config/database');

const createTables = async () => {
    const client = await pool.connect();

    try {
        await client.query(`
      CREATE TABLE IF NOT EXISTS bess_data (
        id SERIAL PRIMARY KEY,
        cov FLOAT,
        clv FLOAT,
        tmax INT,
        tmin INT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS pcs_data (
        id SERIAL PRIMARY KEY,
        p1 FLOAT,
        p2 FLOAT,
        p3 FLOAT,
        ptotal FLOAT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS meter_data (
        id SERIAL PRIMARY KEY,
        v1 FLOAT,
        v2 FLOAT,
        v3 FLOAT,
        frequency FLOAT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        console.log('Tabelas criadas com sucesso!');
    } catch (error) {
        console.error('Erro ao criar tabelas:', error);
    } finally {
        client.release();
    }
};

const insertBESSData = async (cov, clv, tmax, tmin) => {
    const query = 'INSERT INTO bess_data (cov, clv, tmax, tmin) VALUES ($1, $2, $3, $4)';
    const values = [cov, clv, tmax, tmin];

    try {
        const client = await pool.connect();
        await client.query(query, values);
        client.release();
    } catch (error) {
        console.error('Erro ao inserir dados na tabela BESSData:', error);
    }
};

const insertPCSData = async (p1, p2, p3, ptotal) => {
    const query = 'INSERT INTO pcs_data (p1, p2, p3, ptotal) VALUES ($1, $2, $3, $4)';
    const values = [p1, p2, p3, ptotal];

    try {
        const client = await pool.connect();
        await client.query(query, values);
        client.release();
    } catch (error) {
        console.error('Erro ao inserir dados na tabela PCSData:', error);
    }
};

const insertMeterData = async (v1, v2, v3, frequency) => {
    const query = 'INSERT INTO meter_data (v1, v2, v3, frequency) VALUES ($1, $2, $3, $4)';
    const values = [v1, v2, v3, frequency];

    try {
        const client = await pool.connect();
        await client.query(query, values);
        client.release();
    } catch (error) {
        console.error('Erro ao inserir dados na tabela MeterData:', error);
    }
};
createTables();

module.exports = {
    insertBESSData,
    insertPCSData,
    insertMeterData,
};

