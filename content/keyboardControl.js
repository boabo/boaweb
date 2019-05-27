/**
 * Created by faviofigueroa on 5/27/19.
 * con este script podremos controlar algun objecto dom desde el teclado
 * primer ejemplo para controlar el menu con el teclado
 */


window.keyboardControl = (() => {

    var $mainMenu = $("#main_menu"); // added Context
    var menuActivado = false;
    var $menuContainer = $mainMenu.find('#menu_item_planifica');
    var secondaryMenuContainer;
    var $seleccionado;
    function init(){

        document.onkeyup = function(e) {
            console.log(e)
            if (e.ctrlKey && e.keyCode === 80) { // control + p
                $menuContainer.find('div').hide();
                $menuContainer = $mainMenu.find('#menu_item_planifica');

                secondaryMenuContainer = $menuContainer.find('.secondary-menu-container');
                secondaryMenuContainer.show();
                $menuContainer.find('div').show();

                activarSubmenu(secondaryMenuContainer.find('li:first'));

            }else if(menuActivado && e.keyCode === 40) {
                activarSubmenu($seleccionado.next());

            }else if(menuActivado && e.keyCode === 38) {
                activarSubmenu($seleccionado.prev());

            }else if(menuActivado && e.keyCode === 39) { //ArrowRight

                console.log('td',$seleccionado.closest('td'))
                var $contenedorPadreSeleccionado = $seleccionado.closest('td'); // en caso que tenga mas de uno
                if ($contenedorPadreSeleccionado.next().length === 1) { // si entra trabaja sobre el mismo menu

                    activarSubmenu($contenedorPadreSeleccionado.next().find('li:first'));

                } else { // se va al siguiente menu
                    $menuContainer.find('div').hide();
                    EncontrarSiguienteActivoMenu();

                    console.log('$menuContainer encontrado', $menuContainer)
                }

            }else if(menuActivado && e.keyCode === 37) { //ArrowLeft

                var $contenedorPadreSeleccionado = $seleccionado.closest('td'); // en caso que tenga mas de uno
                if ($contenedorPadreSeleccionado.prev().length === 1) { // si entra trabaja sobre el mismo menu

                    activarSubmenu($contenedorPadreSeleccionado.prev().find('li:first'));

                } else { // se va al siguiente menu
                    $menuContainer.find('div').hide();
                    EncontrarAnteriorActivoMenu();

                    console.log('$menuContainer encontrado', $menuContainer)
                }

            }else if(menuActivado && e.keyCode === 13) { //enter

                $seleccionado.find('a').click();

            }
        };

    }

    function EncontrarAnteriorActivoMenu() {
        if($menuContainer.prev().length === 1){
            $menuContainer = $menuContainer.prev();
            if($menuContainer.is(":visible")){

                secondaryMenuContainer = $menuContainer.find('.secondary-menu-container');
                secondaryMenuContainer.show();
                $menuContainer.find('div').show();

                activarSubmenu(secondaryMenuContainer.find('li:first'));

            }else{
                EncontrarAnteriorActivoMenu();
            }
        }else{ //si no se encuentra se cierra todo el menu
            console.log('ya no se encontro ningun menu')
            menuActivado = false;
        }

    }
    function EncontrarSiguienteActivoMenu() {
        if($menuContainer.next().length === 1){
            $menuContainer = $menuContainer.next();
            console.log('$menuContainer.isVisible()',$menuContainer.is(":visible"))
            if($menuContainer.is(":visible")){

                secondaryMenuContainer = $menuContainer.find('.secondary-menu-container');
                secondaryMenuContainer.show();
                $menuContainer.find('div').show();

                activarSubmenu(secondaryMenuContainer.find('li:first'));

            }else{
                EncontrarSiguienteActivoMenu();
            }
        }else{ //si no se encuentra se cierra todo el menu
            console.log('ya no se encontro ningun menu')
            menuActivado = false;
        }

    }
    function activarSubmenu($contextSubMenu){
        if ($seleccionado != undefined) {
            $seleccionado.removeClass('activado');
        }
        $contextSubMenu.addClass('activado');
        menuActivado = true;

        $seleccionado = $contextSubMenu;
    }

    return {
        init
    }
})();