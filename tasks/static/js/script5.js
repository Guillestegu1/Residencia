const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let images = [];
let correctImage;
let round = 0;
let score = 0;
let totalScore = 0;
let module = "Modulo 6";

function loadImages() {
  images = [];
  for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.src = `/static/images/${i}.png`;
    images.push({ img, x: 0, y: 0 });
  }
}

function startGame() {
  round = 0;
  score = 0;
  totalScore = 0;
  loadImages();
  nextRound();
}

function nextRound() {
  if (round < 5) {
    round++;
    updateRoundDisplay();

    // Selecciona la imagen correcta antes de barajar
    correctImage = images[Math.floor(Math.random() * images.length)];

    setTimeout(() => drawSingleImage(), 500);
    setTimeout(showBlankScreen, 3500);
  } else {
    sendScore(totalScore, module);
    document.getElementById("message").innerText += `\n🏁 Juego completado. Puntaje total: ${totalScore}`;
    document.getElementById("nextButton").style.display = "inline-block";
    document.getElementById("roundCounter").innerText = "✔ Rondas completadas";
  }
}

function updateRoundDisplay() {
  const counter = document.getElementById("roundCounter");
  counter.innerText = `Ronda ${round} de 5`;
}

function drawSingleImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(correctImage.img, 225, 225, 150, 150);
}

function showBlankScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  setTimeout(showAllImages, 1000);
}

function showAllImages() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const size = 150;

  shuffleArray(images); // 🔁 Mezcla las imágenes antes de mostrarlas

  for (let i = 0; i < images.length; i++) {
    const x = (i % 4) * size + 25;
    const y = Math.floor(i / 4) * size + 25;
    ctx.drawImage(images[i].img, x, y, size, size);

    images[i].x = x;
    images[i].y = y;
  }

  canvas.onclick = handleAnswer;
}

function handleAnswer(event) {
  const clickX = event.offsetX;
  const clickY = event.offsetY;
  const size = 150;

  for (let i = 0; i < images.length; i++) {
    const { x, y, img } = images[i];
    if (clickX >= x && clickX <= x + size && clickY >= y && clickY <= y + size) {
      if (img === correctImage.img) {
        score = 100;
        document.getElementById("message").innerText = `✅ Correcto (+100 puntos)`;
      } else {
        score = 0;
        document.getElementById("message").innerText = `❌ Incorrecto (0 puntos)`;
      }

      totalScore += score;
      canvas.onclick = null;

      setTimeout(() => {
        document.getElementById("message").innerText = "";
        nextRound();
      }, 3000);

      return;
    }
  }
}

// 🔁 Mezcla un array (Fisher-Yates Shuffle)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function sendScore(score, module) {
  fetch('/save_score/', {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify({ module: module, score: score }),
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken()
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log('Puntuación enviada:', data);
    })
    .catch(error => {
      console.error('Error al enviar puntuación:', error);
    });
}

function getCSRFToken() {
  const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
  return cookie ? cookie.split('=')[1] : '';
}
