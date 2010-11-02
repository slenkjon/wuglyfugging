var g6enemy = {

    speed:		2,
    baseIDName:		'enemyID',
    nextID:		0,
    tilesName:		'enemyTiles',
    tileWidth:		16,
    tileHeight:		16,
    spriteName:		'enemySprite',
    imageFileName:	'enemySprite.png',
    thinkCountInit:	6,
    liveCount:		0,

    clearFn: function() {
	g6enemy.liveCount = 0;
    },

    addEnemyFn: function() {
	g6enemy.addEnemyAtFn( 100, 100 );
    },

    addEnemyAtFn: function( x, y ) {
	var eid = g6enemy.nextID++;
	gbox.addObject( {
	    id: g6enemy.baseIDName + eid,
	    group: g6.enemyGroupName,
	    tileset: g6enemy.tilesName,
	    initialize: g6enemy.initFn,
	    first: g6enemy.firstFn,
	    blit: g6.standardBlitFn,
	    colh: gbox.getTiles( g6enemy.tilesName ).tileh,
	    explodeFn: g6enemy.explodeFn,
	    speed: g6enemy.speed,
	    x: x,
	    y: y,
	} );
	g6enemy.liveCount++;
    },

    initFn: function() {
	toys.topview.initialize( this, {} );
    },

    firstFn: function() {
	if( ! this.thinkCount || this.thinkCount === 0 ) {
	    this.thinkCount = g6.thinkCountInit;

	    // !? un-hard-code player.
	    var dx = g6player.player.x - this.x;
	    var dy = g6player.player.y - this.y;

	    if( dx > 0 ) {
		this.mx = this.speed;
	    }
	    else if( dx < 0 ) {
		this.mx = -this.speed;
	    }
	    if( dy > 0 ) {
		this.my = this.speed;
	    }
	    else if( dy < 0 ) {
		this.my = -this.speed;
	    }
	}
	this.thinkCount--;
	this.x += this.mx;
	this.y += this.my;

	toys.topview.tileCollision( this, g6map.map, 'map', null, { tolerance: 6, approximation: 3 } );
	var collided = toys.topview.findCollision( this, g6.enemyGroupName );
	if( collided !== null && collided !== this ) {
	    this.explodeFn();
	    g6.removeGboxObjFn( this );
	    if( collided.explodeFn ) {
		collided.explodeFn();
	    }
	}
    },

    loadTilesFn: function() {
	gbox.addImage( g6enemy.spriteName, g6enemy.imageFileName );
	gbox.addTiles( {
	    id: g6enemy.tilesName,
	    image: g6enemy.spriteName,
	    tilew: g6enemy.tileWidth,
	    tileh: g6enemy.tileHeight,
	    tilerow: 1,
	    gapx: 0,
	    gapy: 0
	} );
    },

    explodeFn: function() {

	// !?: increment some score.
	// !?: check game over somewhere.

	var ox = gbox.getTiles( this.tileset ).tilehh;
	var oy = gbox.getTiles( this.tileset ).tilehw;

	var cx = this.x + ox;
	var cy = this.y + oy;

	g6exp.addExpFn( cx, cy );

	var dx = Math.floor( g6util.randomCentered( ox*3 ) );
	var dy = Math.floor( g6util.randomCentered( oy*3 ) );
	g6exp.addExpFn( cx + dx, cy + dy, -2 );
	
	var dx2 = Math.floor( g6util.randomCentered( ox*3 ) );
	var dy2 = Math.floor( g6util.randomCentered( oy*3 ) );
	g6exp.addExpFn( cx + dx2, cy + dy2, -4 );

	g6.removeGboxObjFn( this );
	g6enemy.liveCount--;
    },
}
