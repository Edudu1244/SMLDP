const btnDesconectar = document.getElementById("btnDesconectar");
const nomeUsuario = document.getElementById("nomeUsuario");
const themeToggle = document.getElementById("themeToggle");

const temaSalvo = localStorage.getItem("tema");
if (temaSalvo === "dark") {
    document.body.classList.add("dark");
}

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

nomeUsuario.innerText = usuario && usuario.nome ? usuario.nome : "Visitante";

if (!token) {
  alert("🔒 Acesso negado! Por favor, faça login para acessar o simulador.");
  window.location.href = "login.html";
}

async function buscarDados(event) {
  // Bloqueio imediato e absoluto do recarregamento
  event.preventDefault();

  try {
    const paisSelecionado = document.getElementById("paisDestino").value;
    const msgStatus = document.getElementById("msgStatus");

    if (!paisSelecionado) {
      alert("Por favor, selecione um país válido.");
      return;
    }

    if (msgStatus) {
      msgStatus.innerText = "Processando variáveis no servidor...";
      msgStatus.style.color = "#128a3e";
    }

<<<<<<< HEAD
    // 🌟 ALTERADO PARA ROTA RELATIVA (Funciona no Railway e local)
    const response = await fetch("/api/simular", {
=======
    // Envia os dados para o servidor
    const response = await fetch("http://127.0.0.1:3000/api/simular", {
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paisDestino: paisSelecionado }),
    });

    const data = await response.json();
    console.log("Dados recebidos do servidor:", data);

    if (!data.success) {
      if (msgStatus) {
        msgStatus.innerText = data.message || "Não foi possível processar a simulação.";
        msgStatus.style.color = "#dc2626";
      }
      return;
    }

    // SEGUNDA TRAVA DE SEGURANÇA: Isola a exibição dos dados
    // Se o servidor mandar dados errados, o erro morre aqui dentro e a página NÃO recarrega
    try {
      const resDesenvolvimento = document.getElementById("resDesenvolvimento");
      const resSalario = document.getElementById("resSalario");
      const resSaude = document.getElementById("resSaude");
      const resMigracao = document.getElementById("resMigracao");
      const resIdioma = document.getElementById("resIdioma");
      const resClima = document.getElementById("resClima");
      const resScore = document.getElementById("resScore");

      // Convertemos os dados recebidos para garantir que são números válidos
      const idh = Number(data.indiceDesenvolvimento) || 0;
      const dificuldade = data.dificuldade || 0;
      const score = data.scoreFinal || 0;
      const resultadoTxt = data.resultado || "Sucesso";

      // Garante que nenhum indicador passe de 10
      const clamp10 = (valor) => Math.min(10, Math.max(0, valor));

      // Injeta os valores nas tags HTML com segurança
      if (resDesenvolvimento) resDesenvolvimento.innerText = `${clamp10(idh * 10).toFixed(1)} / 10`;
      if (resSaude) resSaude.innerText = data.saude || "--";
      if (resMigracao) resMigracao.innerText = `${clamp10(dificuldade)} / 10`;
      if (resScore) resScore.innerText = `${score}%`;

      // Salário: mostra o valor na moeda local e o equivalente em reais
      if (resSalario) {
        if (data.salarioMedio && data.moeda) {
          const salarioLocal = `${data.moeda} ${Number(data.salarioMedio).toLocaleString("pt-BR")}`;
          const salarioBRL = data.salarioBRL
            ? ` (≈ R$ ${Number(data.salarioBRL).toLocaleString("pt-BR")})`
            : "";
          resSalario.innerText = `${salarioLocal}${salarioBRL}`;
        } else {
          resSalario.innerText = "--";
        }
      }

      // Idioma e dificuldade de aprendizado para um brasileiro
      if (resIdioma) {
        resIdioma.innerText = data.dificuldadeIdioma
          ? `${data.idioma} (${data.dificuldadeIdioma})`
          : data.idioma || "--";
      }

      if (resClima) resClima.innerText = data.clima || "--";

      if (msgStatus) {
        msgStatus.innerText = `Diagnóstico: ${resultadoTxt}`;
        msgStatus.style.color = "#16a34a";
      }

      // Só libera o "Prosseguir" depois que os dados do país aparecerem na tela
      if (btnProsseguir) btnProsseguir.style.display = "flex";
    } catch (erroDeRenderizacao) {
      console.error("Erro ao colocar os dados na tela:", erroDeRenderizacao);
      if (msgStatus) {
        msgStatus.innerText =
          "O servidor respondeu, mas os dados vieram em formato inválido.";
        msgStatus.style.color = "#dc2626";
      }
    }
  } catch (error) {
    console.error("Erro na rede ou servidor offline:", error);
    const msgStatus = document.getElementById("msgStatus");
    if (msgStatus) {
      msgStatus.innerText = "Não foi possível conectar ao servidor backend.";
      msgStatus.style.color = "#ff6b6b";
    }
  }
}

const formSimulacao = document.getElementById("formSimulacao");
if (formSimulacao) {
  formSimulacao.addEventListener("submit", buscarDados);
}

/* ==========================================================
   SALVAR E IR PARA "PLANEJE SUA MUDANÇA"
   ========================================================== */
const paisDestinoSelect = document.getElementById("paisDestino");
const btnProsseguir = document.getElementById("btnProsseguir");

// Esconde o "Salvar" de novo se o país for trocado, até rodar uma nova busca
if (paisDestinoSelect && btnProsseguir) {
  paisDestinoSelect.addEventListener("change", () => {
    btnProsseguir.style.display = "none";
  });
}

// "Salvar" apenas guarda qual país foi escolhido e leva para a página de
// planejamento (planeje.html), que é quem mostra estados, cidades e pontos
// fortes/fracos — a simulação em si já foi salva pelo /api/simular.
if (btnProsseguir) {
  btnProsseguir.addEventListener("click", () => {
    if (!paisDestinoSelect.value) return;
    localStorage.setItem("planoPaisEscolhido", paisDestinoSelect.value);
    window.location.href = "planeje.html";
  });
<<<<<<< HEAD
}
=======
}
>>>>>>> c743ba28d916a79ea34c377f1e528970ed450616
