$(document).ready(function(){
    var numero = 1;
    $('#btnMenu').on('click', function (e){
        e.preventDefault();
        if(numero == 1){
            $('.menu-principal-movil').animate({top:80, right:0},300, function () {
                numero = 0;
            });
        } else {
            $('.menu-principal-movil').animate({right:'-100%'},300, function(){
                numero = 1;
            });
        }
    })

    $('.menu-principal-movil a').on('click', function(e){
        $('.menu-principal-movil').animate({right:'-100%'},300, function(){
            numero = 1;
        });
    })
});
