// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Favio Figueroa Penarrieta - JavaScript Library                     │
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2014 Disydes (http://disydes.com)                      │
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Vista para automatizar cualquier front end basado en jQuery        │ plugin para hacer peticiones ajax
// └────────────────────────────────────────────────────────────────────┘ \\

(function ($) {
    $.tipo = '';
    $.aurl = '';
    ajax_dyd = {

        url: "",
        tarea:"",
        type: "POST",
        data: "",
        dataType: "",
        respuesta:"",

        peticion_ajax : function (callback) {

            //console.log(this);
            $.ajax({
                type: this.type,
                url: this.url,
                //data: 'x='+this.data,
                data:this.data,

                contentType: 'application/json; charset=utf-8',
                dataType: this.dataType,
                processdata: true,
               // async: false,
                success: function (resp) {
                    // return resp;
                    if(typeof callback === "function") callback(resp);
                }
            });

            //return this.respuesta;
        },


    };


})
(jQuery);