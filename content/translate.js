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
    translateMsg.VER_DETALLE = 'Ver Detalle';
    translateMsg.OCULTAR_DETALLE = 'Ocultar Detalle';
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
    translateMsg.CONTINUAR_MI_COMPRA  = 'Continuar mi compra';
    translateMsg.PASAJERO  = 'PASAJERO';
    translateMsg.VIAJERO_FRECUENTE  = '# VIAJERO <br>FRECUENTE:';
    translateMsg.BUSCAR  = 'Buscar';
    translateMsg.LIMPIAR  = 'Limpiar';
    translateMsg.SI_NO_ERES_VIAJERO_FRECUENTE_Q  = '&iquest;No eres viajero frecuente?';
    translateMsg.REGISTRATE  = 'REG&Iacute;STRATE';
    translateMsg.NOMBRES  = 'NOMBRES';
    translateMsg.APELLIDOS  = 'APELLIDOS';
    translateMsg.TIPO_DE_DOCUMENTO  = 'TIPO DE DOCUMENTO';
    translateMsg.TIPO_DE_DOCUMENTO_MIN  = 'Tipo de Documento';
    translateMsg.CI  = 'CI';
    translateMsg.PASAPORTE  = 'PASAPORTE';
    translateMsg.DNI  = 'DNI';
    translateMsg.NUM_DE_DOCUMENTO  = '# DE DOCUMENTO';
    translateMsg.TELEFONO  = 'TELEFONO';
    translateMsg.EMAIL  = 'EMAIL';
    translateMsg.FECHA_NACIMIENTO  = 'FECHA NACIMIENTO';
    translateMsg.DEBES_INGRESAR_TU_CORREO_ELECTRONICO  = 'Debes Ingresar tu Correo Electronico';
    translateMsg.INFANTE_DESC  = 'Infante desde los 8 dias de nacido hasta antes de los 2 a&ntilde;os';
    translateMsg.NINO_DESC  = 'Ni&ntilde;o desde los 2 a&ntilde;os hasta antes de cumplir 12 a&ntilde;os';
    translateMsg.GENERO  = 'GENERO';
    translateMsg.GENERO_MIN  = 'Genero';
    translateMsg.MASCULINO  = 'MASCULINO';
    translateMsg.FEMENINO  = 'FEMENINO';
    translateMsg.SE_DEBE_PRESENTAR_DOCUMENTOS  = 'Se debe presentar documentos para confirmar la edad';
    translateMsg.REALIZAR_PAGO  = 'Realizar Pago';

    translateMsg.ADULTO  = 'ADULTO k';
    translateMsg.NINHO  = 'NINHO';
    translateMsg.INFANTE  = 'INFANTE';
    translateMsg.ADULTO_MAYOR_FORM  = 'ADULTO MAYOR';
    translateMsg.NO_HAY_VUELOS  = 'NO HAY VUELOS';

    translateMsg.PAGAR_RESERVA  = 'Pagar Reserva';
    translateMsg.FECHA_EXP  = 'Fecha Exp';
    translateMsg.NACIONALIDAD  = 'Nacionalidad';
    translateMsg.MSG_MENORES_NO_ACOMPANADOS  = '<div>\n    <table style="width: 100%;">\n        <tr>\n            <td>\n                Este servicio posibilita que menores entre 5 y 17 años puedan viajar sin acompañante bajo circunstancias\n                reguladas en vuelos nacionales de Boliviana de Aviación. Debido a que requieren una atención especial,\n                es importante cumplir estrictamente con los siguientes requisitos, que serán solicitados al momento de\n                hacer el Chek-in. Al no contar con cualquiera de éstos el menor no acompañado NO podrá abordar el vuelo,\n                siendo responsabilidad del adulto a cargo éste inconveniente:\n            </td>\n        <tr>\n            <td>\n                Se debe tomar en cuenta que de acuerdo a la normativa vigente, Ley 548 Código Niña, Niño y Adolescente y\n                la Ley 263 Ley Integral Contra la Trata y Tráfico de Personas, en caso que un menor de entre 5 y 17 años\n                de edad necesite viajar solo dentro del territorio nacional, se te solicitará la presentación de la\n                Autorización de Viaje para circulación de Niñas, Niños y Adolescentes en el Territorio Nacional, puede\n                tramitar este documento en las oficinas de la Defensoría Municipal de la Niñez y la Adolescencia.\n            </td>\n        </tr>\n        <tr>\n            <td>\n                Ya sea en oficina o en aeropuerto, deberás completar el formulario diseñado especialmente para el\n                Servicio de Menor No Acompañado, siempre con los datos correctos.\n                Para presentarte en mostradores debes portar el documento de identidad original del menor (cédula de\n                identidad o pasaporte), certificado de nacimiento original, autorización de viaje y el formulario\n                completo de Menor No Acompañado.\n                Recuerda que el menor no puede presentarse solo en mostradores, debe necesariamente estar acompañado por\n                un adulto que esté a cargo de él para realizar el check in y todos los procedimientos aeroportuarios.\n            </td>\n        </tr>\n    </table>\n</div>';



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
