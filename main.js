const grilla = document.querySelector(".grilla");
const contenedorGrilla = document.querySelector(".contenedor-grilla");
const puntaje = document.querySelector("#puntaje");
const reloj = document.getElementById("tiempo");
const duracionJuego = 30;
let timerInicio = 0;
const segundosSpan = reloj.querySelector("#segundos");
const puntajeFinal = document.querySelector("#puntaje-final");

const botonFacil = document.getElementById("facil");
const botonNormal = document.getElementById("normal");
const botonDificil = document.getElementById("dificil");
const reiniciarJuego = document.getElementById("reiniciar-juego");
const botonBuscarMatches = document.getElementById("buscar-matches");
const contenedorBotonFacil = document.getElementById("contenedor-boton-facil");
const contenedorBotonMedio = document.getElementById("contenedor-boton-medio");
const contenedorBotonDificil = document.getElementById(
  "contenedor-boton-dificil"
);
const nuevoJuegoPartidaTerminada = document.querySelector(
  "#nuevo-juego-partida-terminada"
);
const reiniciarPartidaTerminada = document.querySelector(
  "#reiniciar-juego-partida-terminada"
);
const cerrarJuegoTerminado = document.querySelector("#cerrar-juego-terminado");
const informacion = document.querySelector("#informacion");
const modalJuegoTerminado = document.querySelector(".modal-juegoTerminado");
const modalDificultad = document.querySelector("#modal-dificultades");
const modalBienvenida = document.querySelector("#contenedor-modal-bienvenida");
const AJugar = document.getElementById("boton-jugar");
const botonCerrarDificultad = document.querySelector("#cerrar-dificultad");
const cantidadDeImagenesDiferentes = 6;
const gatitosSeleccionados = document.querySelectorAll(".seleccionado");
const cantidaDeFilasFacil = 9;
const cantidadDeFilasNormal = 8;
const cantidadDeFilasDificil = 7;
let matchesHorizontales = [];
let matchesVerticales = [];
let listaDeGatitos = [];
let anchoGrilla = "";
let tamanioImg = "";
let anchoContenedorGrilla = "";
let gatitoGuardadoEnClickAnterior = "";
let sumandoPuntaje = "";
//----------------------------------------🔸INICIA DETECTOR DE DISPOSITIVO🔸
const tamanioGrillaResponsive = () => {
  const ventanaTamanioMobile = window.matchMedia("(max-width: 500px)");
  const ventanaTamanioMobileSmall = window.matchMedia("(max-width: 350px)");
  if (ventanaTamanioMobileSmall.matches) {
    tamanioGrilla = 290;
  } else if (ventanaTamanioMobile.matches) {
    tamanioGrilla = 310;
  } else {
    tamanioGrilla = 470;
  }
  return tamanioGrilla;
};
anchoGrilla = tamanioGrillaResponsive();
anchoContenedorGrilla = tamanioGrillaResponsive();
//----------------------------------------🔸FIN DETECTOR DE DISPOSITIVO🔸
//----------------------------------------🔸TIMER EN MARCHA🔸

const mostrarJuegoTerminado = () => {
  modalJuegoTerminado.classList.toggle("is-active");
};

const iniciarCuentaRegresiva = () => {
  return new Date(Date.parse(new Date()) + duracionJuego * 1000);
};

const calcularTiempoRestante = (deadline) => {
  let total = Date.parse(deadline) - Date.parse(new Date());
  let segundos = Math.floor((total / 1000) % 60);

  return segundos;
};

let tiempoTotal = "";

const actualizarReloj = (deadline) => {
  let tiempoRestante = calcularTiempoRestante(deadline);

  segundosSpan.innerHTML = ("0" + tiempoRestante).slice(-2);
  if (tiempoRestante <= 0) {
    clearInterval(timerInicio);
    mostrarJuegoTerminado();
  }
};

const iniciarReloj = (deadline) => {
  if (timerInicio != 0) {
    clearInterval(timerInicio);
  }

  calcularTiempoRestante(deadline);

  actualizarReloj(deadline);

  timerInicio = setInterval(actualizarReloj, 1000, deadline);
};

//----------------------------------------🔸FIN DE TIMER🔸
const removerImagenDelDiv = (divGatito) => {
  if (divGatito.firstElementChild) {
    let imagen = divGatito.firstElementChild;
    divGatito.removeChild(imagen);
  }
};

const llenarVacio = () => {
  agregarNuevaImagen();
};
/**
 * Recorro la grilla en busca de Matches Horizontales y los guardo
 * en un array para hacer la comparacion final
 * @param {*src de la img} celdaActual
 * @param {*number x de la img} i
 * @param {*number y de la img} j
 * @param {*number tope del ancho y alto de la grilla} maximoIndice
 */
const compararHorizontal = (celdaActual, i, j, maximoIndice) => {
  if (j + 1 <= maximoIndice && j + 2 <= maximoIndice) {
    let celdaHorizontalMasUno = listaDeGatitos[i][j + 1].src;
    let celdaHorizontalMasDos = listaDeGatitos[i][j + 2].src;
    if (
      celdaActual === celdaHorizontalMasUno && // busco tres iguales consecutivos
      celdaActual === celdaHorizontalMasDos
    ) {
      matchesHorizontales.push([i, j]);
      matchesHorizontales.push([i, j + 1]);
      matchesHorizontales.push([i, j + 2]);
      return true;
    } else {
      return false;
    }
  }
  return false; // si me excedí en los límites, no hubo match tampoco
};
/**
 * Recorro la grilla en busca de Matches Verticales y los guardo
 * en un array para hacer la comparacion final
 * @param {*src de la img} celdaActual
 * @param {*number x de la img} i
 * @param {*number y de la img} j
 * @param {*number tope del ancho y alto de la grilla} maximoIndice
 */
const compararVertical = (celdaActual, i, j, maximoIndice) => {
  if (i + 1 <= maximoIndice && i + 2 <= maximoIndice) {
    let celdaVerticalMasUno = listaDeGatitos[i + 1][j].src;
    let celdaVerticalMasDos = listaDeGatitos[i + 2][j].src;
    if (
      celdaActual === celdaVerticalMasUno &&
      celdaActual === celdaVerticalMasDos
    ) {
      matchesVerticales.push([i, j]);
      matchesVerticales.push([i + 1, j]);
      matchesVerticales.push([i + 2, j]);

      return true;
    } else {
      return false;
    }
  }
  return false;
};

//----------------------------------------🔸INICIO BUSCAR BLOQUE INICIAL🔸
/**
 * Devuelve boolean, true cuando hay matches sino false.
 *
 */
const buscarBloqueInicial = (dimension) => {
  let maximoIndice = dimension - 1;
  let comparacionesHorizontales = [];
  let comparacionesVerticales = [];

  for (let i = 0; i < listaDeGatitos.length; i++) {
    for (let j = 0; j < listaDeGatitos[i].length; j++) {
      let celdaActual = listaDeGatitos[i][j].src;
      comparacionesHorizontales.push(
        compararHorizontal(celdaActual, i, j, maximoIndice)
      );
      comparacionesVerticales.push(
        compararVertical(celdaActual, i, j, maximoIndice)
      );
    }
  }

  //recorre cada item del array "sumatoria de horizontales" para chequear sin al menos uno es true  True
  let matchesHorizontales = comparacionesHorizontales.some((horizontal) => {
    return horizontal === true;
  });
  // el parametro es cada item del array, si alguno da true, todo da true
  let matchesVerticales = comparacionesVerticales.some((vertical) => {
    return vertical === true;
  });

  return matchesHorizontales || matchesVerticales;
};
//----------------------------------------🔸FIN BUSCAR BLOQUE INICIAL🔸

//----------------------------------------🔸
let conteoHorizontal = 0;
let conteoVertical = 0;
let puntos = 100;
const chequearComboHorizontal = () => {
  conteoHorizontal = matchesHorizontales.length;
  conteoHorizontal = conteoHorizontal * puntos;

  return conteoHorizontal;
};

const chequearComboVertical = () => {
  conteoVertical = matchesVerticales.length;
  conteoVertical = conteoVertical * puntos;

  return conteoVertical;
};

const sumarPuntaje = () => {
  let previoPuntaje = Number(puntaje.innerHTML);
  let sumaPuntaje = previoPuntaje + conteoVertical + conteoHorizontal;
  puntaje.innerHTML = `${sumaPuntaje}`;
  puntajeFinal.innerHTML = `${sumaPuntaje}`;
};
const totalizarPuntaje = () => {
  chequearComboHorizontal();
  chequearComboVertical();
  sumarPuntaje();
};
//----------------------------------------🔸INICIA CREAR IMG GATITO🔸
/**
 * Devuelve un numero entero al azar entre 0 y la cantidad de modelos de imagenes
 */
const obtenerNumeroAlAzar = () => {
  return Math.floor(Math.random() * cantidadDeImagenesDiferentes);
};
/**
 * Devuelve un string random que se va a usar como src en los img.
 */
const obtenerSrcGatito = () => {
  return `img/Gatito-${obtenerNumeroAlAzar()}.png`;
};

const obtenerImgGatito = () => {
  let img = document.createElement("img");
  img.src = obtenerSrcGatito();
  img.draggable = false;
  img.classList.add("imagen-gatito");

  return img;
};

//----------------------------------------🔸INICIO CREACION DE GRILLA🔸

const tamanioContenedor = (cantidadDeFilas) => {
  tamanioImg = anchoGrilla / cantidadDeFilas;
};

const crearDivGatito = (x, y) => {
  const divGatito = document.createElement("div");
  divGatito.addEventListener("click", escucharClicks);
  divGatito.dataset.x = x;
  divGatito.dataset.y = y;
  divGatito.dataset.id = `${x}${y}`;
  divGatito.style.height = `${tamanioImg}px`;
  divGatito.style.width = `${tamanioImg}px`;
  divGatito.appendChild(listaDeGatitos[x][y]);
  divGatito.style.top = `${x * tamanioImg}px`;
  divGatito.style.left = `${y * tamanioImg}px`;
  divGatito.className = "contenedor-gatito";

  return divGatito;
};

const crearArrayGatitos = (ancho, alto) => {
  for (let i = 0; i < ancho; i++) {
    listaDeGatitos[i] = [];
    for (let j = 0; j < alto; j++) {
      listaDeGatitos[i][j] = obtenerImgGatito();
    }
  }
  return listaDeGatitos;
};

const crearGrillaHtml = () => {
  grilla.style.width = `${anchoGrilla}px`;
  grilla.style.height = `${anchoGrilla}px`;
  contenedorGrilla.style.width = `${anchoContenedorGrilla + 20}px`;
  contenedorGrilla.style.height = `${anchoContenedorGrilla + 20}px`;

  for (let i = 0; i < listaDeGatitos.length; i++) {
    for (let j = 0; j < listaDeGatitos[i].length; j++) {
      grilla.appendChild(crearDivGatito(i, j));
    }
  }

  return grilla;
};
//----------------------------------------🔸INICIO EFECTO CLICKEABLE🔸

const clickeable = () => {
  const imgsGatitoHtml = document.querySelectorAll(".imagen-gatito");

  for (let gatito of imgsGatitoHtml) {
    gatito.onclick = () => {
      gatito.classList.toggle("clickeable");
    };
  }
};
//----------------------------------------🔸FIN EFECTO CLICKEABLE🔸

//----------------------------------------🔸INICIO INTERCAMBIAR CUADRADOS

const intercambiarCuadrados = (cuadrado1, cuadrado2) => {
  const datax1 = Number(cuadrado1.dataset.x);
  const datax2 = Number(cuadrado2.dataset.x);
  const datay1 = Number(cuadrado1.dataset.y);
  const datay2 = Number(cuadrado2.dataset.y);
  const dataid1 = Number(cuadrado1.dataset.id);
  const dataid2 = Number(cuadrado2.dataset.id);

  let variableTemporal = listaDeGatitos[datax1][datay1];
  listaDeGatitos[datax1][datay1] = listaDeGatitos[datax2][datay2];
  listaDeGatitos[datax2][datay2] = variableTemporal;

  cuadrado1.style.top = `${datax2 * tamanioImg}px`;
  cuadrado2.style.top = `${datax1 * tamanioImg}px`;
  cuadrado1.style.left = `${datay2 * tamanioImg}px`;
  cuadrado2.style.left = `${datay1 * tamanioImg}px`;

  cuadrado1.dataset.x = datax2;
  cuadrado2.dataset.x = datax1;
  cuadrado1.dataset.y = datay2;
  cuadrado2.dataset.y = datay1;
  cuadrado1.dataset.id = dataid2;
  cuadrado2.dataset.id = dataid1;
};
//----------------------------------------🔸FIN INTERCAMBIAR CUADRADOS
/**
 * Recibe dos divs clickeados y les remueve el estilo de seleccionados
 * @param {*div} primerGato
 * @param {*div} segundoGato
 */
const borrarSeleccion = (primerGato, segundoGato) => {
  primerGato.classList.remove("seleccionado");
  segundoGato.classList.remove("seleccionado");
};

const escucharClicks = (e) => {
  let gatitoClickeado = e.target; // CLICK

  if (gatitoClickeado.nodeName === "IMG") {
    gatitoClickeado = gatitoClickeado.parentElement;
  }

  if (!gatitoClickeado.className.includes("seleccionado")) {
    gatitoClickeado.classList.add("seleccionado");

    if (
      gatitoGuardadoEnClickAnterior &&
      !esIgualAlPrimerGato(gatitoClickeado)
    ) {
      borrarSeleccion(gatitoGuardadoEnClickAnterior, gatitoClickeado);

      if (sonAdyacentes(gatitoGuardadoEnClickAnterior, gatitoClickeado)) {
        intercambiarCuadrados(gatitoGuardadoEnClickAnterior, gatitoClickeado);
        let gatitoParaDevolver = gatitoGuardadoEnClickAnterior;
        gatitoGuardadoEnClickAnterior = "";

        if (buscarBloqueInicial(verificarDificultad()) == false) {
          let devolverGatito = () => {
            setTimeout(
              () => intercambiarCuadrados(gatitoClickeado, gatitoParaDevolver),
              200
            );
          };
          devolverGatito();
          clearInterval(devolverGatito);
        }
      } else {
        gatitoGuardadoEnClickAnterior = gatitoClickeado;
        gatitoClickeado.classList.add("seleccionado");
      }
    } else {
      gatitoGuardadoEnClickAnterior = gatitoClickeado;
    }
  }
};
const esIgualAlPrimerGato = (gato) => {
  if (gatitoGuardadoEnClickAnterior) {
    return gatitoGuardadoEnClickAnterior.dataset.id === gato.dataset.id;
  }
  return false;
};

//----------------------------------------🔸INICIO SON ADYACENTES
const sonAdyacentes = (cuadradoUno, cuadradoDos) => {
  if (cuadradoUno) {
    let xCuadradoUno = cuadradoUno.dataset.x;
    let xCuadradoDos = cuadradoDos.dataset.x;
    xCuadradoUno = Number(xCuadradoUno);
    xCuadradoDos = Number(xCuadradoDos);

    let yCuadradoUno = cuadradoUno.dataset.y;
    let yCuadradoDos = cuadradoDos.dataset.y;
    yCuadradoUno = Number(yCuadradoUno);
    yCuadradoDos = Number(yCuadradoDos);

    if (xCuadradoUno == xCuadradoDos) {
      if (
        yCuadradoUno == yCuadradoDos + 1 ||
        yCuadradoUno == yCuadradoDos - 1
      ) {
        return true;
      }
    }
    if (yCuadradoUno == yCuadradoDos) {
      if (
        xCuadradoUno == xCuadradoDos + 1 ||
        xCuadradoUno == xCuadradoDos - 1
      ) {
        return true;
      }
    }
  }

  return false;
};
//----------------------------------------🔸FIN SON ADYACENTES
const vaciarGrilla = () => {
  grilla.innerHTML = "";
  puntaje.innerHTML = "0";
  matchesHorizontales = [];
  matchesVerticales = [];
};

const compararHorizontalEnBoton = (celdaActual, i, j, maximoIndice) => {
  if (j + 1 <= maximoIndice && j + 2 <= maximoIndice) {
    // valido límites
    let celdaHorizontalMasUno = listaDeGatitos[i][j + 1].src;
    let celdaHorizontalMasDos = listaDeGatitos[i][j + 2].src;
    if (
      celdaActual === celdaHorizontalMasUno && // busco tres iguales consecutivos
      celdaActual === celdaHorizontalMasDos
    ) {
      matchesHorizontales.push([i, j]);
      matchesHorizontales.push([i, j + 1]);
      matchesHorizontales.push([i, j + 2]);
    }
  }
};

const compararVerticalEnBoton = (celdaActual, i, j, maximoIndice) => {
  if (i + 1 <= maximoIndice && i + 2 <= maximoIndice) {
    // valido límites

    let celdaVerticalMasUno = listaDeGatitos[i + 1][j].src;
    let celdaVerticalMasDos = listaDeGatitos[i + 2][j].src;
    if (
      celdaActual === celdaVerticalMasUno && // busco tres iguales consecutivos
      celdaActual === celdaVerticalMasDos
    ) {
      matchesVerticales.push([i, j]);
      matchesVerticales.push([i + 1, j]);
      matchesVerticales.push([i + 2, j]);
    }
  }
};

/**
 * Busca matches en todo la grilla y devuelve arrays matches verticales y
 * horizontales.
 */
const buscarMatches = (dimension) => {
  let maximoIndice = dimension - 1;

  for (let i = 0; i < listaDeGatitos.length; i++) {
    for (let j = 0; j < listaDeGatitos[i].length; j++) {
      let celdaActual = listaDeGatitos[i][j].src;

      //me guardo el resultado de la comparación de la fila
      compararHorizontalEnBoton(celdaActual, i, j, maximoIndice);
      compararVerticalEnBoton(celdaActual, i, j, maximoIndice);
    }
  }
};

const manejarIntersecciones = () => {
  let total = matchesVerticales.concat(matchesHorizontales);

  let repetidos = [];

  // recorre cada item del array y aplica la funcion que pasamos en filter
  // arrayCoordenada es por ejemplo: [2,4]
  // devuelve un nuevo array en los casos que dio true la comparación

  let unicos = total.filter((arrayCoordenada) => {
    // concateno x e y para tener un valor para comparar.
    let valorUnico = `${arrayCoordenada[0]}${arrayCoordenada[1]}`;

    if (!repetidos.includes(valorUnico)) {
      repetidos.push(valorUnico);

      return true;
    } else {
      return false;
    }
  });
  return unicos;
};

const removerImagenCelda = (listaCoordenaMatches) => {
  // en cada posición del array tengo las coordenas del div
  for (let i = 0; i < listaCoordenaMatches.length; i++) {
    let posicionDivMatcheado = listaCoordenaMatches[i];
    let divMatcheado = obtenerDivMatcheado(
      posicionDivMatcheado[0],
      posicionDivMatcheado[1]
    );

    removerImagenDelDiv(divMatcheado);

    let xDivDeArriba = posicionDivMatcheado[0] - 1;

    while (xDivDeArriba >= 0) {
      let divDeArriba = obtenerDivMatcheado(
        xDivDeArriba,
        posicionDivMatcheado[1]
      );

      intercambiarCuadrados(divMatcheado, divDeArriba);
      xDivDeArriba -= 1;
    }
  }
};
const agregarNuevaImagen = () => {
  const todosLosDivs = document.querySelectorAll(".contenedor-gatito");

  for (let div of todosLosDivs) {
    if (div.firstChild === null) {
      const gatito = obtenerImgGatito();
      div.appendChild(gatito);
      listaDeGatitos[div.dataset.x][div.dataset.y] = gatito;
    }
  }
};

/**
 * Después de encontrar los bloques, sacoa la img de los divs matcheados. REVISAR
 *
 */
const borrarMatches = () => {
  let listaMatchesUnicos = manejarIntersecciones();
  removerImagenCelda(listaMatchesUnicos);
  borrarImgDeListaDeGatitos(listaMatchesUnicos);
  matchesHorizontales = [];
  matchesVerticales = [];
};

const borrarImgDeListaDeGatitos = (listaMatchesUnicos) => {
  for (let i = 0; i < listaMatchesUnicos.length; i++) {
    listaDeGatitos[listaMatchesUnicos[i][0][listaMatchesUnicos[i][1]]] = null;
  }
};

/**
 * Devuelve un div en la coordenadas dadas.
 * @param {array} indices - Posición x y de la celda
 */
const obtenerDivMatcheado = (x, y) => {
  return document.querySelector(`div[data-x='${x}'][data-y='${y}']`);
};

//----------------------------------------🔸INICIO CARGA DE INICIALIZACION DE PARTIDA
/**
 * Funcion que inicializa el juego
 * @param {*number} cantidadDeFilas
 */
const jugar = (cantidadDeFilas) => {
  iniciarReloj(iniciarCuentaRegresiva());
  do {
    ocultarDificultades();
    vaciarGrilla();
    tamanioContenedor(cantidadDeFilas);
    crearArrayGatitos(cantidadDeFilas, cantidadDeFilas);
    crearGrillaHtml(cantidadDeFilas);
    clickeable();
  } while (buscarBloqueInicial(cantidadDeFilas));
};

const reiniciandoJuego = () => {
  reloj.classList.toggle("reiniciado");
  // iniciarReloj(iniciarCuentaRegresiva());
  clickeable();
  vaciarGrilla();
  jugar(verificarDificultad());
};
//----------------------------------------🔸Inicio botones Dificultad on Click-------------
botonFacil.onclick = () => {
  reiniciarJuego.classList.add("facil");
  jugar(cantidaDeFilasFacil);
  actualizarGrilla(cantidaDeFilasFacil);
};

botonNormal.onclick = () => {
  reiniciarJuego.classList.add("normal");
  jugar(cantidadDeFilasNormal);
  actualizarGrilla(cantidadDeFilasNormal);
};

botonDificil.onclick = () => {
  reiniciarJuego.classList.add("dificil");
  jugar(cantidadDeFilasDificil);
  actualizarGrilla(cantidadDeFilasDificil);
};

reiniciarJuego.onclick = () => {
  reiniciandoJuego();
};
informacion.onclick = () => {
  modalBienvenida.classList.remove("ocultar");
};

AJugar.onclick = () => {
  ocultarBienvenida();
  mostrarDificultades();
};

cerrarJuegoTerminado.onclick = () => {
  modalJuegoTerminado.classList.remove("is-active");
};

nuevoJuegoPartidaTerminada.onclick = () => {
  modalJuegoTerminado.classList.remove("is-active");
  ocultarBienvenida();
  mostrarDificultades();
};

reiniciarPartidaTerminada.onclick = () => {
  modalJuegoTerminado.classList.remove("is-active");
  reiniciandoJuego();
};

//----------------------------------------🔸INICIO MODALES

const ocultarBienvenida = () => {
  modalBienvenida.classList.add("ocultar");
};

const mostrarDificultades = () => {
  modalDificultad.classList.remove("is-hidden");
  modalDificultad.classList.add("is-active");
};
const ocultarDificultades = () => {
  modalDificultad.classList.add("is-hidden");
  modalDificultad.classList.remove("is-active");
};

const actualizarGrilla = (cantidadDeFilas) => {
  setInterval(buscarBloqueInicial, 500, cantidadDeFilas);
  setInterval(totalizarPuntaje, 500);
  setInterval(borrarMatches, 500);
  setInterval(llenarVacio, 500);
};

const verificarDificultad = () => {
  if (reiniciarJuego.classList.contains("facil")) {
    return (cantidadDeFilas = cantidaDeFilasFacil);
  }
  if (reiniciarJuego.classList.contains("normal")) {
    return (cantidadDeFilas = cantidadDeFilasNormal);
  }
  if (reiniciarJuego.classList.contains("dificil")) {
    return (cantidadDeFilas = cantidadDeFilasDificil);
  }
};
