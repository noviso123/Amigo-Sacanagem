let participanteSelecionado;
let participantesSorteados = [];

document.addEventListener("DOMContentLoaded", function() {
    const participantes = document.querySelectorAll(".participante");
    const sorteioContainer = document.getElementById("sorteio-container");

    participantes.forEach(participante => {
        participante.addEventListener("click", function() {
            participanteSelecionado = this.dataset.nome;
            participantes.forEach(p => p.classList.remove("participante-selecionado"));
            this.classList.add("participante-selecionado");
            sorteioContainer.style.display = "block";
        });
    });

    // Carrega os participantes sorteados armazenados no Firebase Realtime Database
    database.ref('participantesSorteados').on('value', function(snapshot) {
        participantesSorteados = snapshot.val() || [];
    });
});

function realizarSorteio() {
    const participantes = ["Jhonatan", "Lolo", "Barbara", "Lucas", "Couto", "Karla", "Gabriel", "Brenda"];

    const participantesDisponiveis = participantes.filter(nome => 
        !participantesSorteados.includes(nome) && nome !== participanteSelecionado && podeSortear(nome, participanteSelecionado)
    );

    if (participantesDisponiveis.length > 0) {
        const indiceSorteado = Math.floor(Math.random() * participantesDisponiveis.length);
        const amigoSecreto = participantesDisponiveis[indiceSorteado];

        participantesSorteados.push(amigoSecreto);
        document.getElementById("resultado-sorteio").innerHTML = "🎉 Você sorteou: <span style='color: #f00;'>" + amigoSecreto + "😈 </span style='color: #f00;'>";

        // Armazena os participantes sorteados no Firebase Realtime Database
        database.ref('participantesSorteados').set(participantesSorteados);

        // Verifica se todos foram sorteados
        verificarFinalizacaoSorteio(participantes);
    } else {
        alert("Todos já foram sorteados ou você só pode sortear o próprio nome!");
        // Se desejar, adicione alguma ação adicional ao lidar com a situação de nenhum participante disponível
    }
}

function podeSortear(nomeSorteado, nomeSorteador) {
    const restricoes = {
        "Jhonatan": ["Lolo"],
        "Lucas": ["Barbara"],
        "Couto": ["Karla"],
        "Gabriel": ["Brenda"],
        "Lolo": ["Jhonatan"],
        "Barbara": ["Lucas"],
        "Karla": ["Couto"],
        "Brenda": ["Gabriel"]
    };

    return !restricoes[nomeSorteador] || !restricoes[nomeSorteador].includes(nomeSorteado);
}

function reiniciarSorteio() {
    // Reinicialize as variáveis necessárias
    participanteSelecionado = null;
    participantesSorteados = [];

    // Limpe a interface ou realize outras ações necessárias
    document.getElementById("resultado-sorteio").innerHTML = "";
    // Adicione outras ações de reinicialização, se necessário
}

function verificarFinalizacaoSorteio(participantes) {
    if (participantesSorteados.length === participantes.length) {
        const resposta = confirm("Todos foram sorteados. Deseja reiniciar o sorteio?");
        if (resposta) {
            reiniciarSorteio();
        } else {
            alert("Sorteio finalizado. Obrigado por participar!");
            // Limpar a interface ou fazer outras ações necessárias ao encerrar o sorteio
        }
    }
}
