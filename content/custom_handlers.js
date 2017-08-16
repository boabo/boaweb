// ---------------------------------------------------------------------------

var CURRENCY = "bs"; // "euro", "bs" , "usd"
var HTML_CURRENCIES = {bs:"Bs.",euro:"&euro;",usd:"USD"};
var CODE_CURRENCIES = {bs:"BOB",euro:"EU",usd:"USD"};
var SERVICE_CREDENTIALS_KEY = "BIlpbSRa4cLutdqSVK+Z7TDl8RnhQEkZClKiiiWK18AeDVzOiGo2WV5FZkG3HV7avD3D6Zu33KAFoiyJziA/td/nH+b9Z1kb77X452Mayi5jCCz9Wjw9QRQBoa5PfQoCa/bCZRN40V+c/aPrUj4L5qXJAmmNVHtpFQATgKAZyafuX1Mmp6LNUQ==";
var server = 'localhost'; //puede ser "+server+"

// ---------------------------------------------------------------------------
var LocaleConfig = {
    countries: [
        {key:"BO",value:"Bolivia"},
        {key:"USA",value:"Estados Unidos"},
        {key:"ES",value:"Espa&ntilde;a"},
        {key:"ARG",value:"Argentina"}
    ],
    languages: [
        {key:"ES",value:"Espa&ntilde;ol"},
        {key:"PT",value:"Portugues"},
        {key:"EN",value:"Ingl&eacute;s"}
    ],
    currencies: [
        {key:"BOB",value:"Bolivianos"},
        {key:"EU",value:"Euros"},
        {key:"USD",value:"D&oacute;lares Estadounidenses"}
    ],
    decimalDigitsByCurrency:{
        bs: 0,
        euro: 2,
        usd: 2
    }
};


var BoA = {
    urls : {
        home : "home.html",
        info_page : "info_page.html",
        info_movil: "info_movil.html",
        facebook: "http://www.facebook.com/bolivianaDeAviacion",
        twitter: "http://www.twitter.com/BoABolivia",
        instagram: "http://i.instagram.com/boa_bolivia",
        youtube: "http://www.youtube.com/user/BoADigital",
        revista_destinos: "http://www.destinos.com.bo",
        ventas_web: "mailto:ventasweb@boa.bo",
        info_madrid: "http://www.minetur.gob.es/turismo/es-ES/Paginas/IndexTurismo.aspx",
        info_salta: "http://www.turismo.gov.ar/",
        info_bs_as: "http://www.turismo.gov.ar/",
        info_sao_paulo: "http://www.turismo.gov.br/turismo/home.html",
        info_miami: "http://www.miamibeachfl.gov/tcd/",
        info_turismo_bolivia: "http://www.minculturas.gob.bo",
        contrato_transporte: "content/docs/contrato_transporte.pdf",
        convocatorias: "http://sms.obairlines.bo/webboa/menupublicaciones.htm",
		/* HEADER MENU */
        reservar_vuelos: 	"http://www.boa.bo/bolivia/inicio",
        estado_vuelo: 	 	"http://www.boa.bo/bolivia/inicio",
        horario_vuelos: 	"http://www.boa.bo/bolivia/inicio",
		/* RESULTADOS DE HORARIOS DE VUELOS */
        flight_schedule_results : "http://"+server+"/reserva_vuelos.html",
		/* MAPAS DE OFICINAS */
        office_maps : "http://"+server+"",
		/* BOA EN REDES SOCIALES */
        social_networks: "http://"+server+"",
		/* CALL CENTER */
        call_center: "http://"+server+"",
		/* WEB CHECK IN */
        web_check_in : "https://portal.iberia.es/webcki_handling/busquedaLoader.do?aerolinea=OB",

		/* SERVICES */
        // nearest_dates_service: "http://"+server+"/content/fake_services/nearest_dates.php",
        nearest_dates_service: "http://skbpruebas.cloudapp.net/ServicesA1/BasicReservationServiceA1.svc/Calendar",
        flights_schedule_service: "http://skbpruebas.cloudapp.net/ServicesA1/BasicReservationServiceA1.svc/AvailabilityPlusValuationsShort",
        validate_flight_selection_service: "http://"+server+"/~faviofigueroa/boaweb/content/fake_services/validate_flight_selection_service.php",
        register_passengers_service: "http://"+server+"/~faviofigueroa/boaweb/content/fake_services/register_passengers_service.php",
        change_locale_settings_service: "http://"+server+"/content/fake_services/change_locale_settings.php"
    },

    defaultConsultaVuelos : {
        origen: 'VVI',
        destino: 'CBB',
        fechaIda : '20170816',//formatCompactDate(new Date()), // today
        fechaVuelta: '20170818',//null, // no flight back
        adulto: 3,
        infante: 0,
        ninho: 0
    },

    defaultApologyMessage : "En estos momentos no podemos atender su solicitud, por favor intente mas tarde.",
    defaultURLAfterFail: "http://www.boa.bo",

    // Configuracion de bancos
    banks : {
        columnsPerRow: 3, // Cambiar este tamaño de acuerdo a la grilla

        bcp: {
            visible: true,
            enabled: true,
            url: "http://www.kittenwar.com"
        },
        bnb: {
            visible: true,
            enabled: true,
            url: "http://www.kittenwar.com"
        },
        economico: {
            visible: true,
            enabled: false,
            url: "http://www.kittenwar.com"
        },
        fassil: {
            visible: true,
            enabled: false,
            url: "http://www.kittenwar.com"
        },
        fie: {
            visible: true,
            enabled: true,
            url: "http://www.kittenwar.com"
        },
        ganadero: {
            visible: true,
            enabled: true,
            url: "http://www.kittenwar.com"
        },
        masterCard: {
            visible: true,
            enabled: true,
            url: "http://www.kittenwar.com"
        },
        prodem: {
            visible: true,
            enabled: true,
            url: "http://www.kittenwar.com"
        },
        union: {
            visible: true,
            enabled: true,
            url: "http://www.kittenwar.com"
        },
        visa: {
            visible: true,
            enabled: true,
            url: "http://www.kittenwar.com"
        }
    },

    //configuracion de bancos nuevo
    bancos :
        {
            debito:[
                {
                    nombre:"banco_union",
                    img:"content/images/bancos/banco-union.jpg",
                    url:"http://www.google.com",
                    visible:true,
                    enabled:true,
                    type_:"POST"
                },
                {
                    nombre:"economico",
                    img:"content/images/bancos/banco_economico.png",
                    url:"http://www.google.com",
                    visible:true,
                    enabled:true,
                    type_:"POST"
                },
                {
                    nombre:"bnb",
                    img:"content/images/bancos/bnb.png",
                    url:"http://www.google.com",
                    visible:true,
                    enabled:false,
                    type_:"POST"
                },
                {
                    nombre:"bcp",
                    img:"content/images/bancos/banco_bcp.png",
                    url:"http://www.google.com",
                    visible:true,
                    enabled:false,
                    type_:"POST"
                },
                {
                    nombre:"bisa",
                    img:"content/images/bancos/banco_bisa.png",
                    url:"http://www.google.com",
                    visible:true,
                    enabled:false,
                    type_:"POST"
                },
                {
                    nombre:"ecofuturo",
                    img:"content/images/bancos/banco_ecofuturo.png",
                    url:"http://www.google.com",
                    visible:true,
                    enabled:false,
                    type_:"POST"
                },
                {
                    nombre:"comunidad",
                    img:"content/images/bancos/banco_comunidad.jpg",
                    url:"http://www.google.com",
                    visible:true,
                    enabled:false,
                    type_:"POST"
                }
            ],
            credito:[
                {
                    nombre:"visa",
                    img:"content/images/bancos/visa.png",
                    url:"http://www.google.com",
                    visible:true,
                    enabled:true,
                    type_:"POST",
                    mensaje:"Por motivos en mejoras sobre nuestra plataforma para pago con Tarjetas de Credito. Nos vemos obligados a suspender este servicio. Por favor intente realizar su pago por medio de Banca Electronica o Billtera Electronica. Disculpe las molestias"
                },
                {
                    nombre:"mastercard",
                    img:"content/images/bancos/mastercard.png",
                    url:"http://www.google.com",
                    visible:true,
                    enabled:true,
                    type_:"POST",
                    mensaje:"Por motivos en mejoras sobre nuestra plataforma para pago con Tarjetas de Credito. Nos vemos obligados a suspender este servicio. Por favor intente realizar su pago por medio de Banca Electronica o Billtera Electronica. Disculpe las molestias"

                }

            ],
            billetera:[
                {
                    nombre:"tigo",
                    img:"content/images/bancos/tigo.jpg",
                    url:"http://www.google.com",
                    visible:true,
                    enabled:true,
                    type_:"POST"
                }
            ]
        }
    ,

    // Configuracion de Widget (compra)
    widgetReservas: {
        enableCompraStage: true,
        redirectUrlPxRegisterFinished: "http://www.kittenwar.com"
    }
};
// ---------------------------------------------------------------------------
function handle_reserva_vuelos(parameters)
{
    console.log("desde:" + parameters.desde);
    console.log("hasta:" + parameters.hasta);

    console.log(parameters.salida);
    if(parameters.salida!=null){
        console.log("salida.dd:" + parameters.salida.dd);
        console.log("salida.mm:" + parameters.salida.mm);
        console.log("salida.yyyy:" + parameters.salida.yyyy);
    }

    console.log(parameters.solo_ida);

    if(parameters.solo_ida == false){
        if(parameters.regreso!=null){
            console.log("regreso.dd:" + parameters.regreso.dd);
            console.log("regreso.mm:" + parameters.regreso.mm);
            console.log("regreso.yyyy:" + parameters.regreso.yyyy);
        }
    }

    console.log(parameters.is_senior);
    console.log(parameters.nro_adultos);
    console.log(parameters.nro_ninhos);
    console.log(parameters.nro_bebes);
    console.log(parameters.flexible_en_fechas);
}
// ---------------------------------------------------------------------------
function handle_change_language(language)
{
    console.log("NUEVO LENGUAJE: " + language);
}
// ---------------------------------------------------------------------------
function handle_web_check_in(parameters)
{
    console.log(parameters);
}
// ---------------------------------------------------------------------------
function handle_buscar_estado_vuelo(parameters)
{
    console.log(parameters);
}
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------