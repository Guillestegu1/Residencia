const canvas = document.getElementById("gameCanvas");
canvas.width = 900;
canvas.height = 600;
const ctx = canvas.getContext("2d");

let images = [];
let correctImage;
let round = 0;
let score = 0;
let totalScore = 0;
let module = "Modulo 1";
let responseTimeout;

function loadImages(callback) {
  images = [];
  let loadedCount = 0;

  for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.src = `/static/images/${i}.png`;
    img.onload = () => {
      loadedCount++;
      if (loadedCount === 8) {
        callback();
      }
    };
    images.push({ img, x: 0, y: 0 });
  }
}

function startGame() {
  round = 0;
  score = 0;
  totalScore = 0;
  loadImages(() => {
    nextRound();
  });
}

function nextRound() {
  clearTimeout(responseTimeout);

  if (round < 5) {
    round++;
    updateRoundDisplay();

    correctImage = images[Math.floor(Math.random() * images.length)];

    setTimeout(drawSingleImage, 500);
    setTimeout(showBlankScreen, 1500);
  } else {
    const percentage = Math.round((totalScore / 500) * 100);
    sendScore(totalScore, module);
    document.getElementById("message").innerText = `🏁 Juego completado\nPuntaje total: ${totalScore} puntos\n📊 Porcentaje obtenido: ${percentage}%`;
    document.getElementById("nextButton").style.display = "inline-block";
    document.getElementById("roundCounter").innerText = "✔ Rondas completadas";
  }
}

function updateRoundDisplay() {
  document.getElementById("roundCounter").innerText = `Ronda ${round} de 5`;
}

function drawSingleImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(correctImage.img, canvas.width / 2 - 75, canvas.height / 2 - 75, 150, 150);
}

function showBlankScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  setTimeout(showAllImages, 300);
}

function showAllImages() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const size = 100;

  shuffleArray(images);

  for (let i = 0; i < images.length; i++) {
    const x = Math.floor(Math.random() * (canvas.width - size));
    const y = Math.floor(Math.random() * (canvas.height - size));
    ctx.drawImage(images[i].img, x, y, size, size);

    images[i].x = x;
    images[i].y = y;
    images[i].width = size;
    images[i].height = size;
  }

  // 🟩 Muestra barra de progreso llena y empieza a vaciar
  const progressBar = document.getElementById("progressBar");
  progressBar.style.transition = "none"; // reinicia transición
  progressBar.style.width = "100%";
  void progressBar.offsetWidth; // reflow
  progressBar.style.transition = "width 3s linear";
  progressBar.style.width = "0%";

  canvas.onclick = handleAnswer;

  // ⏱️ Tiempo límite para responder
  responseTimeout = setTimeout(() => {
    score = 0;
    document.getElementById("message").innerText = `⏱️ Tiempo agotado (0 puntos)`;
    canvas.onclick = null;

    setTimeout(() => {
      document.getElementById("message").innerText = "";
      progressBar.style.width = "0%";
      nextRound();
    }, 1000);
  }, 3000);
}

function handleAnswer(event) {
  clearTimeout(responseTimeout);
  const clickX = event.offsetX;
  const clickY = event.offsetY;

  for (let i = 0; i < images.length; i++) {
    const { x, y, width, height, img } = images[i];
    if (clickX >= x && clickX <= x + width && clickY >= y && clickY <= y + height) {
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
      }, 1000);

      return;
    }
  }
}

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
      console.log('📤 Puntuación enviada:', data);
    })
    .catch(error => {
      console.error('⚠️ Error al enviar puntuación:', error);
    });
}

function getCSRFToken() {
  const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
  return cookie ? cookie.split('=')[1] : '';
}
