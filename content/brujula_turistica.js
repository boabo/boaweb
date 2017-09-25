



$(document).ready(function () {

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

    $(function () {
        $('#slider a:gt(0)').hide();
        var interval = setInterval(changeDiv, 6000);

        function changeDiv() {
            $('#slider a:first-child').fadeOut(1000).next('a').fadeIn(1000).end().appendTo('#slider');
        };
        $('.next').click(function () {
            changeDiv();
            clearInterval(interval);
            interval = setInterval(changeDiv, 6000);
        });
        $('.previous').click(function () {
            $('#slider a:first-child').fadeOut(1000);
            $('#slider a:last-child').fadeIn(1000).prependTo('#slider');
            clearInterval(interval);
            interval = setInterval(changeDiv, 6000);
        });
    });
});
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function (event) {
    if (!event.target.matches('.imgbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function girar(img, ac) {
    var acor = document.getElementById(ac)
    var rot = document.getElementById(img);
    if (acor.className == "accordion active") {
        rot.className = "rotate";
    } else {
        rot.className = "normal";
    }
}

