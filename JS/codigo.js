const TARIFA_BASE = 45000;

const login = document.getElementById("login");
const panel = document.getElementById("panel");
const mensaje = document.getElementById("mensaje");
const botonIngresar = document.getElementById("botonIngresar");

const formularioVenta = document.getElementById("formularioVenta");
const campoPelicula = document.getElementById("pelicula");
const campoSala = document.getElementById("sala");
const campoBoletos = document.getElementById("boletos");
const campoPrecio = document.getElementById("precio");
const botonCalcular = document.getElementById("botonCalcular");
const cargando = document.getElementById("cargando");
const resultado = document.getElementById("resultado");
const totalGeneral = document.getElementById("totalGeneral");

const bandeja = document.getElementById("bandeja");
const campoClave = document.getElementById("campoClave");
const botonSi = document.getElementById("botonSi");
const botonNo = document.getElementById("botonNo");

const formularioAsiento = document.getElementById("formularioAsiento");
const botonAsiento = document.getElementById("botonAsiento");
const resultadoAsiento = document.getElementById("resultadoAsiento");
const selectMinutos = document.getElementById("minSel");

const camara = document.getElementById("camara");
const video = document.getElementById("video");
const foto = document.getElementById("foto");
const botonFoto = document.getElementById("botonFoto");
const mensajeCamara = document.getElementById("mensajeCamara");

let recaudaciones = [];
let grafica = null;
let flujoCamara = null;
let hayFoto = false;


for (let m = 0; m < 60; m++) {
    let texto = String(m);
    if (m < 10) {
        texto = "0" + m;
    }
    selectMinutos.innerHTML += '<option value="' + m + '">' + texto + "</option>";
}


function mostrarReloj() {
    const ahora = new Date();
    document.getElementById("reloj").textContent = ahora.toLocaleString("es-CO");
}

mostrarReloj();
setInterval(mostrarReloj, 1000);


function ponerPuntos(numero) {
    const texto = String(Math.round(numero));
    let resultadoTexto = "";
    let contador = 0;

    for (let i = texto.length - 1; i >= 0; i--) {
        resultadoTexto = texto.charAt(i) + resultadoTexto;
        contador++;
        if (contador == 3 && i != 0) {
            resultadoTexto = "." + resultadoTexto;
            contador = 0;
        }
    }

    return resultadoTexto;
}

function formatoCOP(valor) {
    return "$" + ponerPuntos(valor) + " COP";
}


botonIngresar.addEventListener("click", function () {
    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;

    if (usuario == "Cinecali" && contrasena == "Estrenos") {
        login.classList.add("oculto");
        panel.classList.remove("oculto");
        mensaje.textContent = "";
        document.getElementById("usuario").value = "";
        document.getElementById("contrasena").value = "";
        encenderCamara();
        if (grafica == null) {
            crearGrafica();
        }
    } else {
        mensaje.textContent = "Datos incorrectos. Verifica usuario y contraseña.";
    }
});

document.getElementById("contrasena").addEventListener("keydown", function (evento) {
    if (evento.key == "Enter") {
        botonIngresar.click();
    }
});


function volverAlLogin() {
    apagarCamara();
    panel.classList.add("oculto");
    login.classList.remove("oculto");
    limpiarCampos();
    mensaje.textContent = "";
}

function limpiarCampos() {
    formularioVenta.reset();
    formularioAsiento.reset();
    campoPrecio.value = TARIFA_BASE;
    resultado.textContent = "";
    resultadoAsiento.textContent = "";
}


function crearGrafica() {
    if (typeof Chart == "undefined") {
        return;
    }

    grafica = new Chart(document.getElementById("graficaVentas"), {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: "Recaudación por función (COP)",
                data: [],
                borderColor: "#d4af37",
                backgroundColor: "#d4af3733",
                fill: true
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: 250000,
                    ticks: {
                        color: "#f5f5f5",
                        stepSize: 50000,
                        callback: function (valor) {
                            if (valor == 0) {
                                return "";
                            }
                            return "$" + ponerPuntos(valor);
                        }
                    }
                },
                x: {
                    ticks: { color: "#f5f5f5" }
                }
            },
            plugins: {
                legend: { labels: { color: "#f5f5f5" } }
            }
        }
    });
}


function revisarDatos(pelicula, sala, boletos, precio) {
    if (pelicula == "") {
        return "Escribe el nombre de la película.";
    }

    if (isNaN(pelicula) == false) {
        return "El nombre de la película no puede ser solo un número.";
    }

    if (pelicula.length < 2) {
        return "El nombre de la película es muy corto.";
    }

    if (pelicula.includes("<") || pelicula.includes(">")) {
        return "El nombre de la película no puede tener los signos < o >.";
    }

    const salasValidas = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10"];
    const salasConCero = ["S01", "S02", "S03", "S04", "S05", "S06", "S07", "S08", "S09"];
    if (salasValidas.includes(sala) == false && salasConCero.includes(sala) == false) {
        return "La sala no es válida. Use una sala de S1 a S10 (ejemplo: S4).";
    }

    if (boletos == "" || isNaN(boletos) || boletos.includes(".")) {
        return "Las boletas deben ser un número entero, sin decimales.";
    }

    if (boletos < 1 || boletos > 200) {
        return "Las boletas deben estar entre 1 y 200.";
    }

    if (precio == "" || isNaN(precio) || precio.includes(".")) {
        return "El precio no es válido. Solo se reciben pesos colombianos enteros, sin decimales.";
    }

    if (precio < 50) {
        return "El precio no es válido. La moneda colombiana empieza desde $50.";
    }

    if (precio > 100000) {
        return "El precio máximo por boleta es $100.000.";
    }

    return "";
}


botonCalcular.addEventListener("click", function () {
    const pelicula = campoPelicula.value.trim();
    const sala = campoSala.value.trim().toUpperCase();
    const boletos = campoBoletos.value.trim();
    const precio = campoPrecio.value.trim();

    const error = revisarDatos(pelicula, sala, boletos, precio);

    if (error != "") {
        resultado.innerHTML = '<span class="error">' + error + "</span>";
        alert(error);
        return;
    }

    const total = Number(boletos) * Number(precio);

    botonCalcular.disabled = true;
    resultado.textContent = "";
    cargando.classList.remove("oculto");

    setTimeout(function () {
        cargando.classList.add("oculto");

        resultado.innerHTML =
            '<span class="exito">Recaudación calculada.</span><br>' +
            "Película: " + pelicula + "<br>" +
            "Sala: " + sala + "<br>" +
            "Boletas vendidas: " + boletos + "<br>" +
            "Precio por boleta: " + formatoCOP(Number(precio)) + "<br>" +
            "Recaudación total: " + formatoCOP(total);

        recaudaciones.push(total);
        actualizarGrafica();

        setTimeout(pedirClave, 200);
    }, 2000);
});


function actualizarGrafica() {
    let suma = 0;
    for (let i = 0; i < recaudaciones.length; i++) {
        suma = suma + recaudaciones[i];
    }
    totalGeneral.textContent = "Recaudación acumulada: " + formatoCOP(suma);

    if (grafica == null) {
        return;
    }

    grafica.data.labels.push("Función " + recaudaciones.length);
    grafica.data.datasets[0].data.push(recaudaciones[recaudaciones.length - 1]);
    grafica.update();
}


function pedirClave() {
    campoClave.value = "";
    bandeja.classList.remove("oculto");
    campoClave.focus();
}

botonSi.addEventListener("click", function () {
    const clave = campoClave.value;
    bandeja.classList.add("oculto");
    botonCalcular.disabled = false;

    if (clave == "CINE") {
        limpiarCampos();
        campoPelicula.focus();
    } else {
        volverAlLogin();
        mensaje.textContent = "Clave incorrecta. Volviste al inicio de sesión.";
        alert("Clave incorrecta. Volverás al inicio de sesión.");
    }
});

botonNo.addEventListener("click", function () {
    bandeja.classList.add("oculto");
    botonCalcular.disabled = false;
    resultado.innerHTML += '<br><span class="exito">Puedes seguir en el panel.</span>';
});

campoClave.addEventListener("keydown", function (evento) {
    if (evento.key == "Enter") {
        botonSi.click();
    }
});


function asientoValido(asiento) {
    const filas = "ABCDEFGHIJ";
    const fila = asiento.charAt(0);
    const numero = Number(asiento.substring(1));

    if (!filas.includes(fila)) {
        return false;
    }
    if (!Number.isInteger(numero) || numero < 1 || numero > 15) {
        return false;
    }
    return true;
}

botonAsiento.addEventListener("click", function () {
    const anterior = document.getElementById("asientoAnterior").value.trim().toUpperCase();
    const nuevo = document.getElementById("asientoNuevo").value.trim().toUpperCase();

    if (!asientoValido(anterior) || !asientoValido(nuevo)) {
        const texto = "Asiento no válido. Use una fila de A a J y un número de 1 a 15 (ejemplo: A5).";
        resultadoAsiento.innerHTML = '<span class="error">' + texto + "</span>";
        alert(texto);
        return;
    }

    if (anterior == nuevo) {
        const texto = "El asiento nuevo debe ser diferente al actual.";
        resultadoAsiento.innerHTML = '<span class="error">' + texto + "</span>";
        alert(texto);
        return;
    }

    let hora;
    let minutos;
    const horaElegida = document.getElementById("horaSel").value;

    if (horaElegida != "") {
        hora = Number(horaElegida);
        minutos = Number(document.getElementById("minSel").value);
        const ampm = document.getElementById("ampmSel").value;

        if (ampm == "PM" && hora < 12) {
            hora = hora + 12;
        }
        if (ampm == "AM" && hora == 12) {
            hora = 0;
        }
    } else {
        const ahora = new Date();
        hora = ahora.getHours();
        minutos = ahora.getMinutes();
    }

    let precioBase = Number(campoPrecio.value);
    if (campoPrecio.value == "" || !Number.isInteger(precioBase) || precioBase < 50) {
        precioBase = TARIFA_BASE;
    }

    let recargo = 0;
    let hayRecargo = false;
    if (hora >= 15 && hora < 18) {
        hayRecargo = true;
        recargo = precioBase * 0.05;
    }

    let hora12 = hora;
    if (hora > 12) {
        hora12 = hora - 12;
    }
    if (hora == 0) {
        hora12 = 12;
    }

    let textoMinutos = String(minutos);
    if (minutos < 10) {
        textoMinutos = "0" + minutos;
    }

    let jornada = "a. m.";
    if (hora >= 12) {
        jornada = "p. m.";
    }

    let aviso = "No hay recargo en este horario.";
    if (hayRecargo) {
        aviso = "Se aplicó el recargo del 5 %.";
    }

    resultadoAsiento.innerHTML =
        '<span class="exito">Cambio de asiento registrado.</span><br>' +
        "De " + anterior + " a " + nuevo + " (hora " + hora12 + ":" + textoMinutos + " " + jornada + ")<br>" +
        "Valor base: " + formatoCOP(precioBase) + "<br>" +
        "Recargo: " + formatoCOP(recargo) + "<br>" +
        "Total de la boleta: " + formatoCOP(precioBase + recargo) + "<br>" +
        aviso;
});


function encenderCamara() {
    camara.classList.remove("oculto");
    mensajeCamara.textContent = "";
    foto.classList.add("oculto");
    video.classList.remove("oculto");
    botonFoto.textContent = "Tomar foto";
    botonFoto.disabled = false;
    hayFoto = false;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        mensajeCamara.textContent = "La cámara no está disponible. Abre la página con Live Server.";
        botonFoto.disabled = true;
        return;
    }

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (flujo) {
            flujoCamara = flujo;
            video.srcObject = flujo;
        })
        .catch(function () {
            mensajeCamara.textContent = "No se pudo activar la cámara. Revisa los permisos.";
            botonFoto.disabled = true;
        });
}

function apagarCamara() {
    if (flujoCamara != null) {
        const pistas = flujoCamara.getTracks();
        for (let i = 0; i < pistas.length; i++) {
            pistas[i].stop();
        }
    }
    flujoCamara = null;
    video.srcObject = null;
    camara.classList.add("oculto");
}

botonFoto.addEventListener("click", function () {
    if (hayFoto) {
        foto.classList.add("oculto");
        video.classList.remove("oculto");
        botonFoto.textContent = "Tomar foto";
        hayFoto = false;
        return;
    }

    if (video.videoWidth == 0) {
        mensajeCamara.textContent = "Espera a que la cámara esté lista.";
        return;
    }

    const lienzo = document.createElement("canvas");
    lienzo.width = video.videoWidth;
    lienzo.height = video.videoHeight;
    lienzo.getContext("2d").drawImage(video, 0, 0);

    foto.src = lienzo.toDataURL("image/png");
    foto.classList.remove("oculto");
    video.classList.add("oculto");
    botonFoto.textContent = "Tomar otra foto";
    mensajeCamara.textContent = "";
    hayFoto = true;
});