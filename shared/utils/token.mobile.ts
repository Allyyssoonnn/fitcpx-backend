const { tab_refreshtoken_aluno } = require("../../database/models");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// * Generate JWT and Refresh Token when user logs in
// * Token expiration in 7 hours
// * Refresh Token expiration in 7 days
export async function genTokenStudentAuth(cod_aluno: string, cod_empresa: string) {
   const token = jwt.sign({ cod_aluno, cod_empresa }, process.env.SECRET, { expiresIn: "7h" });

   const refreshToken = crypto.randomBytes(64).toString("hex");

   // * Save refreshToken in database
   const expirationTime = 7 * 24 * 60 * 60 * 1000; // * 7 days
   const expiresAt = new Date(Date.now() + expirationTime);

   tab_refreshtoken_aluno.create({
      cod_aluno: cod_aluno,
      refreshtoken_aluno: refreshToken,
      expiresAt: expiresAt,
   });

   return { token, refreshToken };
}

// * Validate Token
export function validateStudentToken(token: string) {
   try {
      const decoded = jwt.verify(token, process.env.SECRET);
      return { valid: true, decoded };
   } catch (error) {
      return { valid: false, error };
   }
}
