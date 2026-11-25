const db = require("../config/database");

// Taxas usadas apenas se a cotação em tempo real falhar (API fora do ar, sem internet, etc)
const TAXAS_CAMBIO_FALLBACK = { USD: 5.5, EUR: 6.0, CAD: 4.0, AUD: 3.6, BRL: 1 };

async function buscarSalarioEmReais(moeda, valorNaMoedaLocal) {
    if (!moeda || !valorNaMoedaLocal) return null;
    if (moeda === "BRL") return Math.round(valorNaMoedaLocal);

    try {
        const resposta = await fetch(
            `https://api.frankfurter.app/latest?amount=${valorNaMoedaLocal}&from=${moeda}&to=BRL`
        );
        if (!resposta.ok) throw new Error(`Cotação retornou status ${resposta.status}`);

        const dados = await resposta.json();
        if (!dados.rates || typeof dados.rates.BRL !== "number") {
            throw new Error("Resposta da cotação sem valor em BRL");
        }
        return Math.round(dados.rates.BRL);
    } catch (erro) {
        console.error("⚠️ Cotação em tempo real indisponível, usando taxa aproximada:", erro.message);
        const taxaFallback = TAXAS_CAMBIO_FALLBACK[moeda];
        return taxaFallback ? Math.round(valorNaMoedaLocal * taxaFallback) : null;
    }
}

function categorizarSaude(qualidadeVida) {
    if (qualidadeVida >= 8) return "Alta";
    if (qualidadeVida >= 5) return "Média";
    return "Baixa";
}

const calcularSimulacao = async (req, res) => {
    // 1. Pega o país vindo do corpo da requisição de simulação
    const { paisDestino } = req.body;
    const usuarioLogado = req.usuarioLogado; // Injetado pelo verificarToken

    if (!paisDestino) {
        return res.status(400).json({
            success: false,
            message: "Por favor, selecione um país para simular."
        });
    }

    // 2. Faz o SELECT no banco SQLite buscando o país pelo nome de forma insensível a maiúsculas/minúsculas
    const query = "SELECT * FROM countries WHERE LOWER(nome) = LOWER(?)";

    db.get(query, [paisDestino], async (err, row) => {
        if (err) {
            console.error("Erro ao consultar o banco:", err);
            return res.status(500).json({
                success: false,
                message: "Erro interno ao processar a simulação."
            });
        }

        if (!row) {
            return res.status(404).json({
                success: false,
                message: "Dados deste país ainda não foram cadastrados no simulador."
            });
        }

        /* 3. LÓGICA DE SIMULAÇÃO MATEMÁTICA REAL
           Calcula o score de aproveitamento de 0 a 100%, combinando 3 fatores normalizados para 0-100:
           - Qualidade de vida (peso 40%)
           - Índice de Desenvolvimento / IDH, 0-1 (peso 35%)
           - Facilidade de migração, ou seja, o inverso da dificuldade (peso 25%)
        */
        const qualidadeNormalizada = row.qualidade_vida * 10;
        const idhNormalizado = row.indice_desenvolvimento * 100;
        const facilidadeMigracaoNormalizada = (10 - row.dificuldade) * 10;

        let scoreFinal = Math.round(
            (qualidadeNormalizada * 0.4) +
            (idhNormalizado * 0.35) +
            (facilidadeMigracaoNormalizada * 0.25)
        );

        // Garante travas limites de margem de exibição percentual
        if (scoreFinal > 100) scoreFinal = 100;
        if (scoreFinal < 0) scoreFinal = 0;

        // Determinação de Diagnóstico Comportamental
        let resultadoTexto = "";
        if (scoreFinal >= 80) {
            resultadoTexto = "Altamente Recomendável! Excelente balanço entre qualidade e desenvolvimento.";
        } else if (scoreFinal >= 50) {
            resultadoTexto = "Viável, mas exige planejamento financeiro sólido e atenção aos custos.";
        } else {
            resultadoTexto = "Complexo. Barreiras imigratórias severas ou custo de vida desproporcional.";
        }

        // 4. Salva a simulação no Histórico do banco de dados
        const userId = usuarioLogado ? (usuarioLogado.id || usuarioLogado.userId || usuarioLogado.user_id) : null;

        if (userId) {
            const insereHistorico = `
                INSERT INTO simulations (user_id, pais_destino, indice_desenvolvimento, qualidade_vida, dificuldade, score_final, resultado)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            db.run(insereHistorico, [userId, row.nome, row.indice_desenvolvimento, row.qualidade_vida, row.dificuldade, scoreFinal, resultadoTexto], function (err) {
                if (err) {
                    console.error("Erro ao salvar simulação no histórico:", err.message);
                } else {
                    console.log(`✅ Simulação salva para o usuário ${userId}. País: ${row.nome}`);
                }
            });
        }

        // 5. Converte o salário médio para reais e categoriza a saúde
        const salarioBRL = await buscarSalarioEmReais(row.moeda, row.salario_medio);
        const saude = categorizarSaude(row.qualidade_vida);

        // 6. Retorna a resposta limpa e mapeada perfeitamente com os ID's do Front-End
        return res.json({
            success: true,
            paisDestino: row.nome,
            indiceDesenvolvimento: row.indice_desenvolvimento,
            saude,
            dificuldade: row.dificuldade,
            scoreFinal: scoreFinal,
            resultado: resultadoTexto,
            salarioMedio: row.salario_medio,
            moeda: row.moeda,
            salarioBRL,
            idioma: row.idioma,
            dificuldadeIdioma: row.dificuldade_idioma,
            clima: row.clima
        });
    });
};

module.exports = {
    calcularSimulacao
};
