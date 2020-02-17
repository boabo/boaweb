(function(window, document, undefined) {
    'use strict';
    // Preloader
    $(window).on('load', function() {
        $('#status').fadeOut();
        $('#preloader').delay(500).fadeOut('slow');

        $.datepicker.regional['es'] =
        {
            closeText: 'Cerrar',
            prevText: 'Previo',
            nextText: 'Próximo',

            monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
            monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun',
                'Jul','Ago','Sep','Oct','Nov','Dic'],
            monthStatus: 'Ver otro mes', yearStatus: 'Ver otro año',
            dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
            dayNamesShort: ['Dom','Lun','Mar','Mie','Jue','Vie','Sáb'],
            dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sa'],
            dateFormat: 'dd/mm/yy', firstDay: 0,
            initStatus: 'Selecciona la fecha', isRTL: false}
        $.datepicker.setDefaults($.datepicker.regional['es']);
    });
    // datapicker para boa hecho por favio figueroa
    // picker para origen
    $('#datepicker-ida').datepicker({
        dateFormat:'dd/mm/yy',
        numberOfMonths: 2,
        defaultDate: '+1w',
        minDate:new Date(),
        onClose: function(selectedDate) {
            $('#datepicker-vuelta').datepicker('option', 'minDate', selectedDate);
        },
        prevText: '<i class="fa fa-arrow-left"></i>',
        nextText: '<i class="fa fa-arrow-right"></i>'
    });

    $('#datepicker-vuelta').datepicker({
        dateFormat:'dd/mm/yy',
        numberOfMonths: 2,
        defaultDate: '+1w',
        /*onClose: function(selectedDate) {
            $('#datepicker-ida').datepicker('option', 'maxDate', selectedDate);
        },*/

        prevText: '<i class="fa fa-arrow-left"></i>',
        nextText: '<i class="fa fa-arrow-right"></i>'
    });


    $('#datepicker-form').datepicker({
        dateFormat:'dd/mm/yy',
        numberOfMonths: 2,
        defaultDate: '+1w',
        /*onClose: function(selectedDate) {
         $('#datepicker-ida').datepicker('option', 'maxDate', selectedDate);
         },*/

        prevText: '<i class="fa fa-arrow-left"></i>',
        nextText: '<i class="fa fa-arrow-right"></i>'
    });


})(this, this.document);
