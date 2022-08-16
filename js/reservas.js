// En base a la cantidad de huespedes que seleccione el usuario se crean los objetos habitacion para ejecutar el metodo cotizacionTotal. Se guardar los datos de la busqueda en localStorare y se crea la tabla de 'informacion de la reserva'. El usuario elige la habitacion que prefiera y la pagar, se le despliega el formulario de pago donde el usuario ingresa sus datos y el metodo de pago por tarjeta. Una vez pagados, se crea el objeto ClienteReserva, que almacena la informacion del usuario (sin los datos sensibles) y la informacion de la habitacion que eligio comprar. 

// Creo un array de objetos habitacion desde el JSON datos.js
let arrayHabitaciones = [];
// En este array guardo el objeto habitacion que el Usuario elige para realizar el pago
let habitacionReservar = [];


//------------------ OBJETOS
// OBJETO HABITACION <- desde el json en datos.js
class Habitacion{
    constructor (data){
        this.id = parseInt(data.id);
        this.nombre = data.nombre;
        this.precio = parseFloat(data.precio);
        this.capacidad = parseInt(data.capacidad);
        this.url = data.url;
        this.descripcion = data.descripcion;      
    }
    cotizar(){
        this.cotizacionTotal = parseInt(localStorage.getItem("cantidadDias")) * this.precio;
    }
    cotizacionIntereses(){
        this.costoInteres = (this.cotizacionTotal * 1.20);
    }
}

// OBJETO CLIENTE -> Contiene la info del cliente una vez realizada la compra (info desde el form #formulario-pago y desde el array habitacionReservar)
class ClienteReserva{
    constructor (id,nombre,apellido,celular,mail,comentarios, habitacionReservar){
        this.id = parseInt(id);
        this.nombre = nombre;
        this.apellido = apellido;
        this.mail = mail;
        this.telefono = parseInt(celular);
        this.comentario = comentarios;
        this.idHabitacion = parseInt(habitacionReservar.id);
        this.nombreHabitacion = habitacionReservar.nombre;
        this.cotizacionTotal = parseFloat(habitacionReservar.cotizacionTotal);
        this.cotizacionIntereses = parseFloat(habitacionReservar.costoInteres);
        this.capacidadHabitacion = parseInt(habitacionReservar.capacidad);
    }
}
// ----------------- FIN OBJETOS


// Creo el HTML de cada una de las habitaciones sin el boton cotizar ya que necesito la cantidad de dias para que pueda cotizar
function crearHabitaciones(){
    for (let habitacion of habitaciones){
        $("#contenedor-habitaciones").append(`<div class= "card-habitacion mt-2 mb-2 row" >
                                                <div class="contenedor-img p-0 col-xs-12 col-md-4">
                                                    <img class="p-5" src="../img/${habitacion.url}" alt="">
                                                </div>
                                                <div class="contenedor-descripcion px-3 col-xs-12 col-md-8 d-flex flex-column justify-content-around">
                                                    <div>
                                                        <h3 class="detalle-nombre">${habitacion.nombre}</h3>
                                                        <p> $ ${habitacion.precio} / noche</p>
                                                        <p>${habitacion.descripcion}</p>
                                                    </div>
                                                    <div  id="contenedor-cotizacion" class="d-block">

                                                    </div>
                                                </div>
                                            </div>
                                            <hr>`);
    } 
}


// Capturo los inputs del formulario (html collection)
const infoInputs = $(".info-inputs");

// Funcion para guardar en localStorage los datos ingresados por el usuario y que estos no se pierdan al cerrar la ventana
const guardarLocal = (clave, valor) => {localStorage.setItem(clave,valor)};


// Envio de formulario a traves del input SUBMIT
$("#buscar-habitacion").submit(function(event){
    // Prevenimos que se envie la informacion por el formulario
    event.preventDefault();
    // calculo la cantidad de dias 
    var fechaInicio = new Date(infoInputs[0].value).getTime();
    var fechaFin    = new Date(infoInputs[1].value).getTime();
    var diff = (fechaFin - fechaInicio)/(1000*60*60*24);
    // (1000*60*60*24) --> milisegundos -> segundos -> minutos -> horas -> días
    if ((infoInputs[2].value === 0) || ((infoInputs[1].value === "") || (infoInputs[2].value === ""))) {
        alert("Por favor complete los datos");
        $("#section-booking-info").empty();
        $("#contenedor-habitaciones").empty();
        crearHabitaciones();
    }else if(infoInputs[2].value >= 4){
        alert("Las habitaciones no aceptan más de 3 huéspedes");
        $("#section-booking-info").empty();
        $("#contenedor-habitaciones").empty();
        crearHabitaciones();
    }else if(diff === 0){
        alert("El tiempo de estadia mínimo es de 1 noche");
    }
    else{
        // se sobreescriben adrede para que quede siempre los ultimos datos ingresados por el usuario
        guardarLocal("ingreso", infoInputs[0].value),
        guardarLocal("salida", infoInputs[1].value),
        guardarLocal("huespedes", infoInputs[2].value),
        guardarLocal("cantidadDias", diff)

        $("#section-booking-info").empty();
        crearTablaBusqueda();
        // Si el formulario vuelve a ser enviado, evita que se solape la informacion 2 veces al vaciar el array arrayHabitaciones
        if( arrayHabitaciones.length > 1){
            arrayHabitaciones = [];
        }
        for (const habitacion of habitaciones) {
            arrayHabitaciones.push(new Habitacion (habitacion));
        }
        // Renderizo las habitaciones en base a lo que el usuario ingreso en su primera busqueda del localStorage
        filtrarHabitacionesAptas();
    }
});


function crearTablaBusqueda(){
    $("#section-booking-info").html(`<section class="section-booking" id="section-booking-info">
                                        <h2 class="text-center py-4">INFORMACIÓN DE LA RESERVA</h2>
                                        <div class="row" id="contenedor-info-busqueda">
                                            <div class="col-xs-12 col-md-3 text-center"> 
                                                <h3>Ingreso</h3>
                                                <p>${localStorage.getItem("ingreso")}</p>
                                            </div>
                                            <div class="col-xs-12 col-md-3 text-center"> 
                                                <h3>Salida</h3>
                                                <p>${localStorage.getItem("salida")}</p>
                                            </div>
                                            <div class="col-xs-12 col-md-3 text-center"> 
                                                <h3>Noches</h3>
                                                <p>${localStorage.getItem("cantidadDias")}</p>
                                            </div>
                                            <div class="col-xs-12 col-md-3 text-center"> 
                                                <h3>Huéspedes</h3>
                                                <p>${localStorage.getItem("huespedes")}</p>
                                            </div>
                                        </div>
                                    </section>`);
    $("#section-booking-info").hide();

    $("#section-booking-info").slideDown(500);
}

$("#contenedor-pagar").hide();
function filtrarHabitacionesAptas(){
    $("#contenedor-habitaciones").empty();
    for (let habitacion of arrayHabitaciones){
        if(habitacion.capacidad === parseInt(localStorage.getItem("huespedes"))){
            // Ejecutamos el metodo cotizar del objeto Habitacion
            habitacion.cotizar();
            $("#contenedor-habitaciones").append(`<div class= "card-habitacion mt-2 mb-2 row" >
                                                    <div class="contenedor-img p-0 col-xs-12 col-md-4">
                                                        <img class="p-5" src="../img/${habitacion.url}" alt="">
                                                    </div>
                                                    <div class="contenedor-descripcion px-3 col-xs-12 col-md-8 d-flex flex-column justify-content-around">
                                                        <div>
                                                            <h3 class="detalle-nombre">${habitacion.nombre}</h3>
                                                            <p> $ ${habitacion.precio} / noche</p>
                                                            <p>${habitacion.descripcion}</p>
                                                            
                                                        </div>
                                                        <div  id="contenedor-cotizacion${habitacion.id}">
                                                            <p class="text-end">Total:
                                                            <span class="detalle-precio"> $ ${habitacion.cotizacionTotal}</span> <br>
                                                            <a id="botonPagar${habitacion.id}" class="boton d-inline-block mt-2" href="#contenedor-pagar">Pagar</a>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr>`);
            $("#botonPagar" + habitacion.id).click(function() {
                // Guardo toda la info de la habitacion que elige el Usuario
                habitacionReservar = habitacion;
                $("#contenedor-pagar").hide();
                $("#contenedor-pagar").fadeIn(1000);
                console.log($($(this).attr('href')).offset().top);
                var seccionOffsetTop = $($(this).attr('href')).offset().top - 100;
                $('html, body').stop().animate({scrollTop: seccionOffsetTop}, 400);
            });
        }
    }
}

// Me fijo si hay datos guardados en el localStorage
//  si no hay, por defecto traigo las habitaciones de datos.js, sin crear los objetos,
//  si hay, genero los objetos Habitacion en funcion de la cantidad de huespedes que el usuario indica en el form

function datosAlmacenados(){
    if(((localStorage.getItem("checkin")) && (localStorage.getItem("checkout")) && (localStorage.getItem("huespedes"))) == null){
        crearHabitaciones();
    } 
    else{
        for (const habitacion of habitaciones) {
            arrayHabitaciones.push(new Habitacion (habitacion));
        }
        
        crearTablaBusqueda();
        filtrarHabitacionesAptas();
    }

}

// -------------- Funcion que inicia 
datosAlmacenados();
// -------------- Funcion que inicia

// PAGO
let infoInputsUser;
$("#formulario-pago").submit(function(event){
// Prevenimos que se envie la informacion por el formulario
    event.preventDefault();

    infoInputsUser = $(".info-usuario-inputs");
    infoTarjetaUser = $(".info-tarjeta-inputs");
    console.log($("select[id=infoCuotasCredito]").val());

    if((($("select[id=infoCuotasCredito]").val() || $("select[id=infoCuotasDebito]").val()) === undefined)){
        alert("Ingrese tarjeta y cantidad de cuotas");
        $("#formulario-pago").trigger("reset");
        $("#contenedor-debito").empty();
        $("#contenedor-credito").empty();
    } else if (($("select[id=infoCuotasCredito]").val() || $("select[id=infoCuotasDebito]").val()) == null){
        alert("Ingrese la cantidad de cuotas");
    }else{
        guardarLocal("nombre", infoInputsUser[0].value),
        guardarLocal("apellido", infoInputsUser[1].value),
        guardarLocal("telefono", infoInputsUser[2].value),
        guardarLocal("mail", infoInputsUser[3].value),
    
        // Se limpia el formulario al enviarse la info
        finalizarPago();
    }
});

// Array que va a contener la informacion de los clientes y su respectiva reserva
const ReservacionesClientes = [];
    function finalizarPago(){ 
        // Creamos los clientes con la informacion que ingreso el usuario y la habitacion en cuestion
        ReservacionesClientes.push(new ClienteReserva  ( ReservacionesClientes.length,infoInputsUser[0].value,infoInputsUser[1].value,infoInputsUser[2].value,infoInputsUser[3].value, infoInputsUser[4].value, habitacionReservar))
        console.log(ReservacionesClientes);
        // Vaciamos el form para que puedan ingresarse mas datos
        $("#formulario-pago").trigger("reset");
        $("#contenedor-debito").empty();
        $("#contenedor-credito").empty();

        
    }
    // LIMPIAR FORM
    $("#vaciarForm").click(function() {
        $("#contenedor-debito").empty();
        $("#contenedor-credito").empty();
    });

// Segun se seleccione debito o credito va a ser el select que se muestre

$("#botonCredito").on('click', function() {
    $("#contenedor-debito").empty();
    $("#contenedor-credito").empty();

    $("#contenedor-credito").append(`<select id="infoCuotasCredito" class="form-select mb-2" >
                                        <option value="0" disabled selected>Cuotas</option>
                                        <option id="unaCuota" class="cuota" value="1" >1 cuota</option>
                                        <option id="dosCuotas" class="cuota" value="3">3 cuotas</option>
                                        <option id="tresCuotas" class="cuota" value="6">6 cuotas + intereses</option>
                                    </select>
                                    <div id="contenedor-cuotas-credito">
                                    </div>`);
    $("#infoCuotasCredito").change(function(e) {
        $("#contenedor-cuotas-credito").empty();
        const opcionSeleccionada = parseInt(e.target.value);
        let cuota= "";
        if(opcionSeleccionada === 1){
            cuota = habitacionReservar.cotizacionTotal / 1;
            $("#contenedor-cuotas-credito").append(`<p> ${opcionSeleccionada} cuota de $ ${cuota} </p>`);
        } else if (opcionSeleccionada === 3){
            cuota = (habitacionReservar.cotizacionTotal /3).toFixed(2);
            $("#contenedor-cuotas-credito").append(`<p> ${opcionSeleccionada} cuotas de $ ${cuota} </p>`);
        } else if (opcionSeleccionada === 6) {
            cuota = ((habitacionReservar.cotizacionTotal * 1.2) /6).toFixed(2);
            $("#contenedor-cuotas-credito").append(`<p> ${opcionSeleccionada} cuotas de $ ${cuota} </p>`);
            habitacionReservar.cotizacionIntereses();
        } else{
            alert("Ingrese la cantidad de cuotas");
        }
    });
});
$("#botonDebito").click(function (){
    $("#contenedor-debito").empty();
    $("#contenedor-credito").empty();
    $("#contenedor-debito").append(`<select id="infoCuotasDebito" class="form-select mb-2">
                                        <option value="0" disabled selected>Cuotas</option>
                                        <option value="1">1 cuota</option>
                                    </select>
                                    <div id="contenedor-cuotas-debito"></div>`);
    $("#infoCuotasDebito").change(function(e){
        $("#contenedor-cuotas-debito").empty();
        const opcionSeleccionada = parseInt(e.target.value);
        let cuota = "";
        if(opcionSeleccionada === 1){
            cuota = habitacionReservar.cotizacionTotal / 1;
            $("#contenedor-cuotas-debito").append(`<p> ${opcionSeleccionada} cuotas de $ ${cuota} </p>`);
        } else{
            alert("Ingrese la cantidad de cuotas");
        }
    });
});


