var g6 = {

    name:			'g6',
    mainGameIDName:		'mainGameID',

    canvasParentID:		'game',

    backgroundGroupName:	'backgroundGroup',
    playerGroupName:		'playerGroup',
    enemyGroupName:		'enemyGroup',
    shotGroupName:		'shotGroup',
    explosionGroupName:		'explosionGroup',
    gameGroupName:		'gameGroup',

    kStillBitMask:		0,
    kRightBitMask:		1,
    kDownBitMask:		2,
    kLeftBitMask:		4,
    kUpBitMask:			8,

    mainFn: function() {
	gbox.setGroups( [
	    g6.backgroundGroupName,
	    g6.playerGroupName,
	    g6.enemyGroupName,
	    g6.shotGroupName,
	    g6.explosionGroupName,
	    g6.gameGroupName ] );

	gbox.afterGo = g6.gameOverCheckFn;

	g6.mainGame = gamecycle.createMaingame( g6.mainGameIDName, g6.gameGroupName );

	// disable various intro crap.
	g6.mainGame.gameIntroAnimation = g6.duncleResetFn;
	g6.mainGame.gameTitleIntroAnimation = g6.duncleResetFn;
	g6.mainGame.pressStartIntroAnimation = g6.duncleResetFn;
	g6.mainGame.gameMenu = g6.duncleResetFn;

	g6.mainGame.initializeGame = g6.initializeGameFn;
	g6map.setupMapFn();

	gbox.go();
    },

    duncleResetFn: function( reset ) {
	return true;
    },

    initializeGameFn: function() {
	g6anim.clearFn();
	g6enemy.clearFn();
	g6exp.clearFn();
	g6map.clearFn();
	g6player.clearFn();
	g6shot.clearFn();
	g6util.clearFn();

	g6player.addPlayerFn();
	g6map.addMapFn();
	g6.addEnemiesFn();
    },

    gameOverCheckFn: function() {
	if( gbox.objectIsTrash( g6player.player ) ) {
	    g6.gameOverFailedFn();
	}
	if( g6enemy.liveCount == 0 ) {
	    g6.gameOverWonFn();
	}
    },

    gameOverFailedFn: function() {
	g6.mainGame.setState( 700 );
    },

    gameOverWonFn: function() {
	g6.mainGame.setState( 801 );
    },

    getDirectionBitsFn: function( th ) {
	var directionBits = g6.kStillBitMask;
	if( th.accx > 0 ) { directionBits |= g6.kRightBitMask; }
	if( th.accx < 0 ) { directionBits |= g6.kLeftBitMask; }
	if( th.accy > 0 ) { directionBits |= g6.kDownBitMask; }
	if( th.accy < 0 ) { directionBits |= g6.kUpBitMask; }
	return directionBits;
    },

    addEnemiesFn: function() {

	var spawnMap = g6map.loadSpawn();
	for( var y=0; y < spawnMap.length; y++ ) {
	    var line = spawnMap[y];
	    for( var x=0; x < line.length; x++ ) {
		var c = line[x];
		if( c === g6map.enemy1ID ) {
		    var mx = x * g6map.tileWidth;
		    var my = y * g6map.tileHeight;
		    g6enemy.addEnemyAtFn( mx, my );
		}
	    }
	}

	g6enemy.addEnemyFn();
    },

    removeGboxObjFn: function( th ) {
	th.dx = 0;
	th.dy = 0;
	th.accx = 0;
	th.accy = 0;
	g6.positionOffscreen( th );
	gbox.trashObject( th );
    },

    standardBlitFn: function() {
	if( ! gbox.objectIsTrash( this ) && this.frame >= 0 ) {
	    gbox.blitTile( gbox.getBufferContext(), {
		tileset: this.tileset,
		tile:    this.frame,
		dx:      this.x,
		dy:      this.y,
		fliph:   this.fliph,
		flipv:   this.flipv,
		camera:  this.camera,
		alpha:   1.0
	    });
	}
    },

    positionOffscreen: function( th ) {
	th.x = -42;
	th.y = -42;
    },

    loadResourcesFn: function() {
	gbox.addImage( "logo", "logo.jpg" );
	gbox.addImage( "font", "font.png" );
	gbox.addFont( { id:"small", image:"font", firstletter:" ", tileh:8, tilew:8, tilerow:255, gapx:0, gapy:0 } );
	g6player.loadTilesFn();
	g6map.loadTilesFn();
	g6enemy.loadTilesFn();
	g6shot.loadTilesFn();
	g6exp.loadTilesFn();
    },
}

function g6_gameInitFn() {
    gbox.initScreenParentID = g6.canvasParentID;
    help.akihabaraInit( {
	title: "Your Momma",
	portrait: false,
	splash: { minimalTime: 0 },
	width: 320,
	height: 240,
	zoom: 1
    } );
    g6.loadResourcesFn();
    gbox.loadAll( g6.mainFn );
}

window.addEventListener( 'load', g6_gameInitFn, false );
