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
        store:'',
        iniciarDibujador:function (store) {
            vuelosDibujador.store = store;
        },
        dibujarHeaderFamilias: function (familias,tipo) {

            if(tipo == 'salidas'){
                var m = '<div id="salidas_" style="width: 100%; ">\n    <div style="display: block; height: 20px;">\n        <div style="width: 60%; float: left">TIPOS</div>\n        <div style="width: 40%; float: left">\n            <div style="float: left;width: 33%; text-align: center; background-color: #333333; color:#fff;">F1</div>\n            <div style="float: left;width: 33%; text-align: center; background-color: #333333; color:#fff;">F1</div>\n            <div style="float: left;width: 33%; text-align: center; background-color: #333333; color:#fff;">F1</div>\n        </div>\n    </div>\n    \n</div>';

            }else if(tipo == 'llegadas'){
                var m = '<div id="llegadas_" style="width: 100%; ">\n    <div style="display: block; height: 20px;">\n        <div style="width: 60%; float: left">TIPOS</div>\n        <div style="width: 40%; float: left">\n            <div style="float: left;width: 33%; text-align: center; background-color: #333333; color:#fff;">F1</div>\n            <div style="float: left;width: 33%; text-align: center; background-color: #333333; color:#fff;">F1</div>\n            <div style="float: left;width: 33%; text-align: center; background-color: #333333; color:#fff;">F1</div>\n        </div>\n    </div>\n    \n</div>';

            }
            return m;
        },
        dibujarVuelos:function (tipo,store) {

            var m ='';
            var tabla = tipo+"_";

            var ida_vuelta = '';
            var familiaTipoidaVuelta = '';
            var disponibilidadTipoidaVuelta = '';
            if(tipo == "salidas"){

                ida_vuelta = "vuelosIda";
                familiaTipoidaVuelta = "FI";
                disponibilidadTipoidaVuelta = "IDisponibility";

            }else if (tipo == "llegadas"){

                ida_vuelta = "vuelosVuelta";
                familiaTipoidaVuelta = "FV";
                disponibilidadTipoidaVuelta = "VDisponibility";


            }
            var vuelos = store[ida_vuelta];
            $.each(vuelos,function (k,v) {

                console.log(formatTime(v.horaLlegada))
                console.log('v',v)
                m = $('<div onclick="vuelosDibujador.seleccionarTarifa(this)" id="'+ida_vuelta+'_'+v.num_opcion+'" data-opcion="'+v.num_opcion+'" data-tipo="'+ida_vuelta+'" style="display: block; height:80px; cursor: pointer;">\n    <div style="width: 60%;  float: left; margin-top: 12px;">\n        <div style="float: left;width: 25%; text-align: center; border-left: 2px solid #EFAA35;">\n            <span>SALIDA</span>\n            <div><b>'+formatTime(v.horaSalida)+' '+v.origen+'</b></div>\n            <div style="display: block; margin-top: 5px;" onclick="vuelosDibujador.verDetalleConexion(this)"\n                 class="btn_view_detail"><span></span>Detalle\n            </div>\n        </div>\n        <div style="float: left;width: 25%; text-align: center;">\n            <div class="ico_sin_conexion"></div><span><label class="duracion_total">Duración Total :<br> 1 hora</label></span>\n        </div>\n        <div style="float: left;width: 25%; text-align: center;">\n            <span>LLEGADA</span><div><b>'+formatTime(v.horaLlegada)+' '+v.destino+'</b></div>\n        </div>\n        <div style="float: left;width: 23%; text-align: center;">\n            <span><label>Operado por:</label></span><br><div class="ico_boa"><span style="bottom:-18px;position:relative;">BoA</span></div>\n        </div>\n    </div>\n</div>');

                var opcion_vuelo_indice ='';
                //no tiene vuelta entonces dibujamos directamente con sus opciones y vuelta como cero ej: 1-0
                if(ida_vuelta == "vuelosIda"){
                    if(store.tieneVuelta == false){


                        //cuando es la primera entra aca para dibujar
                        opcion_vuelo_indice = v.num_opcion+'-'+0;
                        console.log(store.vueloMatriz[opcion_vuelo_indice]);


                    }else{
                        opcion_vuelo_indice = v.num_opcion+'-'+1;
                    }
                }else if(ida_vuelta == "vuelosVuelta"){
                    if(vuelosDibujador.opcionIdaSeleccionado != ''){
                        opcion_vuelo_indice = vuelosDibujador.opcionIdaSeleccionado+'-'+v.num_opcion;
                    }else{
                        opcion_vuelo_indice = v.num_opcion+'-'+v.num_opcion;
                    }

                }


                //buscaremos sus distinatas tarifas por familias
                var FamiliasImportes = $('<div style="width: 40%; float: left; ">\n</div>');

                var objectAux = {};
                $.each(store.vueloMatriz[opcion_vuelo_indice].tarifas, function (indexTarifa, tarifa) {


                    var importe = tarifa.TarifaPersoCombinabilityID.importe;
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

                    objectAux[tarifa[familiaTipoidaVuelta]] = '<div style="float: left;width: 32%; text-align: center; background-color: #f1f1f1; color:#fff; height: 50px; padding-top: 28px; color: #333333; border: 1px solid #fff;font-size: 15px;"><b>' + importe + ' ' + HTML_CURRENCIES[CURRENCY] + '</b><br><span class="'+clase_disponibilidad+'">'+disponibilidad+' Asientos</span></div>';


                });
                $.each(vuelosDibujador.familyInformation,function (indexFamilia,familia) {

                    if (objectAux[familia.refNumber] != undefined){

                        FamiliasImportes.append(objectAux[familia.refNumber]);

                    }else{
                        FamiliasImportes.append('<div style="float: left;width: 32%; text-align: center; background-color: #cccccc; color:#fff; height: 50px; padding-top: 28px; color: #333333; border: 1px solid #fff;font-size: 15px;"><b>No<br> Disponible</b></div>');
                    }


                });

                m.append(FamiliasImportes);



                //dibujamos en la tabla un vuelo por vuelo
                $("#"+tabla).append(m);
                $("#"+tabla).append('<div id="'+ida_vuelta+'_'+v.num_opcion+'_detalle" style="background:#EFAA35;width: 100%;height: 200px;" class="tiempo_vuelo Detalle_cerrado"></div>');


                cargarDetalleVueloSvg(v,v.vuelos.length,''+ida_vuelta+'_'+v.num_opcion+'_detalle');
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

            var opcion = $(that).data('opcion');
            var tipo = $(that).data('tipo');
            var opcion_vuelo_indice;

            var filtros_opciones = [];
            //el seleccionado es ida
            if(tipo == "vuelosIda"){

                console.log(vuelosDibujador.store.vuelosVuelta)
                if(vuelosDibujador.store.tieneVuelta == true){

                    $("#llegadas_").empty();
                    vuelosDibujador.opcionIdaSeleccionado = opcion;
                    vuelosDibujador.dibujarVuelos('llegadas',vuelosDibujador.store);
                }
               /* $.each(vuelosDibujador.store.vuelosVuelta,function (k,v) {

                    var objAux = {
                        opcion_vuelo_indice:opcion+'-'+v.num_opcion
                    };
                    filtros_opciones.push(objAux);

                    if(vuelosDibujador.store.tieneVuelta == true){

                        console.log(vuelosDibujador.store.vueloMatriz[opcion+'-'+v.num_opcion])
                    }
                });*/

            }
            console.log(filtros_opciones);
        }
    };
})
(jQuery);