// ---------------------= =---------------------

var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';


/***** CONFIG PARAMETERS *****/
var CACHE_DISABLED = false;
var IGNORED_TARIFAS_BY_FARE_CODE = ["SSENIOR"];
var ALLOWED_TARIFAS_BY_ESTADO = ['A'];

var ENABLE_GENDER = false;
// ---------------------= =---------------------
var searchParameters = {
	origen : "", 
	destino : "", 
	fechaIda : "", 
	fechaVuelta : null,
	sitios: 0
};

var waitingForFlightsData = false;

var currentDateIda = "";
var currentDateVuelta = "";

var todayStr = "";
var rawDatesCache = {ida:null,vuelta:null};

var seleccionVuelo = {
	ida: 			null,
	vuelta: 		null, 

	tasasTotales:{

		adulto:{
			tasas:{},
			total:0
		},
		ninho:{
			tasas:{},
			total:0
		},
		infante:{
			tasas:{},
			total:0
		},
		total:0
	},
	adulto: 		{
		num: 			0,
		ida:{
			precioBase: 0,
			tasas: 		{}
		},
		vuelta:{
			precioBase: 0,
			tasas: 		{}
		},
		precioTotal: 		0,
		formattedPrecioTotal: "0.00"
	},
	ninho: 		{
		num: 			0,
		ida:{
			precioBase: 0,
			tasas: 		{}
		},
		vuelta:{
			precioBase: 0,
			tasas: 		{}
		},
		precioTotal: 	0,
		formattedPrecioTotal: "0.00"
	},
	infante:		{
		num: 			0,
		ida:{
			precioBase: 0,
			tasas: 		{}
		},
		vuelta:{
			precioBase: 0,
			tasas: 		{}
		},
		precioTotal: 	0,
		formattedPrecioTotal: "0.00"
	},

    adultoMayor: 		{
        num: 			0,
        ida:{
            precioBase: 0,
            tasas: 		{}
        },
        vuelta:{
            precioBase: 0,
            tasas: 		{}
        },
        precioTotal: 		0,
        formattedPrecioTotal: "0.00"
    },

	// adultosMayores: 0
	precioTotal:    	0
};

var tasasPorPasajero = {
	adulto:  [],
	ninho:   [],
	infante: []
};

var tasas = {ida:{},vuelta:{}};

var selectionConstraints = {};
var disabledBanksMessages = {};

var allOptions = {};

var currencies = {euro:"&euro;", usd:"USD"};

var cities = {
	LPB: "La Paz",
	CIJ: "Cobija",
	CBB: "Cochabamba",
	MAD: "Madrid",
	VVI: "Santa Cruz",
	SRE: "Sucre",
	TJA: "Tarija",
	TDD: "Trinidad",
	EZE: "Buenos Aires",
	BCN: "Barcelona",
	GRU: "Sao Paulo",
	MIA: "Miami"
};

var airports = {
	LPB: "Aeropuerto Internacional El Alto",
	CIJ: "Aeropuerto Capitán Anibal Arab",
	CBB: "Aeropuerto Internacional Jorge Wilstermann",
	MAD: "Aeropuerto Internacional Adolfo Suárez Madrid-Barajas",
	VVI: "Aeropuerto Internacional Viru Viru",
	SRE: "Aeropuerto Juana Azurduy de Padilla",
	TJA: "Aeropuerto Capitán Oriel Lea Plaza",
	TDD: "Aeropuerto Teniente Jorge Henrich Arauz",
	EZE: "Aeropuerto Internacional Ministro Pistarini",
	GRU: "Aeropuerto Internacional de Guarulhos",
	BCN: "Aeropuerto Internacional El Prat",
	CCA: "Aeropuerto Internacional Chimore",
	MIA: "Aeropuerto Internacional Miami",
	POI: "Aeropuerto Capitán Nicolas Rojas",
	BYC: "Aeropuerto Yacuiba"
};

var linea_clase = {

	OB:"ico_boa",
	IB:"ico_iberia"
};
var lineas = {

	OB:"BoA",
	IB:"Iberia"
};
var compartmentNames = {"2":"Business","3":"Econ&oacute;mica"};

var contadorNuevaPeticion = 0;

var menor_tarifa_ida = 0;
var menor_tarifa_vuelta = 0;

var reserva_redirect = false;


var validacion_ = {
    nit: {
        numericality: {
            onlyInteger: true,
            message:"Solo numero campeon",
        },

    }
};
var vuelos_store;

var arraySelectPass = ["","one","two","three","four","five","six","seven","nine"];



// ---------------------= =---------------------
/********************************************************* 
 ********************** UI HANDLERS **********************
 **********************************************************/
$(document).on('ready',function()
{

	//traducimos los elementos html que estan quemados en la vista
	translate.traducir($(this));


    //(function(a){a.fn.validCampos=function(b){a(this).on({keypress:function(a){var c=a.which,d=a.keyCode,e=String.fromCharCode(c).toLowerCase(),f=b;(-1!=f.indexOf(e)||9==d||37!=c&&37==d||39==d&&39!=c||8==d||46==d&&46!=c)&&161!=c||a.preventDefault()}})}})(jQuery);
    iconSvg.convertirFigureSvgIcono();

	setTimeout(function () {
        $("#ui_reserva_vuelos").removeClass("blured");
		showSimpleDialog('Actualmente está inactivo <br> Puede iniciar una nueva búsqueda.',BoA.defaultURLAfterFail);
    },TIME_END * 1000);

	function pagarReserva(that) {
        var self = this;
		if(that == undefined){
            var self = this;

        }else{
            var self = $("#pagar_reserva")[0];
		}



        $(self).empty().append('<b class="button" style="position: static;">'+translate.t.PAGAR_RESERVA+'</b>');

        if ($(self).hasClass("activado")) {
            $(self).removeClass("activado");

            $("#contenedor_pagar").hide("slide", function () {
                $("#cod_reserva").css({"margin-top": "30px"});
                $(self).siblings('td').show();
            });


            $("#razon_social").val('');
            $("#nit").val('');

        } else {

            $(self).addClass("activado");
            $(self).empty().append('x '+translate.t.PAGAR_RESERVA+'');
            $(self).siblings('td').hide("slow", function () {
                $("#contenedor_pagar").show("slide");
                $("#cod_reserva").css({"margin-top": "0px"});


            });


        }

    }
	if (VISTAPAGOS == true ){
		$("#info_pago_bancos").show();
        $("#info_pago_bancos").css({"left":0});

        $("#info_resultados_vuelos").hide();
        $("#widget_resumen_reserva").hide();


        //para mostrar los medios de pagos directamente

		pagarReserva(false);

		$(".stages").find('.active').removeClass('active');
		$("#stage_compra").addClass('active');

		$("#widget_cambiar_vuelo").hide();

	}else{

        loadingBoa.cargarBoa();

        vuelos_store = Object.create(vuelosStore);

        $("#btn_borrar_ida").click(function () {

            var tipo = 'vuelosIda';
            vuelosDibujador.familiaIdaSeleccionado ='';
            vuelosDibujador.opcionIdaSeleccionado = '';

            vuelosDibujador.familiaVueltaSeleccionado ='';
            vuelosDibujador.opcionVueltaSeleccionado = '';

            vuelosDibujador.resetearSeleccion('tbl_seleccion_ida');
            vuelosDibujador.resetearVista();

            $('body').find('.'+tipo+'_seleccionado').removeClass(tipo+'_seleccionado')

        });
        $("#btn_borrar_vuelta").click(function () {

            var tipoVuelta = 'vuelosVuelta';
            vuelosDibujador.familiaVueltaSeleccionado ='';
            vuelosDibujador.opcionVueltaSeleccionado = '';
            vuelosDibujador.resetearSeleccion('tbl_seleccion_vuelta');
            vuelosDibujador.resetearVista();
            $('body').find('.'+tipoVuelta+'_seleccionado').removeClass(tipoVuelta+'_seleccionado')

        });




        $('#razon_social').validCampos(' abcdefghijklmnñopqrstuvwxyzáéiou');
        $('#nit').validCampos('1234567890');


        if(reserva_redirect == true){

            $("#pagar_reserva").addClass("activado");
            $("#pagar_reserva").empty().append('x '+translate.t.PAGAR_RESERVA+'');
            $("#pagar_reserva").siblings('td').hide("slow",function () {
                $("#contenedor_pagar").show("slide");
                $("#cod_reserva").css({"margin-top":"0px"});


            });
            $("#info_registro_pasajeros").removeClass("active");
            $("#stage_registro").removeClass("active");
            $("#widget_resumen_reserva").hide();
            $("#info_pago_bancos").addClass("active");
            $("#stage_compra").addClass("active");
        }else {


            contadorNuevaPeticion = 0;
            if ($("#ui_reserva_vuelos").data("mode") != "widget") {
                initialize_header(true);
                initialize_ui_sections({anchor_section_headers: false});
            }


            $("#tbl_salida").find("tr").not(":first").remove(); // clear table results
            $("#tbl_regreso").find("tr").not(":first").remove(); // clear table results


            todayStr = formatCompactDate(new Date()); // today

			/*----------= UI SETUP HANDLERS =-----------*/
            $("#widget_cambiar_vuelo #btn_cambiar_vuelo").click(toggleWidgetCambiarVuelo);
            $("#widget_cambiar_vuelo .form .radio-button").click(toggleRbtnIdaVuelta);
            $("#widget_resumen_reserva td.selector-pax ul li").click(changeNumPassengers);
            $("#widget_resumen_reserva td.selector-pax ul").mouseleave(function () {
                if ($(this).hasClass("active"))
                    $(this).removeClass("active");
            });


            $("#btn_buscar_vuelo").click(validateSearch);

            // Initial search of flights
            handleInitialRequest();

            // DATE PICKERs SETUP
            $("#picker_salida").datepicker({
                dateFormat: 'dd MM yy',
                numberOfMonths: 2,
                minDate: 0,
                onSelect: function (selectedDate) {
                    $("#picker_regreso").datepicker("option", "minDate", selectedDate);
                }
            });

            $("#picker_regreso, #picker_estado_vuelo").datepicker({
                dateFormat: 'dd MM yy',
                numberOfMonths: 2,
                minDate: 0
            });

            // support for "font-awesome" icon library
            $(".validable .calendar").datepicker("option", "prevText", '<i class="fa fa-arrow-left"></i>');
            $(".validable .calendar").datepicker("option", "nextText", '<i class="fa fa-arrow-right"></i>');

            $("#btn_volver_vuelos").click(backToFlightStage);
			/* $("#btn_validar_vuelos").click(validateSeleccionVuelo);

			 $("#btn_validar_vuelos2").click(validateSeleccionVuelo);

			 $("#btn_validar_pasajeros").click(validatePassengers);
			 $("#btn_validar_pasajeros2").click(validatePassengers);*/

            // WINDOW SETUP
            $(window).resize(checkResultsTableWidth);
            handleScroll();
            $(window).scroll(handleScroll);

            setInterval(checkSearchWidgetAvailability, 200);

            flapperTotal = $("#precio_total").flapper({
                width: 7,
                align: 'right'
            });

            // Dialog setup
            //$("#simple_dialog .button").click(closeSimpleDialog);








            //controlar el scroll
            $(window).scroll(function () {
                if ($(window).scrollTop() > 140) {
                    //$("#widget_resumen_reserva").css({"position":"fixed","right":"60px"});
                    $("#widget_resumen_reserva").addClass("reserva_fixed");
                    $(".head-tu-vuelo").hide();
                } else {
                    //$("#widget_resumen_reserva").css({"position":"absolute","right":""});
                    $("#widget_resumen_reserva").removeClass("reserva_fixed");
                    $(".head-tu-vuelo").show();
                }
            });
        }



	}


    //pagar reserva

    $("#pagar_reserva").click(pagarReserva);


	//dibuja los bancos
    dibujarBancos(BoA.bancos.debito, "debito");
    dibujarBancos(BoA.bancos.credito, "credito");
    dibujarBancos(BoA.bancos.billetera, "billetera");




}); // init

function dibujarBancos(objeto,titulo){

	$.each(objeto,function (k,v) {
		if(v.visible == true){

			var style= "";
			var clase= "";
			if(v.enabled == false){
				style= "opacity: 0.8;";
				clase = "banco_disabled";

			}else{
				clase = "bancos_";
			}

			var banco = '<div data-mensaje="'+v.mensaje+'" class="'+clase+'" id="'+v.nombre+'" data-dias_para_pagar="'+v.dias_para_poder_pagar+'">'+
				'<img src="'+v.img+'" width="100%">'+
				'</div>';
			$("#"+titulo).append(banco);

			if(v.enabled == true){
				$("#"+v.nombre).click(function () {

					var validado = true;


					//window.open(v.url);
					if($("#nit").val() == ''){
						validado = false;
						$("#nit").css({"border":"1px solid red"});
					}else{
						$("#nit").css({"border":""});
					}

					if($("#razon_social").val() == ''){

						validado = false;
						$("#razon_social").css({"border":"1px solid red"});
					}else{
						$("#razon_social").css({"border":""});
					}

					var mensaje = $("#"+v.nombre).data("mensaje");


					if (validado){
						//aca haces la accion

						if(mensaje == 'undefined'){
							//la funcion go
							if(v.type_ == "POST"){

								//go post
							}else if(v.type_ == "GET"){
								//go get
							}


						}else{
							//mostramos el mensaje
							showSimpleDialog2(mensaje);
						}

					}
				});

			}

		}


	});

}
// ---------------------= =---------------------
function handleScroll(){
	var h = $(this).scrollTop();

	$("#ui_resultados_vuelos .header").css("margin", ((h>50)?(h-50):0)+"px 0 0 0");
	// $("#widget_resumen_reserva").css("margin",((h>145)?(h-35):110)+"px 0 0 0");
}
// ---------------------= =---------------------
function toggleRbtnIdaVuelta()
{
	var par = this.parentNode;
	while(false == $(par).hasClass("form") )
		par = par.parentNode;

	$(par).find(".radio-button").removeClass("checked");
	$(this).addClass("checked");

	if(this.id == "rbtn_ida_vuelta")
		$("#picker_regreso").show();
	else
		$("#picker_regreso").hide();
}
// ---------------------= =---------------------
function changeDay()
{

	loadingBoa.cargarBoa();
    vuelosDibujador.resetearSeleccion();
	vuelosDibujador.resetearVista();


	var table = this;

	while(false == $(table).is("table")) // find parent table
		table = table.parentNode;

	waitingForFlightsData = true;

	var isSalida = ($(table).data("salida_regreso") == "salida");

	$(table).find(".day-selector").removeClass("selected");

	$(this).addClass("selected");

	var selected_date = $(this).data("date");

	if(isSalida){
		currentDateIda = selected_date;
		//fillTableWithLoading($("#tbl_salida")[0]);
	}
	else {
		currentDateVuelta = selected_date;
		//fillTableWithLoading($("#tbl_regreso")[0]);
	}

	var sitios = getSelectedSitesCount();

	requestFlights(currentDateIda, currentDateVuelta,sitios);
}
// ---------------------= =---------------------
function toggleWidgetCambiarVuelo()
{
	if($(this).hasClass("searching")) return;

	var widget = $(this.parentNode);

	if(widget.hasClass("collapsed")) {
		widget.removeClass("collapsed").addClass("expanded");
	} else {
		widget.removeClass("expanded").addClass("collapsed");
	}
}

// ---------------------= =---------------------
function validateSearch()
{

    $("#tabla_tipo").hide();
    $("#totalTasas").html("0");

    var selectOrigen = $("#select_origen");
    var selectDestino = $("#select_destino");
    var rbtnIda = $("#rbtn_ida");
    var rbtnIdaVuelta = $("#rbtn_ida_vuelta");
    var pickerSalida = $("#picker_salida");
    var pickerRegreso = $("#picker_regreso");



	var parms = {
		origen: selectOrigen.val(),
		destino: selectDestino.val(),
		fechaIda: pickerSalida.val(),
		fechaVuelta: pickerRegreso.val(),
		solo_ida: rbtnIda.hasClass("checked")
	};

	// -----= VALIDATION PROCESS =------
	var valid_form = true;

	// origen
	if(parms.origen=="") {
		activate_validation(selectOrigen);
		valid_form = false;
	}

	if(parms.destino=="") {
		activate_validation(selectDestino);
		valid_form = false;
	}

	// same dates or both without selection
	if(parms.origen == parms.destino) {
		activate_validation(selectOrigen);
		activate_validation(selectDestino);

		valid_form = false;
	}

	// fecha de salida (ida)
	if(parms.fechaIda == "") {
		activate_validation(pickerSalida);
		valid_form = false;
	}

	if(false == parms.solo_ida && parms.fechaVuelta=="") {
		activate_validation(pickerRegreso);
		valid_form = false;
	}

	// when no valid data, finish here
	if(false == valid_form){
		setTimeout(function() { $(".validable").removeClass("active"); },1500);
		return;
	}

	// -------= AT THIS POINT, A NEW REQUEST BEGINS =-----------
	searchParameters.origen = parms.origen;
	searchParameters.destino = parms.destino;

	// fecha salida
	var rawDate = pickerSalida.val().split(" ");
	searchParameters.fechaIda = rawDate[2] +""+ MONTHS_LANGUAGE_TABLE[rawDate[1]] +""+ rawDate[0];
	
	// fecha retorno
	if(parms.solo_ida){
		searchParameters.fechaVuelta = null
	} else {
		rawDate = pickerRegreso.val().split(" ");
		searchParameters.fechaVuelta = rawDate[2] +""+ MONTHS_LANGUAGE_TABLE[rawDate[1]] +""+ rawDate[0];
	}


	/*
	 * cuando es presionado nuevamente el calendario
	 *
	 * */
    var table = this;
    if(table.tagName == 'TD'){
        while(false == $(table).is("table")) // find parent table
            table = table.parentNode;

        var isSalida = ($(table).data("salida_regreso") == "salida");

        $(table).find(".day-selector").removeClass("selected");

        $(this).addClass("selected");

        var selected_date = $(this).data("date");

        if(isSalida){
            searchParameters.fechaIda = selected_date;
        }
        else {
            searchParameters.fechaVuelta = selected_date;
        }
    }


    loadingBoa.cargarBoa();
    vuelosDibujador.resetearSeleccion();
    vuelosDibujador.resetearVista();

    vuelosDibujador.familiaIdaSeleccionado ='';
    vuelosDibujador.opcionIdaSeleccionado = '';

    vuelosDibujador.familiaVueltaSeleccionado ='';
    vuelosDibujador.opcionVueltaSeleccionado = '';



    searchParameters.sitios = getSelectedSitesCount();
	requestSearchParameters(searchParameters);

	$("#widget_cambiar_vuelo").removeClass("expanded").addClass("collapsed");
	// remover vuelos seleccionados

}
// ---------------------= =---------------------
// checks if selected passenger numbers don't pass available searched seats
function checkWarningPxNumber() 
{
	// warning icon to show if there 
	var warn = $("#widget_resumen_reserva .warning-icon");

	// CONTINUAR AQUI, PROBAR CAMBIO DE PASAJEROS
	if(getSelectedSitesCount() <= searchParameters.sitios || searchParameters.sitios == 0)
		warn.removeClass("visible");
	else
		warn.addClass("visible");
}
// ---------------------= =---------------------
function checkCompleteSeleccionVuelo()
{
	var btn = $("#btn_validar_vuelos");
	var btn2 = $("#btn_validar_vuelos2");

	var validado_ = false;

	if(currentDateIda != null){
		if(seleccionVuelo.ida == null ||
			(seleccionVuelo.adulto.num == 0 && seleccionVuelo.ninho.num==0 && seleccionVuelo.infante.num==0 )){
			validado_ = false;

		}else{
			validado_ = true;

		}
	}


	if(currentDateVuelta != null){
		if(seleccionVuelo.vuelta == null ||
			(seleccionVuelo.adulto.num == 0 && seleccionVuelo.ninho.num==0 && seleccionVuelo.infante.num==0 )){
			validado_ = false;

		}else{
			validado_ = true;

		}
	}

	if(validado_){
		btn.show();
		btn2.show();
	}else {
		btn.hide();
		btn2.hide();
	}


}

// ---------------------= =---------------------
function changeNumPassengers()
{


	var ul = $(this.parentNode);
	var count = parseInt($(this).data("count"));

	var tipo = $(this.parentNode).data("tipo");

	var counting = ["one","two","three","four","five","six","seven","eight"];



	if(ul.hasClass("active")) {
		ul.removeClass("active");
		var row = $(ul[0].parentNode.parentNode);




		// when change
		if(false == $(this).hasClass("selected")) {
			ul.find("li").attr("class","");
			$(this).addClass("selected");

			// previous options list
			var prev = $(this);
			for(var i=0;i<8;i++){
				prev = prev.prev();
				if(prev.length==0) break;
				prev.addClass("minus-" + counting[i]);
			}

			// next options list
			var next = $(this);
			for(var i=0;i<8;i++){
				next = next.next();
				if(next.length==0) break;
				next.addClass("plus-" + counting[i]);
			}

			// change row status
			if(count==0){
                row.addClass("inactive");

            }else{

                row.removeClass("inactive");

                //validamos si es adulto o ninho o infante para que adulto mayor quitemos su seleccion
                if(tipo == 'adulto' || tipo == 'ninho' || tipo == 'infante'){

                    limpiarSeleccionPorTipo('adultoMayor');
                    $.each(adultoMayorNoAeropuerto,function (k,v) {
                        $('option[value="'+k+'"]').css({"display":""});
                    });

                    
                }else{

                    limpiarSeleccionPorTipo('adulto');
                    limpiarSeleccionPorTipo('ninho');
                    limpiarSeleccionPorTipo('infante');
                    $.each(adultoMayorNoAeropuerto,function (k,v) {
						$('option[value="'+k+'"]').css({"display":"none"});
                    });

                }
			}


			//vemos las cantidades de pasajeros
			getTypeSelectedSitesCount(tipo);

			// calculo de precio a pagar
			seleccionVuelo[tipo].num = count;
			/*updatePriceByTipo(tipo,true);
			checkCompleteSeleccionVuelo();
			checkWarningPxNumber();*/


			if(contadorNuevaPeticion == 1 ){
				contadorNuevaPeticion +=1;
				$('.cell-submit').empty();
				setTimeout(validateSearch, 2500);
			}


			ul.parent().find("span").html($(this).html());
		}
	}else {
		$("#widget_resumen_reserva td.selector-pax ul").removeClass("active");
		if(false == $(this).hasClass("selected"))
			return;

		$(this.parentNode).addClass("active");
	}



	
}

function limpiarSeleccionPorTipo(tipo) {

    $('[data-tipo="'+tipo+'"]').closest('.tarifa').addClass('inactive');
    $('[data-tipo="'+tipo+'"]').find('.selected').removeClass('selected');

    $.each($('[data-tipo="'+tipo+'"]').find('li'),function (k,v) {

        $( v ).attr("class","");

        if (k == 0){
            $(v).addClass('selected');
        }else{
            $(v).addClass('plus-'+arraySelectPass[k]);
        }


    });

}

function validatePassengers()
{


	var divPersonas = $("#div_formulario_personas .persona");


	var pasajeros = {adulto:[],infante:[],ninho:[],adultoMayor:[]};
	var isAllValid = true;
	for(var i=0;i<divPersonas.length;i++) {
		var divPersona = $(divPersonas[i]);
		var persona = {
			nombres : "",
			apellidos : "",
			tipoDocumento : "",
			nroDocumento  : "",
			telefono : "",
			nroViajeroFrecuente: "",
			genero:""
		};

		var tipo = divPersona.attr("data-tipo");

		var isValid = true;


		// nombres
		var tbxNombres = divPersona.find(".nombres");
		if($.trim(tbxNombres.val())=="") {
			isValid = false;
			tbxNombres.parent().addClass("active");
		} else {
			persona["nombres"] = tbxNombres.val();
		}

        if(persona.nombres.length < 2 ) {
            isValid = false;
            showSimpleDialog2('Nombre Incorrecto Tiene que ser mas de dos caracteres');
        }


		// apellidos
		var tbxApellidos = divPersona.find(".apellidos");
		if($.trim(tbxApellidos.val())=="") {
			isValid = false;
			tbxApellidos.parent().addClass('active');
		} else {
			persona["apellidos"] = tbxApellidos.val();
		}


        if(persona.apellidos.length < 2 ) {
            isValid = false;
            showSimpleDialog2('Apellido Incorrecto Tiene que ser mas de dos caracteres');
        }

		// tipo de documento
		var selectTipoDocumento = divPersona.find(".tipo-documento");
		if(selectTipoDocumento.val()=="NONE") {
			isValid = false;
			selectTipoDocumento.parent().addClass('active');
		} else {
			persona["tipoDocumento"] = selectTipoDocumento.val();
		}

		var tbxNroDocumento = divPersona.find(".nro-documento");
        if($.trim(tbxNroDocumento.val()) == "") {
            isValid = false;
            tbxNroDocumento.parent().addClass('active');
        } else {
            persona["nroDocumento"] = tbxNroDocumento.val();
        }

        //VALIDAMOS EL TELEFONO
        var tbxTelefono = divPersona.find(".telefono");
		persona["telefono"] = divPersona.find(".telefono").val();
        if(persona.telefono.length > 24 ) {
            isValid = false;
           showSimpleDialog2('Telefono no tiene que ser mayor a 24 caracters');
        }

		persona["nroViajeroFrecuente"] = divPersona.find(".nro-viajero-frecuente").val();
		if(tipo=='adulto' || tipo=='adultoMayor'){
			var tbxemail = divPersona.find(".email");

			if(isEmail(divPersona.find(".email").val())!=true){
				isValid = false;
				tbxemail.parent().addClass('active');

			}else{
				persona["email"] = divPersona.find(".email").val();

			}

		}

        if( tipo=='adultoMayor'){

            var pickerNacimiento = divPersona.find(".nacimiento");
            if($.trim(pickerNacimiento.val())=="" ) {
                isValid = false;
                pickerNacimiento.parent().addClass('active');
            }

        }


		if(ENABLE_GENDER){
			// nombres
            var tbxGenero = divPersona.find(".genero").val();

            if(tbxGenero == 'NONE' ){
                isValid = false;
                showSimpleDialog2('Genero Invalido');
			}else{
            	persona.genero = divPersona.find(".genero").val();
			}

            console.log('GENEROOOOOO',tbxGenero)
		}



		if(tipo=="infante" || tipo=="ninho" || tipo=="adulto" || tipo=='adultoMayor') {
			var pickerNacimiento = divPersona.find(".nacimiento");
			if($.trim(pickerNacimiento.val())=="" ) {
				isValid = false;
				pickerNacimiento.parent().addClass('active');
			} else {
				var rawDate = pickerNacimiento.val().split(" ");
				var fecha_nacimiento_para_validar = rawDate[2] +"/"+ MONTHS_LANGUAGE_TABLE[rawDate[1]] +"/"+ rawDate[0];

				var edad = edadPasajero(fecha_nacimiento_para_validar);

				//validamos que la edad de infante o nino corresponda a los establecidos
				if(tipo=="infante"){

					if(edad[1] < 8){//si es menor a 8 dias entonces no va

						isValid = false;
						pickerNacimiento.parent().addClass('active');
					}

					if (edad[0] >= 2){ //si es mayor o igual a 2 anios entonces no es infante

						isValid = false;
						pickerNacimiento.parent().addClass('active');
					}

				}else if (tipo=="ninho"){

					if (edad[0] < 2 ){ //si es mayor o igual a 2 anios entonces no es infante

						isValid = false;
						pickerNacimiento.parent().addClass('active');
					}

					if (edad[0] >= 12){ //si es mayor o igual a 2 anios entonces no es infante

						isValid = false;
						pickerNacimiento.parent().addClass('active');
					}

				}
				persona["nacimiento"] = rawDate[2] +""+ MONTHS_LANGUAGE_TABLE[rawDate[1]] +""+ rawDate[0];
			}
		}

		if(isValid)
			pasajeros[tipo].push(persona);
		else {
			divPersona.addClass("invalid");
			setTimeout(function() {
				$("#div_formulario_personas .persona").removeClass("invalid");
				$("#div_formulario_personas .persona .validable").removeClass("active");
			}, 2000);
			isAllValid = false;
		}
	}

	if(isAllValid) { 
		//var selVueloToSend = prepareSeleccionVueloToSend();
		var selVueloToSend = vuelosDibujador.objectEnviar.seleccionVuelo;

		for(var tipo in pasajeros) {
			if(pasajeros[tipo].length==0)
				continue;

			selVueloToSend[tipo]["pasajeros"] = pasajeros[tipo];
		}

		/* PREPARE AND SEND DATA */
		var dataToSend = {
			seleccionVuelo: selVueloToSend
		};

		$("#loading_compra").show();
		$("#loading_compra2").show();

        loadingBoa.cargarBoa();

		ajaxRequest(
			BoA.urls["register_passengers_service"], 
			asyncRegisterPassengers, 
			"POST", dataToSend);


		$("#btn_validar_pasajeros").hide();
		$("#btn_validar_pasajeros2").hide();


		/*tamamos en cuenta el parametro de dias para pagar en ciertos bancos*/
        $.each($("[data-dias_para_pagar]"),function () {

            if($(this).data('dias_para_pagar')>0){
                console.log($(this).data('dias_para_pagar'))
                console.log(vuelos_store.fechaIdaConsultada)

                var year        = vuelos_store.fechaIdaConsultada.substring(0,4);
                var month       = vuelos_store.fechaIdaConsultada.substring(4,6);
                var day         = vuelos_store.fechaIdaConsultada.substring(6,8);

                var date        = new Date(year, month-1, day);
                var currentDate = new Date();

                var timeDiff = Math.abs(date.getTime() - currentDate.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                if(diffDays >= $(this).data('dias_para_pagar')){
                    $(this).addClass('bancos_');
                    $(this).removeClass('banco_disabled');
                }else{
                    $(this).removeClass('bancos_');
                    $(this).addClass('banco_disabled');
                }



            }
        });

	}
}
// ---------------------= =---------------------
function asyncRegisterPassengers(response)
{

	//quitamos el div flotante en caso del mobile
    $("#divFlotante").hide();

	loadingBoa.terminarCargarBoa();
	if(response["success"] == false) {
		showSimpleDialog2(response["msg"]);
		return;
	}

	$("#lbl_codigo_reserva").text(response["pnr"]);

	if (false == BoA.widgetReservas.enableCompraStage) {
		$("#stage_compra").hide();
	} else {
		var banks = {};

		for(var bankKey in response.banks) {
			var prototypeBank = BoA.banks[bankKey];

			if(prototypeBank == null)
				continue;
			var bank = {
				visible: prototypeBank.visible,
				enabled: response.banks[bankKey].enabled,
				url: 	 prototypeBank.url,
				msg: 	 response.banks[bankKey].msg
			};

			banks[bankKey] = bank;
		}

		buildBanks(banks);
	}

	if(BoA.widgetReservas.enableCompraStage) {
		$("#info_registro_pasajeros").removeClass("active");
		$("#info_pago_bancos").addClass("active");

		$("#stage_registro").removeClass("active");
		$("#stage_compra").addClass("active");	

		$("#widget_resumen_reserva").hide();
	} else {
		window.location.replace(BoA.widgetReservas.redirectUrlPxRegisterFinished);
	}
}


function asyncValidateSeleccionVuelo(response)
{

	/*aca inicia el cambio de ventana de seleccion de vualo a formulario*/

	loadingBoa.terminarCargarBoa();
	if(response["success"] == true) {
		// continuando compra
		var form = $("#div_formulario_personas");
		form.html("");

		var numPx = 1;
		for(var key in {adulto:null,ninho:null,infante:null,adultoMayor:null}) // weirdo and fast :P
			for(var i=0;i<seleccionVuelo[key].num;i++)
				form.append(buildRegistroPersona(key,numPx++));
		var nowYear = new Date();


        iconSvg.convertirFigureSvgIcono();


        $(".nombres").validCampos(' abcdefghijklmnopqrstuvwxyzáéiou');
        $(".apellidos").validCampos(' abcdefghijklmnopqrstuvwxyzáéiou');
        $(".telefono").validCampos(' 0123456789+()-');
        $(".nro-documento").validCampos('0123456789abcdefghijklmnopqrstuvwxyz');
        $(".nro-viajero-frecuente").validCampos('0123456789');

        if(ENABLE_GENDER){
        	//cambiamos la altura
        	$("#info_registro_pasajeros .persona").css({"height":"250px"});
        	$(".left-label").css({"height":"250px"});
		}



        $(".frmPerLimpiar").click(function () {
            var $formPersona = $(this).closest('.persona');

        	console.log('LIMPIAR')
            $formPersona.find('.nombres').val('')
            $formPersona.find('.apellidos').val('')
            $formPersona.find('.tipo-documento').val('NONE')
            $formPersona.find('.nro-documento').val('')
            $formPersona.find('.telefono').val('')
            $formPersona.find('.email').val('')
            $formPersona.find('.nacimiento').val('')

            $formPersona.find('.nro-viajero-frecuente').val('')

            $formPersona.find('.nombres').prop('readonly',false);
            $formPersona.find('.apellidos').prop('readonly',false);
        });

        //ff
		$(".frmPerBuscar").click(function () {

			console.log('ff')
			console.log($(this).parent());
			var input = $(this).parent().find('input').val();
			console.log(input)

			/*
			 var form = new FormData();
			 form.append("id", input);





			$.ajax({
			 url: 'http://webpreprod.cloudapp.net/BoAWebSite/Loyalty/GetFF',
			 data: form,
			 processData: false,
			 type: 'POST',
			 success: function(data){
			 }
			 });*/


			var resp = {
                "codigo": 1,
                "mensaje": "El código de viajero frecuente no existe.",
                "codigoError": null,
                "dato_valor": null,
                "objeto": {
                    "ExtensionData": {},
                    "BirthDate": "/Date(974160000000)/",
                    "DocNumber": "424242234",
                    "DocType": "",
                    "Email": "test999@boa.bo",
                    "ErrorMessage": null,
                    "Gender": "M",
                    "LastName": "Figuero",
                    "Name": "Favio",
                    "Phone": "591"
                }
            };
            var $formPersona = $(this).closest('.persona');

			console.log($formPersona)
            var fecha = new Date(resp.objeto.BirthDate.match(/\d+/)[0] * 1);
            console.log($(this).closest('table').find('.nombres'));
            $formPersona.find('.nombres').val(resp.objeto.Name);
            $formPersona.find('.apellidos').val(resp.objeto.LastName);
            $formPersona.find('.tipo-documento').val(resp.objeto.DocType);
            $formPersona.find('.nro-documento').val(resp.objeto.DocNumber);
            $formPersona.find('.telefono').val(resp.objeto.Phone);
            $formPersona.find('.email').val(resp.objeto.Email);
            $formPersona.find('.nacimiento').datepicker("setDate", fecha );


            if(resp.codigo == 0){
            	showSimpleDialog2(resp.mensaje+" "+input)
			}else{ //cuando esta existe el viajero frecuente
                $(this).closest('table').find('.nombres').prop('readonly',true);
                $(this).closest('table').find('.apellidos').prop('readonly',true);
			}

			$('.nombres, .apellidos').click(function () {
				if(this.readOnly){
                    showSimpleDialog2("No puedes Modificar este campo, limpia el formulario y vuelta a intentarlo");
                }
            });
            
            




        });



        /*form.find(".calendar").datepicker({
            dateFormat: 'dd MM yy',
            numberOfMonths: 1,
            maxDate: 0,
            changeYear:true,
            changeMonth:true,
            yearRange: (nowYear.getFullYear() - 80).toString() + ':' + (nowYear.getFullYear() - 12).toString()
        });
        console.log(nowYear.getFullYear() - 12);
        //mandamos date al picker
        var date = new Date(parseInt(nowYear.getFullYear() - 80),01,01);
        form.find(".calendar").datepicker().datepicker("setDate", date);*/


        form.children('[data-tipo=adulto]').find(".calendar").datepicker({
            dateFormat: 'dd MM yy',
            numberOfMonths: 1,
            maxDate: 0,
            changeYear: true,
            yearRange: (nowYear.getFullYear() - 80).toString() + ':' + (nowYear.getFullYear() - 12).toString()
        });

        var dateADT = new Date(parseInt(nowYear.getFullYear() - 80), 01, 01);
        form.children('[data-tipo=adulto]').find(".calendar").datepicker().datepicker("setDate", dateADT);


        form.children('[data-tipo=ninho]').find(".calendar").datepicker({
            dateFormat: 'dd MM yy',
            numberOfMonths: 1,
            maxDate: 0,
            changeYear: true,
            yearRange: (nowYear.getFullYear() - 12).toString() + ':' + (nowYear.getFullYear() - 2).toString()
        });

        var dateCHD = new Date(parseInt(nowYear.getFullYear() - 12), 01, 01);
        form.children('[data-tipo=ninho]').find(".calendar").datepicker().datepicker("setDate", dateCHD);


        form.children('[data-tipo=infante]').find(".calendar").datepicker({
            dateFormat: 'dd MM yy',
            numberOfMonths: 1,
            maxDate: 0,
            changeYear: true,
            yearRange: (nowYear.getFullYear() - 2).toString() + ':' + (nowYear.getFullYear() - 0).toString()
        });

        var dateINF = new Date(parseInt(nowYear.getFullYear() - 2), 01, 01);
        form.children('[data-tipo=infante]').find(".calendar").datepicker().datepicker("setDate", dateINF);





        var dateInfanteMin = new Date();

        //console.log(new Date(''+dateInfanteMin.getFullYear() - 1+'/'+dateInfanteMin.getMonth()+'/'+dateInfanteMin.getDate()+''));
        var fechaMinNino = new Date(''+dateInfanteMin.getFullYear() - 12+'/'+ (dateInfanteMin.getMonth() + 1) +'/'+dateInfanteMin.getDate()+'');
        var fechaMinInf = new Date(''+dateInfanteMin.getFullYear() - 2+'/'+ (dateInfanteMin.getMonth() + 1) +'/'+dateInfanteMin.getDate()+'');

        var fechaMinAdultoMayor = new Date(''+dateInfanteMin.getFullYear() - 60+'/'+ (dateInfanteMin.getMonth() + 1) +'/'+dateInfanteMin.getDate()+'');

        form.children('[data-tipo=infante]').find(".calendar").datepicker().datepicker("option", "minDate", fechaMinInf );
        form.children('[data-tipo=ninho]').find(".calendar").datepicker().datepicker("option", "minDate", fechaMinNino );


        form.children('[data-tipo=adultoMayor]').find(".calendar").datepicker({
            dateFormat: 'dd MM yy',
            numberOfMonths: 1,
            maxDate: 0,
            changeYear: true,
        });

        form.children('[data-tipo=adultoMayor]').find(".calendar").datepicker().datepicker("option", "maxDate", fechaMinAdultoMayor );

        form.children('[data-tipo=adultoMayor]').find(".calendar").datepicker().datepicker("option", "changeYear", true );







		$("#info_resultados_vuelos").removeClass("active");
		$("#info_registro_pasajeros").addClass("active");

		$("#stage_seleccion").removeClass("active");
		$("#stage_registro").addClass("active");

		$("#widget_resumen_reserva").addClass("read-only");

		$("#tbl_seleccion_ida").hide();
		$("#tbl_seleccion_vuelta").hide();
		$("#tbl_seleccion_ida_small").show();

		if(vuelos_store.tieneVuelta == true)
			$("#tbl_seleccion_vuelta_small").show();

		//window.scrollTo(0,0); // scroll hacia arriba

        $("html, body").animate({ scrollTop: 0 }, "slow");

		$("#btn_cambiar_vuelo").hide();
		$("#btn_volver_vuelos").show();

		$("#loading_compra").hide();
		$("#loading_compra2").hide();
		$("#btn_validar_pasajeros").show();
		$("#btn_validar_pasajeros2").show();
	}else{
        showSimpleDialog (BoA.defaultApologyMessage, BoA.defaultURLAfterFail);
	}
}

// ---------------------= =---------------------
function focusOnPersona()
{
	var curr = $(this);
	while(false == curr.hasClass("persona"))
		curr = curr.parent();

	$("#div_formulario_personas .persona").addClass("inactive");
	curr.removeClass("inactive");
}
// ---------------------= =---------------------
function checkSearchWidgetAvailability()
{
	if(waitingForFlightsData){
		$("#widget_cambiar_vuelo .btn-expand").addClass("searching");
		$("#widget_cambiar_vuelo .form").hide();
	}
	else{
		$("#widget_cambiar_vuelo .btn-expand").removeClass("searching");
		$("#widget_cambiar_vuelo .form").show();
	}
}
// ---------------------= =---------------------
/* cambio en fila de detalles de resultados segun ancho */
function checkResultsTableWidth()
{
	var w = $("#tbl_salida").width();
	if(w < 700)
		$("#tbl_salida .expandable .detail, #tbl_regreso .expandable .detail").removeClass("stretched");
	else
		$("#tbl_salida .expandable .detail, #tbl_regreso .expandable .detail").addClass("stretched");
}

/******************************************************** 
 ********************** ASYNC HANDLERS ******************
 ********************************************************/
// ---------------------= =---------------------
function asyncReceiveDates(response)
{

	contadorNuevaPeticion = 1;
	$("#tabla_tipo").show();

	try {
		// fix to .NET dumbest encoding ever (possible bug here in future)

		response = $.parseJSON(response.CalendarResult).ResultCalendar; 
	} catch (e){
		showSimpleDialog (BoA.defaultApologyMessage, BoA.defaultURLAfterFail);

		loadingBoa.terminarCargarBoa();

		return;
	}

	console.log(response)
	// construir selector de fechas para vuelos de ida y vuelta
	currentDateIda = response["fechaIdaConsultada"];
	rawDatesCache.ida = response["calendarioOW"]["OW_Ida"]["salidas"]["salida"];

	if(searchParameters.fechaVuelta != null){
		currentDateVuelta = response["fechaVueltaConsultada"];
		rawDatesCache.vuelta = response["calendarioOW"]["OW_Vuelta"]["salidas"]["salida"];
	}
	else{
		currentDatevuelta = null;
		rawDatesCache.vuelta = null;
	}

	// (las fechas de ida y vuelta deben estar establecidas 
	//	antes de construir el selector de fechas)
	buildDatesSelector(
		response["calendarioOW"]["OW_Ida"]["salidas"]["salida"],
		response["fechaIdaConsultada"],
		$("#tbl_days_selector_salida"),
		true // isIda
	);

	// construir selector de fechas para vuelos de vuelta
	if(searchParameters.fechaVuelta != null) {
		buildDatesSelector(
			response["calendarioOW"]["OW_Vuelta"]["salidas"]["salida"],
			response["fechaVueltaConsultada"], 
			$("#tbl_days_selector_regreso"),
			false
		);
	} 

	waitingForFlightsData = true;

	searchParameters.sitios = getSelectedSitesCount();

	requestFlights(currentDateIda, currentDateVuelta,searchParameters.sitios);
}
// ---------------------= =---------------------
function asyncReceiveFlights(response)
{

    loadingBoa.terminarCargarBoa();
	checkWarningPxNumber() ;
	
	if(waitingForFlightsData == false) // response ya fue procesado
		return;

	response = $.parseJSON(response.AvailabilityPlusValuationsShortResult);

	if(response.ResultInfoOrError != null) {
		//fillTableWithMessage($("#tbl_salida")[0], response.ResultInfoOrError.messageError);
		waitingForFlightsData = false; // mutex data
        $("#salidas_").remove();
        $("#llegadas_").remove();

        //quitamos seleccion y le ponemos que no hay vuelos
		$('.days').find('.selected').find('h3').html(translate.t.NO_HAY_VUELOS);
		$('.days').find('.selected').removeClass('selected').addClass('no-flights');

		console.log(BoA.defaultConsultaVuelos.fechaIda)
		//agregar al calendario una fecha
        $('#picker_salida').datepicker("setDate",
            compactToJSDate(BoA.defaultConsultaVuelos.fechaIda)
        );
        if(BoA.defaultConsultaVuelos.fechaVuelta != null) {
            $("#picker_regreso").datepicker("setDate",
                compactToJSDate(BoA.defaultConsultaVuelos.fechaVuelta)
            );
        }


		$("#salidasHeaderFamilias").empty().append('<div style="width: 100%; height: 70px; background-color: #EFAA35;    color: #111;padding-top: 25px;text-align: center;">'+response.ResultInfoOrError.messageError+'</div>');
		$("#llegadasHeaderFamilias").empty().append('<div style="width: 100%; height: 70px; background-color: #EFAA35;    color: #111;padding-top: 25px;text-align: center;">'+response.ResultInfoOrError.messageError+'</div>');
		return;
	}
    $("#salidasHeaderFamilias").empty();
    $("#llegadasHeaderFamilias").empty();

	// el verdadero response esta mas adentro ¬¬
	response = response['ResultAvailabilityPlusValuationsShort']; 

	console.log('response',response)
	var fechaIdaConsultada = response["fechaIdaConsultada"];
	var fechaVueltaConsultada = response["fechaVueltaConsultada"];
	
	if(fechaIdaConsultada != currentDateIda &&
	   fechaVueltaConsultada != currentDateVuelta)
		return; // cuando response no es de las fechas esperadas

	waitingForFlightsData = false; // mutex data

	$('#salidas_').empty();
	$('#llegadas_').empty();

	//todo aca cambiar y armar la matriz de matrices

	vuelos_store.armarVuelos(response);
	//iniciamos el dibujador con el store de datos que se tiene
	console.log(vuelos_store)

	var vuelos_dibujador = Object.create(vuelosDibujador);
    vuelos_dibujador.__proto__.store = vuelos_store;


	$("#salidasHeaderFamilias").append(vuelos_dibujador.dibujarHeaderFamilias('salidas'));
    vuelos_dibujador.dibujarVuelos('salidas',vuelos_store);

	if(vuelos_store.tieneVuelta == true){
        $("#llegadasHeaderFamilias").append(vuelos_dibujador.dibujarHeaderFamilias('llegadas'));
        vuelos_dibujador.dibujarVuelos('llegadas',vuelos_store);
	}

}

/***************************************************** 
 *************** UI BUILDING FUNCTIONS ***************
 *****************************************************/
function buildDatesSelector(rawDates, requestedDateStr, table, isIda)
{
	var tarifasByDate = {};

	// mine some data first
	for(var i=0;i<rawDates.length;i++){
		var rawDate = rawDates[i];
		var tarifaStr = rawDate["tarifas"]["tarifaCalen"]["importe"];

		tarifasByDate[rawDate["fecha"]] = tarifaStr;
	}

	requestedDate = compactToJSDate(requestedDateStr);

	table.find("tr.months").html(""); // clean months row
	table.find("tr.days td").remove(); // clean dates row

	var monthsInDays = {};

	// check for 3 days after, and 3 days before
	// if it does not exist, complete with "none" instead of the price
	for(var i=-3;i<=3;i++) {
		// same process for days after
		var d = new Date(requestedDate);


		d.setDate(requestedDate.getDate() + i);

		var mess = COMPACT_MONTH_NAMES[d.getMonth()];



		var mm = "" + (d.getMonth()+1);
		if(false == (mm in monthsInDays))
			monthsInDays[mm] = 1;
		else
			monthsInDays[mm]++;

		var dateStr = d.getFullYear() + ("00" + (d.getMonth() + 1)).slice(-2) + (("00" + d.getDate()).slice(-2));

		var cell = document.createElement("td");

		$(cell).addClass("day-selector").data("date", dateStr);


		$(cell).html("<span >"+WEEKDAYS_LONG_2_CHARS_LANGUAGE_TABLE[d.getDay()]+"</span><h2>" + mess  +
			"<span class='fecha_dia_calendario'>" + (("00" + d.getDate()).slice(-2)) + "</span></h2>");

		var inRange = true;

		// evitar mostrar fechas cruzadas (de ida y vuelta)
		if(currentDateVuelta != null) { 
			var otherDate = compactToJSDate(isIda ? currentDateVuelta:currentDateIda);
			if(isIda)
				inRange = (d <= otherDate);
			else
				inRange = (d >= otherDate);
		}

		if(false == inRange) {
			$(cell).css("display","none"); // no mostrar fechas cruzadas
		}
		else if(false == (dateStr in tarifasByDate)) {
			$(cell).addClass("no-flights")
				   .append("<h3>No hay<br>vuelos</h3>");
		} else {
			$(cell).append("<h3 class='monto_calendario'>" + formatCurrencyQuantity(tarifasByDate[dateStr], true, 0) +"</h3>");
			//$(cell).append("<h3></h3>");
		}

		if(dateStr == (isIda?currentDateIda:currentDateVuelta))
			$(cell).addClass("selected");

		table.find("tr.days").append(cell);
	}

	// build months data
	var monthsRow = table.find("tr.months");
	for(var key in monthsInDays) {
		var td = $(document.createElement("td"));
		td.attr("colspan",monthsInDays[key])
		  .css("width",(100 * (monthsInDays[key]/7.0))+"%")
			.css("display","none")
		  .addClass("month")
		  .html("<h3>" + MONTHS_2_CHARS_LANGUAGE_TABLE[parseInt(key)] + "</h3>");
		monthsRow.append(td);
	}

	table.prepend(monthsRow);

	//table.find("tr.days td.day-selector:not(.no-flights)").click(changeDay);
	table.find("tr.days td.day-selector:not(.no-flights)").click(validateSearch);
}

function operadorSvg(operador){

    //agregamos aeropuerto
    var svg_aer = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    $(svg_aer).text('Operado por: ');
    $(svg_aer).attr("style", 'fill: #ffffff; font-size: 14px;');
    $(svg_aer).attr("x", '0');
    $(svg_aer).attr("y", '0');
    $(svg_aer).attr("class", 'st3');

    var svg_aer_aux = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    $(svg_aer_aux).text(lineas[operador]);
    $(svg_aer_aux).attr("style", 'fill: #ffffff; font-size: 14px;');
    $(svg_aer_aux).attr("x", '22');
    $(svg_aer_aux).attr("y", '18');
    $(svg_aer_aux).attr("class", 'st3');

    $(svg_aer).append($(svg_aer_aux));

    return $(svg_aer);


	/*var str = '<tspan style="fill: #ffffff; font-size: 14px;"  x="0" y="0" class="st3">Operado por:</tspan>';

	str+='<tspan style="fill: #ffffff; font-size: 14px;" x="22" y="18" class="st3">'+operador+'</tspan>';
	return str;*/

}
function tiempoTransito(hora_llegada_1,hora_salida_2){

	var t1 = new Date(),
		t2 = new Date();

	t1.setHours(hora_salida_2.hh, hora_salida_2.mm,"00");
	t2.setHours(hora_llegada_1.hh, hora_llegada_1.mm, "00");

	//Aquí hago la resta
	t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds());

	var res = {Str:"",Hrs:"",Mins:""};
	//Imprimo el resultado
	res.Hrs = t1.getHours();
	res.Mins = t1.getMinutes();
	 res.Str = (t1.getHours() ? t1.getHours() + (t1.getHours() > 1 ? " h" : " h") : "") + (t1.getMinutes() ? ", " + t1.getMinutes() + (t1.getMinutes() > 1 ? " min" : " min") : "") + (t1.getSeconds() ? (t1.getHours() || t1.getMinutes() ? " y " : "") + t1.getSeconds() + (t1.getSeconds() > 1 ? " segundos" : " segundo") : "");

	return res;
}
function separarAeropuertoSvg(aeropuerto) {

	/*var m = aeropuerto.split(' ');

	 var str = '<tspan style="fill: #ffffff; font-size: 14px;"  x="0" y="0" class="st3">'+m[0]+' '+m[1]+'</tspan>';
	 var aux = '';
	 for(var i = 2; i < m.length; i++){

	 aux += m[i]+' ';
	 }
	 str+='<tspan style="fill: #ffffff; font-size: 14px;" x="14.7" y="18" class="st3">'+aux+'</tspan>';

	 return str;*/


    //agregamos aeropuerto
    var svg_aer = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    var m = aeropuerto.split(' ');
    $(svg_aer).text(m[0] + ' ' + m[1]);
    $(svg_aer).attr("style", 'fill: #ffffff; font-size: 14px;');
    $(svg_aer).attr("x", '0');
    $(svg_aer).attr("y", '0');
    $(svg_aer).attr("class", 'st3');

    if (m.length > 2) {
        var aux = '';
        for (var i = 2; i < m.length; i++) {

            aux += m[i] + ' ';
        }

        var svg_aer_aux = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        $(svg_aer_aux).text(aux);
        $(svg_aer_aux).attr("style", 'fill: #ffffff; font-size: 14px;');
        $(svg_aer_aux).attr("x", '14.7');
        $(svg_aer_aux).attr("y", '18');
        $(svg_aer_aux).attr("class", 'st3');

        $(svg_aer).append($(svg_aer_aux));



    }

    return $(svg_aer);
}

/******************************************************* 
 *************** LOGIC HANDLER FUNCTIONS ***************
 *******************************************************/
// ---------------------= =---------------------
function handleInitialRequest()
{
	searchParameters.origen = BoA.defaultConsultaVuelos.origen;
	searchParameters.destino = BoA.defaultConsultaVuelos.destino;
	searchParameters.fechaIda = BoA.defaultConsultaVuelos.fechaIda;
	searchParameters.fechaVuelta = BoA.defaultConsultaVuelos.fechaVuelta;

	$("#select_origen").val(searchParameters.origen);
	$("#select_destino").val(searchParameters.destino);

	$('#picker_salida').datepicker("setDate", 
		compactToJSDate(BoA.defaultConsultaVuelos.fechaIda)
	);

	if(BoA.defaultConsultaVuelos.fechaVuelta != null) {
		$("#rbtn_ida_vuelta").click();
		$("#picker_regreso").datepicker("setDate",
			compactToJSDate(BoA.defaultConsultaVuelos.fechaVuelta)
		);
	}

	// date pickers setup
	//esto es importante  comentar para la actualizacion en la peticion cuando se seleccione mas pasajeros
	//$('#picker_salida').datepicker("setDate", new Date() );

	var array_asientos = [];
	// setup config passengers initial parameters
	var defaultSitesCount = 0;
	var aux_count = 0;

	//validamos que si es adulto mayor entonces solo sea ese
	if (BoA.defaultConsultaVuelos['adultoMayor'] > 0) {
        BoA.defaultConsultaVuelos['adulto'] = 0;
        BoA.defaultConsultaVuelos['ninho'] = 0;
        BoA.defaultConsultaVuelos['infante'] = 0;
	}

	for(var tipo in {adulto:null,ninho:null,infante:null,adultoMayor:null}) {
		var pxCount = BoA.defaultConsultaVuelos[tipo];
		if(tipo != 'infante'){
            defaultSitesCount += pxCount;
            if(tipo == 'adulto'){
            	if (pxCount>0){
                    array_asientos[aux_count] = [ "ADT", ""+pxCount+"" ];
                    aux_count++;
                }
			}else if(tipo == 'ninho'){
            	if(pxCount>0){
                    array_asientos[aux_count] = [ "CHD", ""+pxCount+"" ];
                    aux_count++;
                }
			}else if(tipo == 'adultoMayor'){
            	if(pxCount>0){
                    array_asientos[aux_count] = [ "SNN", ""+pxCount+"" ];
                    aux_count++;
                }
			}

		}else{
			if(pxCount>0){
                array_asientos[aux_count] = [ "INF", ""+pxCount+"" ];
                aux_count++;
            }
		}




		var list = $("#widget_resumen_reserva .selector-pax ul[data-tipo='"+tipo+"']");

		list.find("li.selected").click();
		list.find("li[data-count='"+pxCount+"']").click();


	}

	searchParameters.sitios = defaultSitesCount; // start value

	searchParameters.sitesDetail = array_asientos;



	
	requestSearchParameters(searchParameters);
}
// ---------------------= =---------------------
function requestSearchParameters(parms)
{

	//validamos si es un vuelo restringido para adulto mayor
	if(adultoMayorNoAeropuerto[ parms.origen ] != undefined || adultoMayorNoAeropuerto[ parms.destino ] != undefined ){
		$(".tarifa").find('[data-tipo = "adultoMayor"]').parent().parent().hide();
	}

	// Clear cache data first
	currentDateIda = null;
	currentDateVuelta = null;

	// setup labels
	var origen = parms.origen;
	var destino = parms.destino;
	var cityOrigen = cities[origen];
	var cityDestino = cities[destino];


	$("#lbl_info_salida").siblings('b').remove(); //este elimina a los dos b de ida y de regreso para volver a poner
	$(".OrdenarVuelos").remove(); //este elimina a los dos
	$("#lbl_info_salida").html(translate.t.VUELO_DE_IDA);
	$("#lbl_info_salida").css({"font-size":"12px"});
	$("#lbl_info_salida").after("<b class='txt_origen_destino'>"+cityOrigen+" ( "+origen+" ) - "+cityDestino+" ( "+destino+" ) </b>");
	$("#lbl_info_salida").after("<div class='OrdenarVuelos'><div>"+translate.t.ORDENAR_POR+" :</div><select onchange='vuelosDibujador.ordenarVuelos(this)' data-tipo='salidas_' ><option value='ordenporprecio'>"+translate.t.PRECIO+"</option><option value='ordenporhora'>"+translate.t.HORA+"</option></select></div>");

	// regreso
	if(parms.fechaVuelta != null) {
		$("#lbl_info_regreso").empty();
 		$("#lbl_info_regreso, #tbl_dayselector_regreso, #tbl_regreso").show();
		$("#lbl_info_regreso").html(translate.t.VUELO_DE_VUELTA);

		$("#lbl_info_regreso").css({"font-size":"12px"});
		$("#lbl_info_regreso").after("<b class='txt_origen_destino'>"+cityDestino+" ( "+destino+" ) - "+cityOrigen+" ( "+origen+") </b>");
        $("#lbl_info_regreso").after("<div class='OrdenarVuelos'><div>"+translate.t.ORDENAR_POR+":</div><select onchange='vuelosDibujador.ordenarVuelos(this)' data-tipo='llegadas_' ><option value='ordenporprecio'>"+translate.t.PRECIO+"</option><option value='ordenporhora'>"+translate.t.HORA+"</option></select></div>");



    } else {
		$("#lbl_info_regreso, #tbl_dayselector_regreso, #tbl_regreso").hide();
		$("#lbl_info_regreso").hide();
	}

	//  cambiar aspecto de celdas a segundo plano
	$("#tbl_days_selector_salida .day-selector, #tbl_days_selector_regreso .day-selector")
		.removeClass("no-flights")
		.removeClass("selected")
		.addClass("faded")
		.html("");

	// añadir animacion de loading
	$("#tbl_days_selector_salida .day-selector:nth-child(4), #tbl_days_selector_regreso .day-selector:nth-child(4)")
		.addClass("loading-cell")
		.html("<div class='loading'></div>");

	// fillTableWithLoading($("#tbl_salida")[0]);
	// if(parms.fechaVuelta != null)
	// 	fillTableWithLoading($("#tbl_regreso")[0]);

	$("#widget_cambiar_vuelo .btn-expand").addClass("searching");

	var currentTimeStr = formatCompactTime(new Date());

	var data = {
		tokenAv 		: SERVICE_CREDENTIALS_KEY,
		language 		: "ES",
		currency 		: CODE_CURRENCIES[CURRENCY],
		locationType 	: "N",
		location 		: "BO",
		from 			: parms.origen,
		to 				: parms.destino,
		rateType		: "1",
		departing 		: parms.fechaIda,
		returning 		: (parms.fechaVuelta == null ? "" : parms.fechaVuelta),
		days 			: "3",
		ratesMax		: "1",
		sites			: (""+parms.sitios),
		compartment 	: "0", 
		classes 		: "",
		clientDate 		: todayStr,
		clientHour 		: currentTimeStr,
		forBook			: "1",
		forRelease 		: "1",
		ipAddress 		: "127.0.0.1", 
		xmlOrJson 		: false , // false=json ; true=xml
        sitesDetail		: parms.sitesDetail,
	};


	//agregamos si es miami
	if (parms.destino == 'MIA'){
		data.gender = '';
	}

    searchParameters.sitesDetail = parms.sitesDetail;

	ajaxRequest(
		BoA.urls["nearest_dates_service"], 
		asyncReceiveDates, 
		"POST", data);



}
// ---------------------= =---------------------
function requestFlights(dateIda, dateVuelta, totalSites)
{
	// now!
	var now = new Date();
	var currentTimeStr = ("00" + (now.getHours())).slice(-2) + "" + ("00" + (now.getMinutes())).slice(-2);

	var sitios = (totalSites > 0 || totalSites != null || totalSites != '')?totalSites:"1";
	var data = {
		tokenAv 		: SERVICE_CREDENTIALS_KEY,
		language 		: "ES",
		currency 		: CODE_CURRENCIES[CURRENCY],
		locationType 	: "N",
		location 		: "BO",
		bringAv			: "1",
		bringRates		: "3",
		surcharges 		: true,
		directionality  : "0",

		departing 		: dateIda,
		returning 		: (dateVuelta==null?"":dateVuelta),
		sites 			: sitios,
		compartment 	: "0",
		classes 		: "",
		classesState 	: "",
		clientDate 		: todayStr,
		clientHour 		: currentTimeStr,
		forRelease 		: "1",

		cat19Discounts	: "true",
		specialDiscounts: null,
		book 			: "1",
		booking 		: "",
		bookingHour		: "",
		responseType 	: "1",
		releasingTime 	: "1",
		ipAddress 		: "127.0.0.1", // xD
		xmlOrJson 		: "false", // false is Json
        sitesDetail		:  searchParameters.sitesDetail,


		from: searchParameters.origen,
		to: searchParameters.destino
	};

    //agregamos si es miami
    if (searchParameters.destino == 'MIA'){
        data.gender = '';
        ENABLE_GENDER = true;
    }else{
    	ENABLE_GENDER = false;
	}


	ajaxRequest(
		BoA.urls["flights_schedule_service"], 
		asyncReceiveFlights, 
		"POST", data);
}
// ---------------------= dibujador del formulario =---------------------
function buildRegistroPersona(tipo, numPx)
{
	//cambiamos las variables para multilenguaje
	var namesByTipo = {adulto:'ADULTO',ninho:'NINHO',infante:'INFANTE',adultoMayor:'ADULTO_MAYOR_FORM'};




	var isAdulto = (tipo=='adulto') || (tipo=='adultoMayor');

	var persona = document.createElement("div");
	$(persona).addClass("persona")
			  .addClass("inactive")
			  .attr("data-tipo",tipo)
			  .append("<div class='left-label'><label class='lbl-tipo'>"+translate.t[namesByTipo[tipo]]+"</label><label class='nro-pasajero'>"+translate.t.PASAJERO+" "+numPx+"</label><div class='icon-pasajero "+tipo+"'></div></div>")
			  .append("<div class='form'><table cellpadding='0' cellspacing='0'></table></div>")
			  .append("<div class='wrapper'><div class='form'></div></div>");

    var tbl = $(persona).find(".form table");

    var wrapper = $(persona).find('.wrapper .form');
    wrapper.css({"width":"85%"});


    wrapper.append('<div class="Grid Grid--gutters Grid--cols-1 titulo_persona_mobile">'+
		'<div class="Grid-cell" style="background-color:#3D5B86; position: absolute; top: -28px; padding: 15px; color: #fff; "><div class="content-1of1"><div class="icon-pasajero '+tipo+'"></div> '+translate.t.PASAJERO+' '+numPx+' - '+namesByTipo[tipo]+' </div></div>'+
        '</div>');

    wrapper.append('<br>');


    if(tipo=='adulto' || tipo=='adultoMayor' || tipo=='ninho'){
        wrapper.append('<div class="Grid Grid--gutters Grid--holly-grail">' +
            '<div class="Grid-cell main" style="order: 1;">' +
				'<div class="Holly">' +
					'<div class="titulo_input" style="float: left;">'+translate.t.VIAJERO_FRECUENTE+'</div>' +
					'<input style="width: 37%; float:left; margin-top: 7px;" type="text" id="tbx_px'+numPx+'_px_frecuente" class="nro-viajero-frecuente">  ' +
					'<div class="iconFormSvg frmPerBuscar"><figure class="svg"  data-src="search"></figure><span>'+translate.t.BUSCAR+'</span></div>'+
					'<div class="iconFormSvg frmPerLimpiar"><figure class="svg"  data-src="Borrar"></figure><span>'+translate.t.LIMPIAR+'</span></div>'+
				'</div>' +
            '</div>'+
            '<div class="Grid-cell aside" style="order: 2;"><div class="Holly"><span>'+translate.t.SI_NO_ERES_VIAJERO_FRECUENTE_Q+'<a href="#">'+translate.t.REGISTRATE+'</a></span></div></div>'+
            '</div>');
    }

    wrapper.append('<div class="Grid Grid--gutters Grid--cols-4">'+
						'<div class="Grid-cell"><div class="content-1of4"><div class="titulo_input">'+translate.t.NOMBRES+'</div><div class="validable"><input type="text" id="tbx_px'+numPx+'_nombres" class="nombres"></div> </div></div>'+
						'<div class="Grid-cell"><div class="content-1of4"><div class="titulo_input">'+translate.t.APELLIDOS+'</div><div class="validable"><input type="text" id="tbx_px'+numPx+'_apellidos" class="apellidos"></div> </div></div>'+
						'<div class="Grid-cell"><div class="content-1of4"><div class="titulo_input">'+translate.t.TIPO_DE_DOCUMENTO+'</div><div class="validable">' +
							'<select id="select_px'+numPx+'_tipo_documento" class="tipo-documento">' +
							'<option value="NONE">'+translate.t.TIPO_DE_DOCUMENTO_MIN+'</option>' +
							'<option value="CI">'+translate.t.CI+'</option>' +
							'<option value="PASAPORTE">'+translate.t.PASAPORTE+'</option>' +
							'<option value="DNI">'+translate.t.DNI+'</option>' +
							'</select>'+
						'</div> </div></div>'+
						'<div class="Grid-cell"><div class="content-1of4"><div class="titulo_input">'+translate.t.NUM_DE_DOCUMENTO+'</div><div class="validable"><input type="text" id="tbx_px'+numPx+'_documento" class="nro-documento"></div> </div></div>'+

					'</div>');
    wrapper.append('<div class="Grid Grid--gutters Grid--holly-grail">'+
						'<div class="Grid-cell aside" style="order: 1;">'+
							'<div class="Holly">'+
								'<div class="titulo_input">'+translate.t.TELEFONO+'</div><div class="validable"><input type="text" id="tbx_px'+numPx+'_telefono" class="telefono"></div>'+
							'</div>'+
						'</div>'+
						'<div class="Grid-cell main" style="order: 2;">'+
							'<div class="Holly">'+
								'<div class="titulo_input">'+(isAdulto?translate.t.EMAIL:translate.t.FECHA_NACIMIENTO)+'</div> ' +
								(isAdulto?
										'<div class="validable" style="position: relative;"><div class="tooltip">'+translate.t.DEBES_INGRESAR_TU_CORREO_ELECTRONICO+'</div><input type="text" id="tbx_px'+numPx+'_email" class="email" onfocus="validaciones_form.validar_email(this)" onkeyup="validaciones_form.validar_email(this)" ><span class="icon_form"><svg   class="svg_icon_form"><use class="alert_form" xlink:href="#alert_form" /></svg></span></div>':
										'<div class="validable" style="position: relative;"><div class="tooltip">'+(tipo=='infante'?translate.t.INFANTE_DESC:translate.t.NINO_DESC)+'</div><input type="text" id="picker_px'+numPx+'_nacimiento" class="calendar nacimiento" text="(Ingrese fecha de nacimiento)" onkeypress="return false;"></div>'
								) +
							'</div>'+
						'</div>'+
						'<div class="Grid-cell aside" style="order: 3;">'+
							'<div class="Holly">'+
								'<div class="titulo_input">'+(isAdulto?translate.t.FECHA_NACIMIENTO: translate.t.VIAJERO_FRECUENTE)+'</div> '+
								(isAdulto?
										'<div class="validable"><input type="text" id="picker_px'+numPx+'_nacimiento" class="calendar nacimiento" text="(Ingrese fecha de nacimiento)" onkeypress="return false;"></div>':
										'<input readonly type="text" id="tbx_px'+numPx+'_px_frecuente" class="nro-viajero-frecuente">'
								) +
							'</div>'+
						'</div>'+

					'</div>');

    if(ENABLE_GENDER==true){


            wrapper.append('<div class="Grid Grid--gutters Grid--cols-4">'+
							'<div class="Grid-cell"><div class="content-1of4"><div class="titulo_input">'+translate.t.GENERO+'</div><div class="validable"><select id="tbx_px'+numPx+'_genero" class="genero"><option value="NONE">'+translate.t.GENERO_MIN+'</option><option value="M">'+translate.t.MASCULINO+'</option><option value="F">'+translate.t.FEMENINO+'</option></select> </div> </div></div>'+
							(!isAdulto?
									'<div class="Grid-cell"><div class="content-3of4"><br> <b>'+translate.t.SE_DEBE_PRESENTAR_DOCUMENTOS+'</b> </div></div>':
									'<div class="Grid-cell"><div class="content-3of4"> </div></div>'
							) +


				'</div>');


	}









	$(persona).find("input").focusin(focusOnPersona);



	return persona;
}
// ---------------------= =---------------------
function buildBanks(banks) 
{
	// BANKS SETUP
	var tblBanks = $("#info_pago_bancos .banks-container");
	tblBanks.find("tbody").html(""); //clear
	var columnsCreated = 0;
	var columnsPerRow = BoA.banks.columnsPerRow;
	var row;

	for (var bankKey in banks) {
		var bank = banks[bankKey];

		if (false == bank.visible)
			continue;

		if (columnsCreated == 0) {
			row = document.createElement("tr");
			tblBanks.find("tbody").append(row);
		}

		var cell = document.createElement("td");
		row.appendChild(cell);

		if (bank.enabled)
			$(cell).append("<a href='" + bank.url + "'><img class='bank' src='/content/images/bancos/" + bankKey + ".png'></a>");
		else{
			disabledBanksMessages[bankKey] = bank.msg;

			$(cell).append("<img class='bank " + bankKey + "' data-bank_key='"+bankKey+"' src='/content/images/bancos/" + bankKey + ".png'>");
			$(cell).find("img").click(function(){
				showSimpleDialog(disabledBanksMessages[$(this).data("bank_key")]);	
			});
		}

		columnsCreated = (columnsCreated + 1) % columnsPerRow;
	}
}


// ---------------------= =---------------------
function getSelectedSitesCount() 
{
	var pxSelections = $("#widget_resumen_reserva .selector-pax ul");
	var total = 0;
    var array_asientos = [];
    var array_count_asientos = 0;
	for(var i=0;i<pxSelections.length;i++) {
		var ul = $(pxSelections[i]);
		var tipo = ul.data("tipo");

		if(tipo=="adulto") {
			if(parseInt(ul.find("li.selected").data("count")) > 0){
                array_asientos[array_count_asientos] = [ "ADT", ""+parseInt(ul.find("li.selected").data("count"))+"" ];
                array_count_asientos ++;
			}


            total += parseInt(ul.find("li.selected").data("count"));

        } else if (tipo=="ninho"){

            if(parseInt(ul.find("li.selected").data("count")) > 0){
                array_asientos[array_count_asientos] = [ "CHD", ""+parseInt(ul.find("li.selected").data("count"))+"" ];
                array_count_asientos ++;
            }



            total += parseInt(ul.find("li.selected").data("count"));
		}else if(tipo=="infante"){
            if(parseInt(ul.find("li.selected").data("count")) > 0){
                array_asientos[array_count_asientos] = [ "INF", ""+parseInt(ul.find("li.selected").data("count"))+"" ];
                array_count_asientos ++;
            }
        }else{

            if(parseInt(ul.find("li.selected").data("count")) > 0){
                array_asientos[array_count_asientos] = [ "SNN", ""+parseInt(ul.find("li.selected").data("count"))+"" ];
                array_count_asientos ++;
            }

            total += parseInt(ul.find("li.selected").data("count"));



        }
    }






    searchParameters.sitesDetail = array_asientos;

	return total;
}

// ---------------------= =---------------------
function getTypeSelectedSitesCount(tipo_seleccionado)
{
	var pxSelections = $("#widget_resumen_reserva .selector-pax ul");
	var sitio_seleccionados = {
		total_adulto : 0,
		total_ninho: 0,
		total_ninho: 0,
	};

	for(var i=0;i<pxSelections.length;i++) {
		var ul = $(pxSelections[i]);
		var tipo = ul.data("tipo");

		if(tipo=="adulto"){
			sitio_seleccionados.total_adulto += parseInt(ul.find("li.selected").data("count"));

		}else if(tipo=="ninho"){
			sitio_seleccionados.total_ninho += parseInt(ul.find("li.selected").data("count"));
		}else if(tipo=="adultoMayor"){
			sitio_seleccionados.total_adultoMayor += parseInt(ul.find("li.selected").data("count"));
			sitio_seleccionados.total_ninho += parseInt(0);
			sitio_seleccionados.total_adultoMayor += parseInt(0);
		}

	}

	if(tipo_seleccionado == 'adulto'){
		var count = sitio_seleccionados.total_adulto;
		var total_para_seleccionar = 9 - count;

		$.each($(pxSelections[1]).children('li'),function (k,v) {


			if(total_para_seleccionar < k){
				$(v).hide();
			}else{
				$(v).css({"display":""});
			}

		});

		//CAMBIAMOS LA CANTIDAD DE LOS INFANTES DEPENDIENDO DE LA CANTIDAD DE ADULTOS 1 INFANTE POR ADULTO
        $.each($(pxSelections[2]).children('li'),function (k,v) {


            if(count < k){
                $(v).hide();
            }else{
                $(v).css({"display":""});
            }

        });


	}else if (tipo_seleccionado == 'ninho'){
		var count = sitio_seleccionados.total_ninho;
		var total_para_seleccionar = 9 - count;

		$.each($(pxSelections[0]).children('li'),function (k,v) {

			if(total_para_seleccionar < k){
				$(v).hide();
			}else{
				$(v).css({"display":""});
			}

		});
	}

	return sitio_seleccionados;
}

// ---------------------= =---------------------
function showSimpleDialog(msg, redirectUrl)
{
	$("#dialog_overlay").show();
	$("#simple_dialog")
		.show()
		.find(".description").html(msg);

	$("#ui_reserva_vuelos").addClass("blured");

	if(redirectUrl != null){
		$("#simple_dialog .button").click(function(){
			closeSimpleDialog(redirectUrl);
		});
	}

}
// ---------------------= =---------------------
function closeSimpleDialog(redirectUrl)
{
	$("#dialog_overlay").hide();
	$("#simple_dialog").hide();
	$("#ui_reserva_vuelos").removeClass("blured");

	if(redirectUrl != null)
		window.location.href = redirectUrl;
}

function showSimpleDialog2(msg)
{
	$("#dialog_overlay").show();
	$("#simple_dialog")
		.show()
		.find(".description").html(msg);

	$("#ui_reserva_vuelos").addClass("blured");


		$("#simple_dialog .button").click(function(){
			$("#dialog_overlay").hide();
			$("#simple_dialog").hide();
			$("#ui_reserva_vuelos").removeClass("blured");
		});


}



// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= validar email =---------------------

function isEmail(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}

function edadPasajero(Fecha){
	fecha = new Date(Fecha);
	hoy = new Date();
	ed = parseInt((hoy -fecha)/365/24/60/60/1000);
	//console.log(parseInt((hoy -fecha)/1000/60/60/24));
	dias_nacido = parseInt((hoy -fecha)/(1000*60*60*24));
	var edad = [ed,dias_nacido]; //retorna la edad en anios y de dias de nacido
	return edad;
}

function backToFlightStage()
{

    if($("#info_pago_bancos").hasClass("active")){

        $("#widget_resumen_reserva").show();
        $("#loading_compra").hide();
        $("#loading_compra2").hide();
        $("#stage_compra").removeClass("active");
    }

    $("#info_resultados_vuelos").addClass("active");
    $("#info_registro_pasajeros").removeClass("active");

    $("#info_pago_bancos").removeClass("active");

    $("#stage_seleccion").addClass("active");
    $("#stage_registro").removeClass("active");

    $("#btn_cambiar_vuelo").show();
    $("#btn_volver_vuelos").hide();

    $("#widget_resumen_reserva").removeClass("read-only");

    $("#tbl_seleccion_ida").show();
    if(vuelos_store.tieneVuelta == true)
        $("#tbl_seleccion_vuelta").show();

    $("#tbl_seleccion_ida_small").hide();
    $("#tbl_seleccion_vuelta_small").hide();

    $("#btn_validar_pasajeros").hide();
    $("#btn_validar_pasajeros2").hide();
    $("#btn_validar_vuelos").show();
    $("#btn_validar_vuelos2").show();

    window.scrollTo(0,0); // scroll hacia arriba


    var m = '';
    //cuando es solo la peticion por ida


    m = '<div onclick="vuelosDibujador.continuarCompra(this)"   class="button btn_validar_vuelos" style="position: relative;float: right;">'+translate.t.CONTINUAR_MI_COMPRA+'</div>';

    $('.cell-submit').html(m);

}

function mapearDatosFF (resp){
	console.log(resp)
}
