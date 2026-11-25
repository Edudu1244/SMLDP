// ==========================================================
// DADOS GEOGRÁFICOS COMPARTILHADOS (simulacao.js, planeje.js e perfil.js)
// Lista oficial de destinos suportados pelo SMLDP — a mesma
// usada no banco (backend/server.js), em comparacao.js e ideal.js.
// ==========================================================

const BANDEIRA_POR_PAIS = {
    "Estados Unidos": "🇺🇸",
    "China": "🇨🇳",
    "Japão": "🇯🇵",
    "Portugal": "🇵🇹",
    "França": "🇫🇷",
    "Coreia do Sul": "🇰🇷",
    "Suíça": "🇨🇭"
};

// Os 4 estados/regiões com melhor economia, saúde e empregos de cada país
// (escala 0-10, ilustrativa), cada um com 2 cidades — 8 cidades por país no total.
// Cada estado e cada cidade tem pontos fortes/fracos para ajudar na decisão.
const ESTADOS_POR_PAIS = {
    "Estados Unidos": [
        {
            nome: "Califórnia", economia: 10, saude: 8, empregos: 10,
            pontosFortes: ["💼 Polo de tecnologia (Vale do Silício)", "🌤️ Clima ameno na maior parte do ano"],
            pontosFracos: ["🏠 Custo de vida entre os mais altos dos EUA", "🚦 Trânsito intenso nas grandes cidades"],
            cidades: [
                { nome: "Los Angeles", forte: "🎬 Grande mercado de entretenimento e mídia", fraco: "🚗 Distâncias enormes, quase tudo exige carro" },
                { nome: "São Francisco", forte: "💻 Coração da indústria de tecnologia", fraco: "💸 Aluguel entre os mais caros do país" }
            ]
        },
        {
            nome: "Nova York", economia: 10, saude: 8, empregos: 9,
            pontosFortes: ["🏦 Centro financeiro global", "🎭 Vida cultural intensa"],
            pontosFracos: ["🏠 Aluguel muito caro, principalmente em Manhattan", "❄️ Invernos rigorosos"],
            cidades: [
                { nome: "Nova York", forte: "💼 Concentra oportunidades em quase todas as áreas", fraco: "🏙️ Apartamentos pequenos e caros" },
                { nome: "Buffalo", forte: "💵 Custo de vida bem mais baixo que a capital", fraco: "❄️ Um dos invernos mais nevados dos EUA" }
            ]
        },
        {
            nome: "Texas", economia: 9, saude: 6, empregos: 9,
            pontosFortes: ["💰 Sem imposto de renda estadual", "🏭 Economia forte em energia e tecnologia"],
            pontosFracos: ["🏥 Cobertura de saúde pública mais limitada", "🌡️ Verões muito quentes"],
            cidades: [
                { nome: "Houston", forte: "⛽ Capital mundial da indústria de energia", fraco: "🌀 Risco de furacões e enchentes" },
                { nome: "Austin", forte: "🚀 Polo de startups em crescimento", fraco: "📈 Custo de vida subindo rápido" }
            ]
        },
        {
            nome: "Flórida", economia: 8, saude: 6, empregos: 8,
            pontosFortes: ["💰 Sem imposto de renda estadual", "☀️ Clima tropical o ano todo"],
            pontosFracos: ["🌀 Área sujeita a furacões", "🏥 Saúde pública mais fraca"],
            cidades: [
                { nome: "Miami", forte: "🌍 Porta de entrada para negócios com a América Latina", fraco: "💸 Custo de vida turístico, bem elevado" },
                { nome: "Orlando", forte: "🎢 Forte mercado de turismo e entretenimento", fraco: "🌡️ Calor e umidade intensos" }
            ]
        }
    ],
    "China": [
        {
            nome: "Guangdong", economia: 10, saude: 6, empregos: 10,
            pontosFortes: ["🏭 Maior polo industrial e exportador do país", "💼 Enorme oferta de empregos"],
            pontosFracos: ["🗣️ Idioma e cultura muito diferentes, adaptação difícil", "🏙️ Poluição em algumas áreas industriais"],
            cidades: [
                { nome: "Guangzhou", forte: "🚢 Um dos maiores portos comerciais do mundo", fraco: "🏗️ Crescimento urbano acelerado e caótico" },
                { nome: "Shenzhen", forte: "📱 Capital chinesa da tecnologia e inovação", fraco: "🏠 Custo de moradia disparou nos últimos anos" }
            ]
        },
        {
            nome: "Jiangsu", economia: 9, saude: 7, empregos: 9,
            pontosFortes: ["🏭 Forte indústria manufatureira", "🎓 Boas universidades e educação"],
            pontosFracos: ["🗣️ Barreira do idioma para estrangeiros", "🌫️ Qualidade do ar variável"],
            cidades: [
                { nome: "Nanjing", forte: "🏛️ Rica história e patrimônio cultural", fraco: "🥵 Verões muito quentes e úmidos" },
                { nome: "Suzhou", forte: "🌸 Alta qualidade de vida e urbanismo planejado", fraco: "💰 Um dos custos de vida mais altos da província" }
            ]
        },
        {
            nome: "Zhejiang", economia: 9, saude: 6, empregos: 9,
            pontosFortes: ["🛒 Forte economia de comércio e e-commerce", "🏞️ Boa qualidade de vida urbana"],
            pontosFracos: ["🗣️ Poucos falantes de inglês fora dos grandes centros", "🏥 Sistema de saúde pouco acessível a estrangeiros"],
            cidades: [
                { nome: "Hangzhou", forte: "🛍️ Sede de gigantes do comércio eletrônico", fraco: "🚦 Trânsito pesado no centro" },
                { nome: "Ningbo", forte: "🚢 Um dos portos mais movimentados do mundo", fraco: "🏭 Forte presença industrial nos arredores" }
            ]
        },
        {
            nome: "Pequim e Tianjin", economia: 10, saude: 7, empregos: 9,
            pontosFortes: ["🏛️ Capital política e cultural do país", "🎓 Melhores universidades da China"],
            pontosFracos: ["🏠 Custo de vida entre os mais altos do país", "🌫️ Poluição do ar em alguns períodos"],
            cidades: [
                { nome: "Pequim", forte: "🏛️ Centro do governo e de grandes empresas", fraco: "📋 Burocracia de residência bastante rígida" },
                { nome: "Tianjin", forte: "🚢 Grande porto e polo industrial", fraco: "👥 Menos cosmopolita que Pequim" }
            ]
        }
    ],
    "Japão": [
        {
            nome: "Tóquio", economia: 10, saude: 9, empregos: 10,
            pontosFortes: ["💼 Maior concentração de empresas e empregos do país", "🚄 Transporte público excelente e pontual"],
            pontosFracos: ["🏠 Apartamentos pequenos e caros", "🗣️ Japonês é essencial no dia a dia"],
            cidades: [
                { nome: "Tóquio", forte: "🌆 Cidade global com infraestrutura de ponta", fraco: "💸 Um dos lugares mais caros do Japão" },
                { nome: "Yokohama", forte: "🌊 Porto importante, perto de Tóquio", fraco: "🏙️ Praticamente uma extensão da capital, congestionada" }
            ]
        },
        {
            nome: "Osaka", economia: 9, saude: 8, empregos: 8,
            pontosFortes: ["🍜 Custo de vida menor que Tóquio", "😄 Cultura local mais informal e acolhedora"],
            pontosFracos: ["💼 Menos vagas em multinacionais que Tóquio", "🗣️ Idioma continua sendo barreira"],
            cidades: [
                { nome: "Osaka", forte: "🏙️ Segunda maior economia urbana do Japão", fraco: "🏚️ Bairros antigos e degradados nas periferias" },
                { nome: "Sakai", forte: "💵 Custo de vida mais baixo que Osaka capital", fraco: "🚉 Menos conectada por trem-bala" }
            ]
        },
        {
            nome: "Aichi", economia: 8, saude: 8, empregos: 8,
            pontosFortes: ["🚗 Forte indústria automotiva (Toyota)", "🏭 Muitas vagas técnicas e de engenharia"],
            pontosFracos: ["🌆 Cidade menos cosmopolita que Tóquio/Osaka", "🗣️ Pouco inglês falado no dia a dia"],
            cidades: [
                { nome: "Nagoya", forte: "🚗 Sede da indústria automobilística japonesa", fraco: "🏙️ Vida noturna e cultural mais limitada" },
                { nome: "Toyota", forte: "💼 Alta concentração de empregos industriais", fraco: "🏘️ Cidade pequena, poucas opções de lazer" }
            ]
        },
        {
            nome: "Fukuoka", economia: 7, saude: 8, empregos: 7,
            pontosFortes: ["💵 Custo de vida bem menor que Tóquio", "🌏 Perto da Coreia do Sul e China, boa localização"],
            pontosFracos: ["💼 Menos oportunidades para estrangeiros qualificados", "🏙️ Cidade regional, menos badalada"],
            cidades: [
                { nome: "Fukuoka", forte: "🚀 Cidade em crescimento, amigável a startups", fraco: "✈️ Menos voos internacionais diretos" },
                { nome: "Kitakyushu", forte: "🏭 Forte tradição industrial", fraco: "👥 População envelhecendo, cidade mais parada" }
            ]
        }
    ],
    "Portugal": [
        {
            nome: "Lisboa", economia: 9, saude: 8, empregos: 8,
            pontosFortes: ["💼 Maior concentração de empresas e startups", "☀️ Clima mediterrâneo agradável"],
            pontosFracos: ["🏠 Aluguel disparou nos últimos anos", "🚗 Trânsito complicado no centro"],
            cidades: [
                { nome: "Lisboa", forte: "🌍 Cidade cosmopolita com forte comunidade de estrangeiros", fraco: "💸 Um dos custos de vida mais altos de Portugal" },
                { nome: "Sintra", forte: "🏰 Qualidade de vida e paisagens únicas", fraco: "🚆 Deslocamento diário até Lisboa pode ser longo" }
            ]
        },
        {
            nome: "Porto", economia: 7, saude: 7, empregos: 6,
            pontosFortes: ["💵 Custo de vida menor que Lisboa", "🍷 Forte identidade cultural e gastronômica"],
            pontosFracos: ["💼 Menos vagas que a capital", "🌧️ Clima mais chuvoso"],
            cidades: [
                { nome: "Porto", forte: "🏙️ Segunda maior cidade, boa infraestrutura", fraco: "🏗️ Turistificação elevando preços no centro" },
                { nome: "Vila Nova de Gaia", forte: "💰 Custo de vida mais acessível que o Porto", fraco: "🌉 Depende do Porto para a maioria dos empregos" }
            ]
        },
        {
            nome: "Faro (Algarve)", economia: 6, saude: 7, empregos: 5,
            pontosFortes: ["☀️ Clima ensolarado o ano quase todo", "🏖️ Ótima qualidade de vida litorânea"],
            pontosFracos: ["💼 Economia sazonal, dependente do turismo", "🏥 Menos infraestrutura de saúde que os grandes centros"],
            cidades: [
                { nome: "Faro", forte: "✈️ Aeroporto internacional na região", fraco: "📉 Poucas oportunidades fora da temporada turística" },
                { nome: "Portimão", forte: "🏖️ Praias e qualidade de vida elevadas", fraco: "👥 Cidade pequena, vida social mais limitada" }
            ]
        },
        {
            nome: "Braga", economia: 6, saude: 7, empregos: 6,
            pontosFortes: ["💵 Custo de vida mais baixo que Lisboa e Porto", "🎓 Forte polo universitário e de tecnologia"],
            pontosFracos: ["💼 Mercado de trabalho menor e mais local", "🌆 Cidade pequena, menos badalada"],
            cidades: [
                { nome: "Braga", forte: "💻 Polo tech em crescimento no Norte", fraco: "🌧️ Clima mais frio e chuvoso que o Sul" },
                { nome: "Guimarães", forte: "🏛️ Cidade histórica com boa qualidade de vida", fraco: "💼 Poucas vagas fora do turismo e educação" }
            ]
        }
    ],
    "França": [
        {
            nome: "Île-de-France", economia: 10, saude: 9, empregos: 9,
            pontosFortes: ["💼 Maior polo econômico do país", "🚄 Transporte público extenso"],
            pontosFracos: ["🏠 Custo de vida entre os mais altos da Europa", "🚦 Trânsito e aglomeração intensos"],
            cidades: [
                { nome: "Paris", forte: "🌍 Cidade global, altíssima empregabilidade", fraco: "💸 Aluguel muito elevado, apartamentos pequenos" },
                { nome: "Versalhes", forte: "🏞️ Mais tranquila, perto de Paris", fraco: "🚆 Depende do trem para chegar ao centro" }
            ]
        },
        {
            nome: "Auvergne-Rhône-Alpes", economia: 8, saude: 8, empregos: 7,
            pontosFortes: ["💵 Custo de vida menor que Paris", "🏔️ Perto dos Alpes, ótima qualidade de vida"],
            pontosFracos: ["💼 Menos vagas que a região de Paris", "🗣️ Menos inglês falado fora das grandes cidades"],
            cidades: [
                { nome: "Lyon", forte: "🍽️ Forte economia e cena gastronômica renomada", fraco: "🏠 Segundo custo de vida mais alto da França" },
                { nome: "Grenoble", forte: "🎓 Polo de pesquisa e tecnologia", fraco: "🏔️ Cidade cercada de montanhas, menos conectada" }
            ]
        },
        {
            nome: "Provença-Alpes-Costa Azul", economia: 7, saude: 8, empregos: 6,
            pontosFortes: ["☀️ Clima mediterrâneo, mais ensolarado", "🏖️ Ótima qualidade de vida litorânea"],
            pontosFracos: ["💼 Economia mais sazonal, ligada ao turismo", "💰 Custo de vida alto nas cidades litorâneas"],
            cidades: [
                { nome: "Marselha", forte: "🚢 Maior porto do Mediterrâneo francês", fraco: "🔒 Índices de criminalidade mais altos em certas áreas" },
                { nome: "Nice", forte: "🏖️ Alta qualidade de vida na Riviera Francesa", fraco: "💸 Um dos lugares mais caros da região" }
            ]
        },
        {
            nome: "Occitânia", economia: 6, saude: 7, empregos: 6,
            pontosFortes: ["🚀 Forte polo aeroespacial (Toulouse)", "💵 Custo de vida menor que Paris"],
            pontosFracos: ["💼 Mercado de trabalho mais concentrado num setor", "🌆 Menos oportunidades fora de Toulouse"],
            cidades: [
                { nome: "Toulouse", forte: "✈️ Capital europeia da indústria aeroespacial", fraco: "🌡️ Verões bem quentes" },
                { nome: "Montpellier", forte: "🎓 Forte comunidade universitária e jovem", fraco: "💼 Menos vagas de alto nível que Toulouse" }
            ]
        }
    ],
    "Coreia do Sul": [
        {
            nome: "Seul", economia: 10, saude: 9, empregos: 10,
            pontosFortes: ["💼 Concentra a maioria das grandes empresas do país", "🚇 Transporte público excelente"],
            pontosFracos: ["🏠 Custo de moradia entre os mais altos da Ásia", "⏰ Cultura de trabalho bastante exigente"],
            cidades: [
                { nome: "Seul", forte: "🌆 Cidade global, altíssima empregabilidade", fraco: "🏙️ Apartamentos pequenos e caros" },
                { nome: "Goyang", forte: "🏡 Mais tranquila, perto de Seul", fraco: "🚆 Depende do metrô para chegar ao centro" }
            ]
        },
        {
            nome: "Incheon e Gyeonggi", economia: 8, saude: 8, empregos: 8,
            pontosFortes: ["✈️ Principal porta de entrada internacional do país", "💵 Custo de vida menor que Seul"],
            pontosFracos: ["💼 Menos vagas de alto escalão que a capital", "🏭 Área mais industrial em alguns pontos"],
            cidades: [
                { nome: "Incheon", forte: "✈️ Sede do maior aeroporto internacional", fraco: "🏭 Forte presença industrial e portuária" },
                { nome: "Suwon", forte: "📱 Polo tecnológico (sede da Samsung)", fraco: "🚦 Trânsito pesado, cidade em expansão" }
            ]
        },
        {
            nome: "Busan e Yeongnam", economia: 8, saude: 8, empregos: 7,
            pontosFortes: ["🚢 Segundo maior porto e economia do país", "🏖️ Qualidade de vida litorânea"],
            pontosFracos: ["💼 Menos oportunidades que Seul", "👥 População mais envelhecida"],
            cidades: [
                { nome: "Busan", forte: "🎬 Forte economia portuária e cultural", fraco: "💼 Mercado de trabalho menor que Seul" },
                { nome: "Daegu", forte: "💵 Custo de vida mais baixo", fraco: "🌡️ Verões muito quentes" }
            ]
        },
        {
            nome: "Chungcheong e Jeju", economia: 6, saude: 7, empregos: 5,
            pontosFortes: ["🌿 Melhor qualidade de vida e menos poluição", "💵 Custo de vida bem mais baixo"],
            pontosFracos: ["💼 Poucas oportunidades de emprego qualificado", "🌆 Vida urbana bem mais limitada"],
            cidades: [
                { nome: "Daejeon", forte: "🔬 Polo nacional de ciência e pesquisa", fraco: "👥 Cidade pouco conhecida fora da Coreia" },
                { nome: "Jeju", forte: "🏝️ Ilha turística com ótima qualidade de vida", fraco: "💼 Economia muito dependente do turismo" }
            ]
        }
    ],
    "Suíça": [
        {
            nome: "Zurique", economia: 10, saude: 10, empregos: 10,
            pontosFortes: ["🏦 Maior centro financeiro do país", "🇬🇧 Muitas empresas internacionais, inglês comum"],
            pontosFracos: ["💰 Um dos lugares mais caros do mundo", "🏠 Mercado imobiliário extremamente concorrido"],
            cidades: [
                { nome: "Zurique", forte: "💼 Maior mercado de trabalho do país", fraco: "💸 Custo de vida altíssimo" },
                { nome: "Winterthur", forte: "💵 Um pouco mais barata que Zurique", fraco: "🚆 Depende de Zurique para vagas melhores" }
            ]
        },
        {
            nome: "Genebra", economia: 9, saude: 10, empregos: 8,
            pontosFortes: ["🌍 Sede de organizações internacionais (ONU e outras)", "🇫🇷 Bom para quem fala francês"],
            pontosFracos: ["💰 Custo de vida tão alto quanto Zurique", "🗣️ Alemão pouco falado na região"],
            cidades: [
                { nome: "Genebra", forte: "🌍 Forte presença de organismos internacionais", fraco: "💸 Aluguel entre os mais caros da Europa" },
                { nome: "Vernier", forte: "💵 Mais acessível que o centro de Genebra", fraco: "🏭 Área mais industrial e residencial simples" }
            ]
        },
        {
            nome: "Vaud", economia: 8, saude: 9, empregos: 7,
            pontosFortes: ["🎓 Forte polo de educação e pesquisa", "🏞️ Excelente qualidade de vida à beira do lago"],
            pontosFracos: ["💰 Custo de vida ainda bastante alto", "💼 Menos vagas que Zurique ou Genebra"],
            cidades: [
                { nome: "Lausanne", forte: "🎓 Sede de universidades renomadas", fraco: "⛰️ Cidade bem inclinada, difícil de percorrer a pé" },
                { nome: "Montreux", forte: "🎵 Alta qualidade de vida e turismo", fraco: "💼 Poucas vagas fora do turismo" }
            ]
        },
        {
            nome: "Berna", economia: 8, saude: 9, empregos: 7,
            pontosFortes: ["🏛️ Capital do país, estabilidade e serviços públicos", "💵 Um pouco mais barata que Zurique/Genebra"],
            pontosFracos: ["💼 Mercado de trabalho menor que Zurique", "🌆 Cidade mais tranquila, menos badalada"],
            cidades: [
                { nome: "Berna", forte: "🏛️ Sede do governo e boa qualidade de vida", fraco: "💼 Menos vagas em multinacionais" },
                { nome: "Basileia", forte: "💊 Forte polo farmacêutico e químico", fraco: "🗣️ Dialeto local pode dificultar integração" }
            ]
        }
    ]
};

// Busca a foto de capa de uma cidade na Wikipédia em tempo real (evita ter que
// cravar dezenas de URLs de imagem no código, que quebrariam se a página mudasse).
const _cacheImagemCidade = new Map();

async function buscarImagemCidade(nomeCidade) {
    if (_cacheImagemCidade.has(nomeCidade)) return _cacheImagemCidade.get(nomeCidade);

    try {
        const resposta = await fetch(
            `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(nomeCidade)}`
        );
        if (!resposta.ok) throw new Error("Não encontrado");

        const dados = await resposta.json();
        const url = dados.thumbnail?.source || dados.originalimage?.source || null;
        _cacheImagemCidade.set(nomeCidade, url);
        return url;
    } catch (erro) {
        _cacheImagemCidade.set(nomeCidade, null);
        return null;
    }
}
