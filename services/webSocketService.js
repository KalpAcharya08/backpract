const WebSocket = require('ws');

let clients = [];

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  console.log('✅ WebSocket server initialized');

  wss.on('connection', (ws) => {
    console.log('🔌 New client connected');
    clients.push(ws);

    ws.on('message', (message) => {
      console.log('📩 Received:', message.toString());

      // Example: Broadcast to all clients
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`Echo: ${message}`);
        }
      });
    });

    ws.on('close', () => {
      console.log('❌ Client disconnected');
      clients = clients.filter(client => client !== ws);
    });

    ws.on('error', (err) => {
      console.error('⚠️ WebSocket error:', err.message);
    });

    // Optional: Initial welcome message
    ws.send('👋 Welcome to the WebSocket server');
  });
}

module.exports = { setupWebSocket };
