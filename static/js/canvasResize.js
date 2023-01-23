/**
 * Resizes the passed canvas.
 *
 * @param canvas A DOM Canvas element.
 * @param context A 3D or 2D canvas context.
 * @param config.fullSize
 * @param config.width
 * @param config.height
 * @param callback An optional function(w,h).
 **/

var resizeCanvas = function( canvas, context, config, callback ) {
    var _setSize = function(w,h) {
	// console.log( 'resizeCanvas setSize: ' + w + 'x' + h );
	context.canvas.width  = w;
	context.canvas.height = h;
	
	canvas.width  = w;
	canvas.height  = h;

	if( typeof callback == 'function' )
	    callback(w,h);
    };
    if( config.fullSize ) _setSize( window.innerWidth, window.innerHeight );
	else if( config.fitToParent ) {
		console.log("FIT TO PARENT");
		var container = context.canvas.parentNode; // Element | Document | DocumentFragment;
		// context.canvas.style.display = "none";
		var w = container.clientWidth;
		var h = container.clientHeight;
		_setSize( w, h );
	}
    else                  _setSize( config.width, config.height );
};
//$( window ).resize( resizeCanvas );
