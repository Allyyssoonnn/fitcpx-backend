//Servidor http
const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const server = express();
const PORT = 8070;

//cors precisa ser declarado antes das rotas para não ocorrer erro no client
server.use(cors({ origin: "*", credentials: true }));
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));

server.get("/ping", async (req, res) => res.send({ status: true }));
server.get("/test", async (req, res) => res.send({ status: true }));

server.use("/appaluno", require("./api/routes/routeAppAluno"));

// ================ Servidor

const serverHttp = http.createServer(server);
serverHttp.listen(PORT, () => console.info(`\n\n\n *** http://localhost:${PORT}/test *** \n\n\n`));

// NestJS
require("./main").bootstrap(server);
