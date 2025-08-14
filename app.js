// --- Mostrar/Ocultar memorama y documento ---
document.addEventListener('DOMContentLoaded', () => {
    const jugarBtn = document.getElementById('jugar-btn');
    const volverBtn = document.getElementById('volver-btn');
    const documento = document.getElementById('documento');
    const memorama = document.getElementById('memorama');

    if (jugarBtn) {
        jugarBtn.onclick = () => {
            documento.style.display = 'none';
            memorama.style.display = 'block';
            iniciarMemorama();
        };
    }
    if (volverBtn) {
        volverBtn.onclick = () => {
            documento.style.display = 'block';
            memorama.style.display = 'none';
            reiniciarMemorama();
        };
    }
});

// --- Lógica del juego ---
let cardValues = ['A', '2', '3', '4', '5', '6'];
let cards = [];
let board, message, timerSpan, failsSpan;
let firstCard, secondCard, lockBoard, matches, fails, timer, timerInterval, gameStarted, gameOver;

function iniciarMemorama() {
    // Inicializar variables y referencias
    cardValues = ['A', '2', '3', '4', '5', '6'];
    cards = [...cardValues, ...cardValues];
    shuffle(cards);

    board = document.getElementById('card-board');
    message = document.getElementById('message');
    timerSpan = document.getElementById('timer');
    failsSpan = document.getElementById('fails');

    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matches = 0;
    fails = 0;
    timer = 150;
    timerInterval = null;
    gameStarted = false;
    gameOver = false;

    // Limpiar tablero y mensaje
    board.innerHTML = '';
    message.textContent = '';
    failsSpan.textContent = 'Fallos: 0';
    timerSpan.textContent = 'Tiempo: 02:30';

    // Crear cartas
    cards.forEach((value) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.value = value;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">${value}</div>
                <div class="card-back">?</div>
            </div>
        `;
        card.addEventListener('click', () => flipCard(card));
        board.appendChild(card);
    });
}

function flipCard(card) {
    if (lockBoard || card.classList.contains('flipped') || gameOver) return;

    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    card.classList.add('flipped');

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    lockBoard = true;

    if (firstCard.dataset.value === secondCard.dataset.value) {
        matches++;
        resetTurn();
        if (matches === cardValues.length) {
            stopTimer();
            message.textContent = `¡Felicidades! Encontraste todos los pares en ${formatTime(150 - timer)} con ${fails} fallos.`;
            gameOver = true;
        }
    } else {
        fails++;
        failsSpan.textContent = `Fallos: ${fails}`;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetTurn();
        }, 1000);
    }
}

function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startTimer() {
    timerSpan.textContent = `Tiempo: ${formatTime(timer)}`;
    timerInterval = setInterval(() => {
        timer--;
        timerSpan.textContent = `Tiempo: ${formatTime(timer)}`;
        if (timer <= 0) {
            stopTimer();
            timerSpan.textContent = `Tiempo: 00:00`;
            message.textContent = "¡Tiempo agotado! Intenta de nuevo.";
            gameOver = true;
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function formatTime(seconds) {
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return `${mm}:${ss}`;
}

function reiniciarMemorama() {
    stopTimer();
}