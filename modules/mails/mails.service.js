const HttpException = require("../../core/http-exception");
const { sendMail } = require("./mails.api");
const dev = (process.env.NODE_ENV || "development") === "development";
const fs = require("fs/promises");
const path = require("path");

class MailService {
   test = async (email) => {
      return sendMail(email);
   };

   payout = async (name, email, clients, amount, proof, startDate, endDate) => {
      function renderTemplate(template, variables) {
         let output = template;
         for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{{${key}}}`, "g");
            output = output.replace(regex, value);
         }
         return output;
      }

      const htmlTemplate = await fs.readFile(path.join(__dirname, "templates", "payout.html"), "utf-8");
      const clientsObj = JSON.parse(clients);
      const htmlClients = clientsObj
         .map(
            (client) => `
         <tr>
            <td>${client.name}</td>
            <td>${client.date}</td>
            <td>${client.amount}</td>
         </tr>
      `
         )
         .join("");
      const htmlBody = renderTemplate(htmlTemplate, { name, amount, startDate, endDate, clients: htmlClients });

      return sendMail(email, htmlBody, "Repasse enviado", [
         {
            filename: "Comprovante.pdf",
            content: proof,
         },
      ]);
   };
}

module.exports = MailService;
