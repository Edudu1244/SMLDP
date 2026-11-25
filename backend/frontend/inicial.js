document.addEventListener("DOMContentLoaded", () => {
    const btnSimularPrincipal = document.getElementById("btnSimularPrincipal");
    const menuAuthContainer = document.getElementById("menuAuthContainer");

    const token = localStorage.getItem("token");

    /* ==========================================================
       1. CONTROLE VISUAL DA NAV (EXIBE PERFIL E SIMULADOR SE LOGADO)
       ========================================================== */
    if (menuAuthContainer) {
        if (token) {
            menuAuthContainer.innerHTML = `
                <a href="perfil.html" class="nav-perfil-btn">Perfil</a>
            `;
        }
    }

    /* ==========================================================
       2. TRAVA DO BOTÃO CENTRAL DE CAPTURA DO HERO
       ========================================================== */
    const authModalOverlay = document.getElementById("authModalOverlay");
    const authModalOk = document.getElementById("authModalOk");

    function abrirModalAuth() {
        authModalOverlay.classList.add("visivel");
    }

    if (authModalOk) {
        authModalOk.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }

    if (authModalOverlay) {
        authModalOverlay.addEventListener("click", (evento) => {
            if (evento.target === authModalOverlay) {
                authModalOverlay.classList.remove("visivel");
            }
        });
    }

    if (btnSimularPrincipal) {
        btnSimularPrincipal.addEventListener("click", () => {
            if (token) {
                window.location.href = "simulacao.html";
            } else {
                abrirModalAuth();
            }
        });
    }
});