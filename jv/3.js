document.addEventListener("DOMContentLoaded", () => {

    const objetos   = document.querySelectorAll(".obj");
    const descricao = document.querySelector(".descricao-selecao");

    /* som de fundo */

    let somFundo = new Audio("som/cantar.mp3");
    somFundo.loop = true;
    somFundo.volume = 0.1;

    function iniciarSomFundo() {
        if (somFundo.paused) {
            somFundo.currentTime = 0;
            somFundo.play().catch(() => {});
        }
    }

    /* quando a página aparece (normal OU voltar atrás) */
    window.addEventListener("pageshow", () => {
        iniciarSomFundo();
    });

    /* fallback: primeiro clique do utilizador */
    document.addEventListener("click", () => {
        iniciarSomFundo();
    }, { once: true });


    /* som objetos */

    const sonsObjetos = {
        "q3-rolo":   new Audio("som/rolo.mp3"),
        "q3-faca":   new Audio("som/faca.mp3"),
        "q3-colher": new Audio("som/colher.m4a"),
        "q3-gelo":   new Audio("som/cubos.mp3")
    };

    // volume dos sons individuais
    Object.values(sonsObjetos).forEach(som => {
        som.volume = 0.20;
        som.loop = false;
    });

    /* funcoes */

    function pararTodosOsSonsObjetos() {
        Object.values(sonsObjetos).forEach(som => {
            som.pause();
            som.currentTime = 0;
        });
    }

    /* interacoes */

    objetos.forEach(obj => {
        obj.addEventListener("click", () => {

            // remover classe ativa de todos
            objetos.forEach(o => o.classList.remove("ativo"));

            // ativar objeto atual
            obj.classList.add("ativo");

            // atualizar texto descritivo
            descricao.textContent = obj.dataset.text || "";

            // marcar radio correspondente
            const radioId = obj.dataset.radio;
            const radio = document.getElementById(radioId);
            if (radio) radio.checked = true;

            // parar qualquer som anterior
            pararTodosOsSonsObjetos();

            // tocar som deste objeto
            const somAtual = sonsObjetos[radioId];
            if (somAtual) {
                somAtual.play().catch(() => {});
            }
        });
    });

});
