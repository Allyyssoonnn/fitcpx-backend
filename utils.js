function removeStringVazia(data) {
    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value === '' ? null : value])
    );
}

// Função para formatar número de celular para o padrão internacional E.164
function formatarCelular(numeroCelular) {
    // Remove todos os caracteres não numéricos
    let numero = numeroCelular.replace(/\D/g, '');
    
    // Verifica se o número já tem o código do país
    if (!numero.startsWith('55')) {
        // Adiciona o código do país (Brasil - 55)
        numero = '55' + numero;
    }
    
    // Verifica se o DDD tem o 0 na frente e remove (ex: 011 -> 11)
    if (numero.startsWith('550')) {
        numero = '55' + numero.substring(3);
    }
    
    // Verifica se é um celular e tem o nono dígito
    if (numero.length === 12) { // Sem o nono dígito (55 + DDD + 8 dígitos)
        // Insere o nono dígito (9) após o DDD para celulares no Brasil
        numero = numero.substring(0, 4) + '9' + numero.substring(4);
    }
    
    // Formato final: +55DDNNNNNNNNN
    return '+' + numero;
}

module.exports = {
    removeStringVazia,
    formatarCelular
}