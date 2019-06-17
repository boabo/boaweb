/**
 * Created by faviofigueroa on 14/8/17.
 */


(function ($) {


    vuelosDibujador = {

        objectEnviar:'',
        TasasPorTipoPasajero:'',
        opcionIdaSeleccionado:'',
        opcionVueltaSeleccionado:'',
        familiaIdaSeleccionado:'',
        familiaVueltaSeleccionado:'',

        //store:'',

        dibujarHeaderFamilias: function (tipo) {


            var that = this;

            $('#picker_salida').datepicker("setDate",
                compactToJSDate(that.store.fechaIdaConsultada)
            );

            $("#rbtn_ida").click();

            if(this.store.tieneVuelta == true) {

                $("#rbtn_ida_vuelta").click();
                $("#picker_regreso").datepicker("setDate",
                    compactToJSDate(that.store.fechaVueltaConsultada)
                );
            }


            $("#"+tipo+"_").remove();

            if(tipo == 'salidas'){
                var m = $('<div id="salidas_" style="width: 100%; ">\n    <div class="content_familias">\n        <div style="width: 60%; float: left">'+translate.t.SELECCIONA_CLASE_QUE_TE_CONVENGA+'</div>\n        <div style="width: 40%; float: left" class="familias_">\n            \n        </div>\n    </div>\n    \n</div>');

            }else if(tipo == 'llegadas'){
                var m = $('<div id="llegadas_" style="width: 100%; ">\n    <div class="content_familias">\n        <div style="width: 60%; float: left">'+translate.t.SELECCIONA_CLASE_QUE_TE_CONVENGA+'</div>\n        <div style="width: 40%; float: left" class="familias_">\n            \n        </div>\n    </div>\n    \n</div>');

            }






            //VALIDAMOS QUE SEA ARRAY SI NO DEBEMOS CONVERTILO
            if (!Array.isArray(this.store.familyInformation)) {

                var familyInformation = [];
                familyInformation.push(this.store.familyInformation);

                this.store.familyInformation = familyInformation;

            }

            var tam = parseInt(100 / this.store.familyInformation.length);

            var jsonCondicionTarifa = {};


            var tipoDestino = this.verTipoDestino(searchParameters.destino);
            var $tablaCondicionTarifaSeleccionada = $('#'+tipoDestino);
            var $dataToolTipCondicionTarifa = $tablaCondicionTarifaSeleccionada.find('[data-id="tooltip"]');
            var condicionEquipajeDeMano = $dataToolTipCondicionTarifa.find('[data-tooltip="equipaje_de_mano"]').html();
            var condicionEquipajeRegistrado = $dataToolTipCondicionTarifa.find('[data-tooltip="equipaje_registrado"]').html();
            var condicionModificacion = $dataToolTipCondicionTarifa.find('[data-tooltip="modificacion"]').html();
            var condicionReembolso = $dataToolTipCondicionTarifa.find('[data-tooltip="reembolso"]').html();
            console.log('$dataToolTipCondicionTarifa',$dataToolTipCondicionTarifa);

            var $templateTooltipIcon = $('<div style="float: left;" class="contenedor_tooltip"><img src="" width="20px" /><div class="tooltip"></div></div>');
            var $equipajeDeMano = $templateTooltipIcon.clone();
            $equipajeDeMano.find('.tooltip').html(condicionEquipajeDeMano);
            $equipajeDeMano.find('img').attr('src','content/images/equipaje-de-mano-01.png');
            var $equipajeRegistrado = $templateTooltipIcon.clone();
            $equipajeRegistrado.find('.tooltip').html(condicionEquipajeRegistrado);
            $equipajeRegistrado.find('img').attr('src','content/images/equipaje-registrado-01.png');
            var $modificacion = $templateTooltipIcon.clone();
            $modificacion.find('.tooltip').html(condicionModificacion);
            $modificacion.find('img').attr('src','content/images/modificación-de-fecha-01.png');
            var $reembolso = $templateTooltipIcon.clone();
            $reembolso.find('.tooltip').html(condicionReembolso);
            $reembolso.find('img').attr('src','content/images/modificación-de-fecha-01.png');


            var $condicionesTarifa = $('<div class="condicion_tarifa"></div>');

            $condicionesTarifa.append($equipajeDeMano);
            $condicionesTarifa.append($equipajeRegistrado);
            $condicionesTarifa.append($modificacion);
            $condicionesTarifa.append($reembolso);

            $.each(this.store.familyInformation,function (k,v) {

                $(m).find('.familias_').append('<div style="float: left;width: '+tam+'%; height: 50px; font-size: 12px; text-align: center; background-color: #1F3656; color:#fff; padding-top: 10px;">'+v.fareFamilyName+'  '+$condicionesTarifa[0].outerHTML+'</div>')
            });

            return m;
        },
        dibujarVuelos:function (tipo,store) {

            //encontrar el menor importe de la vista a mostrar
            var menorImporte =0;
            var $calendario;

            //vamos a poner a un scope en vez de el that
            var scope = this;


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

                $calendario = $("#tbl_days_selector_salida");

            }else if (tipo == "llegadas"){

                ida_vuelta = "vuelosVuelta";
                familiaTipoidaVuelta = "FV";
                disponibilidadTipoidaVuelta = "VDisponibility";

                importe_vuelo = "importe_return";
                $calendario = $("#tbl_days_selector_regreso");


            }

            //limpiamos los vuelos
            var vuelos = store[ida_vuelta];
            $.each(vuelos,function (k,v) {

                var minutosAux = (v.horaSalida.mm < 10)? '0'+v.horaSalida.mm : v.horaSalida.mm;
                var ordenPorHora = v.horaSalida.hh+''+ minutosAux;

                var ico_conexion = '';
                var escala = '';
                if(v.vuelos.length >= 2){
                    ico_conexion = 'ico_con_conexion';
                }else{
                    ico_conexion = 'ico_sin_conexion';
                }

                //dibujamos el icono de los operadores
                var iconos_operador = '';
                var objectAuxOperador = {};
                $.each(v.vuelos,function (indexVuelo,vuelo) {

                    if (objectAuxOperador[vuelo.co_operador] == undefined){
                        objectAuxOperador[vuelo.co_operador] = vuelo.co_operador;
                        var clase = linea_clase[vuelo.co_operador];
                        iconos_operador += '<div class="'+clase+'"><span style="bottom:-22px;position:relative; font-size: 11px;">'+lineas[vuelo.co_operador]+'</span></div>';
                    }
                });

                m = $('<div  id="'+ida_vuelta+'_'+v.num_opcion+'" data-opcion="'+v.num_opcion+'" data-tipo="'+ida_vuelta+'" class="content_vuelo" data-ordenPorPrecio="'+k+'" data-ordenPorHora="'+ordenPorHora+'" >\n    <div class="desc_vuelo">\n        <div style="float: left;width: 25%; text-align: center; border-left: 2px solid #EFAA35;">\n            <span>'+translate.t.SALIDA+'</span>\n            <div><b>'+formatTime(v.horaSalidaVuelo)+' '+v.origenVuelo+'</b></div>\n            <div style="display: block; margin-top: 5px;" onclick="vuelosDibujador.verDetalleConexion(this)"\n                 class="btn_view_detail"><span></span>'+translate.t.VER_DETALLE+' \n            </div>\n        </div>\n        <div style="float: left;width: 25%; text-align: center;">\n            <div class="'+ico_conexion+'"></div><span><label class="duracion_total">'+translate.t.DURACION_TOTAL+' : 1 hora</label></span>\n        </div>\n        <div style="float: left;width: 25%; text-align: center;">\n            <span>'+translate.t.LLEGADA+'</span><div><b>'+formatTime(v.horaLlegadaVuelo)+' '+v.destinoVuelo+'</b></div>\n        </div>\n        <div style="float: left;width: 23%; text-align: center;">\n            <span><label>'+translate.t.OPERADO_POR+'</label></span><br>'+iconos_operador+'\n        </div>\n    </div>\n</div>');

                var opcion_vuelo_indice ='';
                //no tiene vuelta entonces dibujamos directamente con sus opciones y vuelta como cero ej: 1-0
                if(ida_vuelta == "vuelosIda"){
                    if(store.tieneVuelta == false){

                        //cuando es la primera entra aca para dibujar
                        opcion_vuelo_indice = v.num_opcion+'-'+0;

                    }else{

                        //cuando ya se a seleccionado primero la vuelta
                        if(scope.opcionVueltaSeleccionado != ''){

                            opcion_vuelo_indice = v.num_opcion +'-'+scope.opcionVueltaSeleccionado;

                        }else{//cuando no se a seleccionado nada
                            //buscamos combinaciones que tengan tarifas esto ida pero buscamos con vuelos vuelta
                            var array_tarifas_encontradas = scope.buscarOpcionConTarifa(v.num_opcion,'vuelosVuelta');
                            opcion_vuelo_indice = array_tarifas_encontradas[0];
                        }


                    }
                }else if(ida_vuelta == "vuelosVuelta"){
                    if(scope.opcionIdaSeleccionado != ''){

                        opcion_vuelo_indice = scope.opcionIdaSeleccionado+'-'+v.num_opcion;

                    }else{
                        var array_tarifas_encontradas = scope.buscarOpcionConTarifa(v.num_opcion,'vuelosIda');

                        opcion_vuelo_indice = array_tarifas_encontradas [0];
                    }

                }


                //buscaremos sus distinatas tarifas por familias
                var FamiliasImportes = $('<div class="desc_familias">\n</div>');

                var tam = parseInt(100 / scope.store.familyInformation.length) -1;

                var objectAux = {};
                var objectAuxTarifasBarata = {};

                //duplicidad de familias y clases
                var dup = [];

                if(typeof store.vueloMatriz[opcion_vuelo_indice] === 'object'){
                    $.each(store.vueloMatriz[opcion_vuelo_indice].tarifas, function (indexTarifa, tarifa) {



                        var continuar = true;
                        //verificamos si ya se selecciona la ida debemos filtrar tambien por la familia que se a seleccionado para no mostrar tarifas que no se podrian combinar
                        if(ida_vuelta == "vuelosVuelta"){
                            if(scope.familiaIdaSeleccionado != ''){

                                if(parseInt(scope.familiaIdaSeleccionado) != parseInt(tarifa.FI)){
                                    continuar = false;

                                }

                            }
                        }

                        //verificamos si ya se selecciona la ida debemos filtrar tambien por la familia que se a seleccionado para no mostrar tarifas que no se podrian combinar
                        if(ida_vuelta == "vuelosIda"){
                            if(scope.familiaVueltaSeleccionado != ''){

                                if(parseInt(scope.familiaVueltaSeleccionado) != parseInt(tarifa.FV)){
                                    continuar = false;
                                }

                            }
                        }

                        dup[indexTarifa] = tarifa.FI+'-'+tarifa.FV;
                        if(dup[indexTarifa-1] == tarifa.FI+'-'+tarifa.FV ){
                            continuar = false;
                        }




                        if(continuar == true){
                            var importe = tarifa.TarifaPersoCombinabilityID[0][importe_vuelo];
                            var moneda = tarifa.TarifaPersoCombinabilityID[0].moneda;
                            var disponibilidad = parseInt(tarifa.iv[disponibilidadTipoidaVuelta]);

                            var clase_disponibilidad = '';
                            //vemos la disponibilidad para agregar la clase correspondiente un color etc
                            if(disponibilidad > 0 && disponibilidad <= 3){

                                clase_disponibilidad = 'dispo_rojo';
                            }else if(disponibilidad > 3 && disponibilidad <= 6){
                                clase_disponibilidad = 'dispo_naranja';
                            }else if(disponibilidad > 6 && disponibilidad <= 9){

                                clase_disponibilidad = 'dispo_verde';
                            }
                            ///FamiliasImportes.append('<div style="float: left;width: 32%; text-align: center; background-color: #f1f1f1; color:#fff; height: 50px; padding-top: 28px; color: #333333; border: 1px solid #fff;font-size: 15px;"><b>'+importe+' '+moneda+'</b></div>');

                            var familia = $.map(scope.store.familyInformation,function (fml) {
                              if(fml.refNumber == tarifa[familiaTipoidaVuelta]){
                                  return fml.fareFamilyName;
                              }
                            });

                            /*mostramos las tarifaas mas baratas si encontramos la mantenemos*/
                            var noChanges = 'Y';
                            if(typeof objectAuxTarifasBarata[tarifa[familiaTipoidaVuelta]] === "number"){
                                if(objectAuxTarifasBarata[tarifa[familiaTipoidaVuelta]] < parseFloat(importe)){

                                    noChanges = 'N';
                                    objectAuxTarifasBarata[tarifa[familiaTipoidaVuelta]] = parseFloat(importe);
                                }
                            }else {
                                objectAuxTarifasBarata[tarifa[familiaTipoidaVuelta]] = parseFloat(importe);
                            }

                            //encontramos el menor de todos los importes a mostrar en pantalla
                            //tomar en cuenta que no del servicio si no de lo que ya estamos filtrando sobre ese buscaremos el mas barato
                            if(menorImporte === 0){
                                //solo entra la primera vez
                                menorImporte = parseFloat(importe);

                            }else{
                                //reseteamos el valor con el nuevo valor menor encontrado
                                if(menorImporte > parseFloat(importe)){
                                    menorImporte = parseFloat(importe);
                                }

                            }




                            if(noChanges === 'Y'){
                                objectAux[tarifa[familiaTipoidaVuelta]] = '<div onclick="vuelosDibujador.seleccionarTarifa(this)" data-opcion="'+v.num_opcion+'" data-tipo="'+ida_vuelta+'" data-'+familiaTipoidaVuelta+'="'+tarifa[familiaTipoidaVuelta]+'" class="cajaFamilia" style="width: '+tam+'%;"><span class="familiaTarifaMobile">'+familia[0]+'</span><b>' + importe + ' ' + HTML_CURRENCIES[CURRENCY] + '</b><br><span class="'+clase_disponibilidad+'">'+disponibilidad+' '+translate.t.ASIENTOS+'</span></div>';
                            }


                        }



                    });



                }

                $.each(scope.store.familyInformation,function (indexFamilia,familia) {

                    if (objectAux[familia.refNumber] != undefined){

                        FamiliasImportes.append(objectAux[familia.refNumber]);

                    }else{
                        FamiliasImportes.append('<div class="cajaFamiliaNoDisponible" style="width: '+tam+'%;"><span class="familiaTarifaMobile">'+familia.fareFamilyName+'</span><b>No<br> Disponible</b></div>');
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
                $("#"+tabla).append('<div id="'+ida_vuelta+'_'+v.num_opcion+'_detalle" style="background:#EFAA35;width: 100%;max-height: 300px;" class="tiempo_vuelo Detalle_cerrado"><figure data-src="'+svg+'" class="svg"></figure></div>');


                iconSvg.convertirFigureSvg(''+ida_vuelta+'_'+v.num_opcion+'_detalle',v);
            });

            //re dibujamos el menor importe en el calendario encontrado en el filtrado
            $calendario.find('.selected').find('h3').html('Bs. '+  menorImporte);

           

        },

        verDetalleConexion:function (that) {

            var scope = this;

           
            var id_detalle_seleccionado = $(that).parent().parent().parent().attr('id')+'_detalle';

            if($("#"+id_detalle_seleccionado).hasClass('Detalle_abierto')){
                $("#"+id_detalle_seleccionado).removeClass('Detalle_abierto');
                $("#"+id_detalle_seleccionado).addClass('Detalle_cerrado');
                $(that).removeClass('active');

                //agregamos traducciones al span cuando cambia
                $(that).text(translate.t.VER_DETALLE);


            }else{
                $("#"+id_detalle_seleccionado).removeClass('Detalle_cerrado');

                $("#"+id_detalle_seleccionado).addClass('Detalle_abierto');

                $(that).addClass('active');

                //agregamos traducciones al span cuando cambia
                $(that).text(translate.t.OCULTAR_DETALLE);
            }

        },
        seleccionarTarifa : function (that) {


            var scope = this;

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

                if (scope.store.tieneVuelta == true) {

                    //ya esta seleccionado una vuelta
                    if(scope.opcionVueltaSeleccionado != ''){


                        var familia = $(that).data('fi'); // familia ida es 1 o 2 o 3
                        scope.dibujarMontosTaxesTotales(opcion +'-'+ scope.opcionVueltaSeleccionado, familia, scope.familiaVueltaSeleccionado);

                        //agregamos a las variables globales de selccion del objecto
                        scope.opcionIdaSeleccionado = opcion;
                        scope.familiaIdaSeleccionado = familia;

                        scope.dibujarBotonParaContinuarComprar(opcion +'-'+ scope.opcionVueltaSeleccionado,familia,scope.familiaVueltaSeleccionado);



                        //eliminaremos los vuelos de la ida pero mantendremos las familias
                        $.each($("#llegadas_").children('div'),function (i,v) {
                            if(i != 0){
                                $(v).remove();
                            }

                        });
                        scope.dibujarVuelos('llegadas', scope.store);
                        //volvemos a seleecionar la vuelta que seleeciono
                        $("#vuelosVuelta_"+scope.opcionVueltaSeleccionado).find('[data-fv="'+scope.familiaVueltaSeleccionado+'"]').addClass('vuelosVuelta_seleccionado');



                    }else{//no se a seleccionado nada aun entonces debemos redibjar las vueltas

                        scope.opcionIdaSeleccionado = opcion;
                        var familia = $(that).data('fi');
                        scope.familiaIdaSeleccionado = familia;

                        //eliminaremos los vuelos de la ida pero mantendremos las familias
                        $.each($("#llegadas_").children('div'),function (i,v) {
                            if(i != 0){
                                $(v).remove();
                            }

                        });

                        scope.dibujarVuelos('llegadas', scope.store);

                    }



                } else {
                    //si no tiene entonces mapeamos los montos y taxes con la opcion -0 ejemplo 1-0 o 2-0




                    var familia = $(that).data('fi'); // familia ida es 1 o 2 o 3

                    //agregamos a las variables globales de selccion del objecto
                    scope.opcionIdaSeleccionado = opcion;
                    scope.familiaIdaSeleccionado = familia;
                    scope.opcionVueltaSeleccionado = 0;
                    scope.familiaVueltaSeleccionado = "";

                    scope.dibujarMontosTaxesTotales(opcion + '-0', familia, null);

                    scope.dibujarBotonParaContinuarComprar(opcion + '-0', familia,null);
                }


                //mandamos para que se dibuje  los datos del vuelo seleccionado
                scope.dibujarSeleccionVuelo('ida',scope.store.vuelosIda[opcion]);

            }else if(tipo == "vuelosVuelta"){

                //cuando la ida esta seleccionado
                if(scope.opcionIdaSeleccionado != ''){
                    var familia = $(that).data('fv'); // familia ida es 1 o 2 o 3
                    scope.dibujarMontosTaxesTotales(scope.opcionIdaSeleccionado +'-'+ opcion, scope.familiaIdaSeleccionado, familia);

                    //agregamos a las variables globales de selccion del objecto
                    scope.opcionVueltaSeleccionado = opcion;
                    scope.familiaVueltaSeleccionado = familia;

                    scope.dibujarBotonParaContinuarComprar(scope.opcionIdaSeleccionado +'-'+ opcion, scope.familiaIdaSeleccionado,familia);


                    //actualizamos los vuelos ida con referencia de vuelos vuelta
                    //aca debemos mantener seleccionado el vuelo ida en este caso redibujar y vlver a seleccionarlo

                    //eliminaremos los vuelos de la ida pero mantendremos las familias
                    $.each($("#salidas_").children('div'),function (i,v) {
                        if(i != 0){
                            $(v).remove();
                        }

                    });
                    scope.dibujarVuelos('salidas', scope.store);
                    $("#vuelosIda_"+scope.opcionIdaSeleccionado).find('[data-fi="'+scope.familiaIdaSeleccionado+'"]').addClass('vuelosIda_seleccionado');


                }else{//cuando no se a seleccionado la ida entonces se debe redibujar la ida con la opcion seleccionada de la vuelta

                    $("#salidas_").empty();
                    scope.opcionVueltaSeleccionado = opcion;
                    var familia = $(that).data('fv');
                    scope.familiaVueltaSeleccionado = familia;
                    scope.dibujarVuelos('salidas', scope.store);


                }
                //mandamos para que se dibuje  los datos del vuelo seleccionado
                scope.dibujarSeleccionVuelo('vuelta',scope.store.vuelosVuelta[opcion]);


            }
        },
        dibujarMontosTaxesTotales:function(opcion_vuelo_indice,familiaIda,familiaVuelta){


            var scope = this;

            var tarifas;
            //cuando es solo la peticion por ida
            if (familiaVuelta == null) {

                //buscamos por la opcion de vuelo indice y por la familia de ida
                var object = scope.store.vueloMatriz[opcion_vuelo_indice];
                tarifas = $.map(object.tarifas, function (value, index) {
                    if (value.FI == familiaIda) {
                        return value;
                    }

                });
            }else{


                //buscamos por la opcion de vuelo indice y por la familia de ida
                var object = scope.store.vueloMatriz[opcion_vuelo_indice];
                tarifas = $.map(object.tarifas, function (value, index) {
                    if (value.FI == familiaIda && value.FV == familiaVuelta) {
                        return value;
                    }

                });
            }


            var tarifa_del_vuelo_seleccionado = tarifas[0];

            //dibujar montos por tipo de pasajero
            $.each(tarifa_del_vuelo_seleccionado.TarifaPersoCombinabilityID, function (k, v) {

                //precio_adulto
                //precio_ninho
                //precio_infante

                var tipoPasajero = '';
                if (v.typePax == 'ADT') {
                    tipoPasajero = 'precio_adulto';
                } else if (v.typePax == 'CH') {
                    tipoPasajero = 'precio_ninho';
                } else if (v.typePax == 'IN') {
                    tipoPasajero = 'precio_infante';
                } else if (v.typePax == 'SNN') {
                    tipoPasajero = 'precio_adultoMayor';
                }

                var precio_tipoPasajero = (parseFloat(v.importe) * parseInt(v.countPax)) - ( (parseFloat(v.tax_orig) + parseFloat(v.tax_return)) * parseInt(v.countPax));
                $("#" + tipoPasajero).html(precio_tipoPasajero.toFixed(2));


            });
            //fin de dibujar montos por tipo de pasajero


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
            $(tbl).attr("cellpadding", "0").attr("cellspacing", 0);
            tbl.appendChild(document.createElement("tbody"));
            tbl = $(tbl).find("tbody");


            tbl.append("<tr><th class='subtitle' colspan='3'><div>TASAS TOTALES</div></th></tr>");
            tbl.append("<tr><td colspan='3' class='divisor'></td></tr>");

            var subTotal = 0;
            var cantidad_pax = 0;
            var ObjectTasasTotalesPorTipo = {};
            var ObjectTasasPorTipoPasajero = {};

            //validamos si es array
            if (!Array.isArray(tarifa_del_vuelo_seleccionado.TasaTipoPasajero.TasaTipoPasajero)) {

                var arraTasaTipoPasajero = [];
                arraTasaTipoPasajero.push(tarifa_del_vuelo_seleccionado.TasaTipoPasajero.TasaTipoPasajero);

                tarifa_del_vuelo_seleccionado.TasaTipoPasajero.TasaTipoPasajero = arraTasaTipoPasajero;

            }
            $.each(tarifa_del_vuelo_seleccionado.TasaTipoPasajero.TasaTipoPasajero, function (k, v) {

                if (ObjectTasasTotalesPorTipo[v.tipoTasa] != undefined) {
                    ObjectTasasTotalesPorTipo[v.tipoTasa].valor += parseFloat(v.monto) * parseFloat(v.cantidadPax);
                } else {
                    ObjectTasasTotalesPorTipo[v.tipoTasa] = {};
                    ObjectTasasTotalesPorTipo[v.tipoTasa].tasa = v.tasa;
                    ObjectTasasTotalesPorTipo[v.tipoTasa].valor = parseFloat(v.monto) * parseFloat(v.cantidadPax);
                }

                //obtenemos las tasas por pasajero
                if (ObjectTasasPorTipoPasajero[v.tipoPasajero] != undefined) {
                    ObjectTasasPorTipoPasajero[v.tipoPasajero].push({
                        key: v.tipoTasa,
                        value: parseFloat(v.monto)
                    });
                } else {
                    ObjectTasasPorTipoPasajero[v.tipoPasajero] = [];
                    ObjectTasasPorTipoPasajero[v.tipoPasajero].push({
                        key: v.tipoTasa,
                        value: parseFloat(v.monto)
                    });
                }


            });

            scope.TasasPorTipoPasajero = ObjectTasasPorTipoPasajero;

            $.each(ObjectTasasTotalesPorTipo, function (k, v) {
                var tr = document.createElement("tr");
                $(tr).append("<th >" + k + "</th>")
                    .append("<td></td>")
                    .append("<td class='qty'>" + v.valor + "</td>");

                tbl.append(tr);
                tbl.append("<tr><td colspan='3' class='divisor'></td></tr>");
                tbl.append("<tr><td class='detail' colspan='3'>" + v.tasa + "</tr>");
                subTotal = parseFloat(subTotal) + parseFloat(v.monto);
                cantidad_pax = parseInt(v.cantidadPax);
            });

            /*tbl.append("<tr><td class='cell-separator' colspan='3'><div></div></td></tr>")
             .append("<tr><th><h3>Subtotal</h3></th><td class='currency'>"+HTML_CURRENCIES[CURRENCY]+"</td><td class='qty'>"+subTotal+"</td></tr>")
             .append("<tr><td></td><td></td><td class='qty'><h3>x "+cantidad_pax+"</h3></td></tr>")
             .append("<tr><td class='cell-separator' colspan='3'><div></div></td></tr>")
             .append("<tr><th><h3>TOTAL</h3></th><td class='currency'>"+HTML_CURRENCIES[CURRENCY]+"</td><td class='qty'>"+subTotal*cantidad_pax+"</td></tr>");
             */


        },
        dibujarSeleccionVuelo:function (tipo,vueloSeleccionado) {


            var scope = this;

            //dibujamos




            var tblSeleccion = $("#tbl_seleccion_" + tipo + ", #tbl_seleccion_" + tipo + "_small");

            //el selector grande tbl_seleccion_ida o tbl_seleccion_vuelta
            tblSeleccion.find(".fecha_salida_").html(formatShortDate(vueloSeleccionado.vuelos[0].fecha_salida));

            //buscamos la ultima fecha de llegada para agregarle
            $.each(vueloSeleccionado.vuelos,function (indexVuelo,vuelo) {
                tblSeleccion.find(".fecha_llegada_").html(formatShortDate(vuelo.fecha_llegada));

            });

            tblSeleccion.find(".salida_").html("<span style='float: left; padding-left: 5px; font-size: 15px;'>"+formatTime(vueloSeleccionado.horaSalidaVuelo)+"</span><h1 style='float: left;'>"+vueloSeleccionado.origenVuelo+"</h1>");
            tblSeleccion.find(".llegada_").html("<h1 style='float: right;'>"+vueloSeleccionado.destinoVuelo+"</h1><span style='float: right; font-size: 15px;'>"+formatTime(vueloSeleccionado.horaLlegadaVuelo)+"</span>");


            tblSeleccion.find(".citie_salida_").html(cities[vueloSeleccionado.origenVuelo]);
            tblSeleccion.find(".citie_llegada_").html(cities[vueloSeleccionado.destinoVuelo]);


            //dibujamos el selector small para cuando se este llenando datos del pasajero
            //este solo se mostrara estando en esa interfaz
            $("#tbl_seleccion_" + tipo + "_small").find(".cell-fecha").html(formatShortDate(vueloSeleccionado.vuelos[0].fecha_salida));
            $("#tbl_seleccion_" + tipo + "_small").find(".cell-cod-origen-destino").html('<h1>'+vueloSeleccionado.origenVuelo+' - '+vueloSeleccionado.destinoVuelo+'</h1>');
            $("#tbl_seleccion_" + tipo + "_small").find(".cell-hora span").html(formatTime(vueloSeleccionado.horaSalidaVuelo));

            $("#tbl_seleccion_" + tipo + "_small").find(".cell-duracion").html(
                ((vueloSeleccionado.duracionTotalVuelo.horas > 0)?vueloSeleccionado.duracionTotalVuelo.horas+" hrs. ":"")
                +((vueloSeleccionado.duracionTotalVuelo.minutos>0)?vueloSeleccionado.duracionTotalVuelo.minutos+" mins.":" ")
            );

            $("#tbl_seleccion_" + tipo).css("display","block");
            $("#tbl_seleccion_" + tipo).addClass("changed");
            //animamos un efecto de seleccion
            $("#overlay_"+tipo).css("display","block");
            setTimeout(function() {
                tblSeleccion.removeClass("changed");
            },100);

            $("#btn_borrar_"+tipo).attr("data-opcion",vueloSeleccionado.num_opcion);
            $("#btn_borrar_"+tipo).attr("data-tipo",tipo);


            //mostramos
            $("#tbl_seleccion_" + tipo).show();

        },
        dibujarBotonParaContinuarComprar:function (){

            var scope = this;

            var m = '';
            //cuando es solo la peticion por ida


            m = '<div onclick="vuelosDibujador.continuarCompra(this)"   class="button btn_validar_vuelos" style="position: relative;float: right;">'+translate.t.CONTINUAR_MI_COMPRA+'</div>';

            $('.cell-submit').html(m);

        },
        continuarCompra:function (that) {

            var scope = this;
            
            var opcion_indice = scope.opcionIdaSeleccionado+'-'+scope.opcionVueltaSeleccionado;


            loadingBoa.cargarBoa();

            //buscamos por la opcion de vuelo indice y por la familia de ida
            var object = scope.store.vueloMatriz[opcion_indice];
            var tarifas = $.map(object.tarifas, function (value, index) {
                //cuando es solo la peticion por ida
                if(scope.store.tieneVuelta == false) {
                    if (value.FI == scope.familiaIdaSeleccionado) {
                        return value;
                    }
                }else{//cuando tiene ida y vuelta filtrar por las dos familias
                    if (value.FI == scope.familiaIdaSeleccionado && value.FV == scope.familiaVueltaSeleccionado) {
                        return value;
                    }
                }


            });


            var tarifa_del_vuelo_seleccionado = tarifas[0];
           // var tarifa_del_vuelo_seleccionado.TarifaPersoCombinabilityID.fare_code


            var total_seleccion = tarifa_del_vuelo_seleccionado.totalAmount;
            var total_taxes = tarifa_del_vuelo_seleccionado.totalTaxes;


            var objectEnviar = {};
            objectEnviar.seleccionVuelo = {};

            $.each(tarifas[0].TarifaPersoCombinabilityID,function (k,v) {

                var tipoPasajero = ''
                if (v.typePax == 'ADT' ){

                    tipoPasajero = 'adulto';
                }else if(v.typePax == 'CH' ){
                    tipoPasajero = 'ninho';
                }else if(v.typePax == 'IN' ){
                    tipoPasajero = 'infante';
                }else if(v.typePax == 'SNN' ){
                    tipoPasajero = 'adultoMayor';
                }
                objectEnviar.seleccionVuelo[tipoPasajero] = {
                    num : v.countPax,
                    precioTotal : (parseFloat(v.importe) *  parseFloat(v.countPax) ),
                    ida:{
                        precioBase:parseFloat(v.importe_orig) - parseFloat(v.tax_orig),
                        tasas:scope.TasasPorTipoPasajero[v.typePax],
                    },


                };

                //si tiene vuelta
                if(scope.store.tieneVuelta == true){

                    objectEnviar.seleccionVuelo[tipoPasajero].vuelta = {
                        precioBase:parseFloat(v.importe_return) - parseFloat(v.tax_return)
                        
                    };
                    var tasasVueltas = [];
                    $.each(scope.TasasPorTipoPasajero[v.typePax],function (indexTasa,tasa) {
                        tasasVueltas.push({
                            key:tasa.key,
                            value:0
                        });
                    })
                    objectEnviar.seleccionVuelo[tipoPasajero].vuelta.tasas = tasasVueltas;






                }else{//si no tiene se le manda la plantilla del objecto


                    objectEnviar.seleccionVuelo[tipoPasajero].vuelta = {
                        precioBase: 0,
                        tasas: 		{}

                    };

                }
            });


            //agregamos plantillas a los objetos que faltan de los tipos de pasajeros esta parte es una mamada
            if(objectEnviar.seleccionVuelo.adulto == undefined){
                objectEnviar.seleccionVuelo.adulto = {
                    num: 			0,
                    ida:{
                        precioBase: 0,
                        tasas: 		[]
                    },
                    vuelta:{
                        precioBase: 0,
                        tasas: 		[]
                    },
                    precioTotal: 		0,
                    formattedPrecioTotal: "0.00"
                };
            }
            if(objectEnviar.seleccionVuelo.ninho == undefined){
                objectEnviar.seleccionVuelo.ninho = {
                    num: 			0,
                    ida:{
                        precioBase: 0,
                        tasas: 		[]
                    },
                    vuelta:{
                        precioBase: 0,
                        tasas: 		[]
                    },
                    precioTotal: 		0,
                    formattedPrecioTotal: "0.00"
                };
            }
            if(objectEnviar.seleccionVuelo.infante == undefined){
                objectEnviar.seleccionVuelo.infante = {
                    num: 			0,
                    ida:{
                        precioBase: 0,
                        tasas: 		[]
                    },
                    vuelta:{
                        precioBase: 0,
                        tasas: 		[]
                    },
                    precioTotal: 		0,
                    formattedPrecioTotal: "0.00"
                };
            }

            if(objectEnviar.seleccionVuelo.adultoMayor == undefined){
                objectEnviar.seleccionVuelo.adultoMayor = {
                    num: 			0,
                    ida:{
                        precioBase: 0,
                        tasas: 		[]
                    },
                    vuelta:{
                        precioBase: 0,
                        tasas: 		[]
                    },
                    precioTotal: 		0,
                    formattedPrecioTotal: "0.00"
                };
            }


            objectEnviar.seleccionVuelo.vuelosIda = [];
            //agregamos los vuelos de ida a nuestro arreglo para enviar
            $.each(scope.store.vuelosIda[scope.opcionIdaSeleccionado].vuelos,function (indexVueloIda,dato) {


                objectEnviar.seleccionVuelo.vuelosIda.push({
                    horaSalida: ("00"+dato.horaSalida.hh).slice(-2) + ("00"+dato.horaSalida.mm).slice(-2),
                    horaLlegada: ("00"+dato.horaLlegada.hh).slice(-2) + ("00"+dato.horaLlegada.mm).slice(-2),

                    numVuelo:dato.num_vuelo,
                    tipoAvion:dato.tipo_avion,
                    fechaSalida:dato.fecha_salida,
                    fareCode:tarifas[0].TarifaPersoCombinabilityID[0].fare_code,
                    clase:tarifas[0].TarifaPersoCombinabilityID[0].clases,
                    origen:dato.origen,
                    destino:dato.destino,
                    operador:dato.co_operador
                })

            });


            if (scope.store.tieneVuelta == true){
                //mandamos vuelos vuelta al objeto
                objectEnviar.seleccionVuelo.vuelosVuelta = [];
                //agregamos los vuelos de ida a nuestro arreglo para enviar
                $.each(scope.store.vuelosVuelta[scope.opcionVueltaSeleccionado].vuelos,function (indexVueloVuelta,dato) {


                    objectEnviar.seleccionVuelo.vuelosVuelta.push({
                        horaSalida: ("00"+dato.horaSalida.hh).slice(-2) + ("00"+dato.horaSalida.mm).slice(-2),
                        horaLlegada: ("00"+dato.horaLlegada.hh).slice(-2) + ("00"+dato.horaLlegada.mm).slice(-2),

                        numVuelo:dato.num_vuelo,
                        tipoAvion:dato.tipo_avion,
                        fechaSalida:dato.fecha_salida,
                        fareCode:tarifas[0].TarifaPersoCombinabilityID[0].fare_code,
                        clase:tarifas[0].TarifaPersoCombinabilityID[0].clases,
                        origen:dato.origen,
                        destino:dato.destino,
                        operador:dato.co_operador
                    })

                });
            }




            var seleccionVuelo = {};

            scope.objectEnviar = objectEnviar;


            if(DIRECCIONAR == false || DIRECCIONAR == undefined || DIRECCIONAR == ''){
                /*ajaxRequest(
                    BoA.urls["validate_flight_selection_service"],
                    asyncValidateSeleccionVuelo,
                    "POST", objectEnviar);*/
                asyncValidateSeleccionVuelo({success:true});

                $(that).hide();
                $(".cell-submit").html('<div onclick="validatePassengers()" id="btn_validar_pasajeros" class="button" >'+translate.t.REALIZAR_PAGO+'</div>');


            }else{
                //mandamos a otro lado
                window.location.replace(BoA.urls.itinerario);

            }



        },
        //cuando no mandamos nada en tbl este sera falso y ocultara las dos selecciones
        resetearSeleccion:function (tbl) {



            if(tbl == undefined || tbl == false){
                $("#tbl_seleccion_ida").hide();
                $("#tbl_seleccion_vuelta").hide();
            }else{
                $("#"+tbl).hide();
            }


            if(vuelosDibujador.store != undefined){
                if ($("#tbl_seleccion_ida").is(':visible') == false && $("#tbl_seleccion_vuelta").is(':visible') == false) {

                    $("#salidasHeaderFamilias").append(vuelosDibujador.dibujarHeaderFamilias('salidas'));
                    vuelosDibujador.dibujarVuelos('salidas',vuelosDibujador.store);

                    if(vuelosDibujador.store.tieneVuelta == true){
                        $("#llegadasHeaderFamilias").append(vuelosDibujador.dibujarHeaderFamilias('llegadas'));
                        vuelosDibujador.dibujarVuelos('llegadas',vuelosDibujador.store);
                    }

                    $("#div_empty_vuelo").show()
                }
            }




        },
        resetearVista:function () {


            $(".cell-submit").empty();
            $("#precio_adulto").html(0);
            $("#precio_ninho").html(0);
            $("#precio_infante").html(0);
            $("#tooltip_tasas").empty();
            $("#totalTasas").html(0);

            $("#precio_adultoMayor").html(0);



            flapperTotal.val(0).change();


            vuelosDibujador.familiaIdaSeleccionado ='';
            vuelosDibujador.opcionIdaSeleccionado = '';

            vuelosDibujador.familiaVueltaSeleccionado ='';
            vuelosDibujador.opcionVueltaSeleccionado = '';


        },
        buscarOpcionConTarifa:function (opcion,ida_vuelta) {
            //cuando ida_vuelta es vuelosVuelta entonces estamos buscando para la ida
            //cuando ida_vuelta es vuelosIda entonces estamos buscando para la vuelta


            var scope = this;
            var opcionIndice = opcion;
            var vuelos = this.store[ida_vuelta];

            var array = [];
            $.each(vuelos,function (index,obj) {

                if(ida_vuelta == 'vuelosVuelta'){
                    var combinacion = scope.store.vueloMatriz[opcion+'-'+index];

                    if(combinacion.tarifas.length > 0){
                        array.push(opcion+'-'+index);
                    }
                }else if(ida_vuelta == 'vuelosIda'){
                    var combinacion = scope.store.vueloMatriz[index+'-'+opcion];

                    if(combinacion.tarifas.length > 0){
                        array.push(index+'-'+opcion);
                    }
                }



            })

            return array;

        },
        ordenarVuelos:function (combo) {

            var $combo = $(combo);
            var tipoIdaVuelta = $combo.data("tipo");//es el nombre del contenedor de salidas o de llegadas
            var $contenedor = $("#"+tipoIdaVuelta);


            $contenedor.css({"display":"flex","flex-direction":"column"});

            //obtener los div de vuelos content_vuelo
            var $contentVuelos = $contenedor.find('.content_vuelo');
            $contentVuelos.sort(function (a,b) {

                return parseInt($(a).data($combo.val()))-parseInt($(b).data($combo.val()))
            });
            $contentVuelos.each(function (index) {
                var id = $(this).attr("id");

                $(this).css({"order":index});
                $("#"+id+"_detalle").css({"order":index});
            });


        },
        verTipoDestino : function (destino) {


            if(['CCA','CIJ','CBB','LPB','ORU','POI','VVI','SRE','TJA','TDD','UYU','BYC'].includes(destino)){
                return 'NAL'
            }else if(destino === 'MAD'){
                return 'MAD'
            }else if(destino === 'EZE' || destino == 'SLA'){
                return 'MAD'
            }else if(destino === 'MIA'){
                return 'MIA'
            }else if(destino === 'GRU'){
                return 'SAO'
            }
        }
        
    };






    iconSvg = {

        convertirFigureSvg : function (idjQuery,vuelo) {



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




                    var duracion = {horas:0,minutos:0};
                    for(var i=0;i<vuelo.vuelos.length;i++) {
                        var flight = vuelo.vuelos[i];
                        var nivel = i+1;

                        var timeStrSalida = formatTime(flight.horaSalida);
                        var timeStrLlegada = formatTime(flight.horaLlegada);
                        $("#"+idjQuery).children('svg').find('[data="salida'+nivel+'"]').empty().append(flight.origen);
                        $("#"+idjQuery).children('svg').find('[data="llegada'+nivel+'"]').empty().append(flight.destino);
                        $("#"+idjQuery).children('svg').find('[data="lineaVuelo'+nivel+'"]').empty().append(flight.co_operador+""+flight.num_vuelo);
                        $("#"+idjQuery).children('svg').find('[data="operado'+nivel+'"]').empty().append(operadorSvg(flight.co_operador));
                        $("#"+idjQuery).children('svg').find('[data="horaSalida'+nivel+'"]').empty().append(timeStrSalida);
                        $("#"+idjQuery).children('svg').find('[data="horaLlegada'+nivel+'"]').empty().append(timeStrLlegada);




                        if(nivel==1){
                            $("#"+idjQuery).children('svg').find('[data="aeropuertoSalida'+nivel+'"]').empty().append(separarAeropuertoSvg(airports[flight.origen]));
                        }else{
                            $("#"+idjQuery).children('svg').find('[data="aeropuertoSalida'+nivel+'"]').empty();

                        }


                        $("#"+idjQuery).children('svg').find('[data="aeropuertoLlegada'+nivel+'"]').html(separarAeropuertoSvg(airports[flight.destino]));
                        $("#"+idjQuery).children('svg').find('[data="duracion'+nivel+'"]').empty().append(flight.tiempoVuelo.Hrs +" hrs , "+flight.tiempoVuelo.Mins+" mins.");





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
                        $("#"+idjQuery).children('svg').find('[data="transito1"]').empty().append(transito.Str);

                        //agregamos el tiempo de transito a la duracion
                        duracion.horas = duracion.horas + parseInt(transito.Hrs);
                        duracion.minutos = duracion.minutos + parseInt(transito.Mins);


                    }else if(vuelo.vuelos.length == 3){
                        var hora_llegada_1 = vuelo.vuelos[0].horaLlegada;
                        var hora_salida_2 = vuelo.vuelos[1].horaSalida;

                        var transito = tiempoTransito(hora_llegada_1,hora_salida_2);
                        $("#"+idjQuery).children('svg').find('[data="transito1"]').empty().append(transito.Str);

                        //agregamos el tiempo de transito a la duracion
                        duracion.horas = duracion.horas + parseInt(transito.Hrs);
                        duracion.minutos = duracion.minutos + parseInt(transito.Mins);

                        var hora_llegada_3 = vuelo.vuelos[1].horaLlegada;
                        var hora_salida_4 = vuelo.vuelos[2].horaSalida;

                        var transito2 = tiempoTransito(hora_llegada_3,hora_salida_4);
                        $("#"+idjQuery).children('svg').find('[data="transito2"]').empty().append(transito2.Str);

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
                    $('#'+vuelo.tipo+'_'+vuelo.num_opcion).find(".duracion_total").empty().append(translate.t.DURACION_TOTAL+" : "
                     +((duracion.horas > 0)?duracion.horas+" hrs. ":"")
                     +((duracion.minutos>0)?duracion.minutos+" mins.":" ")
                     );

                    vuelo.duracionTotalVuelo = duracion;





                }, 'xml');






        },

        convertirFigureSvgIcono : function () {

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


                }, 'xml');




            });

        },



    };

})
(jQuery);