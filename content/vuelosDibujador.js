/**
 * Created by faviofigueroa on 14/8/17.
 */


(function ($) {


    vuelosDibujador = {
        familyInformation: [{
            "refNumber": 1,
            "fareFamilyName": "PROMODOM",
            "cabin": "Y",
            "comercialFamily": "CFFBOA"
        }, {"refNumber": 2, "fareFamilyName": "ECODOM", "cabin": "Y", "comercialFamily": "CFFBOA"}, {
            "refNumber": 3,
            "fareFamilyName": "ECOPREDOM",
            "cabin": "Y",
            "comercialFamily": "CFFBOA"
        }],

        dibujarHeaderFamilias: function (familias) {

            var m = '<div id="salidas_" style="width: 100%;">\n    <div style="display: block;">\n        <div style="width: 60%; float: left">TIPOS</div>\n        <div style="width: 40%; float: left">\n            <div style="float: left;width: 33%; text-align: center; background-color: #333333; color:#fff;">F1</div>\n            <div style="float: left;width: 33%; text-align: center; background-color: #333333; color:#fff;">F1</div>\n            <div style="float: left;width: 33%; text-align: center; background-color: #333333; color:#fff;">F1</div>\n        </div>\n    </div>\n\n    <div style="display: block;">\n        <div style="width: 60%; float: left; margin-top: 12px;">\n            <div style="float: left;width: 25%; text-align: center; border-left: 2px solid #EFAA35;">\n                <span>SALIDA</span>\n                <div><b>05:40 VVI</b></div>\n                <div style="display: block; margin-top: 5px;" onclick="view_detail_connections(this)"\n                     class="btn_view_detail"><span></span>Detalle\n                </div>\n            </div>\n            <div style="float: left;width: 25%; text-align: center;">\n                <div class="ico_sin_conexion"></div><span><label class="duracion_total">Duración Total :<br> 1 hora</label></span>\n            </div>\n            <div style="float: left;width: 25%; text-align: center;">\n                <span>LLEGADA</span><div><b>06:25 CBB</b></div>\n            </div>\n            <div style="float: left;width: 23%; text-align: center;">\n                <span><label>Operado por:</label></span><br><div class="ico_boa"><span style="bottom:-18px;position:relative;">BoA</span></div>\n            </div>\n        </div>\n        <div style="width: 40%; float: left; ">\n            <div style="float: left;width: 32%; text-align: center; background-color: #f1f1f1; color:#fff; height: 50px; padding-top: 28px; color: #333333; border: 1px solid #fff; font-size: 15px;" ><b>150 BS</b></div>\n            <div style="float: left;width: 33%; text-align: center; background-color: #f1f1f1; color:#fff; height: 50px; padding-top: 28px; color: #333333; border: 1px solid #fff;font-size: 15px;"><b>150 BS</b></div>\n            <div style="float: left;width: 33%; text-align: center; background-color: #f1f1f1; color:#fff; height: 50px; padding-top: 28px; color: #333333; border: 1px solid #fff;font-size: 15px;"><b>150 BS</b></div>\n        </div>\n    </div>\n    \n    \n    \n\n</div>';
            return m;
        },
        dibujarVuelos:function (tipo) {

            var m = '<div style="display: block;">\n    <div style="width: 60%; float: left; margin-top: 12px;">\n        <div style="float: left;width: 25%; text-align: center; border-left: 2px solid #EFAA35;">\n            <span>SALIDA</span>\n            <div><b>05:40 VVI</b></div>\n            <div style="display: block; margin-top: 5px;" onclick="view_detail_connections(this)"\n                 class="btn_view_detail"><span></span>Detalle\n            </div>\n        </div>\n        <div style="float: left;width: 25%; text-align: center;">\n            <div class="ico_sin_conexion"></div><span><label class="duracion_total">Duración Total :<br> 1 hora</label></span>\n        </div>\n        <div style="float: left;width: 25%; text-align: center;">\n            <span>LLEGADA</span><div><b>06:25 CBB</b></div>\n        </div>\n        <div style="float: left;width: 23%; text-align: center;">\n            <span><label>Operado por:</label></span><br><div class="ico_boa"><span style="bottom:-18px;position:relative;">BoA</span></div>\n        </div>\n    </div>\n    <div style="width: 40%; float: left; ">\n        <div style="float: left;width: 32%; text-align: center; background-color: #f1f1f1; color:#fff; height: 50px; padding-top: 28px; color: #333333; border: 1px solid #fff; font-size: 15px;" ><b>150 BS</b></div>\n        <div style="float: left;width: 33%; text-align: center; background-color: #f1f1f1; color:#fff; height: 50px; padding-top: 28px; color: #333333; border: 1px solid #fff;font-size: 15px;"><b>150 BS</b></div>\n        <div style="float: left;width: 33%; text-align: center; background-color: #f1f1f1; color:#fff; height: 50px; padding-top: 28px; color: #333333; border: 1px solid #fff;font-size: 15px;"><b>150 BS</b></div>\n    </div>\n</div>';

            return m;
        }
    };
})
(jQuery);