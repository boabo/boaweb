/**
 * Created by faviofigueroa on 13/8/17.
 */


(function ($) {


    vuelosStore = {

        vueloMatriz:'',
        tieneIda:false,
        tieneVuelta:false,
        vuelosIda:{},
        vuelosVuelta:{},
        fechaIdaConsultada:'',
        fechaVueltaConsultada:'',

        //funcion para ver si es ida o ida y vuelta
        verIdayVuelta:function (fechaIda,fechaVuelta) {

            if(fechaIda == null || fechaIda == '' ||fechaIda == 'null' || fechaIda == undefined){

                vuelosStore.tieneIda = false;
            }else{
                vuelosStore.tieneIda = true;
                vuelosStore.fechaIdaConsultada = fechaIda;
            }


            if(fechaVuelta == null || fechaVuelta == '' ||fechaVuelta == 'null' || fechaVuelta == undefined){

                vuelosStore.tieneVuelta = false;
            }else{
                vuelosStore.tieneVuelta = true;
                vuelosStore.fechaVueltaConsultada = fechaVuelta;

            }
        },
        armarVuelos : function (object) {

            console.log('object ++',object);

            this.verIdayVuelta(object.fechaIdaConsultada,object.fechaVueltaConsultada);

            console.log(vuelosStore.ida)
            console.log(vuelosStore.vuelta)
            var objectVuelosMatriz = {};



            //recorremos los vuelos de ida
            $.each(object.vuelosYTarifas.Vuelos.ida.Item.vuelo,function (indexIda,ida) {



                var arraIda = [];
                var objIda= {};
                //si ya esta como un objeto es por que la numero de opcion ya esta
                //existe ya un vuelo con la misma opcion asi que debe entrar como conexion
                if(typeof vuelosStore.vuelosIda[ida.num_opcion] === 'object'){

                    vuelosStore.vuelosIda[ida.num_opcion].vuelos.push(ida);


                }else{
                    objIda.vuelos = new Array();
                    objIda.vuelos.push(ida);
                    objIda.num_opcion = ida.num_opcion;
                    objIda.origen = ida.origen;
                    objIda.destino = ida.destino;
                    objIda.num_vuelo = ida.num_vuelo;
                    objIda.tipo_avion = ida.tipo_avion;
                    objIda.co_operador = ida.co_operador;

                    //lo que se necesita
                    objIda.horaSalida = {};
                    objIda.horaSalida.hh = parseInt(ida.hora_salida.substr(0,2));
                    objIda.horaSalida.mm = parseInt(ida.hora_salida.substr(2,2));

                    objIda.horaLlegada = {};
                    objIda.horaLlegada.hh = parseInt(ida.hora_llegada.substr(0,2));
                    objIda.horaLlegada.mm = parseInt(ida.hora_llegada.substr(2,2));

                    objIda.duracionTotal = '0100';

                    vuelosStore.vuelosIda[ida.num_opcion]= objIda;



                }


                console.log(vuelosStore.vuelosIda)







                //verificamos si existe vuelta
                if(vuelosStore.tieneVuelta == true){
                    $.each(object.vuelosYTarifas.Vuelos.vuelta.Item.vuelo,function (indexVuelta,vuelta) {


                        var objVuelta= {};
                        //si ya esta como un objeto es por que la numero de opcion ya esta
                        //existe ya un vuelo con la misma opcion asi que debe entrar como conexion
                        if(typeof vuelosStore.vuelosVuelta[vuelta.num_opcion] === 'object'){

                            vuelosStore.vuelosVuelta[vuelta.num_opcion].vuelos.push(vuelta);


                        }else{

                            objVuelta.vuelos = new Array();
                            objVuelta.vuelos.push(ida);
                            objVuelta.num_opcion = ida.num_opcion;
                            objVuelta.origen = ida.origen;
                            objVuelta.destino = ida.destino;
                            objVuelta.num_vuelo = ida.num_vuelo;
                            objVuelta.tipo_avion = ida.tipo_avion;
                            objVuelta.co_operador = ida.co_operador;

                            //lo que se necesita
                            objVuelta.horaSalida = {};
                            objVuelta.horaSalida.hh = parseInt(ida.hora_salida.substr(0,2));
                            objVuelta.horaSalida.mm = parseInt(ida.hora_salida.substr(2,2));

                            objVuelta.horaLlegada = {};
                            objVuelta.horaLlegada.hh = parseInt(ida.hora_llegada.substr(0,2));
                            objVuelta.horaLlegada.mm = parseInt(ida.hora_llegada.substr(2,2));

                            objVuelta.duracionTotal = '0100';

                            vuelosStore.vuelosVuelta[objVuelta.num_opcion]= objVuelta;


                        }




                        var objectAux = {};
                        console.log('opcion vuelta ', vuelta.num_opcion);

                        objectAux.ida = ida;
                        objectAux.vuelta = vuelta;



                        //VALIDAMOS QUE SEA ARRAY SI NO DEBEMOS CONVERTILO
                        if (!Array.isArray(object.vuelosYTarifas.Tarifas.TarifaPersoCombinabilityIdaVueltaShort)){

                            var arrayTarifaPersoCombinabilityIdaVueltaShort = [];
                            arrayTarifaPersoCombinabilityIdaVueltaShort.push(object.vuelosYTarifas.Tarifas.TarifaPersoCombinabilityIdaVueltaShort);

                            object.vuelosYTarifas.Tarifas.TarifaPersoCombinabilityIdaVueltaShort = arrayTarifaPersoCombinabilityIdaVueltaShort;

                        }

                        //combinacion de tarifas
                        var arrayTarifasAux = [];
                        $.each(object.vuelosYTarifas.Tarifas.TarifaPersoCombinabilityIdaVueltaShort,function (indexTarifas,tarifa) {

                            //combinacion de ivs
                            $.each(tarifa.IVs.IV,function (indexIv,iv) {

                                //buscamos el iv
                                var objectTarifasAux = {};

                                //si es ida y vuelta la consulta
                                if(iv.I == ida.num_opcion && iv.V == vuelta.num_opcion){

                                    objectTarifasAux.FI = tarifa.FI;
                                    objectTarifasAux.FV = tarifa.FV;
                                    objectTarifasAux.totalAmount = tarifa.totalAmount;
                                    objectTarifasAux.totalTaxes = tarifa.totalTaxes;
                                    objectTarifasAux.iv = iv;
                                    objectTarifasAux.TarifaPersoCombinabilityID = tarifa.TarifasPersoCombinabilityID.TarifaPersoCombinabilityID;
                                    objectTarifasAux.TasaTipoPasajero = object.tasaTipoPasajero.ArrayOfTasaTipoPasajero[indexTarifas];
                                    arrayTarifasAux.push(objectTarifasAux);

                                }
                            });
                        });

                        objectAux.tarifas = arrayTarifasAux;

                        //agregamos al objeto
                        objectVuelosMatriz[ida.num_opcion+'-'+vuelta.num_opcion] = objectAux;



                    });
                }else{
                    //solo tiene ida
                    var objectAux = {};
                    objectAux.ida = ida;
                    objectAux.vuelta = null;


                    //combinacion de tarifas
                    var arrayTarifasAux = [];
                    $.each(object.vuelosYTarifas.Tarifas.TarifaPersoCombinabilityIdaVueltaShort,function (indexTarifas,tarifa) {

                        //VALIDAMOS QUE SEA ARRAY SI NO DEBEMOS CONVERTILO
                        if (!Array.isArray(tarifa.IVs.IV)){

                            var arrayIv = [];
                            arrayIv.push(tarifa.IVs.IV);

                            tarifa.IVs.IV = arrayIv;

                        }

                        //combinacion de ivs
                        $.each(tarifa.IVs.IV,function (indexIv,iv) {

                            //buscamos el iv
                            var objectTarifasAux = {};

                            //si es ida y vuelta la consulta
                            if(iv.I == ida.num_opcion && iv.V == 0){

                                objectTarifasAux.FI = tarifa.FI;
                                objectTarifasAux.FV = tarifa.FV;
                                objectTarifasAux.totalAmount = tarifa.totalAmount;
                                objectTarifasAux.totalTaxes = tarifa.totalTaxes;
                                objectTarifasAux.iv = iv;
                                objectTarifasAux.TarifaPersoCombinabilityID = tarifa.TarifasPersoCombinabilityID.TarifaPersoCombinabilityID;

                                objectTarifasAux.TasaTipoPasajero = object.tasaTipoPasajero.ArrayOfTasaTipoPasajero[indexTarifas];
                                arrayTarifasAux.push(objectTarifasAux);

                            }
                        });
                    });

                    objectAux.tarifas = arrayTarifasAux;

                    //agregamos al objeto
                    objectVuelosMatriz[ida.num_opcion+'-0'] = objectAux;



                }





            });


           // console.log('1-1',objectVuelosMatriz['1-1'])
           // console.log(objectVuelosMatriz)

            vuelosStore.vueloMatriz = objectVuelosMatriz;
        }
    };

})
(jQuery);
