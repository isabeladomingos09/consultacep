// Função para trocar as abas (CEP / CNPJ)
function abrirAba(evt, nomeAba) {
    let i, tabcontent, tablinks;
    
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }
    
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    
    document.getElementById(nomeAba).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// Lógica de busca de CEP
function buscarCEP() {
    let cep = document.getElementById('cep').value.replace(/\D/g, '');
    const resultadoDiv = document.getElementById('resultado-cep');

    if (cep.length !== 8) {
        resultadoDiv.innerHTML = '<div class="msg-erro">⚠️ Digite um CEP com 8 números.</div>';
        return;
    }

    resultadoDiv.innerHTML = '<div class="msg-loading">⏳ Buscando...</div>';

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(data => {
            if (data.erro) throw new Error();
            resultadoDiv.innerHTML = `
                <div class="resultado-box anime-fade">
                    <div class="info-linha"><span class="label">Cidade</span><span class="dado">${data.localidade} - ${data.uf}</span></div>
                    <div class="info-linha"><span class="label">Logradouro</span><span class="dado">${data.logradouro || '-'}</span></div>
                    <div class="info-linha"><span class="label">Bairro</span><span class="dado">${data.bairro || '-'}</span></div>
                </div>`;
        })
        .catch(() => {
            resultadoDiv.innerHTML = '<div class="msg-erro">❌ CEP não encontrado.</div>';
        });
}

// Lógica de busca de CNPJ (Receita WS)
function buscarCNPJ() {
    let cnpj = document.getElementById('cnpj').value.replace(/\D/g, '');
    const resultadoDiv = document.getElementById('resultado-cnpj');

    if (cnpj.length !== 14) {
        resultadoDiv.innerHTML = '<div class="msg-erro">⚠️ Digite 14 números.</div>';
        return;
    }

    resultadoDiv.innerHTML = '<div class="msg-loading">⏳ Consultando Receita WS...</div>';

    // Técnica de JSONP para evitar erro de CORS
    const script = document.createElement('script');
    script.src = `https://receitaws.com.br/v1/cnpj/${cnpj}?callback=processarCNPJ`;
    document.body.appendChild(script);
}

// Função de retorno da API do CNPJ
function processarCNPJ(data) {
    const resultadoDiv = document.getElementById('resultado-cnpj');
    
    if (data.status === "ERROR") {
        resultadoDiv.innerHTML = `<div class="msg-erro">❌ ${data.message}</div>`;
    } else {
        resultadoDiv.innerHTML = `
            <div class="resultado-box anime-fade">
                <div class="info-linha"><span class="label">Empresa</span><span class="dado">${data.nome}</span></div>
                <div class="info-linha"><span class="label">Situação</span><span class="dado">${data.situacao}</span></div>
                <div class="info-linha"><span class="label">Atividade</span><span class="dado">${data.atividade_principal[0].text}</span></div>
                <div class="info-linha"><span class="label">Abertura</span><span class="dado">${data.abertura}</span></div>
            </div>`;
    }
    // Remove o script temporário
    const scripts = document.querySelectorAll('script[src*="receitaws"]');
    scripts.forEach(s => s.remove());
}