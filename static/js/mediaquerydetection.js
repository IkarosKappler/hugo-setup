'use strict';

/**
 * Translated the css/javascript breakpoint change detection found at
 *   http://zerosixthree.se/detecting-media-queries-with-javascript/
 * to plain and lightweight javascript (the old version used jQuery).
 *
 * @author  Ikaros Kappler
 * @date    2018-01-13
 * @version 1.0.0
 **/

window.addEventListener('load', function() {
    var Z63 = (function (parent, $) {

	var MediaQueryListener = function() {
            this.afterElement = window.getComputedStyle ? window.getComputedStyle(document.body, ':after') : false;
	    //console.log( this.afterElement.getPropertyValue('content') );
            this.currentBreakpoint = '';
            this.lastBreakpoint = '';
            this.init();
	};

	MediaQueryListener.prototype = {

            init: function () {
		var self = this;
		
		if(!self.afterElement) {
                    return;
		}

		self._resizeListener();

            },
            _resizeListener: function () {
		var self = this;

		/*
		$(window).on('resize orientationchange load', function() {
                    // Regexp for removing quotes added by various browsers
                    self.currentBreakpoint = self.afterElement.getPropertyValue('content').replace(/^["']|["']$/g, '');
                    console.log('current: ' + self.afterElement.getPropertyValue('content') );
                    if (self.currentBreakpoint !== self.lastBreakpoint) {
			$(window).trigger('breakpoint-change', self.currentBreakpoint);
			self.lastBreakpoint = self.currentBreakpoint;
                    }
		});
		*/
		var handler = function() {
                    // Regexp for removing quotes added by various browsers
                    self.currentBreakpoint = self.afterElement.getPropertyValue('content').replace(/^["']|["']$/g, '');
                    console.log('current: ' + self.afterElement.getPropertyValue('content') );
                    if (self.currentBreakpoint !== self.lastBreakpoint) {
			//$(window).trigger('breakpoint-change', self.currentBreakpoint);
			window.dispatchEvent(new Event('breakpoint-change'),self.currentBreakpoint);
			self.lastBreakpoint = self.currentBreakpoint;
                    }
		};
		window.addEventListener('resize',handler);
		window.addEventListener('orientationchange',handler);
		//window.addEventListener('load',handler);
		// This is already inside the load-handler
		handler();
                    
            }

	};

	parent.mediaqueryListener = parent.mediaqueryListener || new MediaQueryListener();

	return parent;

    }(Z63 || {}, null /*jQuery*/));

    //$(window).on('breakpoint-change', function(e, breakpoint) {
    window.addEventListener('breakpoint-change', function(e, breakpoint) {

	console.log( 'breakpoint: ' + breakpoint );
	
	if(breakpoint === 'bp-small') {
            //console.log( 'CSS Breakpoint <span>screen-small</span>' );
	}

	if(breakpoint === 'bp-medium') {
            //document.body.innerHTML = 'CSS Breakpoint <span>screen-medium</span>';
	}

	if(breakpoint === 'bp-large') {
            //document.body.innerHTML = 'CSS Breakpoint <span>screen-large</span>';
	}

    });

} );
