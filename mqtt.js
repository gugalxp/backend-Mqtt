const database = require('./database');
const mqtt = require('mqtt');

const mqttClient = mqtt.connect('mqtt://broker.emqx.io');

const insertBESSData = database.insertBESSData;
const insertPCSData = database.insertPCSData;
const insertMeterData = database.insertMeterData;

mqttClient.on('connect', () => {
  console.log('Conexão MQTT estabelecida com sucesso!');

  mqttClient.subscribe('payloads', (err) => {
    if (err) {
      console.error('Erro ao se inscrever no tópico:', err);
    } else {
      console.log('Inscrição no tópico payloads realizada com sucesso!');
    }
  });
});

mqttClient.on('message', async (topic, message) => {
  console.log('Tópico:', topic); // Verifica o tópico recebido
  console.log('Mensagem:', message.toString()); // Verifica a mensagem recebida

  if (topic === 'payloads') {
    try {
      const payload = JSON.parse(message.toString());

      console.log('Payload:', payload); // Verifica o payload recebido

      const { BESS, PCS, meter } = payload;

      console.log('Valores extraídos:', BESS, PCS, meter);

      // Verifique se os valores estão presentes no payload
      if (BESS && PCS && meter) {
        await insertBESSData(
          parseFloat(BESS.COV),
          parseFloat(BESS.CLV),
          parseInt(BESS.Tmax),
          parseInt(BESS.Tmin)
        );
        console.log('Dados do BESS inseridos no banco de dados com sucesso!');

        await insertPCSData(
          parseFloat(PCS.P1),
          parseFloat(PCS.P2),
          parseFloat(PCS.P3),
          parseFloat(PCS.Ptotal)
        );
        console.log('Dados do PCS inseridos no banco de dados com sucesso!');

        await insertMeterData(
          parseFloat(meter.V1),
          parseFloat(meter.V2),
          parseFloat(meter.V3),
          parseFloat(meter.frequency)
        );
        console.log('Dados do medidor inseridos no banco de dados com sucesso!');

        console.log('Payload recebido e inserido no banco de dados!');
      } else {
        console.error('Payload inválido: Algumas propriedades estão faltando!');
      }
    } catch (error) {
      console.error('Erro ao processar o payload:', error);
    }
  }
});

module.exports = mqttClient;
