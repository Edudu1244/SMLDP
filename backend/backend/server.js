require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const db = require("./config/database");

// 1. IMPORTAÇÃO DAS ROTAS
const authRoutes = require("./routes/authRoutes");
const simulationRoutes = require("./routes/simulationRoutes");

const verificarToken = require("./middleware/authMiddleware");

const app = express();

// 2. MIDDLEWARES GERAIS
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// 2.1 UPLOAD DE FOTO DE PERFIL
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(uploadsDir));

const storageFoto = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const userId = req.usuarioLogado.id || req.usuarioLogado.userId || req.usuarioLogado.user_id;
        const extensao = path.extname(file.originalname) || ".jpg";
        cb(null, `user-${userId}-${Date.now()}${extensao}`);
    }
});

const uploadFoto = multer({
    storage: storageFoto,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Envie apenas arquivos de imagem."));
        }
        cb(null, true);
    }
});

// 3. DEFINIÇÃO DAS ROTAS DA API
app.use("/auth", authRoutes); 
app.use("/api", simulationRoutes);

// 4. ROTA INICIAL (Carrega a página principal do TCC)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "inicial.html"));
});

// 5. BANCO DE DADOS (Criação e população das tabelas dentro do serialize)
db.serialize(() => {
    // Tabela de Usuários
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            idade INTEGER NOT NULL,
            sexo TEXT NOT NULL,
            profissao TEXT NOT NULL,
            pais TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL
        )
    `, () => {
        // Migração: adiciona colunas que podem não existir em bancos já criados
        db.all("PRAGMA table_info(users)", (err, colunas) => {
            if (err) return;
            const nomesColunas = colunas.map(coluna => coluna.name);

            if (!nomesColunas.includes("foto")) {
                db.run("ALTER TABLE users ADD COLUMN foto TEXT", (errAlter) => {
                    if (!errAlter) console.log("ℹ️ Coluna 'foto' adicionada à tabela users.");
                });
            }

            const criarIndiceUsername = () => {
                db.run(
                    "CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username) WHERE username IS NOT NULL",
                    (errIndice) => {
                        if (errIndice) console.error("💥 Erro ao criar índice de username:", errIndice.message);
                    }
                );
            };

            if (!nomesColunas.includes("username")) {
                db.run("ALTER TABLE users ADD COLUMN username TEXT", (errAlter) => {
                    if (errAlter) {
                        console.error("💥 Erro ao adicionar coluna 'username':", errAlter.message);
                        return;
                    }
                    console.log("ℹ️ Coluna 'username' adicionada à tabela users.");
                    criarIndiceUsername();
                });
            } else {
                criarIndiceUsername();
            }

            if (!nomesColunas.includes("data_nascimento")) {
                db.run("ALTER TABLE users ADD COLUMN data_nascimento TEXT", (errAlter) => {
                    if (!errAlter) console.log("ℹ️ Coluna 'data_nascimento' adicionada à tabela users.");
                });
            }

            if (!nomesColunas.includes("pais_ideal")) {
                db.run("ALTER TABLE users ADD COLUMN pais_ideal TEXT", (errAlter) => {
                    if (!errAlter) console.log("ℹ️ Coluna 'pais_ideal' adicionada à tabela users.");
                });
            }

            if (!nomesColunas.includes("pais_ideal_porcentagem")) {
                db.run("ALTER TABLE users ADD COLUMN pais_ideal_porcentagem REAL", (errAlter) => {
                    if (!errAlter) console.log("ℹ️ Coluna 'pais_ideal_porcentagem' adicionada à tabela users.");
                });
            }

            if (!nomesColunas.includes("meta_financeira_atingida")) {
                db.run("ALTER TABLE users ADD COLUMN meta_financeira_atingida INTEGER DEFAULT 0", (errAlter) => {
                    if (!errAlter) console.log("ℹ️ Coluna 'meta_financeira_atingida' adicionada à tabela users.");
                });
            }

            if (!nomesColunas.includes("reset_token")) {
                db.run("ALTER TABLE users ADD COLUMN reset_token TEXT", (errAlter) => {
                    if (!errAlter) console.log("ℹ️ Coluna 'reset_token' adicionada à tabela users.");
                });
            }

            if (!nomesColunas.includes("reset_expira_em")) {
                db.run("ALTER TABLE users ADD COLUMN reset_expira_em INTEGER", (errAlter) => {
                    if (!errAlter) console.log("ℹ️ Coluna 'reset_expira_em' adicionada à tabela users.");
                });
            }
        });
    });

    // Tabela de Países
    db.run(`
        CREATE TABLE IF NOT EXISTS countries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT UNIQUE NOT NULL,
            indice_desenvolvimento REAL NOT NULL,
            qualidade_vida INTEGER NOT NULL,
            dificuldade INTEGER NOT NULL,
            salario_medio REAL,
            moeda TEXT,
            idioma TEXT,
            dificuldade_idioma TEXT,
            clima TEXT
        )
    `, () => {
        const dadosPaises = {
            "Estados Unidos":  { idh: 0.921, qualidade: 8, dificuldade: 8, salario_medio: 5500, moeda: "USD", idioma: "Inglês", dificuldade_idioma: "Médio", clima: "Variado" },
            "China":           { idh: 0.788, qualidade: 6, dificuldade: 8, salario_medio: 2200, moeda: "CNY", idioma: "Mandarim", dificuldade_idioma: "Muito Difícil", clima: "Variado (subtropical a continental)" },
            "Japão":           { idh: 0.925, qualidade: 9, dificuldade: 8, salario_medio: 3200, moeda: "JPY", idioma: "Japonês", dificuldade_idioma: "Difícil", clima: "Temperado (quatro estações)" },
            "Portugal":        { idh: 0.874, qualidade: 8, dificuldade: 4, salario_medio: 1450, moeda: "EUR", idioma: "Português", dificuldade_idioma: "Fácil", clima: "Mediterrâneo" },
            "França":          { idh: 0.903, qualidade: 8, dificuldade: 6, salario_medio: 3600, moeda: "EUR", idioma: "Francês", dificuldade_idioma: "Difícil", clima: "Temperado" },
            "Coreia do Sul":   { idh: 0.925, qualidade: 8, dificuldade: 7, salario_medio: 3300, moeda: "KRW", idioma: "Coreano", dificuldade_idioma: "Muito Difícil", clima: "Temperado (quatro estações)" },
            "Suíça":           { idh: 0.967, qualidade: 10, dificuldade: 7, salario_medio: 8500, moeda: "CHF", idioma: "Alemão, Francês e Italiano", dificuldade_idioma: "Difícil", clima: "Alpino/Temperado" }
        };

        const placeholders = Object.keys(dadosPaises).map(() => "?").join(", ");
        db.run(`DELETE FROM countries WHERE nome NOT IN (${placeholders})`, Object.keys(dadosPaises), (errDelete) => {
            if (!errDelete) console.log("ℹ️ Países fora da lista atual removidos da tabela countries.");
        });

        db.all("PRAGMA table_info(countries)", (err, colunas) => {
            if (err) return;

            const nomesColunas = colunas.map((c) => c.name);
            const tiposColunasNovas = {
                indice_desenvolvimento: "REAL",
                salario_medio: "REAL",
                moeda: "TEXT",
                idioma: "TEXT",
                dificuldade_idioma: "TEXT",
                clima: "TEXT"
            };

            Object.entries(tiposColunasNovas).forEach(([coluna, tipo]) => {
                if (!nomesColunas.includes(coluna)) {
                    db.run(`ALTER TABLE countries ADD COLUMN ${coluna} ${tipo}`, (errAlter) => {
                        if (!errAlter) console.log(`ℹ️ Coluna '${coluna}' adicionada à tabela countries.`);
                    });
                }
            });

            const atualizaStmt = db.prepare(`
                UPDATE countries
                SET indice_desenvolvimento = ?, salario_medio = ?, moeda = ?, idioma = ?, dificuldade_idioma = ?, clima = ?
                WHERE nome = ? AND salario_medio IS NULL
            `);
            Object.entries(dadosPaises).forEach(([nome, dados]) => {
                atualizaStmt.run(dados.idh, dados.salario_medio, dados.moeda, dados.idioma, dados.dificuldade_idioma, dados.clima, nome);
            });
            atualizaStmt.finalize();
        });

        const stmt = db.prepare(`
            INSERT OR IGNORE INTO countries
                (nome, indice_desenvolvimento, qualidade_vida, dificuldade, salario_medio, moeda, idioma, dificuldade_idioma, clima)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        Object.entries(dadosPaises).forEach(([nome, d]) => {
            stmt.run(nome, d.idh, d.qualidade, d.dificuldade, d.salario_medio, d.moeda, d.idioma, d.dificuldade_idioma, d.clima);
        });
        stmt.finalize(() => {
            console.log("ℹ️ Tabela de países atualizada.");
        });
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS simulations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            pais_destino TEXT NOT NULL,
            indice_desenvolvimento REAL NOT NULL,
            qualidade_vida INTEGER NOT NULL,
            dificuldade INTEGER NOT NULL,
            score_final INTEGER NOT NULL,
            resultado TEXT NOT NULL,
            data_simulacao DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS comparisons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            pais1 TEXT NOT NULL,
            pais2 TEXT NOT NULL,
            data_comparacao DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS favorites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            pais TEXT NOT NULL,
            data_favoritado DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, pais),
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS planos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            pais_destino TEXT NOT NULL,
            estado TEXT NOT NULL,
            cidade TEXT NOT NULL,
            data_pretendida TEXT NOT NULL,
            quantidade_pessoas INTEGER NOT NULL,
            valor_guardado REAL NOT NULL,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS economia_historico (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            valor REAL NOT NULL,
            data DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS user_progresso (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            chave TEXT NOT NULL,
            marcado INTEGER NOT NULL DEFAULT 0,
            UNIQUE(user_id, chave),
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);
});

function calcularIdadeAPartirDeNascimento(dataNascimento) {
    const nascimento = new Date(`${dataNascimento}T00:00:00`);
    if (isNaN(nascimento.getTime())) return NaN;

    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const aindaNaoFezAniversario =
        hoje.getMonth() < nascimento.getMonth() ||
        (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
    if (aindaNaoFezAniversario) idade--;

    return idade;
}

app.get("/api/perfil", verificarToken, (req, res) => {
    const userId = req.usuarioLogado.id || req.usuarioLogado.userId || req.usuarioLogado.user_id;

    db.get("SELECT nome, idade, sexo, profissao, email, foto, username, data_nascimento FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Erro no banco." });
        }

        if (!row) {
            return res.status(404).json({ success: false, message: "Usuário não encontrado." });
        }
        
        res.json({ success: true, usuario: row });
    });
});

app.put("/api/perfil", verificarToken, (req, res) => {
    const userId = req.usuarioLogado.id || req.usuarioLogado.userId || req.usuarioLogado.user_id;
    const { nome, profissao, idade, sexo, username, email, dataNascimento } = req.body;

    const campos = [];
    const valores = [];

    if (nome !== undefined) {
        if (!nome.trim()) {
            return res.status(400).json({ success: false, message: "Informe um nome válido." });
        }
        campos.push("nome = ?");
        valores.push(nome.trim());
    }

    if (profissao !== undefined) {
        if (!profissao.trim()) {
            return res.status(400).json({ success: false, message: "Informe uma profissão válida." });
        }
        campos.push("profissao = ?");
        valores.push(profissao.trim());
    }

    if (idade !== undefined) {
        const idadeNumero = Number(idade);
        if (!Number.isInteger(idadeNumero) || idadeNumero < 1 || idadeNumero > 120) {
            return res.status(400).json({ success: false, message: "Informe uma idade válida." });
        }
        campos.push("idade = ?");
        valores.push(idadeNumero);
    }

    if (sexo !== undefined) {
        if (!sexo.trim()) {
            return res.status(400).json({ success: false, message: "Informe um sexo válido." });
        }
        campos.push("sexo = ?");
        valores.push(sexo.trim());
    }

    let idadeCalculadaDaData;
    if (dataNascimento !== undefined) {
        idadeCalculadaDaData = calcularIdadeAPartirDeNascimento(dataNascimento);
        const dataValida = /^\d{4}-\d{2}-\d{2}$/.test(dataNascimento) && new Date(`${dataNascimento}T00:00:00`) <= new Date();

        if (!dataValida || isNaN(idadeCalculadaDaData) || idadeCalculadaDaData < 1 || idadeCalculadaDaData > 120) {
            return res.status(400).json({ success: false, message: "Informe uma data de nascimento válida." });
        }

        campos.push("data_nascimento = ?");
        valores.push(dataNascimento);
        campos.push("idade = ?");
        valores.push(idadeCalculadaDaData);
    }

    if (username !== undefined && !/^[a-zA-Z0-9_.]{3,20}$/.test(username.trim())) {
        return res.status(400).json({ success: false, message: "Nome de usuário inválido: 3 a 20 caracteres (letras, números, _ ou .)." });
    }

    if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({ success: false, message: "Informe um e-mail válido." });
    }

    if (campos.length === 0 && username === undefined && email === undefined) {
        return res.status(400).json({ success: false, message: "Nenhum dado para atualizar." });
    }

    const verificarUsernameDuplicado = (callback) => {
        if (username === undefined) return callback(null);
        db.get("SELECT id FROM users WHERE username = ? AND id != ?", [username.trim(), userId], (err, row) => {
            if (err) return callback({ status: 500, message: "Erro ao verificar o nome de usuário." });
            if (row) return callback({ status: 400, message: "Esse nome de usuário já está em uso." });
            callback(null);
        });
    };

    const verificarEmailDuplicado = (callback) => {
        if (email === undefined) return callback(null);
        db.get("SELECT id FROM users WHERE email = ? AND id != ?", [email.trim(), userId], (err, row) => {
            if (err) return callback({ status: 500, message: "Erro ao verificar o e-mail." });
            if (row) return callback({ status: 400, message: "Esse e-mail já está sendo usado por outra conta." });
            callback(null);
        });
    };

    verificarUsernameDuplicado((erroUsername) => {
        if (erroUsername) return res.status(erroUsername.status).json({ success: false, message: erroUsername.message });

        verificarEmailDuplicado((erroEmail) => {
            if (erroEmail) return res.status(erroEmail.status).json({ success: false, message: erroEmail.message });

            if (username !== undefined) {
                campos.push("username = ?");
                valores.push(username.trim());
            }

            if (email !== undefined) {
                campos.push("email = ?");
                valores.push(email.trim());
            }

            valores.push(userId);

            db.run(`UPDATE users SET ${campos.join(", ")} WHERE id = ?`, valores, function (err) {
                if (err) {
                    return res.status(500).json({ success: false, message: "Erro ao atualizar o perfil." });
                }

                res.json({
                    success: true,
                    nome: nome !== undefined ? nome.trim() : undefined,
                    profissao: profissao !== undefined ? profissao.trim() : undefined,
                    idade: dataNascimento !== undefined ? idadeCalculadaDaData : (idade !== undefined ? Number(idade) : undefined),
                    dataNascimento: dataNascimento !== undefined ? dataNascimento : undefined,
                    sexo: sexo !== undefined ? sexo.trim() : undefined,
                    username: username !== username ? username.trim() : undefined,
                    email: email !== undefined ? email.trim() : undefined
                });
            });
        });
    });
});

app.post("/api/perfil/foto", verificarToken, (req, res) => {
    uploadFoto.single("foto")(req, res, (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message || "Erro ao enviar a imagem." });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Nenhuma imagem enviada." });
        }

        const userId = req.usuarioLogado.id || req.usuarioLogado.userId || req.usuarioLogado.user_id;
        const caminhoFoto = `/uploads/${req.file.filename}`;

        db.get("SELECT foto FROM users WHERE id = ?", [userId], (errBusca, row) => {
            const fotoAntiga = row && row.foto ? path.join(uploadsDir, path.basename(row.foto)) : null;

            db.run("UPDATE users SET foto = ? WHERE id = ?", [caminhoFoto, userId], (errUpdate) => {
                if (errUpdate) {
                    return res.status(500).json({ success: false, message: "Erro ao salvar a foto no banco." });
                }

                if (fotoAntiga && fs.existsSync(fotoAntiga)) {
                    fs.unlink(fotoAntiga, () => {});
                }

                res.json({ success: true, foto: caminhoFoto });
            });
        });
    });
});

// ==========================================
// INICIANDO O SERVIDOR (Porta dinâmica do Railway)
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
});