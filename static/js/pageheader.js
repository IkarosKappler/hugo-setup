/**
 * The sticks page header had this jQuery code. I ported it back to raw ECMA script
 * because in the beginning I wanted to avoid using large libraries.
 *
 * This was the code:
 *
 * $(window).scroll(function(){
 *   if ($(window).scrollTop() >= 300) {
 *      $('nav').addClass('fixed-header');
 *   }
 *   else {
 *      $('nav').removeClass('fixed-header');
 *   }
 * });
 *
 * @author  Ikaros Kappler
 * @date    2018-01
 * @version 1.0.1
 **/

window.onscroll = function() {
    var header = document.getElementById('pageheader');
    var nav    = document.getElementById('nav');
    
    function addClass(element,name) {
	var arr;
	arr = element.className.split(" ");
	if( arr.indexOf(name) == -1 ) {
            element.className += " " + name;
	}
    }

    function removeClass(element,name) {
	var arr;
	arr = element.className.split(" ");
	var pos;
	if( (pos = arr.indexOf(name)) != -1 ) {
	    arr.splice(pos,1);
            element.className = arr.join(' ');
	}
    }

    // 300 is the height of the header.
    if( window.pageYOffset >= 300 ) { // window.scrollY is only compatible with FF, Safari and Chrome
	addClass(nav,'fixed-header');
	addClass(avatar,'small-avatar' );
	addClass(nav_ul,'small-nav');
    } else {
	removeClass(nav,'fixed-header');
	removeClass(avatar,'small-avatar' );
	removeClass(nav_ul,'small-nav');
    }
}

// Initially trigger a scroll event.
window.dispatchEvent(new Event('scroll'));


/* Maybe animate the SVG header? This required inline SVG ... */
/*
window.addEventListener('load', function load() {
    window.removeEventListener('load', load, false);
    console.log('load'); 
    var banner = document.getElementsByClassName('header-banner')[0];
    banner.onmousemove = function(e) { 
	var x = e.pageX - this.offsetLeft; 
	var y = e.pageY - this.offsetTop;

	console.log('mouse at '+x+','+y );

	
	
    };
} );
*/
