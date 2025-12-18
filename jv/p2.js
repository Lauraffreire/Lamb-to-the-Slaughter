const canvas = document.getElementById("blurCanvas");

// --- Efeito de lupa ---
window.addEventListener("mousemove", (e) => {
    canvas.style.setProperty("--mx", e.clientX + "px");
    canvas.style.setProperty("--my", e.clientY + "px");
});

// Inicializa máscara fora do ecrã
canvas.style.setProperty("--mx", "-9999px");
canvas.style.setProperty("--my", "-9999px");

// Música de fundo
let bgMusic = document.getElementById("bgMusic");

if (!bgMusic) {
    bgMusic = document.createElement("audio");
    bgMusic.id = "bgMusic";
    bgMusic.src = "som/background.mp3";
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    document.body.appendChild(bgMusic);
}

// Desbloquear autoplay
let audioUnlocked = false;

function unlockAudio() {
    if (audioUnlocked) return;
    bgMusic.play().catch(() => {}); // tenta tocar
    audioUnlocked = true;

    document.removeEventListener('mousemove', unlockAudio);
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('keydown', unlockAudio);
}

// Liga o desbloqueio na primeira interação
document.addEventListener('mousemove', unlockAudio, { once: true });
document.addEventListener('click', unlockAudio, { once: true });
document.addEventListener('keydown', unlockAudio, { once: true });

// Evento pageshow: quando o utilizador volta com back/forward
window.addEventListener('pageshow', () => {
    if (audioUnlocked) {
        bgMusic.currentTime = 0;
        bgMusic.play().catch(() => {});
    }
});


