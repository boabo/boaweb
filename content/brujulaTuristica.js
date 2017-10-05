/**
 * Created by faviofigueroa on 19/9/17.
 */
//favio figueroa automatizacion con los servicios de brujula
(function ($) {

    brujulaTuristica = {

    };
    brujulaDibujador = {



        dibujarlinks : function () {

            console.log($(".info_departamentos_bolivia"))
            var links = '<a class="dep" data-item="ciudades" data-servicio="que-hacer"><img style="margin-right: 5px;" src="content/images/contenidos/brujula_turistica/flecha_min.png" alt="">Destinos</a>\n<a data-servicio="donde-dormir" ><img style="margin-right: 5px;" src="content/images/contenidos/brujula_turistica/flecha_min.png" alt="">Donde dormir</a>\n<a ><img style="margin-right: 5px;" src="content/images/contenidos/brujula_turistica/flecha_min.png" alt="">Eventos</a>\n<a ><img style="margin-right: 5px;" src="content/images/contenidos/brujula_turistica/flecha_min.png" alt="">Donde comer</a>\n<a ><img style="margin-right: 5px;" src="content/images/contenidos/brujula_turistica/flecha_min.png" alt="">Ofertas tur&iacute;sticas</a>\n<a ><img style="margin-right: 5px;" src="content/images/contenidos/brujula_turistica/flecha_min.png" alt="">Qu&eacute; comprar</a>\n<a ><img style="margin-right: 5px;" src="content/images/contenidos/brujula_turistica/flecha_min.png" alt="">Esenciales</a>\n<a ><img style="margin-right: 5px;" src="content/images/contenidos/brujula_turistica/flecha_min.png" alt="">Local tips</a>';
            $.each($(".dropdown-content_mapa"),function (k,v) {
                
                $(v).append(links);
            });

            $(".dropdown-content_mapa").find('a').click(function () {

               var ciudad = $(this).parent().data('ciudad');
               var servicio = $(this).data('servicio');
               console.log(ciudad);
               console.log(servicio);
               brujulaDibujador.obtenerDatos(ciudad,servicio);

            });
        },
        obtenerDatos : function (ciudad,servicio) {

            var url = 'https://pupitre-d4721.firebaseio.com/brujula/'+servicio+'/lugares/'+ciudad+'.json'
            console.log(url)

            $.get( url, function( data ) {


               brujulaDibujador.dibujarDetalleAcordion(data);


            });

        },
        array_slider : [],
        dibujarDetalleAcordion : function (data) {

            var aux = 1;

            $.each(data,function (index,dato) {

                brujulaDibujador.array_slider['mySlides'+aux] = new Object({
                    slideIndex : 1,
                    nombre:'mySlides'+aux,

                });

                var clase = 'mySlides'+aux;

                var imagenes = '';
                $.each(dato.imagenes,function (indexImg,img) {
                    imagenes +=' <img class="mySlides'+aux+'" src="'+img+'" width="340">';
                });
                
                var acordion = '<div class="cont_accordion" onclick="brujulaDibujador.girar(this)">\n    <div class="accordion" id="ac">'+dato.nombre+'<img class="normal" id="img1" src="content/images/contenidos/brujula_turistica/flecha_derecha.png" alt=""></div>\n    <div class="panel">\n        <p>'+dato.contenido+'</p>\n        <div style="width: 100%;">\n            <div class="accordion1">\n                '+imagenes+'\n                <div style="background-color: #333333; height: 20px;margin-top: 0;width: 340px">\n                    <a class="anterior" onclick="brujulaDibujador.plusDivs(\'' + clase + '\',-1)"><img src="content/images/contenidos/brujula_turistica/flecha_izq.png" style="margin-top: -7px!important;width: 10px" alt="Anterior"></a>\n                    <a class="siguiente" onclick="brujulaDibujador.plusDivs(\'' + clase + '\',1)"><img src="content/images/contenidos/brujula_turistica/flecha_der.png" style="margin-top: -7px;width: 10px" alt="Siguiente"></a>\n                </div>\n            </div>\n            <div class="accordion2">\n                <img src="content/images/contenidos/brujula_turistica/mapa.jpg" alt="">\n                <label>Direcci&oacute;n: '+dato.direccion+'</label>\n                <br>\n                <label>Horarios:'+dato.horarios+'</label>\n                <br>\n                <label>Sugerencias:  </label>\n                <br>\n                <label>Mini Bus Parada:</label>\n                <br>\n                <label>Costo:</label>\n                <br>\n                <label style="">Horario de Salidas:</label>\n                <br><br>\n            </div>\n        </div>\n    </div>\n</div>';

                $("#brujulaRes").append(acordion);
                console.log(dato);





                brujulaDibujador.showDivs('mySlides'+aux,1);
                /*function plusDivs(n) {
                    showDivs(slideIndex += n);
                }*/

                aux ++;

            });



            $('#info_departamentos_bolivia').removeClass('selected');
            $('#info_ciudades').addClass('selected');


            var acc = document.getElementsByClassName("accordion");
            var i;

            for (i = 0; i < acc.length; i++) {
                acc[i].onclick = function () {
                    this.classList.toggle("active");
                    var panel = this.nextElementSibling;
                    if (panel.style.maxHeight) {
                        panel.style.maxHeight = null;
                    } else {
                        panel.style.maxHeight = panel.scrollHeight + "px";
                    }
                }
            }








        },
        girar: function (that) {


            if ($(that).find('.accordion').hasClass("accordion active")) {
                $(that).find('.accordion').children('img').removeClass("normal");
                $(that).find('.accordion').children('img').addClass("rotate");
            } else {
                $(that).find('.accordion').children('img').removeClass("rotate");
                $(that).find('.accordion').children('img').addClass("normal");
            }
        },
        showDivs: function (clase,n) {
            var i;
            var x = document.getElementsByClassName(clase);
            if (n > x.length) {
                brujulaDibujador.array_slider[clase].slideIndex = 1
            }
            if (n < 1) {
                brujulaDibujador.array_slider[clase].slideIndex = x.length
            }
            for (i = 0; i < x.length; i++) {
                x[i].style.display = "none";
            }
            x[brujulaDibujador.array_slider[clase].slideIndex - 1].style.display = "block";
        },

        plusDivs:function (clase,n) {
            console.log(clase)
            console.log(n)

            console.log(brujulaDibujador.array_slider[clase]);
            brujulaDibujador.showDivs(clase,brujulaDibujador.array_slider[clase].slideIndex += n);
        },

    };

    brujulaDibujador.dibujarlinks();
})
(jQuery);