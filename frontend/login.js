document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("formLogin");
    const mensagem = document.getElementById("mensagem");
    const btnLogin = document.getElementById("btnLogin");

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
    // ENVIO DO FORMULÁRIO DE LOGIN
    // ==========================================================
    if (formLogin) {
        formLogin.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const senha = document.getElementById("senha").value.trim();

            if (!email || !senha) {
                exibirMensagem("Por favor, preencha todos os campos.", "erro");
                return;
            }

            setLoadingState(true);

            try {
<<<<<<< HEAD
                // 🌟 ALTERADO PARA ROTA RELATIVA (Funciona no Railway e local)
                const resposta = await fetch("/auth/login", {
=======
                const resposta = await fetch("http://127.0.0.1:3000/auth/login", {
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, senha })
                });

                const data = await resposta.json();

                if (resposta.ok && data.success) {
                    exibirMensagem("Login realizado com sucesso! Redirecionando...", "sucesso");

                    localStorage.setItem("token", data.token);
                    localStorage.setItem("usuario", JSON.stringify(data.usuario));

                    setTimeout(() => {
                        window.location.href = "inicial.html";
                    }, 1200);
                } else {
                    exibirMensagem(data.message || "E-mail ou senha incorretos.", "erro");
                    setLoadingState(false);
                }

            } catch (erro) {
                exibirMensagem("Não foi possível conectar ao servidor.", "erro");
                console.error("Erro no processo de login:", erro);
                setLoadingState(false);
            }
        });
    }

    // ==========================================================
    // FUNÇÕES AUXILIARES
    // ==========================================================
    function exibirMensagem(texto, tipo) {
        mensagem.innerText = texto;
        if (tipo === "sucesso") {
            mensagem.style.color = "#16a34a";
        } else {
            mensagem.style.color = "#dc2626";
        }
    }

    function setLoadingState(isLoading) {
        if (!btnLogin) return;

        if (isLoading) {
            btnLogin.disabled = true;
            btnLogin.dataset.textoOriginal = btnLogin.innerText;
            btnLogin.innerText = "Entrando...";
            btnLogin.style.opacity = "0.7";
            btnLogin.style.cursor = "not-allowed";
        } else {
            btnLogin.disabled = false;
            btnLogin.innerText = btnLogin.dataset.textoOriginal || "Entrar";
            btnLogin.style.opacity = "1";
            btnLogin.style.cursor = "pointer";
        }
    }

    // ==========================================================
    // MODAL: ESQUECI MINHA SENHA
    // ==========================================================
    const linkEsqueciSenha = document.getElementById("linkEsqueciSenha");
    const modalEsqueciSenha = document.getElementById("modalEsqueciSenha");
    const inputEmailRecuperacao = document.getElementById("inputEmailRecuperacao");
    const modalEsqueciSenhaErro = document.getElementById("modalEsqueciSenhaErro");
    const btnEnviarRecuperacao = document.getElementById("btnEnviarRecuperacao");
    const linkRecuperacaoDev = document.getElementById("linkRecuperacaoDev");

    function abrirModalEsqueciSenha() {
        if (!modalEsqueciSenha) return;
        inputEmailRecuperacao.value = document.getElementById("email")?.value || "";
        modalEsqueciSenhaErro.textContent = "";
        if (linkRecuperacaoDev) linkRecuperacaoDev.style.display = "none";
        modalEsqueciSenha.classList.add("ativo");
        inputEmailRecuperacao.focus();
    }

    function fecharModalEsqueciSenha() {
        if (!modalEsqueciSenha) return;
        modalEsqueciSenha.classList.remove("ativo");
    }

    if (linkEsqueciSenha) {
        linkEsqueciSenha.addEventListener("click", (evento) => {
            evento.preventDefault();
            abrirModalEsqueciSenha();
        });
    }

    document.getElementById("btnFecharModalEsqueciSenha")?.addEventListener("click", fecharModalEsqueciSenha);
    document.getElementById("btnCancelarEsqueciSenha")?.addEventListener("click", fecharModalEsqueciSenha);

    modalEsqueciSenha?.addEventListener("click", (evento) => {
        if (evento.target === modalEsqueciSenha) fecharModalEsqueciSenha();
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && modalEsqueciSenha?.classList.contains("ativo")) {
            fecharModalEsqueciSenha();
        }
    });

    async function enviarLinkRecuperacao() {
        const email = inputEmailRecuperacao.value.trim();

        if (!email || !email.includes("@")) {
            modalEsqueciSenhaErro.textContent = "Digite um e-mail válido.";
            return;
        }

        btnEnviarRecuperacao.disabled = true;
        btnEnviarRecuperacao.textContent = "Enviando...";
        modalEsqueciSenhaErro.textContent = "";

        try {
<<<<<<< HEAD
            // 🌟 ALTERADO PARA ROTA RELATIVA (Funciona no Railway e local)
            const resposta = await fetch("/auth/esqueci-senha", {
=======
            const resposta = await fetch("http://127.0.0.1:3000/auth/esqueci-senha", {
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await resposta.json();

            if (data.success) {
                modalEsqueciSenhaErro.style.color = "#16a34a";
                modalEsqueciSenhaErro.textContent = data.message;
                btnEnviarRecuperacao.textContent = "Link enviado";

<<<<<<< HEAD
=======
                // Sem e-mail configurado no servidor (ambiente de dev/demo), o backend manda
                // o link direto na resposta em vez de por e-mail de verdade.
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
                if (data.linkDev && linkRecuperacaoDev) {
                    linkRecuperacaoDev.href = data.linkDev;
                    linkRecuperacaoDev.style.display = "flex";
                }
            } else {
                modalEsqueciSenhaErro.style.color = "#dc2626";
                modalEsqueciSenhaErro.textContent = data.message || "Não foi possível enviar o link.";
                btnEnviarRecuperacao.disabled = false;
                btnEnviarRecuperacao.textContent = "Enviar link";
            }
        } catch (erro) {
            console.error("Erro ao solicitar redefinição de senha:", erro);
            modalEsqueciSenhaErro.style.color = "#dc2626";
            modalEsqueciSenhaErro.textContent = "Não foi possível conectar ao servidor.";
            btnEnviarRecuperacao.disabled = false;
            btnEnviarRecuperacao.textContent = "Enviar link";
        }
    }

    btnEnviarRecuperacao?.addEventListener("click", enviarLinkRecuperacao);
});