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

        // Armazene os participantes sorteados no Firebase Realtime Database
        database.ref('participantesSorteados').set(participantesSorteados);
    } else {
        alert("Todos já foram sorteados ou você só pode sortear o próprio nome!");
    }
}

function podeSortear(nomeSorteado, nomeSorteador) {
    const restricoes = {
        "Jhonatan": ["Lolo"],
        "Lucas": ["Barbara"],
        "Couto": ["Karla"],
        "Gabriel": ["Brenda"]
    };

    return !restricoes[nomeSorteador] || !restricoes[nomeSorteador].includes(nomeSorteado);
}
