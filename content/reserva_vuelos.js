// ---------------------= =---------------------
/***** CONFIG PARAMETERS *****/
var CACHE_DISABLED = false;
var IGNORED_TARIFAS_BY_FARE_CODE = ["SSENIOR"];
var ALLOWED_TARIFAS_BY_ESTADO = ['A'];
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
	GRU: "Sao Paulo"
};

var airports = {
	LPB: "Aeropuerto Internacional El Alto",
	CIJ: "Aeropuerto Capit&aacute;n Anibal Arab",
	CBB: "Aeropuerto Internacional Jorge Wilstermann",
	MAD: "Aeropuerto Internacional Adolfo Su&aacute;z Madrid-Barajas",
	VVI: "Aeropuerto Internacional Viru Viru",
	SRE: "Aeropuerto Juana Azurduy de Padilla",
	TJA: "Aeropuerto Capitán Oriel Lea Plaza",
	TDD: "Aeropuerto Teniente Jorge Henrich Arauz",
	EZE: "Aeropuerto Internacional Ministro Pistarini",
	GRU: "Aeropuerto Internacional de Guarulhos",
	BCN: "Aeropuerto Internacional El Prat",
	CCA: "Aeropuerto Internacional Chimore",
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
// ---------------------= =---------------------
/********************************************************* 
 ********************** UI HANDLERS **********************
 **********************************************************/
$(document).on('ready',function()
{
	contadorNuevaPeticion = 0;
	if($("#ui_reserva_vuelos").data("mode") !="widget") {
		initialize_header(true);
		initialize_ui_sections({anchor_section_headers:false});	
	}


	$("#tbl_salida").find("tr").not(":first").remove(); // clear table results
	$("#tbl_regreso").find("tr").not(":first").remove(); // clear table results



	todayStr = formatCompactDate(new Date()); // today 

	/*----------= UI SETUP HANDLERS =-----------*/
	$("#widget_cambiar_vuelo #btn_cambiar_vuelo").click(toggleWidgetCambiarVuelo);
	$("#widget_cambiar_vuelo .form .radio-button").click(toggleRbtnIdaVuelta);
	$("#widget_resumen_reserva td.selector-pax ul li").click(changeNumPassengers);
	$("#widget_resumen_reserva td.selector-pax ul").mouseleave(function(){
		if($(this).hasClass("active"))
			$(this).removeClass("active");
	});

	$("#btn_borrar_ida").click(deleteIda);
	$("#btn_borrar_vuelta").click(deleteVuelta);
	$("#btn_buscar_vuelo").click(validateSearch);

	// Initial search of flights
	setTimeout(handleInitialRequest, 500);

	// DATE PICKERs SETUP
	$("#picker_salida").datepicker({ 
		dateFormat: 'dd MM yy',
		numberOfMonths: 2, 
		minDate: 0,
		onSelect:function(selectedDate){
			$( "#picker_regreso" ).datepicker( "option", "minDate", selectedDate );
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

	$("#btn_validar_vuelos").click(validateSeleccionVuelo);
	$("#btn_validar_vuelos2").click(validateSeleccionVuelo);
	$("#btn_volver_vuelos").click(backToFlightStage);
	$("#btn_validar_pasajeros").click(validatePassengers);
	$("#btn_validar_pasajeros2").click(validatePassengers);

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
	$("#simple_dialog .button").click(closeSimpleDialog);


	//dibuja los bancos
	dibujarBancos(BoA.bancos.debito,"debito");
	dibujarBancos(BoA.bancos.credito,"credito");
	dibujarBancos(BoA.bancos.billetera,"billetera");


	//pagar reserva



	$("#pagar_reserva").click(function () {
		$(this).empty().append('<b class="button" style="position: static;">Pagar Reserva</b>');
		var self = this;
		if( $(this).hasClass("activado") ){
			$(this).removeClass("activado");

			$("#contenedor_pagar").hide("slide",function () {
				$("#cod_reserva").css({"margin-top":"30px"});
				$(self).siblings('td').show();
			});


			$("#razon_social").val('');
			$("#nit").val('');

		}else{

			$(this).addClass("activado");
			$(this).empty().append('x Pagar Reserva');
			$(this).siblings('td').hide("slow",function () {
				$("#contenedor_pagar").show("slide");
				$("#cod_reserva").css({"margin-top":"0px"});


			});

		}

	});


	//controlar el scroll
	$( window ).scroll(function() {
		if($(window).scrollTop() > 140){
			$("#widget_resumen_reserva").css({"position":"fixed","right":"60px"});
			$(".head-tu-vuelo").hide();
		}else{
			$("#widget_resumen_reserva").css({"position":"absolute","right":""});
			$(".head-tu-vuelo").show();
		}
	});

}); // init

function dibujarBancos(objeto,titulo){

	console.log(objeto)
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
			var banco = '<div class="'+clase+'" id="'+v.nombre+'">'+
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

					if (validado){
						//aca haces la accion
						console.log("nit",$("#nit").val());
						console.log("razon social",$("#razon_social").val());
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

	console.log('cambio de dia');
	deleteIda();
	deleteVuelta();

	var table = this;
	console.log(table)

	while(false == $(table).is("table")) // find parent table
		table = table.parentNode;

	waitingForFlightsData = true;

	var isSalida = ($(table).data("salida_regreso") == "salida");

	$(table).find(".day-selector").removeClass("selected");

	$(this).addClass("selected");

	var selected_date = $(this).data("date");

	if(isSalida){
		currentDateIda = selected_date;
		fillTableWithLoading($("#tbl_salida")[0]);
	}
	else {
		currentDateVuelta = selected_date;
		fillTableWithLoading($("#tbl_regreso")[0]);
	}

	requestFlights(currentDateIda, currentDateVuelta);
}
// ---------------------= =---------------------
function toggleWidgetCambiarVuelo()
{
	if($(this).hasClass("searching")) return;

	var widget = $(this.parentNode);
	console.log('widget',widget)

	if(widget.hasClass("collapsed")) {
		widget.removeClass("collapsed").addClass("expanded");
	} else {
		widget.removeClass("expanded").addClass("collapsed");
	}
}

//----
function view_detail_connections(that) {
	var row = $(that).parent().parent()[0];
	var opcCode = $(row).data("opc_code");
	var table = row.parentNode;

	while(false == $(table).is("table")) // find parent table
		table = table.parentNode;

	if(!$(that).hasClass('active')){


		$(that).addClass('active');
		$(that).html('( - ) Detalle');
		$(table).find(".flight-details").removeClass("expanded").addClass("collapsed");

		$(table).find(".flight-details[data-opc_code='"+opcCode+"']")
			.removeClass("collapsed")
			.addClass("expanded");
	}else{
		$(table).find(".flight-details[data-opc_code='"+opcCode+"']")
			.removeClass("expanded")
			.addClass("collapsed");
		$(that).removeClass('active');
		$(that).html('( + ) Detalle');
	}


}
// ---------------------= =---------------------
function selectTarifa()
{

	var row = this.parentNode;
	if($(row).hasClass("disabled"))
		return;

	var opcCode = $(row).data("opc_code");
	var opcion = allOptions[opcCode];
	var compartment = parseInt($(this).data("compartment"));
	var tarifaID = $(this).data("id_tarifa");

	if($(this).find(".rbtn").hasClass("checked"))
		return;

	var table = row.parentNode;
	while(false == $(table).is("table")) // find parent table
		table = table.parentNode;

	var tipo = $(table).data("tipo");





	if(tipo=="ida") {


		seleccionVuelo.ida = {};
		seleccionVuelo.ida.opcCode = opcCode;
		seleccionVuelo.ida.compartment = compartment;
		$("#empty_ida_slot").css("display","none");

		///az
		if ($("#tbl_regreso").css("display") != "none") {
			constraintTableByTarifa($("#tbl_regreso"), selectionConstraints.ida[tarifaID]);

			constraintTableByFechaHora(opcion, "ida");
		}


	} else {
		seleccionVuelo.vuelta = {};
		seleccionVuelo.vuelta.opcCode = opcCode;	
		seleccionVuelo.vuelta.compartment = compartment;

		$("#empty_ida_slot").css("display",
			seleccionVuelo.ida == null ? "block":"none");

		constraintTableByTarifa($("#tbl_salida"), selectionConstraints.vuelta[tarifaID]);
	}

	$(table).find(".flights-option-row").removeClass("selected");
	$(row).addClass("selected");

	$(table).find(".flight-details").removeClass("expanded").addClass("collapsed");

	//este abre detalle
	/*

	$(table).find(".flight-details[data-opc_code='"+opcCode+"']")
		.removeClass("collapsed")
 		.addClass("expanded");*/

	$(table).find('div.btn_view_detail').hide();
	$(table).find(".rbtn").removeClass("checked");

	$(this).find(".rbtn").addClass("checked");
	$(this).children('div.btn_view_detail').show();
	
	var tblSeleccion = $("#tbl_seleccion_" + tipo + ", #tbl_seleccion_" + tipo + "_small");

	tblSeleccion.find(".fecha_salida_").html(formatShortDate(opcion.vuelos[0].fecha));
	tblSeleccion.find(".fecha_llegada_").html(formatShortDate(opcion.vuelos[0].fechaLlegada));

	tblSeleccion.find(".salida_").html("<span style='float: left; padding-left: 5px; font-size: 15px;'>"+formatTime(opcion.horaSalida)+"</span><h1 style='float: left;'>"+opcion.origen+"</h1>");
	tblSeleccion.find(".llegada_").html("<h1 style='float: right;'>"+opcion.destino+"</h1><span style='float: right; font-size: 15px;'>"+formatTime(opcion.horaLlegada)+"</span>");


	tblSeleccion.find(".citie_salida_").html(cities[opcion.origen]);
	tblSeleccion.find(".citie_llegada_").html(cities[opcion.destino]);

	//

	//tblSeleccion.find(".cell-cod-origen-destino h1").html(opcion.origen + " - " + opcion.destino);
	// tblSeleccion.find(".cell-duracion").html(formatExpandedTime(opcion.duracionVuelo) + " vuelo");
	
	// $("#tbl_seleccion_" + tipo).find(".cell-fecha").html(formatExpandedDate(opcion.vuelos[0].fecha));
	$("#tbl_seleccion_" + tipo + "_small").find(".cell-fecha").html(formatShortDate(opcion.vuelos[0].fecha));

	// $("#tbl_seleccion_" + tipo).find(".cell-hora span").html("Salida:<br>" + formatTime(opcion.horaSalida));
	$("#tbl_seleccion_" + tipo + "_small").find(".cell-hora span").html(formatTime(opcion.horaSalida));

	$("#tbl_seleccion_" + tipo).css("display","block");
	$("#tbl_seleccion_" + tipo).addClass("changed");

	$("#overlay_"+tipo).css("display","block");
	$("#btn_borrar_ida").attr("data-opc_code",opcCode);

	$("#div_empty_vuelo").css("display","none");

	updateAllPrices();

	checkCompleteSeleccionVuelo();

	setTimeout(function() {
		tblSeleccion.removeClass("changed");
	},100);

	if(tipo == 'ida'){
		if(currentDateVuelta != null) {
			$("html, body").delay(1000).animate({scrollTop: $('#lbl_info_regreso').offset().top - 120 }, 3000);

		}else{
			$("html, body").delay(1000).animate({scrollTop: $('#btn_validar_vuelos2').offset().top }, 3000);
		}
	}else{
		$("html, body").delay(1000).animate({scrollTop: $('#btn_validar_vuelos2').offset().top  }, 3000);
	}



}
// ---------------------= =---------------------
/* Lock restricted rates in table */ 
function constraintTableByTarifa(table, allowedIds)
{
	var rows = table.find(".flights-option-row");
	var tipo = table.data("tipo");

	// first enable all cells and rows before start
	table.find(".flights-option-row, .flight-details, .tarifa").css("visibility","visible");

	for(var i=0;i<rows.length;i++) {
		var row = $(rows[i]);
		var tarifaCells = row.find(".tarifa");

		var allValid = false;
		for(var k=0;k<tarifaCells.length;k++) {
			var cell = $(tarifaCells[k]);
			var idTarifa = cell.data("id_tarifa");

			if(allowedIds.indexOf(""+idTarifa) == -1) { // not found
				cell.css("visibility","hidden");	

				if(row.hasClass("selected")){
					if(tipo=="ida")
						deleteIda();
					else
						deleteVuelta();
				}
			} 
			else
				allValid = true; // at least one to enable entire row 
		}

		// if entire row is invalid, hide it
		if(false==allValid && !(typeof otherTable === "undefined")) {
			// hide entire row
			row.css("visibility","hidden");
			otherTable.find("tr.flight-details[data-opc_code='"+row.data("opc_code")+"']").css("visibility","hidden");
		}
	}
}
// ---------------------= =---------------------
/* disables rows wich are out of range (crossed datetimes) */ 
function constraintTableByFechaHora(option, tipo)
{
	var table;
	if(tipo=="ida")
		table = $("#tbl_regreso")
	else if(tipo=="vuelta")
		table = $("#tbl_salida");

	var rows = table.find("tr.flights-option-row");

	rows.removeClass("disabled");

	for(var i=0;i<rows.length;i++) {
		var otherOptionCode = $(rows[i]).data("opc_code");
		var otherOption = allOptions[otherOptionCode];

		var dateTimeCrosses;

		if(tipo=="ida") {
			var optionWeight = option.fechaLlegada.substr(2,6) * 10000 +
				option.horaLlegada.hh * 100 + option.horaLlegada.mm;

			var otherOptionWeight = otherOption.fechaSalida.substr(2,6) * 10000 +
				otherOption.horaSalida.hh * 100 + otherOption.horaSalida.mm;

			dateTimeCrosses = optionWeight >= otherOptionWeight;
		} else if(tipo=="vuelta") {
			var optionWeight = option.fechaSalida.substr(2,6) * 10000 +
				option.horaSalida.hh * 100 + option.horaSalida.mm;

			var otherOptionWeight = otherOption.fechaLlegada.substr(2,6) * 10000 +
				otherOption.horaLlegada.hh * 100 + otherOption.horaLlegada.mm;

			dateTimeCrosses = optionWeight >= otherOptionWeight;
		}

		if(dateTimeCrosses){
			$(rows[i]).addClass("disabled");

			// deselect if disabled row is selected
			if(tipo=="ida" && seleccionVuelo.vuelta != null && otherOptionCode == seleccionVuelo.vuelta.opcCode)
				deleteVuelta();
			else if(tipo=="vuelta" && otherOptionCode == seleccionVuelo.ida.opcCode)
				deleteIda();
		}
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

	searchParameters.sitios = getSelectedSitesCount();
	requestSearchParameters(searchParameters);

	$("#widget_cambiar_vuelo").removeClass("expanded").addClass("collapsed");
	// remover vuelos seleccionados
	deleteIda();
	deleteVuelta();
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

	if(seleccionVuelo.ida == null || 
	  (seleccionVuelo.adulto.num == 0 && seleccionVuelo.ninho.num==0 && seleccionVuelo.infante.num==0 )){
		btn.hide();
		btn2.hide();
	}else{
		btn.show();
		btn2.show();
	}

}
// ---------------------= =---------------------
function deleteIda()
{
	if(seleccionVuelo.ida == null)
		return;

	var opcCode = seleccionVuelo.ida.opcCode;
	seleccionVuelo.ida = null;

	$("#tbl_seleccion_ida").css("display","none");
	$("#overlay_ida").css("display","none");

	if(seleccionVuelo.vuelta != null) {
		$("#empty_ida_slot").css("display","block");
	} else {
		$("#div_empty_vuelo").css("display","block");
	}

	// habilita nuevamente todas las filas de la tabla de vuelta
	$("#tbl_regreso .flights-option-row").removeClass("disabled"); 

	var row = $("#tbl_salida .flights-option-row[data-opc_code='"+opcCode+"']");
	row.removeClass("selected");
	row.find(".rbtn").removeClass("checked");

	var rowDetails = $("#tbl_salida .flight-details[data-opc_code='"+opcCode+"']");
	rowDetails.removeClass("expanded").addClass("collapsed");

	updateAllPrices();

	checkCompleteSeleccionVuelo();
}
// ---------------------= =---------------------
function deleteVuelta()
{
	if(seleccionVuelo.vuelta == null)
		return;

	var opcCode = seleccionVuelo.vuelta.opcCode;
	seleccionVuelo.vuelta = null;

	$("#tbl_seleccion_vuelta").css("display","none");
	$("#overlay_vuelta").css("display","none");

	if(seleccionVuelo.ida == null) {
		$("#empty_ida_slot").css("display","none");
		$("#div_empty_vuelo").css("display","block");
	}

	// update rows
	var row = $("#tbl_regreso .flights-option-row[data-opc_code='"+opcCode+"']");
	row.removeClass("selected");
	row.find(".rbtn").removeClass("checked");

	var rowDetails = $("#tbl_regreso .flight-details[data-opc_code='"+opcCode+"']");
	rowDetails.removeClass("expanded").addClass("collapsed");

	updateAllPrices();
	
	checkCompleteSeleccionVuelo();
}
// ---------------------= =---------------------
function changeNumPassengers()
{


	console.log(this)
	var ul = $(this.parentNode);
	var count = parseInt($(this).data("count"));

	var tipo = $(this.parentNode).data("tipo");

	console.log(tipo)
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
			if(count==0)
				row.addClass("inactive");
			else
				row.removeClass("inactive");

			//vemos las cantidades de pasajeros
			getTypeSelectedSitesCount(tipo);

			// calculo de precio a pagar
			seleccionVuelo[tipo].num = count;
			/*updatePriceByTipo(tipo,true);
			checkCompleteSeleccionVuelo();
			checkWarningPxNumber();*/


			if(contadorNuevaPeticion == 1 ){
				contadorNuevaPeticion +=1;
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
// ---------------------= =---------------------
function validateSeleccionVuelo()
{
	/* PREPARE AND SEND DATA */
	var dataToSend = prepareSeleccionVueloToSend();

	ajaxRequest(
		BoA.urls["validate_flight_selection_service"], 
		asyncValidateSeleccionVuelo, 
		"POST", dataToSend);

	$("#loading_compra").show();
	$("#loading_compra2").show();
	$("#btn_validar_vuelos").hide();
	$("#btn_validar_vuelos2").hide();
}
// ---------------------= =---------------------
function validatePassengers()
{
	var divPersonas = $("#div_formulario_personas .persona");


	var pasajeros = {adulto:[],infante:[],ninho:[]};
	var isAllValid = true;
	for(var i=0;i<divPersonas.length;i++) {
		var divPersona = $(divPersonas[i]);
		var persona = {
			nombres : "",
			apellidos : "",
			tipoDocumento : "",
			nroDocumento  : "",
			telefono : "",
			nroViajeroFrecuente: ""
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

		// apellidos
		var tbxApellidos = divPersona.find(".apellidos");
		if($.trim(tbxApellidos.val())=="") {
			isValid = false;
			tbxApellidos.parent().addClass('active');
		} else {
			persona["apellidos"] = tbxApellidos.val();
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

		persona["telefono"] = divPersona.find(".telefono").val();
		persona["nroViajeroFrecuente"] = divPersona.find(".nro-viajero-frecuente").val();
		if(tipo=='adulto'){
			var tbxemail = divPersona.find(".email");

			if(isEmail(divPersona.find(".email").val())!=true){
				isValid = false;
				tbxemail.parent().addClass('active');
				console.log('is email',isEmail(divPersona.find(".email").val()));

			}else{
				persona["email"] = divPersona.find(".email").val();

			}
		}



		if(tipo=="infante" || tipo=="ninho" || tipo=="adulto") {
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

						console.log("no puede viajar por que tiene "+edad[1]+" dias es menos de  8 dias");
						isValid = false;
						pickerNacimiento.parent().addClass('active');
					}

					if (edad[0] >= 2){ //si es mayor o igual a 2 anios entonces no es infante

						console.log("no es infante por que es mayor a 2 anios");
						isValid = false;
						pickerNacimiento.parent().addClass('active');
					}

				}else if (tipo=="ninho"){

					if (edad[0] < 2 ){ //si es mayor o igual a 2 anios entonces no es infante

						console.log("no es nihno es infante");
						isValid = false;
						pickerNacimiento.parent().addClass('active');
					}

					if (edad[0] >= 12){ //si es mayor o igual a 2 anios entonces no es infante

						console.log("el nino solo puede ser menor a 12 ");
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
		var selVueloToSend = prepareSeleccionVueloToSend();

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

		ajaxRequest(
			BoA.urls["register_passengers_service"], 
			asyncRegisterPassengers, 
			"POST", dataToSend);


		$("#btn_validar_pasajeros").hide();
		$("#btn_validar_pasajeros2").hide();

	}
}
// ---------------------= =---------------------
function asyncRegisterPassengers(response)
{
	if(response["success"] == false) {
		console.log(response["reason"]);
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

	if(response["success"] == true) {
		// continuando compra
		var form = $("#div_formulario_personas");
		form.html("");

		var numPx = 1;
		for(var key in {adulto:null,ninho:null,infante:null}) // weirdo and fast :P
			for(var i=0;i<seleccionVuelo[key].num;i++)
				form.append(buildRegistroPersona(key,numPx++));
		var nowYear = new Date();
		form.find(".calendar").datepicker({ 
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
		form.find(".calendar").datepicker().datepicker("setDate", date);





		$("#info_resultados_vuelos").removeClass("active");
		$("#info_registro_pasajeros").addClass("active");

		$("#stage_seleccion").removeClass("active");
		$("#stage_registro").addClass("active");

		$("#widget_resumen_reserva").addClass("read-only");

		$("#tbl_seleccion_ida").hide();
		$("#tbl_seleccion_vuelta").hide();
		$("#tbl_seleccion_ida_small").show();

		if(seleccionVuelo.vuelta != null)
			$("#tbl_seleccion_vuelta_small").show();

		window.scrollTo(0,0); // scroll hacia arriba

		$("#btn_cambiar_vuelo").hide();
		$("#btn_volver_vuelos").show();

		$("#loading_compra").hide();
		$("#loading_compra2").hide();
		$("#btn_validar_pasajeros").show();
		$("#btn_validar_pasajeros2").show();
	}
}
// ---------------------= =---------------------
function backToFlightStage() 
{
	console.log('vuelve atras')

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
	if(seleccionVuelo.vuelta != null)
		$("#tbl_seleccion_vuelta").show();

	$("#tbl_seleccion_ida_small").hide();
	$("#tbl_seleccion_vuelta_small").hide();

	$("#btn_validar_pasajeros").hide();
	$("#btn_validar_pasajeros2").hide();
	$("#btn_validar_vuelos").show();
	$("#btn_validar_vuelos2").show();

	window.scrollTo(0,0); // scroll hacia arriba
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

		console.log(e);

		return;
	}
	
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

	requestFlights(currentDateIda, currentDateVuelta);
}
// ---------------------= =---------------------
function asyncReceiveFlights(response)
{
	checkWarningPxNumber();
	
	if(waitingForFlightsData == false) // response ya fue procesado
		return;

	response = $.parseJSON(response.AvailabilityPlusValuationsShortResult);

	if(response.ResultInfoOrError != null) {
		fillTableWithMessage($("#tbl_salida")[0], response.ResultInfoOrError.messageError);
		waitingForFlightsData = false; // mutex data

		return;
	}

	// el verdadero response esta mas adentro ¬¬
	response = response['ResultAvailabilityPlusValuationsShort']; 

	var fechaIdaConsultada = response["fechaIdaConsultada"];
	var fechaVueltaConsultada = response["fechaVueltaConsultada"];
	
	if(fechaIdaConsultada != currentDateIda &&
	   fechaVueltaConsultada != currentDateVuelta)
		return; // cuando response no es de las fechas esperadas

	waitingForFlightsData = false; // mutex data

	// process tasas
	var taxes = translateTaxes(response);

	tasasPorPasajero = taxes.byPassenger;
	tasas = taxes.byTax;

	// parse percentaje per passengers
	var porcentajesPorPasajero = translatePercentsByPax(response["porcentajeTipoPasajero"]["PorcentajeTipoPasajero"]);

	var rawTarifas = response["vuelosYTarifas"]["Tarifas"]["TarifaPersoCombinabilityIdaVueltaShort"]["TarifasPersoCombinabilityID"]["TarifaPersoCombinabilityID"];

	selectionConstraints = translateConstraints(response["vuelosYTarifas"]["Tarifas"]["TarifaPersoCombinabilityIdaVueltaShort"]["IVs"]["IV"]);

	allOptions = {}; // reset before translating

	//todo
	//verificamos si es array lo que nos llega o solo un registro
	if (!Array.isArray(response["vuelosYTarifas"]["Vuelos"]["ida"]["vuelos"]["vuelo"])){
		var array_ida_aux = new Array();
		array_ida_aux.push(response["vuelosYTarifas"]["Vuelos"]["ida"]["vuelos"]["vuelo"]);
		response["vuelosYTarifas"]["Vuelos"]["ida"]["vuelos"]["vuelo"] = array_ida_aux;
	}

	//selecciomos un vuelo con menos tarifas
	var lista_negra_clases = [];
	$.each(response["vuelosYTarifas"]["Vuelos"]["ida"]["vuelos"]["vuelo"],function(k,v){
		if(v.num_opcion in lista_negra_clases){
			tamano_aux = lista_negra_clases[v.num_opcion].clase.length;
			if(lista_negra_clases[v.num_opcion].clase.length > v.clases.clase.length){
				response["vuelosYTarifas"]["Vuelos"]["ida"]["vuelos"]["vuelo"][k-1].validado = 'no';
				response["vuelosYTarifas"]["Vuelos"]["ida"]["vuelos"]["vuelo"][k].validado = 'si';
			}else{
				response["vuelosYTarifas"]["Vuelos"]["ida"]["vuelos"]["vuelo"][k].validado = 'no';
			}
		}else{
			lista_negra_clases[v.num_opcion] = v.clases;
			response["vuelosYTarifas"]["Vuelos"]["ida"]["vuelos"]["vuelo"][k].validado = 'si';
		}
	});




	var dataIda = translateFlights(
		response["vuelosYTarifas"]["Vuelos"]["ida"]["vuelos"]["vuelo"], 
		rawTarifas, 
		fechaIdaConsultada,
		porcentajesPorPasajero);

	// reconstruir tabla de fechas (ida)
	buildDatesSelector(rawDatesCache.ida, searchParameters.fechaIda, $("#tbl_days_selector_salida"), true);
	// construir tabla de vuelos
	buildFlightsTable("tbl_salida", dataIda.flightOptions, dataIda.compartments);

	if(currentDateVuelta != null) {

		//verificamos si es array
		//verificamos si es array lo que nos llega o solo un registro
		if (!Array.isArray(response["vuelosYTarifas"]["Vuelos"]["vuelta"]["vuelos"]["vuelo"])){
			var array_ida_aux = new Array();
			array_ida_aux.push(response["vuelosYTarifas"]["Vuelos"]["vuelta"]["vuelos"]["vuelo"]);
			response["vuelosYTarifas"]["Vuelos"]["vuelta"]["vuelos"]["vuelo"] = array_ida_aux;
		}
		lista_negra_clases = [];
		$.each(response["vuelosYTarifas"]["Vuelos"]["vuelta"]["vuelos"]["vuelo"],function(k,v){
			if(v.num_opcion in lista_negra_clases){
				tamano_aux = lista_negra_clases[v.num_opcion].clase.length;
				if(lista_negra_clases[v.num_opcion].clase.length > v.clases.clase.length){
					response["vuelosYTarifas"]["Vuelos"]["vuelta"]["vuelos"]["vuelo"][k-1].validado = 'no';
					response["vuelosYTarifas"]["Vuelos"]["vuelta"]["vuelos"]["vuelo"][k].validado = 'si';
				}else{
					response["vuelosYTarifas"]["Vuelos"]["vuelta"]["vuelos"]["vuelo"][k].validado = 'no';
				}
			}else{
				lista_negra_clases[v.num_opcion] = v.clases;
				response["vuelosYTarifas"]["Vuelos"]["vuelta"]["vuelos"]["vuelo"][k].validado = 'si';
			}
		});

		var dataVuelta = translateFlights(
			response["vuelosYTarifas"]["Vuelos"]["vuelta"]["vuelos"]["vuelo"],
			rawTarifas, 
			fechaVueltaConsultada,
			porcentajesPorPasajero);

		// reconstruir tabla de fechas (vuelta)
		buildDatesSelector(rawDatesCache.vuelta, searchParameters.fechaVuelta, $("#tbl_days_selector_regreso"), false);
		// construir tabla de vuelos
		buildFlightsTable("tbl_regreso", dataVuelta.flightOptions, dataIda.compartments);
	}

	checkResultsTableWidth(); // acomodar tablas segun tamaño


}

/***************************************************** 
 *************** UI BUILDING FUNCTIONS ***************
 *****************************************************/
function buildDatesSelector(rawDates, requestedDateStr, table, isIda)
{
	var tarifasByDate = { };

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


		$(cell).html("<span>"+WEEKDAYS_LONG_2_CHARS_LANGUAGE_TABLE[d.getDay()]+"</span><h2>" + mess  +
			"<span>" + (("00" + d.getDate()).slice(-2)) + "</span></h2>");

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
			$(cell).append("<h3>" + formatCurrencyQuantity(tarifasByDate[dateStr], true, 0) +"</h3>");
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

	table.find("tr.days td.day-selector:not(.no-flights)").click(changeDay);
}
// ---------------------= =---------------------
function buildFlightsTable(tableName, flightOptions, compartments)
{
	var table = $("#"+tableName)[0];

	$(table).find("tr").not(":first").remove(); // clear table results

	if(flightOptions.length == 0){
		$(table).append("<tr><td colspan='10'><h2 class='empty-msg'>No hay vuelos disponibles</h2></td></tr>");
		return;
	}

	// limpiar y añadir cabecera
	$(table).find("tr").remove();
	$(table).append(buildCompartmentsHeader(table, compartments));

	// agrupar por numero de opcion
	for(var key in flightOptions) {
		var opcion = flightOptions[key];
		var row = buildFlightOptionRow(opcion, compartments);
		table.appendChild(row);


		/** aca armaremos el grafico de vuelo **/
		/*var cantidad_de_vuelos = opcion.vuelos.length;
		var cantidad_de_columnas = cantidad_de_vuelos * 2;
		var $t = $('<table/>');
		var $r = $('<tr/>');
		for (var i = 0; i < cantidad_de_columnas; i++){
			var tipo = ((i%2 == 0) || i ==0)?'ida'+i:'vuelta'+i;
			$col = $('<td class="'+tipo+'"/>');
			$r.append($col);
		}
		$t.append($r);
		console.log($t)*/

		var row_detalle= document.createElement("tr");
		$(row_detalle).attr("data-opc_code", opcion.code)
			.addClass("flight-details").addClass("collapsed")
			.html("<td colspan='2' class='cell-details'>" +
				"<div class='expandable'>" +
				"</div>" +
				"</td>");



		var countVuelos = opcion.vuelos.length;
		var clase = '';
		if(countVuelos == 1){

			clase = 'uno';

		}else if(countVuelos == 2){
			clase = 'dos';
		}else if (countVuelos == 3){
			clase = 'tres';
		}
		var expandable = $(row_detalle).find(".expandable");
		var line_tiempo = $('<div id="tiempo_vuelo_'+opcion.code+'" class="tiempo_vuelo '+clase+'" style=" margin: auto;"/>');




		 expandable.append(line_tiempo);

		table.appendChild(row_detalle);






		cargarDetalleVueloSvg(opcion,countVuelos);

		/*for(var i=0;i<opcion.vuelos.length;i++) {
			var vuelo = opcion.vuelos[i];

			var detail = cargarDetalleVueloSvg(opcion, vuelo,1);


		}*/
		/*for(var i=0;i<opcion.vuelos.length;i++) {
			var vuelo = opcion.vuelos[i];

			var detail = buildFlightDetailRow(opcion, vuelo);

			console.log(detail)
			table.appendChild(detail);
		}*/
	}
}
// ---------------------= =---------------------
function buildFlightOptionRow(opc, compartments)
{
	var row = document.createElement("tr");
	$(row).addClass("flights-option-row");
	$(row).addClass("flights-option-row");
	var vuelosStr = "";

	$(row).attr("data-opc_code",opc.code);

	// salida, llegada y duración
	var cell = document.createElement("td");

	var iconSalida = (opc.horaSalida.hh >= 5 && opc.horaSalida.hh <= 12) ? "am" : 
		((opc.horaSalida.hh <= 18) ? "pm" : "night");

	var iconLlegada = (opc.horaLlegada.hh >= 5 && opc.horaLlegada.hh <= 12) ? "am" : 
		((opc.horaLlegada.hh <= 18) ? "pm" : "night");

	/*var strDuracion =
		"<div class='icon-dia-noche salida " + iconSalida + "'></div>" + 
		formatTime(opc.horaSalida) + "&nbsp;&nbsp;-&nbsp;&nbsp;" +
		formatTime(opc.horaLlegada) +
		"<div class='icon-dia-noche llegada " + iconLlegada + "'></div>" + 
		"<br>";

	if(opc.vuelos.length == 1)
		strDuracion += "<span>Duraci&oacute;n: <label>"+formatExpandedTime(opc.duracionVuelo)+"</label></span>";
	else
		strDuracion += 
			"<span>Duraci&oacute;n en Vuelo: <label>"+formatExpandedTime(opc.duracionVuelo)+"</label></span><br>" +
			"<span>Duraci&oacute;n Total: <label>" + formatExpandedTime(opc.duracionTotal) + "</label></span>";
			*/

	var $t = $('<table/>');

	var m = '';
	var aux_object = {};
	$.each(opc.vuelos,function (k,v) {

		if (v.linea in aux_object){

		}else{

			var clase_de_operador = linea_clase[v.linea];
			m += '<div class="'+clase_de_operador+'"><span style="bottom: -24px;position: relative;">'+lineas[v.linea]+'</span></div>';
			aux_object[v.linea] = v.linea;

		}



	});

	$t.append('<tr style="color: #2D4565;">' +
		'<td align="left"><span>SALIDA</span><div><b>'+formatTime(opc.horaSalida)+' '+opc.origen+'</b></div></td>' +
		'<td><div class="ico_time"></div><span><label>Duración Total : '+formatExpandedTime(opc.duracionTotal)+'</label></span></td>' +
		'<td><span>LLEGADA</span><div><b>'+formatTime(opc.horaLlegada)+' '+opc.destino+'</b></div></td>' +
		'<td align="center" style="position: relative;top: -10px;"><span><label>Operado por:</span></label><br>'+m+'</td>' +
		'</tr>');



	$(cell).html($t);

	row.appendChild(cell);

	// tarifas por compartimiento
	for(var i=0;i<compartments.length;i++) {
		var tarifa = opc.tarifas[compartments[i]];

		if(tarifa == null) 
			continue; // it should always have tarifas, but it doesn't sometimes :S

		cell = document.createElement("td");
		$(cell).addClass("tarifa");
		$(cell).html("<div class='rbtn'><div></div></div>" + parseInt(tarifa.monto) /*should be formatted. services issue*/ + " " + HTML_CURRENCIES[CURRENCY]+"<div onclick='view_detail_connections(this)' class='btn_view_detail'>(+) Detalle</div>");
		$(cell).click(selectTarifa);
		$(cell).attr("data-compartment", tarifa.compart);
		$(cell).attr("data-id_tarifa", tarifa.ID);
		row.appendChild(cell);	
	}

	return row;
}
// ---------------------= =---------------------

function cargarDetalleVueloSvg(opc,countVuelos){

	var ruta = '';
	if (countVuelos == 1){
		ruta = 'content/images/tiempo_vuelo/tiempo_vuelo.svg';
	}else if(countVuelos == 2){
		ruta = 'content/images/tiempo_vuelo/tiempo_vuelo2.svg';
	}else if(countVuelos == 3){
		ruta = 'content/images/tiempo_vuelo/tiempo_vuelo3.svg';
	}

	$("#tiempo_vuelo_"+opc.code).load(ruta, function (response) {


		if (!response) { // Error loading SVG// ERROR AL CARGAR LA IMAGEN SVG
			$(this).html('Error svg al insertar<strong><a href="disydes.com">importante</a></strong>');
			$("#ERROR").html("<b>ERROR</b>");

		} else {

			//dibuja los vuelos
			for(var i=0;i<opc.vuelos.length;i++) {
			 	var flight = opc.vuelos[i];
				var nivel = i+1;

				var timeStrSalida = formatTime(flight.horaSalida);
				var timeStrLlegada = formatTime(flight.horaLlegada);
				$(this).children('svg').find('[data="salida'+nivel+'"]').html(flight.origen);
				$(this).children('svg').find('[data="llegada'+nivel+'"]').html(flight.destino);
				$(this).children('svg').find('[data="lineaVuelo'+nivel+'"]').html(flight.linea+""+flight.numVuelo);
				$(this).children('svg').find('[data="operado'+nivel+'"]').html(operadorSvg(flight.operador));
				$(this).children('svg').find('[data="horaSalida'+nivel+'"]').html(timeStrSalida);
				$(this).children('svg').find('[data="horaLlegada'+nivel+'"]').html(timeStrLlegada);
				$(this).children('svg').find('[data="aeropuertoSalida'+nivel+'"]').html((nivel==1)?separarAeropuertoSvg(airports[flight.origen]):'');

				$(this).children('svg').find('[data="aeropuertoLlegada'+nivel+'"]').html(separarAeropuertoSvg(airports[flight.destino]));
				$(this).children('svg').find('[data="duracion'+nivel+'"]').html(formatExpandedTime(flight.duracion));
			 }


			//dibaja el tiempo de transito si esque existe
			if (countVuelos == 2){
				//sacar fecha llegada
				var hora_llegada_1 = opc.vuelos[0].horaLlegada;
				var hora_salida_2 = opc.vuelos[1].horaSalida;

				var transito = tiempoTransito(hora_llegada_1,hora_salida_2);
				$(this).children('svg').find('[data="transito1"]').html(transito);


			}else if(countVuelos == 3){
				var hora_llegada_1 = opc.vuelos[0].horaLlegada;
				var hora_salida_2 = opc.vuelos[1].horaSalida;

				var transito = tiempoTransito(hora_llegada_1,hora_salida_2);
				$(this).children('svg').find('[data="transito1"]').html(transito);

				var hora_llegada_3 = opc.vuelos[1].horaLlegada;
				var hora_salida_4 = opc.vuelos[2].horaSalida;

				var transito2 = tiempoTransito(hora_llegada_3,hora_salida_4);
				$(this).children('svg').find('[data="transito2"]').html(transito2);

			}






		}
	});

}
function operadorSvg(operador){
	var str = '<tspan style="fill: #ffffff; font-size: 14px;"  x="0" y="0" class="st3">Operado por:</tspan>';

	str+='<tspan style="fill: #ffffff; font-size: 14px;" x="22" y="18" class="st3">'+operador+'</tspan>';
	return str;

}
function tiempoTransito(hora_llegada_1,hora_salida_2){

	var t1 = new Date(),
		t2 = new Date();

	t1.setHours(hora_salida_2.hh, hora_salida_2.mm,"00");
	t2.setHours(hora_llegada_1.hh, hora_llegada_1.mm, "00");

	//Aquí hago la resta
	t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds());

	//Imprimo el resultado
	 return (t1.getHours() ? t1.getHours() + (t1.getHours() > 1 ? " h" : " h") : "") + (t1.getMinutes() ? ", " + t1.getMinutes() + (t1.getMinutes() > 1 ? " min" : " min") : "") + (t1.getSeconds() ? (t1.getHours() || t1.getMinutes() ? " y " : "") + t1.getSeconds() + (t1.getSeconds() > 1 ? " segundos" : " segundo") : "");

}
function separarAeropuertoSvg(aeropuerto){

	var m = aeropuerto.split(' ');

	var str = '<tspan style="fill: #ffffff; font-size: 14px;"  x="0" y="0" class="st3">'+m[0]+' '+m[1]+'</tspan>';
	var aux = '';
	for(var i = 2; i < m.length; i++){

		aux += m[i]+' ';
	}
	str+='<tspan style="fill: #ffffff; font-size: 14px;" x="14.7" y="18" class="st3">'+aux+'</tspan>';

	return str;
}
// ---------------------= =---------------------
function buildFlightDetailRow(opc, flight) {
    /*** FILA DE DETALLES ***/
    row = document.createElement("tr");

    $(row).attr("data-opc_code", opc.code)
		  .attr("data-num_vuelo", flight.numVuelo)
		  .addClass("flight-details").addClass("collapsed")
		  .html("<td colspan='10' class='cell-details'>" + 
		  			"<div class='expandable'>" +
		  				"<div class='lbl-num-vuelo' title='N&uacute;mero de Vuelo'>" + flight.linea + " - " + flight.numVuelo + "&nbsp;&nbsp;&nbsp;("+flight.operador+")</div>" +
		  			"</div>" + 
		  			"<div class='separator'></div>" +
		  		"</td>");



    var expandable = $(row).find(".expandable");

    for (var m = 0; m < 2; m++) {
        var isSalida = (m == 0);
        var timeStr = formatTime(isSalida ? flight.horaSalida : flight.horaLlegada);
 
        var detail = document.createElement("table");
        $(detail).addClass("detail")
                          .addClass(isSalida ? "left" : "right")
                           .attr("cellspacing", "0")
                           .attr("cellpadding", "0")
                           .append("<tr><td class='icon-cell' rowspan='2'><div class='icon-" + (isSalida ? "salida" : "llegada") + "'></div></td><td class='time-cell'>" + timeStr + "<br>Hrs.</td><td class='airport-cell' valign='top'><div>" +flight[isSalida ? "origen" : "destino"] +" - "+ airports[flight[isSalida ? "origen" : "destino"]] + "</div></td></tr>")
                           .append("<tr><td class='ciudad-cell'>" + cities[flight[isSalida ? "origen" : "destino"]] + "</td><td class='duracion-cell'>" + (isSalida ? ("Duraci&oacute;n: " + formatExpandedTime(flight.duracion)) : "") + "</td></tr>");
 
        expandable.append(detail);
    }
 
    return row;
}
// ---------------------= =---------------------
function buildCompartmentsHeader(table, compartments) 
{
	var row = document.createElement("tr");
	$(row).html("<th>Salida - Llegada</th>");
	for(var i=0;i<compartments.length;i++) {
		$(row).append("<th class='class-group compartment-header'>"+compartmentNames[compartments[i]]+"</th>");
	}
	return row;
}
// ---------------------= =---------------------
function fillTableWithLoading(table)
{
	$(table).find("tr").not(":first").remove(); // clear table results

	var row = document.createElement("tr");
	$(row).html("<td colspan='20' class='loading-cell'><div class='loading'></div></td>");

	table.appendChild(row);
}
// ---------------------= =---------------------
function fillTableWithMessage(table, message)
{
	$(table).find("tr").not(":first").remove(); // clear table results

	var row = document.createElement("tr");
	$(row).html("<td colspan='20' class='message'>"+message+"</td>");

	table.appendChild(row);
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

	// setup config passengers initial parameters
	var defaultSitesCount = 0;
	for(var tipo in {adulto:null,ninho:null,infante:null}) {
		var pxCount = BoA.defaultConsultaVuelos[tipo];
		if(tipo != 'infante')
			defaultSitesCount += pxCount;

		var list = $("#widget_resumen_reserva .selector-pax ul[data-tipo='"+tipo+"']");

		list.find("li.selected").click();
		list.find("li[data-count='"+pxCount+"']").click();
	}

	searchParameters.sitios = defaultSitesCount; // start value

	// new loop because change num parameters needs searchParameters.sitios to 
	// check
	// for(var tipo in {adulto:null,ninho:null,infante:null}) {
	// 	var list = $("#widget_resumen_reserva .selector-pax ul[data-tipo='"+tipo+"']");

	// 	list.find("li.selected").click();
	// 	list.find("li[data-count='"+pxCount+"']").click();	
	// }

	
	requestSearchParameters(searchParameters);
}
// ---------------------= =---------------------
function requestSearchParameters(parms)
{
	// Clear cache data first
	currentDateIda = null;
	currentDateVuelta = null;

	// setup labels
	var origen = parms.origen;
	var destino = parms.destino;
	var cityOrigen = cities[origen];
	var cityDestino = cities[destino];

	$("#lbl_info_salida").siblings('b').remove(); //este elimina a los dos b de ida y de regreso para volver a poner
	$("#lbl_info_salida").html("VUELO DE IDA");
	$("#lbl_info_salida").css({"font-size":"12px"});
	$("#lbl_info_salida").after("<b style='font-size: 25px;'>"+cityOrigen+" ( "+origen+" ) - "+cityDestino+" ( "+destino+" ) </b>");

	// regreso
	if(parms.fechaVuelta != null) {
		$("#lbl_info_regreso").empty();
 		$("#lbl_info_regreso, #tbl_dayselector_regreso, #tbl_regreso").show();
		$("#lbl_info_regreso").html("VUELO DE VUELTA: ");

		$("#lbl_info_regreso").css({"font-size":"12px"});
		$("#lbl_info_regreso").after("<b style='font-size: 25px;'>"+cityDestino+" ( "+destino+" ) - "+cityOrigen+" ( "+origen+") </b>");


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

	fillTableWithLoading($("#tbl_salida")[0]);
	if(parms.fechaVuelta != null)
		fillTableWithLoading($("#tbl_regreso")[0]);

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
		days 			: "7",
		ratesMax		: "1",
		sites			: (""+parms.sitios),
		compartment 	: "0", 
		classes 		: "",
		clientDate 		: todayStr,
		clientHour 		: currentTimeStr,
		forBook			: "1",
		forRelease 		: "1",
		ipAddress 		: "127.0.0.1", 
		xmlOrJson 		: false  // false=json ; true=xml 
	};

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
		sites 			: "1",
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

		from: searchParameters.origen,
		to: searchParameters.destino
	};

	ajaxRequest(
		BoA.urls["flights_schedule_service"], 
		asyncReceiveFlights, 
		"POST", data);
}
// ---------------------= =---------------------
function updatePriceByTipo(tipo, changeFlapper)
{
	var precio = -1;
	var num = seleccionVuelo[tipo].num;

	//seleccionVuelo[tipo].tasasTotales = {};

	if(seleccionVuelo.ida != null) {
		/* CALCULOS PARA IDA */
		var opcionIda = allOptions[seleccionVuelo.ida.opcCode];
		
		var tarifa = opcionIda.tarifas[seleccionVuelo.ida.compartment];

		seleccionVuelo[tipo].num = num;
		seleccionVuelo[tipo].ida.precioBase = tarifa.monto * tarifa.porcentajes[tipo];

		seleccionVuelo[tipo].ida.tasas = {}; // reset
		if(tasasPorPasajero[tipo] != undefined) {

			for (var i = 0; i < tasasPorPasajero[tipo].length; i++) {
				var keyTasa = tasasPorPasajero[tipo][i];
				var tasa = tasas[keyTasa];

				// algunas tasas solo existen de vuelta
				if (tasa.ida != null) {
					seleccionVuelo[tipo].ida.tasas[keyTasa] =
						seleccionVuelo[tipo].ida.precioBase * (tasa.ida.porcentaje / 100.0) + tasa.ida.fijo;



				}
			}
		}






		// tasa BO se calcula de forma distinta
		// BO = (Neto + QM) * %
		if('BO' in seleccionVuelo[tipo].ida.tasas &&
		   'QM' in seleccionVuelo[tipo].ida.tasas) {
		  	seleccionVuelo[tipo].ida.tasas['BO'] = 
				(seleccionVuelo[tipo].ida.precioBase + seleccionVuelo[tipo].ida.tasas['QM']) * 
				(tasas['BO'].ida.porcentaje/100.0);
		}

		/* CALCULOS PARA VUELTA */
		if(seleccionVuelo.vuelta != null) {
			var opcionVuelta = allOptions[seleccionVuelo.vuelta.opcCode];
			tarifa = opcionVuelta.tarifas[seleccionVuelo.vuelta.compartment];

			seleccionVuelo[tipo].vuelta.precioBase = tarifa.monto * tarifa.porcentajes[tipo];

			seleccionVuelo[tipo].vuelta.tasas = {}; // reset
			if(tasasPorPasajero[tipo] != undefined) {
				for (var i = 0; i < tasasPorPasajero[tipo].length; i++) {
					var keyTasa = tasasPorPasajero[tipo][i];
					var tasa = tasas[keyTasa];

					// algunas tasas solo existen de ida
					if (tasa.vuelta != null) {
						seleccionVuelo[tipo].vuelta.tasas[keyTasa] =
							seleccionVuelo[tipo].vuelta.precioBase * (tasa.vuelta.porcentaje / 100.0) + tasa.vuelta.fijo;



					}
				}
			}

			// tasa BO se calcula de forma distinta
			// BO = (Neto + QM) * %
			if('BO' in seleccionVuelo[tipo].vuelta.tasas &&
			   'QM' in seleccionVuelo[tipo].vuelta.tasas) {
			  	seleccionVuelo[tipo].vuelta.tasas['BO'] = 
					(seleccionVuelo[tipo].vuelta.precioBase + seleccionVuelo[tipo].vuelta.tasas['QM']) * 
					(tasas['BO'].vuelta.porcentaje/100.0);
			}






		}



		seleccionVuelo.tasasTotales[tipo].tasas={};
		seleccionVuelo.tasasTotales[tipo].total=0;




		//sumamos las tasas de ambos
		//calculamos tasas que apliquen a ambos ida y vuelta
		//si es AR APLICAR si tiene vuelta en ambos precios bases
		$.each(seleccionVuelo[tipo].ida.tasas,function (k,v) {

			var tasa = tasas[k];

			if (seleccionVuelo[tipo].num > 0){

				if(k in seleccionVuelo.tasasTotales[tipo].tasas){//suma en los existentes

					if (k == "AR") {
						seleccionVuelo[tipo].ida.tasas[k] = AR(seleccionVuelo[tipo].ida.precioBase ,seleccionVuelo[tipo].vuelta.precioBase,tasa.ida.porcentaje,tasa.ida.fijo);
						seleccionVuelo.tasasTotales[tipo].tasas[k] += seleccionVuelo[tipo].ida.tasas[k];

					}else{
						seleccionVuelo.tasasTotales[tipo].tasas[k] += v;
					}


				}else{

					if (k == "BO" && seleccionVuelo[tipo].vuelta.tasas["BO"] == null && seleccionVuelo.vuelta != null) {
						var qmIda = seleccionVuelo[tipo].ida.tasas['QM'] == null ? 0 : seleccionVuelo[tipo].ida.tasas['QM'];
						var qmVuelta = seleccionVuelo[tipo].vuelta.tasas['QM'] == null ? 0 : seleccionVuelo[tipo].vuelta.tasas['QM'];

						var precio_base_ida_vuelta = seleccionVuelo[tipo].ida.precioBase + seleccionVuelo[tipo].vuelta.precioBase;
						seleccionVuelo[tipo].ida.tasas[k] =
							(precio_base_ida_vuelta + qmIda + qmVuelta) * (tasas[k].ida.porcentaje / 100.0);

						seleccionVuelo.tasasTotales[tipo].tasas[k] = seleccionVuelo[tipo].ida.tasas[k];


					}else if (k == "AR") {
						seleccionVuelo[tipo].ida.tasas[k] = AR(seleccionVuelo[tipo].ida.precioBase ,seleccionVuelo[tipo].vuelta.precioBase,tasa.ida.porcentaje,tasa.ida.fijo);
						seleccionVuelo.tasasTotales[tipo].tasas[k] = seleccionVuelo[tipo].ida.tasas[k];

					}else{
						seleccionVuelo.tasasTotales[tipo].tasas[k] = v;
					}

				}

				var nDecimals = LocaleConfig.decimalDigitsByCurrency[CURRENCY];
				seleccionVuelo.tasasTotales[tipo].total+= parseFloat(formatCurrencyQuantity(seleccionVuelo[tipo].ida.tasas[k],false,nDecimals));

				//seleccionVuelo.tasasTotales[tipo].total+= seleccionVuelo[tipo].ida.tasas[k];




			}


		});

		if(seleccionVuelo.vuelta != null) {
			$.each(seleccionVuelo[tipo].vuelta.tasas,function (k,v) {

				if (seleccionVuelo[tipo].num > 0){
					if(k in seleccionVuelo.tasasTotales[tipo].tasas){
						seleccionVuelo.tasasTotales[tipo].tasas[k] += v;
					}else{
						seleccionVuelo.tasasTotales[tipo].tasas[k] = v;
					}
					//seleccionVuelo.tasasTotales[tipo].total+= v;
					var nDecimals = LocaleConfig.decimalDigitsByCurrency[CURRENCY];
					seleccionVuelo.tasasTotales[tipo].total+= parseFloat(formatCurrencyQuantity(v,false,nDecimals));
				}



			});
		}





		/*CALCULO DE TOTAL DE TASAS*/
		var nDecimals = LocaleConfig.decimalDigitsByCurrency[CURRENCY];
		var total_tasas = (seleccionVuelo.tasasTotales["adulto"].total * seleccionVuelo["adulto"].num) + (seleccionVuelo.tasasTotales["ninho"].total * seleccionVuelo["ninho"].num)+ (seleccionVuelo.tasasTotales["infante"].total * seleccionVuelo["infante"].num);
		$("#totalTasas").html(formatCurrencyQuantity(total_tasas,false,nDecimals));
		updateTasasToolTip();


		/* CALCULO DE PRECIO TOTAL */
		seleccionVuelo[tipo].precioTotal = seleccionVuelo[tipo].ida.precioBase;
		for(var keyTasa in seleccionVuelo[tipo].ida.tasas)  // ida
			seleccionVuelo[tipo].precioTotal += seleccionVuelo[tipo].ida.tasas[keyTasa];


		if(seleccionVuelo.vuelta != null) {
			seleccionVuelo[tipo].precioTotal += seleccionVuelo[tipo].vuelta.precioBase;
			for(var keyTasa in seleccionVuelo[tipo].vuelta.tasas)  // vuelta
				seleccionVuelo[tipo].precioTotal += seleccionVuelo[tipo].vuelta.tasas[keyTasa];	
		}

		// Redondeo al subtotal y total
		seleccionVuelo[tipo].precioTotal *= seleccionVuelo[tipo].num;

		seleccionVuelo.precioTotal = 
			seleccionVuelo.adulto.precioTotal + 
			seleccionVuelo.ninho.precioTotal + 
			seleccionVuelo.infante.precioTotal;
	}else {
		seleccionVuelo.precioTotal = -1;
	}

	var span = $("#precio_" + tipo);

	if(seleccionVuelo.ida != null)  {
		buildDetailPrices(seleccionVuelo[tipo], tipo);

		var nDecimals = LocaleConfig.decimalDigitsByCurrency[CURRENCY];
		var total_base = 0;

		if (seleccionVuelo[tipo].formattedPrecioTotal != 0) {
			total_base = seleccionVuelo[tipo].ida.precioBase + ((seleccionVuelo.vuelta != null)?seleccionVuelo[tipo].vuelta.precioBase:0);


		}

		var nDecimals = LocaleConfig.decimalDigitsByCurrency[CURRENCY];
		span.html(formatCurrencyQuantity(total_base*seleccionVuelo[tipo].num,false,nDecimals));
		span.parent().parent().addClass("calculated");

		if(changeFlapper){
			updateFlapper();
		}


	}
	else{
		span.html("0");
		span.parent().parent().removeClass("calculated");

		if(changeFlapper)
			flapperTotal.val("0000000").change();
	}
}

// ---------------------= =---------------------
function AR(precio_base_ida,precio_base_vuelta,porcentaje,fijo){
	var precio_base_ida_vuelta = precio_base_ida + precio_base_vuelta;
	var res = precio_base_ida_vuelta * (porcentaje / 100.0) + fijo;

	return res;
}
// ---------------------= =---------------------
function updateAllPrices()
{
	updatePriceByTipo("adulto",  false);
	updatePriceByTipo("ninho",   false);
	updatePriceByTipo("infante", false);



	updateFlapper();
}
// ---------------------= =---------------------
function updateFlapper()
{
	if(seleccionVuelo.ida != null) {
		var sum = parseFloat(seleccionVuelo["adulto"].formattedPrecioTotal) +
				  parseFloat(seleccionVuelo["ninho"].formattedPrecioTotal) +
				  parseFloat(seleccionVuelo["infante"].formattedPrecioTotal);

		var nDecimals = LocaleConfig.decimalDigitsByCurrency[CURRENCY];

		var formatted = formatCurrencyQuantity(sum, false, nDecimals);

		flapperTotal.val(formatted).change();
	}
	else
		flapperTotal.val("???????").change();
}
// ---------------------= =---------------------
function buildDetailPrices(info, tipo) {
	var nDecimals = LocaleConfig.decimalDigitsByCurrency[CURRENCY];

	// console.log(info.ida.precioBase);
	var formattedPrecioBase = formatCurrencyQuantity(info.ida.precioBase,false,nDecimals);

	var titles = {adulto:"ADULTO",ninho:"NI&Ntilde;O",infante:"INFANTE"};

	var tooltip = $("#tooltip_" + tipo);

	tooltip.html("");
	var tbl = document.createElement("table");
	tooltip.append(tbl);
	$(tbl).attr("cellpadding","0").attr("cellspacing",0);
	tbl.appendChild(document.createElement("tbody"));

	tbl = $(tbl).find("tbody"); 

	tbl .append("<tr><th colspan='3'><h1>"+titles[tipo]+"</h1></th></tr>")
		.append("<tr><th class='subtitle' colspan='3'><div>Ida</div></th></tr>")
		.append("<tr><th><h3>Precio Base</h3></th><td class='currency'>"+HTML_CURRENCIES[CURRENCY]+"</td><td class='qty'>"+ formattedPrecioBase +"</td></tr>")
		.append("<tr><td colspan='3' class='divisor'></td></tr>");

	/*for(var keyTasa in info.ida.tasas) {
		var tr = document.createElement("tr");
		$(tr).append("<th>"+keyTasa+"</th>")
		     .append("<td></td>")
		     .append("<td class='qty'>"+formatCurrencyQuantity(info.ida.tasas[keyTasa],false,nDecimals)+"</td>");
		     
		tbl.append(tr);
		tbl.append("<tr><td colspan='3' class='divisor'></td></tr>");
		tbl.append("<tr><td class='detail' colspan='3'>"+tasas[keyTasa].nombre+"</tr>");
	}*/

	if(seleccionVuelo.vuelta != null) {
		tbl.append("<tr><th class='subtitle' colspan='3'><div>Vuelta</div></th></tr>");
		tbl.append("<tr><th><h3>Precio Base</h3></th><td class='currency'>Bs.</td><td class='qty'>"+formatCurrencyQuantity(info.vuelta.precioBase,false,nDecimals)+"</td></tr>");
		tbl.append("<tr><td colspan='3' class='divisor'></td></tr>");

		/*for(var keyTasa in info.vuelta.tasas) {
			var tr = document.createElement("tr");
			$(tr).append("<th>"+keyTasa+"</th>")
			     .append("<td></td>")
			     .append("<td class='qty'>"+formatCurrencyQuantity(info.vuelta.tasas[keyTasa],false,nDecimals)+"</td>");

			tbl.append(tr);
			tbl.append("<tr><td colspan='3' class='divisor'></td></tr>");
			tbl.append("<tr><td class='detail' colspan='3'>"+tasas[keyTasa].nombre+"</tr>");
		}*/
	}

	tbl.append("<tr><th class='subtitle' colspan='3'><div>Tasas</div></th></tr>")
		.append("<tr><td colspan='3' class='divisor'></td></tr>");

	$.each(seleccionVuelo.tasasTotales[tipo].tasas,function (k,v) {

		var tr = document.createElement("tr");
		$(tr).append("<th>"+k+"</th>")
			.append("<td></td>")
			.append("<td class='qty'>"+formatCurrencyQuantity(v,false,nDecimals)+"</td>");

		tbl.append(tr);
		tbl.append("<tr><td colspan='3' class='divisor'></td></tr>");
		tbl.append("<tr><td class='detail' colspan='3'>"+tasas[k].nombre+"</tr>");



	});

	tbl.append("<tr><th><h3>Total Tasas</h3></th><td class='currency'>"+HTML_CURRENCIES[CURRENCY]+"</td><td class='qty'>"+formatCurrencyQuantity(seleccionVuelo.tasasTotales[tipo].total,false,nDecimals)+"</td></tr>");
	tbl.append("<tr><td colspan='3' class='divisor'></td></tr>");


	// Calculations just for UI purposes 
	var subtotal = parseFloat(formatCurrencyQuantity(info.ida.precioBase,false,nDecimals));
	for(var key in info.ida.tasas){
		// tasas de ida
		subtotal +=  parseFloat(formatCurrencyQuantity(info.ida.tasas[key], false, nDecimals));
	}
	
	if(seleccionVuelo.vuelta != null) { // tasas de vuelta
		subtotal += parseFloat(formatCurrencyQuantity(info.vuelta.precioBase,false,nDecimals));
		for(var key in info.vuelta.tasas){
			subtotal += parseFloat(formatCurrencyQuantity(info.vuelta.tasas[key], false, nDecimals));
		}
	}

	var strSubtotal = formatCurrencyQuantity(subtotal, false, nDecimals);
	var strTotal = formatCurrencyQuantity(subtotal * info.num, false, nDecimals);

	seleccionVuelo[tipo].formattedPrecioTotal = strTotal;
	
	tbl.append("<tr><td class='cell-separator' colspan='3'><div></div></td></tr>")
	   .append("<tr><th><h3>Subtotal</h3></th><td class='currency'>"+HTML_CURRENCIES[CURRENCY]+"</td><td class='qty'>"+strSubtotal+"</td></tr>")
	   .append("<tr><td></td><td></td><td class='qty'><h3>x "+info.num+"</h3></td></tr>")
	   .append("<tr><td class='cell-separator' colspan='3'><div></div></td></tr>")
	   .append("<tr><th><h3>TOTAL</h3></th><td class='currency'>"+HTML_CURRENCIES[CURRENCY]+"</td><td class='qty'>"+strTotal+"</td></tr>");
}
// ---------------------= dibujador del formulario =---------------------
function buildRegistroPersona(tipo, numPx)
{
	var namesByTipo = {adulto:"ADULTO",ninho:"NI&Ntilde;O",infante:"INFANTE"};

	console.log('tipo',tipo);
	console.log('tipo',namesByTipo[tipo]);
	console.log('namesByTipo',namesByTipo);


	var isAdulto = (tipo=='adulto');

	var persona = document.createElement("div");
	$(persona).addClass("persona")
			  .addClass("inactive")
			  .attr("data-tipo",tipo)
			  .append("<div class='left-label'><label class='lbl-tipo'>"+namesByTipo[tipo]+"</label><label class='nro-pasajero'>PASAJERO "+numPx+"</label><div class='icon-pasajero "+tipo+"'></div></div>")
			  .append("<div class='form'><table cellpadding='0' cellspacing='0'></table></div>");

    var tbl = $(persona).find(".form table");

    tbl.append("<tr><th style='width:25%'>NOMBRES</th><th style='width:25%'>APELLIDOS</th><th style='width:25%'>TIPO DE DOCUMENTO</th><th style='width:25%'># DE DOCUMENTO</th></tr>")
	   .append("<tr>" + 
	   				"<td><div class='validable'><input type='text' id='tbx_px"+numPx+"_nombres' class='nombres'></div></td>"+
	   				"<td><div class='validable'><input type='text' id='tbx_px"+numPx+"_apellidos' class='apellidos'></div></td>" +
	   				"<td>" +
						"<div class='validable'><select id='select_px"+numPx+"_tipo_documento' class='tipo-documento'>" +
							"<option value='NONE'>Tipo de Documento</option>" +
			                "<option value='CI'>CI</option>" +
			                "<option value='PASAPORTE'>PASAPORTE</option>" +
			                "<option value='DNI'>DNI</option>" +
						"</select></div>" +
					"</td>" +
					"<td><div class='validable'><input type='text' id='tbx_px"+numPx+"_documento' class='nro-documento'></div></td>" +
					
				"</tr>")
		.append("<tr><th>TEL&Eacute;FONO</th><th colspan='2'>"+(isAdulto?"EMAIL":"FECHA NACIMIENTO")+"</th><th class='"+(isAdulto?'':'disabled')+"'>"+(isAdulto?"FECHA NACIMIENTO":"# VIAJERO FRECUENTE")+"</th></tr>"+
			"<tr>" +
			"<td><input type='text' id='tbx_px"+numPx+"_telefono' class='telefono'></td>" +
			"<td colspan='"+(isAdulto?'2':'1')+"'>" +
			/*SI ES ADULTO ENTRA EL EMAIL Y DIFERENTE ENTRA LA FECHA NACIMIENTO*/
			(isAdulto?
				//"<div class='validable' style='position: relative;'><div class='tooltip'>Debes Ingresar tu Correo Electronico</div><input type='text' id='tbx_px"+numPx+"_email' class='email' onfocus='validaciones_form.validar_email(this)' onkeyup='validaciones_form.validar_email(this)' ><span class='icon_form'><svg class='svg_icon_form'><use class='alert_form' xlink:href='#alert_form' /></svg></span></div>" :
				"<div class='validable' style='position: relative;'><div class='tooltip'>Debes Ingresar tu Correo Electronico</div><input type='text' id='tbx_px"+numPx+"_email' class='email' onfocus='validaciones_form.validar_email(this)' onkeyup='validaciones_form.validar_email(this)' ><span class='icon_form'><svg   class='svg_icon_form'><use class='alert_form' xlink:href='#alert_form' /></svg></span></div>" :
				"<div class='validable' style='position: relative;'><div class='tooltip'>"+(tipo=='infante'?'Infante desde los 8 dias de nacido hasta antes de los 2 a&ntilde;os':'Ni&ntilde;o desde los 2 a&ntilde;os hasta antes de cumplir 12 a&ntilde;os')+"</div><input type='text' id='picker_px"+numPx+"_nacimiento' class='calendar nacimiento' text='(Ingrese fecha de nacimiento)' onkeypress='return false;'></div>"
			) +
			"</td>" +
			(isAdulto?"":"<td></td>") +

			"<td>" +
			/*SI ES ADULTO ENTRA LA FECHA DE NACIMIENTO Y DIFERENTE ENTRA VIAJERO FRECUENTE*/
			(isAdulto?
				"<div class='validable'><input type='text' id='picker_px"+numPx+"_nacimiento' class='calendar nacimiento' text='(Ingrese fecha de nacimiento)' onkeypress='return false;'></div>":
				"<input readonly type='text' id='tbx_px"+numPx+"_px_frecuente' class='nro-viajero-frecuente'>"
			) +
			"</td>" +

			"</tr>"
		)

		.append("" +
			(isAdulto?
				"<tr><th colspan='2' class='disabled'># VIAJERO FRECUENTE</th><th colspan='2'></th></tr><td colspan='2'><input readonly type='text' id='tbx_px"+numPx+"_px_frecuente' class='nro-viajero-frecuente'></td><td colspan='2'><span class='disabled'>&iquest;No eres viajero frecuente?<a href='#''>REG&Iacute;STRATE</a></span></td>" :
				"<tr><td colspan='4'><span style='color: #4c0a00; font-size: 15px;'><b>Se debe presentar documentos para confirmar la edad</b></span><span class='disabled'>&iquest;No eres viajero frecuente?<a href='#''>REG&Iacute;STRATE</a></span></td></tr>"
			) +

			"");

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
// ---------------------= =---------------------
// ---------------------= =---------------------
function translateTaxes(fromResponse) 
{
	if(fromResponse['tasaTipoPasajero'] == null){


		var tasaTipoPasajero = new Array();
		$.each(fromResponse['tasaIda'].tasa,function (k,v) {
			tasaTipoPasajero.push({
				"tipoTasa":v.tipo_tasa["#text"],
				"tipoPasajero":"Adulto",
				"tasa":""
			});

		});

		var rawTaxesByPx =tasaTipoPasajero;
		
	}else{
		var rawTaxesByPx = fromResponse['tasaTipoPasajero']['TasaTipoPasajero'];
	}


	var rawIdaTaxes;
	if(fromResponse['tasaIda'] != null) 
		rawIdaTaxes = fromResponse['tasaIda']['tasa'];
	else 
		rawIdaTaxes = [];

	//aca verificamos que este en un array las idastaxes
	if (!Array.isArray(rawIdaTaxes)){
		var array_ida_aux = new Array();
		array_ida_aux.push(rawIdaTaxes);
		rawIdaTaxes = array_ida_aux;
	}


	var rawVueltaTaxes;
	if(fromResponse['tasaVuelta'] == null)  // podria no existir
		rawVueltaTaxes = null;
	else
		rawVueltaTaxes = fromResponse['tasaVuelta']['tasa'];

	//aca verificamos que este en un array las vueltas
	
	if (rawVueltaTaxes!= null && !Array.isArray(rawVueltaTaxes)){
		var array_vuelta_aux = new Array();
		array_vuelta_aux.push(rawVueltaTaxes);
		rawVueltaTaxes = array_vuelta_aux;
	}

	var to = {
		byPassenger: {},
		byTax : {}
	};

	var keyEquiv = {
		"Adulto" : "adulto",
		"Niño"	 : "ninho",
		"Infante": "infante"
	};

	for(var i=0;i<rawTaxesByPx.length;i++) {
		var rawTax = rawTaxesByPx[i];

		var taxKey = rawTax['tipoTasa'];
		var taxName = rawTax['tasa'];
		var pxKey = keyEquiv[rawTax['tipoPasajero']];

		if(false == (taxKey in to.byTax)) {
			to.byTax[taxKey] = { // adding new tax
				nombre: taxName
			};
		}

		if(false == (pxKey in to.byPassenger))
			to.byPassenger[pxKey] = [];

		if(to.byPassenger[pxKey].indexOf(taxKey) == -1) // add to list if not exists
			to.byPassenger[pxKey].push(taxKey);
	}


	// tasas ida
	for(var i=0;i<rawIdaTaxes.length;i++) {
		var rawTax = rawIdaTaxes[i];
		var taxKey = rawTax['tipo_tasa']['#text'];

		if(false == (taxKey in to.byTax)) // completing unknown tax with blank name
			to.byTax[taxKey] = { nombre: "" };

		to.byTax[taxKey].ida = { fijo: 0.0, porcentaje: 0.0 };	 // adding

		if('importe' in rawTax){
			to.byTax[taxKey].ida.fijo = parseFloat(rawTax['importe']['#text']);
		} else if('pcje' in rawTax){
			to.byTax[taxKey].ida.porcentaje = parseFloat(rawTax['pcje']['#text']);
		}
	}

	// tasas vuelta
	if(rawVueltaTaxes != null) {
		for(var i=0;i<rawVueltaTaxes.length;i++) {
			var rawTax = rawVueltaTaxes[i];
			var taxKey = rawTax['tipo_tasa']['#text'];

			if(false == (taxKey in to.byTax)) // completing unknown tax with blank name
				to.byTax[taxKey] = { nombre: "" };

			to.byTax[taxKey].vuelta = { fijo: 0.0, porcentaje: 0.0 }; // adding

			if('importe' in rawTax){
				to.byTax[taxKey].vuelta.fijo = parseFloat(rawTax['importe']['#text']);
			} else if('pcje' in rawTax){
				to.byTax[taxKey].vuelta.porcentaje = parseFloat(rawTax['pcje']['#text']);
			}
		}
	}

	return to;
}
// ---------------------= =---------------------
function translatePercentsByPax(from)
{
	var to = {};

	var keyEquiv = {
		"Adulto" : "adulto",
		"Niño"	 : "ninho",
		"Infante": "infante"
	};

	for(var i=0;i<from.length;i++) {
		var rawPercent = from[i];

		if(false === (rawPercent.clase in to)) {
			to[rawPercent.clase] = {
				adulto: 0,
				ninho: 0,
				infante: 0
			};
		}

		var keyPx = keyEquiv[rawPercent['tipoPasajero']];

		to[rawPercent.clase][keyPx] 
			= (parseInt(rawPercent['porcentaje'])/100.0);
	}

	return to;
}
// ---------------------= =---------------------
function translateFlights(rawFlights, rawTarifas, date, paxPercentsByClass)
{
	if(rawFlights == null)
		return null;

	// when there is only one result, the response is an object, not an array, 
	// so it must be translated
	if(rawFlights.constructor !== Array) {
		var obj = rawFlights;
		rawFlights = [];
		rawFlights.push(obj);
	}

	var ratesByClass = {};
	var fareCodesByClass = {};
	var rateIDsByClass = {};

	for(var i=0;i<rawTarifas.length;i++) {
		var rawTarifa = rawTarifas[i];

		if(rawTarifa["clases"] != null 
			&& rawTarifa["fare_code"] != null
			&& rawTarifa["fare_code"] != "SSENIOR" // exception rule (hardcoded :S )
		  ) 
		{
			var importe = parseFloat(rawTarifa["importe"]);

			if(rawTarifa["recargos"] != null) { // si existiese un recargo adicional
				var recargo = parseFloat(rawTarifa["recargos"]["recargo"]["importe"]);
				importe += recargo;
			}
			ratesByClass[rawTarifa["clases"]] = importe;

			fareCodesByClass[rawTarifa["clases"]] = rawTarifa["fare_code"];
			rateIDsByClass[rawTarifa["clases"]] = rawTarifa["ID"];
		}
	}

	var to = {
		flights:[],
		flightOptions:{},
		compartments:[]
	};

	// Traducir datos del servicio
	for(var i=0;i<rawFlights.length;i++) {
		var rawFlight = rawFlights[i];

		var flight = {
			numVuelo 		: rawFlight["num_vuelo"],
			horaSalida 		: {hh:0,mm:0},
			horaLlegada 	: {hh:0,mm:0},
			duracion 		: {hrs:0,mins:0},
			operador 		: "BoA",
			linea			: rawFlight["linea"],
			tarifas 		: {}, // por compartimiento
			origen 			: rawFlight["origen"],
			destino 		: rawFlight["destino"],
			tipoAvion		: rawFlight["tipo_avion"],
			fecha 			: date,
			numOpcion 		: parseInt(rawFlight["num_opcion"]),
			validado		:rawFlight["validado"]
		};

		if(rawFlight["co_operador"] !=null){
			if(rawFlight["co_operador"] == 'IB'){
				flight.operador = "Iberia";
				flight.linea = rawFlight["co_operador"];
			}

		}

		// hora salida can also be +1 when is second or third flight of complete trip (it departs a day(s) after)
		if (rawFlight["hora_salida"].length == 6 && rawFlight["hora_salida"].substr(4, 2) == "+1") {
            // one day after
            var flightDate = compactToJSDate(date);
            flightDate.setDate(flightDate.getDate() + 1);
 
            flight["fecha"] = formatCompactDate(flightDate);
        }
        else
            flight["fecha"] = date;


		if(rawFlight["hora_llegada"].length == 6 && rawFlight["hora_llegada"].substr(4,2) == "+1")  {
			// one day after
			var flightDate = compactToJSDate(date);
			flightDate.setDate(flightDate.getDate() + 1);

			flight["fechaLlegada"] = formatCompactDate(flightDate);
		}
		else
			flight["fechaLlegada"] = date;

		// Formateo de horas
		flight.horaSalida.hh = parseInt(rawFlight["hora_salida"].substr(0,2));
		flight.horaSalida.mm = parseInt(rawFlight["hora_salida"].substr(2,2));

		flight.horaLlegada.hh = parseInt(rawFlight["hora_llegada"].substr(0,2));
		flight.horaLlegada.mm = parseInt(rawFlight["hora_llegada"].substr(2,2));

		flight.duracion.hrs = rawFlight["tiempo_vuelo"].substr(0,2);
		flight.duracion.mins = rawFlight["tiempo_vuelo"].substr(3,2);

		// buscar mejor tarifa por clase
		var rawClasses = rawFlight["clases"]["clase"];

		//
		for (var k = 0; k < rawClasses.length; k++) {
			if (rawClasses[k]["estado"] != "A") // solo tomar en cuenta estado A
				continue;

			var flightClass = rawClasses[k]["cls"];

			if (false == (flightClass in ratesByClass))
				continue;

			if (false == (flightClass in paxPercentsByClass)) // parche!
				continue;

			var rateValue = ratesByClass[flightClass];
			var compartmentKey = rawClasses[k]["compart"];
			var rateID = rateIDsByClass[flightClass];

			// Tabla para mantener un orden unico de compartimientos al mostrar
			if (to.compartments.indexOf(compartmentKey) == -1) // no encontrado
				to.compartments.push(compartmentKey);

			// elegir la tarifa mas baja por compartimiento

			if (compartmentKey in flight.tarifas) {
				if (rateValue < flight.tarifas[compartmentKey].monto) {
					flight.tarifas[compartmentKey].monto = rateValue;
					flight.tarifas[compartmentKey].clase = flightClass;
					flight.tarifas[compartmentKey].fareCode = fareCodesByClass[flightClass];
					flight.tarifas[compartmentKey].ID = rateID;
				}
			} else {
				flight.tarifas[compartmentKey] = { // crear nuevo
					clase: flightClass,
					monto: rateValue,
					compart: compartmentKey,
					index: to.compartments.indexOf(compartmentKey),
					fareCode: fareCodesByClass[flightClass],
					ID: rateID
				};
			}


		}


		// añadir porcentajes por pasajero por tasa y tipo
		for(var compartmentKey in flight.tarifas) {
			var cls = flight.tarifas[compartmentKey].clase;

			flight.tarifas[compartmentKey]['porcentajes'] = paxPercentsByClass[cls];
		}

		// procesamiento de las opciones
		if(typeof(to.flightOptions["opcion_" + flight.numOpcion]) === 'undefined') { // primera escala
			to.flightOptions["opcion_" + flight.numOpcion] = {
				numOpcion 		: flight.numOpcion,
				vuelos 			: [],
				duracionVuelo	: {hrs:0,mins:0},
				duracionTotal	: {hrs:0,mins:0},
				horaSalida 		: null,
				horaLlegada 	: null,
				origen 			: "",
				destino 		: "",
				// los vuelos de una misma opcion deberian tener las mismas tarifas
				tarifas     	: (flight.validado=='si')?flight.tarifas:null,
				code 			: generateRandomCode(10)
			};

		} else { // segunda escala, tercera, etc.
			// parche para error en servicio (datos no completos)
			if(flight.origen == null) { 
				// el origen es el destino del ultimo vuelo
				var opc = to.flightOptions["opcion_" + flight.numOpcion];
				flight.origen = opc.vuelos[opc.vuelos.length-1].destino;


				if (to.flightOptions["opcion_" + flight.numOpcion].tarifas == null){
					to.flightOptions["opcion_" + flight.numOpcion].tarifas = (flight.validado=='si')?flight.tarifas:null;
				}


			}
		}

		to.flightOptions["opcion_" + flight.numOpcion].vuelos.push(flight);

		to.flights.push(flight);
	} // flights

	// completar datos de opciones con informacion de sus vuelos
	for(var i in to.flightOptions) {
		var opc = to.flightOptions[i];
		opc.origen = opc.vuelos[0].origen;
		opc.destino = opc.vuelos[opc.vuelos.length-1].destino;

		opc.horaSalida = opc.vuelos[0].horaSalida;
		opc.fechaSalida = opc.vuelos[0].fecha;

		opc.horaLlegada = opc.vuelos[opc.vuelos.length-1].horaLlegada;
		opc.fechaLlegada = opc.vuelos[opc.vuelos.length-1].fechaLlegada;

		// calcular duracion total
		var minsVuelo = 0;
		var minsTotal = 0;

		for(var k=0;k<opc.vuelos.length;k++) {
			minsVuelo += parseInt(opc.vuelos[k].duracion.hrs)*60 
				 	   + parseInt(opc.vuelos[k].duracion.mins);

			if(k>0){ // es el segundo vuelo o mayor
				minsTotal += calculateMinutesDifference(
					opc.vuelos[k-1].horaLlegada, 
					opc.vuelos[k].horaSalida);
			}
		}

		minsTotal += minsVuelo;

		opc.duracionVuelo.hrs = parseInt(minsVuelo/60);
		opc.duracionVuelo.mins = minsVuelo % 60;

		opc.duracionTotal.hrs = parseInt(minsTotal/60);
		opc.duracionTotal.mins = minsTotal % 60;

		allOptions[opc.code] = opc;
	}

	return to;
}
// ---------------------= =---------------------
function prepareSeleccionVueloToSend()
{
	var packedSeleccionVuelo = { };
	packedSeleccionVuelo.adulto = translateSeleccionVueloForService(seleccionVuelo.adulto);
	packedSeleccionVuelo.ninho = translateSeleccionVueloForService(seleccionVuelo.ninho);
	packedSeleccionVuelo.infante = translateSeleccionVueloForService(seleccionVuelo.infante);
	packedSeleccionVuelo.vuelosIda = [];

	var vuelos = allOptions[seleccionVuelo.ida.opcCode].vuelos;

	for(var i=0;i<vuelos.length;i++) { 
		var vuelo = vuelos[i]; 
		packedSeleccionVuelo.vuelosIda.push(
			{
				horaSalida: ("00"+vuelo.horaSalida.hh).slice(-2) + ("00"+vuelo.horaSalida.mm).slice(-2),
				horaLlegada: ("00"+vuelo.horaLlegada.hh).slice(-2) + ("00"+vuelo.horaLlegada.mm).slice(-2),
				numVuelo: vuelo.numVuelo,
				tipoAvion: vuelo.tipoAvion,
				fechaSalida: vuelo.fecha,
				fareCode: vuelo.tarifas[seleccionVuelo.ida.compartment].fareCode,
				clase: vuelo.tarifas[seleccionVuelo.ida.compartment].clase,
				origen: vuelo.origen,
				destino: vuelo.destino
			}
		);
	}

	if(seleccionVuelo.vuelta != null) {
		packedSeleccionVuelo.vuelosVuelta = [];
		vuelos = allOptions[seleccionVuelo.vuelta.opcCode].vuelos;

		for(var i=0;i<vuelos.length;i++) { 
			var vuelo = vuelos[i];
			packedSeleccionVuelo.vuelosVuelta.push(
				{
					horaSalida: ("00" + vuelo.horaSalida.hh).slice(-2) + ("00"+vuelo.horaSalida.mm).slice(-2),
					horaLlegada: ("00" + vuelo.horaLlegada.hh).slice(-2) + ("00"+vuelo.horaLlegada.mm).slice(-2),
					numVuelo: vuelo.numVuelo,
					tipoAvion: vuelo.tipoAvion,
					fechaSalida: vuelo.fecha,
					fareCode: vuelo.tarifas[seleccionVuelo.vuelta.compartment].fareCode,
					clase: vuelo.tarifas[seleccionVuelo.vuelta.compartment].clase,
					origen: vuelo.origen,
					destino: vuelo.destino
				}
			);
		}
	}

	return packedSeleccionVuelo;
}
// ---------------------= =---------------------
function getSelectedSitesCount() 
{
	var pxSelections = $("#widget_resumen_reserva .selector-pax ul");
	var total = 0;

	for(var i=0;i<pxSelections.length;i++) {
		var ul = $(pxSelections[i]);
		var tipo = ul.data("tipo");

		if(tipo=="adulto" || tipo=="ninho")
			total += parseInt(ul.find("li.selected").data("count"));
	}

	return total;
}

// ---------------------= =---------------------
function getTypeSelectedSitesCount(tipo_seleccionado)
{
	var pxSelections = $("#widget_resumen_reserva .selector-pax ul");
	console.log(pxSelections)
	var sitio_seleccionados = {
		total_adulto : 0,
		total_ninho: 0
	};

	for(var i=0;i<pxSelections.length;i++) {
		var ul = $(pxSelections[i]);
		var tipo = ul.data("tipo");

		if(tipo=="adulto"){
			sitio_seleccionados.total_adulto += parseInt(ul.find("li.selected").data("count"));

		}else if(tipo=="ninho"){
			sitio_seleccionados.total_ninho += parseInt(ul.find("li.selected").data("count"));
		}

	}

	if(tipo_seleccionado == 'adulto'){
		var count = sitio_seleccionados.total_adulto;
		var total_para_seleccionar = 9 - count;
		console.log('total_para seleccionar ',total_para_seleccionar);

		$.each($(pxSelections[1]).children('li'),function (k,v) {

			console.log(v)
			if(total_para_seleccionar < k){
				$(v).hide();
			}else{
				$(v).css({"display":""});
			}

		});

	}else if (tipo_seleccionado == 'ninho'){
		var count = sitio_seleccionados.total_ninho;
		var total_para_seleccionar = 9 - count;
		console.log('total_para seleccionar ',total_para_seleccionar);

		$.each($(pxSelections[0]).children('li'),function (k,v) {

			console.log(v)
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
function translateSeleccionVueloForService(sel) 
{
	console.log(sel);

	return {
		num: 			sel.num,
		precioTotal: 	sel.formattedPrecioTotal,
		ida: 			translateSeleccionVueloDetailForService(sel.ida),
		vuelta: 		translateSeleccionVueloDetailForService(sel.vuelta)
	};
}
// ---------------------= =---------------------
function translateSeleccionVueloDetailForService(detail)
{
	if(detail.precioBase == null) // it might be a empty object
		return {};

	var tasas = [];
	for(var k in detail.tasas) 
		tasas.push(
			{
				key:k, 
				value: parseInt(formatCurrencyQuantity(detail.tasas[k], false, 0))
			});

	return {
		precioBase	: parseInt(formatCurrencyQuantity(detail.precioBase,false,0)) ,
		tasas 		: tasas
	}
}
// ---------------------= =---------------------
function translateConstraints(rawConstraints)
{
	var idaConstraints = {};
	var vueltaConstraints = {};

	for(var i=0;i<rawConstraints.length;i++) {
		// ida
		var I = rawConstraints[i]["I"];
		var V = rawConstraints[i]["V"];

		if(false == (I in idaConstraints))
			idaConstraints[I] = [];

		idaConstraints[I].push(V);

		// vuelta (I swapped with V)
		if(false == (V in vueltaConstraints))
			vueltaConstraints[V] = [];

		vueltaConstraints[V].push(I);
	}

	return {
		ida: idaConstraints,
		vuelta: vueltaConstraints
	};
}
// ---------------------= =---------------------
function showSimpleDialog(msg, redirectUrl)
{
	$("#dialog_overlay").show();
	$("#simple_dialog")
		.show()
		.find(".description").html(msg);

	$("#ui_reserva_vuelos").addClass("blured");

	if(redirectUrl != null)
		$("#simple_dialog .button").click(function(){
			closeSimpleDialog(redirectUrl);	
		});
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
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= validar email=---------------------

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

function updateTasasToolTip(){

	var objTasas = {};
	if(seleccionVuelo.tasasTotales.adulto.total > 0 ){
		$.each(seleccionVuelo.tasasTotales.adulto.tasas,function (k,v) {

			if(k in objTasas){
				objTasas[k] += v * seleccionVuelo.adulto.num;
			}else{
				objTasas[k] = v * seleccionVuelo.adulto.num;
			}
		});
	}

	if(seleccionVuelo.tasasTotales.ninho.total > 0 ){
		$.each(seleccionVuelo.tasasTotales.ninho.tasas,function (k,v) {

			if(k in objTasas){
				objTasas[k] += v * seleccionVuelo.ninho.num;
			}else{
				objTasas[k] = v * seleccionVuelo.ninho.num;
			}
		});
	}

	if(seleccionVuelo.tasasTotales.infante.total > 0 ){
		$.each(seleccionVuelo.tasasTotales.infante.tasas,function (k,v) {

			if(k in objTasas){
				objTasas[k] += v * seleccionVuelo.infante.num;
			}else{
				objTasas[k] = v * seleccionVuelo.infante.num;
			}
		});
	}

	console.log(objTasas);
	var tooltip = $("#tooltip_tasas");
	$("#tooltip_tasas").html("");
	var tbl = document.createElement("table");
	tooltip.append(tbl);
	$(tbl).attr("cellpadding","0").attr("cellspacing",0);
	tbl.appendChild(document.createElement("tbody"));
	tbl = $(tbl).find("tbody");


	tbl.append("<tr><th class='subtitle' colspan='3'><div>TASAS TOTALES</div></th></tr>");
	tbl.append("<tr><td colspan='3' class='divisor'></td></tr>");

	var nDecimals = LocaleConfig.decimalDigitsByCurrency[CURRENCY];
	$.each(objTasas,function (k,v) {
		var tr = document.createElement("tr");
		$(tr).append("<th>"+k+"</th>")
			.append("<td></td>")
			.append("<td class='qty'>"+formatCurrencyQuantity(v,false,nDecimals)+"</td>");

		tbl.append(tr);
		tbl.append("<tr><td colspan='3' class='divisor'></td></tr>");
		tbl.append("<tr><td class='detail' colspan='3'>"+tasas[k].nombre+"</tr>");
	});

}
