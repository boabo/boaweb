/**
 * Created by faviofigueroa on 9/1/18.
 */



var menu = (function () {

    var transformOriginal;
    var $wrapper;
    var $menu;
    function init(){
        //buscamos


        $wrapper = $("#wrapperMenu");

        transformOriginal =  verEstiloMenu();
        $wrapper.css({"height":"60px"});
        Store();
    }

    function verEstiloMenu() {
        console.log('transformOriginal',transformOriginal)
        var element = document.getElementById('MenuMobile');
        var style = window.getComputedStyle(element);
        var transform = style.getPropertyValue('transform');
        console.log(transform)

        if(transformOriginal == transform){

            $wrapper.css({"height":"60px"});
        }else{
            $wrapper.css({"height":"100%"});

        }
        return transform;

    }
    function Store(callback){
        $.getJSON( "content/menu/menu.json", function( data ) {

            dibujarMenuMob(data)
        });

    }
    function dibujarMenuMob(data){


        $menu = $("#MenuMobile");

        console.log($menu);
        console.log(data);
        var $ul = $('<ul style="margin-top: 100px;"></ul>');
        $.each(data.menu,function (k,v) {

            if(Array.isArray(v.subMenu)){
                var $li = $('<li></li>');
                $li.append('<label for="menu-'+k+'">'+v.name+'</label>');
                $li.append('<input type="checkbox" id="menu-'+k+'" name="menu-'+k+'" class="menu-checkbox">');


                var $Aux = subMenu(v.subMenu,k);
                $li.append($Aux);
                $ul.append($li);
                console.log('tiene hijos');

            }else{
                $ul.append('<li><a href="#">'+v.name+'</a></li>')
            }

        });
        $menu.append($ul)

    }
    function subMenu(data,position) {

        var $subMenu = $('<div class="menuMob"></div>');
        $subMenu.append('<label class="menu-toggle" for="menu-'+position+'"><span>Toggle</span></label>');
        var $ul = $('<ul style="margin-top: 100px;"></ul>');
        $.each(data,function (k,v) {
            console.log(v)
            if(Array.isArray(v.subMenu)){
                var $li = $('<li></li>');
                $li.append('<label for="menu-'+position+'-'+k+'">'+v.name+'</label>');
                $li.append('<input type="checkbox" id="menu-'+position+'-'+k+'" name="menu-'+position+'-'+k+'" class="menu-checkbox">');

                var aux = subMenu(v.subMenu,position+'-'+k);
                $li.append(aux);
                $ul.append($li);


            }else{
                $ul.append('<li><a href="'+v.link+'">'+v.name+'</a></li>')
            }
        });
        $subMenu.append($ul);
        return $subMenu;
    }

    return {
        init: init,
        verEstiloMenu:verEstiloMenu,
        Store:Store
    };

})();



$(document).ready( menu.init());


/*$("#primerMenu").bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
    menu.verEstiloMenu();
});*/

