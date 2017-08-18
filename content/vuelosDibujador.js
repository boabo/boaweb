/**
 * Created by faviofigueroa on 14/8/17.
 */


(function ($) {


    vuelosDibujador = {
        familyInformation: [{
            "refNumber": 1,
            "fareFamilyName": "PROMODOM",
            "cabin": "Y",
            "comercialFamily": "CFFBOA"
        }, {
            "refNumber": 2,
            "fareFamilyName": "ECODOM",
            "cabin": "Y",
            "comercialFamily": "CFFBOA"
        }
        , {
            "refNumber": 3,
            "fareFamilyName": "ECOPREDOM",
            "cabin": "Y",
            "comercialFamily": "CFFBOA"
        }],



        opcionIdaSeleccionado:'',
        opcionVueltaSeleccionado:'',
        familiaIdaSeleccionado:'',
        store:'',
        iniciarDibujador:function (store) {
            vuelosDibujador.store = store;
        },
        dibujarHeaderFamilias: function (tipo) {


            if(tipo == 'salidas'){
                var m = $('<div id="salidas_" style="width: 100%; ">\n    <div style="display: block; height: 40px;">\n        <div style="width: 60%; float: left">Selecciona la clase que te convenga</div>\n        <div style="width: 40%; float: left" class="familias_">\n            \n        </div>\n    </div>\n    \n</div>');

            }else if(tipo == 'llegadas'){
                var m = '<div id="llegadas_" style="width: 100%; ">\n    <div style="display: block; height: 40px;">\n        <div style="width: 60%; float: left">Selecciona la clase que te convenga</div>\n        <div style="width: 40%; float: left">\n            <div style="float: left;width: 33%; text-align: center; background-color: #333333; color:#fff;">F1</div>\n            <div style="float: left;width: 33%; text-align: center; background-color: #333333; color:#fff;">F1</div>\n            <div style="float: left;width: 33%; text-align: center; background-color: #333333; color:#fff;">F1</div>\n        </div>\n    </div>\n    \n</div>';

            }

            $.each(vuelosDibujador.store.familyInformation,function (k,v) {

                $(m).find('.familias_').append('<div style="float: left;width: 33%; height: 30px; font-size: 12px; text-align: center; background-color: #1F3656; color:#fff; padding-top: 10px;">'+v.fareFamilyName+'</div>')
            });

            return m;
        },
        dibujarVuelos:function (tipo,store) {

            var m ='';
            var tabla = tipo+"_";

            var ida_vuelta = '';
            var familiaTipoidaVuelta = '';
            var disponibilidadTipoidaVuelta = '';
            var importe_vuelo = '';
            if(tipo == "salidas"){

                ida_vuelta = "vuelosIda";
                familiaTipoidaVuelta = "FI";
                disponibilidadTipoidaVuelta = "IDisponibility";

                importe_vuelo = "importe_orig";

            }else if (tipo == "llegadas"){

                ida_vuelta = "vuelosVuelta";
                familiaTipoidaVuelta = "FV";
                disponibilidadTipoidaVuelta = "VDisponibility";

                importe_vuelo = "importe_return";

            }
            var vuelos = store[ida_vuelta];
            $.each(vuelos,function (k,v) {


                var ico_conexion = '';
                var escala = '';
                if(v.vuelos.length >= 2){
                    ico_conexion = 'ico_con_conexion';
                }else{
                    ico_conexion = 'ico_sin_conexion';
                }

                console.log(formatTime(v.horaLlegada))
                console.log('v',v)
                m = $('<div  id="'+ida_vuelta+'_'+v.num_opcion+'" data-opcion="'+v.num_opcion+'" data-tipo="'+ida_vuelta+'" style="display: block; height:80px; cursor: pointer;">\n    <div style="width: 60%;  float: left; margin-top: 12px;">\n        <div style="float: left;width: 25%; text-align: center; border-left: 2px solid #EFAA35;">\n            <span>SALIDA</span>\n            <div><b>'+formatTime(v.horaSalidaVuelo)+' '+v.origenVuelo+'</b></div>\n            <div style="display: block; margin-top: 5px;" onclick="vuelosDibujador.verDetalleConexion(this)"\n                 class="btn_view_detail"><span></span>Detalle\n            </div>\n        </div>\n        <div style="float: left;width: 25%; text-align: center;">\n            <div class="'+ico_conexion+'"></div><span><label class="duracion_total">Duración Total :<br> 1 hora</label></span>\n        </div>\n        <div style="float: left;width: 25%; text-align: center;">\n            <span>LLEGADA</span><div><b>'+formatTime(v.horaLlegadaVuelo)+' '+v.destinoVuelo+'</b></div>\n        </div>\n        <div style="float: left;width: 23%; text-align: center;">\n            <span><label>Operado por:</label></span><br><div class="ico_boa"><span style="bottom:-18px;position:relative;">BoA</span></div>\n        </div>\n    </div>\n</div>');

                var opcion_vuelo_indice ='';
                //no tiene vuelta entonces dibujamos directamente con sus opciones y vuelta como cero ej: 1-0
                if(ida_vuelta == "vuelosIda"){
                    if(store.tieneVuelta == false){


                        //cuando es la primera entra aca para dibujar
                        opcion_vuelo_indice = v.num_opcion+'-'+0;
                        console.log(store.vueloMatriz[opcion_vuelo_indice]);


                    }else{
                        opcion_vuelo_indice = v.num_opcion+'-'+v.num_opcion;
                    }
                }else if(ida_vuelta == "vuelosVuelta"){
                    if(vuelosDibujador.opcionIdaSeleccionado != ''){
                        opcion_vuelo_indice = vuelosDibujador.opcionIdaSeleccionado+'-'+v.num_opcion;
                    }else{
                        opcion_vuelo_indice = 1+'-'+v.num_opcion;
                    }

                }


                //buscaremos sus distinatas tarifas por familias
                var FamiliasImportes = $('<div style="width: 40%; float: left; ">\n</div>');

                var objectAux = {};
                $.each(store.vueloMatriz[opcion_vuelo_indice].tarifas, function (indexTarifa, tarifa) {



                    var importe = tarifa.TarifaPersoCombinabilityID[importe_vuelo];
                    var moneda = tarifa.TarifaPersoCombinabilityID.moneda;
                    var disponibilidad = parseInt(tarifa.iv[disponibilidadTipoidaVuelta]);

                    var clase_disponibilidad = '';
                    //vemos la disponibilidad para agregar la clase correspondiente un color etc
                    if(disponibilidad > 0 && disponibilidad <= 3){

                        clase_disponibilidad = 'dispo_rojo';
                        console.log(disponibilidad);
                    }else if(disponibilidad > 3 && disponibilidad <= 6){
                        clase_disponibilidad = 'dispo_naranja';
                        console.log(disponibilidad);
                    }else if(disponibilidad > 6 && disponibilidad <= 9){

                        clase_disponibilidad = 'dispo_verde';
                        console.log(disponibilidad);
                    }
                    ///FamiliasImportes.append('<div style="float: left;width: 32%; text-align: center; background-color: #f1f1f1; color:#fff; height: 50px; padding-top: 28px; color: #333333; border: 1px solid #fff;font-size: 15px;"><b>'+importe+' '+moneda+'</b></div>');

                    objectAux[tarifa[familiaTipoidaVuelta]] = '<div onclick="vuelosDibujador.seleccionarTarifa(this)" data-opcion="'+v.num_opcion+'" data-tipo="'+ida_vuelta+'" data-'+familiaTipoidaVuelta+'="'+tarifa[familiaTipoidaVuelta]+'" style="float: left;width: 32%; text-align: center; background-color: #f1f1f1; color:#fff; height: 50px; padding-top: 28px; color: #333333; border: 1px solid #fff;font-size: 15px;"><b>' + importe + ' ' + HTML_CURRENCIES[CURRENCY] + '</b><br><span class="'+clase_disponibilidad+'">'+disponibilidad+' Asientos</span></div>';


                });
                $.each(vuelosDibujador.familyInformation,function (indexFamilia,familia) {

                    if (objectAux[familia.refNumber] != undefined){

                        FamiliasImportes.append(objectAux[familia.refNumber]);

                    }else{
                        FamiliasImportes.append('<div style="float: left;width: 32%; text-align: center; background-color: #cccccc; color:#fff; height: 50px; padding-top: 28px; color: #333333; border: 1px solid #fff;font-size: 15px;"><b>No<br> Disponible</b></div>');
                    }


                });

                m.append(FamiliasImportes);


                var svg = '';
                if(v.vuelos.length == 1){
                    svg = 'tiempo_vuelo';
                }else if(v.vuelos.length == 2){
                    svg = 'tiempo_vuelo2';
                }else if(v.vuelos.length == 3){
                    svg = 'tiempo_vuelo3';
                }

                //dibujamos en la tabla un vuelo por vuelo
                $("#"+tabla).append(m);
                $("#"+tabla).append('<div id="'+ida_vuelta+'_'+v.num_opcion+'_detalle" style="background:#EFAA35;width: 100%;height: 200px;" class="tiempo_vuelo Detalle_cerrado"><figure data-src="'+svg+'" class="svg"></figure></div>');


                console.log($('#'+ida_vuelta+'_'+v.num_opcion+'_detalle'));
                iconSvg.convertirFigureSvg(''+ida_vuelta+'_'+v.num_opcion+'_detalle',v);
            });
           

        },

        verDetalleConexion:function (that) {

            var id_detalle_seleccionado = $(that).parent().parent().parent().attr('id')+'_detalle';

            if($("#"+id_detalle_seleccionado).hasClass('Detalle_abierto')){
                $("#"+id_detalle_seleccionado).removeClass('Detalle_abierto');
                $("#"+id_detalle_seleccionado).addClass('Detalle_cerrado');
            }else{
                $("#"+id_detalle_seleccionado).removeClass('Detalle_cerrado');

                $("#"+id_detalle_seleccionado).addClass('Detalle_abierto');
            }

        },
        seleccionarTarifa : function (that) {

            //ocultamos el seleccionar vuelo de la vista
            $("#div_empty_vuelo").hide();


            var opcion = $(that).data('opcion');
            var tipo = $(that).data('tipo');

            $('body').find('.'+tipo+'_seleccionado').removeClass(tipo+'_seleccionado')

            $(that).addClass(tipo+'_seleccionado');

            var opcion_vuelo_indice;

            var filtros_opciones = [];
            //el seleccionado es ida
            if(tipo == "vuelosIda"){

                if (vuelosDibujador.store.tieneVuelta == true) {
                    console.log(vuelosDibujador.store.vuelosVuelta)


                    $("#llegadas_").empty();
                    vuelosDibujador.opcionIdaSeleccionado = opcion;
                    var familia = $(that).data('fi');
                    vuelosDibujador.familiaIdaSeleccionado = familia;
                    vuelosDibujador.dibujarVuelos('llegadas', vuelosDibujador.store);


                } else {
                    //si no tiene entonces mapeamos los montos y taxes con la opcion -0 ejemplo 1-0 o 2-0

                    var familia = $(that).data('fi'); // familia ida es 1 o 2 o 3
                    vuelosDibujador.dibujarMontosTaxesTotales(opcion + '-0', familia, null);
                }


                //mandamos para que se dibuje  los datos del vuelo seleccionado
                vuelosDibujador.dibujarSeleccionVuelo('ida',vuelosDibujador.store.vuelosIda[opcion]);

            }else if(tipo == "vuelosVuelta"){

                var familia = $(that).data('fv'); // familia ida es 1 o 2 o 3
                vuelosDibujador.dibujarMontosTaxesTotales(vuelosDibujador.opcionIdaSeleccionado + opcion, vuelosDibujador.familiaIdaSeleccionado, familia);

            }
            console.log(filtros_opciones);
        },
        dibujarMontosTaxesTotales:function(opcion_vuelo_indice,familiaIda,familiaVuelta){

            //cuando es solo la peticion por ida
            if(familiaVuelta == null){

                //buscamos por la opcion de vuelo indice y por la familia de ida
                var object = vuelosDibujador.store.vueloMatriz[opcion_vuelo_indice];
                var tarifas = $.map( object.tarifas, function( value, index ) {
                    if(value.FI == familiaIda){
                        return value;
                    }

                });

               var tarifa_del_vuelo_seleccionado = tarifas[0];


               var total_seleccion = tarifa_del_vuelo_seleccionado.totalAmount;
               var total_taxes = tarifa_del_vuelo_seleccionado.totalTaxes;

               //dibujamos los totales en la vista
                flapperTotal.val(total_seleccion).change();
                //dibujamos el total de los taxes
                $("#totalTasas").html(total_taxes);


                //dibujamos detalle de las taxes en el tooltip
                var tooltip = $("#tooltip_tasas");
                $("#tooltip_tasas").html("");
                var tbl = document.createElement("table");
                tooltip.append(tbl);
                $(tbl).attr("cellpadding","0").attr("cellspacing",0);
                tbl.appendChild(document.createElement("tbody"));
                tbl = $(tbl).find("tbody");


                tbl.append("<tr><th class='subtitle' colspan='3'><div>TASAS TOTALES</div></th></tr>");
                tbl.append("<tr><td colspan='3' class='divisor'></td></tr>");

                var subTotal = 0;
                var cantidad_pax = 0;
                $.each(tarifa_del_vuelo_seleccionado.TasaTipoPasajero.TasaTipoPasajero,function (k,v) {
                    var tr = document.createElement("tr");
                    $(tr).append("<th>"+v.tipoTasa+"</th>")
                        .append("<td></td>")
                        .append("<td class='qty'>"+v.monto+"</td>");

                    tbl.append(tr);
                    tbl.append("<tr><td colspan='3' class='divisor'></td></tr>");
                    tbl.append("<tr><td class='detail' colspan='3'>"+v.tasa+"</tr>");
                    subTotal = parseFloat(subTotal)+parseFloat(v.monto);
                    cantidad_pax = parseInt(v.cantidadPax);
                });

                tbl.append("<tr><td class='cell-separator' colspan='3'><div></div></td></tr>")
                    .append("<tr><th><h3>Subtotal</h3></th><td class='currency'>"+HTML_CURRENCIES[CURRENCY]+"</td><td class='qty'>"+subTotal+"</td></tr>")
                    .append("<tr><td></td><td></td><td class='qty'><h3>x "+cantidad_pax+"</h3></td></tr>")
                    .append("<tr><td class='cell-separator' colspan='3'><div></div></td></tr>")
                    .append("<tr><th><h3>TOTAL</h3></th><td class='currency'>"+HTML_CURRENCIES[CURRENCY]+"</td><td class='qty'>"+subTotal*cantidad_pax+"</td></tr>");




            }
            console.log('importes seleccionado',vuelosDibujador.store.vueloMatriz[opcion_vuelo_indice]);
            console.log('opcion_vuelo_indice',opcion_vuelo_indice)
        },
        dibujarSeleccionVuelo:function (tipo,vueloSeleccionado) {

            //dibujamos


            var tblSeleccion = $("#tbl_seleccion_" + tipo + ", #tbl_seleccion_" + tipo + "_small");

            //el selector grande tbl_seleccion_ida o tbl_seleccion_vuelta
            tblSeleccion.find(".fecha_salida_").html(/*formatShortDate(opcion.vuelos[0].fecha)*/);
            tblSeleccion.find(".fecha_llegada_").html(/*formatShortDate(opcion.vuelos[0].fechaLlegada)*/);

            tblSeleccion.find(".salida_").html("<span style='float: left; padding-left: 5px; font-size: 15px;'>"+formatTime(vueloSeleccionado.horaSalidaVuelo)+"</span><h1 style='float: left;'>"+vueloSeleccionado.origenVuelo+"</h1>");
            tblSeleccion.find(".llegada_").html("<h1 style='float: right;'>"+vueloSeleccionado.destinoVuelo+"</h1><span style='float: right; font-size: 15px;'>"+formatTime(vueloSeleccionado.horaLlegadaVuelo)+"</span>");


            tblSeleccion.find(".citie_salida_").html(cities[vueloSeleccionado.origenVuelo]);
            tblSeleccion.find(".citie_llegada_").html(cities[vueloSeleccionado.destinoVuelo]);


            //dibujamos el selector small para cuando se este llenando datos del pasajero
            //este solo se mostrara estando en esa interfaz
            $("#tbl_seleccion_" + tipo + "_small").find(".cell-fecha").html(/*formatShortDate(vueloSeleccionado.vuelos[0].fecha)*/);
            $("#tbl_seleccion_" + tipo + "_small").find(".cell-cod-origen-destino").html('<h1>'+vueloSeleccionado.origen+' - '+vueloSeleccionado.destino+'</h1>');
            $("#tbl_seleccion_" + tipo + "_small").find(".cell-hora span").html(/*formatTime(vueloSeleccionado.horaSalida)*/);
            $("#tbl_seleccion_" + tipo).css("display","block");
            $("#tbl_seleccion_" + tipo).addClass("changed");
            //animamos un efecto de seleccion
            $("#overlay_"+tipo).css("display","block");
            setTimeout(function() {
                tblSeleccion.removeClass("changed");
            },100);

            $("#btn_borrar_ida").attr("data-opc_code",vueloSeleccionado.num_opcion);


            //mostramos
            $("#tbl_seleccion_" + tipo).show();

        }
        
    };



    iconSvg = {

        convertirFigureSvg : function (idjQuery,vuelo) {

            console.log($("#"+idjQuery).children("figure"))
            console.log(vuelo)

                var $img = jQuery($("#"+idjQuery).children("figure"));
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




                    console.log('convertido svg',$("#"+idjQuery).children("svg"));
                    var duracion = {horas:0,minutos:0};
                    for(var i=0;i<vuelo.vuelos.length;i++) {
                        var flight = vuelo.vuelos[i];
                        var nivel = i+1;

                        var timeStrSalida = formatTime(flight.horaSalida);
                        var timeStrLlegada = formatTime(flight.horaLlegada);
                        $("#"+idjQuery).children('svg').find('[data="salida'+nivel+'"]').html(flight.origen);
                        $("#"+idjQuery).children('svg').find('[data="llegada'+nivel+'"]').html(flight.destino);
                        $("#"+idjQuery).children('svg').find('[data="lineaVuelo'+nivel+'"]').html(flight.linea+""+flight.num_vuelo);
                        $("#"+idjQuery).children('svg').find('[data="operado'+nivel+'"]').html(operadorSvg(flight.linea));
                        $("#"+idjQuery).children('svg').find('[data="horaSalida'+nivel+'"]').html(timeStrSalida);
                        $("#"+idjQuery).children('svg').find('[data="horaLlegada'+nivel+'"]').html(timeStrLlegada);
                        $("#"+idjQuery).children('svg').find('[data="aeropuertoSalida'+nivel+'"]').html((nivel==1)?separarAeropuertoSvg(airports[flight.origen]):'');

                        $("#"+idjQuery).children('svg').find('[data="aeropuertoLlegada'+nivel+'"]').html(separarAeropuertoSvg(airports[flight.destino]));
                        $("#"+idjQuery).children('svg').find('[data="duracion'+nivel+'"]').html(flight.tiempoVuelo.Hrs +" hrs , "+flight.tiempoVuelo.Mins+" mins.");

                        //agregamos el tiempo de vuelo a la duracion
                        duracion.horas = duracion.horas + parseInt(flight.tiempoVuelo.Hrs);
                        duracion.minutos = duracion.minutos + parseInt(flight.tiempoVuelo.Mins);



                    }

                    //dibUJa el tiempo de transito si esque existe
                    if (vuelo.vuelos.length == 2){
                        //sacar fecha llegada
                        var hora_llegada_1 = vuelo.vuelos[0].horaLlegada;
                        var hora_salida_2 = vuelo.vuelos[1].horaSalida;

                        var transito = tiempoTransito(hora_llegada_1,hora_salida_2);
                        $("#"+idjQuery).children('svg').find('[data="transito1"]').html(transito.Str);

                        //agregamos el tiempo de transito a la duracion
                        duracion.horas = duracion.horas + parseInt(transito.Hrs);
                        duracion.minutos = duracion.minutos + parseInt(transito.Mins);


                    }else if(vuelo.vuelos.length == 3){
                        var hora_llegada_1 = vuelo.vuelos[0].horaLlegada;
                        var hora_salida_2 = vuelo.vuelos[1].horaSalida;

                        var transito = tiempoTransito(hora_llegada_1,hora_salida_2);
                        $("#"+idjQuery).children('svg').find('[data="transito1"]').html(transito.Str);

                        //agregamos el tiempo de transito a la duracion
                        duracion.horas = duracion.horas + parseInt(transito.Hrs);
                        duracion.minutos = duracion.minutos + parseInt(transito.Mins);

                        var hora_llegada_3 = vuelo.vuelos[1].horaLlegada;
                        var hora_salida_4 = vuelo.vuelos[2].horaSalida;

                        var transito2 = tiempoTransito(hora_llegada_3,hora_salida_4);
                        $("#"+idjQuery).children('svg').find('[data="transito2"]').html(transito2.Str);

                        //agregamos el tiempo de transito a la duracion
                        duracion.horas = duracion.horas + parseInt(transito2.Hrs);
                        duracion.minutos = duracion.minutos + parseInt(transito2.Mins);


                    }

                    //verificamos si los minutos pueden ser horas y el restante minutos
                    if(duracion.minutos > 59){
                        var aux_res = duracion.minutos / 60;
                        var hrs = parseInt(aux_res);
                        var min = Math.round((aux_res - hrs) * 60);
                        duracion.horas = duracion.horas + hrs;
                        duracion.minutos = min;
                    }
                    //agregamos la duracion total a la celda principal de este vuelo
                    $('#'+vuelo.tipo+'_'+vuelo.num_opcion).find(".duracion_total").html("Duración Total :<br> "
                     +((duracion.horas > 0)?duracion.horas+" hrs. ":"")
                     +((duracion.minutos>0)?duracion.minutos+" mins.":" ")
                     );





                }, 'xml');






        }
    };

})
(jQuery);