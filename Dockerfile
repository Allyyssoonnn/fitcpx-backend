# Usa a imagem base do Node.js
FROM node:18

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos package*.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe as portas em que a aplicação irá rodar
EXPOSE 8070
EXPOSE 8090

# Comando para iniciar a aplicação
CMD [ "npm", "start" ]