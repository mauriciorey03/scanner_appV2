document.addEventListener("DOMContentLoaded", function () {
    const teclado = document.getElementById("teclado");
    if (teclado) {
        teclado.innerHTML = ""; // Limpiar antes de agregar

        // Fila 1: 1 2 3
        [1, 2, 3].forEach(n => {
            let div = document.createElement('div');
            div.className = 'key';
            div.textContent = n;
            div.onclick = () => teclaNum(n);
            teclado.appendChild(div);
        });
        // Fila 2: 4 5 6
        [4, 5, 6].forEach(n => {
            let div = document.createElement('div');
            div.className = 'key';
            div.textContent = n;
            div.onclick = () => teclaNum(n);
            teclado.appendChild(div);
        });
        // Fila 3: 7 8 9
        [7, 8, 9].forEach(n => {
            let div = document.createElement('div');
            div.className = 'key';
            div.textContent = n;
            div.onclick = () => teclaNum(n);
            teclado.appendChild(div);
        });
        // Fila 4: 0 | borrar
        let cero = document.createElement('div');
        cero.className = 'key key-cero';
        cero.textContent = 0;
        cero.onclick = () => teclaNum(0);
        teclado.appendChild(cero);

        let borrar = document.createElement('div');
        borrar.className = 'key key-borrar';
        borrar.innerHTML = `
            <svg width="24" height="24" fill="none" viewBox="0 0 22 22" style="vertical-align:middle;margin-right:5px;"><circle cx="11" cy="11" r="11" fill="#ffd6d6"/><path d="M7 7l8 8M15 7l-8 8" stroke="#d32626" stroke-width="2" stroke-linecap="round"/></svg>
            <span>Borrar</span>
        `;
        borrar.onclick = () => teclaBorrar();
        teclado.appendChild(borrar);

        teclado.style.display = "grid";
        teclado.style.gridTemplateColumns = "repeat(3, 70px)";
        teclado.style.gridTemplateRows = "repeat(4, 65px)";
        teclado.style.gap = "13px";
        teclado.style.justifyContent = "center";
        teclado.style.maxWidth = "300px";
        teclado.style.margin = "18px auto 0 auto";
    }
});
