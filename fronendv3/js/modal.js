document.addEventListener('DOMContentLoaded', () => {
    const qrModal = document.getElementById('qrModal');
    const closeButton = document.querySelector('.close-button');
    const modalUnderstandButton = document.getElementById('btn-modal-cerrar');
    const qrImage = document.getElementById('qr-image'); // El elemento <img> para el QR

    // Botón para abrir el modal (ajusta el ID según tu HTML)
    const openQrModalButton = document.getElementById('btn-escanear-qr');

    // Función para mostrar el modal
    function openModal() {
        qrModal.classList.add('show'); // Añade la clase 'show' para mostrar y animar
        // Cuando el modal se abre, genera el QR
        generateQRCode();
    }

    // Función para ocultar el modal
    function closeModal() {
        qrModal.classList.remove('show'); // Remueve la clase 'show'
    }

    // Event Listeners
    if (openQrModalButton) {
        openQrModalButton.addEventListener('click', (event) => {
            event.preventDefault(); // Previene el comportamiento por defecto del enlace
            openModal();
        });
    }

    closeButton.addEventListener('click', closeModal);
    modalUnderstandButton.addEventListener('click', closeModal);

    // Cierra el modal si se hace clic fuera del contenido del modal
    window.addEventListener('click', (event) => {
        if (event.target == qrModal) {
            closeModal();
        }
    });

    // *** Lógica para generar el Código QR ***
    function generateQRCode() {
        // Esta es la URL o los datos que quieres que contenga tu código QR.
        // ¡CAMBIA ESTA URL POR LA REAL DE TU REGISTRO QR!
        // Ejemplo: una URL de registro personalizada, o una API que genere un token.
        const dataToEncode = "https://www.megamall.com.co/registro-qr/mi-negocio";

        // Opción 1: Usar una imagen QR estática pregenerada (más simple)
        // Asegúrate de que esta imagen exista en tu carpeta img/
        qrImage.src = 'img/qr_registro.png'; // Por ejemplo, img/qr_registro.png

        // Opción 2 (Avanzada): Generar QR dinámicamente con una API (ej. api.qrserver.com)
        // Descomenta la siguiente línea y comenta la Opción 1 si la quieres usar
        // qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(dataToEncode)}`;

        // Opción 3 (Más avanzada): Usar una librería JS como qrcode.js para dibujar el QR en un canvas o div
        // Si eliges esta, necesitarías incluir la librería qrcode.js en tu HTML:
        // <script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>
        // Y el contenedor del QR (div.qr-code-placeholder) debería estar vacío inicialmente,
        // sin la etiqueta <img> dentro.
        /*
        const qrCodeDiv = document.querySelector('.qr-code-placeholder');
        qrCodeDiv.innerHTML = ''; // Limpia el contenido anterior
        new QRCode(qrCodeDiv, {
            text: dataToEncode,
            width: 200,
            height: 200,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
        */
    }

    // Opcional: Generar el QR al cargar la página si quieres que esté listo de inmediato
    // generateQRCode();
});