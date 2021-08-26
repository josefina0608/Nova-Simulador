$(document).ready (function (){
    

// Imagen astronomica del dia para la home
function inicio() {
    $(".carritoExpand").hide();
    $("#cantidadProductos").hide();
    $("#pasoDos").hide();
    $("#confirmacionCompra").hide();
}

function hoverBotonInicio() {
    pasoUno.style.transform ="rotate(360deg) scale(1.2)"
}
function botonInicio() {
    pasoUno.style.transform ="rotate(0deg) scale(1)"
}

function etapaDos() {
    pasoUno.style.display = "none";
    $("#imagenPresentacion").slideUp(900);
    $("#pasoDos").slideToggle(700);

    $("#cruzForm").click(volverAlInicio);
}

function volverAlInicio() {
    $("#compraEntrada").show();
    $("#pasoDos").slideUp(500);
    $("#imagenPresentacion").slideDown(900);

}

$.ajax({
    url: 'https://api.nasa.gov/planetary/apod?api_key=IVDWHVxDg5Sjk48Cocrkf2YS2fnDJBFZ3JoDUPgX',
    type: 'GET',
    contentType: 'application/json',
    success: function (respuesta) {
        $("#imagenPresentacion").append(`<div id="contenedorImgCuadrado"><div id="contenedorImg"><img src="${respuesta.url}" alt="Ups. Hubo un error en la carga"></div></div><div id="textoPresentacion"><h3>Astronomy Picture Of the Day</h3><p>Copyright: ${respuesta.copyright}</p><p>Date ${respuesta.date}</p></div> `)
        
        
    },
    error: function (error) {
        console.log("Error in network request for NASA API")
    }
 });

 // Boton iniciar compra + mostrar form
let pasoUno = document.getElementById("compraEntrada");

pasoUno.addEventListener("click",etapaDos);
pasoUno.addEventListener("mouseover",hoverBotonInicio);
pasoUno.addEventListener("mouseleave", botonInicio)

inicio();

});