/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/


var IKRS = IKRS || { CREATOR: "Ikaros Kappler",
		     DATE: "2013-11-27"
		   };

/**
 * @author Ikaros Kappler
 * @date 2013-08-14
 * @version 1.0.0
 **/

IKRS.Object = function() {

    // NOOP

};

IKRS.Object.inherit = function() {

}

IKRS.Object.prototype = {

    constructor: IKRS.Object,

    toString: function() { 
	return "[IKRS.Object]";
    }
};
/**
 * A pair is just a tuple with two anonymous elements a and b.
 *
 * @author Ikaros Kappler
 * @date 2013-12-17
 * @version 1.0.0
 **/

IKRS.Pair = function( a, b ) {

    this.a = a;
    this.b = b;

}


IKRS.Pair.prototype.clone = function() {
    return new IKRS.Pair( this.a, this.b );
}

/**
 * The Girih class defines the rules and contrains how girih tiles
 * are allowed the be arrange to each other.
 *
 * For this a small wrapper class containing the relative tile
 * position and relative tile rotation is required.
 *
 * @author Ikaros Kappler
 * @date 2013-12-01
 * @modified 2013-12-11 Ikaros Kappler (Added the Penrose-Rhombus).
 * @version 1.0.0
 **/


IKRS.TileAlign = function( tileType,
			   edgeLength,
			   position,
			   angle 
			 ) {

    IKRS.Object.call( this );

    this.tileType   = tileType;
    this.edgeLength = edgeLength;
    this.position   = position;
    this.angle      = angle;

}

IKRS.TileAlign.prototype.createTile = function() {

    switch( this.tileType ) {
    case IKRS.Girih.TILE_TYPE_DECAGON:
	return new IKRS.Tile.Decagon( this.edgeLength, this.position.clone(), this.angle );
    case IKRS.Girih.TILE_TYPE_PENTAGON:
	return new IKRS.Tile.Pentagon( this.edgeLength, this.position.clone(), this.angle );
    case IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON:
	return new IKRS.Tile.IrregularHexagon( this.edgeLength, this.position.clone(), this.angle );
    case IKRS.Girih.TILE_TYPE_RHOMBUS:
	return new IKRS.Tile.Rhombus( this.edgeLength, this.position.clone(), this.angle );	
    case IKRS.Girih.TILE_TYPE_BOW_TIE:
	return new IKRS.Tile.BowTie( this.edgeLength, this.position.clone(), this.angle );	

    case IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS:
	return new IKRS.Tile.PenroseRhombus( this.edgeLength, this.position.clone(), this.angle );	

    default:
	throw "Cannot create tiles from unknown tile types (" + this.tileType + ").";
    }
}

IKRS.TileAlign.prototype.clone = function() {

    return new IKRS.TileAlign( this.tileType,
			       this.edgeLength,
			       this.position.clone(),
			       this.angle
			     );

}

IKRS.TileAlign.prototype.toString = function() {
    return "[TileAlign]=tileType=" + this.tileType + ", edgeLength=" + this.edgeLength + ", position=" + this.position.toString() + ", angle=" + this.angle + "]";
}

IKRS.TileAlign.prototype.constructor = IKRS.TileAlign;
/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/


IKRS.Point2 = function( x, y ) {
    
    IKRS.Object.call( this );
    
    this.x = x;
    this.y = y;

};

/**
 * Many objects that use points and have a 'translate' function instead
 * of 'add'.
 **/
/*
IKRS.Point2.prototype.translate = function( amount ) {
    return this.add( amount );
};
*/

IKRS.Point2.prototype.add = function( amount ) {
    this.x += amount.x;
    this.y += amount.y;
    return this;  // For operator concatenation
};

IKRS.Point2.prototype.addXY = function( x, y ) {
    this.x += x;
    this.y += y;
    return this;
};

IKRS.Point2.prototype.sub = function( amount ) {
    this.x -= amount.x;
    this.y -= amount.y;
    return this;  // For operator concatenation
};

IKRS.Point2.prototype.set = function( position ) {
    this.x = position.x;
    this.y = position.y;
    return this;  // For operator concatenation
};

IKRS.Point2.prototype.setXY = function( x, y ) {
    this.x = x;
    this.y = y;
};

IKRS.Point2.prototype.invert = function() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
};

IKRS.Point2.prototype.getDifference = function( p ) {
    return new IKRS.Point2( p.x - this.x, p.y - this.y );
}

// Is this correct?
IKRS.Point2.prototype.dotProduct = function( point ) {
    return (this.x * point.x + this.y * point.y);
};


IKRS.Point2.prototype.inRange = function( point,
					  tolerance
					) {
    return this.distanceTo(point) <= tolerance;
};

IKRS.Point2.prototype.equals = function( point, epsilon ) {
    if( epsilon === undefined )
	epsilon = EPSILON;
    return this.distanceTo(point) <= epsilon;
};

IKRS.Point2.prototype.length = function() {
    return Math.sqrt( Math.pow(this.x,2) + Math.pow(this.y,2) );
};

IKRS.Point2.prototype.distanceTo = function( point ) {
    return Math.sqrt( Math.pow(this.x-point.x,2) + Math.pow(this.y-point.y,2) );
};

IKRS.Point2.prototype.multiplyScalar = function( s ) {
    this.x *= s;
    this.y *= s;
    return this;  // For operator concatenation
}

/**
 * The scaling destination must be any point and the scaling amount
 * any floating number, usually in [0 ... 1].
 *
 * Imagine a line between this and the destination point.
 * Then the returned point is located at sclaingAmount*100 per cent
 * along this line.
 **/
IKRS.Point2.prototype.scaleTowards = function( scalingDestination,
					       scalingAmount
					     ) {
    return this.computeDifference( scalingDestination ).multiplyScalar( scalingAmount ).add( this );
}

IKRS.Point2.prototype.computeDifference = function( point ) {
    return new IKRS.Point2( point.x - this.x,
			    point.y - this.y
			  );
}

/*
IKRS.Point2.prototype.setX = function( x ) {
    return this.x = x;
}

IKRS.Point2.prototype.setX = function( y ) {
    return this.y = y;
}
*/

/*
IKRS.Point2.prototype.distanceTo = function( point ) {

    return Math.sqrt( Math.pow(point.x-this.x,2) + Math.pow(point.y-this.y,2) );

}
*/

IKRS.Point2.prototype.clone = function() {
    return new IKRS.Point2( this.x, this.y );
}

IKRS.Point2.prototype.rotate = function( origin,
					 theta
				       ) {
    
    // Thanks to
    // http://stackoverflow.com/questions/786472/rotate-a-point-by-an-angle
    //  p'x = cos(theta) * (px-ox) - sin(theta) * (py-oy) + ox
    //  p'y = sin(theta) * (px-ox) + cos(theta) * (py-oy) + oy    
    var cosT = Math.cos(theta);
    var sinT = Math.sin(theta);
    var dX   = this.x - origin.x;
    var dY   = this.y - origin.y;

    this.x = cosT * dX - sinT * dY + origin.x;
    this.y = sinT * dX + cosT * dY + origin.y;
    
    return this;  // For operator concatenation
}

IKRS.Point2.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ")";
}

IKRS.Point2.prototype.constructor = IKRS.Point2;

IKRS.Point2.ZERO_POINT            = new IKRS.Point2( 0, 0 );
/**
 * There are times you need to compute the intersection of two lines.
 * I didn't want to do that with point lists, so here is the line class.
 *
 * Thanks to
 *  http://stackoverflow.com/questions/4543506/algorithm-for-intersection-of-2-lines
 *  and
 *  http://community.topcoder.com/tc?module=Static&d1=tutorials&d2=geometry2#line_line_intersection
 *
 *
 * @author Ikaros Kappler
 * @date 2013-12-13
 * @version 1.0.0
 **/

IKRS.Line2 = function( pointA,
		       pointB
		       
		       //pointComparator
		     ) {

    IKRS.Object.call( this );

    //if( !pointComparator || typeof pointComparator == "undefined" )
//	pointComparator = new IKRS.PythagoreanPointComparator(EPSILON);

    this.pointA = pointA;
    this.pointB = pointB;

    //this.pointComparator = pointComparator;
}

IKRS.Line2.prototype.length = function() {
    return this.pointA.distanceTo( this.pointB );
}

IKRS.Line2.prototype.determinant = function() {
    //return this.pointA.x * this.pointB.y - this.pointA.y * this.pointB.x;
    return IKRS.Line2.determinant( this.pointA, this.pointB );
};


IKRS.Line2.prototype.dotProduct = function( line ) {
    // Translate both lines to (0,0) and handle them as vectors
    var lineA = this._cloneDeep().translate( this.pointA.clone().invert() );
    var lineB = line._cloneDeep().translate( line.pointA.clone().invert() );
    
    // Now return the dot product of both non-zero points
    return this.pointB.dotProduct( line.pointB );
};

IKRS.Line2.prototype.isColinearWith = function( line, epsilon ) {
    return this.isColinearWithPoint(line.pointA,epsilon) && this.isColinearWithPoint(line.pointB,epsilon);
};

IKRS.Line2.prototype.isColinearWithPoint = function( point, epsilon ) {
    // See
    // http://stackoverflow.com/questions/4557840/find-all-collinear-points-in-a-given-set
    //bool collinear(int x1, int y1, int x2, int y2, int x3, int y3) {
	//return (y1 - y2) * (x1 - x3) == (y1 - y3) * (x1 - x2);
    //}
    
    var p0 = ((this.pointA.y - this.pointB.y) * (this.pointA.x - point.x));
    var p1 = ((this.pointA.y - point.y) * (this.pointA.x - this.pointB.x));

    //return p0 == p1;
    return (Math.abs( p0-p1) <= epsilon);
};

/*
IKRS.Line2.prototype.isColinearWith = function( line, epsilon ) {
    
    if( epsilon == undefined )
	epsilon = 0.00001;  // !!! ???

    // See
    // http://stackoverflow.com/questions/10096930/how-do-i-know-if-two-line-segments-are-near-collinear
    //
    //  public bool CloseEnough(Vector a, Vector b, decimal threshold = 0.000027m)
    //  {
    //  int dotProduct = a.X*b.X + a.Y*b.Y + a.Z*b.Z;
    //  decimal magA = sqrt(a.X*a.X + a.Y*a.Y + a.Z*a.Z); //sub your own sqrt
    //  decimal magB = sqrt(b.X*b.X + b.Y*b.Y + b.Z*b.Z); //sub your own sqrt
    //  
    //  decimal angle = acos(dotProduct/(magA*magB)); //sub your own arc-cosine
    //  
    //if(angle <= threshold
    //  }
    

    var dotProduct = this.dotProduct( line );
    var magA       = this.length();
    var magB       = line.length();
    var angle      = Math.acos( dotProduct / (magA*magB) );
    
    return (angle < (1 - epsilon));
};
*/


IKRS.Line2.prototype.translate = function( amount ) {
    this.pointA.add( amount );
    this.pointB.add( amount );
};

IKRS.Line2.prototype.equalEdgePoints = function( line ) {
    return ( (this.pointA == line.pointA && this.pointB == line.pointB) || 
	     (this.pointA == line.pointB && this.pointB == line.pointA) );
    
};

/**
 * This function computes the intersection of two edges (not lines).
 *
 * Edges have a limited length, so if an intersection exists, it is
 * located within the bounding box of both edges.
 *
 * Note that the line(!)-intersection may be located outside the
 * bounding boxes.
 *
 * If the edges intersected, this function returns the intersection point,
 * otherwise null.
 **/
IKRS.Line2.prototype.computeEdgeIntersection = function( edge ) {

    var det = IKRS.Line2.determinant( this.pointB.clone().sub( this.pointA ),
				      edge.pointA.clone().sub( edge.pointB )
				    );
    var t   = IKRS.Line2.determinant( edge.pointA.clone().sub( this.pointA ),
				      edge.pointA.clone().sub( edge.pointB )
				    ) / det;
    var u   = IKRS.Line2.determinant( this.pointB.clone().sub( this.pointA ),
				      edge.pointA.clone().sub( this.pointA )
				    ) / det;
    
    if( t < 0 || u < 0 || t > 1 || u > 1 ) {
	// No intersection inside the edge lengths
	return null;
    } else {
	//return a * (1 - t) + t * b;
	return this.pointA.clone().multiplyScalar( 1-t ).add( this.pointB.clone().multiplyScalar( t ) );
    }

// http://content.gpwiki.org/index.php/Polygon_Collision
/*
//one edge is a-b, the other is c-d
 Vector2D edgeIntersection(Vector2D a, Vector2D b, Vector2D c, Vector2D d){
     double det = determinant(b - a, c - d);
     double t   = determinant(c - a, c - d) / det;
     double u   = determinant(b - a, c - a) / det;
     if ((t < 0) || (u < 0) || (t > 1) || (u > 1)) {
         return NO_INTERSECTION;
     } else {
         return a * (1 - t) + t * b;
     }
 }
*/
}

IKRS.Line2.prototype.computeLineIntersection = function( line ) {
    
    /*
    var A = y2-y1
    B = x1-x2
    C = A*x1+B*y1
    Regardless of how the lines are specified, you should be able to generate two different points along the line, and then generate A, B and C. Now, lets say that you have lines, given by the equations:
    A1x + B1y = C1
    A2x + B2y = C2
    To find the point at which the two lines intersect, we simply need to solve the two equations for the two unknowns, x and y.

    double det = A1*B2 - A2*B1
    if(det == 0){
        //Lines are parallel
    }else{
        double x = (B2*C1 - B1*C2)/det
        double y = (A1*C2 - A2*C1)/det
    }
    */


    /*
    var a1 = this.pointB.y - this.pointA.y;
    var b1 = this.pointB.x - this.pointA.x;
    var c1 = a1 * this.pointA.x + b1 * this.pointA.y;

    var a2 = line.pointB.y - line.pointA.y;
    var b2 = line.pointB.x - line.pointA.x;
    var c2 = a2 * line.pointA.x + b2 * line.pointA.y;
    */
    var a1 = this.pointB.y - this.pointA.y;
    var b1 = this.pointA.x - this.pointB.x;
    var c1 = a1 * this.pointA.x + b1 * this.pointA.y;

    var a2 = line.pointB.y - line.pointA.y;
    var b2 = line.pointA.x - line.pointB.x;
    var c2 = a2 * line.pointA.x + b2 * line.pointA.y;

    
    var det = a1*b2 - a2*b1;
    // Parellel lines?
    if( det == 0 )
	return null;
    
    return new IKRS.Point2( (b2*c1 - b1*c2)/det,
			    (a1*c2 - a2*c1)/det
			  );
    

    /*
    float delta = A1*B2 - A2*B1;
    if(delta == 0) 
	throw new ArgumentException("Lines are parallel");

    float x = (B2*C1 - B1*C2)/delta;
    float y = (A1*C2 - A2*C1)/delta;
    */
};

IKRS.Line2.prototype.clone = function() {
    return new IKRS.Line2( this.pointA, this.pointB );
};

IKRS.Line2.prototype._cloneDeep = function() {
    return new IKRS.Line2( this.pointA.clone(), this.pointB.clone() );
};

IKRS.Line2.prototype.toString = function() {

    return "{ " +this.pointA.toString() + ", " + this.pointB.toString() + "}";

};

IKRS.Line2.prototype.constructor = IKRS.Line2;

/*
 public static Vector3 Intersect(Vector3 line1V1, Vector3 line1V2, Vector3 line2V1, Vector3 line2V2)
    {
        //Line1
        float A1 = line1V2.Y - line1V1.Y;
        float B1 = line1V2.X - line1V1.X;
        float C1 = A1*line1V1.X + B1*line1V1.Y;

        //Line2
        float A2 = line2V2.Y - line2V1.Y;
        float B2 = line2V2.X - line2V1.X;
        float C2 = A2 * line2V1.X + B2 * line2V1.Y;

        float det = A1*B2 - A2*B1;
        if (det == 0)
        {
            return null;//parallel lines
        }
        else
        {
            float x = (B2*C1 - B1*C2)/det;
            float y = (A1 * C2 - A2 * C1) / det;
            return new Vector3(x,y,0);
        }
    }*/


IKRS.Line2.determinant = function( pointA, pointB ) {
    return pointA.x * pointB.y - pointA.y * pointB.x;
}

/**
 * As there are some polygon intersecion functions required and I don't
 * want to handle polygons as simple point arrays, so here is a
 * polygon class.
 *
 * Note: as polygons are generally 2-dimensional, this class is not named
 *       Polygon2.
 *
 * @author Ikaros Kappler
 * @date 2013-12-13
 * @version 1.0.0
 **/

IKRS.Polygon = function( vertices ) {

    IKRS.Object.call( this );
    
    if( vertices == undefined || !vertices || typeof vertices == "undefined" )
	vertices = [];

    this.vertices = vertices;
};


/**
 * This is a special get* function that modulates the index and also
 * allows negative values.
 * 
 * For k >= 0:
 *  - getVertexAt( vertices.length )     == getVertexAt( 0 )
 *  - getVertexAt( vertices.length + k ) == getVertexAt( k )
 *  - getVertexAt( -k )                  == getVertexAt( vertices.length -k )
 *
 * So this function always returns a point for any index.
 **/
IKRS.Polygon.prototype.getVertexAt = function( index ) {
    if( index < 0 ) 
	return this.vertices[ this.vertices.length - (Math.abs(index)%this.vertices.length) ];
    else
	return this.vertices[ index % this.vertices.length ];
};

/*
IKRS.Polygon.prototype.hasVertex = function( vertex ) {
    for( var i = 0; i < this.vertices.length; i++ ) {
	if( this.vertices[i] == vertex )
	    return true;
    }
    return false;
}
*/

IKRS.Polygon.prototype.getEdgeAt = function( index ) {
    return new IKRS.Line2( this.getVertexAt(index), this.getVertexAt(index+1) );
};

IKRS.Polygon.prototype.hasEdge = function( edge ) {
    for( var i = 0; i < this.vertices.length; i++ ) {

	var polyEdge = new IKRS.Line2( this.vertices[i], this.getVertexAt(i+1) );
	if( polyEdge.equalEdgePoints(edge) )
	    return true;
    }
    return false;
};

/**
 * This function checks if the passed point is within this tile's polygon.
 *
 * @param point The point to be checked.
 * @retrn true|false
 **/
IKRS.Polygon.prototype.containsPoint = function( point ) {

    // window.alert( this._getTranslatedPoint );
    
    // Thanks to
    // http://stackoverflow.com/questions/2212604/javascript-check-mouse-clicked-inside-the-circle-or-polygon/2212851#2212851
    var i, j = 0;
    var c = false;
    for (i = 0, j = this.vertices.length-1; i < this.vertices.length; j = i++) {
	vertI = this.getVertexAt( i ); 
	vertJ = this.getVertexAt( j ); 
    	if ( ((vertI.y>point.y) != (vertJ.y>point.y)) &&
    	     (point.x < (vertJ.x-vertI.x) * (point.y-vertI.y) / (vertJ.y-vertI.y) + vertI.x) )
    	    c = !c;
    }
    return c;

};

IKRS.Polygon.prototype.locateContainedPolygonPoints = function( poly ) {

    var resultIndices = [];
    for( var i = 0; i < poly.vertices.length; i++ ) {

	if( this.containsPoint( poly.vertices[i] ) )
	    resultIndices.push( i );

    }
    
    return resultIndices;

};

/**
 * This function computes the intersection of this polygon and the
 * parameter polygon.
 **/
IKRS.Polygon.prototype.computeIntersection = function( poly ) {

    // First compute the intersection triangulation
    var triangulation = polyA._computeIntersectionTriangulation( poly );

    // The intersection is empty if the intersectionList is empty (no intersecting edges)
    if( triangulation.length == 0 )
	return [];
    

    
    
    
    return outerEdgePair;
};


/**
 * This function computes a triangle set from the intersecting-edge graph of
 * this polygon and the passed parameter polygon.
 *
 * An intersecting-edge graph is the combination of two graphs (polygons are
 * graphs too) but with additional vertices/edges where the two original
 * graphs intersect.
 *
 * The returned value is an array containing triangles.
 **/
IKRS.Polygon.prototype._computeIntersectionTriangulation = function( poly ) {

    // Then compute the extended polygons
    //  - extendedA
    //  - extendedB
    //  - intersectionGraph
    //  - intersectionList
    //  - allPoints
    var edgeIntersection = this._computeIntersectingEdgePolygons( poly );

        
    // Triangulate each extended polygon by itself
    var extendedGraphA = new IKRS.Graph2( edgeIntersection.extendedA.vertices );
    var extendedGraphB = new IKRS.Graph2( edgeIntersection.extendedB.vertices );

    var trianglesA = extendedGraphA.triangulate();
    var trianglesB = extendedGraphB.triangulate();

    
    // Now there might be _real_ polygon edges, that do not occur in the respective
    // triangulation. But these edges MUST be inserted. So detect all edges from the
    // extended polygon, that really intersect the triangulation. Add these intersection
    // points (from the triangulation) to the extended polygon.
    var superExtendedGraphA = _computeExtendedGraphFromTriangleIntersection( this, // edgeIntersection.extendedA,
									     trianglesA );
    var superExtendedGraphB = _computeExtendedGraphFromTriangleIntersection( poly, // edgeIntersection.extendedB,
									     trianglesB );
    

    // The super graph contains all relevant vertices (maybe more in the current implementation)
    // Triangulate it. For each triangle from the triangulation is true:
    //  - it is fully contained in polygonA
    //    OR
    //  - it is fully contained in polygonB
    //    OR
    //  - it has no intersection with polygonA nor with polygonB
    //    (completely outside, only if at least one polygon is not convex)
    // This leads to the fact: 
    //    Each triangle's center point tells if the whole triangle is contained
    //    in polygon{A,B} or nor ^^    
    
    /*
    var superExtendedVertices = new IKRS.ArraySet();         
    for( var i in superExtendedGraphA.vertices ) 
	superExtendedVertices.addUnique( superExtendedGraphA.vertices[i] );
    for( var i in superExtendedGraphB.vertices ) 
	superExtendedVertices.addUnique( superExtendedGraphB.vertices[i] );   
    */
    
    var superExtendedVertices = this._computeInnerIntersectionPointsFromTriangulation( trianglesA, trianglesB );
    //window.alert( "superExtendeVertices.elements.length=" + superExtendedVertices.elements.length + "\n, superExtendeVertices.elements=" + superExtendedVertices.elements );


    // Triangulate super point set
    var superExtendedGraph = new IKRS.Graph2( superExtendedVertices.elements ); // superExtendedVertices.elements );   
    var superTriangulation = superExtendedGraph.triangulate();  // An array of triangles

    //window.alert( "superTriangulation.length=" + superTriangulation.length );

    
    return new IKRS.TriangleSet( superTriangulation );
};

IKRS.Polygon.prototype._computeInnerIntersectionPointsFromTriangulation = function( trianglesA, 
										    trianglesB 
										  ) {
    
    var result = new IKRS.ArraySet();

    //window.alert( trianglesA.length );
    for( var a in trianglesA ) {

	var triA = trianglesA[a];

	// Also add triangle vertices
	result.addUnique( triA.getPointA() );
	result.addUnique( triA.getPointB() );
	result.addUnique( triA.getPointC() );
	
	for( var b in trianglesB ) {

	    var triB = trianglesB[b];	    
	    // Each Triangle has three edges
	    triA.computeTriangleIntersectionPoints( triB, result );

	}

    }

    // Also add vertices from b
    for( var b in trianglesB ) {
	var triB = trianglesB[b];
	result.addUnique( triB.getPointA() );
	result.addUnique( triB.getPointB() );
	result.addUnique( triB.getPointC() );
    }

    return result;
};

/**
 * This function computes the intersecting edges of both polygons.
 *
 * The returned object has four components:
 *  - extendedA          former this
 *  - extendedB          former param
 *  - intersectionGraph  A three dimensional n*m*k[i] matrix indicating which
 *                       edges intersect;
 *                         n is the edge count of this.
 *                         m is the edge count of poly.
 *                         k[i] are the entry length of the matrix; each entry is
 *                              a list of pairs, containg edge index pairs.
 *  - intersectionList   The matrix in form of a list of tuples (indices in A and B).
 *  - allPoints          An ArrayList containing all points.
 **/
// TODO: THE EXTENDED POLYON VERTEX ORDER IS NOT CORRECT!
//       FORTUNATELY THE ORDER IS NOT CONSIDERED IN THE MAIN TRIANGULATION ALGORITHM,
//       BUT THIS IS A BIT UGLY THOUGH.
//       (Check the LineOrderedPointSet for bugs)
IKRS.Polygon.prototype._computeIntersectingEdgePolygons = function( poly ) {
    
    //var extendedA         = new IKRS.Polygon();
    //var extendedB         = new IKRS.Polygon();
    var extendedSetA        = new IKRS.ArraySet();
    var extendedSetB        = new IKRS.ArraySet();
    var graph               = [];
    var list                = [];
    var allPoints           = new IKRS.ArraySet(); // [];

    var segmentPointSetsA   = []; // new IKRS.LineOrderedPointSet2(...) 
    var segmentPointSetsB   = [];

    
    for( var a = 0; a < this.vertices.length; a++ ) {

	var edgeA              = new IKRS.Line2( this.vertices[a], this.getVertexAt(a+1) );
	graph[a] = [];	
	//allPoints.push( this.vertices[a] );
	allPoints.add( this.vertices[a] );
	//extendedSetA.addUnique( this.vertices[a] );
	segmentPointSetsA[ a ] = new IKRS.LineOrderedPointSet2( edgeA ); 
	segmentPointSetsA[ a ].add( this.vertices[a] );

	for( var b = 0; b < poly.vertices.length; b++ ) {

	    if( a == 0 )
		allPoints.add( poly.vertices[b] );
 
	    // Compute intersection
	    var edgeB             = new IKRS.Line2( poly.vertices[b], poly.getVertexAt(b+1) );
	    var intersectionPoint = edgeA.computeEdgeIntersection( edgeB );

	    // Build the extended polygons besides
	    //extendedSetA.addUnique( this.vertices[a] );
	    if( a == 0 ) {
		segmentPointSetsB[ b ] = new IKRS.LineOrderedPointSet2( edgeB ); 
		segmentPointSetsB[ b ].add( poly.vertices[b] );
		//extendedSetB.addUnique( poly.vertices[b] );
	    }
	    
	    // Intersection exists?
	    if( intersectionPoint ) {
		graph[a][b] = new IKRS.Pair( extendedSetA.elements.length, extendedSetB.elements.length ); // next vertex indices
		list.push( graph[a][b] ); //.clone() );
	
		//extendedSetA.addUnique( intersectionPoint );
		//extendedSetB.addUnique( intersectionPoint );
		segmentPointSetsA[ a ].add( intersectionPoint );
		segmentPointSetsB[ b ].add( intersectionPoint );
		
		allPoints.add( intersectionPoint );

	    } else {
		graph[a][b] = false;
	    }
	    

	}

    }

    // Finally join together the segment buffers
    var extendedPolygonA = new IKRS.Polygon();
    for( var i = 0; i < this.vertices.length; i++ ) {
	for( var j = 0; j < segmentPointSetsA[i].elements.length; j++ )
	    extendedPolygonA.vertices.push( segmentPointSetsA[i].elements[j] );
    }
    var extendedPolygonB = new IKRS.Polygon();
    for( var i = 0; i < poly.vertices.length; i++ ) { 
	//extendedPolygonB.vertices.push( poly.vertices[i] );
	for( var j = 0; j < segmentPointSetsB[i].elements.length; j++ )
	    extendedPolygonB.vertices.push( segmentPointSetsB[i].elements[j] );
    }

    return { extendedA: extendedPolygonA, //new IKRS.Polygon( extendedSetA.elements ),
	     extendedB: extendedPolygonB, //new IKRS.Polygon( extendedSetB.elements ),
	     intersectionGraph: graph,
	     intersectionList: list,
	     allPoints: allPoints
	   };

};

/**
 * This function scales all polygon vertices by the given scalar number.
 **/
IKRS.Polygon.prototype.multiplyScalar = function( s ) {
    for( var i = 0; i < this.vertices.length; i++ ) {
	this.vertices[i].multiplyScalar( s );
    }
    return this; // Allow operator concatenation
};

/**
 * This function translates all polygon vertices by the given (amount.x, amount.y).
 **/
IKRS.Polygon.prototype.translate = function( amount ) {
    //for( var i = 0; i < this.vertices.length; i++ ) {
    for( var i in this.vertices ) {
	//if( !this.vertices[i].translate )
	//    window.alert( "vertice " + i + " has NOT translate entity: " + this.vertices[i] + ", value=" + this.vertices[i] + ", type=" + (typeof this.vertices[i])  );
	this.vertices[i].add( amount );
    }
    return this; // Allow operator concatenation
};

/**
 * This function translates all polygon vertices by the given amount (x,y).
 **/
IKRS.Polygon.prototype.translateXY = function( x, y ) {
    for( var i = 0; i < this.vertices.length; i++ ) {
	this.vertices[i].addXY( x, y );
    }
    return this; // Allow operator concatenation
};

// @return double
IKRS.Polygon._crossProduct = function( pointA, pointB, pointC ) {
    return (pointB.x - pointA.x)*(pointC.y - pointA.y) - (pointB.y - pointA.y)*(pointC.x - pointA.x);
};


IKRS.Polygon.prototype.computePolygonIntersection = function( clipPolygon ) {

    var outputList = this.vertices;
    for( var e = 0; e < clipPolygon.vertices.lengh; e++ ) {
	
	var edge = new IKRS2.Line2( this.getVertexAt(e), this.getVertexAt(e+1) );
	for( var s = 0; s < this.vertices.length; s++ ) {

	    var point = this.getVertexAt(s);
	    // Make a dummy point in ... ???
	    var crossProduct = IKRS.Polygon2._crossProduct( edge.pointA, edge.pointB, point );
	    if( crossProduct < 0 ) {
		// Inside the edge		
		// ...
	    } else {
		// Outside the edge
		// ...
	    }
	}

    }
    
    
    return result;

    // http://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm
    /*
    List outputList = subjectPolygon;
  for (Edge clipEdge in clipPolygon) do
     List inputList = outputList;
     outputList.clear();
     Point S = inputList.last;
     for (Point E in inputList) do
        if (E inside clipEdge) then
           if (S not inside clipEdge) then
              outputList.add(ComputeIntersection(S,E,clipEdge));
           end if
           outputList.add(E);
        else if (S inside clipEdge) then
           outputList.add(ComputeIntersection(S,E,clipEdge));
        end if
        S = E;
     done
  done
  */

};

IKRS.Polygon.prototype.computeBoundingBox = function() {
    return IKRS.BoundingBox2.computeFromPoints( this.vertices );
};

IKRS.Polygon.prototype.addVertex = function( vertex ) {
    this.vertices.push( vertex );
};

IKRS.Polygon.prototype.constructor = IKRS.Polygon;

/**
 * Some mathematical/geometrical functions use circle algorighms, so I decided
 * to implement a general circle class.
 *
 * @author Ikaros Kappler
 * @date 2013-12-10
 * @version 1.0.0
 **/


IKRS.Circle = function( center,  // (x,y)
			radius   // float
		      ) {
    
    IKRS.Object.call( this );
    
    this.center = center;
    this.radius = radius;
}

IKRS.Circle.prototype.computeIntersectionPoints = function( circle ) {

    return IKRS.Circle.computeIntersectionPoints( this, circle );

}

IKRS.Circle.prototype.containsPoint = function( point ) {
    return this.center.distanceTo( point ) <= this.radius;
}

IKRS.Circle.computeIntersectionPoints = function( A, B ) {

    // Circles intersect at all?
    var distance = A.center.distanceTo( B.center );
    if( distance > A.radius+B.radius || A.radius+distance < B.radius || B.radius+distance < A.radius )
	return null;

    // Thanks to
    // http://2000clicks.com/mathhelp/GeometryConicSectionCircleIntersection.aspx

    // The distance between the two circle centers
    var d      = A.center.distanceTo( B.center );

    // The area size of the inner triangle ABE
    var K      = 0.25 * Math.sqrt( ( Math.pow(A.radius + B.radius, 2) - Math.pow(d,2) ) * 
				   (Math.pow(d,2) - Math.pow( A.radius - B.radius, 2 ) ) 
				 );
    
    var x_partA = 0.5 * (B.center.x + A.center.x) + 
	0.5 * (B.center.x - A.center.x) * (Math.pow(A.radius,2) - Math.pow(B.radius,2)) / Math.pow(d,2);
    var x_partB = 2 * (B.center.y - A.center.y) * K / Math.pow(d,2);

    var y_partA = 0.5 * (B.center.y + A.center.y) + 
	0.5 * (B.center.y - A.center.y) * (Math.pow(A.radius,2) - Math.pow(B.radius,2)) / Math.pow(d,2);
    var y_partB = -2 * (B.center.x - A.center.x) * K / Math.pow(d,2);
	
    var x1 = x_partA + x_partB;
    var x2 = x_partA - x_partB;
    var y1 = y_partA + y_partB;
    var y2 = y_partA - y_partB;

    var pointA = new IKRS.Point2( x1, y1 );
    var pointB = new IKRS.Point2( x2, y2 ); 

    return { pointA: pointA,
	     pointB: pointB
	   };
}

IKRS.Circle.prototype.toString = function() {
    return "[IKRS.Circle]={ center=" + (this.center ? this.center.toString() : "null" ) + ", radius=" + this.radius + "}";
}

IKRS.Circle.prototype.constructor = IKRS.Circle;


/**
 * @author Ikaros Kappler
 * @date 2013-08-22
 * @version 1.0.0
 **/

IKRS.BoundingBox2 = function( _xMin,
			      _xMax,
			      _yMin,
			      _yMax ) {
    
    IKRS.Object.call( this );
    
    this.xMin = _xMin;
    this.xMax = _xMax;
    this.yMin = _yMin;
    this.yMax = _yMax;
}

IKRS.BoundingBox2.prototype = new IKRS.Object();
IKRS.BoundingBox2.prototype.constructor = IKRS.BoundingBox2;

IKRS.BoundingBox2.prototype.toString = function() {
    return "IKRS.BoundingBox2={ xMin: " + this.xMin + ", xMax: " + this.xMax + ", yMin: " + this.yMin + ", yMax: " + this.yMax + ", width: " + this.getWidth() + ", height: " + this.getHeight() + " }";
}


IKRS.BoundingBox2.prototype.getXMax = function() {
    return this.xMax;
}

IKRS.BoundingBox2.prototype.getXMin = function() {
    return this.xMin;
}

IKRS.BoundingBox2.prototype.getYMax = function() {
    return this.yMax;
}

IKRS.BoundingBox2.prototype.getYMin = function() {
    return this.yMin;
}

IKRS.BoundingBox2.prototype.getWidth = function() {
    return this.xMax - this.xMin;
}

IKRS.BoundingBox2.prototype.getHeight = function() {
    return this.yMax - this.yMin;
}

IKRS.BoundingBox2.prototype.getLeftUpperPoint = function() {
    return new IKRS.Point2( this.xMin, this.yMin );
}

IKRS.BoundingBox2.prototype.getRightUpperPoint = function() {
    return new IKRS.Point2( this.xMax, this.yMin );
}

IKRS.BoundingBox2.prototype.getRightLowerPoint = function() {
    return new IKRS.Point2( this.xMax, this.yMax );
}

IKRS.BoundingBox2.prototype.getLeftLowerPoint = function() {
    return new IKRS.Point2( this.xMin, this.yMax );
}

IKRS.BoundingBox2.prototype.getCenterPoint = function() {
    return new IKRS.Point2( this.xMin + this.getWidth()/2.0,
			    this.yMin + this.getHeight()/2.0
			  );
}

IKRS.BoundingBox2.prototype.computeDiagonalLength = function() {
    return this.getLeftUpperPoint().distanceTo( this.getRightLowerPoint() );
}

IKRS.BoundingBox2.prototype.computeBoundingTriangle = function() {

    // Aim: construct a triangle that conains this box in an acceptable
    //      way.
    // 'Acceptable' means, the whole box MUST be contained, the
    // triangle might be larger, but it should _not_ be too large!

    // Idea: first compute the diagonal of this box; it gives us an impression
    //       of the average size.
    var diagonal    = this.computeDiagonalLength();
    
    // Use the bottom line of the box, but make it diagonal*2 long.
    var centerPoint = this.getCenterPoint();
    var leftPoint   = new IKRS.Point2( centerPoint.x - diagonal,
				       this.yMax 
				     );
    var rightPoint  = new IKRS.Point2( centerPoint.x + diagonal,
				       this.yMax
				     );

    // Now make two linear interpolation lines from these points (they are left
    // and right outside of the box) to the upper both left respecive right
    // box points.
    var leftLine    = new IKRS.Line2( leftPoint,  this.getLeftUpperPoint() );
    var rightLine   = new IKRS.Line2( rightPoint, this.getRightUpperPoint() );
    

    // Where these lines meet is the top point of the triangle ;)
    
    return new IKRS.Triangle( leftPoint,
			      leftLine.computeLineIntersection( rightLine ),  // the top point
			      rightPoint
			    );
}

/**
 * This function computes the 'super-boundingbox' of this box
 * and the passed box.
 **/
IKRS.BoundingBox2.prototype.computeUnion = function( bounds ) {
    return new IKRS.BoundingBox2( Math.min(this.xMin,bounds.xMin),
				  Math.max(this.xMax,bounds.xMax),
				  Math.min(this.yMin,bounds.yMin),
				  Math.max(this.yMax,bounds.yMax)
				  );
}

IKRS.BoundingBox2.prototype._toString = function() {
    return "[IKRS.BoundingBox2]={ xMin=" + this.xMin + ", xMax=" + this.xMax + ", yMin=" + this.yMin + ", yMax=" + this.yMax + ", width=" + this.getWidth() + ", height=" + this.getHeight() + " }";
}


// A static function
IKRS.BoundingBox2.computeFromPoints = function( points ) {

    if( !points )
	points = [];
    
    if( points.length == 0 )
	return new IKRS.BoundingBox2( 0, 0, 0, 0 );

    var xMin = points[0].x;
    var xMax = points[0].x;
    var yMin = points[0].y;
    var yMax = points[0].y;
    
    for( var i = 1; i < points.length; i++ ) {

	var point = points[ i ];
	xMin = Math.min( xMin, point.x );
	xMax = Math.max( xMax, point.x );
	yMin = Math.min( yMin, point.y );
	yMax = Math.max( yMax, point.y );

    }

    return new IKRS.BoundingBox2( xMin, xMax, yMin, yMax );

}





//IKRS.BoundingBox2.prototype = new IKRS.Object();
//IKRS.BoundingBox2.prototype.constructor = IKRS.BoundingBox2;

/**
 * This is a general Tile superclass.
 *
 * All other tile classes extends this one.
 *
 *
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @date 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @date 2015-03-19 Ikaros Kappler (added toSVG()).
 * @version 1.0.2
 **/


/**
 * @param size     number  The edge size (usually IKRS.Girih.DEFAULT_EDGE_LENGTH).
 * @param position Point2  The position of the tile.
 * @param angle    number  The rotation angle.
 * @param tileType integer One of IKRS.Girih.TILE_TYPE_*.
 **/
IKRS.Tile = function( size, 
		      position, 
		      angle, 
		      tileType
		    ) {
    
    IKRS.Object.call( this );

    if( typeof angle == "undefined" )
	angle = 0.0;
    if( typeof tileType == "unknown" )
	tileType = IKRS.Girih.TILE_TYPE_UNKNOWN;
    
    this.size                 = size;
    this.position             = position;
    this.angle                = angle;
    //this.vertices            = [];
    this.polygon              = new IKRS.Polygon(); // Empty vertice array

    // An array of polygons.
    // The inner tile polygons are those that do not share edges with the outer
    // tile bounds (vertices are OK).
    this.innerTilePolygons    = []; 

    // A second array of polygons.
    // The outer tile polygons are those that make up the whole tile area
    // _together with the inner tile polygons (!)_; the union of the
    // inner tile polygons and the outer tile polygons covers exactly
    // the whole tile polygon.
    // The intersection of both sets is empty.
    // Outer tile polygon share at least one (partial) edge with the complete
    // tile polygon (length > 0).
    this.outerTilePolygons    = [];  
    this.imageProperties      = null;

    this.tileType             = tileType;

};

/**
 * This function applies MOD to the index.
 **/
IKRS.Tile.prototype.getInnerTilePolygonAt = function( index ) {
    if( index < 0 ) 
	return this.innerTilePolygons[ this.innerTilePolygons.length - (Math.abs(index)%this.innerTilePolygons.length) ];
    else
	return this.innerTilePolygons[ index % this.innerTilePolygons.length ];
};

/**
 * This function applies MOD to the index.
 **/
IKRS.Tile.prototype.getOuterTilePolygonAt = function( index ) {
    if( index < 0 ) 
	return this.outerTilePolygons[ this.outerTilePolygons.length - (Math.abs(index)%this.outerTilePolygons.length) ];
    else
	return this.outerTilePolygons[ index % this.outerTilePolygons.length ];
};


IKRS.Tile.prototype.getTranslatedVertex = function( index ) {

    //return this.vertices[index].clone().rotate( this.position, this.angle ).add( this.position );
    // Rotate around the absolut center!
    // (the position is applied later)
    //var vertex = this.polygon.getVertexAt( index ); // this.getVertexAt( index );
    //return vertex.clone().rotate( IKRS.Point2.ZERO_POINT, this.angle ).add( this.position );    
    return this._translateVertex( this.polygon.getVertexAt(index) );
};

/**
 * This is a special get* function that modulates the index and also
 * allows negative values.
 * 
 * For k >= 0:
 *  - getVertexAt( vertices.length )     == getVertexAt( 0 )
 *  - getVertexAt( vertices.length + k ) == getVertexAt( k )
 *  - getVertexAt( -k )                  == getVertexAt( vertices.length -k )
 *
 * So this function always returns a point for any index.
 **/
IKRS.Tile.prototype.getVertexAt = function( index ) {
    /*
    if( index < 0 ) 
	return this.vertices[ this.vertices.length - (Math.abs(index)%this.vertices.length) ];
    else
	return this.vertices[ index % this.vertices.length ];
    */
    return this.polygon.getVertexAt( index );
}

/**
 * This function checks if the passed point is within this tile's polygon.
 *
 * @param point The point to be checked.
 * @retrn true|false
 **/
IKRS.Tile.prototype.containsPoint = function( point ) {

    // window.alert( this._getTranslatedPoint );
    
    // Thanks to
    // http://stackoverflow.com/questions/2212604/javascript-check-mouse-clicked-inside-the-circle-or-polygon/2212851#2212851
    var i, j = 0;
    var c = false;
    for (i = 0, j = this.polygon.vertices.length-1; i < this.polygon.vertices.length; j = i++) {
	vertI = this.getTranslatedVertex( i ); 
	vertJ = this.getTranslatedVertex( j ); 
    	if ( ((vertI.y>point.y) != (vertJ.y>point.y)) &&
    	     (point.x < (vertJ.x-vertI.x) * (point.y-vertI.y) / (vertJ.y-vertI.y) + vertI.x) )
    	    c = !c;
    }
    return c;

}

/**
 * This function locates the closest tile edge (polygon edge)
 * to the passed point.
 *
 * Currently the edge distance to a point is measured by the
 * euclidian distance from the edge's middle point.
 *
 * @param point     The point to detect the closest edge for.
 * @param tolerance The tolerance (=max distance) the detected edge
 *                  must be inside.
 * @return the edge index (index of the start vertice) or -1 if not
 *         found.
 **/
IKRS.Tile.prototype.locateEdgeAtPoint = function( point,
						  tolerance
						) {
    if( this.polygon.vertices.length == 0 )
	return -1;


    var middle         = new IKRS.Point2( 0, 0 );
    var tmpDistance    = 0;
    var resultDistance = tolerance*2;   // definitely outside the tolerance :)
    var resultIndex    = -1;
    for( var i = 0; i < this.polygon.vertices.length; i++ ) {
	
	var vertI = this.getTranslatedVertex( i ); 
	var vertJ = this.getTranslatedVertex( i+1 ); // (i+1 < this.vertices.length ? i+1 : 0) ); 

	// Create a point in the middle of the edge	
	middle.x = vertI.x + (vertJ.x - vertI.x)/2.0;
	middle.y = vertI.y + (vertJ.y - vertI.y)/2.0;
	tmpDistance = middle.distanceTo(point);
	if( tmpDistance <= tolerance && (resultIndex == -1 || tmpDistance < resultDistance) ) {
	    resultDistance = tmpDistance;
	    resultIndex    = i;
	}

    }

    return resultIndex;

}

/**
 * Find the adjacent edge from this tile's polygon.
 *
 * This function will check all egdges and return the one with
 * the minimal distance (its index).
 *
 * Only forward edges (i -> i+1) are detected. If you wish backward
 * edges to be detected too, swap the point parameters pointA and 
 * pointB.
 *
 * @param pointA    The first point of the desired edge.
 * @param pointB    The second point the desired edge.
 * @param tolerance The tolerance of the detection (radius).
 * @return The index of the edge's first vertex (if detected) or
 *         -1 if not edge inside the tolerance was found.
 * 
 * @pre tolerance >= 0
 **/  
IKRS.Tile.prototype.locateAdjacentEdge = function( pointA,
						   pointB,
						   tolerance
						 ) {
    
    if( this.polygon.vertices.length == 0 )
	return -1;

    var result = -1;
    var resultDistance = 2*tolerance+1;   // Definitely larger than the tolerance :)
    //var tmpDistance;
    for( var i = 0; i <= this.polygon.vertices.length; i++ ) {

	var vertCur = this.getTranslatedVertex( i );   // this.getVertexAt( i );
	var vertSuc = this.getTranslatedVertex( i+1 ); // this.getVertexAt( i+1 );

	// Current edge matches?	
	var avgDistanceFwd = (vertCur.distanceTo(pointA) + vertSuc.distanceTo(pointB))/2.0;
	//var avgDistanceBwd = (vertSuc.distanceTo(pointA) + vertCur.distanceTo(pointB))/2.0;

	// Measure only in one direction. Otherwise the return value would be ambigous.
	if( avgDistanceFwd < tolerance &&
	    (result == -1 || (result != -1 && avgDistanceFwd < resultDistance)) 
	  ) {	    
	    // Check ALL edges to find the minimum
	    result = i;
	    resultDistance = avgDistanceFwd;
	}
    }
    

    return result;

};

IKRS.Tile.prototype.toSVG = function( options,
				      polygonStyle,
				      buffer
				    ) {
    
    var returnBuffer = false;
    if( typeof buffer == "undefined" || !buffer ) {
	buffer = [];
	returnBuffer = true;
    }

    // Export outer shape?
    /*
    this._polygonToSVG( this.polygon,
			options,
			polygonStyle,
			buffer );
    */
    for( var i = 0; i < this.innerTilePolygons.length; i++ ) {
	this._polygonToSVG( this.innerTilePolygons[i],
			    options,
			    polygonStyle,
			    buffer );
    }
    
    // Export outer tile polygons?
    /*
    for( var i = 0; i < this.outerTilePolygons.length; i++ ) {
	this._polygonToSVG( this.outerTilePolygons[i],
			    options,
			    polygonStyle,
			    buffer );
    }
    */
    
    
    if( returnBuffer )
	return buffer;
    else
	return buffer.join( "" );
};

IKRS.Tile.prototype._polygonToSVG = function( polygon,
					      options,
					      polygonStyle,
					      buffer 
					      ) {
    if( typeof options != "undefined" && typeof options.indent != "undefined" )
	buffer.push( options.indent );
    
    buffer.push( "<polygon points=\"" );
    var vert;
    for( var i = 0; i < polygon.vertices.length; i++ ) {
	vert = this._translateVertex( polygon.getVertexAt(i) ); // getTranslatedVertex(i);
	if( i > 0 )
	    buffer.push( " " );
	buffer.push( vert.x );
	buffer.push( "," );
	buffer.push( vert.y );
    }    
    buffer.push( "\"" );
    
    if( typeof polygonStyle != "undefined" ) {
	buffer.push( " style=\"" );
	buffer.push( polygonStyle );
	buffer.push( "\"" );
    }
    
    buffer.push( " />\n" );
};

IKRS.Tile.prototype.computeBounds = function() {
    return IKRS.BoundingBox2.computeFromPoints( this.polygon.vertices );
};

IKRS.Tile.prototype._translateVertex = function( vertex ) {
    return vertex.clone().rotate( IKRS.Point2.ZERO_POINT, this.angle ).add( this.position );   
};

IKRS.Tile.prototype._addVertex = function( vertex ) {
    this.polygon.vertices.push( vertex );
};

IKRS.Tile.prototype.constructor = IKRS.Tile;


/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @date 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @date 2015-03-19 Ikaros Kappler (added toSVG()).
 * @version 1.0.2
 **/


IKRS.Tile.Decagon = function( size, position, angle ) {
    
    IKRS.Tile.call( this, size, position, angle, IKRS.Girih.TILE_TYPE_DECAGON );
    
    // Init the actual decahedron shape with the passed size   
    var pointA = new IKRS.Point2(0,0);
    var pointB = pointA;
    this._addVertex( pointB );

    var theta = Math.PI/2 * (144.0 / 360.0);
    for( var i = 1; i <= 9; i++ ) {
	pointA = pointB; // center of rotation
	pointB = pointB.clone();
	pointB.x += size;
	pointB.rotate( pointA, i*theta );
	this._addVertex( pointB );
    }

    // Move to center
    var bounds = IKRS.BoundingBox2.computeFromPoints( this.polygon.vertices );
    var move   = new IKRS.Point2( size/2.0, // bounds.getWidth()/2.0 - size, // *1.1,   // ???
				  -bounds.getHeight()/2.0
				);
    for( var i = 0; i < this.polygon.vertices.length; i++ ) {
	
	this.polygon.vertices[i].add( move );
		
    }
    
    this.imageProperties = {
	source: { x:      169/500.0,
		  y:      140/460.0,
		  width:  313/500.0,
		  height: 297/460.0
		},
	destination: { xOffset: 0.0,
		       yOffset: 0.0
		     }
    };


    this._buildInnerPolygons( size );
    this._buildOuterPolygons();       // Important: call AFTER inner polygons were created!
  
};

IKRS.Tile.Decagon.prototype._buildInnerPolygons = function( edgeLength ) {
    
    var centralStar = new IKRS.Polygon();
    for( var i = 0; i < 10; i++ ) {
	var innerTile = new IKRS.Polygon(); // [];
	// Make polygon
	var topPoint    = this.getVertexAt( i ).clone().scaleTowards( this.getVertexAt(i+1), 0.5 );
	var bottomPoint = topPoint.clone().multiplyScalar( 0.615 );
	var leftPoint   = this.getVertexAt( i ).clone().multiplyScalar( 0.69 );
	var rightPoint  = this.getVertexAt( i+1 ).clone().multiplyScalar( 0.69 );
	
	innerTile.addVertex( topPoint );
	innerTile.addVertex( rightPoint );
	innerTile.addVertex( bottomPoint );
	innerTile.addVertex( leftPoint );

	this.innerTilePolygons.push( innerTile );


	centralStar.addVertex( leftPoint.clone() );
	centralStar.addVertex( bottomPoint.clone() );
    }
    
    this.innerTilePolygons.push( centralStar );
};


IKRS.Tile.Decagon.prototype._buildOuterPolygons = function( edgeLength ) {

    // DON'T include the inner star here!
    for( var i = 0; i < 10; i++ ) {

	//if( i > 0 )
	//    continue;
	
	//window.alert( this.getInnerTilePolygonAt );

	var outerTile = new IKRS.Polygon();
	outerTile.addVertex( this.getVertexAt(i).clone() );
	outerTile.addVertex( this.innerTilePolygons[i].getVertexAt(0).clone() );
	outerTile.addVertex( this.innerTilePolygons[i].getVertexAt(3).clone() );
	outerTile.addVertex( this.getInnerTilePolygonAt( i==0 ? 9 : i-1 ).getVertexAt(0).clone() );
	

	this.outerTilePolygons.push( outerTile );
    }
    
};


// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
IKRS.Tile.Decagon.prototype.computeBounds         = IKRS.Tile.prototype.computeBounds;
IKRS.Tile.Decagon.prototype._addVertex            = IKRS.Tile.prototype._addVertex;
IKRS.Tile.Decagon.prototype._translateVertex      = IKRS.Tile.prototype._translateVertex;
IKRS.Tile.Decagon.prototype._polygonToSVG         = IKRS.Tile.prototype._polygonToSVG;
IKRS.Tile.Decagon.prototype.getInnerTilePolygonAt = IKRS.Tile.prototype.getInnerTilePolygonAt;
IKRS.Tile.Decagon.prototype.getOuterTilePolygonAt = IKRS.Tile.prototype.getOuterTilePolygonAt;
IKRS.Tile.Decagon.prototype.getTranslatedVertex   = IKRS.Tile.prototype.getTranslatedVertex;
IKRS.Tile.Decagon.prototype.containsPoint         = IKRS.Tile.prototype.containsPoint;
IKRS.Tile.Decagon.prototype.locateEdgeAtPoint     = IKRS.Tile.prototype.locateEdgeAtPoint;
IKRS.Tile.Decagon.prototype.locateAdjacentEdge    = IKRS.Tile.prototype.locateAdjacentEdge;
IKRS.Tile.Decagon.prototype.getVertexAt           = IKRS.Tile.prototype.getVertexAt;
IKRS.Tile.Decagon.prototype.toSVG                 = IKRS.Tile.prototype.toSVG;

IKRS.Tile.Decagon.prototype.constructor           = IKRS.Tile.Decagon;


/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @date 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @date 2015-03-19 Ikaros Kappler (added toSVG()).
 * @version 1.0.2
 **/


IKRS.Tile.Pentagon = function( size, position, angle ) {
    
    IKRS.Tile.call( this, size, position, angle, IKRS.Girih.TILE_TYPE_PENTAGON );

    // Init the actual decahedron shape with the passed size
    var pointA = new IKRS.Point2(0,0);
    var pointB = pointA;
    this._addVertex( pointB );

    //var theta = Math.PI*2 * (90.0 / 108.0);
    var theta = (Math.PI*2) / 5;
    for( var i = 1; i <= 4; i++ ) {
	pointA = pointB; // center of rotation
	pointB = pointB.clone();
	pointB.x += size;
	pointB.rotate( pointA, i*theta );
	this._addVertex( pointB );
    }


    // Move to center    
    // Calculate the diameter of the bounding circle
    var r_out  = (size/10) * Math.sqrt( 50 + 10*Math.sqrt(5) );
    // Calculate the diameter of the inner circle
    var r_in   = (size/10) * Math.sqrt( 25 + 10*Math.sqrt(5) );
    //var bounds = IKRS.BoundingBox2.computeFromPoints( this.vertices );
    var move   = new IKRS.Point2( size/2.0, 
				  -r_out + (r_out-r_in)
				);
    for( var i = 0; i < this.polygon.vertices.length; i++ ) {
	
	this.polygon.vertices[i].add( move );
		
    }

    this.imageProperties = {
	source: {	x:      7/500.0,
			y:      (303-15)/460.0, // -16
			width:  157/500.0, 
			height: (150+15)/460.0  // +16
		},
	destination: { xOffset: 0.0,
		       yOffset: -18/460.0 // -16
		     }
		     
    };
    //this.imageProperties.source.center = new IKRS.Point2( this.imageProperties.source.x + this.imageProperties.source.x


    this._buildInnerPolygons( size );
    this._buildOuterPolygons();       // Only call AFTER the inner polygons were built!
};

IKRS.Tile.Pentagon.prototype._buildInnerPolygons = function( edgeLength ) {

    
    // Connect all edges half-the-way
    var innerTile = new IKRS.Polygon(); // [];
    //innerTile.push( this.vertices[0].scaleTowards( this.vertices[1], 0.5 ) );
    //innerTile.push( this.vertices[1].scaleTowards( this.vertices[2], 0.5 ) );

    var center = new IKRS.Point2( 0, 0 );
    for( var i = 0; i < this.polygon.vertices.length; i++ ) {

	innerTile.addVertex( this.getVertexAt(i).scaleTowards( this.getVertexAt(i+1), 0.5 ) );

	// This algorithm using circles to detect the intersection point
	// does not work as expected:
	/*
	  // Compute the next inner polygon vertex by the intersection of two circles
	  var circleA = new IKRS.Circle( innerTile.vertices[ innerTile.vertices.length-1 ], edgeLength*0.425 ); //*0.425 ); 
	  var circleB = new IKRS.Circle( this.getVertexAt(i+1).clone().scaleTowards( this.getVertexAt(i+2), 0.5 ), 
	  			         circleA.radius );
    
	  // There is definitely an intersection
	  var intersection = circleA.computeIntersectionPoints( circleB );
	  // One of the two points is inside the tile, the other is outside.
	  // Locate the inside point.
	  if( intersection ) {
	      if( this.containsPoint(intersection.pointA) ) innerTile.addVertex(intersection.pointA);
	      else                                          innerTile.addVertex(intersection.pointB);
	  } else {
	      console.log( "intersection is null!" );
	  }	
	*/

	// ... make linear approximation instead
	innerTile.addVertex( this.getVertexAt(i+1).scaleTowards( center, 0.5 ) );

    }

    //window.alert( innerTile.length );

    this.innerTilePolygons.push( innerTile );
};


IKRS.Tile.Pentagon.prototype._buildOuterPolygons = function() {

    for( var i = 0; i < this.polygon.vertices.length; i++ ) {

	var indexA     = i; //indicesA[i];
	var indexB     = i*2; // indicesB[i];
	// The triangle
	var outerTileX = new IKRS.Polygon();
	outerTileX.addVertex( this.getVertexAt(indexA+1).clone() );
	outerTileX.addVertex( this.innerTilePolygons[0].getVertexAt(indexB).clone() );
	outerTileX.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+1).clone() );
	outerTileX.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+2).clone() );
	this.outerTilePolygons.push( outerTileX );
	
    }

};


// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
IKRS.Tile.Pentagon.prototype.computeBounds         = IKRS.Tile.prototype.computeBounds;
IKRS.Tile.Pentagon.prototype._addVertex            = IKRS.Tile.prototype._addVertex;
IKRS.Tile.Pentagon.prototype._translateVertex      = IKRS.Tile.prototype._translateVertex;
IKRS.Tile.Pentagon.prototype._polygonToSVG         = IKRS.Tile.prototype._polygonToSVG;
IKRS.Tile.Pentagon.prototype.getInnerTilePolygonAt = IKRS.Tile.prototype.getInnerTilePolygonAt;
IKRS.Tile.Pentagon.prototype.getOuterTilePolygonAt = IKRS.Tile.prototype.getOuterTilePolygonAt;
IKRS.Tile.Pentagon.prototype.getTranslatedVertex   = IKRS.Tile.prototype.getTranslatedVertex;
IKRS.Tile.Pentagon.prototype.containsPoint         = IKRS.Tile.prototype.containsPoint;
IKRS.Tile.Pentagon.prototype.locateEdgeAtPoint     = IKRS.Tile.prototype.locateEdgeAtPoint;
IKRS.Tile.Pentagon.prototype.locateAdjacentEdge    = IKRS.Tile.prototype.locateAdjacentEdge;
IKRS.Tile.Pentagon.prototype.getVertexAt           = IKRS.Tile.prototype.getVertexAt;
IKRS.Tile.Pentagon.prototype.toSVG                 = IKRS.Tile.prototype.toSVG;

IKRS.Tile.Pentagon.prototype.constructor           = IKRS.Tile.Pentagon;


/**
 * @author Ikaros Kappler
 * @date 2013-11-28
 * @date 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @date 2015-03-19 Ikaros Kappler (added toSVG()).
 * @version 1.0.2
 **/


IKRS.Tile.IrregularHexagon = function( size, position, angle ) {
    
    IKRS.Tile.call( this, size, position, angle, IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON );

    //window.alert( "[IrregularHexagon.init()] size=" + size + ", position=" + position.toString() + ", angle=" + angle );
    
    // Init the actual decahedron shape with the passed size
    var pointA        = new IKRS.Point2(0,0);
    var pointB        = pointA;
    var startPoint    = pointA;
    var oppositePoint = null;
    this._addVertex( pointB );

    var angles = [ 0.0,
		   72.0,
		   144.0,
		   144.0,
		   72.0
		   // 144.0
		 ];
    
    var theta = 0.0;
    for( var i = 0; i < angles.length; i++ ) {

	theta += (180.0 - angles[i]);

	pointA = pointB; // center of rotation
	pointB = pointB.clone();
	pointB.x -= size;
	pointB.rotate( pointA, theta * (Math.PI/180.0) );
	this._addVertex( pointB );	

	if( i == 2 )
	    oppositePoint = pointB;

    }

    // Move to center    
    var bounds = IKRS.BoundingBox2.computeFromPoints( this.polygon.vertices );
    var move   = new IKRS.Point2( (oppositePoint.x - startPoint.x)/2.0, 
				  (oppositePoint.y - startPoint.y)/2.0
				);
    for( var i = 0; i < this.polygon.vertices.length; i++ ) {
	
	this.polygon.vertices[i].sub( move );
		
    }

    this.imageProperties = {
	source: { x:      77/500.0, // 75,
		  y:      11/460.0,
		  width:  205/500.0, // 207,
		  height: 150/460.0  // 150
		},
	destination: { xOffset: 0.0,
		       yOffset: 0.0
		     }
    };

    this._buildInnerPolygons();
    this._buildOuterPolygons();   // Only call AFTER the inner polygons were created!
};


IKRS.Tile.IrregularHexagon.prototype._buildInnerPolygons = function() {

    
    // Connect all edges half-the-way
    var innerTile = new IKRS.Polygon(); // []
    innerTile.addVertex( this.polygon.vertices[0].scaleTowards( this.polygon.vertices[1], 0.5 ) );
    innerTile.addVertex( this.polygon.vertices[1].scaleTowards( this.polygon.vertices[2], 0.5 ) );

    // Compute the next inner polygon vertex by the intersection of two circles
    var circleA = new IKRS.Circle( innerTile.vertices[1], innerTile.vertices[0].distanceTo(innerTile.vertices[1]) );
    var circleB = new IKRS.Circle( this.polygon.vertices[2].clone().scaleTowards( this.polygon.vertices[3], 0.5 ), circleA.radius );
    
    // There is definitely an intersection
    var intersection = circleA.computeIntersectionPoints( circleB );
    // One of the two points is inside the tile, the other is outside.
    // Locate the inside point.
    if( intersection && typeof intersection != "undefined" ) {
	// Use the point that is closer to the center
	if( intersection.pointA.length() < intersection.pointB.length() ) innerTile.addVertex(intersection.pointA);
	else                                                              innerTile.addVertex(intersection.pointB);
	//if( this.containsPoint(intersection.pointA) ) innerTile.push(intersection.pointA);
	//else                                          innerTile.push(intersection.pointB);
	//intersection = null;
    } else {
	console.log( "intersection is null!" );
    }
    
    innerTile.addVertex( circleB.center );
    
    //innerTile.push( this.vertices[3].scaleTowards( this.vertices[0], 0.5 ) );
    
    
    var i = 3;
    // Move circles
    circleA.center = circleB.center; // innerTile[4];
    circleB.center = this.polygon.vertices[3].clone().scaleTowards( this.polygon.vertices[4], 0.5 ); // innerTile[0];
    //window.alert( "circleA=" + circleA + ", circleB=" + circleB );
    intersection   = circleA.computeIntersectionPoints( circleB );
    // There are two points again (one inside, one outside the tile)
    if( intersection && typeof intersection != "undefined" ) {
	// Use the point that is closer to the center
	if( intersection.pointA.length() < intersection.pointB.length() ) innerTile.addVertex(intersection.pointA);
	else                                                              innerTile.addVertex(intersection.pointB);
	//if( this.containsPoint(intersection.pointA) ) innerTile.push(intersection.pointA);
	//else                                          innerTile.push(intersection.pointB);
	//intersection = null;
    } else {
	console.log( "intersection is null!" );
    }
    innerTile.addVertex( circleB.center );

    innerTile.addVertex( this.polygon.vertices[4].clone().scaleTowards( this.polygon.vertices[5], 0.5 ) );


    
    // Move circles  
    circleA.center = innerTile.vertices[ innerTile.vertices.length-1 ];  
    circleB.center = this.polygon.vertices[5].clone().scaleTowards( this.polygon.vertices[0], 0.5 );  
    //window.alert( "circleA=" + circleA + ", circleB=" + circleB );
    intersection   = circleA.computeIntersectionPoints( circleB );
    // There are two points again (one inside, one outside the tile)
    if( intersection && typeof intersection != "undefined" ) {
	// Use the point that is closer to the center
	if( intersection.pointA.length() < intersection.pointB.length() ) innerTile.addVertex(intersection.pointA);
	else                                                              innerTile.addVertex(intersection.pointB);
	//if( this.containsPoint(intersection.pointA) ) innerTile.push(intersection.pointA);
	//else                                          innerTile.push(intersection.pointB);
	//intersection = null;
    } else {
	console.log( "intersection is null!" );
    }
    innerTile.addVertex( circleB.center );
  


    
    // Move circles  
    circleA.center = innerTile.vertices[ innerTile.vertices.length-1 ];  
    circleB.center = innerTile.vertices[ 0 ]; 
    //window.alert( "circleA=" + circleA + ", circleB=" + circleB );
    intersection   = circleA.computeIntersectionPoints( circleB );
    // There are two points again (one inside, one outside the tile)
    if( intersection ) { //  && typeof intersection != "undefined" ) {
	// Use the point that is closer to the center
	if( intersection.pointA.length() < intersection.pointB.length() ) innerTile.addVertex(intersection.pointA);
	else                                                              innerTile.addVertex(intersection.pointB);
    } else {
	console.log( "intersection is null!" );
    }
    innerTile.addVertex( circleB.center );
    

    //window.alert( innerTile.length );

    this.innerTilePolygons.push( innerTile );	
};


IKRS.Tile.IrregularHexagon.prototype._buildOuterPolygons = function() {

    // First add the two triangles at the 'ends' of the shape.
    var indicesA = [ 0, 3 ];  //  6:2
    var indicesB = [ 0, 5 ];  // 10:2
    for( var i = 0; i < indicesA.length; i++ ) {

	var indexA     = indicesA[i];
	var indexB     = indicesB[i];
	// The triangle
	var outerTileX = new IKRS.Polygon();
	outerTileX.addVertex( this.getVertexAt(indexA+1).clone() );
	outerTileX.addVertex( this.innerTilePolygons[0].getVertexAt(indexB).clone() );
	outerTileX.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+1).clone() );
	this.outerTilePolygons.push( outerTileX );
	
	// The first 'kite'
	var outerTileY = new IKRS.Polygon();
	outerTileY.addVertex( this.getVertexAt(indexA+2).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+1).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+2).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+3).clone() );
	this.outerTilePolygons.push( outerTileY );

	// The second 'kite'
	var outerTileY = new IKRS.Polygon();
	outerTileY.addVertex( this.getVertexAt(indexA+3).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+3).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+4).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+5).clone() );
	this.outerTilePolygons.push( outerTileY );
    }

};


// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
IKRS.Tile.IrregularHexagon.prototype.computeBounds         = IKRS.Tile.prototype.computeBounds;
IKRS.Tile.IrregularHexagon.prototype._addVertex            = IKRS.Tile.prototype._addVertex;
IKRS.Tile.IrregularHexagon.prototype._translateVertex      = IKRS.Tile.prototype._translateVertex;
IKRS.Tile.IrregularHexagon.prototype._polygonToSVG         = IKRS.Tile.prototype._polygonToSVG;
IKRS.Tile.IrregularHexagon.prototype.getInnerTilePolygonAt = IKRS.Tile.prototype.getInnerTilePolygonAt;
IKRS.Tile.IrregularHexagon.prototype.getOuterTilePolygonAt = IKRS.Tile.prototype.getOuterTilePolygonAt;
IKRS.Tile.IrregularHexagon.prototype.getTranslatedVertex   = IKRS.Tile.prototype.getTranslatedVertex;
IKRS.Tile.IrregularHexagon.prototype.containsPoint         = IKRS.Tile.prototype.containsPoint;
IKRS.Tile.IrregularHexagon.prototype.locateEdgeAtPoint     = IKRS.Tile.prototype.locateEdgeAtPoint;
IKRS.Tile.IrregularHexagon.prototype.locateAdjacentEdge    = IKRS.Tile.prototype.locateAdjacentEdge;
IKRS.Tile.IrregularHexagon.prototype.getVertexAt           = IKRS.Tile.prototype.getVertexAt;
IKRS.Tile.IrregularHexagon.prototype.toSVG                 = IKRS.Tile.prototype.toSVG;

IKRS.Tile.IrregularHexagon.prototype.constructor           = IKRS.Tile.IrregularHexagon;


/**
 * @author Ikaros Kappler
 * @date 2013-11-28
 * @date 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @date 2015-03-19 Ikaros Kappler (added toSVG()).
 * @version 1.0.2
 **/


IKRS.Tile.Rhombus = function( size, position, angle ) {
    
    IKRS.Tile.call( this, size, position, angle, IKRS.Girih.TILE_TYPE_RHOMBUS  );
    
    // Init the actual decahedron shape with the passed size
    var pointA = new IKRS.Point2(0,0);
    var pointB = pointA;
    this._addVertex( pointB );

    var angles = [ 0.0,
		   72.0,
		   108.0
		   // 72.0
		 ];
    
    var theta = 0.0;
    for( var i = 0; i < angles.length; i++ ) {

	theta += (180.0 - angles[i]);

	pointA = pointB; // center of rotation
	pointB = pointB.clone();
	pointB.x += size;
	pointB.rotate( pointA, theta * (Math.PI/180.0) );
	this._addVertex( pointB );	

    }

    
    // Move to center    
    var bounds = IKRS.BoundingBox2.computeFromPoints( this.polygon.vertices );
    var move   = new IKRS.Point2( bounds.getWidth()/2.0 - (bounds.getWidth()-size), 
				  bounds.getHeight()/2.0
				);
    for( var i = 0; i < this.polygon.vertices.length; i++ ) {
	
	this.polygon.vertices[i].add( move );
		
    }

    this.imageProperties = {
	source: { x:      32/500.0,
		  y:      188/460.0,
		  width:  127/500.0, // 127,
		  height: 92/460.0
		},
	destination: { xOffset: 0.0,
		       yOffset: 0.0
		     }
    };
    
    this._buildInnerPolygons();
    this._buildOuterPolygons();  // Call only AFTER the inner polygons were built!
};

IKRS.Tile.Rhombus.prototype._buildInnerPolygons = function() {

       // Connect all edges half-the-way
    var innerTile = new IKRS.Polygon(); // [];
    innerTile.addVertex( this.polygon.vertices[0].scaleTowards( this.polygon.vertices[1], 0.5 ) );
    innerTile.addVertex( this.polygon.vertices[1].scaleTowards( this.polygon.vertices[2], 0.5 ) );

    // Compute the next inner polygon vertex by the intersection of two circles
    var circleA = new IKRS.Circle( innerTile.vertices[1], innerTile.vertices[0].distanceTo(innerTile.vertices[1])*0.73 );
    var circleB = new IKRS.Circle( this.polygon.vertices[2].scaleTowards( this.polygon.vertices[3], 0.5 ), circleA.radius );
    
    // There is definitely an intersection
    var intersection = circleA.computeIntersectionPoints( circleB );
    // One of the two points is inside the tile, the other is outside.
    // Locate the inside point.
    if( this.containsPoint(intersection.pointA) ) innerTile.addVertex(intersection.pointA);
    else                                          innerTile.addVertex(intersection.pointB);
    
    innerTile.addVertex( circleB.center );
    innerTile.addVertex( this.polygon.vertices[3].scaleTowards( this.polygon.vertices[0], 0.5 ) );
    
    // Move circles
    circleA.center = innerTile.vertices[4];
    circleB.center = innerTile.vertices[0];
    //window.alert( "circleA=" + circleA + ", circleB=" + circleB );
    intersection   = circleA.computeIntersectionPoints( circleB );
    // There are two points again (one inside, one outside the tile)
    if( this.containsPoint(intersection.pointA) ) innerTile.addVertex(intersection.pointA);
    else                                          innerTile.addVertex(intersection.pointB);

    this.innerTilePolygons.push( innerTile );

};

IKRS.Tile.Rhombus.prototype._buildOuterPolygons = function() {

    var indicesA = [ 0, 2 ];  // 4:2
    var indicesB = [ 0, 3 ];  // 6:2
    for( var i = 0; i < indicesA.length; i++ ) {

	var indexA     = indicesA[i];
	var indexB     = indicesB[i];
	// The triangle
	var outerTileX = new IKRS.Polygon();
	outerTileX.addVertex( this.getVertexAt(indexA+1).clone() );
	outerTileX.addVertex( this.innerTilePolygons[0].getVertexAt(indexB).clone() );
	outerTileX.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+1).clone() );
	this.outerTilePolygons.push( outerTileX );
	
	// The first 'kite'
	var outerTileY = new IKRS.Polygon();
	outerTileY.addVertex( this.getVertexAt(indexA+2).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+1).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+2).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+3).clone() );
	this.outerTilePolygons.push( outerTileY );

	/*
	// The second 'kite'
	var outerTileY = new IKRS.Polygon();
	outerTileY.addVertex( this.getVertexAt(indexA+3).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+3).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+4).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+5).clone() );
	this.outerTilePolygons.push( outerTileY );
	*/
    }

};


// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
IKRS.Tile.Rhombus.prototype.computeBounds         = IKRS.Tile.prototype.computeBounds;
IKRS.Tile.Rhombus.prototype._addVertex            = IKRS.Tile.prototype._addVertex;
IKRS.Tile.Rhombus.prototype._translateVertex      = IKRS.Tile.prototype._translateVertex;
IKRS.Tile.Rhombus.prototype._polygonToSVG         = IKRS.Tile.prototype._polygonToSVG;
IKRS.Tile.Rhombus.prototype.getInnerTilePolygonAt = IKRS.Tile.prototype.getInnerTilePolygonAt;
IKRS.Tile.Rhombus.prototype.getOuterTilePolygonAt = IKRS.Tile.prototype.getOuterTilePolygonAt;
IKRS.Tile.Rhombus.prototype.getTranslatedVertex   = IKRS.Tile.prototype.getTranslatedVertex;
IKRS.Tile.Rhombus.prototype.containsPoint         = IKRS.Tile.prototype.containsPoint;
IKRS.Tile.Rhombus.prototype.locateEdgeAtPoint     = IKRS.Tile.prototype.locateEdgeAtPoint;
IKRS.Tile.Rhombus.prototype.locateAdjacentEdge    = IKRS.Tile.prototype.locateAdjacentEdge;
IKRS.Tile.Rhombus.prototype.getVertexAt           = IKRS.Tile.prototype.getVertexAt;
IKRS.Tile.Rhombus.prototype.toSVG                 = IKRS.Tile.prototype.toSVG;

IKRS.Tile.Rhombus.prototype.constructor           = IKRS.Tile.Rhombus;


/**
 * @author Ikaros Kappler
 * @date 2013-11-28
 * @date 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @date 2015-03-19 Ikaros Kappler (added toSVG()).
 * @version 1.0.2
 **/


IKRS.Tile.BowTie = function( size, position, angle ) {
    
    IKRS.Tile.call( this, size, position, angle, IKRS.Girih.TILE_TYPE_BOW_TIE );
    
    // Init the actual decahedron shape with the passed size
    var pointA          = new IKRS.Point2(0,0);
    var pointB          = pointA;
    var startPoint      = pointA;
    var oppositePoint   = null;
    this._addVertex( pointB );

    var angles = [ 0.0,
		   72.0,
		   72.0,
		   216.0,
		   72.0
		 ];

    var theta = 0.0;
    for( var i = 0; i < angles.length; i++ ) {

	theta += (180.0 - angles[i]);

	pointA = pointB; // center of rotation
	pointB = pointB.clone();
	pointB.x -= size;
	pointB.rotate( pointA, theta * (Math.PI/180.0) );
	this._addVertex( pointB );	

	if( i == 2 )
	    oppositePoint = pointB;

    }

    // Move to center    
    var bounds = IKRS.BoundingBox2.computeFromPoints( this.polygon.vertices );
    var move   = new IKRS.Point2( (oppositePoint.x - startPoint.x)/2.0, // bounds.getWidth()/2.0,
				  (oppositePoint.y - startPoint.y)/2.0  // -size/2.0
				);
    for( var i = 0; i < this.polygon.vertices.length; i++ ) {
	
	this.polygon.vertices[i].sub( move );
		
    }

    this.imageProperties = {
	source: { x:      288/500.0, // 287,
		  y:      7/460.0,
		  width:  206/500.0,
		  height: 150/460.0
		  //angle:  0.0   // IKRS.Girih.MINIMAL_ANGLE
		},
	destination: { xOffset: 0.0,
		       yOffset: 0.0
		     }
    };
    
    this._buildInnerPolygons( size );
    this._buildOuterPolygons();       // Only call AFTER the inner polygons were created!
  
};

IKRS.Tile.BowTie.prototype._buildInnerPolygons = function( edgeLength ) {

    var indices = [ 1, 4 ];
    for( var i = 0; i < indices.length; i++ ) {

	var index       = indices[i];

	var middlePoint = this.getVertexAt( index ).clone().scaleTowards( this.getVertexAt(index+1), 0.5 );
	var leftPoint   = this.getVertexAt( index-1 ).clone().scaleTowards( this.getVertexAt(index), 0.5 );
	var rightPoint  = this.getVertexAt( index+1 ).clone().scaleTowards( this.getVertexAt(index+2), 0.5 );
	var innerPoint  = middlePoint.clone().multiplyScalar( 0.38 );
	
	var innerTile = new IKRS.Polygon(); // [];
	innerTile.addVertex( middlePoint );
	innerTile.addVertex( rightPoint );
	innerTile.addVertex( innerPoint );
	innerTile.addVertex( leftPoint );


	this.innerTilePolygons.push( innerTile );
    }
};

IKRS.Tile.BowTie.prototype._buildOuterPolygons = function() {

    // Add the outer four 'edges'
    var indices = [ 0, 3 ];
    for( var i = 0; i < indices.length; i++ ) {

	var index       = indices[i];
	
	// The first/third triangle
	var outerTileA   = new IKRS.Polygon(); 
	outerTileA.addVertex( this.innerTilePolygons[i].getVertexAt(0).clone() );
	outerTileA.addVertex( this.getVertexAt(index+2).clone() );
	outerTileA.addVertex( this.innerTilePolygons[i].getVertexAt(1).clone()) ;
	this.outerTilePolygons.push( outerTileA );

	// The second/fourth triangle
	var outerTileB = new IKRS.Polygon();
	outerTileB.addVertex( this.innerTilePolygons[i].getVertexAt(0).clone() );
	outerTileB.addVertex( this.getVertexAt(index+1).clone() );
	outerTileB.addVertex( this.innerTilePolygons[i].getVertexAt(3).clone()) ;
	this.outerTilePolygons.push( outerTileB );
		
    }

    // Add the center polygon
    var centerTile = new IKRS.Polygon();
    centerTile.addVertex( this.getVertexAt(0).clone() );
    centerTile.addVertex( this.innerTilePolygons[0].getVertexAt(3).clone() );
    centerTile.addVertex( this.innerTilePolygons[0].getVertexAt(2).clone() );
    centerTile.addVertex( this.innerTilePolygons[0].getVertexAt(1).clone() );
    centerTile.addVertex( this.getVertexAt(3).clone() );
    centerTile.addVertex( this.innerTilePolygons[1].getVertexAt(3).clone() );
    centerTile.addVertex( this.innerTilePolygons[1].getVertexAt(2).clone() );
    centerTile.addVertex( this.innerTilePolygons[1].getVertexAt(1).clone() );
    this.outerTilePolygons.push( centerTile );
};

// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
IKRS.Tile.BowTie.prototype.computeBounds         = IKRS.Tile.prototype.computeBounds;
IKRS.Tile.BowTie.prototype._addVertex            = IKRS.Tile.prototype._addVertex;
IKRS.Tile.BowTie.prototype._translateVertex      = IKRS.Tile.prototype._translateVertex;
IKRS.Tile.BowTie.prototype._polygonToSVG         = IKRS.Tile.prototype._polygonToSVG;
IKRS.Tile.BowTie.prototype.getInnerTilePolygonAt = IKRS.Tile.prototype.getInnerTilePolygonAt;
IKRS.Tile.BowTie.prototype.getOuterTilePolygonAt = IKRS.Tile.prototype.getOuterTilePolygonAt;
IKRS.Tile.BowTie.prototype.getTranslatedVertex   = IKRS.Tile.prototype.getTranslatedVertex;
IKRS.Tile.BowTie.prototype.containsPoint         = IKRS.Tile.prototype.containsPoint;
IKRS.Tile.BowTie.prototype.locateEdgeAtPoint     = IKRS.Tile.prototype.locateEdgeAtPoint;
IKRS.Tile.BowTie.prototype.locateAdjacentEdge    = IKRS.Tile.prototype.locateAdjacentEdge;
IKRS.Tile.BowTie.prototype.getVertexAt           = IKRS.Tile.prototype.getVertexAt;
IKRS.Tile.BowTie.prototype.toSVG                 = IKRS.Tile.prototype.toSVG;

IKRS.Tile.BowTie.prototype.constructor           = IKRS.Tile.BowTie;


/**
 * The penrose rhombus (angles 36° and 144°) is NOT part of the actual girih tile set!
 *
 * But it fits perfect into the girih as the angles are the same. 
 * *
 * @author Ikaros Kappler
 * @date 2013-12-11
 * @date 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @date 2015-03-19 Ikaros Kappler (added toSVG()).
 * @version 1.0.2
 **/


IKRS.Tile.PenroseRhombus = function( size, position, angle, opt_addCenterPolygon ) {
    
    IKRS.Tile.call( this, size, position, angle, IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS  );


    if( typeof opt_addCenterPolygon == "undefined" )
	opt_addCenterPolygon = true;  // Add by default

    
    // Init the actual decahedron shape with the passed size
    var pointA = new IKRS.Point2(0,0);
    var pointB = pointA;
    this._addVertex( pointB );

    var angles = [ 0.0,
		   36.0,  // 72.0,
		   144.0  // 108.0
		 ];
    
    var theta = 0.0;
    for( var i = 0; i < angles.length; i++ ) {

	theta += (180.0 - angles[i]);

	pointA = pointB; // center of rotation
	pointB = pointB.clone();
	pointB.x += size;
	pointB.rotate( pointA, theta * (Math.PI/180.0) );
	this._addVertex( pointB );	

    }

    
    // Move to center    
    var bounds = IKRS.BoundingBox2.computeFromPoints( this.polygon.vertices );
    var move   = new IKRS.Point2( bounds.getWidth()/2.0 - (bounds.getWidth()-size), 
				  bounds.getHeight()/2.0
				);
    for( var i = 0; i < this.polygon.vertices.length; i++ ) {
	
	this.polygon.vertices[i].add( move );
		
    }

    
    this.imageProperties = {
	source: { x:      2/500.0,
		  y:      8/460.0,
		  width:  173/500.0, 
		  height: 56/460.0
		},
	destination: { xOffset: 0.0,
		       yOffset: 0.0
		     }
    };
				 
    
    this._buildInnerPolygons( opt_addCenterPolygon );
    this._buildOuterPolygons( opt_addCenterPolygon );
};

IKRS.Tile.PenroseRhombus.prototype._buildInnerPolygons = function( addCenterPolygon ) {

    var indices              = [ 0, 2 ];
    var innerPointIndexLeft  = -1;
    var innerPointIndexRight = -1;
    var centerTile           = new IKRS.Polygon();
    for( var i = 0; i < indices.length; i++ ) {

	var innerTile = new IKRS.Polygon();
	var index = indices[i];
	var left   = this.getVertexAt( index   ).clone().scaleTowards( this.getVertexAt(index+1), 0.5 );
	var right  = this.getVertexAt( index+1 ).clone().scaleTowards( this.getVertexAt(index+2), 0.5 );
	var innerA = this.getVertexAt( index+1 ).clone().multiplyScalar( 0.28 );
	var innerB = this.getVertexAt( index+1 ).clone().multiplyScalar( 0.55 );
	

	innerTile.addVertex( left );
	innerTile.addVertex( innerA );
	innerTile.addVertex( right );
	innerTile.addVertex( innerB );

	if( i == 0 ) {
	    centerTile.addVertex( this.getVertexAt( index ).clone().scaleTowards( this.getVertexAt(index+2), 0.1775 ) );
	    centerTile.addVertex( innerA );
	} else { // if( i == 1 ) {
	    centerTile.addVertex( this.getVertexAt( index ).clone().scaleTowards( this.getVertexAt(index+2), 0.1775 ) );
	    centerTile.addVertex( innerA );
	}

	this.innerTilePolygons.push( innerTile );
    }
    
    if( addCenterPolygon )
	this.innerTilePolygons.push( centerTile );

};

IKRS.Tile.PenroseRhombus.prototype._buildOuterPolygons = function( centerPolygonExists ) {

    // Add left and right 'spikes'.
    var indices = [ 0, 2 ];
    for( var i = 0; i < indices.length; i++ ) {

	var outerTile = new IKRS.Polygon();
	var index = indices[i];
	var left   = this.getVertexAt( index   ).clone().scaleTowards( this.getVertexAt(index+1), 0.5 );
	var right  = this.getVertexAt( index+1 ).clone().scaleTowards( this.getVertexAt(index+2), 0.5 );
	var innerA = this.getVertexAt( index+1 ).clone().multiplyScalar( 0.28 );
	var innerB = this.getVertexAt( index+1 ).clone().multiplyScalar( 0.55 );

	outerTile.addVertex( left.clone() );
	outerTile.addVertex( this.getVertexAt( index+1 ).clone() );
	outerTile.addVertex( right.clone() );
	outerTile.addVertex( innerB.clone() );
	
	this.outerTilePolygons.push( outerTile );
	   
    }
   
    // If the center polygon exists then the last outer polygon is split into two.
    if( centerPolygonExists ) {
	// Two polygons
	
	var indices = [ 0, 2 ];
	for( var i = 0; i < indices.length; i++ ) {
	    var outerTile = new IKRS.Polygon();
	    var index = indices[i];
	    outerTile.addVertex( this.getVertexAt(index).clone() );
	    outerTile.addVertex( this.getVertexAt(index).clone().scaleTowards(this.getVertexAt(index+1),0.5) );
	    outerTile.addVertex( this.innerTilePolygons[i].getVertexAt(1).clone() );
	    outerTile.addVertex( this.getVertexAt(index).clone().scaleTowards( this.getVertexAt(index+2), 0.1775 ) );
	    outerTile.addVertex( this.innerTilePolygons[(i+1)%2].getVertexAt(1).clone() );
	    outerTile.addVertex( this.getVertexAt(index-1).clone().scaleTowards( this.getVertexAt(index), 0.5 ) );
	    
	    this.outerTilePolygons.push( outerTile );
	}

    } else {
	// One polygon
	
    }

};

/**
 * If you want the center polygon not to be drawn the canvas handler needs to
 * know the respective polygon index (inside the this.innerTilePolygons array).
 **/
IKRS.Tile.PenroseRhombus.prototype.getCenterPolygonIndex = function() {
    return 2;
};


// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
IKRS.Tile.PenroseRhombus.prototype.computeBounds         = IKRS.Tile.prototype.computeBounds;
IKRS.Tile.PenroseRhombus.prototype._addVertex            = IKRS.Tile.prototype._addVertex;
IKRS.Tile.PenroseRhombus.prototype._translateVertex      = IKRS.Tile.prototype._translateVertex;
IKRS.Tile.PenroseRhombus.prototype._polygonToSVG         = IKRS.Tile.prototype._polygonToSVG;
IKRS.Tile.PenroseRhombus.prototype.getInnerTilePolygonAt = IKRS.Tile.prototype.getInnerTilePolygonAt;
IKRS.Tile.PenroseRhombus.prototype.getOuterTilePolygonAt = IKRS.Tile.prototype.getOuterTilePolygonAt;
IKRS.Tile.PenroseRhombus.prototype.getTranslatedVertex   = IKRS.Tile.prototype.getTranslatedVertex;
IKRS.Tile.PenroseRhombus.prototype.containsPoint         = IKRS.Tile.prototype.containsPoint;
IKRS.Tile.PenroseRhombus.prototype.locateEdgeAtPoint     = IKRS.Tile.prototype.locateEdgeAtPoint;
IKRS.Tile.PenroseRhombus.prototype.locateAdjacentEdge    = IKRS.Tile.prototype.locateAdjacentEdge;
IKRS.Tile.PenroseRhombus.prototype.getVertexAt           = IKRS.Tile.prototype.getVertexAt;
IKRS.Tile.PenroseRhombus.prototype.toSVG                 = IKRS.Tile.prototype.toSVG;

IKRS.Tile.Rhombus.prototype.constructor                  = IKRS.Tile.Rhombus;


/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/


IKRS.Girih = function() {
    
    IKRS.Object.call( this );
    
    // Add tiles
    this.tiles = [];
    //this.tiles.push( new IKRS.Tile() );

};

IKRS.Girih.prototype.addTile = function( tile ) {
    this.tiles.push( tile );
}

//IKRS.Girih.protoype.x = function() {
//    
//}

IKRS.Girih.deg2rad = function( deg ) {
    return deg * (Math.PI/180.0);
}

IKRS.Girih.rad2deg = function( rad ) {
    return (rad * 180.0) / Math.PI
}


IKRS.Girih.MINIMAL_ANGLE = IKRS.Girih.deg2rad(18.0); // 18.0 * (Math.PI/180.0);

// IKRS.Girih.EPSILON       = 1.0e-6;


IKRS.Girih.TILE_TYPE_UNKNOWN            = -1;
IKRS.Girih.TILE_TYPE_DECAGON            = 0;
IKRS.Girih.TILE_TYPE_PENTAGON           = 1;
IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON  = 2;
IKRS.Girih.TILE_TYPE_RHOMBUS            = 3;
IKRS.Girih.TILE_TYPE_BOW_TIE            = 4;
// This is not part of the actual girih tile set!
IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS    = 5;

/*
IKRS.Girih.EDGE_COUNT_DECAGON           = 10;
IKRS.Girih.EDGE_COUNT_PENTAGON          = 5;
IKRS.Girih.EDGE_COUNT_IRREGULAR_HEXAGON = 6;
IKRS.Girih.EDGE_COUNT_RHOMBUS           = 4;
IKRS.Girih.EDGE_COUNT_BOW_TIE           = 6;

IKRS.Girih.EDGE_COUNT = [
    IKRS.Girih.EDGE_COUNT_DECAGON,
    IKRS.Girih.EDGE_COUNT_PENTAGON, 
    IKRS.Girih.EDGE_COUNT_IRREGULAR_HEXAGON,
    IKRS.Girih.EDGE_COUNT_RHOMBUS, 
    IKRS.Girih.EDGE_COUNT_BOW_TIE
];
*/


// Prepare the tile alignment matrix:
// [ actual_tile ] x [ edge_index ] x [ successor_index ] = tile_align
IKRS.Girih.TILE_ALIGN                  = Array();

IKRS.Girih.DEFAULT_EDGE_LENGTH         = 58;

// The decagon has 10 edges
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_DECAGON ] = Array(10);
// Define adjacent tiles allowed on edge 0 of the decagon
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_DECAGON ][0] = [    
    // The decagon has only one possible alignment on the edge (10 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_DECAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 104, -144), 0 ),
    // The pentagon has only one possible alignment on the edge (5 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 75, -104), 0 ),   
    // The irregular hexagon
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 104, -89), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 71, -99), 4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 52, -127), 6*IKRS.Girih.MINIMAL_ANGLE ),
    // The rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 75, -89), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 61, -99), 6*IKRS.Girih.MINIMAL_ANGLE ),
    // The bow tie
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 32, -99), 0 ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 84, -61), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 84, -116), 6*IKRS.Girih.MINIMAL_ANGLE ),
    
    // The Penrose-Rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 83, -73), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 43, -101), 4*IKRS.Girih.MINIMAL_ANGLE )
];
// Note that the decagon has a 5|10-axis symmetry. All other 9 edges behave the same.
for( var i = 1; i < 10; i++ ) {
    IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_DECAGON ][ i ] = [];
    for( var e = 0; e < IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_DECAGON ][0].length; e++ ) {

	var tileAlign = IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_DECAGON ][0][e].clone();
	tileAlign.position.rotate( IKRS.Point2.ZERO_POINT, i*2*IKRS.Girih.MINIMAL_ANGLE );
	tileAlign.angle += i*2*IKRS.Girih.MINIMAL_ANGLE;
	IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_DECAGON ][ i ].push( tileAlign );

    }
}



IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_PENTAGON ] = Array(5);
// Define adjacent tiles allowed on edge 0 of the pentagon
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_PENTAGON ][0] = [  
    // The decagon 
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_DECAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 122, -39.5), 0 ),
    // The pentagon has only one possible alignment on the edge (5 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 75, -24), 2*IKRS.Girih.MINIMAL_ANGLE ),
    // The irregular hexagon
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 88.5, 4.5), 4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 70, -22.5), 6*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 70, -56), 8*IKRS.Girih.MINIMAL_ANGLE ),
    // The rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 66.5, -12.5), 4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 61, -29), 8*IKRS.Girih.MINIMAL_ANGLE ),
    // The bow tie
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 38, -45.5), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 57.5, 15), 4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 89.5, -28.5), 8*IKRS.Girih.MINIMAL_ANGLE ),

    // The Penrose-Rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 61, 4), 4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 47, -39), 6*IKRS.Girih.MINIMAL_ANGLE )
];
// Note that the pentagon has a 5-axis symmetry. All other 4 edges behave the same.
for( var i = 1; i < 5; i++ ) {
    IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_PENTAGON ][ i ] = [];
    for( var e = 0; e < IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_PENTAGON ][0].length; e++ ) {

	var tileAlign = IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_PENTAGON ][0][e].clone();
	tileAlign.position.rotate( IKRS.Point2.ZERO_POINT, i*4*IKRS.Girih.MINIMAL_ANGLE );
	tileAlign.angle += i*4*IKRS.Girih.MINIMAL_ANGLE;
	IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_PENTAGON ][ i ].push( tileAlign );

    }
}


IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ] = Array(6);
// Define adjacent tiles allowed on edge 0 of the pentagon
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ][0] = [  
    // The decagon 
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_DECAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 32, -133.5), 0 ),
    // The pentagon has only one possible alignment on the edge (5 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 32, -84), 2*IKRS.Girih.MINIMAL_ANGLE ),
    // The irregular hexagon
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 64, -88.5), 0 ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 32, -78), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 0.5, -88.5), 4*IKRS.Girih.MINIMAL_ANGLE ),
    // The rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 23.5, -72.5), 4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 41.5, -72.5), 0*IKRS.Girih.MINIMAL_ANGLE ),
    // The bow tie
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 65, -55), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 32.5, -99), 4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 0.5, -55), 8*IKRS.Girih.MINIMAL_ANGLE ),

    // The Penrose-Rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 55, -61), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 9, -61), 2*IKRS.Girih.MINIMAL_ANGLE )
    
];
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ][1] = [ 
    // The decagon 
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_DECAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 136, 10.5), 0 ),
    // The pentagon has only one possible alignment on the edge (5 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 90, -4.5), 4*IKRS.Girih.MINIMAL_ANGLE ),
    // The irregular hexagon
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 104, -33.5), 0 ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 84, -5.5), -2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 84.5, 27.5), -4*IKRS.Girih.MINIMAL_ANGLE ),
    // The rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 81.5, -17), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 76, 0), -4*IKRS.Girih.MINIMAL_ANGLE ),
    // The bow tie
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 71.5, -43.5), -6*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 104, 0), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 52.5, 17), -4*IKRS.Girih.MINIMAL_ANGLE ),

    // The Penrose-Rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 75, -33), -2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 61, 9), -4*IKRS.Girih.MINIMAL_ANGLE )    

];
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ][2] = [  
    // The decagon 
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_DECAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 72, 99), 0 ),
    // The pentagon has only one possible alignment on the edge (5 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 43, 60), 2*IKRS.Girih.MINIMAL_ANGLE ),
    // The irregular hexagon
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 20, 82), -2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 40, 54.5), 0 ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 71, 43.5), 2*IKRS.Girih.MINIMAL_ANGLE ),
    // The rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 29.5, 55), -2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 43, 44.5), 2*IKRS.Girih.MINIMAL_ANGLE ),
    // The bow tie
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 52.5, 17), -4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 52.5, 71.5), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 0.5, 55), 8*IKRS.Girih.MINIMAL_ANGLE ),

    // The Penrose-Rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 11, 55), -2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 49, 28), 0*IKRS.Girih.MINIMAL_ANGLE )   
];
// Note that the hexagon has a 3|6-axis symmetry. All other 3 edges behave the same.
for( var e = 3; e < 6; e++ ) {
    
    IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ][ e ] = [];
    for( var i = 0; i < IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ][ e-3 ].length; i++ ) {

	var tileAlign = IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ][e-3][i].clone();
	tileAlign.position.rotate( IKRS.Point2.ZERO_POINT, 10*IKRS.Girih.MINIMAL_ANGLE );
	tileAlign.angle += 10*IKRS.Girih.MINIMAL_ANGLE;
	if( e == 4 )  // It's a bit unprecise
	    tileAlign.position.x += 2.0;
	else
	    tileAlign.position.x += 1.0;
	IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ][ e ].push( tileAlign );
	
    }
}


IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_RHOMBUS ] = Array(4);
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_RHOMBUS ][0] = [  
    // The decagon 
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_DECAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -9, 116.5), 0*IKRS.Girih.MINIMAL_ANGLE ),
    // The pentagon has only one possible alignment on the edge (5 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -9, 67), 0*IKRS.Girih.MINIMAL_ANGLE ),
    // The irregular hexagon
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -41, 72), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -8.5, 61), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 23, 71.5), 4*IKRS.Girih.MINIMAL_ANGLE ),
    // The rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -18, 55), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 0, 55), 4*IKRS.Girih.MINIMAL_ANGLE ),
    // The bow tie
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -41.5, 38.5), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -9, 82.5), 4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 23, 38.5), 8*IKRS.Girih.MINIMAL_ANGLE ),

    // The Penrose-Rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -32, 45), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 14, 45), 2*IKRS.Girih.MINIMAL_ANGLE )   
];
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_RHOMBUS ][1] = [  
    // The decagon 
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_DECAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -113.5, -27.5), 0*IKRS.Girih.MINIMAL_ANGLE ),
    // The pentagon has only one possible alignment on the edge (5 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -66.5, -12.5), 2*IKRS.Girih.MINIMAL_ANGLE ),
    // The irregular hexagon
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -81, 17), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -61.5, -10.5), -2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -61, -44.5), -4*IKRS.Girih.MINIMAL_ANGLE ),
    // The rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -57.5, 0), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -52.5, -17), 6*IKRS.Girih.MINIMAL_ANGLE ),
    // The bow tie
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -81, -17), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -49, 27.5), 4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -29, -34), 6*IKRS.Girih.MINIMAL_ANGLE ),

    // The Penrose-Rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -52, 16), -2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -38, -27), -4*IKRS.Girih.MINIMAL_ANGLE )   
];
// Note that the rhombus has a 2-axis symmetry. All other 2 edges behave the same.
for( var e = 2; e < 4; e++ ) {
    
    IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_RHOMBUS ][ e ] = [];
    for( var i = 0; i < IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_RHOMBUS ][ e-2 ].length; i++ ) {

	var tileAlign = IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_RHOMBUS ][e-2][i].clone();
	tileAlign.position.rotate( IKRS.Point2.ZERO_POINT, 10*IKRS.Girih.MINIMAL_ANGLE );
	tileAlign.angle += 10*IKRS.Girih.MINIMAL_ANGLE;
	//if( e == 4 )  // It's a bit unprecise
	//    tileAlign.position.x += 2.0;
	//else
	//    tileAlign.position.x += 1.0;
	IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_RHOMBUS ][ e ].push( tileAlign );
	
    }
}


IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_BOW_TIE ] = Array(6);
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_BOW_TIE ][0] = [  
    // The decagon 
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_DECAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 32, -99.5), 0*IKRS.Girih.MINIMAL_ANGLE ),
    // The pentagon has only one possible alignment on the edge (5 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 32, -50.5), 2*IKRS.Girih.MINIMAL_ANGLE ),
    // The irregular hexagon
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 64, -55), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 32, -45), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 0, -55), 4*IKRS.Girih.MINIMAL_ANGLE ),
    // The rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 41, -38), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 23, -38), 4*IKRS.Girih.MINIMAL_ANGLE ),
    // The bow tie
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 64, -21), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 32, -65.5), 4*IKRS.Girih.MINIMAL_ANGLE ),

    // The Penrose-Rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 55, -28), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 9, -28), 2*IKRS.Girih.MINIMAL_ANGLE )   
];
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_BOW_TIE ][1] = [
    // The decagon 
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_DECAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 136, 44.5), 0*IKRS.Girih.MINIMAL_ANGLE ),
    // The pentagon has only one possible alignment on the edge (5 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 90, 29), 0*IKRS.Girih.MINIMAL_ANGLE ),
    // The irregular hexagon
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 104, 0), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 84.5, 27.5), -2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 84.5, 61.5), -4*IKRS.Girih.MINIMAL_ANGLE ),
    // The rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 81, 17), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 75.5, 34), -4*IKRS.Girih.MINIMAL_ANGLE ),
    // The bow tie
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 104, 34), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 72, -10.5), 4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 52, 51), -4*IKRS.Girih.MINIMAL_ANGLE ),

    // The Penrose-Rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 75, 0), -2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 62, 44), -4*IKRS.Girih.MINIMAL_ANGLE ) 
];
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_BOW_TIE ][2] = [
    // The decagon 
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_DECAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -32, 99.5), 0*IKRS.Girih.MINIMAL_ANGLE ),
    // The pentagon has only one possible alignment on the edge (5 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -3.5, 59), 2*IKRS.Girih.MINIMAL_ANGLE ),
    // The irregular hexagon
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 20, 82), 6*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 0, 55), 4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -32, 44.25), 2*IKRS.Girih.MINIMAL_ANGLE ),
    // The rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -3.5, 44.5), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 11, 55), 6*IKRS.Girih.MINIMAL_ANGLE ),
    // The bow tie
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 39.5, 55), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -12, 72), 6*IKRS.Girih.MINIMAL_ANGLE ),

    // The Penrose-Rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -9, 28), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 29, 55), 4*IKRS.Girih.MINIMAL_ANGLE )
];

// Note that the bow tie has a 3|6-axis symmetry. All other 3 edges behave the same.
for( var e = 3; e < 6; e++ ) {
    
    IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_BOW_TIE ][ e ] = [];
    for( var i = 0; i < IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_BOW_TIE ][ e-3 ].length; i++ ) {

	var tileAlign = IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_BOW_TIE ][e-3][i].clone();
	tileAlign.position.rotate( IKRS.Point2.ZERO_POINT, 10*IKRS.Girih.MINIMAL_ANGLE );
	tileAlign.angle += 10*IKRS.Girih.MINIMAL_ANGLE;
	//if( e == 4 )  // It's a bit unprecise
	//    tileAlign.position.x += 2.0;
	//else
	//    tileAlign.position.x += 1.0;
	IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_BOW_TIE ][ e ].push( tileAlign );
	
    }
}


// Note that the bow tie has a 3|6-axis symmetry. All other 3 edges behave the same.
/*
for( var t = 3; t < 6; t++ ) {
    for( var e = 1; e < 6; e++ ) {
	IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ][ t-3 ] = [];
	for( var i = 0; i < IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ][t].length; i++ ) {

	    var tileAlign = IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ][0][e].clone();
	    tileAlign.position.rotate( IKRS.Point2.ZERO_POINT, e*4*IKRS.Girih.MINIMAL_ANGLE );
	    tileAlign.angle += e*4*IKRS.Girih.MINIMAL_ANGLE;
	    IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON ][ e ].push( tileAlign );

	}
    }
}
*/

IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS ] = Array(4);
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS ][0] = [  
    // The decagon -9, 116.5  ........ (-15, -10)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_DECAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -24, 106.5), 0*IKRS.Girih.MINIMAL_ANGLE ),
    // The pentagon has only one possible alignment on the edge (5 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -24, 57), 0*IKRS.Girih.MINIMAL_ANGLE ),
    // The irregular hexagon
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -56, 62), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -23.5, 51), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 8, 61.5), 4*IKRS.Girih.MINIMAL_ANGLE ),
    // The rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -32, 45), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -15, 45), 4*IKRS.Girih.MINIMAL_ANGLE ),
    // The bow tie
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -56.5, 28.5), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -24, 72.5), 4*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( 8, 28.5), 8*IKRS.Girih.MINIMAL_ANGLE ),

    // The Penrose-Rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -47, 35), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -1, 35), 2*IKRS.Girih.MINIMAL_ANGLE )   
];
IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS ][1] = [  
    // The decagon -113.5, -27.5 ......... (32, -45)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_DECAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -81.5, -72.5), 0*IKRS.Girih.MINIMAL_ANGLE ),
    // The pentagon has only one possible alignment on the edge (5 times the same)
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENTAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -52.5, -32.5), 0*IKRS.Girih.MINIMAL_ANGLE ),
    // The irregular hexagon
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -81, -17), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -48.5, -27.5), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_IRREGULAR_HEXAGON, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -81, -17), 2*IKRS.Girih.MINIMAL_ANGLE ),
    // The rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -52.5, -16.5), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -38, -27), 8*IKRS.Girih.MINIMAL_ANGLE ),
    // The bow tie
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -61.5, -44), 2*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -61, 10), 6*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_BOW_TIE, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -9, -27), 8*IKRS.Girih.MINIMAL_ANGLE ),

    // The Penrose-Rhombus
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -59, 0), 0*IKRS.Girih.MINIMAL_ANGLE ),
    new IKRS.TileAlign( IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS, IKRS.Girih.DEFAULT_EDGE_LENGTH, new IKRS.Point2( -20, -27), -2*IKRS.Girih.MINIMAL_ANGLE )   
];
// Note that the rhombus has a 2-axis symmetry. All other 2 edges behave the same.
for( var e = 2; e < 4; e++ ) {
    
    IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS ][ e ] = [];
    for( var i = 0; i < IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS ][ e-2 ].length; i++ ) {

	var tileAlign = IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS ][e-2][i].clone();
	tileAlign.position.rotate( IKRS.Point2.ZERO_POINT, 10*IKRS.Girih.MINIMAL_ANGLE );
	tileAlign.angle += 10*IKRS.Girih.MINIMAL_ANGLE;
	//if( e == 4 )  // It's a bit unprecise
	//    tileAlign.position.x += 2.0;
	//else
	//    tileAlign.position.x += 1.0;
	IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_PENROSE_RHOMBUS ][ e ].push( tileAlign );
	
    }
}

/*
// Note that the decagon has a 5|10-axis symmetry. All other 9 edges behave the same.
for( var t = 0; t < IKRS.Girih.TILE_ALIGN.length; t++ ) {
    for( var e = 1; e < IKRS.Girih.EDGE_COUNT[t]; e++ ) {
	IKRS.Girih.TILE_ALIGN[ t ][ i ] = [];
	for( var j = 0; j < IKRS.Girih.TILE_ALIGN[ t ][0].length; j++ ) {
	    
	    var tileAlign = IKRS.Girih.TILE_ALIGN[ t ][0][j].clone();
	    tileAlign.position.rotate( IKRS.Point2.ZERO_POINT, e*2*IKRS.Girih.MINIMAL_ANGLE );
	    tileAlign.angle += e*2*IKRS.Girih.MINIMAL_ANGLE;
	    IKRS.Girih.TILE_ALIGN[ IKRS.Girih.TILE_TYPE_DECAGON ][ e ].push( tileAlign );
	    
	}
    }
}
*/


IKRS.Girih.prototype.toSVG = function( options,
				       polygonStyle,
				       buffer
				     ) {
    
    var returnBuffer = false;
    if( typeof buffer == "undefined" || !buffer ) {
	buffer = [];
	returnBuffer = true;
    }

    if( typeof options != "undefined" && typeof options.indent != "undefined" )
	buffer.push( options.indent );
    
    buffer.push( "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" );
    buffer.push( "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n" );
    
    buffer.push( "<svg xmlns=\"http://www.w3.org/2000/svg\" \n" );
    buffer.push( "     xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:ev=\"http://www.w3.org/2001/xml-events\" \n" );
    buffer.push( "     version=\"1.1\" baseProfile=\"full\" \n" );
    buffer.push( "     height=\"" );
    buffer.push( options.height );
    buffer.push( "\"" );
    buffer.push( "     width=\"" );
    buffer.push( options.width );
    buffer.push( "\">\n" );
    var oldIndent = options.indent;
    options.indent += "    ";
    for( var i = 0; i < this.tiles.length; i++ ) {
	this.tiles[i].toSVG( options, polygonStyle, buffer );
    }    
    
    options.indent = oldIndent;
    if( typeof options != "undefined" && typeof options.indent != "undefined" )
	buffer.push( options.indent );

    buffer.push( "</svg>\n" );
    
    if( returnBuffer )
	return buffer;
    else
	return buffer.join( "" );
};


IKRS.Girih.prototype.constructor = IKRS.Girih;


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


/**
 * This is a simple Javascript image reader that reads image files from the local
 * file system and applies it to the bezier canvas handler (or any other component
 * that can handle Image objects --- just implement it).
 *
 *
 * Thanks to "Blake Plumb" at 
 *   http://stackoverflow.com/questions/13373834/upload-image-using-javascript
 *
 * @author Ikaros Kappler
 * @date 2014-04-05
 * @version 1.0.0
 **/

ImageFileReader = {

    readTextureImage : function() {
	var imgFile = document.forms["girih_form"].elements["custom_texture_file"];
	ImageFileReader._readImageFile( imgFile,
					function(image) {
					    //alert( "width=" + image.width + ", height=" + image.height );
					    girihCanvasHandler.setTextureImage(image,true); // redraw=true
					}
				      );
    },

    _readImageFile : function( imgFile, successCallback ) {
	
	//window.alert( imgFile );
	
	//var imgFile = document.getElementById('submitfile');	
	if( imgFile.files && imgFile.files[0] ) {
	    var width;
	    var height;
	    var fileSize;
	    var reader = new FileReader();
	    reader.onload = function(event) {
		var dataUri = event.target.result;

		var image = new Image();
		image.onload = function( event ) {
		    //alert( "width=" + this.width + ", height=" + this.height );
		    successCallback( image );
		};
		// This works because the file was read as Data-URL
		image.src = dataUri; 
		
	    };
	    reader.onerror = function(event) {
		console.error("File could not be read! Code " + event.target.error.code);
		window.alert( "File could not be read! Code " + event.target.error.code );
	    };
	    reader.readAsDataURL(imgFile.files[0]);
	}
    }
};
/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/

var girih = new IKRS.Girih();
var girihCanvasHandler = null;
var defaultTextureImage = null;


function onLoad() {
    
    
    // Load girih teplate image
    defaultTextureImage = new Image();
    
    defaultTextureImage.onload = function() {
	girihCanvasHandler = new IKRS.GirihCanvasHandler( defaultTextureImage );
	var tileSize = IKRS.Girih.DEFAULT_EDGE_LENGTH;

	// Make a test penrose-rhombus
	var penrose = new IKRS.Tile.PenroseRhombus( tileSize,
						    new IKRS.Point2(276.5385,49.2873),
						    0.0
					  );
			
	girihCanvasHandler.addTile( penrose );

	_makeTest_Decagon_BowTie( tileSize );
	_makeTest_Pentagon( tileSize );
	_makeTest_IrregularHexagon( tileSize );
	_makeTest_Rhombus( tileSize );
	
	girihCanvasHandler.zoomFactor = 0.75;

	girihCanvasHandler.getDrawProperties().drawBoxes             = false;
	girihCanvasHandler.getDrawProperties().drawOutlines          = false;
	girihCanvasHandler.getDrawProperties().drawTextures          = false;
	girihCanvasHandler.getDrawProperties().drawInnerPolygons     = true;
	girihCanvasHandler.getDrawProperties().outerRandomColorFill  = false;
	girihCanvasHandler.getDrawProperties().innerRandomColorFill  = false; 
	girihCanvasHandler.getDrawProperties().backgroundColor       = "#ffffff";
	
	girihCanvasHandler.getProperties().allowPenroseTile          = true;
			
	girihCanvasHandler.drawOffset.setXY( 200, 200 ); 

	var resizer = function() {
	    resizeCanvas(girihCanvasHandler.canvas,
			 girihCanvasHandler.context,
			 {fullSize:true},
			 function(w,h) {
			     console.log('canvas resized. w='+w+',h='+h);
			     girihCanvasHandler.canvasWidth = w;
			     girihCanvasHandler.canvasHeight = h;
			     girihCanvasHandler.drawOffset.setXY(w/2,h/1.7);
			 }
			);
	    redrawGirih();
	};
	window.addEventListener( 'resize', resizer );
	resizer();
    };
    if( true ) // Load background image at all??? It's not in use in this version
	defaultTextureImage.src = "js/girih_frontpage/img/500px-Girih_tiles.Penrose_compatible_extended.png"; // "500px-Girih_tiles.svg.png";
    else
	defaultTextureImage.onload( null );
    
    
} // END function onLoad

function _displayTileAlign( centerTile,
			    referenceTile
			  ) {

    var differencePoint = new IKRS.Point2( referenceTile.position.x - centerTile.position.x,
					   referenceTile.position.y - centerTile.position.y
					 );
    var totalAngle      = centerTile.angle + referenceTile.angle;
    DEBUG( "[tileAlign] new IKRS.TileAlign( IKRS.Girih.DEFAULT_EDGE_LENGTH,\n" + // " + centerTile.size + ",\n" +
	   "                                new IKRS.Point2( " + differencePoint.x + ", " + differencePoint.y + "),\n" +
	   "                                " + _angle2constant(totalAngle) + " );\n"
	 );
}

function _angle2constant( angle ) {

    var factor = Math.floor( angle/IKRS.Girih.MINIMAL_ANGLE );
    var remainder = angle % IKRS.Girih.MINIMAL_ANGLE;
    
    var result = "";
    if( factor == 0 ) result = "0";
    else              result = factor + "*IKRS.Girih.MINIMAL_ANGLE";

    if( remainder != 0 ) {
	if( factor == 0 )        result = "" + remainder;
	else if( remainder > 0 ) result += " + " + remainder;
	else                     result += " - " + Math.abs(remainder);
    }	

    return result;
}

function _makeTest_Decagon_BowTie( tileSize ) {
    // Make a test decagon
    var deca = new IKRS.Tile.Decagon( tileSize, 
				      new IKRS.Point2(300,300),  // position
				      0.0
				    );
    // Make a test bow-tie
    var tieA = new IKRS.Tile.BowTie( tileSize,
				     new IKRS.Point2(333, 200),  // position
				     0.0
				  );
    var tieB = new IKRS.Tile.BowTie( tileSize,
				     new IKRS.Point2(386, 238),  // position
				     IKRS.Girih.MINIMAL_ANGLE*2
				   );
    var tieC = new IKRS.Tile.BowTie( tileSize,
				     new IKRS.Point2(386, 238),  // position
				     IKRS.Girih.MINIMAL_ANGLE*2
				   );
    var tie = new IKRS.Tile.BowTie( tileSize,
				    new IKRS.Point2(385, 184),  // position
				    0 // IKRS.Girih.MINIMAL_ANGLE*6
				  );
    //tie.position.add( new IKRS.Point2(200, 200) );
    tie.position.setXY( 57.7319, 110.9594 ); // 100, 150 );
    girihCanvasHandler.addTile( deca );
    girihCanvasHandler.addTile( tie );
    
    _displayTileAlign( deca, tie );
}

function _makeTest_Pentagon( tileSize ) {
    // Make a test pentagon
    var penta = new IKRS.Tile.Pentagon( tileSize,
					new IKRS.Point2(479, 52),   // position
					0.0
				      );
    girihCanvasHandler.addTile( penta );
}

function _makeTest_IrregularHexagon( tileSize ) {
    // Make a test pentagon
    var hexa = new IKRS.Tile.IrregularHexagon( tileSize,
						new IKRS.Point2(151.577, -33.4546 ), //161.1, -32.2),   // position
						0.0
					      );
    girihCanvasHandler.addTile( hexa );
}

function _makeTest_Rhombus( tileSize ) {
    // Make a test pentagon
    var rhomb = new IKRS.Tile.Rhombus( tileSize,
					new IKRS.Point2(18.2, 328),   // position
					0.0
				      );
    girihCanvasHandler.addTile( rhomb );
}

function increaseZoom() {
    girihCanvasHandler.zoomFactor *= 1.2;
    redrawGirih();
}

function decreaseZoom() {
    girihCanvasHandler.zoomFactor /= 1.2;
    redrawGirih();
}

function moveLeft() {
    girihCanvasHandler.drawOffset.x += 50; 
    redrawGirih();
}

function moveRight() {
    girihCanvasHandler.drawOffset.x -= 50;
    redrawGirih();
}

function moveUp() {
    girihCanvasHandler.drawOffset.y += 50; 
    redrawGirih();
}

function moveDown() {
    girihCanvasHandler.drawOffset.y -= 50;
    redrawGirih();
}

function rotateLeft() {
    rotateByAmount( -IKRS.Girih.MINIMAL_ANGLE );
}

function rotateRight() {
    rotateByAmount( IKRS.Girih.MINIMAL_ANGLE );
}

function rotateByAmount( amount ) {

    var index     = girihCanvasHandler._locateSelectedTile();
    if( index == -1 ) {
	DEBUG( "No tile selected." );
	return;
    }

    var tile      = girihCanvasHandler.girih.tiles[ index ];
    var rotateAll = document.forms[ "rotation_form" ].elements[ "rotate_all" ].checked; //true;

    if( rotateAll ) {
	for( var i = 0; i < girihCanvasHandler.girih.tiles.length; i++ ) {
	    var tmpTile = girihCanvasHandler.girih.tiles[i];
	    tmpTile.position.rotate( tile.position, amount ); 
	    tmpTile.angle += amount; 
	}
    } else {
	tile.angle += amount; 
    } 
    
    DEBUG( "" + IKRS.Girih.rad2deg(tile.angle) + "&deg;" );
	

    /*
    var first = true;
    for( var i = 0; i < girihCanvasHandler.girih.tiles.length; i++ ) {
	if( girihCanvasHandler.girih.tiles[i]._props.selected ) {
	    girihCanvasHandler.gitih.tiles[i].angle += (IKRS.Girih.MINIMAL_ANGLE);	    
	    if( first )
		document.getElementById("debug").innerHTML = "" + IKRS.Girih.rad2deg(girihCanvasHandler.girih.tiles[i].angle) + "&deg;";
	    first = false;
	}
    }
    */
    redrawGirih();
}

function redrawGirih() {
    
    // Fetch the form settings and apply them to the handler's draw options
    girihCanvasHandler.getDrawProperties().drawBoxes             = false; // document.forms["girih_form"].elements["draw_boxes"].checked;
    girihCanvasHandler.getDrawProperties().drawOutlines          = true; // document.forms["girih_form"].elements["draw_outlines"].checked;
    girihCanvasHandler.getDrawProperties().drawTextures          = false; // document.forms["girih_form"].elements["draw_textures"].checked;
    girihCanvasHandler.getDrawProperties().drawInnerPolygons     = true; // document.forms["girih_form"].elements["draw_inner_polygons"].checked;

    girihCanvasHandler.getDrawProperties().outerRandomColorFill      = false; // document.forms["girih_form"].elements["outer_random_color_fill"].checked;
    girihCanvasHandler.getDrawProperties().innerRandomColorFill      = false; // document.forms["girih_form"].elements["inner_random_color_fill"].checked;

    girihCanvasHandler.getProperties().allowPenroseTile          = true; // document.forms["girih_form"].elements["allow_penrose_tile"].checked;    
    //girihCanvasHandler.getProperties().drawPenroseCenterPolygon  = document.forms["girih_form"].elements["draw_penrose_center_polygon"].checked;

  
    // Then trigger redraw
    girihCanvasHandler.redraw();
}

function DEBUG( msg ) {
    // NOOP
}


window.addEventListener( "load", onLoad );


function exportSVG() {

    var svg = girihCanvasHandler.getSVG( { indent: "" }, // options
					 null            // style
				       );
				      
    
    document.getElementById( "svg_preview" ).innerHTML = svg;

}
