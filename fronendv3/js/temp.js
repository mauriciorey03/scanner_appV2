const backendUrl = 'http://localhost:8000';
const wsUrl = 'ws://localhost:8000/ws/frontend';

const statusEl = document.getElementById('status');
const outputEl = document.getElementById('output');

function escanear() {
    statusEl.innerText = "⏳ Enviando orden de escaneo...";
    outputEl.innerText = "";
    fetch(`${backendUrl}/orden_escanear/local1`, { method: "POST" })
        .then(r => r.json())
        .then(data => {
            statusEl.innerText = "✅ Orden enviada. Esperando resultado...";
            outputEl.innerText = JSON.stringify(data, null, 2);
            // Si solo usas REST, el resultado está aquí.
            // Si tienes WebSocket, espera el mensaje push.
        })
        .catch(err => {
            statusEl.innerText = "❌ Error enviando la orden";
            outputEl.innerText = err.toString();
        });
}

// --- (Opcional) Recibir resultado por WebSocket en tiempo real ---
let socket;
function conectarWebSocket() {
    socket = new WebSocket(wsUrl);
    socket.onopen = function() {
        statusEl.innerText = "🟢 Conectado para resultados en tiempo real";
    };
    socket.onmessage = function(event) {
        // Espera un JSON con el resultado OCR
        try {
            const msg = JSON.parse(event.data);
            if (msg.type === "ocr_result") {
                statusEl.innerText = "📄 Resultado OCR recibido";
                outputEl.innerText = JSON.stringify(msg.data, null, 2);
            }
        } catch (e) {
            // Mensaje no esperado
        }
    };
    socket.onclose = function() {
        statusEl.innerText = "🔴 Desconectado del WebSocket, reintentando...";
        setTimeout(conectarWebSocket, 5000);
    };
    socket.onerror = function() {
        statusEl.innerText = "❌ Error en WebSocket";
    };
}

// (Descomenta esta línea si implementas el WebSocket en backend)
// conectarWebSocket();
