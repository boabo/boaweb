/**
 * Created by faviofigueroa on 5/12/16.
 */


(function ($) {

    validaciones_form = {

        /*validar correo electronico*/
        validar_email: function (that) {


            if (this.isEmail($(that).val()) == true) {
                //$(that).css({'background':'url("content/images/alert.png")'});
                $(that).next().children('svg').css("display", "none");
                $(that).siblings('div .tooltip').text('Tu correo esta Bien');


            } else {
                //no es email
                $(that).next().children('svg').css("display", "block");
                $(that).siblings('div .tooltip').text('Esta mal tu correo');

            }


        },
        isEmail: function (email) {
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return regex.test(email);
        }

    }


})
(jQuery);


(function (a) {
    a.fn.validCampos = function (b) {
        a(this).on({
            keypress: function (a) {

                var nombre_validacion = $(this).attr('id');
                var jsonString = '{"'+nombre_validacion+'": "'+a.key+'"}';


                var json = JSON.parse(jsonString);

                console.log(json);
                if(validate(json, validacion_) != undefined){
                    console.log(validate(json, validacion_)[nombre_validacion][0]);
                    $(this).parent('.validable').find('.tooltip').html(validate(json, validacion_)[nombre_validacion][0]);
                    $(this).parent('.validable').find('.tooltip').css({"display":""});
                }


                var c = a.which, d = a.keyCode, e = String.fromCharCode(c).toLowerCase(), f = b;
                (-1 != f.indexOf(e) || 9 == d || 37 != c && 37 == d || 39 == d && 39 != c || 8 == d || 46 == d && 46 != c) && 161 != c || a.preventDefault()
            }
        })
    }
})(jQuery);

