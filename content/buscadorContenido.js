/**
 * Created by faviofigueroa on 6/3/19.
 */

var buscadorContenido = (function(){

    var $inputContenido;
    var $btnSearch;
    var $detalleBusquedaContenido = $("#detalle_busqueda_contenido");

    function init(){
        console.log('inicial')
        //agregamos contexto
        $inputContenido = $("#buscador_contenido");
        $btnSearch = $("#btnSearch");

        $btnSearch.click(function () {
            console.log('clickkk')
            if($detalleBusquedaContenido.is(":visible")){
                $detalleBusquedaContenido.hide();
            }else{
                console.log('shwww')
                search();
                $detalleBusquedaContenido.show();
            }
        });


    }

    function search(){
        var $body;
        //necesitamos hacer ajax html para obtener el info_page
        //aca se debe configurar que archivo traer depende el idioma
        //aldo todo
        $.ajax({
            url: "info_page.html",
            context: document.body
        }).done(function(resp) {

            var data = resp.replace('<body', '<body><div id="body"').replace('</body>','</div></body>');
            var $body = $(data).filter('#body');


            $.each($body.find('.ui-section'),function (k,v) {
                console.log(v)
            })

        });

    }

    return{
        init:init
    };

})();
