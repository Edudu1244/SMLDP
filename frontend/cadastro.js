document.addEventListener("DOMContentLoaded", () => {
    const formCadastro = document.getElementById("formCadastro");
    const mensagem = document.getElementById("mensagem");
    const selectPais = document.getElementById("paisAtual"); // Captura o novo select de países

    // ==========================================================
    // AVISO: NAVEGADOR JÁ ESTÁ COM UMA SESSÃO ATIVA
    // ==========================================================
    (function verificarSessaoAtiva() {
        const token = localStorage.getItem("token");
        const usuarioRaw = localStorage.getItem("usuario");
        if (!token || !usuarioRaw) return;

        let usuario = null;
        try {
            usuario = JSON.parse(usuarioRaw);
        } catch (erro) {
            return;
        }
        if (!usuario) return;

        const aviso = document.getElementById("sessaoAtiva");
        const nomeEl = document.getElementById("sessaoAtivaNome");
        const emailEl = document.getElementById("sessaoAtivaEmail");
        const btnSair = document.getElementById("btnSairSessaoAtiva");

        if (nomeEl) nomeEl.textContent = usuario.nome || "usuário";
        if (emailEl) emailEl.textContent = usuario.email || "";
        if (aviso) aviso.style.display = "flex";

        if (btnSair) {
            btnSair.addEventListener("click", () => {
                localStorage.removeItem("token");
                localStorage.removeItem("usuario");
                if (aviso) aviso.style.display = "none";
            });
        }
    })();

    // ==========================================================
    // FUNÇÃO PARA CARREGAR OS PAÍSES DINAMICAMENTE DO BACKEND
    // ==========================================================
    async function carregarPaisesCadastro() {
        try {
            // Rota relativa (Funciona perfeitamente no Railway e local)
            const response = await fetch("/api/paises");
            const data = await response.json();

            if (response.ok && data.success) {
                selectPais.innerHTML = '<option value="" disabled selected>Selecione seu país</option>';
                
                data.paises.forEach(pais => {
                    const option = document.createElement("option");
                    option.value = pais.nome;
                    option.textContent = pais.nome;
                    selectPais.appendChild(option);
                });
            } else {
                selectPais.innerHTML = '<option value="">Erro ao carregar lista</option>';
            }
        } catch (error) {
            console.error("Erro ao buscar países para o cadastro:", error);
            selectPais.innerHTML = '<option value="">Servidor offline</option>';
        }
    }

    carregarPaisesCadastro();

    // ==========================================================
    // ENVIO DO FORMULÁRIO E INTEGRAÇÃO BACKEND
    // ==========================================================
    if (formCadastro) {
        formCadastro.addEventListener("submit", async (event) => {
            event.preventDefault();

            const dados = {
                nome: document.getElementById("nome").value.trim(),
                idade: Number(document.getElementById("idade").value), 
                sexo: document.getElementById("sexo").value,
                profissao: document.getElementById("profissao").value.trim(),
                pais: selectPais.value,
                email: document.getElementById("email").value.trim(),
                senha: document.getElementById("senha").value.trim()
            };

            if (
                !dados.nome ||
                !dados.idade ||
                !dados.sexo ||
                !dados.profissao ||
                !dados.pais ||
                !dados.email ||
                !dados.senha
            ) {
                mensagem.innerText = "Preencha todos os campos obrigatórios";
                mensagem.style.color = "#dc2626";
                return;
            }

            if (!dados.email.includes("@")) {
                mensagem.innerText = "Digite um email válido";
                mensagem.style.color = "#dc2626";
                return;
            }

            if (dados.senha.length < 6) {
                mensagem.innerText = "A senha deve ter no mínimo 6 caracteres";
                mensagem.style.color = "#dc2626";
                return;
            }

            try {
                // Rota relativa para o cadastro (Railway e local)
                const resposta = await fetch("/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dados)
                });

                const data = await resposta.json();

                if (data.success) {
                    if (data.token) {
                        localStorage.setItem("token", data.token);
                    }
                    if (data.usuario) {
                        localStorage.setItem("usuario", JSON.stringify(data.usuario));
                    }
                    
                    mensagem.innerText = "Conta criada com sucesso! Redirecionando...";
                    mensagem.style.color = "#16a34a";

                    setTimeout(() => {
                        window.location.href = "inicial.html";
                    }, 1500);

                } else {
                    mensagem.innerText = data.message;
                    mensagem.style.color = "#dc2626";
                }

            } catch (error) {
                console.error("Erro ao realizar a requisição de cadastro:", error);
                mensagem.innerText = "Erro ao conectar com o servidor.";
                mensagem.style.color = "#dc2626";
            }
        });
    }
});