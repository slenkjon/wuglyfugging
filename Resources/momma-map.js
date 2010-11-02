var g6map = {

    map:		null,
    IDName:		'mapID',
    tilesName:		'mapTiles',
    tileWidth:		16,
    tileHeight:		16,
    spriteName:		'mapSprite',
    imageFileName:	'mapSprite.png',
    canvasName:		'mapCanvas',

    // you /have/ to use space glyph for blank areas,
    // the map code is hard-coded for it.
    spaceID:		null, // that is what akihabara requires :-(
    wallID:		0,
    enemy1ID:		1,
    player1ID:		2,

    clearFn: function() {
    },

    addMapFn: function() {
	gbox.addObject( {
	    id: g6map.IDName,
	    group: g6.backgroundGroupName,
	    blit: g6map.blitFn,
	} );
    },

    blitFn: function() {
	var bc = gbox.getBufferContext();
	var canvas = gbox.getCanvas( g6map.canvasName );

	// this "clear" has to be done by the thing that gets drawn first according
	// to group layers; too bad we can't just associate it directly to a group.
	gbox.blitFade( bc, { alpha: 1, color: 'rgb(128,255,255)' } );

	g6map.cameraFollowPlayer( g6player.player, { w: g6map.map.w, h: g6map.map.h } );

	gbox.blit( bc,
		   canvas, {
		       dx: 0,
		       dy: 0,
		       dw: canvas.width,
		       dh: canvas.height,
		       sourcecamera: true }
		 );
    },

    cameraFollowPlayer: function( obj, viewdata ) {
	xbuf = 100;
	ybuf = 100;
	xcam = gbox.getCamera().x;
	ycam = gbox.getCamera().y;
	if ((obj.x - xcam) > (gbox._screenw - xbuf)) gbox.setCameraX(xcam + (obj.x - xcam) - (gbox._screenw - xbuf), viewdata);
	if ((obj.x - xcam) < (xbuf))                 gbox.setCameraX(xcam + (obj.x - xcam) - xbuf,                   viewdata);
	if ((obj.y - ycam) > (gbox._screenh - ybuf)) gbox.setCameraY(ycam + (obj.y - ycam) - (gbox._screenh - ybuf), viewdata);
	if ((obj.y - ycam) < (ybuf))                 gbox.setCameraY(ycam + (obj.y - ycam) - ybuf,                   viewdata);
    },

    loadTilesFn: function() {
	gbox.addImage( g6map.spriteName, g6map.imageFileName );
	gbox.addTiles( {
	    id: g6map.tilesName,
	    image: g6map.spriteName,
	    tilew: g6map.tileWidth,
	    tileh: g6map.tileHeight,
	    tilerow: 1,
	    gapx: 0,
	    gapy: 0
	} );
    },

    loadMap: function() {
	var key = g6map.getWallKey();
	return g6map.loadAndTranslateMap( key );
    },

    loadSpawn: function() {
	var key = g6map.getSpawnKey();
	return g6map.loadAndTranslateMap( key );
    },

    loadAndTranslateMap: function( key ) {
	var regexp = g6map.getSpacifyRegexp( key );
	var asciiMap = g6map.getAsciiMap( regexp, key );
	var trMap = help.asciiArtToMap( asciiMap, key );
	return trMap;
    },

    getSpacifyRegexp: function( key ) {
	var parts =_.reduce(
	    key,
	    function( m, k ) {
		var c = k[1];
		// you /have/ to use space glyph for blank areas,
		// the map code is hard-coded for it.
		if( c === ' ' ) {
		    return m;
		}
		else {
		    return m + k[1];
		}
	    },
	    ""
	);
	var regexp = "[^" + parts + "]";
	return regexp;
    },

    getWallKey: function() {
	// you /have/ to use space glyph for blank areas,
	// the map code is hard-coded for it.
	return [ [g6map.spaceID, ' '],
		 [g6map.wallID, 'x'] ];
    },

    getSpawnKey: function() {
	// you /have/ to use space glyph for blank areas,
	// the map code is hard-coded for it.
	return [ [g6map.spaceID, ' '],
		 [g6map.player1ID, 'p'],
		 [g6map.enemy1ID, 'r'] ];
    },

    getAsciiMap: function( spacifyRegexp ) {
	// you /have/ to use space glyph for blank areas,
	// the map code is hard-coded for it.
	var asciiMap = [
	    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
	    "x                                                 x",
       	    "x                                                 x",
	    "x                                                 x",
       	    "x           xxxx                                  x",
	    "x              x                                  x",
	    "x           r  x                                  x",
	    "x   x          x                                  x",
	    "x   x          xxxx                               x",
	    "x   x                                             x",
	    "x   x                                             x",
	    "x                                                 x",
	    "x                                                 x",
	    "x                xxx                              x",
	    "x                  x                   x          x",
	    "x   x              x                    x   x     x",
	    "x   x              x      	              x x      x",
	    "x   x              xxxx                   x       x",
       	    "x   x                     	              x        x",
	    "x                                       x         x",
	    "x                                      x          x",
	    "x                                                 x",
	    "x                                                 x",
	    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
	];
	var retainedMap = _.map(
	    asciiMap,
	    function( v, k, l ) {
		var regex = new RegExp( spacifyRegexp, "g" );
		// you /have/ to use space glyph for blank areas,
		// the map code is hard-coded for it.
		var spacified = v.toString().replace( regex, " " );
		return spacified;
	    } );
	return retainedMap;
    },

    setupMapFn: function() {
	var tmpmap = {
	    tileset: g6map.tilesName,
	    map: g6map.loadMap(),
	    tileIsSolid: function( obj, t ) {
		return t !== null;
	    }
	};
	g6map.map = help.finalizeTilemap( tmpmap );
	gbox.createCanvas( g6map.canvasName, {
	    w: g6map.map.w,
	    h: g6map.map.h
	} );
	gbox.blitTilemap( gbox.getCanvasContext( g6map.canvasName ),
			  g6map.map );
    },
}
