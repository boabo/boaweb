/**
 * Created by faviofigueroa on 23/8/17.
 */


var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

(function ($) {

    loadingBoa = {

        convertirFigureSvgLoading : function () {

            console.log('llega')
            jQuery('figure.svg').each(function () {
                var $img = jQuery(this);
                var imgID = $img.attr('id');
                var imgClass = $img.attr('class');
                var imgURL = 'content/images/' + $img.data('src') + '.svg';

                jQuery.get(imgURL, function (data) {
                    // Get the SVG tag, ignore the rest
                    var $svg = jQuery(data).find('svg');

                    // Add replaced image's ID to the new SVG
                    if (typeof imgID !== 'undefined') {
                        $svg = $svg.attr('id', imgID);
                    }
                    // Add replaced image's classes to the new SVG
                    if (typeof imgClass !== 'undefined') {
                        $svg = $svg.attr('class', imgClass + ' replaced-svg');
                    }

                    // Remove any invalid XML tags as per http://validator.w3.org
                    $svg = $svg.removeAttr('xmlns:a');

                    // Replace image with new SVG
                    $img.replaceWith($svg);



                    $svg.find('.loading_boa').addClass('loading_girar');


                    $(".roja1").one(animationEnd, function () {
                        $('.amarilla1_').addClass('amarilla1');
                        $('.amarilla2_').addClass('amarilla2');

                        $(".amarilla1").one(animationEnd, function () {
                            $('.verde1_').addClass('verde1');
                            $('.verde2_').addClass('verde2');

                            $(".verde1").one(animationEnd, function () {
                                $('.alas_rojas').addClass('color_rojas');
                                $('.alas_amarillas').addClass('color_amarillas');
                                $('.alas_verdes').addClass('color_verdes');

                                $('.alas').addClass('alas_scale');
                                $('.loading_boa').addClass('loading_escalar');

                                $(".loading_escalar").one(animationEnd, function () {


                                });



                            });


                        });
                    });






                }, 'xml');




            });

        },
        cargarBoa:function () {
            $("#ui_reserva_vuelos").addClass("blured");

            $("loading").addClass('MostrarLoading');
            $(".MostrarLoading").one(animationEnd, function () {

                if ($("loading").hasClass('MostrarLoading')) {
                    console.log('animacion terminada');
                    $("loading").removeClass('MostrarLoading');
                    $("loading").css({"visibility": "visible"});

                    console.log('end de mostrar ', this)
                }

            });


            $("loading").show();
            $("loading").html('<figure data-src="boa" class="svg"></figure>');

            $('loading').find('figure').append('<img width="125" src="content/images/loading_boa3.gif?'+ new Date().getTime()+'" />');

            //loadingBoa.convertirFigureSvgLoading();

        },
        terminarCargarBoa:function () {

            $("#ui_reserva_vuelos").removeClass("blured");

            $("loading").addClass('ocultarLoading');
            $(".ocultarLoading").one(animationEnd, function () {
                if($("loading").hasClass('ocultarLoading')){
                    $("loading").removeClass('ocultarLoading');
                    console.log('se cerro')
                    $("loading").html('');
                    $("loading").hide();
                }
            });

        }
    }



})(jQuery);
