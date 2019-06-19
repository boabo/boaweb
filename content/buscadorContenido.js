/**
 * Created by faviofigueroa on 6/3/19.
 */

var buscadorContenido = (function(){

    var $inputContenido;
    var $btnSearch;
    var $detalleBusquedaContenido = $("#detalle_busqueda_contenido");

    function init(){
        //agregamos contexto
        $inputContenido = $("#buscador_contenido");
        $btnSearch = $("#btnSearch");

        $btnSearch.click(function () {
            if($detalleBusquedaContenido.is(":visible")){
                $detalleBusquedaContenido.hide();
            }else{

                $detalleBusquedaContenido.show();

                search(function (resp) {
                    //se debe dibujar en el detalle lo que se encontro
                    var $table = $('<table style="width:100%;"></table>');
                    var $tr = $('<tr></tr>');
                    $tr.append('<td>Contenido</td>');
                    $tr.append('<td>Cantidad</td>');
                    $table.append($tr);

                    if(resp.length > 0){

                        $.each(resp,function (index,encontrado) {

                            var idCambiado = encontrado.id;
                            var idMenu = idCambiado.replace('ui_','');


                            var $contextMenuSeleccionado = $("#main_menu").find('[data-item="'+idMenu+'"]');
                            var $iconParaBusqueda  = $contextMenuSeleccionado.find('.icon').clone();

                            console.log('li',$contextMenuSeleccionado.parents('li'))

                            var menuPadreId = $contextMenuSeleccionado.parents('li').attr('id');

                            console.log($contextMenuSeleccionado.find('.icon'))
                            $iconParaBusqueda.css({"float":"left"});

                            var $tr = $('<tr data-id="'+menuPadreId+'"></tr>');
                            var $a = $('<a data-item="'+idMenu+'" style="text-decoration: underline; cursor: pointer;" data-id="'+idCambiado+'"></a>');
                            $a.append($iconParaBusqueda);
                            $a.append('<div style="float:left; margin-left: 10px;">'+encontrado.nombre+'</div>');
                            var $tdDescripcion = $('<td></td>');
                            var $tdCantidad = $('<td></td>');
                            $tdDescripcion.append($a);
                            $tdCantidad.append(encontrado.cantidad);
                            $tr.append($tdDescripcion);
                            $tr.append($tdCantidad);
                            $table.append($tr);

                            $tr.find('a').click(function () {
                                var id = $(this).attr('data-id');

                                id = id.replace('ui_','');
                                console.log('click',id)
                                console.log('click',$("#main_menu").find('[data-item="'+id+'"]'))
                                $("#main_menu").find('[data-item="'+id+'"]').find('a').click();
                            });

                        });
                        $detalleBusquedaContenido.html($table);

                    }
                });
            }
        });


    }

    function search(callback){
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

            var arra = [];
            var valor = $inputContenido.val();

            var i = 0;
            $.each($body.find('.ui-section'),function (k,v) {
                var $found = $(v).find(':contains("'+valor+'")');

                if($found.length > 0){
                    var nombre = $(v).find('.header').text();


                    arra[i] = new Object({
                        "palabra_clave" : valor,
                        "encontrados":[],
                        "id":$(v).attr('id'),
                        "cantidad":$found.length,
                        "nombre":nombre

                    });
                    /*porsi creamos mas completo*/
                    $.each($found, function (indexContains, found) {
                        arra[i].encontrados = new Object({

                        });
                    });
                    i++;
                }


            })

            callback(arra);

        });

    }

    return{
        init:init
    };

})();
