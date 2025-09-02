//Servidor http
const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const server = express();
const serverSite = express();
const PORT = 8070;
const PORTSITE = 8090;

//cors precisa ser declarado antes das rotas para não ocorrer erro no client
server.use(cors({ origin: "*", credentials: true }));
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));

server.get("/ping", async (req, res) => res.send({ status: true }));
server.get("/test", async (req, res) => res.send({ status: true }));
server.get("/fitnessassessmentpdf", (req, res) => {
   res.sendFile(__dirname + "/api/utils/templates/fitnessassessmentpdf.html");
});
server.use("/usuario", require("./api/routes/routeUsuario"));
server.use("/aluno", require("./api/routes/routeAluno"));
server.use("/aluno/sessao", require("./api/routes/aluno/routeSessao"));
server.use("/agenda", require("./api/routes/routeAgenda"));
server.use("/treino", require("./api/routes/routeTreino"));
server.use("/cardapio", require("./api/routes/routeCardapio"));
server.use("/appaluno", require("./api/routes/routeAppAluno"));
server.use("/appadmin", require("./api/routes/routeAppAdmin"));
server.use("/plano", require("./api/routes/routePlano"));
server.use("/pagamento", require("./api/routes/routePagamento"));
server.use("/licenca", require("./api/routes/routeLicenca"));
server.use("/app", require("./api/routes/routeApp"));
server.use("/avaliacao", require("./api/routes/routeAvaliacao"));

// New Routes

server.use(require("./modules/user/user.routes"));

// ================ Servidor

const serverHttp = http.createServer(server);
serverHttp.listen(PORT, () => console.log(`Backend do app está rodando na porta: ${PORT}`));

const serverWebHttp = http.createServer(serverSite);
serverWebHttp.listen(PORTSITE, () => console.log(`WebSite do app está rodando na porta: ${PORTSITE}`));
