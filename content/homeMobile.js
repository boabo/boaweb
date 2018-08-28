/**
 * Created by faviofigueroa on 08/8/18.
 */

jQuery( document ).ready(function( $ ) {



    var $homeMobile = $("#homeMobile");
    var $checkMob = $homeMobile.find(".mainRow");
    var $reservaVuelosMob = $homeMobile.find('#reservaVuelosMob');

//campos
    var $SelectOrigen = $reservaVuelosMob.find('[data-id="select_desde"]');
    var $SelectDestino = $reservaVuelosMob.find('[data-id="select_hasta"]');
    var $btnIdaMob = $reservaVuelosMob.find("#rbtn_ida_Mob");
    var $btnIdaVueltaMob = $reservaVuelosMob.find("#rbtn_ida_vuelta_Mob");
    var $dateFrom = $reservaVuelosMob.find("#from");
    var $dateTill = $reservaVuelosMob.find("#till");
    var $selectAdulto = $reservaVuelosMob.find('[data-tipo="select_nro_adultos"]');
    var $selectNinho = $reservaVuelosMob.find('[data-tipo="select_nro_ninhos"]');
    var $selectBebe = $reservaVuelosMob.find('[data-tipo="select_nro_bebes"]');
    var $btnEnviar = $reservaVuelosMob.find('[data-id="btn_buscar_vuelos"]');

    var $footerMob = $("#footerMob");

    $checkMob.click(function () {
        var $that = $(this).next('.row');
        if ($that.hasClass('inactive')) {
            $that.show();
            $that.removeClass('inactive')
        } else {
            $that.hide();
            $that.addClass('inactive')
        }


        $footerMob.css({"position": "relative", "margin-top": "250px"});
    });

    $reservaVuelosMob.find('[data-group="ida_vuelta"]').click(function () {
        if ($btnIdaMob.hasClass("checked")) {
            $dateTill.closest('.row').show();
            $dateTill.closest('.row').prev().show();
        } else {
            $dateTill.closest('.row').hide();
            $dateTill.closest('.row').prev().hide();
        }
    });

    $btnEnviar.click(function () {
        var parms = {
            desde: $SelectOrigen.val(),
            hasta: $SelectDestino.val(),
            fecha_salida: $dateFrom.val(),
            fecha_regreso: $dateTill.val(),
            solo_ida: $btnIdaMob.hasClass("checked"),
            nro_adultos: $selectAdulto.val(),
            nro_ninhos: $selectNinho.val(),
            nro_bebes: $selectBebe.val(),
            flexible_en_fechas: '',
            moneda: ''
        };

        console.log(parms)
        // -----= VALIDATION PROCESS =------
        var valid_form = true
        // origen
        if (parms.desde == "") {
            $SelectOrigen.css({"border-left": "10px solid red"});
            valid_form = false;
        }

        // destino
        if (parms.hasta == "") {
            $SelectDestino.css({"border-left": "10px solid red"});
            valid_form = false;
        }

        // fecha de salida
        if (parms.fecha_salida == "") {
            $dateFrom.next().css({"border-left": "10px solid red"});
            ;
            valid_form = false;
        }

        // fecha_regreso
        if (false == parms.solo_ida && $dateTill.val() === "") {
            $dateTill.next().css({"border-left": "10px solid red"});
            ;
            valid_form = false;
        }
        if (false == valid_form) {
            setTimeout(function () {
                $SelectOrigen.css({"border-left": ""});
                $SelectDestino.css({"border-left": ""});
                $dateFrom.next().css({"border-left": ""});
                $dateTill.next().css({"border-left": ""});
            }, 1500);
            return;
        }

        var URL_RESERVA_VUELOS = 'https://www.resiberweb.com/PaxBOAv2/Default.aspx';

        var data = {
            KEY: 'D08D3150-580D-4E6B-83DB-C02158114D9A', // fixed value, must not change
            FIDA: parms.fecha_salida,
            FVUELTA: parms.fecha_regreso,
            MONEDA: parms.moneda,
            ORIGEN: parms.desde,
            DESTINO: parms.hasta,
            ADT: parms.nro_adultos,
            CHD: parms.nro_ninhos,
            INF: parms.nro_bebes,
            IPCLIENT: "",
        };

        var form = $('<form target="_blank" method="POST" action="' + URL_RESERVA_VUELOS + '">');
        $.each(data, function (k, v) {
            form.append('<input type="hidden" name="' + k + '" value="' + v + '">');
        });

        $("#div_submit").html("").append(form); // IE FIX

        form.submit();
    });


//cantidad de pasajeros
    $selectAdulto.change(function () {
        var pasajeros_adultos = $selectAdulto.val();
        var count_permitidos = 9 - parseInt(pasajeros_adultos);

        $.each($selectNinho.children(), function (k, v) {

            if (count_permitidos < k) {
                $(v).hide();
            } else {
                $(v).show();
            }
        });
        $.each($selectBebe.children(), function (k, v) {

            if (pasajeros_adultos < k) {
                $(v).hide();
            } else {
                $(v).show();

            }
        });
    });

    $selectNinho.change(function () {
        var pasajeros_ninos = $selectNinho.val();
        var count_permitidos = 9 - parseInt(pasajeros_ninos);

        $.each($selectAdulto.children(), function (k, v) {

            if (count_permitidos < k) {
                $(v).hide();
            } else {
                $(v).show();
            }
        });

    });

    $('#from').datepickerInFullscreen({
        datepicker: {language: 'es'},
        format: 'DDMMYYYY',
        fakeInputFormat: 'DD MMMM YYYY',
        todayWord: 'Hoy',
        clearWord: 'Vaciar',
        closeWord: 'Cerrar',
        beforeOpen: function (modal, settings) {
            var till_date = moment($('#till').val(), 'DDMMYYYY');
            if (till_date.isValid()) {
                settings.datepicker.endDate = till_date.toDate();
                settings.datepicker.defaultViewDate = till_date.toDate();
            } else {
                settings.datepicker.endDate = Infinity;
                settings.datepicker.defaultViewDate = new Date();
            }
        },
    });

    $('#till').datepickerInFullscreen({
        datepicker: {language: 'es'},
        format: 'DDMMYYYY',
        fakeInputFormat: 'DD MMMM YYYY',
        todayWord: 'Hoy',
        clearWord: 'Vaciar',
        closeWord: 'Cerrar',
        beforeOpen: function (modal, settings) {
            var from_date = moment($('#from').val(), 'DDMMYYYY');
            if (from_date.isValid()) {
                settings.datepicker.startDate = from_date.toDate();
                settings.datepicker.defaultViewDate = from_date.toDate();
            } else {
                settings.datepicker.startDate = -Infinity;
                settings.datepicker.defaultViewDate = new Date();
            }
        },
    });
});


