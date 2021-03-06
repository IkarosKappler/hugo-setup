/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/


IKRS.GirihCanvasHandler = function( imageObject ) {
    
    IKRS.Object.call( this );
    
    this.imageObject               = imageObject;

    this.canvasWidth               = 1024;
    this.canvasHeight              = 768;
    
    this.canvas                    = document.getElementById("girih_canvas");
    // Make a back-reference for event handling
    this.canvas.girihCanvasHandler = this; 
    this.context                   = this.canvas.getContext( "2d" );    
    
    this.drawOffset                = new IKRS.Point2( 512, 384 );
    this.zoomFactor                = 1.0;
  
    this.girih                     = new IKRS.Girih();

    this.drawProperties            = { drawCoordinateSystem:     false,  // Currently not editable (no UI component)
				       drawBoxes:                false,
				       drawOutlines:             true,
				       drawTexture:              true,
				       drawInnerPolygons:        true,
				       innerRandomColorFill:     false, //true
				       outerRandomColorFill:     false,
				       backgroundColor:          "#ffffff" //"#F0F0F0"
				     };
    this.properties                = { allowPenroseTile:         true,
				       drawPenroseCenterPolygon: true
				     };
    
    this.adjacentTileOptionPointer = 0;
    
    this.canvas.onmousedown        = this.mouseDownHandler;
    this.canvas.onmouseup          = this.mouseUpHandler;
    this.canvas.onmousemove        = this.mouseMoveHandler;
    

    // Install a mouse wheel listener
    if( this.canvas.addEventListener ) { 
	// For Mozilla 
	this.canvas.addEventListener( 'DOMMouseScroll', this.mouseWheelHandler, false );
    } else {
	// IE
	this.canvas.onmousewheel = document.onmousewheel = mouseWheelHandler;
    }
   
    window.addEventListener( "keydown",   this.keyDownHandler,   false );
};

IKRS.GirihCanvasHandler.prototype.setTextureImage = function( imageObject, 
							      redraw 
							    ) {
    this.imageObject = imageObject;
    if( redraw )
	this.redraw();
};

IKRS.GirihCanvasHandler.prototype._translateMouseEventToRelativePosition = function( parent,
										     e ) {
    var rect = parent.getBoundingClientRect();
    var left = e.clientX - rect.left - parent.clientLeft + parent.scrollLeft;
    var top  = e.clientY - rect.top  - parent.clientTop  + parent.scrollTop;

    // Add draw offset :)
    var relX = (left - this.drawOffset.x) / this.zoomFactor;
    var relY = (top  - this.drawOffset.y) / this.zoomFactor;

    return new IKRS.Point2( relX, relY );
}




IKRS.GirihCanvasHandler.prototype.mouseWheelHandler = function( e ) {

    var delta = 0;
    if (!e)                 // For IE.
	e = window.event;
    if (e.wheelDelta) {     // IE/Opera.
	delta = e.wheelDelta/120;
    } else if (e.detail) {  // Mozilla case. 
	// In Mozilla, sign of delta is different than in IE.
	// Also, delta is multiple of 3.
	delta = -e.detail/3;
    }
    // If delta is nonzero, handle it.
    // Basically, delta is now positive if wheel was scrolled up,
    // and negative, if wheel was scrolled down.
    if (delta) {
	
	if( delta < 0 )
	    this.girihCanvasHandler.decreaseZoomFactor( true ); // redraw
	else
	    this.girihCanvasHandler.increaseZoomFactor( true ); // redraw
	
    }
    // Prevent default actions caused by mouse wheel.
    // That might be ugly, but we handle scrolls somehow
    // anyway, so don't bother here..
    if( e.preventDefault )
	e.preventDefault();
    e.returnValue = false;
}

IKRS.GirihCanvasHandler.prototype.mouseDownHandler = function( e ) {

    var point     = this.girihCanvasHandler._translateMouseEventToRelativePosition( this, e );

    var tileIndex = this.girihCanvasHandler._locateTileAtPoint( point );
    if( tileIndex == -1 )
	return;  // Hover over blank space

    
    // Adjacent tile displayed?
    var tile             = null;
    var adjacentTile     = null;
    var hoveredTileIndex = this.girihCanvasHandler._locateHoveredTile();
    if( hoveredTileIndex != -1 ) {
    
	tile            = this.girihCanvasHandler.girih.tiles[ hoveredTileIndex ]; 

	// Check if cursor is not directly on center
	if( tile.position.distanceTo(point) > 5 ) {

	    var tileBounds   = tile.computeBounds();

	    adjacentTile = this.girihCanvasHandler._resolveCurrentAdjacentTilePreset(   tile.tileType,
											tile.polygon.vertices, 
											tile.position, 
											tile.angle,
											tileBounds, // tile.computeBounds(),  // tileBounds,
											{ unselectedEdgeColor: "#000000",
											  selectedEdgeColor:   "#e80088"
											},
											tile.imageProperties,
											this.girihCanvasHandler.imageObject,
											tile._props.highlightedEdgeIndex,
											this.girihCanvasHandler.drawProperties.drawOutlines
										    );
	}
    }

    if( !adjacentTile) {
	// Not adjacent tile found for this location
	//  -> select tile

	// Clear all selection
	this.girihCanvasHandler._clearSelection();

	// Set the tile's 'selected' state
	this.girihCanvasHandler.girih.tiles[tileIndex]._props.selected = true; 
	// DEBUG( "[mouseDown] tileIndex=" + tileIndex + ", selected=" + his.girihCanvasHandler.tiles[tileIndex]._props.selected );
	this.girihCanvasHandler.redraw();
    } else {
	this.girihCanvasHandler._performAddCurrentAdjacentPresetTile();
    }
}

IKRS.GirihCanvasHandler.prototype.mouseUpHandler = function( e ) {
    
}

IKRS.GirihCanvasHandler.prototype.mouseMoveHandler = function( e ) {

    // Find old hovered tile  
    var oldHoverTileIndex       = this.girihCanvasHandler._locateHoveredTile();
    var oldHoverTile            = null; 
    var oldHighlightedEdgeIndex = -1;
    if( oldHoverTileIndex != -1 ) {
	oldHoverTile = this.girihCanvasHandler.girih.tiles[ oldHoverTileIndex ];  // May be null!
	oldHighlightedEdgeIndex = oldHoverTile._props.highlightedEdgeIndex;
    }

    // Locate the edge the mouse hovers over
    var point     = this.girihCanvasHandler._translateMouseEventToRelativePosition( this, e );
    //window.alert( "[mouseMoved] translated point: " + point.toString() );
    
    this.girihCanvasHandler._clearHovered();

    // THIS MUST BE THOUGHT ABOUT ONCE MORE
    var hoverTileIndex = this.girihCanvasHandler._locateTileAtPoint( point );
    if( hoverTileIndex == -1 ) {
	DEBUG( "[mouseMoved] CLEARED hoverTileIndex=" + hoverTileIndex );
	if( oldHoverTileIndex != hoverTileIndex )
	    this.girihCanvasHandler.redraw();
	return;
    }
    var hoverTile      = this.girihCanvasHandler.girih.tiles[ hoverTileIndex ];
 
    hoverTile._props.hovered = true;  // may be the same object

    // Try to find the point from the center of the edge, with
    // a radius of half the edge's length
    var highlightedEdgeIndex = hoverTile.locateEdgeAtPoint( point, 
							    hoverTile.size/2.0 * this.girihCanvasHandler.zoomFactor
							  );
    
    DEBUG( "[mouseMoved] hoverTileIndex=" + hoverTileIndex + ", highlightedEdgeIndex=" + highlightedEdgeIndex + ", hoverTile.position=" + hoverTile.position.toString() + ", hoverTile.angle=" + _angle2constant(hoverTile.angle) );
    

    
    
    hoverTile._props.highlightedEdgeIndex = highlightedEdgeIndex;
    // Were there any changes at all?
    if( oldHoverTileIndex != hoverTileIndex || oldHighlightedEdgeIndex != highlightedEdgeIndex )
	this.girihCanvasHandler.redraw();
}

IKRS.GirihCanvasHandler.prototype.keyDownHandler = function( e ) {

    // right=39,  d=68
    // left=37,   a=65
    // enter=13
    // delete=46
    // space=32
    // o=79
    // t=84
    // e=69
    //window.alert( e.keyCode );

    if( e.keyCode == 39 || e.keyCode == 68 ) {
	this.girihCanvasHandler.adjacentTileOptionPointer++;
	this.girihCanvasHandler.redraw();
    } else if( e.keyCode == 37 || e.keyCode == 65) {
	this.girihCanvasHandler.adjacentTileOptionPointer--;
	this.girihCanvasHandler.redraw();
    } else if( e.keyCode == 13 || e.keyCode == 32 ) {
	this.girihCanvasHandler._performAddCurrentAdjacentPresetTile();
    } else if( e.keyCode == 46 ) {
	this.girihCanvasHandler._performDeleteSelectedTile();
    } else if( e.keyCode == 79 ) {
	this.girihCanvasHandler.drawProperties.drawOutlines = !this.girihCanvasHandler.drawProperties.drawOutlines;
	this.girihCanvasHandler.redraw();
    } else if( e.keyCode == 84 ) {
	this.girihCanvasHandler.drawProperties.drawTextures = !this.girihCanvasHandler.drawProperties.drawTextures;
	this.girihCanvasHandler.redraw();
    } else if( e.keyCode == 69 ) {
	this.girihCanvasHandler._exportSVG();
    }
  
}

IKRS.GirihCanvasHandler.prototype._locateSelectedTile = function() {
    for( var i = 0; i < this.girih.tiles.length; i++ ) {
	if( this.girih.tiles[i]._props.selected )
	    return i;
    }
    // Not found
    return -1; 
}

IKRS.GirihCanvasHandler.prototype._locateHoveredTile = function() {
    for( var i = 0; i < this.girih.tiles.length; i++ ) {
	if( this.girih.tiles[i]._props.hovered )
	    return i;
    }
    return -1;
}

IKRS.GirihCanvasHandler.prototype._clearSelection = function() {
    for( var i = 0; i < this.girih.tiles.length; i++ ) {
	this.girih.tiles[i]._props.selected             = false;
    }
}

IKRS.GirihCanvasHandler.prototype._clearHovered = function() {
    for( var i = 0; i < this.girih.tiles.length; i++ ) {
	this.girih.tiles[i]._props.hovered = false;
	this.girih.tiles[i]._props.highlightedEdgeIndex = -1;
    }
}

IKRS.GirihCanvasHandler.prototype._resolveCurrentAdjacentTilePreset = function( tileType,
										points,
										position, 
										angle,
										originalBounds,
										colors,
										imgProperties,
										imageObject,
										highlightedEdgeIndex,
										drawOutlines
									      ) {  
    
    if( !points || highlightedEdgeIndex == -1 )
	return;

    // Adjacent tile presets available for this tile/edge/option?
    if( !IKRS.Girih.TILE_ALIGN[tileType] )
	return;

    if( !IKRS.Girih.TILE_ALIGN[tileType][highlightedEdgeIndex] )
	return;
    
    
    var presets = IKRS.Girih.TILE_ALIGN[tileType][highlightedEdgeIndex]; 

    // Has any adjacent tiles at all?
    // (should, but this prevents the script from raising unwanted exceptions)
    if( !presets || presets.length == 0 )
	return null;

    
    var optionIndex = this.adjacentTileOptionPointer % presets.length;
    if( optionIndex < 0 )
	optionIndex = presets.length + optionIndex;

    var tileAlign      = presets[optionIndex];
    
 
    var tile = tileAlign.createTile();

    // Make position relative to the hovered tile
    tile.position.add( position ); 
    tile.position.rotate( position, angle );
    tile.angle += angle;

    return tile;
};

IKRS.GirihCanvasHandler.prototype._performAddCurrentAdjacentPresetTile = function() {
    
    var hoveredTileIndex = this._locateHoveredTile();
    if( hoveredTileIndex == -1 ) 
	return;
    
    var tile         = this.girih.tiles[ hoveredTileIndex ]; 
    var tileBounds   = tile.computeBounds();

    var adjacentTile = this._resolveCurrentAdjacentTilePreset(   tile.tileType,
								 tile.polygon.vertices, 
								 tile.position, 
								 tile.angle,
								 tileBounds, 
								 { unselectedEdgeColor: "#000000",
								   selectedEdgeColor:   "#e80088"
								 },
								 tile.imageProperties,
								 this.imageObject,
								 tile._props.highlightedEdgeIndex,
								 this.drawProperties.drawOutlines								 
							     );
    if( !adjacentTile )
	return;
    
    if( adjacentTile.tileType == IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS && !this.getProperties().allowPenroseTile ) {
	DEBUG( "Penrose tile not allowed." );
	return;
    }

    // Finally: the adjacent tile position might not be acurate.
    //          Make some fine tuning.
    var currentEdgePointA = tile.getTranslatedVertex( tile._props.highlightedEdgeIndex );
    var currentEdgePointB = tile.getTranslatedVertex( tile._props.highlightedEdgeIndex+1 );
    var tolerance         = 5.0;
    var adjacentEdgeIndex = adjacentTile.locateAdjacentEdge( currentEdgePointA, 
							     currentEdgePointB, 
							     tolerance 
							   );
    var adjacentEdgePointA;
    var adjacentEdgePointB;
    var pointDifferences;
    // Swap edge points?
    if( adjacentEdgeIndex != -1 ) {

	// An even edge.
	adjacentEdgePointA = adjacentTile.getTranslatedVertex( adjacentEdgeIndex ); 
	adjacentEdgePointB = adjacentTile.getTranslatedVertex( adjacentEdgeIndex+1 );

    } else if( (adjacentEdgeIndex = adjacentTile.locateAdjacentEdge(currentEdgePointB,currentEdgePointA,tolerance)) != -1 ) {
	
	// An odd edge: Swapped points (reverse edge)
	adjacentEdgePointA = adjacentTile.getTranslatedVertex( adjacentEdgeIndex+1 ); 
	adjacentEdgePointB = adjacentTile.getTranslatedVertex( adjacentEdgeIndex ); 
    } 

    if( adjacentEdgeIndex != -1 ) {

	pointDifferences = [ adjacentEdgePointA.clone().sub( currentEdgePointA ),
			     adjacentEdgePointB.clone().sub( currentEdgePointB ) 
			   ];
	/*
	window.alert( "adjacentEdgePointA=" + adjacentEdgePointA.toString() + ",\n" +
		      "adjacentEdgePointB=" + adjacentEdgePointB.toString() + ",\n" +
		      "currentEdgePointA=" + currentEdgePointA.toString() + ",\n" +
		      "currentEdgePointB=" + currentEdgePointB.toString() + ",\n" +
		      "highlightedEdgeIndex=" + tile._props.highlightedEdgeIndex + ",\n" +
		      "adjacentEdgeIndex=" + adjacentEdgeIndex + ",\n" +
		      "adjacentTile.angle=" + adjacentTile.angle
		    );		      
		    */

	// Calculate average difference
	var avgDifference = IKRS.Point2.ZERO_POINT.clone();
	for( var i = 0; i < pointDifferences.length; i++ ) {
	    avgDifference.add( pointDifferences[i] );
	}
	avgDifference.x /= pointDifferences.length;
	avgDifference.y /= pointDifferences.length;
	
	//window.alert( "avgDifference=" + avgDifference.toString() );

	adjacentTile.position.sub( avgDifference );
    }

    this.addTile( adjacentTile );
    this.redraw();
}

IKRS.GirihCanvasHandler.prototype._performDeleteSelectedTile = function() {

    var selectedTileIndex = this._locateSelectedTile();
    if( selectedTileIndex == -1 )
	return;

    this.girih.tiles.splice( selectedTileIndex, 1 );
    this.redraw();
}

IKRS.GirihCanvasHandler.prototype.addTile = function( tile ) {

    // Add internal properties to the tile
    tile._props = { selected:              false,
		    hovered:               false,
		    highlightedEdgeIndex:  -1,
		  };
    this.girih.addTile( tile );
}

IKRS.GirihCanvasHandler.prototype._locateTileAtPoint = function( point ) {

    for( var i = this.girih.tiles.length-1; i >= 0; i-- ) {
	
	// Ignore Penrose-Tile?
	if( this.girih.tiles[i].tileType == IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS && !this.getProperties().allowPenroseTile ) 
	    continue;

	if( this.girih.tiles[i].containsPoint(point) )
	    return i;
	
    }
    
    // Not found
    return -1;

}

IKRS.GirihCanvasHandler.prototype._drawTile = function( tile ) {  

    // Penrose tile allowed?
    if( tile.tileType == IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS && !this.getProperties().allowPenroseTile ) {
	return;
    }


    var tileBounds = tile.computeBounds();
    if( this.drawProperties.drawBoxes ) {
	this._drawBoundingBox( tile.position,
			       tileBounds,
			       tile.angle 
			     );
    }
    this._drawPolygonFromPoints( tile.polygon.vertices, 
				 tile.position, 
				 tile.angle,
				 tileBounds,
				 { unselectedEdgeColor: "#000000",
				   selectedEdgeColor:   "#e80088",
				   fillColor:           null        // Do not fill
				 },
				 tile.imageProperties,
				 this.imageObject,
				 tile._props.highlightedEdgeIndex,
				 this.drawProperties.drawOutlines
			       );
    if( this.drawProperties.drawInnerPolygons )	{
	//if( tile.tileType == IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS && this.getProperties().drawPenroseCenterPolygon )
	//    this._drawInnerTilePolygons( tile, [ tile.getCenterPolygonIndex() ] );
	//else 
	this._drawInnerTilePolygons( tile );
	this._drawOuterTilePolygons( tile );
    }
    if( this.drawProperties.drawOutlines || tile._props.selected )
	this._drawCrosshairAt( tile.position, tile._props.selected );
};

/**
 * The 'colors' object may contain:
 *  - unselectedEdgeColor
 *  - selectedEdgeColor
 *  - fillColor
 **/
IKRS.GirihCanvasHandler.prototype._drawPolygonFromPoints = function( points,
								     position, 
								     angle,
								     originalBounds,
								     colors,
								     imgProperties,
								     imageObject,
								     highlightedEdgeIndex,
								     drawOutlines
								   ) {  
    
    if( !points )
	return;

    this.context.save();
    
    this.context.beginPath();
    var point      = points[0].clone();
    point.rotate( IKRS.Point2.ZERO_POINT, angle );
    var startPoint = point.clone();
    this.context.moveTo( point.x * this.zoomFactor + this.drawOffset.x + position.x * this.zoomFactor, 
			 point.y * this.zoomFactor + this.drawOffset.y + position.y * this.zoomFactor
		       );
    

    var bounds = new IKRS.BoundingBox2( point.x, point.y, point.x, point.y );

    for( var i = 1; i < points.length; i++ ) {

	point.set( points[i] );
	point.rotate( IKRS.Point2.ZERO_POINT, angle );
	//window.alert( "point=(" + point.x + ", "+ point.y + ")" );
	this.context.lineTo( point.x * this.zoomFactor + this.drawOffset.x + position.x * this.zoomFactor, 
			     point.y * this.zoomFactor + this.drawOffset.y + position.y * this.zoomFactor
			   );

	bounds.xMin = Math.min( point.x, bounds.xMin );
	bounds.xMax = Math.max( point.x, bounds.xMax );
	bounds.yMin = Math.min( point.y, bounds.yMin );
	bounds.yMax = Math.max( point.y, bounds.yMax );
    }
    // Close path
    this.context.lineTo( startPoint.x * this.zoomFactor + this.drawOffset.x + position.x * this.zoomFactor, 
			 startPoint.y * this.zoomFactor + this.drawOffset.y + position.y * this.zoomFactor
		       );
    this.context.closePath();
    

    
    if( this.drawProperties.drawTextures && 
	imgProperties && 
	imageObject ) { 

	// Build absolute image bounds from relative
	var imgBounds = new IKRS.BoundingBox2( imgProperties.source.x * imageObject.width,
					       (imgProperties.source.x + imgProperties.source.width) * imageObject.width,
					       imgProperties.source.y * imageObject.height,
					       (imgProperties.source.y + imgProperties.source.height) * imageObject.height
					     );
	var polyImageRatio = new IKRS.Point2( originalBounds.getWidth() / imgBounds.getWidth(),
					      originalBounds.getHeight() / imgBounds.getHeight()
					    );
	//window.alert( "polyImageRatio=" + polyImageRatio );

	this.context.clip();
	var imageX = this.drawOffset.x + position.x * this.zoomFactor + originalBounds.xMin * this.zoomFactor;
	var imageY = this.drawOffset.y + position.y * this.zoomFactor + originalBounds.yMin * this.zoomFactor;	
	var imageW = (originalBounds.getWidth() + imgProperties.destination.xOffset*imageObject.width*polyImageRatio.x) * this.zoomFactor; 
	var imageH = (originalBounds.getHeight() + imgProperties.destination.yOffset*imageObject.height*polyImageRatio.y) * this.zoomFactor; 

	
	this.context.translate( imageX + imageW/2.0, 
				imageY + imageH/2.0 
			      );
	
	this.context.rotate( angle ); 
	
	var drawStartX = (-originalBounds.getWidth()/2.0) * this.zoomFactor; 
	var drawStartY = (-originalBounds.getHeight()/2.0) * this.zoomFactor; 
	this.context.drawImage( imageObject,
				imgProperties.source.x*imageObject.width,                    // source x
				imgProperties.source.y*imageObject.height,                   // source y
				imgProperties.source.width*imageObject.width,                // source width
				imgProperties.source.height*imageObject.height,              // source height
				drawStartX + imgProperties.destination.xOffset*imageObject.width*polyImageRatio.x*0.5*this.zoomFactor,         // destination x
				drawStartY + imgProperties.destination.yOffset*imageObject.height*polyImageRatio.y*0.5*this.zoomFactor,        // destination y
				(originalBounds.getWidth() - imgProperties.destination.xOffset*imageObject.width*polyImageRatio.x) * this.zoomFactor,       // destination width
				(originalBounds.getHeight() - imgProperties.destination.yOffset*imageObject.height*polyImageRatio.y) * this.zoomFactor      // destination height
			      );	
    }


    // Fill polygon with color (eventually additional to texture)?
    if( colors.fillColor ) {
	//window.alert( "fillColor=" + colors.fillColor );

	this.context.fillStyle = colors.fillColor;
	this.context.fill();

    }
    

    // Draw outlines?
    if( drawOutlines && colors.unselectedEdgeColor ) {
	this.context.lineWidth   = 1.0;
	this.context.strokeStyle = colors.unselectedEdgeColor;
	this.context.stroke(); 
    }

    this.context.restore();

}

IKRS.GirihCanvasHandler.prototype._drawHighlightedPolygonEdge = function( points,
									  position, 
									  angle,
									  originalBounds,
									  colors,
									  imgProperties,
									  imageObject,
									  highlightedEdgeIndex,
									  drawOutlines
								   ) {  
    
    if( !points || highlightedEdgeIndex == -1 )
	return;

    this.context.save();
    
    var pointA = points[ highlightedEdgeIndex ].clone();
    var pointB = points[ highlightedEdgeIndex+1 < points.length ? highlightedEdgeIndex+1 : 0 ].clone();

    pointA.rotate( IKRS.Point2.ZERO_POINT, angle );
    pointB.rotate( IKRS.Point2.ZERO_POINT, angle );


    this.context.beginPath();
    this.context.lineTo( pointA.x * this.zoomFactor + this.drawOffset.x + position.x * this.zoomFactor, 
			 pointA.y * this.zoomFactor + this.drawOffset.y + position.y * this.zoomFactor
		       );
    this.context.lineTo( pointB.x * this.zoomFactor + this.drawOffset.x + position.x * this.zoomFactor, 
			 pointB.y * this.zoomFactor + this.drawOffset.y + position.y * this.zoomFactor
		       );
    this.context.closePath();
    this.context.strokeStyle = colors.selectedEdgeColor;
    this.context.lineWidth   = 3.0;
    this.context.stroke(); 

    this.context.restore();

};



IKRS.GirihCanvasHandler.prototype._drawPreviewTileAtHighlightedPolygonEdge = function( tileType,
										       points,
										       position, 
										       angle,
										       originalBounds,
										       colors,
										       imgProperties,
										       imageObject,
										       highlightedEdgeIndex,
										       drawOutlines
										     ) { 
    
    var adjacentTile = this._resolveCurrentAdjacentTilePreset(  tileType,
								points,
								position, 
								angle,
								originalBounds,
								colors,
								imgProperties,
								imageObject,
								highlightedEdgeIndex,
								drawOutlines
							     );
    if( !adjacentTile )
	return;
  

    // Draw adjacent tile
    this.context.globalAlpha = 0.5;  // 50% transparency
    this._drawPolygonFromPoints( adjacentTile.polygon.vertices, 
				 adjacentTile.position, 
				 adjacentTile.angle,
				 adjacentTile.computeBounds(), // originalBounds,
				 { unselectedEdgeColor: "#888888", // null, // "#000000",
				   selectedEdgeColor:   null, // "#e80088",
				   fillColor:           null
				 },
				 adjacentTile.imageProperties,
				 this.imageObject,
				 -1,  // tile._props.highlightedEdgeIndex,
				 true // always draw the preview outlines? // this.drawProperties.drawOutlines
			       );
    this.context.globalAlpha = 1.0;  // reset to opaque
    
}

IKRS.GirihCanvasHandler.prototype._drawCrosshairAt = function( position,
							       isSelected
							     ) {  

    if( isSelected ) this.context.strokeStyle = "#FF0000";
    else             this.context.strokeStyle = "#000000";

    this.context.beginPath();

    var DRAW_CROSS = false; // Looks ugly
    // Draw cross?
    if( DRAW_CROSS ) {
	this.context.moveTo( position.x * this.zoomFactor + this.drawOffset.x,
			     position.y * this.zoomFactor + this.drawOffset.y - 5
			   );
	this.context.lineTo( position.x * this.zoomFactor + this.drawOffset.x,
			     position.y * this.zoomFactor + this.drawOffset.y + 5
			   );

	this.context.moveTo( position.x * this.zoomFactor + this.drawOffset.x - 5,
			     position.y * this.zoomFactor + this.drawOffset.y
			   );
	this.context.lineTo( position.x * this.zoomFactor + this.drawOffset.x + 5,
			     position.y * this.zoomFactor + this.drawOffset.y
			   );
    }
    
    this.context.arc( position.x * this.zoomFactor + this.drawOffset.x,
		      position.y * this.zoomFactor + this.drawOffset.y,
		      5.0,
		      0.0, 
		      Math.PI*2.0,
		      false 
		    );

    this.context.stroke(); 
    this.context.closePath();
}

IKRS.GirihCanvasHandler.prototype._drawBoundingBox = function( position,
							       bounds,
							       angle ) {  


    var points = [ bounds.getLeftUpperPoint(),
		   bounds.getRightUpperPoint(),
		   bounds.getRightLowerPoint(),
		   bounds.getLeftLowerPoint()
		 ];
    
    this.context.strokeStyle = "#c8c8ff";
    this._drawPolygonFromPoints( points, 
				 position, 
				 angle,
				 bounds,
				 { unselectedEdgeColor: "#c8c8ff",
				   selectedEdgeColor:   "#c8c8ff",
				   fillColor:           null
				 },
				 null,   // imgProperties,
				 null,   // imageObject,
				 -1,     // hightlightedEdgeIndex
				 true    // drawOutlines
			       );
      
    this.context.stroke(); 
}


IKRS.GirihCanvasHandler.prototype._drawCoordinateSystem = function() {  

    this.context.strokeStyle = "#c8c8c8";
    this.context.beginPath();

    this.context.moveTo( this.drawOffset.x,
			 0
		       );
    this.context.lineTo( this.drawOffset.x,
			 this.canvasHeight
		       );

    this.context.moveTo( 0,
			 this.drawOffset.y
		       );
    this.context.lineTo( this.canvasWidth,
			 this.drawOffset.y
		       );

    this.context.stroke(); 
    this.context.closePath();
};

IKRS.GirihCanvasHandler.prototype._drawInnerTilePolygons = function( tile ) {

    for( var i = 0; i < tile.innerTilePolygons.length; i++ ) {

	//window.alert( "i=" + i + ", tile.getCenterPolygonIndex()=" + tile.getCenterPolygonIndex() + ", this.getProperties().drawPenroseCenterPolygon=" + this.getProperties().drawPenroseCenterPolygon + ", condition=" + (tile.tileType == IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS && !this.getProperties().drawPenroseCenterPolygon && i == tile.getCenterPolygonIndex()) );

	if( tile.tileType == IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS && !this.getProperties().drawPenroseCenterPolygon && i == tile.getCenterPolygonIndex() )
	    continue;

	//if( typeof excludePolygonIndices == "undefined" || !excludePolygonIndices || excludePolygonIndices.indexOf(i) == -1 )
	this._drawInnerTile( tile, i );

    }

};

IKRS.GirihCanvasHandler.prototype._drawOuterTilePolygons = function( tile ) {

    for( var i = 0; i < tile.outerTilePolygons.length; i++ ) {

	
	var polygon = tile.outerTilePolygons[ i ];
	
	var randomColor = null;
	if( this.drawProperties.outerRandomColorFill ) {
		randomColor = "rgba(" + 
		Math.round( Math.random()*255 ) + "," +
		Math.round( Math.random()*255 ) + "," +
		Math.round( Math.random()*255 ) + "," +
		"0.5)";
	}
	this._drawPolygonFromPoints( polygon.vertices,   // points,
				     tile.position, 
				     tile.angle,
				     IKRS.BoundingBox2.computeFromPoints(polygon.vertices), //originalBounds,
				     { unselectedEdgeColor: null, // "#00a800",
				       selectedEdgeColor:   null, // "#00a800",
				       fillColor:           randomColor //"rgba(255,255,0,0.5)" //"#ffff00"
				     },    // colors,
				     null, // imgProperties,
				     null, // imageObject,
				     -1,   // highlightedEdgeIndex,
				     true  // drawOutlines
				   ); 

    }

}

IKRS.GirihCanvasHandler.prototype._drawInnerTile = function( tile, index ) {

    var polygon = tile.innerTilePolygons[ index ];
    
    var randomColor = null;
    if( this.drawProperties.innerRandomColorFill ) {
	randomColor = "rgba(" + 
	    Math.round( Math.random()*255 ) + "," +
	    Math.round( Math.random()*255 ) + "," +
	    Math.round( Math.random()*255 ) + "," +
	    "0.5)";
    }
    this._drawPolygonFromPoints( polygon.vertices,   // points,
				 tile.position, 
				 tile.angle,
				 IKRS.BoundingBox2.computeFromPoints(polygon.vertices), //originalBounds,
				 { unselectedEdgeColor: "#00a800",
				   selectedEdgeColor:   "#00a800",
				   fillColor:           randomColor // null
				 },    // colors,
				 null, // imgProperties,
				 null, // imageObject,
				 -1,   // highlightedEdgeIndex,
				 true  // drawOutlines
			       ); 
    

}

IKRS.GirihCanvasHandler.prototype._drawTiles = function() { 
    
    for( var i = 0; i < this.girih.tiles.length; i++ ) {	
	this._drawTile( this.girih.tiles[i] );
    }

    // Finally draw the selected tile's hovering edge
    var hoveredTileIndex = this._locateHoveredTile();;
    if( hoveredTileIndex != -1 ) {
	var tile = this.girih.tiles[ hoveredTileIndex ]; 
	var tileBounds       = tile.computeBounds()
	this._drawHighlightedPolygonEdge( tile.polygon.vertices, 
					  tile.position, 
					  tile.angle,
					  tileBounds, 
					  { unselectedEdgeColor: "#000000",
					    selectedEdgeColor:   "#ffaf30", 
					    fillColor:           null
					  },
					  tile.imageProperties,
					  this.imageObject,
					  tile._props.highlightedEdgeIndex,
					  this.drawProperties.drawOutlines
					);
	this._drawPreviewTileAtHighlightedPolygonEdge( tile.tileType,
						       tile.polygon.vertices, 
						       tile.position, 
						       tile.angle,
						       tileBounds, 
						       { unselectedEdgeColor: null, // "#000000",
							 selectedEdgeColor:   null, // "#d80000",
							 fillColor:           null
						       },
						       tile.imageProperties,
						       this.imageObject,
						       tile._props.highlightedEdgeIndex,
						       this.drawProperties.drawOutlines
						     );
    }
}

/**
 * The drawProps object may contain following members:
 *  - drawBoxes         (boolean)
 *  - drawOutlines      (boolean)
 *  - drawTexture       (boolean)
 *  - drawInnerPolygons (boolean)
 **/  
IKRS.GirihCanvasHandler.prototype.getDrawProperties = function() {
    return this.drawProperties;
}

/**
 * The properties object may contain following members:
 *  - allowPenroseTile
*   -
 **/  
IKRS.GirihCanvasHandler.prototype.getProperties = function() {
    return this.properties;
}

IKRS.GirihCanvasHandler.prototype.redraw = function() {  

    this.context.fillStyle = this.getDrawProperties().backgroundColor; // "#F0F0F0";
    this.context.fillRect( 0, 0, this.canvasWidth, this.canvasHeight );
    
    if( this.getDrawProperties().drawCoordinateSystem )
	this._drawCoordinateSystem();
    
    this._drawTiles();
 
};

// ### BEGIN TESTING ##############################################
IKRS.GirihCanvasHandler.prototype._drawCircleTest = function() {

    
    var circleA = new IKRS.Circle( IKRS.Point2.ZERO_POINT,
				   50
				 );
    var circleB = new IKRS.Circle( new IKRS.Point2( 50, 50 ),
				   75
				 );
    
    this._drawCircleIntersections( circleA, circleB );
}

IKRS.GirihCanvasHandler.prototype._drawCircleIntersections = function( circleA, circleB ) {

    var intersection = circleA.computeIntersectionPoints( circleB );
    if( intersection ) {

	this._drawCrosshairAt( intersection.pointA, false );
	this._drawCrosshairAt( intersection.pointB, false );

    }
    
    this._drawCircle( circleA );
    this._drawCircle( circleB );

}

IKRS.GirihCanvasHandler.prototype._drawCircle = function( circle ) {

    //window.alert( "circle=" + circle.toString() );
    
    this.context.strokeStyle = "#FF0000";
    //this.context.line
    this.context.beginPath();
    this.context.arc( circle.center.x * this.zoomFactor + this.drawOffset.x,
		      circle.center.y * this.zoomFactor + this.drawOffset.y,
		      circle.radius * this.zoomFactor,
		      0,
		      Math.PI*2
		    );
    //this.context.endPath();
    this.context.stroke();

}

IKRS.GirihCanvasHandler.prototype._drawLineIntersectionTest = function() {

    var lineA = new IKRS.Line2( new IKRS.Point2(10, 10),
				new IKRS.Point2(120, 120)
			      );
    var lineB = new IKRS.Line2( new IKRS.Point2(100, 30),
				new IKRS.Point2(10, 150)
			      );


    this._drawLine( lineA );
    this._drawLine( lineB );
    
    //var intersectionPoint = lineA.computeLineIntersection( lineB );
    var intersectionPoint = lineA.computeEdgeIntersection( lineB );
    if( intersectionPoint )
	this._drawCrosshairAt( intersectionPoint, false );
    else
	DEBUG( "No intersection found." );
}

IKRS.GirihCanvasHandler.prototype._drawLine = function( line ) {



    this.context.beginPath();
    // Draw line A
    this.context.moveTo( line.pointA.x * this.zoomFactor + this.drawOffset.x, 
			 line.pointA.y * this.zoomFactor + this.drawOffset.y
		       ); 
    this.context.lineTo( line.pointB.x * this.zoomFactor + this.drawOffset.x, 
			 line.pointB.y * this.zoomFactor + this.drawOffset.y
		       ); 

    this.context.strokeStyle = "#0000FF";
    this.context.stroke();
};

// ### END TESTING ################################################

IKRS.GirihCanvasHandler.prototype.increaseZoomFactor = function( redraw ) {
    this.zoomFactor *= 1.2;
    if( redraw )
	this.redraw();
};

IKRS.GirihCanvasHandler.prototype.decreaseZoomFactor = function( redraw ) {
    this.zoomFactor /= 1.2;
    if( redraw )
	this.redraw();
};

IKRS.GirihCanvasHandler.prototype.getSVG = function( options,
						     polygonStyle
						     ) {

    var buffer  = [];
    if( typeof options == "undefined" )
	options = {};

    if( typeof options.indent == "undefined" )
	options.indent = "";

    options.width  = this.canvasWidth;
    options.height = this.canvasHeight;
    polygonStyle = "fill-opacity:0.0; fill:white; stroke:green; stroke-width:1;";
    
    this.girih.toSVG( options,
		      polygonStyle,
		      buffer
		    );
    return buffer.join( "" );
};

IKRS.GirihCanvasHandler.prototype._exportSVG = function( options,
							 polygonStyle
							 ) {
    var svg = this.getSVG();

    saveTextFile( svg, "girih.svg", "image/svg+xml" );

};

IKRS.GirihCanvasHandler.prototype.constructor = IKRS.GirihCanvasHandler;

