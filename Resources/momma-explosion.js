// TODO: fix animation bug, duh.

var g6exp = {

    speed:		8,
    baseIDName:		'expID',
    nextID:		0,
    tilesName:		'expTiles',
    tileWidth:		16,
    tileHeight:		16,
    spriteName:		'expSprite',
    imageFileName:	'exAll.png',
    maxFrameIndex:	4, // !? can we calc this via akihabara? suck!
    framePause:		2,

    clearFn: function() {
    },

    addExpFn: function( cx, cy, frameOffset ) {
	var sid = g6exp.nextID++;

	var exp = gbox.addObject( {
	    id: g6exp.baseIDName + sid,
	    group: g6.explosionGroupName,
	    tileset: g6exp.tilesName,
	    initialize: g6exp.initFn,
	    first: g6exp.firstFn,
	    blit: g6.standardBlitFn,
	    frameOffset: frameOffset,
	    colh: gbox.getTiles( g6exp.tilesName ).tileh,
	} );

	exp.x = cx - gbox.getTiles( exp.tileset ).tilehh;
	exp.y = cy - gbox.getTiles( exp.tileset ).tilehw;
    },
    
    initFn: function() {
	toys.topview.initialize( this, {} );
    },

    firstFn: function() {
	if( this.frame >= g6exp.maxFrameIndex ) {
	    g6.removeGboxObjFn( this );
	}
	else {
	    g6anim.updateFrameFn( this, g6exp.framePause, g6exp.maxFrameIndex );
	}
    },

    loadTilesFn: function() {
	gbox.addImage( g6exp.spriteName, g6exp.imageFileName );
	gbox.addTiles( {
	    id: g6exp.tilesName,
	    image: g6exp.spriteName,
	    tilew: g6exp.tileWidth,
	    tileh: g6exp.tileHeight,
	    tilerow: g6exp.maxFrameIndex + 1,
	    gapx: 0,
	    gapy: 0
	} );
    },
}
