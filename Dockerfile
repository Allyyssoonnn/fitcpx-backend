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

# Copia o entrypoint customizado
COPY entrypoint.sh /app/entrypoint.sh

# Dá permissão de execução para o script
RUN chmod +x /app/entrypoint.sh

# Expõe as portas em que a aplicação irá rodar
EXPOSE 8070
EXPOSE 8090

# Comando para iniciar a aplicação
# CMD [ "npm", "start" ]
# CMD [ "pm2-runtime", "ecosystem.config.js"]
# Define o entrypoint para executar migrações e subir a app
ENTRYPOINT ["/app/entrypoint.sh"]