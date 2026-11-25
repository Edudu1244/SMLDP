<<<<<<< HEAD
const API_URL = ""; // Usando rotas relativas para funcionar perfeitamente no Railway e local

// ==========================================
// ESTADO DO USUÁRIO CARREGADO DO BANCO
=======
const API_URL = "http://127.0.0.1:3000";

// ==========================================
// ESTADO DO USUÁRIO CARREGADO DO BANCO (preenchido no DOMContentLoaded,
// lido pelas funções abaixo — nada disso mora mais no localStorage)
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
// ==========================================
let paisIdealResultado = null; // { chave, porcentagem } | null
let economiaHistoricoAtual = []; // [{ valor, data }]
let metaFinanceiraAtingidaServidor = false;
let graficoEconomiaChart = null;

// ==========================================
<<<<<<< HEAD
// CONQUISTAS (popup de canto + contador)
=======
// CONQUISTAS (popup de canto + contador) — funções globais,
// usadas tanto pelo checklist quanto pela meta financeira
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
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
<<<<<<< HEAD
    void popup.offsetWidth;
=======
    void popup.offsetWidth; // reinicia a animação
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
    popup.classList.add("ativo");

    conquistaPopupTimeout = setTimeout(() => {
        popup.classList.remove("ativo");
    }, 3200);
}

// ==========================================
// VALOR ECONOMIZADO (EDITÁVEL) + META FINANCEIRA
<<<<<<< HEAD
=======
// (a meta varia conforme o resultado do quiz País Ideal — mesma lista de
// países usada em ideal.js e populada no banco em backend/server.js)
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
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
<<<<<<< HEAD
=======
// (valores ilustrativos em R$, últimos 6 meses)
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
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
<<<<<<< HEAD
=======
    // Moedas de valor unitário muito baixo (ex: Won, Iene) precisam de mais casas
    // decimais, senão toFixed(2) arredonda tudo para "R$ 0,00".
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
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

<<<<<<< HEAD
=======
// Guarda no banco se a meta já foi batida, para saber (mesmo em outra sessão)
// se deve celebrar de novo ou só manter a conquista desbloqueada em silêncio.
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
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

<<<<<<< HEAD
        if (!estavaAtingida) {
            item.classList.remove("conquista-desbloqueando");
            void item.offsetWidth;
=======
        // Só celebra na transição de "não atingida" para "atingida",
        // assim ela aparece de novo toda vez que a meta é batida de fato.
        if (!estavaAtingida) {
            item.classList.remove("conquista-desbloqueando");
            void item.offsetWidth; // reinicia a animação
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
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

<<<<<<< HEAD
=======
// E-mails longos são truncados com "..." no espaço estreito da barra lateral;
// o title exibe o endereço completo ao passar o mouse.
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
function definirEmailUsuario(email) {
    const elEmail = document.getElementById("emailUsuario");
    if (!elEmail) return;
    elEmail.textContent = email;
    elEmail.title = email;
}

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

<<<<<<< HEAD
=======
    // 1. TRAVA DE SEGURANÇA
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const fotoPerfil = document.getElementById("fotoPerfil");
    const inputFoto = document.getElementById("inputFoto");
    const headersAuth = { "Authorization": `Bearer ${token}` };

<<<<<<< HEAD
=======
    // 2. BUSCANDO DADOS REAIS DO BANCO
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
    try {
        const resposta = await fetch(`${API_URL}/api/perfil`, { method: "GET", headers: headersAuth });
        const data = await resposta.json();

        if (data.success) {
            const usuario = data.usuario;

<<<<<<< HEAD
            const nomeField = document.getElementById("nomeUsuario");
            if (nomeField) nomeField.textContent = usuario.nome.split(" ")[0];

=======
            // Pega só o primeiro nome para a saudação lateral
            const nomeField = document.getElementById("nomeUsuario");
            if (nomeField) nomeField.textContent = usuario.nome.split(" ")[0];

            // Preenche os cards de perfil
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
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

<<<<<<< HEAD
=======
            // Foto de perfil salva no servidor (persiste entre sessões e após editar o nome)
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
            if (usuario.foto && fotoPerfil) {
                fotoPerfil.src = `${API_URL}${usuario.foto}`;
            }
        } else if (resposta.status === 401 || resposta.status === 403) {
<<<<<<< HEAD
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
=======
            // Token realmente inválido/expirado (não apenas um erro passageiro do servidor).
            // Limpa e manda pro login.
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        } else {
            // Erro do servidor (ex: banco temporariamente indisponível) — não é motivo
            // para derrubar a sessão do usuário, então só avisa e segue com o resto da página.
            console.error("Erro ao buscar perfil:", data.message);
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
        }
    } catch (erro) {
        console.error("Erro ao conectar à API de perfil:", erro);
    }

<<<<<<< HEAD
=======
    // ==========================================
    // 2.1 ESTATÍSTICAS REAIS (simulações, comparações e favoritos do usuário)
    // ==========================================
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
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

<<<<<<< HEAD
=======
    // ==========================================
    // 2.2 PROGRESSO, ECONOMIA E PAÍS IDEAL (agora dados reais do usuário no banco)
    // ==========================================
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
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

<<<<<<< HEAD
=======
    // ==========================================
    // FOTO DE PERFIL (enviada para o servidor)
    // ==========================================
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
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

<<<<<<< HEAD
=======
    // Limpa o erro de um campo do modal "Editar dados pessoais" assim que o usuário volta a digitar
    CAMPOS_MODAL_DADOS.forEach(([inputId, erroId]) => {
        const input = document.getElementById(inputId);
        if (!input) return;
        input.addEventListener("input", () => {
            input.classList.remove("campo-invalido");
            document.getElementById(erroId).textContent = "";
        });
    });

    // ==========================================
    // 2.3 VALOR ECONOMIZADO (EDITÁVEL)
    // ==========================================
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
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

<<<<<<< HEAD
=======
    // ==========================================
    // 3. PROGRESSO DA MUDANÇA (itens clicáveis + conquistas)
    // ==========================================
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
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
<<<<<<< HEAD
                    void item.offsetWidth;
=======
                    void item.offsetWidth; // reinicia a animação
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
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

<<<<<<< HEAD
    // Gráficos
=======
    // ==========================================
    // 3.1 ASSISTENTE IA (sincronizado com a página País Ideal + dados
    // reais de estados/cidades de dadosPaises.js)
    // ==========================================
    const iconesTagCidade = {
        "💼": "fa-briefcase",
        "🏥": "fa-heart-pulse",
        "💰": "fa-sack-dollar"
    };

    function renderizarTagCidade(tag) {
        const [emoji, ...resto] = tag.split(" ");
        const icone = iconesTagCidade[emoji] || "fa-circle-info";
        return `<i class="fa-solid ${icone}"></i> ${resto.join(" ")}`;
    }

    // Uma cidade por estado (os 3 com melhor economia/saúde/empregos),
    // com uma tag explicando por que aquele estado se destaca.
    function obterCidadesRecomendadas(pais) {
        const estados = (typeof ESTADOS_POR_PAIS !== "undefined" && ESTADOS_POR_PAIS[pais]) || [];

        return estados.map(estado => {
            const stats = [
                { icone: "💰", label: "Economia", valor: estado.economia },
                { icone: "🏥", label: "Saúde", valor: estado.saude },
                { icone: "💼", label: "Empregos", valor: estado.empregos }
            ];
            const melhor = stats.reduce((a, b) => (b.valor > a.valor ? b : a));

            return {
                nome: estado.cidades[0].nome,
                tag: `${melhor.icone} ${melhor.label} ${melhor.valor}/10 em ${estado.nome}`
            };
        });
    }

    function atualizarAssistenteIA() {
        const chavePais = (typeof ESTADOS_POR_PAIS !== "undefined" && ESTADOS_POR_PAIS[obterPaisIdealAtual()])
            ? obterPaisIdealAtual()
            : "Estados Unidos";
        const porcentagem = (paisIdealResultado && paisIdealResultado.chave === chavePais) ? paisIdealResultado.porcentagem : null;
        const bandeira = (typeof BANDEIRA_POR_PAIS !== "undefined" && BANDEIRA_POR_PAIS[chavePais]) || "";
        const cidadesRecomendadas = obterCidadesRecomendadas(chavePais);

        const progressoAtual = document.getElementById("barraProgresso")?.textContent.trim() || "0%";

        const textoRecomendacao = document.getElementById("iaTextoRecomendacao");
        if (textoRecomendacao) {
            textoRecomendacao.innerHTML = porcentagem !== null
                ? `Com base nas suas respostas em <strong>País Ideal</strong>, o <strong>${bandeira} ${chavePais}</strong> é a melhor opção pra você, com ${porcentagem}% de compatibilidade. Você já está em ${progressoAtual} do progresso!`
                : `Com base no seu perfil, o <strong>${bandeira} ${chavePais}</strong> continua sendo a melhor opção. Ajuste suas preferências em <strong>País Ideal</strong> para uma recomendação personalizada. Você já está em ${progressoAtual} do progresso!`;
        }

        const cidadesTitulo = document.getElementById("iaCidadesTitulo");
        if (cidadesTitulo) {
            cidadesTitulo.textContent = `🏙️ Melhores cidades em ${chavePais} para você`;
        }

        const passoMoradia = document.getElementById("iaPassoMoradia");
        if (passoMoradia && cidadesRecomendadas[0]) {
            passoMoradia.innerHTML = `<span class="passo-icone">🏠</span> Pesquisar opções de moradia em ${cidadesRecomendadas[0].nome}`;
        }

        const cidadesGrid = document.getElementById("iaCidadesGrid");
        if (cidadesGrid) {
            cidadesGrid.innerHTML = cidadesRecomendadas.map(cidade => `
                <div class="ia-cidade-card">
                    <div class="ia-cidade-img ia-cidade-img-placeholder" data-cidade="${cidade.nome}"><i class="fa-solid fa-city"></i></div>
                    <div class="ia-cidade-corpo">
                        <div class="ia-cidade-nome">${cidade.nome}</div>
                        <div class="ia-cidade-tag">${renderizarTagCidade(cidade.tag)}</div>
                    </div>
                </div>
            `).join("");

            // Busca as fotos em segundo plano, sem travar a exibição dos cards
            if (typeof buscarImagemCidade === "function") {
                cidadesGrid.querySelectorAll(".ia-cidade-img-placeholder").forEach((placeholder) => {
                    const nomeCidade = placeholder.dataset.cidade;
                    buscarImagemCidade(nomeCidade).then((url) => {
                        if (!url) return;
                        const img = document.createElement("img");
                        img.className = "ia-cidade-img";
                        img.src = url;
                        img.alt = `Foto de ${nomeCidade}`;
                        img.loading = "lazy";
                        placeholder.replaceWith(img);
                    });
                });
            }
        }
    }

    atualizarAssistenteIA();

    // ==========================================
    // 4. GRÁFICOS (CHART.JS)
    // ==========================================
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
    const escuro = document.body.classList.contains("dark");
    const corTexto = escuro ? "#94a3b8" : "#55617a";
    const corGrade = escuro ? "rgba(255,255,255,.06)" : "rgba(15,23,42,.05)";

<<<<<<< HEAD
=======
    // 4.1 Evolução da economia (histórico real, guardado a cada edição do valor)
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
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
<<<<<<< HEAD
                    pointBorderWidth: 2
=======
                    pointBorderWidth: 2,
                    pointHoverBackgroundColor: "#16a34a",
                    pointHoverBorderColor: "#ffffff"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { intersect: false, mode: "index" },
                animation: { duration: 900, easing: "easeOutQuart" },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: escuro ? "#111827" : "#ffffff",
                        titleColor: corTexto,
                        bodyColor: escuro ? "#f1f5f9" : "#0f172a",
                        borderColor: "rgba(34, 197, 94, 0.3)",
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 10,
                        displayColors: false,
                        callbacks: {
                            label: (item) => formatarMoeda(item.parsed.y)
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: corTexto },
                        grid: { display: false },
                        border: { color: corGrade }
                    },
                    y: {
                        ticks: {
                            color: corTexto,
                            callback: (valor) => formatarMoeda(valor)
                        },
                        grid: { color: corGrade, borderDash: [4, 4] },
                        border: { display: false }
                    }
                }
            }
        });
    }

    // 4.2 Cotação da moeda do país escolhido
    const paisEscolhido = obterPaisIdealAtual();
    const tituloRendaPais = document.getElementById("graficoRendaPais");
    if (tituloRendaPais) tituloRendaPais.textContent = paisEscolhido;

    const ctxRenda = document.getElementById("graficoRenda");
    if (ctxRenda) {
        const cotacao = obterCotacaoPaisAtual();

        new Chart(ctxRenda, {
            type: "line",
            data: {
                labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
                datasets: [{
                    label: `Cotação do ${cotacao.moeda} em R$`,
                    data: cotacao.valores,
                    borderColor: "#22c55e",
                    backgroundColor: "rgba(34, 197, 94, 0.12)",
                    borderWidth: 4,
                    tension: .4,
                    fill: true
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
<<<<<<< HEAD
                    legend: { display: false }
                },
                scales: {
                    x: { ticks: { color: corTexto }, grid: { display: false } },
                    y: {
                        ticks: { color: corTexto, callback: (valor) => formatarMoeda(valor) },
=======
                    legend: { labels: { color: corTexto } },
                    tooltip: {
                        callbacks: {
                            label: (item) => ` ${formatarCotacao(item.raw)}`
                        }
                    }
                },
                scales: {
                    x: { ticks: { color: corTexto }, grid: { color: corGrade } },
                    y: {
                        ticks: {
                            color: corTexto,
                            callback: (valor) => formatarCotacao(valor)
                        },
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
                        grid: { color: corGrade }
                    }
                }
            }
        });
    }
<<<<<<< HEAD
=======

    // ==========================================
    // 5. ANIMAÇÃO DOS NÚMEROS
    // ==========================================
    const numeros = document.querySelectorAll(".stat-card h2");

    numeros.forEach(numero => {
        const texto = numero.innerText;

        if (!isNaN(parseInt(texto))) {
            let atual = 0;
            const alvo = parseInt(texto);
            const intervalo = setInterval(() => {
                atual++;
                numero.innerText = atual;
                if (atual >= alvo) {
                    clearInterval(intervalo);
                    numero.innerText = alvo;
                }
            }, 40);
        }
    });
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
});

function fazerLogout(event) {
    event.preventDefault();
    localStorage.removeItem('token');
    window.location.href = 'inicial.html';
<<<<<<< HEAD
}
=======
}

const CAMPOS_MODAL_DADOS = [
    ["inputNovoNome", "erroNovoNome"],
    ["inputNovoUsername", "erroNovoUsername"],
    ["inputNovoEmail", "erroNovoEmail"],
    ["inputNovaDataNascimento", "erroNovaIdade"],
    ["inputNovaProfissao", "erroNovaProfissao"]
];

function calcularIdadeAPartirDeNascimento(dataNascimento) {
    const nascimento = new Date(dataNascimento);
    if (isNaN(nascimento.getTime())) return NaN;

    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const aindaNaoFezAniversario =
        hoje.getMonth() < nascimento.getMonth() ||
        (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
    if (aindaNaoFezAniversario) idade--;

    return idade;
}

function limparErrosDados() {
    document.getElementById("modalDadosErro").textContent = "";
    CAMPOS_MODAL_DADOS.forEach(([inputId, erroId]) => {
        document.getElementById(inputId).classList.remove("campo-invalido");
        document.getElementById(erroId).textContent = "";
    });
}

function marcarCampoInvalido(inputId, erroId, mensagem) {
    document.getElementById(inputId).classList.add("campo-invalido");
    document.getElementById(erroId).textContent = mensagem;
}

function editarDadosPessoais() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const modal = document.getElementById("modalEditarDados");

    const usernameAtual = document.getElementById("perfilUsername")?.textContent || "";
    document.getElementById("inputNovoNome").value = document.getElementById("perfilNome")?.textContent || "";
    document.getElementById("inputNovoUsername").value = usernameAtual === "—" ? "" : usernameAtual;
    document.getElementById("inputNovoEmail").value = document.getElementById("perfilEmail")?.textContent || "";

    const inputDataNascimento = document.getElementById("inputNovaDataNascimento");
    const elPerfilIdade = document.getElementById("perfilIdade");
    const nascimentoSalvo = elPerfilIdade?.dataset.nascimento;
    const idadeAtual = elPerfilIdade?.dataset.valor;
    const hoje = new Date();
    inputDataNascimento.max = hoje.toISOString().slice(0, 10);

    if (nascimentoSalvo) {
        inputDataNascimento.value = nascimentoSalvo;
    } else if (idadeAtual) {
        // Ainda não temos a data de nascimento real salva (conta criada antes desse campo existir);
        // estimamos uma data que resulta na idade já cadastrada, só como ponto de partida.
        const anoNascimentoEstimado = hoje.getFullYear() - Number(idadeAtual);
        const mes = String(hoje.getMonth() + 1).padStart(2, "0");
        const dia = String(hoje.getDate()).padStart(2, "0");
        inputDataNascimento.value = `${anoNascimentoEstimado}-${mes}-${dia}`;
    } else {
        inputDataNascimento.value = "";
    }

    document.getElementById("inputNovoSexo").value = document.getElementById("perfilSexo")?.textContent || "Masculino";
    document.getElementById("inputNovaProfissao").value = document.getElementById("perfilProfissao")?.textContent || "";
    limparErrosDados();

    modal.classList.add("ativo");
    document.body.classList.add("modal-aberto");
    const inputNome = document.getElementById("inputNovoNome");
    inputNome.focus();
    inputNome.select();
}

function fecharModalDados() {
    document.getElementById("modalEditarDados").classList.remove("ativo");
    document.body.classList.remove("modal-aberto");
}

async function salvarDadosPessoais() {
    const token = localStorage.getItem("token");
    const inputNome = document.getElementById("inputNovoNome");
    const inputUsername = document.getElementById("inputNovoUsername");
    const inputEmail = document.getElementById("inputNovoEmail");
    const inputDataNascimento = document.getElementById("inputNovaDataNascimento");
    const inputSexo = document.getElementById("inputNovoSexo");
    const inputProfissao = document.getElementById("inputNovaProfissao");
    const erro = document.getElementById("modalDadosErro");
    const btnSalvar = document.getElementById("btnSalvarDados");

    const nome = inputNome.value.trim();
    const username = inputUsername.value.trim();
    const email = inputEmail.value.trim();
    const idade = calcularIdadeAPartirDeNascimento(inputDataNascimento.value);
    const sexo = inputSexo.value;
    const profissao = inputProfissao.value.trim();

    limparErrosDados();

    let valido = true;

    if (!nome) {
        marcarCampoInvalido("inputNovoNome", "erroNovoNome", "Informe seu nome.");
        valido = false;
    }
    if (!/^[a-zA-Z0-9_.]{3,20}$/.test(username)) {
        marcarCampoInvalido("inputNovoUsername", "erroNovoUsername", "3 a 20 caracteres: letras, números, _ ou .");
        valido = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        marcarCampoInvalido("inputNovoEmail", "erroNovoEmail", "Informe um e-mail válido.");
        valido = false;
    }
    if (inputDataNascimento.value.trim() === "" || isNaN(idade) || idade < 1 || idade > 120) {
        marcarCampoInvalido("inputNovaDataNascimento", "erroNovaIdade", "Informe uma data de nascimento válida.");
        valido = false;
    }
    if (!profissao) {
        marcarCampoInvalido("inputNovaProfissao", "erroNovaProfissao", "Informe sua profissão.");
        valido = false;
    }

    if (!valido) return;

    btnSalvar.disabled = true;
    btnSalvar.textContent = "Salvando...";

    try {
        const resposta = await fetch(`${API_URL}/api/perfil`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, username, email, dataNascimento: inputDataNascimento.value, sexo, profissao })
        });

        const data = await resposta.json();

        if (data.success) {
            if (document.getElementById("perfilNome")) document.getElementById("perfilNome").textContent = data.nome;
            if (document.getElementById("nomeUsuario")) document.getElementById("nomeUsuario").textContent = data.nome.split(" ")[0];
            if (document.getElementById("perfilUsername")) document.getElementById("perfilUsername").textContent = data.username || "—";
            if (document.getElementById("perfilEmail")) document.getElementById("perfilEmail").textContent = data.email;
            definirEmailUsuario(data.email);
            const elIdade = document.getElementById("perfilIdade");
            if (elIdade) {
                elIdade.textContent = `${data.idade} anos`;
                elIdade.dataset.valor = data.idade;
                elIdade.dataset.nascimento = data.dataNascimento || "";
            }
            if (document.getElementById("perfilSexo")) document.getElementById("perfilSexo").textContent = data.sexo;
            if (document.getElementById("perfilProfissao")) document.getElementById("perfilProfissao").textContent = data.profissao;
            fecharModalDados();
        } else if (data.message && data.message.includes("usuário")) {
            marcarCampoInvalido("inputNovoUsername", "erroNovoUsername", data.message);
        } else if (data.message && data.message.includes("e-mail")) {
            marcarCampoInvalido("inputNovoEmail", "erroNovoEmail", data.message);
        } else {
            erro.textContent = data.message || "Não foi possível atualizar os dados.";
        }
    } catch (erroRede) {
        console.error("Erro ao atualizar dados pessoais:", erroRede);
        erro.textContent = "Não foi possível conectar ao servidor.";
    } finally {
        btnSalvar.disabled = false;
        btnSalvar.textContent = "Salvar";
    }
}

function fecharModalEconomia() {
    document.getElementById("modalEditarEconomia").classList.remove("ativo");
}

async function salvarNovaEconomia() {
    const token = localStorage.getItem("token");
    const input = document.getElementById("inputNovaEconomia");
    const erro = document.getElementById("modalEconomiaErro");
    const btnSalvar = document.getElementById("btnSalvarEconomia");

    const valor = Number(input.value);

    if (input.value.trim() === "" || isNaN(valor) || valor < 0) {
        erro.textContent = "Informe um valor válido.";
        return;
    }

    erro.textContent = "";
    if (btnSalvar) {
        btnSalvar.disabled = true;
        btnSalvar.textContent = "Salvando...";
    }

    try {
        const resposta = await fetch(`${API_URL}/api/economia`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ valor })
        });

        const data = await resposta.json();

        if (!data.success) {
            erro.textContent = data.message || "Não foi possível salvar o valor.";
            return;
        }

        const hoje = new Date().toISOString().slice(0, 10);
        const ultimoEhHoje = economiaHistoricoAtual.length > 0 && economiaHistoricoAtual[economiaHistoricoAtual.length - 1].data.slice(0, 10) === hoje;
        const novoRegistro = { valor, data: new Date().toISOString().slice(0, 19).replace("T", " ") };

        if (ultimoEhHoje) {
            economiaHistoricoAtual[economiaHistoricoAtual.length - 1] = novoRegistro;
        } else {
            economiaHistoricoAtual.push(novoRegistro);
        }

        atualizarExibicaoEconomia(valor);
        atualizarGraficoEconomia();
        fecharModalEconomia();
    } catch (erroRede) {
        console.error("Erro ao salvar economia:", erroRede);
        erro.textContent = "Não foi possível conectar ao servidor.";
    } finally {
        if (btnSalvar) {
            btnSalvar.disabled = false;
            btnSalvar.textContent = "Salvar";
        }
    }
}

document.addEventListener("click", (evento) => {
    if (evento.target.id === "modalEditarDados") {
        fecharModalDados();
    }
    if (evento.target.id === "modalEditarEconomia") {
        fecharModalEconomia();
    }
    if (evento.target.id === "celebracaoMeta") {
        fecharCelebracaoMeta();
    }
});

document.addEventListener("keydown", (evento) => {
    const modalDados = document.getElementById("modalEditarDados");
    if (modalDados && modalDados.classList.contains("ativo")) {
        if (evento.key === "Escape") fecharModalDados();
        if (evento.key === "Enter") salvarDadosPessoais();
        return;
    }

    const modalEconomia = document.getElementById("modalEditarEconomia");
    if (modalEconomia && modalEconomia.classList.contains("ativo")) {
        if (evento.key === "Escape") fecharModalEconomia();
        if (evento.key === "Enter") salvarNovaEconomia();
        return;
    }

    const celebracao = document.getElementById("celebracaoMeta");
    if (celebracao && celebracao.classList.contains("ativo") && evento.key === "Escape") {
        fecharCelebracaoMeta();
    }
});
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
