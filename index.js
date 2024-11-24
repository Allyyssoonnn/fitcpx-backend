//Servidor http
const bodyParser = require('body-parser');
const express = require('express');
const http = require("http");
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const server = express();
const PORT = 8070;

//cors precisa ser declarado antes das rotas para não ocorrer erro no client
server.use(cors());
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));

server.get('/test', async (req, res) => res.send({status: true}));
server.use('/usuario', require('./api/routes/routeUsuario'));
server.use('/aluno', require('./api/routes/routeAluno'));
server.use('/agenda', require('./api/routes/routeAgenda'));

const serverHttp = http.createServer(server);
serverHttp.listen(PORT, () => console.log(`Backend do app está rodando na porta: ${PORT}`));


const serverApp = express();
const PORTApp = 3070;
serverApp.use(express.static(path.join(__dirname, '/dist')));
serverApp.get('/*', ((req, res) => res.sendFile(path.join(__dirname, '/dist/index.html'))));
const appHttp = http.createServer(serverApp);
appHttp.listen(PORTApp, () => console.log(`Frontend do app está rodando na porta: ${PORTApp}`));