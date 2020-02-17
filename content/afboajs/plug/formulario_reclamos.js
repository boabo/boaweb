/**
 * Created by favio on 13/05/2015.
 */
(function ($) {



    $("#btn_formulario").click(function(){

        formulario_reclamos.click_formulario();

    });

    formulario_reclamos = {

        click_formulario : function(){
            var dataString = $('#formulario').serialize();
           // console.log($('form')[0].length);
            for(var i =0; i < $('form')[0].length; i++){
               // console.log($('form')[0][i])
                var chil = $('form')[0][i];
               if($(chil).data('type')!= undefined){
                   if($(chil).data('type') == 'select'){

                   }
                   var name = $(chil).attr('id');
                   var valor =  $(chil).val();
                   console.log(name,'=',valor)
               }



            }
        }








    };


})
(jQuery);