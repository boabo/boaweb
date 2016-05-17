/**
 * Created by faviofigueroa on 5/17/16.
 */
(function ($) {


    $(document).on('ready', function () {

        initialize_header(true);
        initialize_ui_sections({anchor_section_headers: false});


        todayStr = formatCompactDate(new Date()); // today
    });
    
    fin_venta = {

        invoce : function (p1,p2) {
            //creacion dinamica de un formulario con dos parametros
            var newForm = $('<form>', {
                'action': 'http://www.dd.com/pdf',
                'target': '_blank'
            }).append($('<input>', {
                'name': 'parametro1',
                'value': p1,
                'type': 'hidden'
            })).append($('<input>', {
                'name': 'parametro2',
                'value': p2,
                'type': 'hidden'
            }));

            newForm.appendTo("body").submit(); // esta forma aseguramos que en firefox funcione y en los demas

            // console.log(newForm);
            // newForm.submit();

        }
    }

})
(jQuery);