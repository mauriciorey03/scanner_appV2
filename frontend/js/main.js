    // === Teclado numérico ===
    const input = document.getElementById('cedulaInput');
    const keys = document.querySelectorAll('.key[data-key]');
    const backspace = document.getElementById('backspace');
    const confirmarBtn = document.getElementById('confirmarBtn');
    const limpiarBtn = document.getElementById('limpiarBtn');
    let cedulaActual = "";
    let facturas = [];

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

    // === Confirmar Cedula ===
    confirmarBtn.addEventListener('click', () => {
        if (input.value.length < 6) {
            alert("Por favor, ingresa un número de cédula válido.");
            return;
        }
        cedulaActual = input.value;
        facturas = [];
        document.getElementById('form-cedula-area').style.display = "none";
        document.getElementById('panel-facturas').style.display = "block";
        document.getElementById('cedula-asociada').innerText = cedulaActual;
        anadirFactura();
    });

    // === Añadir otra factura (simula escaneo) ===
    document.getElementById('btnOtraFactura').addEventListener('click', anadirFactura);

    function anadirFactura() {
    if (typeof ejemplos === 'undefined' || !Array.isArray(ejemplos)) {
        alert("No hay datos de demo.js cargados.");
        return;
    }
    const ejemplo = ejemplos[Math.floor(Math.random() * ejemplos.length)];
    const factura = {...ejemplo, cedula: cedulaActual};
    facturas.push(factura);
    renderFacturas();
}

    // === Renderizar facturas ===
    function renderFacturas() {
        const lista = document.getElementById('factura-lista');
        lista.innerHTML = "";
        facturas.forEach((f, idx) => {
            const div = document.createElement('div');
            div.className = "factura-card";
            div.innerHTML = `
                <div class="campo"><b>#${idx+1} ${f.tienda ?? "(Sin tienda)"}</b></div>
                <div class="campo"><b>Titular:</b> ${f.titular ?? "-"}</div>
                <div class="campo"><b>Documento:</b> ${f.documento ?? "-"}</div>
                <div class="campo"><b>NIT:</b> ${f.NIT ?? "-"}</div>
                <div class="campo"><b>Fecha:</b> ${f.fecha_compra ?? "-"}</div>
                <div class="campo"><b>Valor:</b> $${f.valor_total ?? "-"}</div>
                <div class="campo"><b>Contacto:</b> ${f.contacto ?? "-"}</div>
                <div class="campo"><b>Prefijo:</b> ${f.prefijo ?? "-"}</div>
                <div class="campo"><b>Cédula asociada:</b> <span style="color:#267025">${f.cedula}</span></div>
            `;
            lista.appendChild(div);
        });
    }

    // === Confirmar y finalizar ===
    document.getElementById('btnFinalizar').addEventListener('click', () => {
        document.getElementById('panel-facturas').style.display = "none";
        document.getElementById('mensaje-exito').style.display = "block";
        // Limpieza para siguiente uso
        setTimeout(() => {
            document.getElementById('mensaje-exito').style.display = "none";
            document.getElementById('form-cedula-area').style.display = "flex";
            input.value = "";
            actualizarBotones();
        }, 4500);
    });

    // Inicial
    actualizarBotones();
