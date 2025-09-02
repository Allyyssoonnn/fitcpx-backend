function getMessageError(message, lang = "pt") {
   const messages = {
      pt: {
         USER_NOT_FOUND: "Usuário não encontrado.",
         INVALID_CREDENTIALS: "Credenciais inválidas.",
         SERVER_ERROR: "Erro interno do servidor.",
         UNAUTHORIZED: "Não autorizado.",
         FORBIDDEN: "Proibido.",
         BAD_REQUEST: "Requisição inválida.",
         TOKEN_EXPIRED: "Token expirado.",
         INVALID_TOKEN: "Token inválido.",
         USER_ALREADY_EXISTS: "Usuário já existe.",
      },
      en: {
         USER_NOT_FOUND: "User not found.",
         INVALID_CREDENTIALS: "Invalid credentials.",
         SERVER_ERROR: "Internal server error.",
         UNAUTHORIZED: "Unauthorized.",
         FORBIDDEN: "Forbidden.",
         BAD_REQUEST: "Bad request.",
         TOKEN_EXPIRED: "Token expired.",
         INVALID_TOKEN: "Invalid token.",
         USER_ALREADY_EXISTS: "User already exists.",
      },
   };

   return messages[lang][message] || message;
}

module.exports = getMessageError;
