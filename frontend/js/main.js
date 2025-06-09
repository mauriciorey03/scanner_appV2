// Facturas demo (interna y externa)

// Variables
const input = document.getElementById('cedulaInput');
const keys = document.querySelectorAll('.key[data-key]');
const backspace = document.getElementById('backspace');
const confirmarBtn = document.getElementById('confirmarBtn');
const limpiarBtn = document.getElementById('limpiarBtn');
const panelFacturas = document.getElementById('panel-facturas');
const cedulaAsociadaLeft = document.getElementById('cedula-asociada-left');
const controlesFacturas = document.getElementById('controles-facturas');
let cedulaActual = "";
let facturas = [];

// Habilitar botones
function actualizarBotones() {
    confirmarBtn.disabled = !(input.value.length >= 6);
    limpiarBtn.disabled = !(input.value.length >= 1);
}
keys.forEach(key => {
    key.addEventListener('click', () => {
        if (input.value.length < input.maxLength) {
            input.value += key.dataset.key;
            actualizarBotones();
        }
    });
});
backspace.addEventListener('click', () => {
    input.value = input.value.slice(0, -1);
    actualizarBotones();
});
limpiarBtn.addEventListener('click', () => {
    input.value = "";
    actualizarBotones();
});
input.addEventListener('input', actualizarBotones);

// Confirmar cédula
confirmarBtn.addEventListener('click', () => {
    if (input.value.length < 6) {
        alert("Por favor, ingresa un número de cédula válido.");
        return;
    }
    cedulaActual = input.value;
    facturas = [];
    document.getElementById('form-cedula-area').classList.add('hidden');
    controlesFacturas.classList.remove('hidden');
    panelFacturas.classList.remove('hidden');
    cedulaAsociadaLeft.innerText = cedulaActual;
    anadirFactura();
});

function scrollToLastInvoice() {
    setTimeout(() => {
        const facturesContainer = document.querySelector('.facturas-container');
        const lista = document.getElementById('factura-lista');
        
        if (facturesContainer && lista.children.length > 0) {
            // Hacer scroll en el contenedor que tiene el scroll
            facturesContainer.scrollTop = facturesContainer.scrollHeight;
        }
    }, 200);
}

// Añadir otra factura -
document.getElementById('btnOtraFactura').addEventListener('click', anadirFactura);
let indiceActual = 0;
function anadirFactura() {
    const ejemplo = ejemplos[indiceActual];
    const factura = {...ejemplo, cedula: cedulaActual};
    facturas.push(factura);
    indiceActual++;

    renderFacturas();
}

// Renderizar facturas
function renderFacturas() {
    const lista = document.getElementById('factura-lista');
    lista.innerHTML = "";
    facturas.forEach((f, idx) => {
        const div = document.createElement('div');
        div.className = `factura-card ${f.tipo === 'externo' ? 'externa' : ''}`;
        const esExterno = f.tipo === 'externo';
        const tipoCapitalizado = f.tipo ? f.tipo.charAt(0).toUpperCase() + f.tipo.slice(1) : 'Interno';
        div.innerHTML = `
            ${esExterno ? `<button class="btn-eliminar" title="Eliminar factura">&times;</button>` : ""}
            <div class="tienda-header">#${idx+1} ${f.tienda ?? "(Sin tienda)"}</div>
            <div class="factura-info">
                <div class="campo"><strong>Titular:</strong> <span>${f.titular ?? "-"}</span></div>
                <div class="campo"><strong>Documento:</strong> <span>${f.documento ?? "-"}</span></div>
                <div class="campo"><strong>NIT:</strong> <span>${f.NIT ?? "-"}</span></div>
                <div class="campo"><strong>Fecha:</strong> <span>${f.fecha_compra ?? "-"}</span></div>
                <div class="campo"><strong>Contacto:</strong> <span>${f.contacto ?? "-"}</span></div>
                <div class="campo"><strong>Tipo:</strong> <span class="tipo-badge ${f.tipo}">${tipoCapitalizado}</span></div>
            </div>
            <div class="prefijo-info"><strong>Prefijo:</strong> ${f.prefijo ?? "-"}</div>
            <div class="valor-total">Valor Total: ${f.valor_total ?? "-"}</div>
            ${esExterno ? `
                <div class="mensaje-advertencia">
                Lo sentimos, parece que este local no pertenece a nuestro centro comercial, por ello no podemos registrar esta factura. Si crees que ocurrió un error, contáctanos.
                </div>
            ` : ""}
        `;
        // Botón eliminar funcional solo para externas
        if (esExterno) {
            div.querySelector('.btn-eliminar').addEventListener('click', () => {
                facturas.splice(idx, 1);
                renderFacturas();
            });
        }
        lista.appendChild(div);
    });
    scrollToLastInvoice();

}

// === Confirmar y finalizar ===
document.getElementById('btnFinalizar').addEventListener('click', () => {
    // Filtrar solo facturas internas para envío
    const facturasInternas = facturas.filter(f => f.tipo === 'interno');
    const facturasExternas = facturas.filter(f => f.tipo === 'externo');
    
    // Validar si hay facturas para enviar
    if (facturasInternas.length === 0) {
        if (facturasExternas.length > 0) {
            alert('No se pueden enviar las facturas. Todas las facturas registradas son de locales externos al centro comercial. Por favor, elimine las facturas externas o agregue facturas válidas.');
        } else {
            alert('No hay facturas registradas para enviar.');
        }
        return;
    }
    
    // Mostrar advertencia si hay facturas externas
    if (facturasExternas.length > 0) {
        const confirmar = confirm(
            `Se enviarán ${facturasInternas.length} factura(s) válida(s).\n\n` +
            `Nota: ${facturasExternas.length} factura(s) externa(s) no será(n) enviada(s) porque no pertenece(n) a nuestro centro comercial.\n\n` +
            `¿Desea continuar con el envío?`
        );
        if (!confirmar) return;
    }
    
    // Proceder con el envío
    document.getElementById('controles-facturas').classList.add('hidden');
    document.getElementById('panel-facturas').classList.add('hidden');
    document.getElementById('mensaje-exito').classList.remove('hidden');
    
    // Actualizar mensaje de éxito con número de facturas enviadas
    const mensajeExito = document.querySelector('.btn-exito');
    const pluralFacturas = facturasInternas.length > 1 ? 's' : '';
    const verboEnviado = facturasInternas.length > 1 ? 'fueron enviadas' : 'fue enviada';
    
    mensajeExito.innerHTML = `
        ¡Felicidades! ${facturasInternas.length} factura${pluralFacturas} ${verboEnviado} con éxito!<br>
        Gracias por tu registro y te invitamos a seguir comprando en nuestro centro comercial.
    `;
    
    // Redirigir a index.html después de mostrar el mensaje
    setTimeout(() => {
        window.location.href = 'WeGrowFacturas.html';
    }, 4000);
});
// Inicial
actualizarBotones();
