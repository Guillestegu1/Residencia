const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let images = [];
let correctImageIndex;
let score = 0;

// Cargar imágenes
function loadImages() {
  images = [];
  for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.src = `/static/images/${i}.png`;
    img.onload = () => console.log(`Imagen ${i} cargada`);
    images.push({ img, x: 0, y: 0 }); // Guardamos imagen y posición
  }
}

// Iniciar el juego
function startGame() {
  score = 0;
  loadImages();
  correctImageIndex = Math.floor(Math.random() * images.length);
  
  // Mostrar una imagen al azar durante 3 segundos
  setTimeout(() => drawSingleImage(), 500);
  setTimeout(showBlankScreen, 3500); // Después de 3 segundos
}

// Mostrar una imagen específica para recordar
function drawSingleImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const image = images[correctImageIndex].img;
  ctx.drawImage(image, 225, 225, 150, 150);
}

// Mostrar pantalla negra
function showBlankScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  setTimeout(showAllImages, 1000); // Después de 1 segundo
}

// Mostrar todas las imágenes para seleccionar
function showAllImages() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const size = 150;

  // Dibujar las imágenes en una cuadrícula de 4x2
  for (let i = 0; i < images.length; i++) {
    const x = (i % 4) * size + 25;
    const y = Math.floor(i / 4) * size + 25;
    ctx.drawImage(images[i].img, x, y, size, size);

    // Guardar coordenadas para la detección de clics
    images[i].x = x;
    images[i].y = y;
  }

  // Activar clic para detectar respuesta
  canvas.onclick = handleAnswer;
}

// Comprobar si la imagen seleccionada es correcta
function handleAnswer(event) {
  const clickX = event.offsetX;
  const clickY = event.offsetY;
  const size = 150;

  for (let i = 0; i < images.length; i++) {
    const { x, y } = images[i];
    if (clickX >= x && clickX <= x + size && clickY >= y && clickY <= y + size) {
      if (i === correctImageIndex) {
        score = 100;
        document.getElementById("message").innerText = "✅ ¡Correcto! Ganaste 100 puntos.";
      } else {
        score = 0;
        document.getElementById("message").innerText = "❌ Incorrecto. Era otra imagen.";
      }
      sendScore(score);
      canvas.onclick = null; // Desactivar clics después de responder
      return;
    }
  }
}

// Enviar la puntuación al backend
function sendScore(score, module) {
  fetch('/save_score/', {
    method: 'POST',
    body: JSON.stringify({ module: module, score: score }),
    headers: { 
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken()  // Para seguridad CSRF
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('Puntuación guardada:', data);
  });
}

// Obtener token CSRF
function getCSRFToken() {
  return document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1];
}