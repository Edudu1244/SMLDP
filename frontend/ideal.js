// ==========================
// PONTUAÇÃO DOS PAÍSES POR FATOR (0 a 10)
// ==========================

const paisesIdeal = {

    "Estados Unidos": {
        nome: "Estados Unidos",
        custoVida: 4,
        clima: 6,
        seguranca: 6,
        idioma: 5,
        trabalho: 9,
        educacao: 9,
        saude: 5,
        burocracia: 4
    },

    "China": {
        nome: "China",
        custoVida: 6,
        clima: 5,
        seguranca: 7,
        idioma: 1,
        trabalho: 7,
        educacao: 6,
        saude: 5,
        burocracia: 2
    },

    "Japão": {
        nome: "Japão",
        custoVida: 4,
        clima: 7,
        seguranca: 9,
        idioma: 1,
        trabalho: 7,
        educacao: 8,
        saude: 9,
        burocracia: 3
    },

    "Portugal": {
        nome: "Portugal",
        custoVida: 8,
        clima: 8,
        seguranca: 8,
        idioma: 9,
        trabalho: 4,
        educacao: 6,
        saude: 8,
        burocracia: 8
    },

    "França": {
        nome: "França",
        custoVida: 5,
        clima: 6,
        seguranca: 7,
        idioma: 3,
        trabalho: 6,
        educacao: 8,
        saude: 9,
        burocracia: 5
    },

    "Coreia do Sul": {
        nome: "Coreia do Sul",
        custoVida: 5,
        clima: 6,
        seguranca: 9,
        idioma: 1,
        trabalho: 7,
        educacao: 8,
        saude: 8,
        burocracia: 3
    },

    "Suíça": {
        nome: "Suíça",
        custoVida: 2,
        clima: 5,
        seguranca: 10,
        idioma: 2,
        trabalho: 9,
        educacao: 9,
        saude: 10,
        burocracia: 4
    }

};

const fatores = ["custoVida", "clima", "seguranca", "idioma", "trabalho", "educacao", "saude", "burocracia"];

const rotulosFatores = {
    custoVida: { texto: "Custo de vida", icone: "💰" },
    clima: { texto: "Clima", icone: "☀️" },
    seguranca: { texto: "Segurança", icone: "🛡️" },
    idioma: { texto: "Idioma", icone: "💬" },
    trabalho: { texto: "Trabalho", icone: "💼" },
    educacao: { texto: "Educação", icone: "🎓" },
    saude: { texto: "Saúde", icone: "🏥" },
    burocracia: { texto: "Facilidade de imigração", icone: "📝" }
};

const CHAVE_PESOS_SALVOS = "idealPesos";
const CHAVE_RESULTADO_SALVO = "idealResultado";

const sliders = {
    custoVida: document.getElementById("slCustoVida"),
    clima: document.getElementById("slClima"),
    seguranca: document.getElementById("slSeguranca"),
    idioma: document.getElementById("slIdioma"),
    trabalho: document.getElementById("slTrabalho"),
    educacao: document.getElementById("slEducacao"),
    saude: document.getElementById("slSaude"),
    burocracia: document.getElementById("slBurocracia")
};

const valores = {
    custoVida: document.getElementById("valCustoVida"),
    clima: document.getElementById("valClima"),
    seguranca: document.getElementById("valSeguranca"),
    idioma: document.getElementById("valIdioma"),
    trabalho: document.getElementById("valTrabalho"),
    educacao: document.getElementById("valEducacao"),
    saude: document.getElementById("valSaude"),
    burocracia: document.getElementById("valBurocracia")
};

// ==========================
// PREFERÊNCIAS SALVAS (localStorage)
// ==========================

function carregarPesosSalvos() {

    try {
        const salvos = JSON.parse(localStorage.getItem(CHAVE_PESOS_SALVOS));
        if (!salvos) return;

        fatores.forEach(fator => {
            if (salvos[fator] !== undefined) {
                sliders[fator].value = salvos[fator];
                valores[fator].textContent = salvos[fator];
            }
        });
    } catch (erro) {
        console.warn("Não foi possível carregar preferências salvas:", erro);
    }

}

function salvarPesosAtuais(pesos) {
    localStorage.setItem(CHAVE_PESOS_SALVOS, JSON.stringify(pesos));
}

// ==========================
// ATUALIZA VALOR EXIBIDO E RECALCULA AO VIVO
// ==========================

let debounceId = null;

fatores.forEach(fator => {

    sliders[fator].addEventListener("input", () => {

        valores[fator].textContent = sliders[fator].value;

        clearTimeout(debounceId);
        debounceId = setTimeout(calcularRanking, 150);

    });

});

// ==========================
// CÁLCULO DO RANKING
// ==========================

function calcularRanking() {

    const pesos = {};

    fatores.forEach(fator => {

        pesos[fator] = Number(sliders[fator].value);

    });

    salvarPesosAtuais(pesos);

    const somaPesos = fatores.reduce((soma, fator) => soma + pesos[fator], 0);

    const resultados = Object.entries(paisesIdeal).map(([chave, pais]) => {

        const pontuacao = fatores.reduce(
            (soma, fator) => soma + pesos[fator] * pais[fator],
            0
        );

        const porcentagem = somaPesos === 0
            ? 0
            : Math.round((pontuacao / (somaPesos * 10)) * 100);

        const destaques = encontrarDestaques(pais, pesos);

        return { chave, nome: pais.nome, porcentagem, destaques };

    });

    resultados.sort((a, b) => b.porcentagem - a.porcentagem);

    salvarResultadoIdeal(resultados[0]);

    renderizarRanking(resultados);

}

// ==========================
// RESULTADO DO TOPO (usado pelo Assistente no Perfil)
// ==========================

function salvarResultadoIdeal(melhor) {

    if (!melhor) return;

    localStorage.setItem(CHAVE_RESULTADO_SALVO, JSON.stringify({
        chave: melhor.chave,
        nome: melhor.nome,
        porcentagem: melhor.porcentagem
    }));

    sincronizarResultadoComServidor(melhor);

}

// Guarda o país ideal no banco (não só no navegador) — é o que o Assistente
// no Perfil consulta agora para recomendar cidades e calcular a meta financeira.
let sincronizarResultadoTimeout = null;

function sincronizarResultadoComServidor(melhor) {
    const token = localStorage.getItem("token");
    if (!token) return;

    clearTimeout(sincronizarResultadoTimeout);
    sincronizarResultadoTimeout = setTimeout(() => {
<<<<<<< HEAD
        // 🌟 ALTERADO PARA ROTA RELATIVA (Funciona no Railway e local)
        fetch("/api/pais-ideal", {
=======
        fetch("http://127.0.0.1:3000/api/pais-ideal", {
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ chave: melhor.chave, porcentagem: melhor.porcentagem })
        }).catch(erro => console.error("Erro ao salvar país ideal:", erro));
    }, 400);
}

// ==========================
// DESTAQUES: fatores mais valorizados onde o país se sai melhor
// ==========================

function encontrarDestaques(pais, pesos) {

    return fatores
        .filter(fator => pesos[fator] > 0 && pais[fator] >= 7)
        .sort((a, b) => (pesos[b] * pais[b]) - (pesos[a] * pais[a]))
        .slice(0, 2)
        .map(fator => `${rotulosFatores[fator].icone} ${rotulosFatores[fator].texto}`);

}

// ==========================
// RENDERIZAÇÃO
// ==========================

function renderizarRanking(resultados) {

    const container = document.getElementById("ranking");

    const medalhas = ["🥇", "🥈", "🥉"];

    container.innerHTML = resultados.map((item, index) => `

        <div class="ranking-item ${index === 0 ? "primeiro" : ""}" style="animation-delay:${index * .08}s">

            <div class="ranking-posicao">${medalhas[index] || index + 1}</div>

            <div class="ranking-info">
                <h3>${item.nome}</h3>
                <div class="barra-match">
                    <div class="barra-match-preenchimento" style="width:${item.porcentagem}%"></div>
                </div>
                ${item.destaques.length ? `<div class="ranking-destaques">${item.destaques.map(d => `<span>${d}</span>`).join("")}</div>` : ""}
            </div>

            <div class="ranking-porcentagem">${item.porcentagem}%</div>

        </div>

    `).join("");

}

// ==========================
// HEADER AO ROLAR
// ==========================

window.addEventListener("scroll", () => {

    const header = document.querySelector("header");
    const escuro = document.body.classList.contains("dark");

    if (window.scrollY > 30) {

        header.style.background = escuro ? "rgba(11,18,32,.95)" : "rgba(255,255,255,.98)";
        header.style.boxShadow = "0 10px 25px rgba(15,23,42,.08)";

    } else {

        header.style.background = escuro ? "rgba(11,18,32,.85)" : "rgba(255,255,255,.92)";
        header.style.boxShadow = "none";

    }

});

// ==========================
// EXECUÇÃO INICIAL
// ==========================

window.onload = () => {
    carregarPesosSalvos();
    calcularRanking();
<<<<<<< HEAD
};
=======
};
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
