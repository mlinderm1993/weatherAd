const http = require('http');
const app = require('./app');
const port = 4200;

console.log('starting server');
const server = http.createServer(app);

console.log('listening port ' + port);
server.listen(port);