const playerChoiceEl = document.getElementById('playerChoice');
const cpuChoiceEl = document.getElementById('cpuChoice');
const playerIconEl = document.getElementById('playerIcon');
const cpuIconEl = document.getElementById('cpuIcon');
const resultTextEl = document.getElementById('resultText');
const resultIconEl = document.getElementById('resultIcon');
const winsEl = document.getElementById('wins');
const tiesEl = document.getElementById('ties');
const lossesEl = document.getElementById('losses');

const resetAllBtn = document.getElementById('resetAll');
const resetRoundBtn = document.getElementById('resetRound');
const resetScoresBtn = document.getElementById('resetScores');
const playAgainBtn = document.getElementById('playAgain');

const choiceButtons = Array.from(document.querySelectorAll('[data-choice]'));

const choices = {
rock: {
    label: 'Rock',
    icon:'image/Rock.jpg.png'
},
paper: {
    label: 'Paper',
    icon: 'image/paper.jpg.png'
},
scissors: {
    label: 'Scissors',
    icon: 'image/Scissors.jpg.png'
}
};

const beats = {
rock: 'scissors',
paper: 'rock',
scissors: 'paper'
};

const storageKey = 'scoreStorage';

let score = {
wins: 0,
ties: 0,
losses: 0
};

function loadScore() {
const raw = localStorage.getItem(storageKey);
if (raw) {
    try {
    const saved = JSON.parse(raw);
    if (typeof saved.wins === 'number' && typeof saved.ties === 'number' && typeof saved.losses === 'number') {
        score = saved;
    }
    } catch {}
}
renderScore();
}

function saveScore() {
localStorage.setItem(storageKey, JSON.stringify(score));
}

function renderScore() {
winsEl.textContent = score.wins;
tiesEl.textContent = score.ties;
lossesEl.textContent = score.losses;
}

function setButtonsDisabled(disabled) {
choiceButtons.forEach(btn => {
    btn.disabled = disabled;
    btn.classList.toggle('opacity-60', disabled);
    btn.setAttribute('aria-pressed', 'false');
});
playAgainBtn.disabled = !disabled;
}

function clearRound() {
playerChoiceEl.textContent = '—';
cpuChoiceEl.textContent = '—';
playerIconEl.src = 'image/questionmark.jpg.png';
cpuIconEl.src = 'image/questionmark.jpg.png';
resultTextEl.textContent = '—';
resultIconEl.src = 'image/logo.png';
setButtonsDisabled(false);
}

function randomCpu() {
const keys = Object.keys(choices);
return keys[Math.floor(Math.random() * keys.length)];
}

function decide(you, cpu) {
if (you === cpu) return 'tie';
if (beats[you] === cpu) return 'win';
return 'loss';
}

function updateOutcomeUI(you, cpu, outcome) {
playerChoiceEl.textContent = choices[you].label;
cpuChoiceEl.textContent = choices[cpu].label;
playerIconEl.src = choices[you].icon;
cpuIconEl.src = choices[cpu].icon;

if (outcome === 'win') {
    resultTextEl.textContent = 'You win!';
    resultIconEl.src = 'image/win.png';
} else if (outcome === 'loss') {
    resultTextEl.textContent = 'You lose!';
    resultIconEl.src = 'image/lose.png';
} else {
    resultTextEl.textContent = 'It’s a tie!';
    resultIconEl.src = 'image/tie.png';
}
}

function animatePress(btn) {
btn.classList.add('ring-2', 'ring-offset-2');
setTimeout(() => {
    btn.classList.remove('ring-2', 'ring-offset-2');
}, 220);
}

function playRound(you) {
const btn = choiceButtons.find(b => b.dataset.choice === you);
if (btn && btn.disabled) return;
if (btn) animatePress(btn);

const cpu = randomCpu();
const outcome = decide(you, cpu);

updateOutcomeUI(you, cpu, outcome);

if (outcome === 'win') score.wins += 1;
if (outcome === 'loss') score.losses += 1;
if (outcome === 'tie') score.ties += 1;

renderScore();
saveScore();
setButtonsDisabled(true);
}

choiceButtons.forEach(btn => {
btn.addEventListener('click', () => {
    playRound(btn.dataset.choice);
    btn.setAttribute('aria-pressed', 'true');
});
});

playAgainBtn.addEventListener('click', () => {
clearRound();
});

resetScoresBtn.addEventListener('click', () => {
score = {
    wins: 0,
    ties: 0,
    losses: 0
};
renderScore();
saveScore();
});

resetRoundBtn.addEventListener('click', () => {
clearRound();
});

resetAllBtn.addEventListener('click', () => {
score = {
    wins: 0,
    ties: 0,
    losses: 0
};
renderScore();
saveScore();
clearRound();
});

document.addEventListener('keydown', (e) => {
if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
if (e.key === '1') playRound('rock');
if (e.key === '2') playRound('paper');
if (e.key === '3') playRound('scissors');
if (e.key.toLowerCase() === 'r') clearRound();
});

loadScore();
clearRound();
