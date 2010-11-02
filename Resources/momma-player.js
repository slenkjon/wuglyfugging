var g6player = {

    player:		null,
    IDName:		'playerID',
    tilesName:		'playerTiles',
    tileWidth:		16,
    tileHeight:		32,
    spriteName:		'playerSprite',
    imageFileName:	'pdulr1t.png',
    rightFrameIndex:	3,
    leftFrameIndex:	2,
    upFrameIndex:	1,
    downFrameIndex:	0,

    clearFn: function() {
    },

    addPlayerFn: function() {
	g6player.player = gbox.addObject( {
	    id: g6player.IDName,
	    group: g6.playerGroupName,
	    tileset: g6player.tilesName,
	    initialize: g6player.initFn,
	    first: g6player.firstFn,
	    blit: g6.standardBlitFn,
	    colh: gbox.getTiles( g6player.tilesName ).tileh,
	    explodeFn: g6player.explodeFn,
	} );
    },

    explodeFn: function() {
	var ox = gbox.getTiles( this.tileset ).tilehh;
	var oy = gbox.getTiles( this.tileset ).tilehw;

	var cx = this.x + ox;
	var cy = this.y + oy;

	g6exp.addExpFn( cx, cy );

	g6.removeGboxObjFn( this );
    },

    initFn: function() {
	toys.topview.initialize( this, {} );
	// !? un-hard-code.
	this.x = 20;
	this.y = 20;
    },

    firstFn: function() {
	toys.topview.controlKeys( this, { left: 'left', right: 'right', up: 'up', down: 'down' } );
	toys.topview.handleAccellerations( this );
	toys.topview.applyForces( this );
	toys.topview.tileCollision( this, g6map.map, 'map', null, { tolerance: 6, approximation: 3 } );

	var collided = toys.topview.findCollision( this, g6.enemyGroupName );
	if( collided !== null ) {
	    this.explodeFn();
	    g6.removeGboxObjFn( this );
	    if( collided.explodeFn ) {
		collided.explodeFn();
	    }
	}

	g6player.firstFrameFn( this );
	g6player.checkShootFn( this );
    },

    firstFrameFn: function( th ) {
	var dbits = g6.getDirectionBitsFn( th );
	if( dbits & g6.kRightBitMask ) {
	    th.frame = g6player.rightFrameIndex;
	}
	if( dbits & g6.kLeftBitMask ) {
	    th.frame = g6player.leftFrameIndex;
	}
	if( dbits & g6.kUpBitMask ) {
	    th.frame = g6player.upFrameIndex;
	}
	if( dbits & g6.kDownBitMask ) {
	    th.frame = g6player.downFrameIndex;
	}
    },

    checkShootFn: function( th ) {
	if( gbox.keyIsHit( 'c' ) ) {
	    
	    // right-handed gun default.
	    var params = {
		dx: 0,
		dy: 0,
		ox: 0,
		oy: 0,
	    };

	    // to get nice diagonals, we have to check direction bits.
	    // but if those are empty then we fall back to frame #.
	    if( g6.getDirectionBitsFn( th ) !== g6.kStillBitMask ) {
		g6player.checkShootFromDirectionFn( th, params );
	    }
	    else {
		g6player.checkShootFromFrameFn( th, params );
	    }

	    g6shot.addShotFn( th.x + params.ox, th.y + params.oy, params.dx, params.dy );
	};
    },

    checkShootFromDirectionFn: function( th, params ) {
	var dbits = g6.getDirectionBitsFn( th );

	if( dbits & g6.kRightBitMask ) {
	    g6player.rightShootFn( th, params );
	}
	else if( dbits & g6.kLeftBitMask ) {
	    g6player.leftShootFn( th, params );
	}

	if( dbits & g6.kUpBitMask ) {
	    g6player.upShootFn( th, params );
	}
	else if( dbits & g6.kDownBitMask ) {
	    g6player.downShootFn( th, params );
	}
    },

    checkShootFromFrameFn: function( th, params ) {
	switch( th.frame ) {
	case g6player.rightFrameIndex:
	    g6player.rightShootFn( th, params );
	    break;
	case g6player.leftFrameIndex:
	    g6player.leftShootFn( th, params );
	    break;
	case g6player.upFrameIndex:
	    g6player.upShootFn( th, params );
	    break;
	case g6player.downFrameIndex:
	    g6player.downShootFn( th, params );
	    break;
	default:
	    alert( "unsupported frame index " + th.frame );
	    break;
	}
    },

    rightShootFn: function( th, params ) {
	params.dx = g6shot.speed;
	params.ox = th.colw;
	params.oy = th.colhh;
    },

    leftShootFn: function( th, params ) {
	params.dx = -g6shot.speed;
	params.oy = th.colhh;
    },

    upShootFn: function( th, params ) {
	params.dy = -g6shot.speed;
	params.ox = th.colw;
    },

    downShootFn: function( th, params ) {
	params.dy = g6shot.speed;
	params.oy = th.colh;
    },

    loadTilesFn: function() {
	gbox.addImage( g6player.spriteName, g6player.imageFileName );
	gbox.addTiles( {
	    id: g6player.tilesName,
	    image: g6player.spriteName,
	    tilew: g6player.tileWidth,
	    tileh: g6player.tileHeight,
	    tilerow: 4,
	    gapx: 0,
	    gapy: 0
	} );
    },

}
