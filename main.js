const grilla = document.querySelector(".grilla");
const contenedorGrilla = document.querySelector(".contenedor-grilla");
const reloj = document.getElementById("tiempo");
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
//----------------------------------------🔸INICIA DETECTOR DE DISPOSITIVO🔸
const tamanioGrillaResponsive = () => {
  const ventanaTamanioMobile = window.matchMedia("(max-width: 500px)");
  if (ventanaTamanioMobile.matches) {
    tamanioGrilla = 380;
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
  const deadline = new Date(Date.parse(new Date()) + 30 * 1000);
  return deadline;
};
const tiempoRestante = (tiempo) => {
  const total = Date.parse(tiempo) - Date.parse(new Date());
  const segundos = Math.floor((total / 1000) % 60);

  return {
    total,

    segundos,
  };
};

let tiempoTotal = "";
let intervalo = "";
const iniciarReloj = (tiempo) => {
  const segundosSpan = reloj.querySelector("#segundos");
  const actualizarReloj = () => {
    const t = tiempoRestante(tiempo);

    segundosSpan.innerHTML = ("0" + t.segundos).slice(-2);
    tiempoTotal = t.segundos;
    if (t.total <= 0) {
      clearInterval(intervalo);
      mostrarJuegoTerminado();
    }
    return tiempoTotal;
  };

  if (reloj.classList.contains("reiniciado")) {
    reloj.classList.remove("reiniciado");
    clearInterval(intervalo);

    iniciarReloj(iniciarCuentaRegresiva());
  }

  actualizarReloj();
  intervalo = setInterval(actualizarReloj, 1000);
};

//----------------------------------------🔸FIN DE TIMER🔸
const removerImagenDelDiv = (divGatito) => {
  divGatito.classList.remove("efecto-con-movimiento");
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
  divGatito.className = "contenedor-gatito efecto-con-movimiento";

  return divGatito;
};

const crearArrayGatitos = (ancho, alto) => {
  for (let i = 0; i < ancho; i++) {
    listaDeGatitos[i] = [];
    for (let j = 0; j < alto; j++) {
      listaDeGatitos[i][j] = obtenerImgGatito(i, j);
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

// a esta funcion hay q cambiarle el nombre
const cruzarGatitos = (primerGato, segundoGato) => {
  //llamo a esta funcion cuando se seleccionaron adyancentes!
  // la uso para cruzar los gatitos despues
  gatitoGuardadoEnClickAnterior = "";
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
        cruzarGatitos(gatitoGuardadoEnClickAnterior, gatitoClickeado);

        // FIJARME ESTO MA;ANA
        // let gatitoReservado = gatitoGuardadoEnClickAnterior;
        // if (buscarBloqueInicial(9) === false) {
        //   intercambiarCuadrados(gatitoClickeado, gatitoReservado);
        //   cruzarGatitos(gatitoReservado, gatitoClickeado);
        // }
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
      // console.log("celda actual", listaDeGatitos[i][j].parentElement);
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
      // console.log("div vacio", div.firstChild === null);
      // div.appendChild(obtenerImgGatito());
      // console.log(div);
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

const botonProbandoVacios = document.querySelector("#boton-vacios");
botonProbandoVacios.onclick = () => {
  llenarVacio();
};

// ---------------Obtener bloque de Matches

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
  reloj.classList.add("reiniciado");
  // iniciarReloj(iniciarCuentaRegresiva());
  clickeable();
  vaciarGrilla();
  if (reiniciarJuego.classList.contains("facil")) {
    jugar(cantidaDeFilasFacil);
  } else if (reiniciarJuego.classList.contains("normal")) {
    jugar(cantidadDeFilasNormal);
  } else if (reiniciarJuego.classList.contains("dificil")) {
    jugar(cantidadDeFilasDificil);
  }
};

const mantenerActualizado = () => {
  do {
    actualizarGrilla(cantidaDeFilasFacil);
    console.log(actualizarGrilla(cantidaDeFilasFacil));
  } while (t.total <= 0);
};

// ------------------Inicio botones Dificultad on Click-------------
botonFacil.onclick = () => {
  reiniciarJuego.classList.add("facil");
  jugar(cantidaDeFilasFacil);
};

botonNormal.onclick = () => {
  reiniciarJuego.classList.add("normal");
  jugar(cantidadDeFilasNormal);
};

botonDificil.onclick = () => {
  reiniciarJuego.classList.add("dificil");
  jugar(cantidadDeFilasDificil);
};

reiniciarJuego.onclick = () => {
  reiniciandoJuego();
};

botonBuscarMatches.onclick = () => {
  buscarMatches(9);
  borrarMatches();
};

// ------------------------------------INICIO MODALES

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

const actualizarGrilla = () => {
  buscarMatches(9);
  setTimeout(borrarMatches, 800);
  setTimeout(llenarVacio, 800);
  console.log("paso por aca");
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
//  PRUEBA DE DEVOLVER SI NO HAY MATCH

// windows onload
