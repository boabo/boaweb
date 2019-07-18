/**
 * Created by faviofigueroa on 11/20/18.
 */

function BoaConfirm(msg,callback1,callback2,option1,option2,alertbtn){
    console.log('confirm',$('#confirm'))
    console.log('confirm',$('#confirm').length)
    var check1 = 0;
    var check2 = 0;
    if (option1) var opt1 = option1; else var opt1 = 'OK';
    if (option2) var opt2 = option2; else var opt2 = 'CANCEL';
    var vConfirm = $('#confirm').length > 0 ?
        $('#confirm') :
        $('<div class="jqmAlert" id="confirm">'+
            '<div class="jqmAlertWindow" style="padding-bottom:20px;">'+
            '  <div class="jqmAlertTitle clearfix">'+
            '  </div>'+
            '  <div class="jqmAlertContent"><pre>'+msg+'</pre></div>'+
            '  <div class="jqmAlertFooter clearfix">'+
            '    <table class="tableBtnsAlert" align=center>'+
            '       <tr><td><div class="OK Button">'+opt1+'</div></td>'+
            '       <td><div class="CNL Button">'+opt2+'</div></td></tr>'+
            '    </table><br/>'+
            '  </div>'+
            '</div>'+
            '</div>')
            .appendTo("body")
            .jqm({trigger:false,modal:true,onHide:function(hash){
                hash.w.remove();
                if (hash.o)
                    hash.o.remove();
            }})
            .jqmShow()
            .find('div.OK')
            .click(function(){
                if (check1 === 0){
                    check1++;
                    $("#confirm").jqmHide();
                    callback1();
                }
            })
            .end()
            .find('div.CNL')
            .click(function(){
                if (check2 === 0){
                    check2++;
                    $("#confirm").jqmHide();
                    callback2();
                }
            });

    $(".jqmAlertFooter").css('width',$('.jqmAlertWindow').attr('offsetWidth')+'px');
}

function popUpPagoQr(msg,callback1,callback2,callback2,option1,option2,alertbtn){
    console.log('confirm',$('#confirm'))
    console.log('confirm',$('#confirm').length)
    var check1 = 0;
    var check2 = 0;
    var check3 = 0;
    if (option1) var opt1 = option1; else var opt1 = 'OK';
    if (option2) var opt2 = option2; else var opt2 = 'CANCEL';

    var html = '<div style="width: 400px;">\n   \n<div style="display: block; width: 100%;">'+msg+'</div>\n    <div style="position: relative;" class="jqmAlertFooter clearfix">\n        <table class="tableBtnsAlert" align=center>\n            <tr>\n                <td><div style="position: absolute; right: -5px;" class="QR Button">'+opt1+'</div></td>\n            </tr>\n        </table>\n    </div>\n</div>';

    var vConfirm = $('#confirm').length > 0 ?
        $('#confirm') :
        $('<div class="jqmAlert" id="confirm">'+
            '<div class="jqmAlertWindow" style="padding-bottom:20px; box-shadow: 2px 2px 5px #999;">'+
            '  <div class="jqmAlertTitle clearfix">'+
            '  </div>'+
            '  <i id="close" style="float: right; cursor: pointer;" class="fa fa-close fa-2x"></i>'+
            '  <br>'+
            '  <hr/>'+
            '  <div class="jqmAlertContent" style="font-family:FuturaLight; font-size: 13px;">'+html+'</div>'+
            '  <br><hr/>'+
            '  <div style="height: 60px;margin-top: 20px;padding-top: 15px;" class="jqmAlertFooter clearfix">'+
            '    <table class="tableBtnsAlert" align=center>'+
            '       <tr><td style="font-family:FuturaLight; font-size: 13px;">deseo continuar al sitio web del banco</td>'+
            '       <td><div class="CONTINUAR Button">'+opt2+'</div></td></tr>'+
            '    </table><br/>'+
            '  </div>'+
            '</div>'+
            '</div>')
            .appendTo("body")
            .jqm({trigger:false,modal:true,onHide:function(hash){
                hash.w.remove();
                if (hash.o)
                    hash.o.remove();
            }})
            .jqmShow()
            .find('div.QR')
            .click(function(){
                if (check1 === 0){
                    check1++;
                    $("#confirm").jqmHide();
                    callback1();
                }
            })
            .end()
            .find('div.CONTINUAR')
            .click(function(){
                if (check2 === 0){
                    check2++;
                    $("#confirm").jqmHide();
                    callback2();
                }
            })
            .end()
            .find('i#close')
            .click(function(){
                if (check3 === 0){
                    check3++;
                    $("#confirm").jqmHide();
                    callback3();
                }
            });

    $(".jqmAlertFooter").css('width',$('.jqmAlertWindow').attr('offsetWidth')+'px');
}
