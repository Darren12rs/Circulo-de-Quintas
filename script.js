document.addEventListener("DOMContentLoaded", () => {
    const ejeMayor = document.getElementById("eje-mayor");
    const ejeMenor = document.getElementById("eje-menor");
    const notasMayores = document.querySelectorAll(".nota-mayor");
    const notasMenores = document.querySelectorAll(".nota-menor");
    const botonesEmocion = document.querySelectorAll(".btn-emocion");

    // Displays informativos
    const displayMayor = document.getElementById("display-mayor");
    const displayMenor = document.getElementById("display-menor");
    const displayProgresion = document.getElementById("display-progresion");

    // Variables de estado
    let emocionActiva = null;
    let ultimoIndiceMayor = null;
    let ultimoIndiceMenor = null;

    // Ángulos de calibración iniciales
    const baseNegro = 90;
    const baseBlanco = 90;

    // Función unificada para rotar
    const rotar = (elemento, grados) => {
        if (elemento) {
            elemento.style.transform = `translate(-50%, -50%) rotate(${grados}deg)`;
        }
    };

    // =================================================================
    // ESTADO INICIAL (Abanicos ocultos con transiciones suaves)
    // =================================================================
    if (ejeMayor) {
        ejeMayor.style.opacity = "0";
        ejeMayor.style.transition += ", opacity 0.3s ease";
    }
    if (ejeMenor) {
        ejeMenor.style.opacity = "0";
        ejeMenor.style.transition += ", opacity 0.3s ease";
    }

    rotar(ejeMayor, baseNegro);
    rotar(ejeMenor, baseBlanco);

    // =================================================================
    // EVENTOS: Clic en notas mayores (Exteriores)
    // =================================================================
    notasMayores.forEach((nota) => {
        nota.addEventListener("click", () => {
            const i = parseInt(nota.style.getPropertyValue("--i"));
            ultimoIndiceMayor = i;
            ultimoIndiceMenor = null; // Apagamos la menor

            // Intercambiar visibilidad de abanicos
            rotar(ejeMayor, i * 30 + baseNegro);
            if (ejeMayor) ejeMayor.style.opacity = "1";
            if (ejeMenor) ejeMenor.style.opacity = "0";

            // Actualizar textos de estado
            if (displayMayor) displayMayor.innerText = nota.getAttribute("data-nota") || "—";
            if (displayMenor) displayMenor.innerText = "—";

            actualizarIluminacion();
        });
    });

    // =================================================================
    // EVENTOS: Clic en notas menores (Interiores)
    // =================================================================
    notasMenores.forEach((nota) => {
        nota.addEventListener("click", () => {
            const i = parseInt(nota.style.getPropertyValue("--i"));
            ultimoIndiceMenor = i;
            ultimoIndiceMayor = null; // Apagamos la mayor

            // Intercambiar visibilidad de abanicos
            rotar(ejeMenor, i * 30 + baseBlanco);
            if (ejeMenor) ejeMenor.style.opacity = "1";
            if (ejeMayor) ejeMayor.style.opacity = "0";

            // Actualizar textos de estado
            if (displayMenor) displayMenor.innerText = nota.getAttribute("data-nota") || "—";
            if (displayMayor) displayMayor.innerText = "—";

            actualizarIluminacion();
        });
    });

    // =================================================================
    // EVENTOS: Clic en botones de emociones
    // =================================================================
    botonesEmocion.forEach((btn) => {
        btn.addEventListener("click", () => {
            botonesEmocion.forEach((b) => b.classList.remove("activo"));
            btn.classList.add("activo");

            emocionActiva = btn.getAttribute("data-tipo");
            actualizarIluminacion();
        });
    });

    // =================================================================
    // SISTEMA DE ILUMINACIÓN Y ACORDES RECOMENDADOS (DINÁMICO AL CAMBIO DE NOTA)
    // =================================================================
    function actualizarIluminacion() {
        // 1. Apagar luces previas
        document.querySelectorAll(".nota-mayor, .nota-menor").forEach((n) => {
            n.classList.remove("nota-iluminada");
        });

        if (ultimoIndiceMayor === null && ultimoIndiceMenor === null) return;

        // Auxiliares para buscar y encender elementos
        const buscarNota = (lista, idx) => {
            let el = Array.from(lista).find((n) => parseInt(n.style.getPropertyValue("--i")) === idx);
            return el ? el.getAttribute("data-nota") : "";
        };

        const iluminarNota = (lista, idx) => {
            let n = Array.from(lista).find((el) => parseInt(el.style.getPropertyValue("--i")) === idx);
            if (n) n.classList.add("nota-iluminada");
        };

        // --- CASO A: LA TÓNICA SELECCIONADA ES MAYOR ---
        if (ultimoIndiceMayor !== null) {
            let idx_I = ultimoIndiceMayor;
            let idx_IV = (ultimoIndiceMayor - 1 + 12) % 12;
            let idx_V = (ultimoIndiceMayor + 1) % 12;
            let idx_vi = ultimoIndiceMayor;
            let idx_ii = (ultimoIndiceMayor - 1 + 12) % 12;
            let idx_iii = (ultimoIndiceMayor + 1) % 12;

            // Forzamos la lectura fresca del HTML según la nueva nota pulsada
            let nota_I = buscarNota(notasMayores, idx_I);
            let nota_IV = buscarNota(notasMayores, idx_IV);
            let nota_V = buscarNota(notasMayores, idx_V);
            let nota_vi = buscarNota(notasMenores, idx_vi);
            let nota_ii = buscarNota(notasMenores, idx_ii);
            let nota_iii = buscarNota(notasMenores, idx_iii);

            if (emocionActiva) {
                if (emocionActiva === "alegria") {
                    iluminarNota(notasMayores, idx_I);
                    iluminarNota(notasMayores, idx_IV);
                    iluminarNota(notasMayores, idx_V);
                    if (displayProgresion)
                        displayProgresion.innerHTML = `Vibras brillantes e intensas (I - IV - V - IV):<br><div class="prog-resaltada">${nota_I}  →  ${nota_IV}  →  ${nota_V}  →  ${nota_IV}</div>`;
                } else if (emocionActiva === "nostalgia") {
                    iluminarNota(notasMayores, idx_I);
                    iluminarNota(notasMenores, idx_vi);
                    iluminarNota(notasMayores, idx_IV);
                    iluminarNota(notasMayores, idx_V);
                    if (displayProgresion)
                        displayProgresion.innerHTML = `Sentimiento agridulce clásico (I - vi - IV - V):<br><div class="prog-resaltada">${nota_I}  →  ${nota_vi}  →  ${nota_IV}  →  ${nota_V}</div>`;
                } else if (emocionActiva === "epica") {
                    iluminarNota(notasMenores, idx_vi);
                    iluminarNota(notasMayores, idx_IV);
                    iluminarNota(notasMayores, idx_I);
                    iluminarNota(notasMayores, idx_V);
                    if (displayProgresion)
                        displayProgresion.innerHTML = `Fuerza cinematográfica en aumento (vi - IV - I - V):<br><div class="prog-resaltada">${nota_vi}  →  ${nota_IV}  →  ${nota_I}  →  ${nota_V}</div>`;
                } else if (emocionActiva === "misterio") {
                    iluminarNota(notasMenores, idx_vi);
                    iluminarNota(notasMenores, idx_ii);
                    iluminarNota(notasMenores, idx_iii);
                    if (displayProgresion)
                        displayProgresion.innerHTML = `Atmósfera oscura y suspendida (vi - ii - iii - vi):<br><div class="prog-resaltada">${nota_vi}  →  ${nota_ii}  →  ${nota_iii}  →  ${nota_vi}</div>`;
                }
            } else {
                iluminarNota(notasMayores, idx_I);
                if (displayProgresion)
                    displayProgresion.innerText =
                        "Selecciona una emoción a la izquierda para revelar la fórmula de composición.";
            }
        }

        // --- CASO B: LA TÓNICA SELECCIONADA ES MENOR ---
        else if (ultimoIndiceMenor !== null) {
            let idx_i = ultimoIndiceMenor;
            let idx_iv = (ultimoIndiceMenor - 1 + 12) % 12;
            let idx_v = (ultimoIndiceMenor + 1) % 12;
            let idx_III = ultimoIndiceMenor;
            let idx_VI = (ultimoIndiceMenor - 1 + 12) % 12;
            let idx_VII = (ultimoIndiceMenor + 1) % 12;

            let nota_i = buscarNota(notasMenores, idx_i);
            let nota_iv = buscarNota(notasMenores, idx_iv);
            let nota_v = buscarNota(notasMenores, idx_v);
            let nota_III = buscarNota(notasMayores, idx_III);
            let nota_VI = buscarNota(notasMayores, idx_VI);
            let nota_VII = buscarNota(notasMayores, idx_VII);

            if (emocionActiva) {
                if (emocionActiva === "misterio") {
                    iluminarNota(notasMenores, idx_i);
                    iluminarNota(notasMenores, idx_iv);
                    iluminarNota(notasMenores, idx_v);
                    if (displayProgresion)
                        displayProgresion.innerHTML = `Tensión y oscuridad pura menor (i - iv - v - i):<br><div class="prog-resaltada">${nota_i}  →  ${nota_iv}  →  ${nota_v}  →  ${nota_i}</div>`;
                } else if (emocionActiva === "epica") {
                    iluminarNota(notasMenores, idx_i);
                    iluminarNota(notasMayores, idx_VI);
                    iluminarNota(notasMayores, idx_VII);
                    if (displayProgresion)
                        displayProgresion.innerHTML = `Marcha heroica menor-mayor (i - VI - VII):<br><div class="prog-resaltada">${nota_i}  →  ${nota_VI}  →  ${nota_VII}</div>`;
                } else if (emocionActiva === "nostalgia") {
                    // Balada melancólica en modo menor (i - VI - III - VII) - ¡Ya no se come ninguna nota!
                    iluminarNota(notasMenores, idx_i);
                    iluminarNota(notasMayores, idx_VI);
                    iluminarNota(notasMayores, idx_III);
                    iluminarNota(notasMayores, idx_VII);
                    if (displayProgresion)
                        displayProgresion.innerHTML = `Sentimiento agridulce menor (i - VI - III - VII):<br><div class="prog-resaltada">${nota_i}  →  ${nota_VI}  →  ${nota_III}  →  ${nota_VII}</div>`;
                } else if (emocionActiva === "alegria") {
                    // Si pides alegría en menor, levanta el ánimo usando los grados mayores de la escala
                    iluminarNota(notasMayores, idx_III);
                    iluminarNota(notasMayores, idx_VI);
                    iluminarNota(notasMayores, idx_VII);
                    if (displayProgresion)
                        displayProgresion.innerHTML = `Brillo desde el relativo Mayor (III - VI - VII):<br><div class="prog-resaltada">${nota_III}  →  ${nota_VI}  →  ${nota_VII}</div>`;
                }
            } else {
                iluminarNota(notasMenores, idx_i);
                if (displayProgresion)
                    displayProgresion.innerText =
                        "Selecciona una emoción a la izquierda para revelar la fórmula de composición.";
            }
        }
    }
});
