/**
 * Created by faviofigueroa on 24/7/17.
 */

(function ($) {


    ajax_dyd = {


        url: "",
        tarea:"",
        type: "POST",
        data: "",
        dataType: "",
        respuesta:"",
        x:"",
        p:"",
        async:true,

        timeout_:10000,
        countError:0,


        peticion_ajax : function (callback) {

            //console.log(this);
            $.ajax({
                type: this.type,
                url: this.url,
                //data: 'x='+this.data,
                data:this.data,
                // contentType: 'application/json; charset=utf-8',
                dataType: this.dataType,
                // processdata: true,
                async: this.async,
                timeout:this.timeout_,
                success: function (resp) {
                    // return resp;


                    if(typeof callback === "function") callback(resp);
                },
                error: function(x, t, m) {



                    var error = new Object({
                        "estado":"error",
                        "x":x,
                        "t":t,
                        "m":m
                    });
                    if(typeof callback === "function") callback(error);

                }
            });

            //return this.respuesta;
        },


    };

    var chatG = {


        url : 'http://172.17.58.80:8080/genesys/2/chat/chat-test/',
        iniciar:function () {
            var parametros = {
                firstName:"favio",
                lastName:"figueroa",
                subject:"Subject+to",
            }
            ajax_dyd.data = parametros;
            ajax_dyd.type = 'POST';
            ajax_dyd.url = 'http://172.17.58.80:8080/genesys/2/chat/chat-test/';
            ajax_dyd.dataType = 'json';
            ajax_dyd.async = true;
            ajax_dyd.peticion_ajax(function (resp) {

                console.log(resp)
                chatG.url += resp.chatId+'/send';
                chatG.sendMessage({
                    userId: resp.userId,
                    alias: resp.alias,
                    secureKey: resp.secureKey,
                    transcriptPosition: resp.nextPosition,
                    message: 'hello',
                },chatG.url)

            });
        },
        sendMessage : function (parametros,url) {

            console.log(url)
            ajax_dyd.data = parametros;
            ajax_dyd.type = 'POST';
            ajax_dyd.url = url;
            ajax_dyd.dataType = 'json';
            ajax_dyd.async = true;
            ajax_dyd.peticion_ajax(function (resp) {

                console.log(resp)
            });
        }


    };

    chatG.iniciar();





})
(jQuery);