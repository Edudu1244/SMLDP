const express = require("express");
const router = express.Router();

// Importa as funções de cadastro e login lá do controller
const authController = require("../controllers/authController");

// Define a rota de cadastro (Vai escutar POST para /auth/register)
router.post("/register", authController.register);

// Define a rota de login (Vai escutar POST para /auth/login)
router.post("/login", authController.login);

// Solicita o e-mail de redefinição de senha
router.post("/esqueci-senha", authController.esqueciSenha);

// Redefine a senha usando o token recebido por e-mail
router.post("/redefinir-senha", authController.redefinirSenha);

// Exporta o roteador para o server.js conseguir ler
module.exports = router;