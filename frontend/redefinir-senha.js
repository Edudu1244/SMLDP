document.addEventListener("DOMContentLoaded", () => {
    const formRedefinirSenha = document.getElementById("formRedefinirSenha");
    const mensagem = document.getElementById("mensagem");
    const btnRedefinirSenha = document.getElementById("btnRedefinirSenha");

    const parametros = new URLSearchParams(window.location.search);
    const token = parametros.get("token");

    if (!token) {
        exibirMensagem("Link inválido. Solicite uma nova redefinição na tela de login.", "erro");
        if (formRedefinirSenha) formRedefinirSenha.style.display = "none";
        return;
    }

    if (formRedefinirSenha) {
        formRedefinirSenha.addEventListener("submit", async (evento) => {
            evento.preventDefault();

            const novaSenha = document.getElementById("novaSenha").value.trim();
            const confirmarSenha = document.getElementById("confirmarSenha").value.trim();

            if (novaSenha.length < 6) {
                exibirMensagem("A senha deve ter no mínimo 6 caracteres.", "erro");
                return;
            }

            if (novaSenha !== confirmarSenha) {
                exibirMensagem("As senhas não coincidem.", "erro");
                return;
            }

            setLoadingState(true);

            try {
<<<<<<< HEAD
                // 🌟 ALTERADO PARA ROTA RELATIVA (Funciona no Railway e local)
                const resposta = await fetch("/auth/redefinir-senha", {
=======
                const resposta = await fetch("http://127.0.0.1:3000/auth/redefinir-senha", {
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token, novaSenha })
                });

                const data = await resposta.json();

                if (data.success) {
                    exibirMensagem("Senha redefinida com sucesso! Redirecionando para o login...", "sucesso");
                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 1800);
                } else {
                    exibirMensagem(data.message || "Não foi possível redefinir a senha.", "erro");
                    setLoadingState(false);
                }
            } catch (erro) {
                console.error("Erro ao redefinir senha:", erro);
                exibirMensagem("Não foi possível conectar ao servidor.", "erro");
                setLoadingState(false);
            }
        });
    }

    function exibirMensagem(texto, tipo) {
        mensagem.innerText = texto;
        mensagem.style.color = tipo === "sucesso" ? "#16a34a" : "#dc2626";
    }

    function setLoadingState(isLoading) {
        if (!btnRedefinirSenha) return;

        if (isLoading) {
            btnRedefinirSenha.disabled = true;
            btnRedefinirSenha.dataset.textoOriginal = btnRedefinirSenha.innerText;
            btnRedefinirSenha.innerText = "Salvando...";
            btnRedefinirSenha.style.opacity = "0.7";
            btnRedefinirSenha.style.cursor = "not-allowed";
        } else {
            btnRedefinirSenha.disabled = false;
            btnRedefinirSenha.innerText = btnRedefinirSenha.dataset.textoOriginal || "Redefinir senha";
            btnRedefinirSenha.style.opacity = "1";
            btnRedefinirSenha.style.cursor = "pointer";
        }
    }
<<<<<<< HEAD
});
=======
});
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
