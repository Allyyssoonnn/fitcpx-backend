//Servidor http
const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const dev = process.env.NODE_ENV != "production";
const prod = process.env.NODE_ENV == "production";
const port = process.env.NODE_ENV == "test" ? 8071 : 8070;
// if (prod) require("./infra/monitoring/otel");

const server = express();
const PORT = port;

server.use(
   cors({
      origin: dev
         ? "*"
         : ["http://localhost:5173", "https://apptest.fitcpx.com", "https://app.fitcpx.com", "https://box.fitcpx.com"],
      credentials: true,
   })
);
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));

server.get("/changelog", (req, res) => {
   const changelogJSON = require("./changelog.json");
   const requestedVersion = req.query.v;

   if (requestedVersion && changelogJSON[requestedVersion]) {
      return res.json({
         [requestedVersion]: changelogJSON[requestedVersion],
      });
   }

   return res.json({
      [requestedVersion]: changelogJSON[requestedVersion],
   });
});

// ================ Servidor

const serverHttp = http.createServer(server);
serverHttp.listen(PORT, () => console.info(`\n\n\n *** http://localhost:${PORT}/test *** \n\n\n`));

// NestJS
require("./main").bootstrap(server);
