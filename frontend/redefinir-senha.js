const API_URL = ""; // 🌟 Alterado para rota relativa (funciona local e no Railway)

const nomeUsuario = document.getElementById("nomeUsuario");
const token = localStorage.getItem("token");
const userRaw = localStorage.getItem("usuario");

let usuario = null;
if (userRaw) {
    try {
        usuario = JSON.parse(userRaw);
    } catch (erroParse) {
        console.warn("Dado de usuário inválido no localStorage, ignorando:", erroParse);
    }
}

if (nomeUsuario) nomeUsuario.innerText = usuario && usuario.nome ? usuario.nome : "Visitante";

if (!token) {
    alert("🔒 Acesso negado! Por favor, faça login para acessar o planejamento.");
    window.location.href = "login.html";
}

// O país vem da tela de Simulação (botão "Salvar"). Sem ele, não há o que planejar.
const paisEscolhido = localStorage.getItem("planoPaisEscolhido");
const estados = (paisEscolhido && typeof ESTADOS_POR_PAIS !== "undefined") ? ESTADOS_POR_PAIS[paisEscolhido] : null;

if (!paisEscolhido || !estados) {
    alert("Escolha um país na tela de Simulação antes de planejar a mudança.");
    window.location.href = "simulacao.html";
}

const paisAtualNome = document.getElementById("paisAtualNome");
if (paisAtualNome && estados) {
    const bandeira = (typeof BANDEIRA_POR_PAIS !== "undefined" && BANDEIRA_POR_PAIS[paisEscolhido]) || "";
    paisAtualNome.textContent = `${bandeira} ${paisEscolhido}`;
}

const estadosGrid = document.getElementById("estadosGrid");
const grupoCidades = document.getElementById("grupoCidades");
const cidadesGrid = document.getElementById("cidadesGrid");
const inputPlanoEstado = document.getElementById("planoEstado");
const inputPlanoCidade = document.getElementById("planoCidade");

function renderizarListaPontos(pontos, classe, icone) {
    return `<ul class="pontos-lista ${classe}">${pontos.map(p => `<li>${icone} ${p}</li>`).join("")}</ul>`;
}

function marcarEstadoSelecionado(nomeEstado) {
    inputPlanoEstado.value = nomeEstado;
    estadosGrid.querySelectorAll(".estado-card-forte").forEach(card => {
        card.classList.toggle("selecionado", card.dataset.estado === nomeEstado);
    });
}

// Clique no estado: marca o estado e (re)monta a lista de cidades dele do zero,
// já que trocar de estado significa trocar as opções de cidade também.
function selecionarEstado(nomeEstado) {
    marcarEstadoSelecionado(nomeEstado);
    inputPlanoCidade.value = "";

    const estado = estados.find(e => e.nome === nomeEstado);
    if (estado) renderizarCidades(estado);
}

function renderizarEstados() {
    if (!estadosGrid || !estados) return;

    estadosGrid.innerHTML = estados.map(estado => `
        <button type="button" class="estado-card-forte" data-estado="${estado.nome}">
            <div class="estado-card-forte-nome">${estado.nome}</div>
            <div class="estado-card-stats">
                <span class="estado-card-stat">💰 Economia ${estado.economia}/10</span>
                <span class="estado-card-stat">🏥 Saúde ${estado.saude}/10</span>
                <span class="estado-card-stat">💼 Empregos ${estado.empregos}/10</span>
            </div>
            ${renderizarListaPontos(estado.pontosFortes, "pontos-fortes", "✅")}
            ${renderizarListaPontos(estado.pontosFracos, "pontos-fracos", "⚠️")}
        </button>
    `).join("");

    estadosGrid.querySelectorAll(".estado-card-forte").forEach(card => {
        card.addEventListener("click", () => selecionarEstado(card.dataset.estado));
    });
}

function renderizarCidades(estado) {
    if (!cidadesGrid || !grupoCidades) return;

    grupoCidades.style.display = "block";

    cidadesGrid.innerHTML = estado.cidades.map(cidade => `
        <button type="button" class="cidade-card-forte" data-cidade="${cidade.nome}">
            <div class="cidade-card-img cidade-card-img-placeholder" data-cidade="${cidade.nome}"><i class="fa-solid fa-city"></i></div>
            <div class="cidade-card-forte-corpo">
                <div class="cidade-card-forte-topo">
                    <span class="cidade-card-forte-nome">${cidade.nome}</span>
                </div>
                ${renderizarListaPontos([cidade.forte], "pontos-fortes", "✅")}
                ${renderizarListaPontos([cidade.fraco], "pontos-fracos", "⚠️")}
            </div>
        </button>
    `).join("");

    cidadesGrid.querySelectorAll(".cidade-card-forte").forEach(card => {
        card.addEventListener("click", () => {
            inputPlanoCidade.value = card.dataset.cidade;
            cidadesGrid.querySelectorAll(".cidade-card-forte").forEach(c => c.classList.remove("selecionado"));
            card.classList.add("selecionado");
        });

        // Busca a foto da cidade em segundo plano, sem travar a exibição dos cards
        if (typeof buscarImagemCidade === "function") {
            buscarImagemCidade(card.dataset.cidade).then(url => {
                if (!url) return;
                const placeholder = card.querySelector(".cidade-card-img-placeholder");
                if (!placeholder) return;
                const img = document.createElement("img");
                img.src = url;
                img.alt = `Foto de ${card.dataset.cidade}`;
                img.loading = "lazy";
                img.className = "cidade-card-img";
                placeholder.replaceWith(img);
            });
        }
    });
}

if (estados) {
    renderizarEstados();
}

async function salvarPlano() {
    const msgPlano = document.getElementById("msgPlano");

    const estado = inputPlanoEstado.value.trim();
    const cidade = inputPlanoCidade.value.trim();
    const dataPretendida = document.getElementById("planoData").value;
    const quantidadePessoas = document.getElementById("planoPessoas").value;
    const valorGuardado = document.getElementById("planoValorGuardado").value;

    if (!estado || !cidade || !dataPretendida || !quantidadePessoas || !valorGuardado) {
        if (msgPlano) {
            msgPlano.innerText = "Escolha um estado, uma cidade e preencha os detalhes do plano.";
            msgPlano.style.color = "#dc2626";
        }
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/plano`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                paisDestino: paisEscolhido,
                estado,
                cidade,
                dataPretendida,
                quantidadePessoas,
                valorGuardado,
            }),
        });

        const data = await response.json();

        if (msgPlano) {
            if (data.success) {
                msgPlano.innerText = "✅ Alterações salvas com sucesso!";
                msgPlano.style.color = "#16a34a";
            } else {
                msgPlano.innerText = data.message || "Não foi possível salvar o plano.";
                msgPlano.style.color = "#dc2626";
            }
        }
    } catch (erro) {
        console.error("Erro ao salvar plano:", erro);
        if (msgPlano) {
            msgPlano.innerText = "Não foi possível conectar ao servidor backend.";
            msgPlano.style.color = "#dc2626";
        }
    }
}

const btnSalvarPlano = document.getElementById("btnSalvarPlano");
if (btnSalvarPlano) {
    btnSalvarPlano.addEventListener("click", salvarPlano);
}