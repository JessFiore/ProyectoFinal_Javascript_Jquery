    // Scroll Volver arriba
$('a.volver-arriba').on('click', function (e){
    e.preventDefault;
    if ($(window).scrollTop()!= 0){
        $('html,body').stop().animate({scrollTop: 0}, 400);
    }
});

// scroll Contacto
$('a.contacto').on('click', function (e){
    e.preventDefault;
    var seccionOffset = $($(this).attr('href')).offset().top;
    $('html, body').stop().animate({scroll: seccionOffset}, 400);
});

// Scroll para el resto del botones para ajustarlo en pantalla
$('a.scroll-suave').on('click', function (e){
    e.preventDefault;
    var seccionOffsetTop = $($(this).attr('href')).offset().top - 90;
    $('html, body').stop().animate({scrollTop: seccionOffsetTop}, 400);
});



