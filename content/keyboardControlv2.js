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
    var $currentMenu;

    function anteriorActivoMenu() {

        console.log('$currentMenu',$currentMenu)
        console.log('$currentMenu next',$currentMenu.next())
        if($currentMenu.prev().length === 1){
            if($currentMenu.prev().is(":visible")){

                seleccionarMenu($currentMenu.prev());

            }else{
                $currentMenu.find('div').hide(); // menu selesccionado anterior
                $currentMenu = $currentMenu.prev();
                anteriorActivoMenu();
            }
        }


    }
    function siguienteActivoMenu() {

        console.log('$currentMenu',$currentMenu)
        console.log('$currentMenu next',$currentMenu.next())
        if($currentMenu.next().length === 1){
            if($currentMenu.next().is(":visible")){

                seleccionarMenu($currentMenu.next());

            }else{
                $currentMenu.find('div').hide(); // menu selesccionado anterior
                $currentMenu = $currentMenu.next();
                siguienteActivoMenu();
            }
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

    function seleccionarMenu($currentTarget) {

        if($seleccionado != undefined){
            $seleccionado.removeClass('activado');
            $seleccionado = undefined
        }
        if($currentMenu !== undefined){
            $currentMenu.find('div').hide(); // menu selesccionado anterior
        }
        var secondaryMenuContainer = $currentTarget.find('.secondary-menu-container');
        secondaryMenuContainer.show();
        $currentTarget.find('div').show();

        $currentMenu = $currentTarget; // asignamos el nuevo menu
    }
    function eventoKeyDown(event) {

        console.log('event',event);
        console.log('event',event.TAB);
        var $currentTarget = $(event.currentTarget);

        switch (event.key) {
            case ' ': //este es el espacio
            case 'Enter':
                if($seleccionado !== undefined){
                    $seleccionado.find('a').click();
                }
                break;
            case 'ArrowDown':
                if($seleccionado === undefined){
                    activarSubmenu($currentMenu.find('li:first'));
                }else{
                    activarSubmenu($seleccionado.next());
                }
                break;

            case 'ArrowLeft':
                if($seleccionado != undefined){
                    var $contenedorPadreSeleccionado = $seleccionado.closest('td'); // en caso que tenga mas de uno
                    if ($contenedorPadreSeleccionado.prev().length === 1) { // si entra trabaja sobre el mismo menu

                        activarSubmenu($contenedorPadreSeleccionado.prev().find('li:first'));

                    } else { // se va al siguiente menu
                        $menuContainer.find('div').hide();
                        anteriorActivoMenu();

                        console.log('$menuContainer encontrado', $menuContainer)
                    }
                }else{
                    anteriorActivoMenu();

                }
                break;

            case 'ArrowRight':
                if($seleccionado != undefined){
                    var $contenedorPadreSeleccionado = $seleccionado.closest('td'); // en caso que tenga mas de uno
                    if ($contenedorPadreSeleccionado.next().length === 1) { // si entra trabaja sobre el mismo menu

                        activarSubmenu($contenedorPadreSeleccionado.next().find('li:first'));

                    } else { // se va al siguiente menu
                        $menuContainer.find('div').hide();
                        siguienteActivoMenu();

                        console.log('$menuContainer encontrado', $menuContainer)
                    }
                }else{
                    siguienteActivoMenu();

                }

                break;

            case 'ArrowUp':
                if($seleccionado !== undefined){
                    activarSubmenu($seleccionado.prev());
                }
                break;

            case 'HOME':
            case 'PAGEUP':

                break;

            case 'END':
            case 'PAGEDOWN':

                break;

            case 'Tab':
                console.log('tab',$currentTarget)
                seleccionarMenu($currentTarget)
                break;

            case 'ESC':
                break;

            default:

                break;
        }
    }
    function init(){

        //seleccionamos solo los hijos directos
        $.each($mainMenu.find('> li'),function (k,v) {
            var $subMenu = $(this);
            $subMenu.keydown(function (e) {
                eventoKeyDown(e)
            });


        });


    }

    return {
        init
    }
})();