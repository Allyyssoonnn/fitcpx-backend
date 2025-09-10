const { MailtrapClient } = require("mailtrap");

const TOKEN = "[REDACTED_CREDENTIAL]";

const client = new MailtrapClient({
   token: TOKEN,
});

const sender = {
   email: "noreply@fitcpx.com",
   name: "Lab Complex Dev LTDA",
};

async function sendMail(email, html, subject, attachments) {
   const recipients = [{ email }];

   client
      .send({
         from: sender,
         to: recipients,
         subject,
         html,
         category: "FitCpx App",
         attachments,
      })
      .then(console.log, console.error);
}

module.exports = {
   sendMail,
};
