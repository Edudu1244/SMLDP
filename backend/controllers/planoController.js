const db = require("../config/database");

const salvarPlano = (req, res) => {
    const { paisDestino, estado, cidade, dataPretendida, quantidadePessoas, valorGuardado } = req.body;
    const usuarioLogado = req.usuarioLogado;
    const userId = usuarioLogado ? (usuarioLogado.id || usuarioLogado.userId || usuarioLogado.user_id) : null;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Usuário não autenticado."
        });
    }

    if (!paisDestino || !estado || !cidade || !dataPretendida || !quantidadePessoas || !valorGuardado) {
        return res.status(400).json({
            success: false,
            message: "Preencha todos os campos do plano antes de salvar."
        });
    }

    const query = `
        INSERT INTO planos (user_id, pais_destino, estado, cidade, data_pretendida, quantidade_pessoas, valor_guardado)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        query,
        [userId, paisDestino, estado, cidade, dataPretendida, quantidadePessoas, valorGuardado],
        function (err) {
            if (err) {
                console.error("Erro ao salvar plano:", err.message);
                return res.status(500).json({
                    success: false,
                    message: "Erro interno ao salvar o plano."
                });
            }

            return res.json({
                success: true,
                message: "Plano salvo com sucesso!",
                id: this.lastID
            });
        }
    );
};

module.exports = {
    salvarPlano
};
