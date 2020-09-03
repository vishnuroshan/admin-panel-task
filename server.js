
const app = require('./app');
const http = require('http');
const config = require('./config/app-config');
const port = process.argv[2] || config.PORT;
const server = http.createServer();

server.listen(port, () => {
	console.log(`server running in "${server.address().address=='::' ? 'localhost' : server.address().address }:${server.address().port}"`);
});

server.on('request', app);