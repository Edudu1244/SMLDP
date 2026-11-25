const express = require("express");
const router = express.Router();
const { calcularSimulacao } = require("../controllers/simulationController");
const { salvarPlano } = require("../controllers/planoController");
const verificarToken = require("../middleware/authMiddleware");

// 1. ROTA PÚBLICA (Coloque no topo! Sem o verificarToken)
router.get("/paises", (req, res) => {
    const db = require("../config/database");
    db.all("SELECT nome FROM countries ORDER BY nome ASC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Erro ao buscar países." });
        }
        res.json({ success: true, paises: rows });
    });
});

// 1.1 ROTA PÚBLICA COM OS INDICADORES DE CADA PAÍS (usada no gráfico do Perfil)
router.get("/paises/detalhes", (req, res) => {
    const db = require("../config/database");
    db.all(
        "SELECT nome, indice_desenvolvimento, qualidade_vida, dificuldade FROM countries ORDER BY nome ASC",
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Erro ao buscar detalhes dos países." });
            }
            res.json({ success: true, paises: rows });
        }
    );
});

// 2. ROTA PROTEGIDA (Esta sim precisa de token)
router.post("/simular", verificarToken, calcularSimulacao);

// 3. REGISTRA UMA COMPARAÇÃO ENTRE DOIS PAÍSES
router.post("/comparar", verificarToken, (req, res) => {
    const db = require("../config/database");
    const { pais1, pais2 } = req.body;
    const usuarioLogado = req.usuarioLogado;
    const userId = usuarioLogado.id || usuarioLogado.userId || usuarioLogado.user_id;

    if (!pais1 || !pais2) {
        return res.status(400).json({ success: false, message: "Informe os dois países comparados." });
    }

    db.run(
        "INSERT INTO comparisons (user_id, pais1, pais2) VALUES (?, ?, ?)",
        [userId, pais1, pais2],
        (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Erro ao registrar a comparação." });
            }
            res.json({ success: true });
        }
    );
});

// 4. ESTATÍSTICAS DO USUÁRIO (usadas no dashboard do Perfil)
router.get("/estatisticas", verificarToken, (req, res) => {
    const db = require("../config/database");
    const usuarioLogado = req.usuarioLogado;
    const userId = usuarioLogado.id || usuarioLogado.userId || usuarioLogado.user_id;

    db.get("SELECT COUNT(*) AS total FROM simulations WHERE user_id = ?", [userId], (errSim, simRow) => {
        if (errSim) {
            return res.status(500).json({ success: false, message: "Erro ao buscar simulações." });
        }

        db.get("SELECT COUNT(*) AS total FROM comparisons WHERE user_id = ?", [userId], (errComp, compRow) => {
            if (errComp) {
                return res.status(500).json({ success: false, message: "Erro ao buscar comparações." });
            }

            db.get("SELECT COUNT(*) AS total FROM favorites WHERE user_id = ?", [userId], (errFav, favRow) => {
                if (errFav) {
                    return res.status(500).json({ success: false, message: "Erro ao buscar favoritos." });
                }

                res.json({
                    success: true,
                    simulacoes: simRow.total,
                    comparacoes: compRow.total,
                    favoritos: favRow.total
                });
            });
        });
    });
});

// 5. LISTAR PAÍSES FAVORITOS DO USUÁRIO
router.get("/favoritos", verificarToken, (req, res) => {
    const db = require("../config/database");
    const usuarioLogado = req.usuarioLogado;
    const userId = usuarioLogado.id || usuarioLogado.userId || usuarioLogado.user_id;

    db.all("SELECT pais FROM favorites WHERE user_id = ? ORDER BY data_favoritado DESC", [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Erro ao buscar favoritos." });
        }
        res.json({ success: true, favoritos: rows.map(row => row.pais) });
    });
});

// 6. FAVORITAR UM PAÍS
router.post("/favoritos", verificarToken, (req, res) => {
    const db = require("../config/database");
    const { pais } = req.body;
    const usuarioLogado = req.usuarioLogado;
    const userId = usuarioLogado.id || usuarioLogado.userId || usuarioLogado.user_id;

    if (!pais) {
        return res.status(400).json({ success: false, message: "Informe o país a favoritar." });
    }

    db.run("INSERT OR IGNORE INTO favorites (user_id, pais) VALUES (?, ?)", [userId, pais], (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Erro ao favoritar o país." });
        }
        res.json({ success: true });
    });
});

// 7.1 HISTÓRICO DE SIMULAÇÕES DO USUÁRIO
router.get("/simulacoes/historico", verificarToken, (req, res) => {
    const db = require("../config/database");
    const usuarioLogado = req.usuarioLogado;
    const userId = usuarioLogado.id || usuarioLogado.userId || usuarioLogado.user_id;

    db.all(
        `SELECT pais_destino, indice_desenvolvimento, qualidade_vida, dificuldade, score_final, resultado, data_simulacao
         FROM simulations WHERE user_id = ? ORDER BY data_simulacao DESC LIMIT 10`,
        [userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Erro ao buscar histórico de simulações." });
            }
            res.json({ success: true, historico: rows });
        }
    );
});

// 7. REMOVER UM PAÍS DOS FAVORITOS
router.delete("/favoritos/:pais", verificarToken, (req, res) => {
    const db = require("../config/database");
    const usuarioLogado = req.usuarioLogado;
    const userId = usuarioLogado.id || usuarioLogado.userId || usuarioLogado.user_id;

    db.run("DELETE FROM favorites WHERE user_id = ? AND pais = ?", [userId, req.params.pais], (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Erro ao remover o favorito." });
        }
        res.json({ success: true });
    });
});

// 8. SALVA O PLANO DE MUDANÇA DO USUÁRIO ("Planeje sua Mudança", na tela de Simulação)
router.post("/plano", verificarToken, salvarPlano);

// 9. CHECKLIST DE PROGRESSO DA MUDANÇA (dashboard do Perfil)
const CHAVES_PROGRESSO = ["passaporte", "curriculo", "visto", "seguro", "passagem"];

router.get("/progresso", verificarToken, (req, res) => {
    const db = require("../config/database");
    const usuarioLogado = req.usuarioLogado;
    const userId = usuarioLogado.id || usuarioLogado.userId || usuarioLogado.user_id;

    db.all("SELECT chave, marcado FROM user_progresso WHERE user_id = ?", [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Erro ao buscar o progresso." });
        }

        const progresso = {};
        CHAVES_PROGRESSO.forEach((chave) => { progresso[chave] = false; });
        rows.forEach((row) => { progresso[row.chave] = !!row.marcado; });

        res.json({ success: true, progresso });
    });
});

router.put("/progresso", verificarToken, (req, res) => {
    const db = require("../config/database");
    const usuarioLogado = req.usuarioLogado;
    const userId = usuarioLogado.id || usuarioLogado.userId || usuarioLogado.user_id;
    const { chave, marcado } = req.body;

    if (!CHAVES_PROGRESSO.includes(chave)) {
        return res.status(400).json({ success: false, message: "Item de progresso inválido." });
    }

    db.run(
        `INSERT INTO user_progresso (user_id, chave, marcado) VALUES (?, ?, ?)
         ON CONFLICT(user_id, chave) DO UPDATE SET marcado = excluded.marcado`,
        [userId, chave, marcado ? 1 : 0],
        (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Erro ao salvar o progresso." });
            }
            res.json({ success: true });
        }
    );
});

// 10. VALOR ECONOMIZADO + HISTÓRICO (dashboard do Perfil)
router.get("/economia", verificarToken, (req, res) => {
    const db = require("../config/database");
    const usuarioLogado = req.usuarioLogado;
    const userId = usuarioLogado.id || usuarioLogado.userId || usuarioLogado.user_id;

    db.all(
        "SELECT valor, data FROM economia_historico WHERE user_id = ? ORDER BY data ASC",
        [userId],
        (err, historico) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Erro ao buscar a economia." });
            }

            db.get("SELECT meta_financeira_atingida FROM users WHERE id = ?", [userId], (errUser, row) => {
                if (errUser) {
                    return res.status(500).json({ success: false, message: "Erro ao buscar a economia." });
                }

                const valor = historico.length > 0 ? historico[historico.length - 1].valor : 0;
                res.json({
                    success: true,
                    valor,
                    historico,
                    metaAtingida: !!(row && row.meta_financeira_atingida)
                });
            });
        }
    );
});

router.post("/economia", verificarToken, (req, res) => {
    const db = require("../config/database");
    const usuarioLogado = req.usuarioLogado;
    const userId = usuarioLogado.id || usuarioLogado.userId || usuarioLogado.user_id;
    const { valor, metaAtingida } = req.body;

    const valorNumero = Number(valor);
    if (valor === undefined || isNaN(valorNumero) || valorNumero < 0) {
        return res.status(400).json({ success: false, message: "Informe um valor válido." });
    }

    // Um único registro por dia: se já existe um lançamento de hoje, atualiza; senão, cria um novo.
    db.get(
        "SELECT id FROM economia_historico WHERE user_id = ? AND DATE(data) = DATE('now') ORDER BY data DESC LIMIT 1",
        [userId],
        (errBusca, linhaHoje) => {
            if (errBusca) {
                return res.status(500).json({ success: false, message: "Erro ao salvar a economia." });
            }

            const salvarMetaAtingida = (callback) => {
                if (metaAtingida === undefined) return callback(null);
                db.run(
                    "UPDATE users SET meta_financeira_atingida = ? WHERE id = ?",
                    [metaAtingida ? 1 : 0, userId],
                    callback
                );
            };

            const continuar = (errEscrita) => {
                if (errEscrita) {
                    return res.status(500).json({ success: false, message: "Erro ao salvar a economia." });
                }
                salvarMetaAtingida((errMeta) => {
                    if (errMeta) {
                        return res.status(500).json({ success: false, message: "Erro ao salvar a economia." });
                    }
                    res.json({ success: true, valor: valorNumero });
                });
            };

            if (linhaHoje) {
                db.run(
                    "UPDATE economia_historico SET valor = ?, data = CURRENT_TIMESTAMP WHERE id = ?",
                    [valorNumero, linhaHoje.id],
                    continuar
                );
            } else {
                db.run(
                    "INSERT INTO economia_historico (user_id, valor) VALUES (?, ?)",
                    [userId, valorNumero],
                    continuar
                );
            }
        }
    );
});

// 11. RESULTADO DO QUIZ PAÍS IDEAL (usado pelo Assistente no Perfil)
router.get("/pais-ideal", verificarToken, (req, res) => {
    const db = require("../config/database");
    const usuarioLogado = req.usuarioLogado;
    const userId = usuarioLogado.id || usuarioLogado.userId || usuarioLogado.user_id;

    db.get("SELECT pais_ideal, pais_ideal_porcentagem FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Erro ao buscar o país ideal." });
        }

        if (!row || !row.pais_ideal) {
            return res.json({ success: true, resultado: null });
        }

        res.json({
            success: true,
            resultado: { chave: row.pais_ideal, porcentagem: row.pais_ideal_porcentagem }
        });
    });
});

router.post("/pais-ideal", verificarToken, (req, res) => {
    const db = require("../config/database");
    const usuarioLogado = req.usuarioLogado;
    const userId = usuarioLogado.id || usuarioLogado.userId || usuarioLogado.user_id;
    const { chave, porcentagem } = req.body;

    if (!chave || typeof chave !== "string") {
        return res.status(400).json({ success: false, message: "Informe o país ideal." });
    }

    db.run(
        "UPDATE users SET pais_ideal = ?, pais_ideal_porcentagem = ? WHERE id = ?",
        [chave, Number(porcentagem) || 0, userId],
        (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Erro ao salvar o país ideal." });
            }
            res.json({ success: true });
        }
    );
});

module.exports = router;