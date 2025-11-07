//Servidor http
const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const dev = process.env.NODE_ENV != "production";
const port = process.env.NODE_ENV == "test" ? 8071 : 8070;
if (!dev) require("./infra/monitoring/otel");

const server = express();
const PORT = port;

//cors precisa ser declarado antes das rotas para não ocorrer erro no client
server.use(cors({ origin: "*", credentials: true }));
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));

//Remove after update
server.get("/fitnessassessmentpdf", (req, res) => {
   res.sendFile(__dirname + "/api/utils/templates/fitnessassessmentpdf.html");
});
server.use("/appaluno", require("./api/routes/routeAppAluno"));
server.use("/treino", require("./api/routes/routeTreino"));
server.use("/aluno", require("./api/routes/routeAluno"));
server.use("/avaliacao", require("./api/routes/routeAvaliacao"));

// ================ Servidor

const serverHttp = http.createServer(server);
serverHttp.listen(PORT, () => console.info(`\n\n\n *** http://localhost:${PORT}/test *** \n\n\n`));

// NestJS
require("./main").bootstrap(server);
