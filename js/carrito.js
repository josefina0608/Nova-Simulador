$(document).ready(function() {

    // Iniciar simulador
    function aniadirAlCarrito(e) {

        e.preventDefault();

        // Obtengo los datos que ingresa el usuario al enviar el form
        preguntaDia = document.getElementById("dia").value;
        cantAdultos = parseInt(document.getElementById("adultos").value);
        cantNinios = parseInt(document.getElementById("ninios").value);

        // Inicio de proceso de chequeo antes de agregar la entrada elegida
        chequearDiaElegido(preguntaDia, catalogo);

        // Si no hay disponibilidad o no ingreso dia, el proceso se interrumpe y se alerta al usuario
        $("#adultos").css("border-bottom", ".01em solid white");
        $("#ninios").css("border-bottom", ".01em solid white");
        $("#dia").css("border-bottom", ".01em solid white");

        let error = document.getElementById("error");
        error.innerHTML = "";

        if (disponibilidad === 1) {
            error.innerHTML = "Ups! No tenemos tantas entradas para adultos! Volvé a intentarlo.";
            $("#adultos").css("border-bottom", ".01em solid red");
        }

        if (disponibilidad === 2) {
            error.innerHTML = "Ups! No tenemos tantas entradas para niños! Volvé a intentarlo.";
            $("#ninios").css("border-bottom", ".01em solid red");
        }

        if (disponibilidad === 3) {
            error.innerHTML = "Ups! No elegiste cuantas entradas comprar.";
            $("#adultos").css("border-bottom", ".01em solid red");
            $("#ninios").css("border-bottom", ".01em solid red");
        }

        if (disponibilidad === 4) {
            error.innerHTML = "Ups! Tenés que elegir una cantidad de entradas de Adultos mayor a 0.";
            $("#adultos").css("border-bottom", ".01em solid red");
        }

        if (disponibilidad === 5) {
            error.innerHTML = "Ups! Tenés que elegir una cantidad de entradas de Niños mayor a 0."
            $("#ninios").css("border-bottom", ".01em solid red");
        }

        if (disponibilidad === false) {
            error.innerHTML = "Ups! Tenés que elegir un número válido."
            $("#adultos").css("border-bottom", ".01em solid red");
            $("#ninios").css("border-bottom", ".01em solid red");
        }

        if (entradaSeleccionada === undefined) {
            error.innerHTML = "Ups! No seleccionaste el día. Volvé a intentarlo.";
            $("#dia").css("border-bottom", ".01em solid red")
        }
        document.getElementById("formulario").reset();
    }

    function chequearDiaElegido(preguntaDia, catalogo) {
        entradaSeleccionada = catalogo.find(elemento => elemento.dia == preguntaDia);

        if (entradaSeleccionada === undefined) {
            return;
        } else {
            disponibilidad = chequearDisponibilidad(entradaSeleccionada, cantAdultos, cantNinios);
        }
    }

    function chequearDisponibilidad(entradaSeleccionada, cantAdultos, cantNinios) {

        if ((entradaSeleccionada.adultos >= cantAdultos) && (entradaSeleccionada.ninios >= cantNinios) && ((cantAdultos > 0) && (cantNinios >= 0) || (cantNinios > 0) && (cantAdultos >= 0))) {
            agregarProductoAlCarrito(carrito, cantAdultos, cantNinios);
        } else if ((entradaSeleccionada.adultos < cantAdultos) && ((entradaSeleccionada.ninios >= cantNinios) && (cantNinios >= 0))) {
            return 1
        } else if (((entradaSeleccionada.adultos >= cantAdultos) && (cantAdultos >= 0)) && (entradaSeleccionada.ninios < cantNinios)) {
            return 2
        } else if ((cantAdultos === 0) && (cantNinios === 0)) {
            return 3
        } else if ((cantAdultos < 0) && ((entradaSeleccionada.ninios >= cantNinios) || (cantNinios >= 0))) {
            return 4
        } else if ((cantNinios < 0) && ((entradaSeleccionada.adultos >= cantAdultos) || (cantAdultos >= 0))) {
            return 5
        } else {
            return false
        }
    }

    function agregarProductoAlCarrito(carrito, cantAdultos, cantNinios) {

        let item = new EntradasCompradas(entradaSeleccionada, cantAdultos, cantNinios);

        if (carrito.length != 0) {

            // Busco si la entrada dentro del carrito ya existe. Si existe, sumo las cantidades y el subtotal. Sino, push de item al carrito

            let entradaEvaluada = carrito.find(elemento => elemento.id == item.id);
            if (entradaEvaluada != undefined) {
                entradaEvaluada.cantAdultos += cantAdultos;
                entradaEvaluada.cantNinios += cantNinios;
                entradaEvaluada.subtotal += item.subtotal;
            } else {
                carrito.push(item);
                document.getElementById("formulario").reset();
            }

        } else {
            carrito.push(item);
            document.getElementById("formulario").reset();
        }

        console.log(carrito);
        carritoCantidad(carrito, totalAdultos, totalNinios);
        restarStock(preguntaDia, catalogo, cantAdultos, cantNinios);

    }

    function restarStock(preguntaDia, catalogo, cantAdultos, cantNinios) {

        let nuevoStock = catalogo.find(elemento => elemento.dia == preguntaDia);

        nuevoStock.adultos -= cantAdultos;
        nuevoStock.ninios -= cantNinios;

        console.log(`Stock adultos dia ${nuevoStock.dia} = ${nuevoStock.adultos}, Stock niños dia ${nuevoStock.dia} = ${nuevoStock.ninios}`);
    }

    function sumarStock(idRemove, catalogo, elementoRemove) {

        let nuevoStock = catalogo.find(elemento => elemento.id == idRemove);

        nuevoStock.adultos += elementoRemove.cantAdultos;
        nuevoStock.ninios += elementoRemove.cantNinios;

        console.log(`Stock adultos dia ${nuevoStock.dia} = ${nuevoStock.adultos}, Stock niños dia ${nuevoStock.dia} = ${nuevoStock.ninios}`);
    }

    function carritoCantidad(carrito, totalAdultos, totalNinios) {

        if (carrito.length != 0) {
            totalAdultos = carrito.reduce((currentTotal, item) => item.cantAdultos + currentTotal, 0);
            totalNinios = carrito.reduce((currentTotal, item) => item.cantNinios + currentTotal, 0);

            $("#cantidadProductos").fadeIn(1000)
                .html(`${totalAdultos + totalNinios}`);

        } else {
            $("#cantidadProductos").fadeOut(1000)

        }
    }

    function verCarrito() {

        if ((botonChange === true)) {
            $(".carritoExpand").slideToggle(1000, function() {

                if (carrito.length === 0) {
                    $(".carritoExpand").append('<div class="aviso"><h3> <b>Tu carrito está vacío...</b><br><br>No lo dejes solo, sumale tu entrada! :)</h3></div>')
                }

                if (carrito.length != 0) {
                    $(".aviso").remove();
                    $(".carritoExpand").append('<button class="botonComprar">Comprar</button>')
                    $(".botonComprar").click(checkOut);
                }
            });

            $("#homeImage").append('<div id="overlayCarrito"></div>');
            $("#overlayCarrito").hide().fadeIn(800);

            divPorEntrada = document.createElement("div");
            divGeneral.appendChild(divPorEntrada);

            divPorEntrada.className = "verEntradas";
            botonDetalle.className = "cerrar";

            for (let index = 0; index < carrito.length; index++) {

                divEntrada = document.createElement("div");
                divEntrada.className = "divEntrada";
                divEntrada.setAttribute("id", `${carrito[index].id}`);

                let titulo = document.createElement("h2");
                titulo.className = "titulo";

                if (carrito[index].dia === 3) {
                    titulo.textContent = `Entradas para los dos días`;
                } else {
                    titulo.textContent = `Entradas para el día ${carrito[index].dia}`;
                }

                let precioEntradas = document.createElement("h3");
                precioEntradas.textContent = `TOTAL: $ ${carrito[index].subtotal}`;
                precioEntradas.className = "textoSubtotal";

                let adultosElegidos = document.createElement("p");
                adultosElegidos.textContent = `Adultos: ${carrito[index].cantAdultos}`;
                adultosElegidos.className = "texto";

                let niniosElegidos = document.createElement("p");
                niniosElegidos.textContent = `Niños: ${carrito[index].cantNinios}`;
                niniosElegidos.className = "texto";

                botonErase = document.createElement("button");
                botonErase.className = "erase";
                botonErase.setAttribute("value", `${carrito[index].id}`);
                botonErase.addEventListener("click", removerEntrada);

                divEntrada.appendChild(titulo);
                divEntrada.appendChild(adultosElegidos);
                divEntrada.appendChild(niniosElegidos);
                divEntrada.appendChild(precioEntradas);
                divEntrada.appendChild(botonErase);
                divPorEntrada.appendChild(divEntrada);
            }

            botonChange = false;
            $("#overlayCarrito").one("click", function() {
                $(".carritoExpand").slideToggle(1000);
                divPorEntrada.remove();
                $(".botonComprar").remove();
                $(".aviso").remove();
                $("#overlayCarrito").fadeOut(800, function() {
                    $("#overlayCarrito").remove();
                });
                botonDetalle.className = "botonCarrito";
                botonChange = true;
            })

        } else {

            $(".aviso").remove();
            $(".carritoExpand").slideToggle(1000);
            divPorEntrada.remove();
            $("#overlayCarrito").fadeOut(800, function() {
                $("#overlayCarrito").remove();
            });
            $(".botonComprar").remove();
            botonDetalle.className = "botonCarrito";
            botonChange = true;
        }

    }

    function removerEntrada(evt) {

        let idRemove = evt.target.value;
        let elementoRemove = carrito.find(elemento => elemento.id === idRemove);
        let idx = carrito.indexOf(elementoRemove);
        $("#" + idRemove).slideToggle(700);
        carrito.splice(idx, 1);
        sumarStock(idRemove, catalogo, elementoRemove);
        carritoCantidad(carrito, totalAdultos, totalNinios);
        console.log(carrito);
        if (carrito.length === 0) {
            $(".botonComprar").fadeOut(500, function() {
                $(".carritoExpand").append('<div class="aviso"><h3> <b>Tu carrito está vacío...</b><br><br>No lo dejes solo, sumale tu entrada! :)</h3></div>');
            });
        }

    }

    function checkOut() {

        let total = carrito.reduce((currentTotal, item) => item.subtotal + currentTotal, 0);
        totalAdultos = carrito.reduce((currentTotal, item) => item.cantAdultos + currentTotal, 0);
        totalNinios = carrito.reduce((currentTotal, item) => item.cantNinios + currentTotal, 0);

        divGeneral.remove();
        divPorEntrada.remove();
        $(".botonComprar").remove();
        $("#pasoDos").fadeOut(500);
        $(".titular").fadeOut(500);
        $("#confirmacionCompra").fadeIn(1000)
        botonDetalle.className = "botonCarrito";
        $("#cantidadProductos").fadeOut(1000);
        botonChange = true;

        $("#confirmacionCompra").append(`<h2 id="titularFinal">Festival de astronomía urbana</h2><div id="confirmacionParrafo"><p><b>¡Felicitaciones!</b><br>Compraste ${totalAdultos} entradas de adultos y ${totalNinios} entradas de niños.<br><b>Tu total es $ ${total}</b></p></div><a href="index.html" id=volver><< Volver</a>`);

        storageCompra(carrito);

        carrito = [];
    }

    function storageCompra(carrito) {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        let restoredSession = JSON.parse(localStorage.getItem('carrito'));
        console.log(restoredSession);
    }

    // Inicio del proceso

    let divGeneral = document.getElementById("verEntradas");
    let preguntaDia;
    let cantAdultos;
    let cantNinios;
    let entradaSeleccionada;
    let disponibilidad;
    let totalAdultos;
    let totalNinios;
    let botonChange = true;
    let divPorEntrada;
    let botonErase;
    let divEntrada;
    let carrito = [];

    // Boton agregar + activar funcion con submit
    let botonAgregar = document.getElementById("agregarEntrada");
    botonAgregar.addEventListener("click", aniadirAlCarrito);

    // Boton ver detalle de compra + activar funcion con click
    let botonDetalle = document.getElementById("detalleCompra");
    botonDetalle.addEventListener("click", verCarrito);

});