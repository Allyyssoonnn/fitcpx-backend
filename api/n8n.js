async function sendConfirmationCode(email, name, token) {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("name", name);
  formData.append("token", token);

  let urlN8N = "https://n8n.fitcpx.com/webhook/sendConfirmationCode";

  let options = {
    method: "POST",
    headers: { "User-Agent": "insomnia/11.2.0" },
    body: formData,
  };

  fetch(urlN8N, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error("error:" + err));
}

async function sendRecoveryPassword(email, name, url) {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("name", name);
  formData.append("url", url);

  let urlN8N = "https://n8n.fitcpx.com/webhook/sendRecoveryPassword";

  let options = {
    method: "POST",
    headers: { "User-Agent": "insomnia/11.2.0" },
    body: formData,
  };

  fetch(urlN8N, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error("error:" + err));
}

module.exports = {
  sendConfirmationCode,
  sendRecoveryPassword,
};
