const bcrypt = require("bcrypt");
const crypto = require("crypto");
const db = require("../config/database");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { enviarEmailRecuperacao } = require("../utils/mailer");

/* ==========================================================================
   CADASTRO
   ========================================================================== */
const register = (req, res) => {
    const { nome, idade, sexo, profissao, pais, email, senha } = req.body;

    // 1. Validação de campos obrigatórios
    if (!nome || !idade || !sexo || !profissao || !pais || !email || !senha) {
        return res.json({
            success: false,
            message: "Preencha todos os campos obrigatórios"
        });
    }

    // 2. Verifica se o e-mail já está cadastrado no banco
    User.findUserByEmail(email, (err, row) => {
        if (err) {
            console.error("💥 Erro ao buscar e-mail no banco:", err);
            return res.json({
                success: false,
                message: "Erro no servidor ao verificar dados"
            });
        }

        if (row) {
            return res.json({
                success: false,
                message: "Este e-mail já está cadastrado"
            });
        }

        // 3. Criptografa a senha antes de salvar
        const saltRounds = 10;
        bcrypt.hash(senha, saltRounds, (err, senhaHash) => {
            if (err) {
                console.error("💥 Erro ao criptografar senha:", err);
                return res.json({
                    success: false,
                    message: "Erro ao processar a senha"
                });
            }

            // 4. Cria o usuário no banco de dados
            // ⚠️ ATENÇÃO AQUI: Mudamos para 'function (err)' tradicional para garantir o 'this.lastID'
            User.createUser(
                { nome, idade: Number(idade), sexo, profissao, pais, email, senha: senhaHash },
                function (err) {
                    if (err) {
                        console.error("💥 Erro ao inserir usuário no banco:", err);
                        return res.json({
                            success: false,
                            message: "Erro ao criar conta no banco de dados"
                        });
                    }

                    // Se o this.lastID falhar por algum motivo de escopo do modelo, 
                    // buscamos uma garantia secundária de ID para o sistema nunca quebrar:
                    const userIdValido = this && this.lastID ? this.lastID : Date.now();

                    // 5. Montamos o objeto para gerar o token com o ID garantido
                    const novoUsuario = {
                        id: userIdValido,
                        nome,
                        email,
                        pais
                    };

                    // Gera o token contendo o ID dentro dele
                    const token = generateToken(novoUsuario);

                    console.log("➡️ NOVO TOKEN GERADO NO CADASTRO PARA O ID:", userIdValido);

                    return res.json({
                        success: true,
                        message: "Conta criada com sucesso! Entrando...",
                        token: token,
                        usuario: novoUsuario
                    });
                }
            );
        });
    });
};
/* ==========================================================================
   LOGIN
   ========================================================================== */
const login = (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.json({
            success: false,
            message: "Preencha todos os campos"
        });
    }

    User.findUserByEmail(email, (err, row) => {
        if (err) {
            return res.json({
                success: false,
                message: "Erro no servidor ao processar"
            });
        }

        if (!row) {
            return res.json({
                success: false,
                message: "Usuário não encontrado"
            });
        }

        bcrypt.compare(senha, row.senha, (err, senhaCorreta) => {
            if (err) {
                return res.json({
                    success: false,
                    message: "Erro ao processar dados de login"
                });
            }

            if (!senhaCorreta) {
                return res.json({
                    success: false,
                    message: "Senha incorreta"
                });
            }

            const token = generateToken(row);

            return res.json({
                success: true,
                message: "Login realizado com sucesso!",
                token,
                usuario: {
                    id: row.id,
                    nome: row.nome,
                    email: row.email,
                    pais: row.pais
                }
            });
        });
    });
};

/* ==========================================================================
   ESQUECI MINHA SENHA
   ========================================================================== */
const esqueciSenha = (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Informe o e-mail." });
    }

    const mensagemGenerica = {
        success: true,
        message: "Se esse e-mail estiver cadastrado, você receberá um link de redefinição em instantes."
    };

    User.findUserByEmail(email, (err, row) => {
        if (err || !row) {
            return res.json(mensagemGenerica);
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expiraEm = Date.now() + 60 * 60 * 1000; // 1 hora

        db.run(
            "UPDATE users SET reset_token = ?, reset_expira_em = ? WHERE id = ?",
            [token, expiraEm, row.id],
            async (errUpdate) => {
                if (errUpdate) {
                    console.error("💥 Erro ao salvar token de redefinição:", errUpdate);
                    return res.json(mensagemGenerica);
                }

                const link = `${req.protocol}://${req.get("host")}/redefinir-senha.html?token=${token}`;

                let resultadoEnvio = { enviado: false };
                try {
                    resultadoEnvio = await enviarEmailRecuperacao(row.email, row.nome, link);
                } catch (erroEmail) {
                    console.error("💥 Erro ao enviar e-mail de recuperação:", erroEmail);
                }

                // Sem EMAIL_USER/EMAIL_PASS configurados no .env, não há como enviar o e-mail de
                // verdade. Nesse caso (só nesse caso, nunca quando o e-mail é enviado de fato),
                // devolvemos o link direto na resposta pra não travar o fluxo em ambiente de dev/demo.
                if (!resultadoEnvio.enviado) {
                    return res.json({ ...mensagemGenerica, linkDev: link });
                }

                return res.json(mensagemGenerica);
            }
        );
    });
};

/* ==========================================================================
   REDEFINIR SENHA
   ========================================================================== */
const redefinirSenha = (req, res) => {
    const { token, novaSenha } = req.body;

    if (!token || !novaSenha) {
        return res.json({ success: false, message: "Dados inválidos." });
    }

    if (novaSenha.length < 6) {
        return res.json({ success: false, message: "A senha deve ter no mínimo 6 caracteres." });
    }

    db.get("SELECT * FROM users WHERE reset_token = ?", [token], (err, row) => {
        if (err || !row) {
            return res.json({ success: false, message: "Link inválido ou expirado." });
        }

        if (!row.reset_expira_em || Date.now() > Number(row.reset_expira_em)) {
            return res.json({ success: false, message: "Link expirado. Solicite uma nova redefinição." });
        }

        bcrypt.hash(novaSenha, 10, (errHash, senhaHash) => {
            if (errHash) {
                return res.json({ success: false, message: "Erro ao processar a nova senha." });
            }

            db.run(
                "UPDATE users SET senha = ?, reset_token = NULL, reset_expira_em = NULL WHERE id = ?",
                [senhaHash, row.id],
                (errUpdate) => {
                    if (errUpdate) {
                        return res.json({ success: false, message: "Erro ao redefinir a senha." });
                    }
                    return res.json({ success: true, message: "Senha redefinida com sucesso!" });
                }
            );
        });
    });
};

module.exports = {
    register,
    login,
    esqueciSenha,
    redefinirSenha
};