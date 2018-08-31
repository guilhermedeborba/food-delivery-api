const redis = require('redis');
const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

client.on('error', error => {
  console.log(`Error: ${error}`);
})

client.on('connect', () => console.log('Redis Connected'));

module.exports = client;