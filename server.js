const app = require('./app');
const http = require('http');
const { setupWebSocket } = require('./services/webSocketService');

const server = http.createServer(app);
const PORT =  5000;

// Setup WebSocket
setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});