const API_URL = ""; // Usando rotas relativas para funcionar perfeitamente no Railway e local

// ==========================================
// ESTADO DO USUÁRIO CARREGADO DO BANCO
// ==========================================
let paisIdealResultado = null; // { chave, porcentagem } | null
let economiaHistoricoAtual = []; // [{ valor, data }]
let metaFinanceiraAtingidaServidor = false;
let graficoEconomiaChart = null;

// ==========================================
// CONQUISTAS (popup de canto + contador)
// ==========================================
let conquistaPopupTimeout = null;

function atualizarContadorConquistas() {
    const contador = document.querySelector(".conquistas-progresso");
    if (!contador) return;

    const total = document.querySelectorAll(".conquista-item").length;
    const desbloqueadas = document.querySelectorAll(".conquista-item.desbloqueada").length;
    contador.textContent = `${desbloqueadas} de ${total} desbloqueadas`;
}

function mostrarConquistaDesbloqueada(nome, icone) {
    const popup = document.getElementById("conquistaPopup");
    if (!popup) return;

    const iconeEl = document.getElementById("conquistaPopupIcone");
    const nomeEl = document.getElementById("conquistaPopupNome");

    if (iconeEl) iconeEl.textContent = icone || "🏆";
    if (nomeEl) nomeEl.textContent = nome;

    clearTimeout(conquistaPopupTimeout);
    popup.classList.remove("ativo");
    void popup.offsetWidth;
    popup.classList.add("ativo");

    conquistaPopupTimeout = setTimeout(() => {
        popup.classList.remove("ativo");
    }, 3200);
}

// ==========================================
// VALOR ECONOMIZADO (EDITÁVEL) + META FINANCEIRA
// ==========================================
const metaPorPais = {
    "Estados Unidos": 70000,
    "China": 40000,
    "Japão": 55000,
    "Portugal": 35000,
    "França": 50000,
    "Coreia do Sul": 45000,
    "Suíça": 90000
};

function obterPaisIdealAtual() {
    if (paisIdealResultado && metaPorPais[paisIdealResultado.chave]) return paisIdealResultado.chave;
    return "Estados Unidos";
}

function obterMetaFinanceira() {
    return metaPorPais[obterPaisIdealAtual()] || 50000;
}

// ==========================================
// COTAÇÃO DA MOEDA DO PAÍS ESCOLHIDO
// ==========================================
const cotacaoPorPais = {
    "Estados Unidos": { moeda: "USD", valores: [5.10, 5.20, 5.15, 5.30, 5.40, 5.35] },
    "China": { moeda: "CNY", valores: [0.70, 0.71, 0.70, 0.73, 0.74, 0.73] },
    "Japão": { moeda: "JPY", valores: [0.033, 0.034, 0.032, 0.035, 0.036, 0.034] },
    "Portugal": { moeda: "EUR", valores: [5.65, 5.72, 5.80, 5.78, 5.90, 5.85] },
    "França": { moeda: "EUR", valores: [5.65, 5.72, 5.80, 5.78, 5.90, 5.85] },
    "Coreia do Sul": { moeda: "KRW", valores: [0.0038, 0.0039, 0.0038, 0.0040, 0.0041, 0.0040] },
    "Suíça": { moeda: "CHF", valores: [5.90, 5.95, 6.00, 6.05, 6.10, 6.08] }
};

function obterCotacaoPaisAtual() {
    return cotacaoPorPais[obterPaisIdealAtual()] || cotacaoPorPais["Estados Unidos"];
}

function formatarCotacao(valor) {
    const casas = valor < 1 ? 4 : 2;
    return `R$ ${valor.toFixed(casas)}`;
}

function formatarMoeda(valor) {
    return `R$${Math.round(valor).toLocaleString("pt-BR")}`;
}

function atualizarGraficoEconomia() {
    if (!graficoEconomiaChart) return;

    graficoEconomiaChart.data.labels = economiaHistoricoAtual.map(item => new Date(`${item.data.replace(" ", "T")}Z`).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }));
    graficoEconomiaChart.data.datasets[0].data = economiaHistoricoAtual.map(item => item.valor);
    graficoEconomiaChart.update();
}

function criarConfete(container) {
    const cores = ["#22c55e", "#a3e635", "#facc15", "#38bdf8", "#f472b6", "#fb923c"];

    for (let i = 0; i < 60; i++) {
        const pedaco = document.createElement("span");
        pedaco.className = "confete";
        pedaco.style.left = `${Math.random() * 100}%`;
        pedaco.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
        pedaco.style.animationDelay = `${Math.random() * 0.6}s`;
        pedaco.style.animationDuration = `${2.2 + Math.random() * 1.4}s`;
        pedaco.style.transform = `rotate(${Math.random() * 360}deg)`;
        container.appendChild(pedaco);
    }
}

function abrirCelebracaoMeta(meta) {
    const overlay = document.getElementById("celebracaoMeta");
    if (!overlay) return;

    const confeteContainer = document.getElementById("celebracaoConfete");
    if (confeteContainer) {
        confeteContainer.innerHTML = "";
        criarConfete(confeteContainer);
    }

    const valorEl = document.getElementById("celebracaoMetaValor");
    if (valorEl) valorEl.textContent = formatarMoeda(meta);

    const paisEl = document.getElementById("celebracaoMetaPais");
    if (paisEl) paisEl.textContent = `para ir viver em ${obterPaisIdealAtual()}`;

    overlay.classList.add("ativo");
}

function fecharCelebracaoMeta() {
    const overlay = document.getElementById("celebracaoMeta");
    if (overlay) overlay.classList.remove("ativo");
}

function persistirMetaAtingida(valor, atingiuMeta) {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/api/economia`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ valor, metaAtingida: atingiuMeta })
    }).catch(erro => console.error("Erro ao salvar meta atingida:", erro));
}

function sincronizarConquistaMeta(valor) {
    const item = document.querySelector('.conquista-item[data-conquista="meta_financeira"]');
    if (!item) return;

    const meta = obterMetaFinanceira();
    const estavaAtingida = metaFinanceiraAtingidaServidor;
    const atingiuMeta = valor >= meta;

    const icone = item.querySelector(".conquista-icone");

    if (atingiuMeta) {
        item.classList.remove("bloqueada");
        item.classList.add("desbloqueada");
        if (icone) icone.textContent = item.dataset.icone;

        if (!estavaAtingida) {
            item.classList.remove("conquista-desbloqueando");
            void item.offsetWidth;
            item.classList.add("conquista-desbloqueando");

            mostrarConquistaDesbloqueada("Meta Financeira", item.dataset.icone);
            abrirCelebracaoMeta(meta);
        }
    } else {
        item.classList.remove("desbloqueada");
        item.classList.add("bloqueada");
        if (icone) icone.textContent = "🔒";
    }

    if (atingiuMeta !== estavaAtingida) {
        metaFinanceiraAtingidaServidor = atingiuMeta;
        persistirMetaAtingida(valor, atingiuMeta);
    }

    atualizarContadorConquistas();
}

function atualizarExibicaoEconomia(valor) {
    const elEconomia = document.getElementById("economia");
    if (elEconomia) elEconomia.textContent = formatarMoeda(valor);

    const elConvertido = document.getElementById("economiaConvertida");
    if (elConvertido) {
        const cotacao = obterCotacaoPaisAtual();
        const taxaAtual = cotacao.valores[cotacao.valores.length - 1];

        elConvertido.textContent = `≈ ${(valor / taxaAtual).toLocaleString("pt-BR", { maximumFractionDigits: 0 })} ${cotacao.moeda}`;
    }

    const meta = obterMetaFinanceira();

    const barraMeta = document.querySelector(".progresso-preenchimento.meta-financeira");
    if (barraMeta) {
        const percentual = Math.min(100, Math.round((valor / meta) * 100));
        barraMeta.style.width = `${percentual}%`;
        barraMeta.textContent = `${percentual}%`;
    }

    const textoMeta = document.getElementById("textoMetaFinanceira");
    if (textoMeta) textoMeta.textContent = `Meta: ${formatarMoeda(meta)} (${obterPaisIdealAtual()})`;

    const descConquistaMeta = document.getElementById("descConquistaMeta");
    if (descConquistaMeta) descConquistaMeta.textContent = `Economize ${formatarMoeda(meta)} para desbloquear`;

    const passoReserva = document.getElementById("iaPassoReserva");
    if (passoReserva) passoReserva.innerHTML = `<span class="passo-icone">💰</span> Ampliar a reserva financeira para ${formatarMoeda(meta)}`;

    sincronizarConquistaMeta(valor);
}

function definirEmailUsuario(email) {
    const elEmail = document.getElementById("emailUsuario");
    if (!elEmail) return;
    elEmail.textContent = email;
    elEmail.title = email;
}

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const fotoPerfil = document.getElementById("fotoPerfil");
    const inputFoto = document.getElementById("inputFoto");
    const headersAuth = { "Authorization": `Bearer ${token}` };

    try {
        const resposta = await fetch(`${API_URL}/api/perfil`, { method: "GET", headers: headersAuth });
        const data = await resposta.json();

        if (data.success) {
            const usuario = data.usuario;

            const nomeField = document.getElementById("nomeUsuario");
            if (nomeField) nomeField.textContent = usuario.nome.split(" ")[0];

            if (document.getElementById("perfilNome")) document.getElementById("perfilNome").textContent = usuario.nome;
            const elIdade = document.getElementById("perfilIdade");
            if (elIdade) {
                elIdade.textContent = `${usuario.idade} anos`;
                elIdade.dataset.valor = usuario.idade;
                elIdade.dataset.nascimento = usuario.data_nascimento || "";
            }
            if (document.getElementById("perfilSexo")) document.getElementById("perfilSexo").textContent = usuario.sexo;
            if (document.getElementById("perfilProfissao")) document.getElementById("perfilProfissao").textContent = usuario.profissao;
            if (document.getElementById("perfilUsername")) document.getElementById("perfilUsername").textContent = usuario.username || "—";
            if (document.getElementById("perfilEmail")) document.getElementById("perfilEmail").textContent = usuario.email;
            definirEmailUsuario(usuario.email);

            if (usuario.foto && fotoPerfil) {
                fotoPerfil.src = `${API_URL}${usuario.foto}`;
            }
        } else if (resposta.status === 401 || resposta.status === 403) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }
    } catch (erro) {
        console.error("Erro ao conectar à API de perfil:", erro);
    }

    try {
        const respostaStats = await fetch(`${API_URL}/api/estatisticas`, { method: "GET", headers: headersAuth });
        const stats = await respostaStats.json();

        if (stats.success) {
            const elSimulacoes = document.getElementById("simulacoes");
            const elComparacoes = document.getElementById("comparacoes");
            const elFavoritos = document.getElementById("favoritos");
            if (elSimulacoes) elSimulacoes.textContent = stats.simulacoes;
            if (elComparacoes) elComparacoes.textContent = stats.comparacoes;
            if (elFavoritos) elFavoritos.textContent = stats.favoritos;
        }
    } catch (erro) {
        console.error("Erro ao conectar à API de estatísticas:", erro);
    }

    let progressoSalvo = {};
    let economiaAtual = 0;

    try {
        const [respProgresso, respEconomia, respPaisIdeal] = await Promise.all([
            fetch(`${API_URL}/api/progresso`, { method: "GET", headers: headersAuth }),
            fetch(`${API_URL}/api/economia`, { method: "GET", headers: headersAuth }),
            fetch(`${API_URL}/api/pais-ideal`, { method: "GET", headers: headersAuth })
        ]);

        const [dataProgresso, dataEconomia, dataPaisIdeal] = await Promise.all([
            respProgresso.json(),
            respEconomia.json(),
            respPaisIdeal.json()
        ]);

        if (dataProgresso.success) progressoSalvo = dataProgresso.progresso;
        if (dataEconomia.success) {
            economiaAtual = dataEconomia.valor;
            economiaHistoricoAtual = dataEconomia.historico;
            metaFinanceiraAtingidaServidor = dataEconomia.metaAtingida;
        }
        if (dataPaisIdeal.success) paisIdealResultado = dataPaisIdeal.resultado;
    } catch (erro) {
        console.error("Erro ao conectar à API de progresso/economia/país ideal:", erro);
    }

    if (inputFoto) {
        inputFoto.addEventListener("change", async () => {
            const arquivo = inputFoto.files[0];
            if (!arquivo) return;

            if (!arquivo.type.startsWith("image/")) {
                alert("Selecione um arquivo de imagem válido.");
                return;
            }

            const formData = new FormData();
            formData.append("foto", arquivo);

            try {
                const resposta = await fetch(`${API_URL}/api/perfil/foto`, {
                    method: "POST",
                    headers: headersAuth,
                    body: formData
                });

                const data = await resposta.json();

                if (data.success) {
                    fotoPerfil.src = `${API_URL}${data.foto}?t=${Date.now()}`;
                } else {
                    alert(data.message || "Não foi possível enviar a foto.");
                }
            } catch (erro) {
                console.error("Erro ao enviar foto:", erro);
                alert("Não foi possível conectar ao servidor.");
            }
        });
    }

    atualizarExibicaoEconomia(economiaAtual);

    const cardEconomia = document.getElementById("cardEconomia");
    if (cardEconomia) {
        cardEconomia.addEventListener("click", () => {
            const modal = document.getElementById("modalEditarEconomia");
            const input = document.getElementById("inputNovaEconomia");
            const erro = document.getElementById("modalEconomiaErro");

            input.value = economiaAtual;
            erro.textContent = "";

            modal.classList.add("ativo");
            input.focus();
            input.select();
        });
    }

    const itensProgresso = document.querySelectorAll(".check-status-item");

    function atualizarProgressoMudanca() {
        const barra = document.getElementById("barraProgresso");
        if (!barra || itensProgresso.length === 0) return;

        const marcados = Array.from(itensProgresso).filter(item => item.dataset.marcado === "true").length;
        const percentual = Math.round((marcados / itensProgresso.length) * 100);

        barra.style.width = `${percentual}%`;
        barra.textContent = `${percentual}%`;
    }

    function sincronizarConquistaProgresso(botaoItem, animar) {
        const chave = botaoItem.dataset.conquista;
        if (!chave) return;

        const marcado = botaoItem.dataset.marcado === "true";
        const iconeStatus = botaoItem.querySelector(".check-status-icone");
        if (iconeStatus) iconeStatus.textContent = marcado ? "✅" : "⬜";

        const item = document.querySelector(`.conquista-item[data-conquista="${chave}"]`);
        if (item) {
            const icone = item.querySelector(".conquista-icone");
            const jaEstavaDesbloqueada = item.classList.contains("desbloqueada");

            if (marcado) {
                item.classList.remove("bloqueada");
                item.classList.add("desbloqueada");
                if (icone) icone.textContent = item.dataset.icone || icone.textContent;

                if (animar && !jaEstavaDesbloqueada) {
                    item.classList.remove("conquista-desbloqueando");
                    void item.offsetWidth;
                    item.classList.add("conquista-desbloqueando");
                    item.addEventListener("animationend", () => {
                        item.classList.remove("conquista-desbloqueando");
                    }, { once: true });

                    const nome = item.querySelector(".conquista-info strong")?.textContent || "Conquista";
                    mostrarConquistaDesbloqueada(nome, item.dataset.icone);
                }
            } else {
                item.classList.remove("desbloqueada");
                item.classList.add("bloqueada");
                if (icone) icone.textContent = "🔒";
            }
        }

        atualizarContadorConquistas();
        atualizarProgressoMudanca();
    }

    function salvarProgressoNoServidor(chave, marcado) {
        fetch(`${API_URL}/api/progresso`, {
            method: "PUT",
            headers: { ...headersAuth, "Content-Type": "application/json" },
            body: JSON.stringify({ chave, marcado })
        }).catch(erro => console.error("Erro ao salvar progresso:", erro));
    }

    itensProgresso.forEach((botaoItem) => {
        const chave = botaoItem.dataset.conquista;
        botaoItem.dataset.marcado = progressoSalvo[chave] ? "true" : "false";

        sincronizarConquistaProgresso(botaoItem, false);

        botaoItem.addEventListener("click", () => {
            const novoValor = botaoItem.dataset.marcado !== "true";
            botaoItem.dataset.marcado = String(novoValor);
            salvarProgressoNoServidor(chave, novoValor);
            sincronizarConquistaProgresso(botaoItem, true);
        });
    });

    // Gráficos
    const escuro = document.body.classList.contains("dark");
    const corTexto = escuro ? "#94a3b8" : "#55617a";
    const corGrade = escuro ? "rgba(255,255,255,.06)" : "rgba(15,23,42,.05)";

    const ctx = document.getElementById("graficoEconomia");
    if (ctx) {
        const canvasContexto = ctx.getContext("2d");
        const gradiente = canvasContexto.createLinearGradient(0, 0, 0, 280);
        gradiente.addColorStop(0, "rgba(34, 197, 94, 0.35)");
        gradiente.addColorStop(1, "rgba(34, 197, 94, 0)");

        graficoEconomiaChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: economiaHistoricoAtual.map(item => new Date(`${item.data.replace(" ", "T")}Z`).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })),
                datasets: [{
                    label: "Economia",
                    data: economiaHistoricoAtual.map(item => item.valor),
                    borderColor: "#16a34a",
                    backgroundColor: gradiente,
                    borderWidth: 3,
                    tension: 0.35,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#16a34a",
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { ticks: { color: corTexto }, grid: { display: false } },
                    y: {
                        ticks: { color: corTexto, callback: (valor) => formatarMoeda(valor) },
                        grid: { color: corGrade }
                    }
                }
            }
        });
    }
});

function fazerLogout(event) {
    event.preventDefault();
    localStorage.removeItem('token');
    window.location.href = 'inicial.html';
}