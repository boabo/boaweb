/**
 * Created by faviofigueroa on 31/7/17.
 */


    ajax_dyd = {


        url: "",
        tarea: "",
        type: "POST",
        data: "",
        dataType: "",
        respuesta: "",
        x: "",
        p: "",
        async: true,

        timeout_: 10000,
        countError: 0,


        peticion_ajax: function (callback) {

            //console.log(this);
            $.ajax({
                type: this.type,
                url: this.url,
                //data: 'x='+this.data,
                data: this.data,
                // contentType: 'application/json; charset=utf-8',
                dataType: this.dataType,
                // processdata: true,
                async: this.async,
                timeout: this.timeout_,
                success: function (resp) {
                    // return resp;


                    if (typeof callback === "function") callback(resp);
                },
                error: function (x, t, m) {


                    var error = new Object({
                        "estado": "error",
                        "x": x,
                        "t": t,
                        "m": m
                    });
                    if (typeof callback === "function") callback(error);

                }
            });

            //return this.respuesta;
        },


    };

