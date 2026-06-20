document.addEventListener("DOMContentLoaded", () => {
    const ejeMayor = document.getElementById("eje-mayor");
    const ejeMenor = document.getElementById("eje-menor");
    const notasMayores = document.querySelectorAll(".nota-mayor");
    const notasMenores = document.querySelectorAll(".nota-menor");

    const baseNegro = 90;
    const baseBlanco = 90;

    // Función unificada para rotar
    const rotar = (elemento, grados) => {
        // Al añadir translate, mantenemos el centro exacto que definiste en CSS
        elemento.style.transform = `translate(-50%, -50%) rotate(${grados}deg)`;
    };

    // Estado inicial
    rotar(ejeMayor, baseNegro);
    rotar(ejeMenor, baseBlanco);

    // Eventos
    notasMayores.forEach((nota) => {
        nota.addEventListener("click", () => {
            const i = parseInt(nota.style.getPropertyValue("--i"));
            rotar(ejeMayor, i * 30 + baseNegro);
        });
    });

    notasMenores.forEach((nota) => {
        nota.addEventListener("click", () => {
            const i = parseInt(nota.style.getPropertyValue("--i"));
            rotar(ejeMenor, i * 30 + baseBlanco);
        });
    });
});
