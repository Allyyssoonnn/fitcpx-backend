const fs = require('fs');
const path = require('path');

const IGNORAR = new Set([
  'node_modules',
  '.git',
  'dist-usuario',
  '.bin',
  '.vite',
  '.vscode',
  '@babel',
  '@ampproject'
]);

function listarEstrutura(dir, prefix = '', isLast = true) {
  const nome = path.basename(dir);
  if (IGNORAR.has(nome)) return '';

  let resultado = `${prefix}${isLast ? '└──' : '├──'} ${nome}/\n`;

  const itens = fs.readdirSync(dir, { withFileTypes: true })
    .filter(entry => !IGNORAR.has(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  itens.forEach((item, index) => {
    const caminho = path.join(dir, item.name);
    const ultimo = index === itens.length - 1;
    const novoPrefix = prefix + (isLast ? '    ' : '│   ');

    if (item.isDirectory()) {
      resultado += listarEstrutura(caminho, novoPrefix, ultimo);
    } else {
      resultado += `${novoPrefix}${ultimo ? '└──' : '├──'} ${item.name}\n`;
    }
  });

  return resultado;
}

const estrutura = listarEstrutura(__dirname, '', true);
fs.writeFileSync('estrutura.txt', estrutura, 'utf-8');
console.log('📁 estrutura.txt gerado com sucesso!');