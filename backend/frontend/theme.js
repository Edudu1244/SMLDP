/* ==========================================================
   TEMA (CLARO/ESCURO) — COMPARTILHADO ENTRE TODAS AS PÁGINAS
   ========================================================== */
(() => {
    if (localStorage.getItem("tema") === "dark") {
        document.body.classList.add("dark");
    }

    document.addEventListener("DOMContentLoaded", () => {
        const themeToggle = document.getElementById("themeToggle");
        if (!themeToggle) return;

        const sincronizarIcone = () => {
            themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
        };

        sincronizarIcone();

        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            localStorage.setItem("tema", document.body.classList.contains("dark") ? "dark" : "light");
            sincronizarIcone();
            window.dispatchEvent(new Event("scroll"));
        });
    });
})();
