/**
 * Created by faviofigueroa on 26/4/18.
 */


(function ($) {


    iconSvg = {

        convertirFigureSvg: function (idjQuery, vuelo) {


            var $img = jQuery($("#" + idjQuery).children("figure"));
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = 'content/images/tiempo_vuelo/' + $img.data('src') + '.svg';

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


                var duracion = {horas: 0, minutos: 0};
                for (var i = 0; i < vuelo.vuelos.length; i++) {
                    var flight = vuelo.vuelos[i];
                    var nivel = i + 1;

                    var timeStrSalida = formatTime(flight.horaSalida);
                    var timeStrLlegada = formatTime(flight.horaLlegada);
                    $("#" + idjQuery).children('svg').find('[data="salida' + nivel + '"]').empty().append(flight.origen);
                    $("#" + idjQuery).children('svg').find('[data="llegada' + nivel + '"]').empty().append(flight.destino);
                    $("#" + idjQuery).children('svg').find('[data="lineaVuelo' + nivel + '"]').empty().append(flight.co_operador + "" + flight.num_vuelo);
                    $("#" + idjQuery).children('svg').find('[data="operado' + nivel + '"]').empty().append(operadorSvg(flight.co_operador));
                    $("#" + idjQuery).children('svg').find('[data="horaSalida' + nivel + '"]').empty().append(timeStrSalida);
                    $("#" + idjQuery).children('svg').find('[data="horaLlegada' + nivel + '"]').empty().append(timeStrLlegada);


                    if (nivel == 1) {
                        $("#" + idjQuery).children('svg').find('[data="aeropuertoSalida' + nivel + '"]').empty().append(separarAeropuertoSvg(airports[flight.origen]));
                    } else {
                        $("#" + idjQuery).children('svg').find('[data="aeropuertoSalida' + nivel + '"]').empty();

                    }


                    $("#" + idjQuery).children('svg').find('[data="aeropuertoLlegada' + nivel + '"]').html(separarAeropuertoSvg(airports[flight.destino]));
                    $("#" + idjQuery).children('svg').find('[data="duracion' + nivel + '"]').empty().append(flight.tiempoVuelo.Hrs + " hrs , " + flight.tiempoVuelo.Mins + " mins.");


                    //agregamos el tiempo de vuelo a la duracion
                    duracion.horas = duracion.horas + parseInt(flight.tiempoVuelo.Hrs);
                    duracion.minutos = duracion.minutos + parseInt(flight.tiempoVuelo.Mins);


                }

                //dibUJa el tiempo de transito si esque existe
                if (vuelo.vuelos.length == 2) {
                    //sacar fecha llegada
                    var hora_llegada_1 = vuelo.vuelos[0].horaLlegada;
                    var hora_salida_2 = vuelo.vuelos[1].horaSalida;

                    var transito = tiempoTransito(hora_llegada_1, hora_salida_2);
                    $("#" + idjQuery).children('svg').find('[data="transito1"]').empty().append(transito.Str);

                    //agregamos el tiempo de transito a la duracion
                    duracion.horas = duracion.horas + parseInt(transito.Hrs);
                    duracion.minutos = duracion.minutos + parseInt(transito.Mins);


                } else if (vuelo.vuelos.length == 3) {
                    var hora_llegada_1 = vuelo.vuelos[0].horaLlegada;
                    var hora_salida_2 = vuelo.vuelos[1].horaSalida;

                    var transito = tiempoTransito(hora_llegada_1, hora_salida_2);
                    $("#" + idjQuery).children('svg').find('[data="transito1"]').empty().append(transito.Str);

                    //agregamos el tiempo de transito a la duracion
                    duracion.horas = duracion.horas + parseInt(transito.Hrs);
                    duracion.minutos = duracion.minutos + parseInt(transito.Mins);

                    var hora_llegada_3 = vuelo.vuelos[1].horaLlegada;
                    var hora_salida_4 = vuelo.vuelos[2].horaSalida;

                    var transito2 = tiempoTransito(hora_llegada_3, hora_salida_4);
                    $("#" + idjQuery).children('svg').find('[data="transito2"]').empty().append(transito2.Str);

                    //agregamos el tiempo de transito a la duracion
                    duracion.horas = duracion.horas + parseInt(transito2.Hrs);
                    duracion.minutos = duracion.minutos + parseInt(transito2.Mins);


                }

                //verificamos si los minutos pueden ser horas y el restante minutos
                if (duracion.minutos > 59) {
                    var aux_res = duracion.minutos / 60;
                    var hrs = parseInt(aux_res);
                    var min = Math.round((aux_res - hrs) * 60);
                    duracion.horas = duracion.horas + hrs;
                    duracion.minutos = min;
                }
                //agregamos la duracion total a la celda principal de este vuelo
                $('#' + vuelo.tipo + '_' + vuelo.num_opcion).find(".duracion_total").empty().append("Duración Total : "
                    + ((duracion.horas > 0) ? duracion.horas + " hrs. " : "")
                    + ((duracion.minutos > 0) ? duracion.minutos + " mins." : " ")
                );

                vuelo.duracionTotalVuelo = duracion;


            }, 'xml');


        },

        convertirFigureSvgIcono: function () {

            jQuery('figure.svg').each(function () {
                var $img = jQuery(this);
                var imgID = $img.attr('id');
                var imgClass = $img.attr('class');
                var click = $img.attr('onclick');
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
                    if (typeof click !== 'undefined') {
                        $svg.click(function () {
                            document.getElementById("myDropdown").classList.toggle("show");

                        });
                    }
                    // Remove any invalid XML tags as per http://validator.w3.org
                    $svg = $svg.removeAttr('xmlns:a');
                    // Replace image with new SVG
                    $img.replaceWith($svg);


                }, 'xml');


            });





        },


    };

})
(jQuery);