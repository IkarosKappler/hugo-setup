/**
 * @author  Ikaros Kappler
 * @date    2017-02-26
 * @version 1.0.0
 **/

(function($) {

    function init() {
	
	var $container = $('#i2banim-pixel-container');

	var matrix = [
	    [ 0, 1, 1, 0, 0, 0, 0, 0 ], // 0 
	    [ 0, 0, 1, 0, 0, 0, 0, 0 ], // 1
	    [ 0, 0, 1, 0, 0, 0, 1, 0 ], // 2
	    [ 0, 0, 1, 0, 1, 1, 0, 0 ], // 3
	    [ 0, 1, 1, 1, 0, 0, 0, 0 ], // 4
	    [ 1, 0, 1, 0, 1, 1, 1, 0 ], // 5
	    [ 0, 0, 1, 1, 0, 0, 0, 1 ], // 6
	    [ 0, 0, 1, 0, 0, 0, 0, 1 ], // 7
	    [ 0, 0, 1, 0, 0, 0, 0, 1 ], // 8
	    [ 0, 0, 1, 0, 0, 0, 0, 1 ], // 9
	    [ 0, 0, 1, 1, 0, 0, 0, 1 ], // 10
	    [ 0, 1, 1, 0, 1, 1, 1, 0 ]  // 11
	];

	var $pixel_template = $('#i2ba_pixel_template');

	// FOR TESTING: HIDE THE IMAGE
	//TweenMax.set( '#icon_blank_final', { autoAlpha : 0 } );

	var $px = null;
	//var blackPixels = [];
	for( var r = 0; r < matrix.length; r++ ) {
	    var $row = $( '<div/>' ).addClass('i2ba_row');
	    for( var c = 0; c < matrix[r].length; c++ ) {
		$px = $('<div/>', { id : 'i2ba_'+r+'_'+c } ).addClass('i2ba_pixel');
		if( matrix[r][c] == 1 ) {
		    $px.append( $pixel_template.clone().attr('id','i2ba_pixel_'+(r*c+c)).addClass('i2ba_pixel i2ba_pixel_black').removeClass('no-display').data('is-black',true) );
		    //blackPixels.push( $px );
		}
		$row.append( $px );
		TweenMax.set( $px, { transformOrigin : '50% 50%', scale : 1, rotation : 0 } );
	    }
	    $container.append( $row );
	}

	
	var timeline = new TimelineMax();
	var pixels = $( '.i2ba_pixel' );
	timeline
	    .staggerFrom( pixels, 0.5, { autoAlpha : 0, delay : Math.random()*1.0, scale : 0, rotation : 90 }, 0.01, '+=0.0' )
	    .from( 'img#icon_blank_final', 0.5, { autoAlpha : 0 }, '+=0.5' )
	;



	
	pixels.mouseover( function(e) {
	    var $px = $(e.target);
	    //if( $px.data('animation-running') )
	//	return;
	    //console.debug('hover id='  + $px.attr('id') + ', is-black=' + $px.data('is-black') );
	    //$px.data('animation-running',true);
	    if( $px.data('is-black') ) {
		TweenMax.set( $px, { backgroundColor : 'rgb(255,255,255)', rotation : 90, borderRadius : 0, scale : 0 } );
		TweenMax.to(  $px, 0.5, { backgroundColor : 'rgb(0,0,0)', rotation : 0, borderRadius : 8, scale : 1 } );
	    } else {
		//TweenMax.set( $px, { backgroundColor : 'rgb(0,0,0)', rotation : 90, autoAlpha : 1 } );
		//TweenMax.to(  $px, 0.5, { backgroundColor : 'rgb(255,255,255)', rotation : 0, autoAlpha : 0.05, onComplete : function() { console.log('C'); $px.data('animation-running',false); }  } );
	    }
	} );

	//var $canvas = $('canvas#girih_canvas');
	//window.addEventListener('resize',function() { resizeCanvas($canvas,context,{fullSize:true},function(w,h) { console.log('canvas resized. w='+w+',h='+h); }); } );
	
    } // END init

    $(document).ready( init );
    
})($);
