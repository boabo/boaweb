/**
 * Created by faviofigueroa on 5/12/16.
 */


(function ($) {

    validaciones_form = {

        /*validar correo electronico*/
        validar_email : function (that) {



            if(this.isEmail($(that).val())==true){
                //$(that).css({'background':'url("content/images/alert.png")'});
                $(that).next().children('svg').css("display","none");
                $(that).siblings('div .tooltip').text('Tu correo esta Bien');


            }else{
               //no es email
                $(that).next().children('svg').css("display","block");
                $(that).siblings('div .tooltip').text('Esta mal tu correo');

            }



        },
        isEmail : function (email) {
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return regex.test(email);
        }

    }



})
(jQuery);