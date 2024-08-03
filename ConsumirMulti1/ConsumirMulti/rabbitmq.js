// rabbitmq.js
const amqp = require('amqplib');

class RabbitMQ {
  constructor(amqpUrl, queue) {
    this.amqpUrl = amqpUrl;
    this.queue = queue;
    this.messages = [];
  }

  async connect() {
    this.connection = await amqp.connect(this.amqpUrl);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queue, { durable: true });
  }

  async consume() {
    await this.connect();
    console.log(`Esperando mensajes en la cola ${this.queue}...`);
    
    this.channel.consume(this.queue, (message) => {
      if (message !== null) {
        const data = message.content.toString();  // Convertir a cadena de texto
        this.messages.push(data);
        console.log("Mensaje recibido:", data);
        this.channel.ack(message);
      }
    });
  }

  getMessages() {
    return this.messages;
  }

  async close() {
    await this.channel.close();
    await this.connection.close();
  }
}

module.exports = RabbitMQ;
