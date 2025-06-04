// js/main.js

let cedulaActual = "";
let envioEnCurso = false;
let facturasActuales = [];

function teclaNum(num) {
    let input = document.getElementById('input-cedula');
    if (input.value.length < 15) {
        input.value += num;
        verificarCedula();
    }
}
function teclaBorrar() {
    let input = document.getElementById('input-cedula');
    input.value = input.value.slice(0, -1);
    verificarCedula();
}
function verificarCedula() {
    const input = document.getElementById('input-cedula');
    const valor = input.value;
    const btnConf = document.getElementById('btn-confirmar');
    const btnCanc = document.getElementById('btn-cancelar');
    btnConf.disabled = !(valor.length >= 6);
    btnCanc.disabled = !(valor.length >= 1);
}
function confirmarCedula() {
    const input = document.getElementById('input-cedula');
    const cedula = input.value;
    if (cedula.length < 6) {
        alert("Por favor ingrese una cédula válida.");
        return;
    }
    cedulaActual = cedula;
    document.getElementById('form-cedula').style.display = 'none';
    document.getElementById('asociado').innerText = `Cédula asociada: ${cedula}`;
    facturasActuales = [];
    escanear(cedula);
}
function cancelarCedula() {
    cedulaActual = "";
    document.getElementById('form-cedula').style.display = '';
    document.getElementById('input-cedula').value = "";
    document.getElementById('asociado').innerText = "";
    document.getElementById('status').innerText = "";
    document.getElementById('cards').innerHTML = "";
    document.getElementById('btn-confirmar').disabled = true;
    document.getElementById('btn-cancelar').disabled = true;
    ocultarConfirmacion();
    facturasActuales = [];
    document.getElementById('confirm-area').style.display = "none";
    document.getElementById('volver-inicio-area').style.display = "none";
}
function mostrarConfirmacion(cedula, cantidad) {
    const div = document.getElementById('mensaje-confirmacion');
    div.style.display = 'block';
    div.innerHTML = `✅ Factura${cantidad > 1 ? 's' : ''} asociada${cantidad > 1 ? 's' : ''} exitosamente a la cédula <b>${cedula}</b>.`;
    document.getElementById('volver-inicio-area').style.display = "none";
    setTimeout(() => {
        window.location.reload();
    }, 5000); // recarga la página a los 5 segundos
}

function ocultarConfirmacion() {
    const div = document.getElementById('mensaje-confirmacion');
    div.style.display = 'none';
    div.innerHTML = '';
    document.getElementById('volver-inicio-area').style.display = "none";
}
function renderFacturas() {
    const container = document.getElementById('cards');
    container.innerHTML = '';
    facturasActuales.forEach(factura => {
        container.appendChild(cardFactura(factura, cedulaActual));
    });
    document.getElementById('confirm-area').style.display = facturasActuales.length ? "flex" : "none";
}
function cardFactura(f, cedula) {
    const div = document.createElement('div');
    div.className = "card";
    div.innerHTML = `
        <div class="titulo">${f.tienda || "(Sin tienda)"}</div>
        <div class="dato"><b>Titular:</b> ${f.titular ?? "-"}</div>
        <div class="dato"><b>Documento:</b> ${f.documento ?? "-"}</div>
        <div class="dato"><b>NIT:</b> ${f.NIT ?? "-"}</div>
        <div class="dato"><b>Fecha:</b> ${f.fecha_compra ?? "-"}</div>
        <div class="dato"><b>Valor:</b> $${f.valor_total ?? "-"}</div>
        <div class="dato"><b>Contacto:</b> ${f.contacto ?? "-"}</div>
        <div class="prefijo"><b>Prefijo:</b> ${f.prefijo ?? "-"}</div>
        <div class="dato" style="margin-top:.5em;"><b>Cédula asociada:</b> <span style="color:#267025">${cedula}</span></div>
    `;
    return div;
}
function escanear(cedula) {
    if (envioEnCurso) return;
    envioEnCurso = true;
    document.getElementById('status').innerText = "Cargando datos factura...";
    ocultarConfirmacion();
    setTimeout(() => {
        const ejemplo = ejemplos[Math.floor(Math.random() * ejemplos.length)];
        const factura = {...ejemplo, cedula: cedula};
        facturasActuales.push(factura);
        renderFacturas();
        document.getElementById('status').innerText = "✅ Factura escaneada y lista para confirmar o añadir otra.";
        envioEnCurso = false;
    }, 900);
}
function agregarOtraFactura() {
    escanear(cedulaActual);
}
function confirmarEnvio() {
    mostrarConfirmacion(cedulaActual, facturasActuales.length);
    document.getElementById('confirm-area').style.display = "none";
    document.getElementById('status').innerText = "";
}
function volverInicio() {
    cancelarCedula();
}
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-confirmar').onclick = confirmarCedula;
    document.getElementById('btn-cancelar').onclick = cancelarCedula;
    document.getElementById('btn-otra').onclick = agregarOtraFactura;
    document.getElementById('btn-confirmar-envio').onclick = confirmarEnvio;
    document.getElementById('btn-volver-inicio').onclick = volverInicio;
    verificarCedula();
});
