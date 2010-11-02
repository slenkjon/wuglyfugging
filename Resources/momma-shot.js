var g6shot = {

    speed:		8,
    baseIDName:		'shotID',
    nextID:		0,
    tilesName:		'shotTiles',
    tileWidth:		8,
    tileHeight:		8,
    spriteName:		'shotSprite',
    imageFileName:	'shotBoth.png',
    maxFrameIndex:	1,
    framePause:		5,

    clearFn: function() {
    },

    addShotFn: function( cx, cy, dx, dy ) {
	var sid = g6shot.nextID++;
	var shot = gbox.addObject( {
	    id: g6shot.baseIDName + sid,
	    group: g6.shotGroupName,
	    tileset: g6shot.tilesName,
	    initialize: g6shot.initFn,
	    first: g6shot.firstFn,
	    blit: g6.standardBlitFn,
	    colh: gbox.getTiles( g6shot.tilesName ).tileh,
	} );
	shot.x = cx - gbox.getTiles( shot.tileset ).tilehh;
	shot.y = cy - gbox.getTiles( shot.tileset ).tilehw;
	shot.dx = dx;
	shot.dy = dy;
    },
    
    initFn: function() {
	toys.topview.initialize( this, {} );
    },

    firstFn: function() {
	this.x += this.dx;
	this.y += this.dy;

	// !?: what a mess of mixed up styles.

	toys.topview.tileCollision( this, g6map.map, 'map', null, { tolerance: 6, approximation: 3 } );
	if( toys.topview.didCollideWithTile( this ) ) {
	    g6.removeGboxObjFn( this );
	}
	else {
	    var collided = toys.topview.findCollision( this, g6.enemyGroupName );
	    if( collided !== null ) {
		g6.removeGboxObjFn( this );
		if( collided.explodeFn ) {
		    collided.explodeFn();
		}
	    }
	    else {
		g6anim.updateFrameFn( this, g6shot.framePause, g6shot.maxFrameIndex );
	    }
	}
    },

    loadTilesFn: function() {
	gbox.addImage( g6shot.spriteName, g6shot.imageFileName );
	gbox.addTiles( {
	    id: g6shot.tilesName,
	    image: g6shot.spriteName,
	    tilew: g6shot.tileWidth,
	    tileh: g6shot.tileHeight,
	    tilerow: g6shot.maxFrameIndex + 1,
	    gapx: 0,
	    gapy: 0
	} );
    },
}
