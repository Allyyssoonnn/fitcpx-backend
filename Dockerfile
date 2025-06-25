# Usa a imagem base do Node.js
FROM node:18

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos package*.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências
RUN npm install

# Instala o PM2 globalmente apenas no container
RUN npm install -g pm2

# Copia o restante dos arquivos do projeto
COPY . .

# Copia o arquivo de configuração do PM2 (se existir)
COPY ecosystem.config.js ./
COPY .env ./

# Expõe as portas em que a aplicação irá rodar
EXPOSE 8070
EXPOSE 8090

# Comando para iniciar a aplicação
# CMD [ "npm", "start" ]
CMD [ "pm2-runtime", "ecosystem.config.js"]