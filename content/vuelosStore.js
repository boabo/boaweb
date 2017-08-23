/**
 * Created by faviofigueroa on 13/8/17.
 */


(function ($) {


    vuelosStore = {
        diferenciaHoraria:{

            'CBB-MAD':[{
                valor:6,
                tipo:"-"
            }],
            'MAD-CBB':[{
                valor:6,
                tipo:"+"
            }],
            'VVI-MAD':[{
                valor:6,
                tipo:"-"
            }],
        },
        vueloMatriz: '',
        tieneIda: false,
        tieneVuelta: false,
        vuelosIda: {},
        vuelosVuelta: {},
        fechaIdaConsultada: '',
        fechaVueltaConsultada: '',
        familyInformation:'',
        //funcion para ver si es ida o ida y vuelta
        verIdayVuelta: function (fechaIda, fechaVuelta) {
            var that = this;

            if (fechaIda == null || fechaIda == '' || fechaIda == 'null' || fechaIda == undefined) {

                that.tieneIda = false;
            } else {
                that.tieneIda = true;
                that.fechaIdaConsultada = fechaIda;
            }


            if (fechaVuelta == null || fechaVuelta == '' || fechaVuelta == 'null' || fechaVuelta == undefined) {

                that.tieneVuelta = false;
            } else {
                that.tieneVuelta = true;
                that.fechaVueltaConsultada = fechaVuelta;

            }
        },
        armarVuelos: function (object) {

            var that = this;

            console.log('object ++', object);

            this.familyInformation = object.vuelosYTarifas.familyInformation.FamilyInformation;
            this.verIdayVuelta(object.fechaIdaConsultada, object.fechaVueltaConsultada);


            var objectVuelosMatriz = {};

            //recorremos los vuelos de ida
            $.each(object.vuelosYTarifas.Vuelos.ida.Item.vuelo, function (indexIda, ida) {


                var arraIda = [];

                //si ya esta como un objeto es por que la numero de opcion ya esta
                //existe ya un vuelo con la misma opcion asi que debe entrar como conexion
                if (typeof that.vuelosIda[ida.num_opcion] === 'object') {
                    var objIda = {};
                    //lo que se necesita
                    objIda.horaSalida = {};
                    objIda.horaSalida.hh = parseInt(ida.hora_salida.substr(0, 2));
                    objIda.horaSalida.mm = parseInt(ida.hora_salida.substr(2, 2));
                    ida.horaSalida = objIda.horaSalida;



                    objIda.horaLlegada = {};
                    objIda.horaLlegada.hh = parseInt(ida.hora_llegada.substr(0, 2));
                    objIda.horaLlegada.mm = parseInt(ida.hora_llegada.substr(2, 2));
                    ida.horaLlegada = objIda.horaLlegada;

                    //calculamos el tiempo del vuelo
                    ida.tiempoVuelo = tiempoTransito(objIda.horaSalida,objIda.horaLlegada);
                    //cuando llega al dia siguiente
                    if(ida.variacion_tiempo == "1"){
                        var tipo_operacion = that.diferenciaHoraria[ida.origen+'-'+ida.destino][0].tipo;
                        var valor = parseInt(that.diferenciaHoraria[ida.origen+'-'+ida.destino][0].valor);
                        var str = ida.tiempoVuelo.Hrs + tipo_operacion + valor+"";
                        ida.tiempoVuelo.Hrs = eval(str);
                    }

                    that.vuelosIda[ida.num_opcion].vuelos.push(ida);

                    //CAMBIAMOS su destino por que tiene conexion
                    that.vuelosIda[ida.num_opcion].destinoVuelo = ida.destino;
                    that.vuelosIda[ida.num_opcion].horaLlegadaVuelo = objIda.horaLlegada;


                } else {
                    var objIda = {};
                    objIda.num_opcion = ida.num_opcion;
                    objIda.origenVuelo = ida.origen;
                    objIda.destinoVuelo = ida.destino;
                    objIda.num_vuelo = ida.num_vuelo;
                    objIda.tipo_avion = ida.tipo_avion;
                    objIda.co_operador = ida.co_operador;
                    objIda.linea = ida.linea;

                    //lo que se necesita
                    objIda.horaSalida = {};
                    objIda.horaSalida.hh = parseInt(ida.hora_salida.substr(0, 2));
                    objIda.horaSalida.mm = parseInt(ida.hora_salida.substr(2, 2));
                    ida.horaSalida = objIda.horaSalida;

                    objIda.horaSalidaVuelo = objIda.horaSalida;

                    objIda.horaLlegada = {};
                    objIda.horaLlegada.hh = parseInt(ida.hora_llegada.substr(0, 2));
                    objIda.horaLlegada.mm = parseInt(ida.hora_llegada.substr(2, 2));
                    ida.horaLlegada = objIda.horaLlegada;

                    objIda.horaLlegadaVuelo = objIda.horaLlegada;


                    //calculamos el tiempo del vuelo
                    ida.tiempoVuelo = tiempoTransito(objIda.horaSalida,objIda.horaLlegada);

                    //cuando llega al dia siguiente
                    if(ida.variacion_tiempo == "1"){
                        var tipo_operacion = that.diferenciaHoraria[ida.origen+'-'+ida.destino][0].tipo;
                        var valor = parseInt(that.diferenciaHoraria[ida.origen+'-'+ida.destino][0].valor);
                        var str = ida.tiempoVuelo.Hrs + tipo_operacion + valor+"";
                        ida.tiempoVuelo.Hrs = eval(str);
                    }

                    objIda.duracionTotal = '0100';

                    objIda.vuelos = new Array();
                    objIda.vuelos.push(ida);

                    objIda.tipo ='vuelosIda';
                    that.vuelosIda[ida.num_opcion] = objIda;


                }


                console.log(that.vuelosIda)


                //verificamos si existe vuelta
                if (that.tieneVuelta == true) {
                    $.each(object.vuelosYTarifas.Vuelos.vuelta.Item.vuelo, function (indexVuelta, vuelta) {


                        var objectAux = {};
                        console.log('opcion vuelta ', vuelta.num_opcion);

                        objectAux.ida = ida;
                        objectAux.vuelta = vuelta;


                        //VALIDAMOS QUE SEA ARRAY SI NO DEBEMOS CONVERTILO
                        if (!Array.isArray(object.vuelosYTarifas.Tarifas.TarifaPersoCombinabilityIdaVueltaShort)) {

                            var arrayTarifaPersoCombinabilityIdaVueltaShort = [];
                            arrayTarifaPersoCombinabilityIdaVueltaShort.push(object.vuelosYTarifas.Tarifas.TarifaPersoCombinabilityIdaVueltaShort);

                            object.vuelosYTarifas.Tarifas.TarifaPersoCombinabilityIdaVueltaShort = arrayTarifaPersoCombinabilityIdaVueltaShort;

                        }

                        //combinacion de tarifas
                        var arrayTarifasAux = [];
                        $.each(object.vuelosYTarifas.Tarifas.TarifaPersoCombinabilityIdaVueltaShort, function (indexTarifas, tarifa) {


                            //VALIDAMOS EL IV QUE SEA ARRAY SI NO DEBEMOS CONVERTILO
                            if (!Array.isArray(tarifa.IVs.IV)) {

                                var arrayIV = [];
                                arrayIV.push(tarifa.IVs.IV);

                                tarifa.IVs.IV = arrayIV;

                            }
                            //combinacion de ivs
                            $.each(tarifa.IVs.IV, function (indexIv, iv) {

                                //buscamos el iv
                                var objectTarifasAux = {};

                                //si es ida y vuelta la consulta
                                if (iv.I == ida.num_opcion && iv.V == vuelta.num_opcion) {

                                    objectTarifasAux.FI = tarifa.FI;
                                    objectTarifasAux.FV = tarifa.FV;
                                    objectTarifasAux.totalAmount = tarifa.totalAmount;
                                    objectTarifasAux.totalTaxes = tarifa.totalTaxes;
                                    objectTarifasAux.iv = iv;

                                    //validamos que sea un array TarifaPersoCombinabilityID
                                    //VALIDAMOS QUE SEA ARRAY SI NO DEBEMOS CONVERTILO
                                    if (!Array.isArray(tarifa.TarifasPersoCombinabilityID.TarifaPersoCombinabilityID)) {
                                        var arrayTarifaPersoCombinabilityID = [];
                                        arrayTarifaPersoCombinabilityID.push(tarifa.TarifasPersoCombinabilityID.TarifaPersoCombinabilityID);
                                        tarifa.TarifasPersoCombinabilityID.TarifaPersoCombinabilityID = arrayTarifaPersoCombinabilityID;

                                    }
                                    //fin validacion

                                    objectTarifasAux.TarifaPersoCombinabilityID = tarifa.TarifasPersoCombinabilityID.TarifaPersoCombinabilityID;
                                    objectTarifasAux.TasaTipoPasajero = object.tasaTipoPasajero.ArrayOfTasaTipoPasajero[indexTarifas];
                                    arrayTarifasAux.push(objectTarifasAux);

                                }
                            });
                        });

                        objectAux.tarifas = arrayTarifasAux;

                        //agregamos al objeto
                        objectVuelosMatriz[ida.num_opcion + '-' + vuelta.num_opcion] = objectAux;


                    });
                } else {
                    //solo tiene ida
                    var objectAux = {};
                    objectAux.ida = ida;
                    objectAux.vuelta = null;


                    //combinacion de tarifas
                    var arrayTarifasAux = [];
                    $.each(object.vuelosYTarifas.Tarifas.TarifaPersoCombinabilityIdaVueltaShort, function (indexTarifas, tarifa) {

                        //VALIDAMOS QUE SEA ARRAY SI NO DEBEMOS CONVERTILO
                        if (!Array.isArray(tarifa.IVs.IV)) {

                            var arrayIv = [];
                            arrayIv.push(tarifa.IVs.IV);

                            tarifa.IVs.IV = arrayIv;

                        }

                        //combinacion de ivs
                        $.each(tarifa.IVs.IV, function (indexIv, iv) {

                            //buscamos el iv
                            var objectTarifasAux = {};

                            //si es ida y vuelta la consulta
                            if (iv.I == ida.num_opcion && iv.V == 0) {

                                objectTarifasAux.FI = tarifa.FI;
                                objectTarifasAux.FV = tarifa.FV;
                                objectTarifasAux.totalAmount = tarifa.totalAmount;
                                objectTarifasAux.totalTaxes = tarifa.totalTaxes;
                                objectTarifasAux.iv = iv;


                                //validamos que sea un array TarifaPersoCombinabilityID
                                //VALIDAMOS QUE SEA ARRAY SI NO DEBEMOS CONVERTILO
                                if (!Array.isArray(tarifa.TarifasPersoCombinabilityID.TarifaPersoCombinabilityID)) {
                                    var arrayTarifaPersoCombinabilityID = [];
                                    arrayTarifaPersoCombinabilityID.push(tarifa.TarifasPersoCombinabilityID.TarifaPersoCombinabilityID);
                                    tarifa.TarifasPersoCombinabilityID.TarifaPersoCombinabilityID = arrayTarifaPersoCombinabilityID;

                                }
                                //fin validacion

                                objectTarifasAux.TarifaPersoCombinabilityID = tarifa.TarifasPersoCombinabilityID.TarifaPersoCombinabilityID;

                                objectTarifasAux.TasaTipoPasajero = object.tasaTipoPasajero.ArrayOfTasaTipoPasajero[indexTarifas];
                                arrayTarifasAux.push(objectTarifasAux);

                            }
                        });
                    });

                    objectAux.tarifas = arrayTarifasAux;

                    //agregamos al objeto
                    objectVuelosMatriz[ida.num_opcion + '-0'] = objectAux;


                }


            });


            if (that.tieneVuelta == true) {
                $.each(object.vuelosYTarifas.Vuelos.vuelta.Item.vuelo, function (indexVuelta, vuelta) {



                    //si ya esta como un objeto es por que la numero de opcion ya esta
                    //existe ya un vuelo con la misma opcion asi que debe entrar como conexion
                    if (typeof that.vuelosVuelta[vuelta.num_opcion] === 'object') {
                        var objVuelta = {};
                        //lo que se necesita
                        objVuelta.horaSalida = {};
                        objVuelta.horaSalida.hh = parseInt(vuelta.hora_salida.substr(0, 2));
                        objVuelta.horaSalida.mm = parseInt(vuelta.hora_salida.substr(2, 2));
                        vuelta.horaSalida = objVuelta.horaSalida;

                        objVuelta.horaLlegada = {};
                        objVuelta.horaLlegada.hh = parseInt(vuelta.hora_llegada.substr(0, 2));
                        objVuelta.horaLlegada.mm = parseInt(vuelta.hora_llegada.substr(2, 2));
                        vuelta.horaLlegada = objVuelta.horaLlegada;

                    //calculamos el tiempo del vuelo
                    vuelta.tiempoVuelo = tiempoTransito(objVuelta.horaSalida,objVuelta.horaLlegada);

                        that.vuelosVuelta[vuelta.num_opcion].vuelos.push(vuelta);
                        //CAMBIAMOS su destino por que tiene conexion
                        that.vuelosVuelta[vuelta.num_opcion].destinoVuelo = vuelta.destino;
                        that.vuelosVuelta[vuelta.num_opcion].horaLlegadaVuelo = objVuelta.horaLlegada;

                    } else {
                        var objVuelta = {};
                        objVuelta.num_opcion = vuelta.num_opcion;
                        objVuelta.origenVuelo = vuelta.origen;
                        objVuelta.destinoVuelo = vuelta.destino;
                        objVuelta.num_vuelo = vuelta.num_vuelo;
                        objVuelta.tipo_avion = vuelta.tipo_avion;
                        objVuelta.co_operador = vuelta.co_operador;
                        objVuelta.linea = vuelta.linea;

                        //lo que se necesita
                        objVuelta.horaSalida = {};
                        objVuelta.horaSalida.hh = parseInt(vuelta.hora_salida.substr(0, 2));
                        objVuelta.horaSalida.mm = parseInt(vuelta.hora_salida.substr(2, 2));
                        vuelta.horaSalida = objVuelta.horaSalida;

                        objVuelta.horaSalidaVuelo = objVuelta.horaSalida;

                        objVuelta.horaLlegada = {};
                        objVuelta.horaLlegada.hh = parseInt(vuelta.hora_llegada.substr(0, 2));
                        objVuelta.horaLlegada.mm = parseInt(vuelta.hora_llegada.substr(2, 2));
                        vuelta.horaLlegada = objVuelta.horaLlegada;

                        objVuelta.horaLlegadaVuelo = objVuelta.horaLlegada;


                         //calculamos el tiempo del vuelo
                        vuelta.tiempoVuelo = tiempoTransito(objVuelta.horaSalida,objVuelta.horaLlegada);


                        objVuelta.duracionTotal = '0100';

                        objVuelta.vuelos = new Array();
                        objVuelta.vuelos.push(vuelta);

                         objVuelta.tipo ='vuelosVuelta';
                        that.vuelosVuelta[objVuelta.num_opcion] = objVuelta;


                    }
                });
            }



            // console.log('1-1',objectVuelosMatriz['1-1'])
            // console.log(objectVuelosMatriz)

            this.vueloMatriz = objectVuelosMatriz;
        }
    };

})
(jQuery);
