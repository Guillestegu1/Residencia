const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let images = [];
let correctImageIndex;
let score = 0;
let module = "memory_game"; // Define el módulo que se enviará al backend

// Cargar imágenes
function loadImages() {
  images = [];
  for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.src = `/static/images/${i}.png`;
    img.onload = () => console.log(`Imagen ${i} cargada`);
    images.push({ img, x: 0, y: 0 });
  }
}

// Iniciar el juego
function startGame() {
  score = 0;
  loadImages();
  correctImageIndex = Math.floor(Math.random() * images.length);
  
  // Mostrar imagen por 3 segundos
  setTimeout(() => drawSingleImage(), 500);
  setTimeout(showBlankScreen, 3500); // Después de 3 segundos
}

// Mostrar una imagen para recordar
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

  for (let i = 0; i < images.length; i++) {
    const x = (i % 4) * size + 25;
    const y = Math.floor(i / 4) * size + 25;
    ctx.drawImage(images[i].img, x, y, size, size);

    images[i].x = x;
    images[i].y = y;
  }

  canvas.onclick = handleAnswer; // Activar detección de clics
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
      sendScore(score, module);
      canvas.onclick = null; // Desactivar clics después de responder
      return;
    }
  }
}

// Enviar la puntuación al backend
function sendScore(score) {
  fetch('/save_score/', {
      method: 'POST',
      credentials: 'same-origin', // Para asegurar que se envíe la cookie CSRF
      body: JSON.stringify({ module: "Memoria", score: score }),
      headers: { 
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken()  // Obtener el token CSRF
      }
  })
  .then(response => response.json())
  .then(data => {
      console.log('Respuesta del servidor:', data);
  })
  .catch(error => {
      console.error('Error al enviar puntuación:', error);
  });
}

// Obtener token CSRF
function getCSRFToken() {
  const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
  return cookie ? cookie.split('=')[1] : '';
}
