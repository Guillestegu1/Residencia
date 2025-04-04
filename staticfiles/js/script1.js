let index = 0;

// Lista de textos correspondientes a cada imagen
const imageTexts = [
    "1.- Siéntate cómodamente y apoya tus codos en la mesa.\n2.- Frota tus manos entre ellas unos segundos",
    "3.- Cierra los ojos y coloca las palmas de tus manos sobre ellos, de forma que quede un espacio hueco y cerrado.\n4.- Relaja tu mente, procurando no desviarte en pensamientos.",
    "5.- Observa detenidamente la oscuridad de tus párpados."
];

function nextImage() {
    const images = document.querySelectorAll('.image-slider img');
    const textElement = document.getElementById('imageText');

    // Ocultar la imagen actual
    images[index].classList.remove('active');

    // Pasar a la siguiente imagen
    index = (index + 1) % images.length;

    // Mostrar la nueva imagen
    images[index].classList.add('active');

    // Cambiar el texto
    textElement.innerText = imageTexts[index];
}
