
async function sendConfirmationCode(
    email,
    name,
    code,
) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('name', name);
    formData.append('code', code);

    let urlN8N = 'http://212.85.2.135:5678/webhook/sendConfirmationCode';

    let options = {
        method: 'POST',
        headers: { 'User-Agent': 'insomnia/11.2.0' },
        body: formData
    };

    fetch(urlN8N, options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error('error:' + err));
}

module.exports = {
    sendConfirmationCode,
}