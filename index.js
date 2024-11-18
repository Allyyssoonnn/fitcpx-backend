//Servidor http
const bodyParser = require('body-parser');
const express = require('express');
const http = require("http");
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const server = express();
const PORT = 8070;

//cors precisa ser declarado antes das rotas para não ocorrer erro no client
server.use(cors());
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));

server.use('/usuario', require('./api/routes/routeUsuario'));
server.use('/aluno', require('./api/routes/routeAluno'));


// const rotasLiberadas = ['/api/usuario/login', '/api/usuario/register'];

// const authJWT = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (req.originalUrl.substring(0, 4) !== '/api') {
//         next();
//         return;
//     }

//     if (rotasLiberadas.includes(req.originalUrl)) {
//         next();
//         return;
//     }

//     if (authHeader) {
//         const token = authHeader;

//         jwt.verify(token, '2023@Ape#2023', (err, usuario) => {
//             if (err) return res.sendStatus(403);
//             req.usuario = usuario;
//             next();
//         });
//     } else res.sendStatus(401);
// };

// server.use(authJWT);

// server.use(express.static(path.join(__dirname, '/app')));
// server.get('/*', ((req, res) => res.sendFile(path.join(__dirname, '/app/index.html'))));

const serverHttp = http.createServer(server);

serverHttp.listen(PORT, () => console.log(`Backend do app está rodando na porta: ${PORT}`));

server.get('/test', async (req, res) => res.send({status: true}));