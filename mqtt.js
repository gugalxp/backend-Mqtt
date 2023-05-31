const mqtt = require('mqtt');

const broker = 'mqtt://broker.emqx.io'; // URL do broker MQTT
const topic = 'myTopic'; // Tópico MQTT para subscrever e publicar mensagens

// Conexão MQTT
const client = mqtt.connect(broker);

client.on('connect', () => {
  console.log('Connected to MQTT broker');

  // Subscrição ao tópico
  client.subscribe(topic, (err) => {
    if (err) {
      console.error('Error subscribing to topic:', err);
    } else {
      console.log('Subscribed to topic:', topic);
    }
  });
});

// Recebimento de mensagens MQTT
client.on('message', (topic, message) => {
  const payload = message.toString();
  console.log('Esse é o payload: ', payload);
  // Processe os dados recebidos e armazene no banco de dados
});

// Publicação de mensagens MQTT
const message = 'Hello, MQTT!'; // Mensagem a ser enviada

client.publish(topic, message, (err) => {
  if (err) {
    console.error('Error publishing message:', err);
  } else {
    console.log('Message published:', message);
  }
});
