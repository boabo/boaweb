/**
 * Created by faviofigueroa on 31/7/17.
 */

var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';





chatUI = {
    $nombre_completo: '',
    $chatFinalizado: 'no',
    $subject:'',
    dibujarIconoChat: function () {

        var m = '<div data-tipo="inicio" onclick="chatUI.dibujarVentanaChat(this)" class="icoChatMain"></div>';
        $('body').append(m)
    },
    dibujarVentanaChat: function (that) {
        $(".icoChatMain").css({"display": "none"});
        if ($(that).data('tipo') == "inicio") {

            $(that).data('tipo', 'iniciado');
            console.log(chatG)
            var m = '<div class="MostrarVentana" id="ventanaChat" style="">' +
                '<ul><li><a onclick="chatG.disconnect(this)">x</a></li><li><a onclick="chatUI.minimizarChat()">-</a></li></ul>' +
                '<div class="mainChat"><img src="chatG/img/hello.png" />' +
                '<span>Comunicate directamente con nuestro personal de soporte</span>' +

                '<div onclick="chatUI.seleccionarSubject(this)" class="button">Comunicarme</div>' +
                '</div>' +
                '<div onkeydown="chatUI.enviarMensaje(event,this)" class="enviarMensaje" contenteditable></div>' +
                '</div>';


            $("body").append(m);
            $("#ventanaChat").css({"visibility": "visible"});


        } else {

            $("#ventanaChat").addClass('MostrarVentana');
            $("#ventanaChat").css({"visibility": "visible"});

        }

        console.log('existe esta clase ', $("#ventanaChat").hasClass('MostrarVentana'))

        $(".MostrarVentana").one(animationEnd, function () {

            if ($("#ventanaChat").hasClass('MostrarVentana')) {
                console.log('animacion terminada');
                $("#ventanaChat").removeClass('MostrarVentana');
                $("#ventanaChat").css({"visibility": "visible"});

                console.log('end de mostrar ', this)
            }

        });


    },

    seleccionarSubject:function () {

        $(".mainChat").addClass("MostrarFormularioChat");
        $(".mainChat").empty();

        var combo = '<select id="subject">';
        $.each(chatG.subjects,function (k,v) {

            combo+='<option>'+v.field+'</option>';
        });

        combo +='</select>';

        combo += '<div onclick="chatUI.comunicarme(this)" class="button">Comunicarme</div>';
        $(".mainChat").append(combo);

        $(".MostrarFormularioChat").one(animationEnd, function () {

            console.log('animacion terminada');
            console.log('end de MostrarFormularioChat ', this)
            $(".mainChat").removeClass('MostrarFormularioChat');
        });

    },

    comunicarme: function (that) {

        chatUI.$subject = $("#subject").val();

        $(".mainChat").addClass("MostrarFormularioChat");
        $(".mainChat").empty();
        $(".mainChat").append('<form name="formChatRegistro" class="formChatRegistro">\n    <span>Nickname</span><input name="nickname" id="nicknamePersonaChat" type="text">\n    <span>Nombre</span><input name="firstName" id="nombrePersonaChat" type="text">\n    <span>Apellido</span><input name="lastName" id="apellidoPersonaChat" type="text">\n    <span>Correo Electronico</span><input name="emailAddress" id="correoPersonaChat" type="text">\n    <span>Telefono</span><input name="phone" id="telefonoPersonaChat" type="text">\n    <div onclick="chatUI.registrarParaChatear(this)" class="button">Iniciar Chat</div>\n</form>');

        $(".MostrarFormularioChat").one(animationEnd, function () {

            console.log('animacion terminada');
            console.log('end de MostrarFormularioChat ', this)
            $(".mainChat").removeClass('MostrarFormularioChat');
        });



    },

    afterReveal: function (el) {
        /*el.addEventListener('animationend', function () {
         console.log('This runs once finished!');
         $(".mainChat").removeClass("wow2");
         $(".mainChat").removeClass("slideInUp");
         });*/
    },

    registrarParaChatear: function (that) {

        console.log(this)
        console.log($('.formChatRegistro').serializeArray())
        var objeto = new Object();
        $.each($('.formChatRegistro').serializeArray(), function (k, v) {
            objeto[v.name] = v.value;
        });
        alert(chatUI.$subject)
        objeto.subject = chatUI.$subject;
        objeto.tenantName = "Resources";
        objeto.alias = "";
        objeto.secureKey = "";
        objeto.userId = "";
        objeto.text = "";

        $nombre_completo = objeto.firstName + ' ' + objeto.lastName;

        chatG.iniciar(objeto, function (resp) {


            var date = new Date(resp.messages[0].utcTime);

            chatUI.iniciarChat(chatUI.verHora(date));
            chatUI.actualizarChat();
        });


    },
    iniciarChat: function (time) {

        $(".mainChat").css({"overflow-y": "scroll"});

        $(".mainChat").addClass("MostrarFormularioChat");
        $(".mainChat").empty();
        $(".mainChat").append('<ol class="chat"></ol>');
        $(".chat").append('<li class="other">\n    <div class="avatar"><img src="" draggable="false"/></div>\n    <div class="msg">\n        <p>Hola!</p>\n        <p>' + $nombre_completo + ' en que podemos ayudarte? </p>\n        <time>' + time + '</time>\n    </div>\n</li>');

        $(".enviarMensaje").show();



    },
    actualizarChat: function () {
        chatG.refresh(function (resp) {

            if (resp.messages.length > 0) {
                if (resp.messages[0].type == 'user is typing') {

                } else if (resp.messages[0].type == 'Message') {
                    var date = new Date(resp.messages[0].utcTime);

                    chatUI.recibidoCorrectamente({
                        msg: resp.messages[0].text,
                        hora: chatUI.verHora(date)
                    });
                }
            }


            if (resp.chatEnded == true && chatUI.$chatFinalizado == 'no') {
                chatUI.$chatFinalizado = 'si';

                //se finalizo el chat entonces mostramos la vista para calificar el chat  y otros
                chatUI.chatFinalizado();

            }

        });

        if (chatUI.$chatFinalizado == 'no') { //si ya esta finalizado ya no actualizamos el chat
            setTimeout(chatUI.actualizarChat, 1000);
        }

    },

    enviarMensaje: function (e, that) {
        if (e.keyCode == 13) {
            e.preventDefault();

            var val = $(".enviarMensaje").text();
            console.log($(that).height());

            console.log(val)
            if (val != "") {


                //enviamos el mensaje al servidor
                chatG.sendMessage({
                    // tenantName: "Resources",
                    alias: chatG.$alias,
                    secureKey: chatG.$secureKey,
                    userId: chatG.$userId,
                    message: val,
                    messageType: "text"

                }, chatG.url + '/send', function (resp) {

                    console.log(' resp', resp)
                });

                //enviamos mensaje a la vista
                console.log('llega')
                chatUI.enviadoCorrectamente({
                    msg: val,
                    hora: '15'
                });

            }

        }
    },

    enviadoCorrectamente: function (data) {
        console.log(data)
        //$(".mainChat").append('<div class="content_mensaje"><div class="right"><div class="msg">'+data+'</div></div></div>');
        $(".chat").append('<li class="self">\n    <div class="msg">\n        <p>' + data.msg + '</p>\n        <time>' + data.hora + '</time>\n    </div>\n</li>');
        $(".enviarMensaje").empty();
        $(".mainChat").animate({scrollTop: $('.mainChat')[0].scrollHeight}, 1000);


    },
    recibidoCorrectamente: function (data) {
        console.log(data)
        //$(".mainChat").append('<div class="content_mensaje"><div class="right"><div class="msg">'+data+'</div></div></div>');
        $(".chat").append('<li class="other">\n <div class="avatar"><img src="" draggable="false"/></div>\n   <div class="msg">\n        <p>' + data.msg + '</p>\n        <time>' + data.hora + '</time>\n    </div>\n</li>');
        $(".enviarMensaje").empty();
        $(".mainChat").animate({scrollTop: $('.mainChat')[0].scrollHeight}, 1000);


    },
    verHora: function (date) {

        var hora = date.getHours();
        var minutos = date.getMinutes();
        if (minutos < 10) {
            minutos = '0' + minutos;
        }
        var time = hora + ':' + minutos;
        return time;

    },
    chatFinalizado: function () {
        $(".mainChat").css({"overflow-y": ""});
        $(".mainChat").addClass("MostrarFormularioChat");

        $(".mainChat").addClass("wow2");
        $(".mainChat").addClass("slideInUp");
        $(".mainChat").empty();
        $(".enviarMensaje").hide();

        $(".mainChat").append('<div>Finalizo</div>');


    },
    minimizarChat: function () {
        $("#ventanaChat").addClass('ocultarVentana');
        $(".ocultarVentana").one(animationEnd, function () {

            if ($("#ventanaChat").hasClass('ocultarVentana')) {
                console.log('animacion terminada');
                $("#ventanaChat").removeClass('ocultarVentana');
                $("#ventanaChat").css({"visibility": "hidden"});


                $(".icoChatMain").css({"display": ""});

                console.log('end de ocultar ', this)
            }


        });


    }


}

//chatUI.dibujarIconoChat();
//chatUI.dibujarVentanaChat();

