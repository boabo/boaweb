/**
 * Created by faviofigueroa on 14/3/18.
 */


var translate = (function(){

    var translateMsg = {
    };
    translateMsg.SELECCIONA_CLASE_QUE_TE_CONVENGA = 'Selecciona la clase que te convenga';
    translateMsg.SALIDA = 'SALIDA';
    translateMsg.LLEGADA = 'LLEGADA';
    translateMsg.DETALLE = 'Detalle';
    translateMsg.DURACION_TOTAL  = 'Duración Total ';
    translateMsg.OPERADO_POR  = 'Operado por:';
    translateMsg.ASIENTOS  = 'Asientos';
    translateMsg.VUELO_DE_IDA  = 'VUELO DE IDA';
    translateMsg.ORDENAR_POR  = 'Ordenar por';
    translateMsg.PRECIO  = 'Precio';
    translateMsg.HORA  = 'Hora';
    translateMsg.VUELO_DE_VUELTA  = 'VUELO DE VUELTA';
    translateMsg.BUSQUEDA  = 'Busqueda';
    translateMsg.ELIJA_SU_VUELO  = 'Elija su Vuelo';
    translateMsg.RESERVAR  = 'Reservar';
    translateMsg.PAGAR  = 'Pagar';
    translateMsg.MODIFICAR_BUSQUEDA  = 'Modificar Busqueda';
    translateMsg.BUSCANDO  = 'Buscando';
    translateMsg.VOLVER_A_VUELOS  = 'Volver a vuelos';
    translateMsg.ORIGEN  = 'Origen';
    translateMsg.DESTINO  = 'Destino';
    translateMsg.SOLO_IDA  = 'Solo ida';
    translateMsg.IDA_Y_VUELTA  = 'Ida y Vuelta';
    translateMsg.REGRESO  = 'Regreso:';
    translateMsg.BUSCAR  = 'Buscar:';

    translateMsg.CESTA_DE_COMPRA  = 'Su Cesta<br>de Compra';
    translateMsg.SELECCIONA_TU_VUELO  = 'SELECCIONA<br>TU VUELO';
    translateMsg.QUITAR_VUELO  = 'Quitar Vuelo';
    translateMsg.ADULTOS  = 'Adultos';
    translateMsg.NINO  = 'Ni&ntilde;o';
    translateMsg.INFANTES  = 'Infantes';
    translateMsg.ADULTO_MAYOR  = 'Adulto Mayor';
    translateMsg.TASAS  = 'Tasas';
    translateMsg.PRECIO_TOTAL  = 'Precio Total';
    translateMsg.CERRAR  = 'CERRAR';


    function traducirElementosHtml(){



        $("body").find('[data-trans]').each(function (k,v) {
            $(this).html(translateMsg[$(this).data("trans")]);

        });


        /* traducimos la cabecera */
        $("body").find('[data-headerName="busqueda"]').html(translateMsg.BUSQUEDA);
        $("body").find('[data-headerName="elija_su_vuelo"]').html(translateMsg.ELIJA_SU_VUELO);
        $("body").find('[data-headerName="reservar"]').html(translateMsg.RESERVAR);
        $("body").find('[data-headerName="pagar"]').html(translateMsg.PAGAR);

    }

return{
    t:translateMsg,
    traducir:traducirElementosHtml
};
})();