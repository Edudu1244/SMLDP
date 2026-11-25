// ==========================
// DADOS DOS PAÍSES
// ==========================

const paises = {

    "Estados Unidos": {
        nome: "Estados Unidos",
        economia: 29000,
        economiaTexto: "US$ 29 trilhões",
        populacao: 340,
        populacaoTexto: "340 milhões",
        saude: 4,
        saudeTexto: "Muito Boa",
        educacao: 5,
        educacaoTexto: "Excelente",
        defesa: 5,
        defesaTexto: "Muito Alta",
        idh: 0.921,
        crescimento: 2.8,
        crescimentoTexto: "2,8%"
    },

    "China": {
        nome: "China",
        economia: 18000,
        economiaTexto: "US$ 18 trilhões",
        populacao: 1410,
        populacaoTexto: "1,41 bilhão",
        saude: 3,
        saudeTexto: "Boa",
        educacao: 4,
        educacaoTexto: "Muito Boa",
        defesa: 5,
        defesaTexto: "Muito Alta",
        idh: 0.788,
        crescimento: 5.0,
        crescimentoTexto: "5,0%"
    },

    "Japão": {
        nome: "Japão",
        economia: 4200,
        economiaTexto: "US$ 4,2 trilhões",
        populacao: 124,
        populacaoTexto: "124 milhões",
        saude: 5,
        saudeTexto: "Excelente",
        educacao: 5,
        educacaoTexto: "Excelente",
        defesa: 3,
        defesaTexto: "Média",
        idh: 0.925,
        crescimento: 1.0,
        crescimentoTexto: "1,0%"
    },

    "Portugal": {
        nome: "Portugal",
        economia: 290,
        economiaTexto: "US$ 290 bilhões",
        populacao: 10.5,
        populacaoTexto: "10,5 milhões",
        saude: 4,
        saudeTexto: "Muito Boa",
        educacao: 4,
        educacaoTexto: "Muito Boa",
        defesa: 3,
        defesaTexto: "Média",
        idh: 0.874,
        crescimento: 2.3,
        crescimentoTexto: "2,3%"
    },

    "França": {
        nome: "França",
        economia: 3100,
        economiaTexto: "US$ 3,1 trilhões",
        populacao: 68,
        populacaoTexto: "68 milhões",
        saude: 5,
        saudeTexto: "Excelente",
        educacao: 5,
        educacaoTexto: "Excelente",
        defesa: 4,
        defesaTexto: "Alta",
        idh: 0.903,
        crescimento: 1.2,
        crescimentoTexto: "1,2%"
    },

    "Coreia do Sul": {
        nome: "Coreia do Sul",
        economia: 1900,
        economiaTexto: "US$ 1,9 trilhão",
        populacao: 52,
        populacaoTexto: "52 milhões",
        saude: 5,
        saudeTexto: "Excelente",
        educacao: 5,
        educacaoTexto: "Excelente",
        defesa: 4,
        defesaTexto: "Alta",
        idh: 0.925,
        crescimento: 2.2,
        crescimentoTexto: "2,2%"
    },

    "Suíça": {
        nome: "Suíça",
        economia: 900,
        economiaTexto: "US$ 900 bilhões",
        populacao: 8.9,
        populacaoTexto: "8,9 milhões",
        saude: 5,
        saudeTexto: "Excelente",
        educacao: 5,
        educacaoTexto: "Excelente",
        defesa: 3,
        defesaTexto: "Média",
        idh: 0.967,
        crescimento: 1.5,
        crescimentoTexto: "1,5%"
    }

};

// ==========================
// COMPARAÇÃO
// ==========================

function registrarComparacao(pais1, pais2) {
    const token = localStorage.getItem("token");
    if (!token) return;

<<<<<<< HEAD
    // 🌟 ALTERADO PARA ROTA RELATIVA (Funciona no Railway e local)
    fetch("/api/comparar", {
=======
    fetch("http://127.0.0.1:3000/api/comparar", {
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ pais1, pais2 })
    }).catch(erro => console.error("Erro ao registrar comparação:", erro));
}

function comparar() {

    const chavePais1 = document.getElementById("pais1").value;
    const chavePais2 = document.getElementById("pais2").value;

    const pais1 = paises[chavePais1];
    const pais2 = paises[chavePais2];

    registrarComparacao(chavePais1, chavePais2);

    document.getElementById("nomePais1").textContent = pais1.nome;
    document.getElementById("nomePais2").textContent = pais2.nome;

    const indicadores = [

        ["💰 Economia", pais1.economiaTexto, pais2.economiaTexto],
        ["👥 População", pais1.populacaoTexto, pais2.populacaoTexto],
        ["🏥 Saúde", pais1.saudeTexto, pais2.saudeTexto],
        ["🎓 Educação", pais1.educacaoTexto, pais2.educacaoTexto],
        ["🛡️ Defesa", pais1.defesaTexto, pais2.defesaTexto],
        ["🌍 IDH", pais1.idh, pais2.idh],
        ["📈 Crescimento", pais1.crescimentoTexto, pais2.crescimentoTexto]

    ];

    let html = "";

    indicadores.forEach(item => {

        html += `
        <tr>
            <td><strong>${item[0]}</strong></td>
            <td>${item[1]}</td>
            <td>${item[2]}</td>
        </tr>
        `;

    });

    document.getElementById("resultado").innerHTML = html;

    descobrirVencedor(pais1, pais2);

}

// ==========================
// VENCEDOR
// ==========================

function descobrirVencedor(p1, p2){

    let pontos1 = 0;
    let pontos2 = 0;

    let motivos = [];

    function compararIndicador(valor1, valor2, nome){

        if(valor1 > valor2){

            pontos1++;
            motivos.push(`${p1.nome} possui melhor ${nome}.`);

        }

        else if(valor2 > valor1){

            pontos2++;
            motivos.push(`${p2.nome} possui melhor ${nome}.`);

        }

    }

    compararIndicador(p1.economia,p2.economia,"economia");
    compararIndicador(p1.populacao,p2.populacao,"população");
    compararIndicador(p1.saude,p2.saude,"saúde");
    compararIndicador(p1.educacao,p2.educacao,"educação");
    compararIndicador(p1.defesa,p2.defesa,"defesa");
    compararIndicador(p1.idh,p2.idh,"IDH");
    compararIndicador(p1.crescimento,p2.crescimento,"crescimento econômico");

    const resultado = document.getElementById("resultadoFinal");

    if(pontos1 > pontos2){

        resultado.innerHTML = `

            <i class="fa-solid fa-trophy"></i>

            <h2>${p1.nome} venceu!</h2>

            <p>

                ${p1.nome} obteve <strong>${pontos1}</strong> pontos,
                enquanto ${p2.nome} ficou com
                <strong>${pontos2}</strong>.

            </p>

            <br>

            <p>${motivos.join("<br>")}</p>

        `;

    }

    else if(pontos2 > pontos1){

        resultado.innerHTML = `

            <i class="fa-solid fa-trophy"></i>

            <h2>${p2.nome} venceu!</h2>

            <p>

                ${p2.nome} obteve <strong>${pontos2}</strong> pontos,
                enquanto ${p1.nome} ficou com
                <strong>${pontos1}</strong>.

            </p>

            <br>

            <p>${motivos.join("<br>")}</p>

        `;

    }

    else{

        resultado.innerHTML = `

            <i class="fa-solid fa-handshake"></i>

            <h2>Empate</h2>

            <p>

                Os dois países apresentaram desempenho muito semelhante,
                empatando com <strong>${pontos1}</strong> pontos.

            </p>

        `;

    }

    resultado.style.opacity = "0";

    setTimeout(()=>{

        resultado.style.transition=".5s";
        resultado.style.opacity="1";

    },100);

}

// ==========================
// BOTÃO
// ==========================

const botao = document.getElementById("btnComparar");

botao.addEventListener("click",()=>{

    botao.style.transform="scale(.95)";

    setTimeout(()=>{

        botao.style.transform="scale(1)";

    },150);

});

// ==========================
// HEADER
// ==========================

window.addEventListener("scroll",()=>{

    const header = document.querySelector("header");
    const escuro = document.body.classList.contains("dark");

    if(window.scrollY>30){

        header.style.background = escuro ? "rgba(11,18,32,.95)" : "rgba(255,255,255,.98)";
        header.style.boxShadow="0 10px 25px rgba(15,23,42,.08)";

    }

    else{

        header.style.background = escuro ? "rgba(11,18,32,.85)" : "rgba(255,255,255,.92)";
        header.style.boxShadow="none";

    }

});

// ==========================
// CONSOLE
// ==========================

console.clear();

console.log(
    "%c🌍 SMLDP",
    "color:#16a34a;font-size:30px;font-weight:bold;"
);

console.log(
    "%cSistema carregado com sucesso!",
    "color:#22c55e;font-size:15px;"
);