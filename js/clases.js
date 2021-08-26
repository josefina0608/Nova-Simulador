// Defino el objeto EntradasCompradas al cual voy a añadir la info pedida y si se verifica el stock, se suma al array carrito

class EntradasCompradas {
    constructor (entradaSeleccionada, cantAdultos, cantNinios){
        this.dia = entradaSeleccionada.dia;
        this.id = entradaSeleccionada.id;
        this.cantAdultos = parseInt(cantAdultos);
        this.cantNinios = parseInt(cantNinios);
        this.precio = entradaSeleccionada.precio;
        this.adultos = entradaSeleccionada.adultos;
        this.ninios = entradaSeleccionada.ninios;
        this.subtotalAdulto = cantAdultos * entradaSeleccionada.precio;
        this.subtotalNinios = cantNinios * entradaSeleccionada.precio * 0.5;
        this.subtotal = this.subtotalNinios + this.subtotalAdulto;
    }
}