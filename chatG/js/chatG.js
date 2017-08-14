/**
 * Created by faviofigueroa on 31/7/17.
 */


    var chatG = {

        subjects:[{
            field:'Ecommerce'
        },{
            field:'Pasajero frecuente'
        },{
            field:'Intranet'
        }],

        url: 'http://172.17.58.80:8080/genesys/2/chat/chat-test/',
        $chatId: '',
        $userId: '',
        $alias: '',
        $secureKey: '',
        $nextPosition: '',
        $nickname: '',
        iniciar: function (parametros,callback) {
           /* var parametros = {

                tenantName: "Resources",
                alias: "",
                secureKey: "",
                userId: "",
                nickname: "ovega",
                firstName: "oscar",
                lastName: "vega",
                emailAddress: "ovega@gmail.com",
                subject: "que tal metal",
                text: "",
            };*/
            ajax_dyd.data = parametros;
            ajax_dyd.type = 'POST';
            ajax_dyd.url = 'http://172.17.58.80:8080/genesys/2/chat/chat-test/';
            ajax_dyd.dataType = 'json';
            ajax_dyd.async = true;
            ajax_dyd.peticion_ajax(function (resp) {

                console.log(resp);
                chatG.$chatId = resp.chatId;
                chatG.$userId = resp.userId;
                chatG.$alias = resp.alias;
                chatG.$secureKey = resp.secureKey;
                chatG.$nextPosition = resp.nextPosition;
                chatG.url += resp.chatId;
                console.log(resp.chatId)
                console.log(chatG.url)

                if (typeof callback === "function") callback(resp);

                /* */



            });
        },
        startTyping: function (parametros, url) {

            console.log(url);
            ajax_dyd.data = parametros;
            ajax_dyd.type = 'POST';
            ajax_dyd.url = url;
            ajax_dyd.dataType = 'json';
            ajax_dyd.async = true;
            ajax_dyd.peticion_ajax(function (resp) {

                console.log(resp)
            });
        },

        sendMessage: function (parametros, url,callback) {

            console.log(url);
            ajax_dyd.data = parametros;
            ajax_dyd.type = 'POST';
            ajax_dyd.url = url;
            ajax_dyd.dataType = 'json';
            ajax_dyd.async = true;
            ajax_dyd.peticion_ajax(function (resp) {

                console.log(resp);
                chatG.$nextPosition = resp.nextPosition;

                if (typeof callback === "function") callback(resp);

            });
        },

        refresh: function (callback) {

            var parametros = {
                // tenantName: "Resources",
                alias: chatG.$alias,
                secureKey: chatG.$secureKey,
                userId: chatG.$userId,
                transcriptPosition: chatG.$nextPosition,
                message:""

            };
            var url = chatG.url+'/refresh';
            console.log(url);
            ajax_dyd.data = parametros;
            ajax_dyd.type = 'POST';
            ajax_dyd.url = url;
            ajax_dyd.dataType = 'json';
            ajax_dyd.async = true;
            ajax_dyd.peticion_ajax(function (resp) {

                console.log(resp);
                chatG.$nextPosition = resp.nextPosition;
                if (typeof callback === "function") callback(resp);

            });
        },


        disconnect: function () {

            var parametros ={

                alias: chatG.$alias,
                secureKey: chatG.$secureKey,
                userId: chatG.$userId,

            };
            var url = chatG.url+'/disconnect';

            console.log(url);
            ajax_dyd.data = parametros;
            ajax_dyd.type = 'POST';
            ajax_dyd.url = url;
            ajax_dyd.dataType = 'json';
            ajax_dyd.async = true;
            ajax_dyd.peticion_ajax(function (resp) {

                console.log(resp)
            });
        },


    };


