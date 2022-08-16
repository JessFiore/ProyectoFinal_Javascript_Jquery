// Renderizamos de las habitaciones con el json de datos.js

for(habitacion of habitaciones){
    $("#contenedor-habitaciones").append(`<div class="habitacion col-xs-12 col-sm-6 col-md-3 ">
                                                <img src="img/${habitacion.url}" alt="">
                                                <div class="capa col">
                                                    <h3 class="text-center">${habitacion.nombre}</h3>
                                                </div>
                                            </div>`)
}

// LLAMADA ASINCRONA GET
$.get("https://jsonplaceholder.typicode.com/posts/1/comments",(respuesta, estadoPeticion)=>{
    if(estadoPeticion === "success"){
        DATACOMMENTS = respuesta;
        for(let index = 0; index <= 2 ; index+=1){
            $("#contenedor-comentarios").append(`<div class="row fila-comentario" id="fila${DATACOMMENTS[index].id}"></div>`);
            $(`#fila${DATACOMMENTS[index].id}`).append(crearComentario(DATACOMMENTS[index]));

        }
    }
});

function crearComentario(dataComentario){
    return `<div>  
            <h3> ${dataComentario.name} </h3> 
            <p> ${dataComentario.body} </p>
            </div>`;
}


// Renderizamos el html de la GALERIA con el json de datos.js

for(imagen of imagenesGaleria){
    $("#contenedor-fotos").append(`<div class="foto p-0 pb-4 col-xs-12 col-sm-6 p-4 col-md-4">
                                      <img src="img/${imagen.url}" alt="" >
                                    </div>`)
}
// Traigo todos los botones
$(".filtroGaleria").click(function(e){
    const filtroFotos = e.target.className.substr(20);
    $("#contenedor-fotos").empty();
    for (imagen of imagenesGaleria){
        if(imagen.categoria === filtroFotos){
            $("#contenedor-fotos").append(`<div class="foto pb-4 col-xs-12 col-sm-6 col-md-4">
                                                <img src="img/${imagen.url}" alt="" >
                                            </div>`);
        }
        if(filtroFotos === "sinfiltro"){
            $("#contenedor-fotos").append(`<div class="foto pb-4 col-xs-12 col-sm-6 col-md-4">
                                                <img src="img/${imagen.url}" alt="" >
                                            </div>`);
        }
    }
});
