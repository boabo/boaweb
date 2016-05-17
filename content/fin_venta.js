/**
 * Created by faviofigueroa on 5/17/16.
 */
(function ($) {

    
    fin_venta = {

        invoce : function (p1,p2) {

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

            newForm.appendTo("body").submit();

            // console.log(newForm);
            // newForm.submit();

        }
    }

})
(jQuery);