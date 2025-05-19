//Servidor http
const bodyParser = require('body-parser');
const express = require('express');
const http = require("http");
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const server = express();
const serverSite = express();
const serverApp = express();
const serverAppAluno = express();
const serverAppAdmin = express();
const PORT = 8070;
const PORTSITE = 8090;
const PORTApp = 3070;
const PORTAppAluno = 3075;
const PORTAppAdmin = 3080;

//cors precisa ser declarado antes das rotas para não ocorrer erro no client
server.use(cors({ origin: '*', credentials: true }));
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));

server.get('/ping', async (req, res) => res.send({status: true}));
server.get('/test', async (req, res) => res.send({status: true}));
server.use('/error', require('./api/error'));
server.use('/usuario', require('./api/routes/routeUsuario'));
server.use('/aluno', require('./api/routes/routeAluno'));
server.use('/agenda', require('./api/routes/routeAgenda'));
server.use('/treino', require('./api/routes/routeTreino'));
server.use('/cardapio', require('./api/routes/routeCardapio'));
server.use('/appaluno', require('./api/routes/routeAppAluno'));
server.use('/appadmin', require('./api/routes/routeAppAdmin'));
server.use('/plano', require('./api/routes/routePlano'));
server.use('/pagamento', require('./api/routes/routePagamento'));
server.use('/licenca', require('./api/routes/routeLicenca'));
server.use('/app', require('./api/routes/routeApp'));

// ================ Servidor

const serverHttp = http.createServer(server);
serverHttp.listen(PORT, () => console.log(`Backend do app está rodando na porta: ${PORT}`));

// =================== Site

serverSite.use(express.static(path.join(__dirname, '/site')));
serverSite.get('/politica-privacidade', ((req, res) => res.sendFile(path.join(__dirname, '/site/politica-privacidade.html'))));
serverSite.get('/*', ((req, res) => res.sendFile(path.join(__dirname, '/site/index.html'))));

const serverWebHttp = http.createServer(serverSite);
serverWebHttp.listen(PORTSITE, () => console.log(`WebSite do app está rodando na porta: ${PORTSITE}`));

// ================ Usuário

serverApp.use(express.static(path.join(__dirname, '/dist-usuario')));
serverApp.get('/*', ((req, res) => res.sendFile(path.join(__dirname, '/dist-usuario/index.html'))));

const appHttp = http.createServer(serverApp);
appHttp.listen(PORTApp, () => console.log(`Frontend do app está rodando na porta: ${PORTApp}`));

// ================ Aluno

serverAppAluno.use(express.static(path.join(__dirname, '/dist-aluno')));
serverAppAluno.get('/*', ((req, res) => res.sendFile(path.join(__dirname, '/dist-aluno/index.html'))));


const appAlunoHttp = http.createServer(serverAppAluno);
appAlunoHttp.listen(PORTAppAluno, () => console.log(`Frontend do app está rodando na porta: ${PORTAppAluno}`));

// ================ Admin

serverAppAdmin.use(express.static(path.join(__dirname, '/dist-admin')));
serverAppAdmin.get('/*', ((req, res) => res.sendFile(path.join(__dirname, '/dist-admin/index.html'))));

const appAdminHttp = http.createServer(serverAppAdmin);
appAdminHttp.listen(PORTAppAdmin, () => console.log(`Frontend do app está rodando na porta: ${PORTAppAdmin}`));